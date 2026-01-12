/**
 * Chat Tools - Pre-defined database query functions for the AI assistant
 * Includes API access tool for calling internal endpoints
 */

import { eq, and, desc, sql, gte, lte, count, sum, avg } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { vehicles } from '../db/schema/vehicles.js';
import { drivers } from '../db/schema/drivers.js';
import { fuelTransactions, fuelTypes, fuelStations } from '../db/schema/fuel.js';
import { maintenanceHistory, maintenanceWorkOrders } from '../db/schema/maintenance.js';
import { brands, models, vehicleTypes, vehicleStatuses } from '../db/schema/system.js';
import type { Tool } from './llm.js';
import { logger } from '../utils/logger.js';

// API Documentation Registry - describes available endpoints for the AI
export const apiEndpointRegistry = {
  // Dashboard
  'GET /api/dashboard': 'Get dashboard summary with stats for vehicles, fuel, maintenance',
  'GET /api/dashboard/fuel-stats': 'Get fuel statistics for dashboard charts',
  'GET /api/dashboard/maintenance-stats': 'Get maintenance statistics',

  // Vehicles
  'GET /api/vehicles': 'List all vehicles with pagination, filtering by status, type, brand',
  'GET /api/vehicles/:id': 'Get detailed info about a specific vehicle by ID',
  'GET /api/vehicles/:id/fuel-history': 'Get fuel transaction history for a vehicle',
  'GET /api/vehicles/:id/maintenance-history': 'Get maintenance history for a vehicle',
  'GET /api/vehicles/:id/documents': 'Get documents attached to a vehicle',

  // Drivers
  'GET /api/drivers': 'List all drivers with optional filtering',
  'GET /api/drivers/:id': 'Get detailed info about a specific driver',
  'GET /api/drivers/active': 'Get list of active drivers',

  // Fuel
  'GET /api/fuel/transactions': 'List fuel transactions with filtering by date, vehicle, type',
  'GET /api/fuel/types': 'Get list of fuel types',
  'GET /api/fuel/stations': 'Get list of fuel stations',
  'GET /api/fuel/budgets': 'Get fuel budgets',
  'GET /api/fuel/statistics': 'Get fuel consumption statistics',

  // Maintenance
  'GET /api/maintenance/history': 'Get maintenance history records',
  'GET /api/maintenance/work-orders': 'Get maintenance work orders',
  'GET /api/maintenance/schedules': 'Get maintenance schedules',
  'GET /api/maintenance/upcoming': 'Get upcoming maintenance items',

  // Materials/Warehouse
  'GET /api/materials': 'Get materials inventory',
  'GET /api/materials/categories': 'Get material categories',
  'GET /api/materials/transfers': 'Get material transfer requests',

  // Reports
  'GET /api/reports/fuel': 'Generate fuel consumption report',
  'GET /api/reports/maintenance': 'Generate maintenance report',
  'GET /api/reports/fleet': 'Generate fleet overview report',

  // System/Reference Data
  'GET /api/system/brands': 'Get vehicle brands',
  'GET /api/system/models': 'Get vehicle models (filter by brandId)',
  'GET /api/system/vehicle-types': 'Get vehicle types',
  'GET /api/system/vehicle-statuses': 'Get vehicle statuses',
  'GET /api/system/cities': 'Get cities',
  'GET /api/system/suppliers': 'Get suppliers',

  // Admin
  'GET /api/admin/stats': 'Get admin statistics overview',
  'GET /api/admin/users': 'Get user list (admin only)',
};

// Tool definitions for the LLM
export const chatTools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'get_fleet_overview',
      description: 'Get an overview of the entire fleet including total vehicles, active vehicles, and vehicle counts by type/status',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_vehicle_details',
      description: 'Get detailed information about a specific vehicle by license plate or vehicle code',
      parameters: {
        type: 'object',
        properties: {
          identifier: {
            type: 'string',
            description: 'The license plate or vehicle code to search for',
          },
        },
        required: ['identifier'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_fuel_statistics',
      description: 'Get fuel consumption statistics for the fleet or a specific vehicle',
      parameters: {
        type: 'object',
        properties: {
          vehicleId: {
            type: 'string',
            description: 'Optional vehicle ID to filter by',
          },
          period: {
            type: 'string',
            description: 'Time period: "today", "week", "month", "year", or "all"',
            enum: ['today', 'week', 'month', 'year', 'all'],
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_top_fuel_consumers',
      description: 'Get the vehicles with highest fuel consumption',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'string',
            description: 'Number of vehicles to return (default: 10)',
          },
          period: {
            type: 'string',
            description: 'Time period: "week", "month", "year"',
            enum: ['week', 'month', 'year'],
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_maintenance_due',
      description: 'Get vehicles that have maintenance due soon or are overdue',
      parameters: {
        type: 'object',
        properties: {
          daysAhead: {
            type: 'string',
            description: 'Number of days to look ahead (default: 30)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_recent_fuel_transactions',
      description: 'Get the most recent fuel transactions',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'string',
            description: 'Number of transactions to return (default: 10)',
          },
          vehicleId: {
            type: 'string',
            description: 'Optional vehicle ID to filter by',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_driver_list',
      description: 'Get list of drivers, optionally filtered by status',
      parameters: {
        type: 'object',
        properties: {
          active: {
            type: 'string',
            description: 'Filter by active status: "true", "false", or "all"',
            enum: ['true', 'false', 'all'],
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_vehicles',
      description: 'Search for vehicles by license plate, code, or brand',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (license plate, code, or brand name)',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_fuel_cost_by_period',
      description: 'Get total fuel costs grouped by month or week',
      parameters: {
        type: 'object',
        properties: {
          groupBy: {
            type: 'string',
            description: 'Group by "month" or "week"',
            enum: ['month', 'week'],
          },
          months: {
            type: 'string',
            description: 'Number of months to look back (default: 6)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_vehicle_count_by_status',
      description: 'Get count of vehicles grouped by their status',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  // API Access Tools
  {
    type: 'function',
    function: {
      name: 'list_api_endpoints',
      description: 'Get a list of all available API endpoints that can be called. Use this to discover what data you can access.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category: "vehicles", "drivers", "fuel", "maintenance", "materials", "reports", "system", "dashboard", "admin", or "all"',
            enum: ['vehicles', 'drivers', 'fuel', 'maintenance', 'materials', 'reports', 'system', 'dashboard', 'admin', 'all'],
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'call_api',
      description: 'Call an internal API endpoint to get data. Use list_api_endpoints first to see available endpoints. Supports GET requests with query parameters.',
      parameters: {
        type: 'object',
        properties: {
          endpoint: {
            type: 'string',
            description: 'The API endpoint path (e.g., "/api/vehicles", "/api/fuel/transactions"). Use list_api_endpoints to see available endpoints.',
          },
          params: {
            type: 'string',
            description: 'JSON string of query parameters (e.g., \'{"limit": 10, "status": "active"}\' or \'{"vehicleId": 5}\')',
          },
        },
        required: ['endpoint'],
      },
    },
  },
];

// Helper to get date range based on period
function getDateRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  let start: Date;

  switch (period) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(0); // Beginning of time
  }

  return { start, end };
}

// Tool implementations
export const toolImplementations: Record<string, (args: Record<string, string>) => Promise<string>> = {
  async get_fleet_overview() {
    const db = getDb();

    const [totalVehicles] = await db.select({ count: count() }).from(vehicles);
    const [activeVehicles] = await db.select({ count: count() }).from(vehicles).where(eq(vehicles.active, true));

    const vehiclesByType = await db.select({
      type: vehicleTypes.typeName,
      count: count(),
    })
    .from(vehicles)
    .leftJoin(vehicleTypes, eq(vehicles.vehicleTypeId, vehicleTypes.id))
    .groupBy(vehicleTypes.typeName);

    const vehiclesByStatus = await db.select({
      status: vehicleStatuses.statusName,
      count: count(),
    })
    .from(vehicles)
    .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
    .groupBy(vehicleStatuses.statusName);

    return JSON.stringify({
      totalVehicles: totalVehicles.count,
      activeVehicles: activeVehicles.count,
      inactiveVehicles: totalVehicles.count - activeVehicles.count,
      byType: vehiclesByType.map(v => ({ type: v.type || 'Unknown', count: v.count })),
      byStatus: vehiclesByStatus.map(v => ({ status: v.status || 'Unknown', count: v.count })),
    });
  },

  async get_vehicle_details(args) {
    const db = getDb();
    const identifier = args.identifier?.toUpperCase() || '';

    const [vehicle] = await db.select({
      id: vehicles.id,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      chassisNumber: vehicles.chassisNumber,
      engineNumber: vehicles.engineNumber,
      year: vehicles.year,
      odometer: vehicles.odometer,
      active: vehicles.active,
      brand: brands.brandName,
      model: models.modelName,
      type: vehicleTypes.typeName,
      status: vehicleStatuses.statusName,
    })
    .from(vehicles)
    .leftJoin(brands, eq(vehicles.brandId, brands.id))
    .leftJoin(models, eq(vehicles.modelId, models.id))
    .leftJoin(vehicleTypes, eq(vehicles.vehicleTypeId, vehicleTypes.id))
    .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
    .where(
      sql`UPPER(${vehicles.licensePlate}) = ${identifier} OR UPPER(${vehicles.vehicleCode}) = ${identifier}`
    )
    .limit(1);

    if (!vehicle) {
      return JSON.stringify({ error: 'Vehicle not found', searchedFor: identifier });
    }

    // Get fuel stats for this vehicle
    const [fuelStats] = await db.select({
      totalQuantity: sum(fuelTransactions.quantity),
      totalCost: sum(fuelTransactions.totalAmount),
      transactionCount: count(),
    })
    .from(fuelTransactions)
    .where(eq(fuelTransactions.vehicleId, vehicle.id));

    return JSON.stringify({
      ...vehicle,
      fuelStats: {
        totalLiters: Number(fuelStats.totalQuantity) || 0,
        totalCost: Number(fuelStats.totalCost) || 0,
        transactionCount: fuelStats.transactionCount,
      },
    });
  },

  async get_fuel_statistics(args) {
    const db = getDb();
    const period = args.period || 'month';
    const { start, end } = getDateRange(period);

    let conditions = [
      gte(fuelTransactions.transactionDate, start),
      lte(fuelTransactions.transactionDate, end),
    ];

    if (args.vehicleId) {
      conditions.push(eq(fuelTransactions.vehicleId, parseInt(args.vehicleId)));
    }

    const [stats] = await db.select({
      totalTransactions: count(),
      totalQuantity: sum(fuelTransactions.quantity),
      totalCost: sum(fuelTransactions.totalAmount),
      avgPricePerLiter: avg(fuelTransactions.pricePerUnit),
    })
    .from(fuelTransactions)
    .where(and(...conditions));

    const byFuelType = await db.select({
      fuelType: fuelTypes.fuelName,
      quantity: sum(fuelTransactions.quantity),
      cost: sum(fuelTransactions.totalAmount),
    })
    .from(fuelTransactions)
    .leftJoin(fuelTypes, eq(fuelTransactions.fuelTypeId, fuelTypes.id))
    .where(and(...conditions))
    .groupBy(fuelTypes.fuelName);

    return JSON.stringify({
      period,
      dateRange: { start: start.toISOString(), end: end.toISOString() },
      totalTransactions: stats.totalTransactions,
      totalLiters: Number(stats.totalQuantity) || 0,
      totalCost: Number(stats.totalCost) || 0,
      avgPricePerLiter: Number(stats.avgPricePerLiter)?.toFixed(2) || 0,
      byFuelType: byFuelType.map(f => ({
        type: f.fuelType || 'Unknown',
        liters: Number(f.quantity) || 0,
        cost: Number(f.cost) || 0,
      })),
    });
  },

  async get_top_fuel_consumers(args) {
    const db = getDb();
    const limit = parseInt(args.limit || '10');
    const period = args.period || 'month';
    const { start, end } = getDateRange(period);

    const topConsumers = await db.select({
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      totalQuantity: sum(fuelTransactions.quantity),
      totalCost: sum(fuelTransactions.totalAmount),
      transactionCount: count(),
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .where(and(
      gte(fuelTransactions.transactionDate, start),
      lte(fuelTransactions.transactionDate, end),
    ))
    .groupBy(vehicles.id, vehicles.vehicleCode, vehicles.licensePlate)
    .orderBy(desc(sum(fuelTransactions.quantity)))
    .limit(limit);

    return JSON.stringify({
      period,
      topConsumers: topConsumers.map((v, i) => ({
        rank: i + 1,
        vehicleCode: v.vehicleCode,
        licensePlate: v.licensePlate,
        totalLiters: Number(v.totalQuantity)?.toFixed(2) || 0,
        totalCost: Number(v.totalCost)?.toFixed(2) || 0,
        transactions: v.transactionCount,
      })),
    });
  },

  async get_maintenance_due(args) {
    const db = getDb();
    const daysAhead = parseInt(args.daysAhead || '30');

    // Get vehicles with upcoming maintenance based on next service date
    const vehiclesWithMaintenance = await db.select({
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      brand: brands.brandName,
      model: models.modelName,
    })
    .from(vehicles)
    .leftJoin(brands, eq(vehicles.brandId, brands.id))
    .leftJoin(models, eq(vehicles.modelId, models.id))
    .where(eq(vehicles.active, true))
    .limit(20);

    // Get recent maintenance history
    const recentMaintenance = await db.select({
      vehicleId: maintenanceHistory.vehicleId,
      maintenanceDate: maintenanceHistory.maintenanceDate,
      workPerformed: maintenanceHistory.workPerformed,
    })
    .from(maintenanceHistory)
    .orderBy(desc(maintenanceHistory.maintenanceDate))
    .limit(10);

    // Get pending work orders
    const pendingWorkOrders = await db.select({
      vehicleId: maintenanceWorkOrders.vehicleId,
      title: maintenanceWorkOrders.title,
      status: maintenanceWorkOrders.status,
      scheduledDate: maintenanceWorkOrders.scheduledDate,
      priority: maintenanceWorkOrders.priority,
    })
    .from(maintenanceWorkOrders)
    .where(sql`${maintenanceWorkOrders.status} IN ('pending', 'scheduled', 'in_progress')`)
    .orderBy(maintenanceWorkOrders.scheduledDate)
    .limit(10);

    return JSON.stringify({
      daysAhead,
      vehiclesChecked: vehiclesWithMaintenance.length,
      pendingWorkOrders: pendingWorkOrders.map(w => ({
        vehicleId: w.vehicleId,
        title: w.title,
        status: w.status,
        scheduledDate: w.scheduledDate,
        priority: w.priority,
      })),
      recentMaintenanceHistory: recentMaintenance.map(m => ({
        vehicleId: m.vehicleId,
        date: m.maintenanceDate,
        workPerformed: m.workPerformed,
      })),
      note: 'For detailed maintenance scheduling, please check the maintenance module.',
    });
  },

  async get_recent_fuel_transactions(args) {
    const db = getDb();
    const limit = parseInt(args.limit || '10');

    let query = db.select({
      id: fuelTransactions.id,
      date: fuelTransactions.transactionDate,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      fuelType: fuelTypes.fuelName,
      quantity: fuelTransactions.quantity,
      totalCost: fuelTransactions.totalAmount,
      station: fuelStations.stationName,
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .leftJoin(fuelTypes, eq(fuelTransactions.fuelTypeId, fuelTypes.id))
    .leftJoin(fuelStations, eq(fuelTransactions.locationId, fuelStations.id))
    .orderBy(desc(fuelTransactions.transactionDate))
    .limit(limit);

    if (args.vehicleId) {
      query = query.where(eq(fuelTransactions.vehicleId, parseInt(args.vehicleId))) as typeof query;
    }

    const transactions = await query;

    return JSON.stringify({
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        vehicle: `${t.licensePlate} (${t.vehicleCode})`,
        fuelType: t.fuelType || 'Unknown',
        liters: Number(t.quantity)?.toFixed(2),
        cost: Number(t.totalCost)?.toFixed(2),
        station: t.station || 'Unknown',
      })),
    });
  },

  async get_driver_list(args) {
    const db = getDb();
    const activeFilter = args.active;

    let query = db.select({
      id: drivers.id,
      driverCode: drivers.driverCode,
      fullName: drivers.fullName,
      phoneNumber: drivers.phoneNumber,
      licenseNumber: drivers.licenseNumber,
      active: drivers.active,
    })
    .from(drivers)
    .orderBy(drivers.fullName);

    if (activeFilter === 'true') {
      query = query.where(eq(drivers.active, true)) as typeof query;
    } else if (activeFilter === 'false') {
      query = query.where(eq(drivers.active, false)) as typeof query;
    }

    const driverList = await query.limit(50);

    return JSON.stringify({
      total: driverList.length,
      drivers: driverList.map(d => ({
        code: d.driverCode,
        name: d.fullName,
        phone: d.phoneNumber,
        license: d.licenseNumber,
        active: d.active,
      })),
    });
  },

  async search_vehicles(args) {
    const db = getDb();
    const query = args.query?.toUpperCase() || '';

    const results = await db.select({
      id: vehicles.id,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      brand: brands.brandName,
      model: models.modelName,
      year: vehicles.year,
      active: vehicles.active,
    })
    .from(vehicles)
    .leftJoin(brands, eq(vehicles.brandId, brands.id))
    .leftJoin(models, eq(vehicles.modelId, models.id))
    .where(
      sql`UPPER(${vehicles.licensePlate}) LIKE ${'%' + query + '%'}
          OR UPPER(${vehicles.vehicleCode}) LIKE ${'%' + query + '%'}
          OR UPPER(${brands.brandName}) LIKE ${'%' + query + '%'}`
    )
    .limit(20);

    return JSON.stringify({
      query: args.query,
      resultsCount: results.length,
      vehicles: results.map(v => ({
        id: v.id,
        code: v.vehicleCode,
        plate: v.licensePlate,
        brand: v.brand || 'Unknown',
        model: v.model || 'Unknown',
        year: v.year,
        active: v.active,
      })),
    });
  },

  async get_fuel_cost_by_period(args) {
    const db = getDb();
    const groupBy = args.groupBy || 'month';
    const months = parseInt(args.months || '6');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-W%W';

    const costs = await db.select({
      period: sql<string>`strftime('${sql.raw(dateFormat)}', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`,
      totalCost: sum(fuelTransactions.totalAmount),
      totalQuantity: sum(fuelTransactions.quantity),
      transactionCount: count(),
    })
    .from(fuelTransactions)
    .where(gte(fuelTransactions.transactionDate, startDate))
    .groupBy(sql`strftime('${sql.raw(dateFormat)}', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`)
    .orderBy(sql`strftime('${sql.raw(dateFormat)}', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`);

    return JSON.stringify({
      groupBy,
      monthsBack: months,
      data: costs.map(c => ({
        period: c.period,
        cost: Number(c.totalCost)?.toFixed(2) || 0,
        liters: Number(c.totalQuantity)?.toFixed(2) || 0,
        transactions: c.transactionCount,
      })),
    });
  },

  async get_vehicle_count_by_status() {
    const db = getDb();

    const counts = await db.select({
      status: vehicleStatuses.statusName,
      statusCode: vehicleStatuses.statusCode,
      count: count(),
    })
    .from(vehicles)
    .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
    .groupBy(vehicleStatuses.id, vehicleStatuses.statusName, vehicleStatuses.statusCode);

    const total = counts.reduce((sum, c) => sum + c.count, 0);

    return JSON.stringify({
      total,
      byStatus: counts.map(c => ({
        status: c.status || 'Unknown',
        code: c.statusCode || 'UNKNOWN',
        count: c.count,
        percentage: ((c.count / total) * 100).toFixed(1) + '%',
      })),
    });
  },

  // API Access Tool Implementations
  async list_api_endpoints(args) {
    const category = args.category || 'all';

    const categoryMap: Record<string, string[]> = {
      dashboard: ['dashboard'],
      vehicles: ['vehicles'],
      drivers: ['drivers'],
      fuel: ['fuel'],
      maintenance: ['maintenance'],
      materials: ['materials'],
      reports: ['reports'],
      system: ['system'],
      admin: ['admin'],
    };

    const endpoints: Record<string, string> = {};

    for (const [endpoint, description] of Object.entries(apiEndpointRegistry)) {
      if (category === 'all') {
        endpoints[endpoint] = description;
      } else {
        const categories = categoryMap[category] || [];
        if (categories.some(cat => endpoint.toLowerCase().includes(cat))) {
          endpoints[endpoint] = description;
        }
      }
    }

    return JSON.stringify({
      category,
      endpointCount: Object.keys(endpoints).length,
      endpoints,
      note: 'Use call_api with the endpoint path to fetch data. Replace :id with actual IDs.',
    });
  },

  async call_api(args) {
    const endpoint = args.endpoint || '';
    let params: Record<string, string> = {};

    // Parse params if provided
    if (args.params) {
      try {
        params = JSON.parse(args.params);
      } catch {
        return JSON.stringify({ error: 'Invalid params JSON format' });
      }
    }

    // Validate endpoint starts with /api/
    if (!endpoint.startsWith('/api/')) {
      return JSON.stringify({
        error: 'Invalid endpoint. Must start with /api/',
        example: '/api/vehicles or /api/fuel/transactions',
      });
    }

    // Security: Only allow read operations (GET endpoints)
    // Prevent access to sensitive endpoints
    const blockedEndpoints = ['/api/auth', '/api/llm-settings', '/api/chat'];
    if (blockedEndpoints.some(blocked => endpoint.startsWith(blocked))) {
      return JSON.stringify({
        error: 'Access to this endpoint is not allowed for the assistant',
        endpoint,
      });
    }

    try {
      // Build URL with query parameters
      const baseUrl = process.env.API_INTERNAL_URL || 'http://localhost:3000';
      const url = new URL(endpoint, baseUrl);

      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, String(value));
      }

      logger.info(`Chat API call: ${url.toString()}`);

      // Make internal API request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Use internal service authentication
          'X-Internal-Service': 'chat-assistant',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return JSON.stringify({
          error: `API request failed: ${response.status}`,
          details: errorText.slice(0, 500),
          endpoint,
        });
      }

      const data = await response.json() as Record<string, unknown>;

      // Limit response size for LLM context
      const jsonStr = JSON.stringify(data);
      if (jsonStr.length > 50000) {
        // If response is too large, try to extract just the data array
        if (data.data && Array.isArray(data.data)) {
          const dataArray = data.data as unknown[];
          const limitedData = {
            ...data,
            data: dataArray.slice(0, 50),
            _truncated: true,
            _totalCount: dataArray.length,
            _note: 'Response truncated to 50 items. Use pagination params for more.',
          };
          return JSON.stringify(limitedData);
        }
        return JSON.stringify({
          error: 'Response too large',
          note: 'Try using limit parameter or filtering by specific criteria',
          endpoint,
        });
      }

      return jsonStr;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Chat API call failed: ${errorMessage}`, { endpoint, params });
      return JSON.stringify({
        error: `API call failed: ${errorMessage}`,
        endpoint,
      });
    }
  },
};

// Sanitize arguments - remove empty strings, null values
function sanitizeArgs(args: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(args)) {
    // Skip null, undefined, and empty strings
    if (value === null || value === undefined || value === '') {
      continue;
    }
    // Convert to string
    sanitized[key] = String(value);
  }
  return sanitized;
}

// Execute a tool by name
export async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  const impl = toolImplementations[name];
  if (!impl) {
    return JSON.stringify({ error: `Unknown tool: ${name}` });
  }

  try {
    // Sanitize arguments before passing to implementation
    const sanitizedArgs = sanitizeArgs(args);
    return await impl(sanitizedArgs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({ error: `Tool execution failed: ${errorMessage}` });
  }
}
