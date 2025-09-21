import { Router } from 'express';
import { getDb } from '../db/index.js';
import { logger } from '../utils/logger.js';
import { authorize } from '../middleware/auth.js';
import { sql } from 'drizzle-orm';
import {
  vehicles,
  maintenanceWorkOrders,
  maintenanceHistory,
  users,
  fuelTransactions,
  materialTransactions,
  vehicleStatuses
} from '../db/schema/index.js';

const router = Router();

// Fleet Overview Report
router.get('/fleet-overview', authorize(), async (req, res, next) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;

    // Get fleet statistics
    const [totalVehicles] = await db.select({ count: sql`count(*)`.as('count') })
      .from(vehicles);

    const [activeVehicles] = await db.select({ count: sql`count(*)`.as('count') })
      .from(vehicles)
      .leftJoin(vehicleStatuses, sql`vehicles.status_id = vehicle_statuses.id`)
      .where(sql`vehicle_statuses.status_code = 'active'`);

    const [inMaintenanceVehicles] = await db.select({ count: sql`count(*)`.as('count') })
      .from(vehicles)
      .leftJoin(vehicleStatuses, sql`vehicles.status_id = vehicle_statuses.id`)
      .where(sql`vehicle_statuses.status_code = 'maintenance'`);

    // Vehicle distribution by type
    const vehiclesByType = await db.select({
      type: vehicles.type,
      count: sql`count(*)`.as('count')
    })
    .from(vehicles)
    .groupBy(vehicles.type);

    // Vehicle distribution by year
    const vehiclesByYear = await db.select({
      year: vehicles.year,
      count: sql`count(*)`.as('count')
    })
    .from(vehicles)
    .groupBy(vehicles.year)
    .orderBy(vehicles.year);

    // Average vehicle age
    const currentYear = new Date().getFullYear();
    const [avgAge] = await db.select({
      avgAge: sql`AVG(${currentYear} - year)`.as('avgAge')
    })
    .from(vehicles)
    .where(sql`year IS NOT NULL`);

    res.json({
      success: true,
      data: {
        summary: {
          totalVehicles: Number(totalVehicles.count),
          activeVehicles: Number(activeVehicles.count),
          inMaintenanceVehicles: Number(inMaintenanceVehicles.count),
          avgVehicleAge: Number(avgAge.avgAge || 0).toFixed(1)
        },
        distributions: {
          byType: vehiclesByType.map(v => ({ type: v.type, count: Number(v.count) })),
          byYear: vehiclesByYear.map(v => ({ year: v.year, count: Number(v.count) }))
        }
      }
    });
  } catch (error) {
    logger.error('Error generating fleet overview report:', error);
    next(error);
  }
});

// Maintenance Analytics Report
router.get('/maintenance-analytics', authorize(), async (req, res, next) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;

    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = sql`maintenance_work_orders.created_at BETWEEN ${new Date(startDate as string).getTime()} AND ${new Date(endDate as string).getTime()}`;
    }

    // Work orders by status
    const workOrdersByStatus = await db.select({
      status: maintenanceWorkOrders.status,
      count: sql`count(*)`.as('count')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter)
    .groupBy(maintenanceWorkOrders.status);

    // Work orders by priority
    const workOrdersByPriority = await db.select({
      priority: maintenanceWorkOrders.priority,
      count: sql`count(*)`.as('count')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter)
    .groupBy(maintenanceWorkOrders.priority);

    // Maintenance costs by month
    const costsByMonth = await db.select({
      month: sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`.as('month'),
      totalCost: sql`SUM(estimated_cost)`.as('totalCost'),
      count: sql`count(*)`.as('count')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter)
    .groupBy(sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`)
    .orderBy(sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`);

    // Top vehicles by maintenance frequency
    const topMaintenanceVehicles = await db.select({
      vehicleId: maintenanceWorkOrders.vehicleId,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      workOrderCount: sql`count(*)`.as('workOrderCount'),
      totalCost: sql`SUM(estimated_cost)`.as('totalCost')
    })
    .from(maintenanceWorkOrders)
    .leftJoin(vehicles, sql`vehicles.id = maintenance_work_orders.vehicle_id`)
    .where(dateFilter)
    .groupBy(maintenanceWorkOrders.vehicleId, vehicles.vehicleCode, vehicles.licensePlate)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

    // Average time to completion
    const [avgCompletionTime] = await db.select({
      avgDays: sql`AVG(
        CASE
          WHEN status = 'completed' AND updated_at > created_at
          THEN (updated_at - created_at) / (1000 * 60 * 60 * 24)
          ELSE NULL
        END
      )`.as('avgDays')
    })
    .from(maintenanceWorkOrders)
    .where(sql`${dateFilter} AND status = 'completed'`);

    res.json({
      success: true,
      data: {
        workOrdersByStatus: workOrdersByStatus.map(wo => ({
          status: wo.status,
          count: Number(wo.count)
        })),
        workOrdersByPriority: workOrdersByPriority.map(wo => ({
          priority: wo.priority,
          count: Number(wo.count)
        })),
        costsByMonth: costsByMonth.map(cost => ({
          month: cost.month,
          totalCost: Number(cost.totalCost || 0),
          count: Number(cost.count)
        })),
        topMaintenanceVehicles: topMaintenanceVehicles.map(vehicle => ({
          vehicleId: vehicle.vehicleId,
          vehicleCode: vehicle.vehicleCode,
          licensePlate: vehicle.licensePlate,
          workOrderCount: Number(vehicle.workOrderCount),
          totalCost: Number(vehicle.totalCost || 0)
        })),
        avgCompletionTime: Number(avgCompletionTime.avgDays || 0).toFixed(1)
      }
    });
  } catch (error) {
    logger.error('Error generating maintenance analytics report:', error);
    next(error);
  }
});

// Cost Analysis Report
router.get('/cost-analysis', authorize(), async (req, res, next) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;

    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = sql`maintenance_work_orders.created_at BETWEEN ${new Date(startDate as string).getTime()} AND ${new Date(endDate as string).getTime()}`;
    }

    // Total maintenance costs
    const [totalCosts] = await db.select({
      totalMaintenanceCost: sql`SUM(estimated_cost)`.as('totalMaintenanceCost'),
      totalWorkOrders: sql`count(*)`.as('totalWorkOrders'),
      avgCostPerWorkOrder: sql`AVG(estimated_cost)`.as('avgCostPerWorkOrder')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter);

    // Costs by vehicle
    const costsByVehicle = await db.select({
      vehicleId: vehicles.id,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate,
      totalCost: sql`SUM(estimated_cost)`.as('totalCost'),
      workOrderCount: sql`count(*)`.as('workOrderCount'),
      avgCostPerWorkOrder: sql`AVG(estimated_cost)`.as('avgCostPerWorkOrder')
    })
    .from(maintenanceWorkOrders)
    .leftJoin(vehicles, sql`vehicles.id = maintenance_work_orders.vehicle_id`)
    .where(dateFilter)
    .groupBy(vehicles.id, vehicles.vehicleCode, vehicles.licensePlate)
    .orderBy(sql`SUM(estimated_cost) DESC`);

    // Cost trends by month
    const costTrends = await db.select({
      month: sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`.as('month'),
      totalCost: sql`SUM(estimated_cost)`.as('totalCost'),
      workOrderCount: sql`count(*)`.as('workOrderCount'),
      avgCostPerWorkOrder: sql`AVG(estimated_cost)`.as('avgCostPerWorkOrder')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter)
    .groupBy(sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`)
    .orderBy(sql`strftime('%Y-%m', datetime(maintenance_work_orders.created_at/1000, 'unixepoch'))`);

    res.json({
      success: true,
      data: {
        summary: {
          totalMaintenanceCost: Number(totalCosts.totalMaintenanceCost || 0),
          totalWorkOrders: Number(totalCosts.totalWorkOrders || 0),
          avgCostPerWorkOrder: Number(totalCosts.avgCostPerWorkOrder || 0)
        },
        costsByVehicle: costsByVehicle.map(vehicle => ({
          vehicleId: vehicle.vehicleId,
          vehicleCode: vehicle.vehicleCode,
          licensePlate: vehicle.licensePlate,
          totalCost: Number(vehicle.totalCost || 0),
          workOrderCount: Number(vehicle.workOrderCount),
          avgCostPerWorkOrder: Number(vehicle.avgCostPerWorkOrder || 0)
        })),
        costTrends: costTrends.map(trend => ({
          month: trend.month,
          totalCost: Number(trend.totalCost || 0),
          workOrderCount: Number(trend.workOrderCount),
          avgCostPerWorkOrder: Number(trend.avgCostPerWorkOrder || 0)
        }))
      }
    });
  } catch (error) {
    logger.error('Error generating cost analysis report:', error);
    next(error);
  }
});

// Performance Metrics Report
router.get('/performance-metrics', authorize(), async (req, res, next) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;

    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = sql`maintenance_work_orders.created_at BETWEEN ${new Date(startDate as string).getTime()} AND ${new Date(endDate as string).getTime()}`;
    }

    // Vehicle uptime analysis (vehicles not in maintenance)
    const vehicleUptime = await db.select({
      vehicleId: vehicles.id,
      vehicleCode: vehicles.vehicleCode,
      status: vehicleStatuses.statusCode,
      maintenanceHours: sql`
        CASE
          WHEN vehicle_statuses.status_code = 'maintenance' THEN 24
          ELSE 0
        END
      `.as('maintenanceHours'),
      totalHours: sql`24`.as('totalHours')
    })
    .from(vehicles)
    .leftJoin(vehicleStatuses, sql`vehicles.status_id = vehicle_statuses.id`);

    // Maintenance efficiency (work orders completed vs started)
    const [maintenanceEfficiency] = await db.select({
      completedWorkOrders: sql`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`.as('completedWorkOrders'),
      totalWorkOrders: sql`count(*)`.as('totalWorkOrders'),
      efficiency: sql`
        ROUND(
          (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) * 100.0) / count(*),
          2
        )
      `.as('efficiency')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter);

    // Average response time for different priority levels
    const responseTimesByPriority = await db.select({
      priority: maintenanceWorkOrders.priority,
      avgResponseTime: sql`
        AVG(
          CASE
            WHEN status != 'pending' AND updated_at > created_at
            THEN (updated_at - created_at) / (1000 * 60 * 60)
            ELSE NULL
          END
        )
      `.as('avgResponseTime'),
      count: sql`count(*)`.as('count')
    })
    .from(maintenanceWorkOrders)
    .where(sql`${dateFilter} AND status != 'pending'`)
    .groupBy(maintenanceWorkOrders.priority);

    res.json({
      success: true,
      data: {
        vehicleUptime: vehicleUptime.map(vehicle => ({
          vehicleId: vehicle.vehicleId,
          vehicleCode: vehicle.vehicleCode,
          status: vehicle.status,
          uptimePercentage: ((24 - Number(vehicle.maintenanceHours)) / 24 * 100).toFixed(1)
        })),
        maintenanceEfficiency: {
          completedWorkOrders: Number(maintenanceEfficiency.completedWorkOrders || 0),
          totalWorkOrders: Number(maintenanceEfficiency.totalWorkOrders || 0),
          efficiency: Number(maintenanceEfficiency.efficiency || 0)
        },
        responseTimesByPriority: responseTimesByPriority.map(priority => ({
          priority: priority.priority,
          avgResponseTimeHours: Number(priority.avgResponseTime || 0).toFixed(1),
          count: Number(priority.count)
        }))
      }
    });
  } catch (error) {
    logger.error('Error generating performance metrics report:', error);
    next(error);
  }
});

// Executive Summary Report
router.get('/executive-summary', authorize(), async (req, res, next) => {
  try {
    const db = getDb();
    const { startDate, endDate } = req.query;

    let dateFilter = sql`1=1`;
    if (startDate && endDate) {
      dateFilter = sql`maintenance_work_orders.created_at BETWEEN ${new Date(startDate as string).getTime()} AND ${new Date(endDate as string).getTime()}`;
    }

    // Key performance indicators
    const [fleetKPIs] = await db.select({
      totalVehicles: sql`(SELECT count(*) FROM vehicles)`.as('totalVehicles'),
      activeVehicles: sql`(SELECT count(*) FROM vehicles LEFT JOIN vehicle_statuses ON vehicles.status_id = vehicle_statuses.id WHERE vehicle_statuses.status_code = 'active')`.as('activeVehicles'),
      pendingWorkOrders: sql`(SELECT count(*) FROM maintenance_work_orders WHERE status = 'pending')`.as('pendingWorkOrders'),
      overdueWorkOrders: sql`(SELECT count(*) FROM maintenance_work_orders WHERE status = 'pending' AND scheduled_date < ${Date.now()})`.as('overdueWorkOrders')
    });

    // Financial summary
    const [financialSummary] = await db.select({
      totalMaintenanceCost: sql`SUM(estimated_cost)`.as('totalMaintenanceCost'),
      avgCostPerVehicle: sql`SUM(estimated_cost) / (SELECT count(*) FROM vehicles)`.as('avgCostPerVehicle'),
      completedWorkOrders: sql`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`.as('completedWorkOrders')
    })
    .from(maintenanceWorkOrders)
    .where(dateFilter);

    // Recent trends (last 30 days vs previous 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);

    const [recentTrends] = await db.select({
      recentWorkOrders: sql`SUM(CASE WHEN created_at >= ${thirtyDaysAgo} THEN 1 ELSE 0 END)`.as('recentWorkOrders'),
      previousWorkOrders: sql`SUM(CASE WHEN created_at >= ${sixtyDaysAgo} AND created_at < ${thirtyDaysAgo} THEN 1 ELSE 0 END)`.as('previousWorkOrders'),
      recentCosts: sql`SUM(CASE WHEN created_at >= ${thirtyDaysAgo} THEN estimated_cost ELSE 0 END)`.as('recentCosts'),
      previousCosts: sql`SUM(CASE WHEN created_at >= ${sixtyDaysAgo} AND created_at < ${thirtyDaysAgo} THEN estimated_cost ELSE 0 END)`.as('previousCosts')
    })
    .from(maintenanceWorkOrders);

    res.json({
      success: true,
      data: {
        kpis: {
          totalVehicles: Number(fleetKPIs.totalVehicles || 0),
          activeVehicles: Number(fleetKPIs.activeVehicles || 0),
          fleetUtilization: Number(fleetKPIs.activeVehicles || 0) / Math.max(Number(fleetKPIs.totalVehicles || 1), 1) * 100,
          pendingWorkOrders: Number(fleetKPIs.pendingWorkOrders || 0),
          overdueWorkOrders: Number(fleetKPIs.overdueWorkOrders || 0)
        },
        financial: {
          totalMaintenanceCost: Number(financialSummary.totalMaintenanceCost || 0),
          avgCostPerVehicle: Number(financialSummary.avgCostPerVehicle || 0),
          completedWorkOrders: Number(financialSummary.completedWorkOrders || 0)
        },
        trends: {
          workOrderChange: ((Number(recentTrends.recentWorkOrders || 0) - Number(recentTrends.previousWorkOrders || 0)) / Math.max(Number(recentTrends.previousWorkOrders || 1), 1) * 100).toFixed(1),
          costChange: ((Number(recentTrends.recentCosts || 0) - Number(recentTrends.previousCosts || 0)) / Math.max(Number(recentTrends.previousCosts || 1), 1) * 100).toFixed(1)
        }
      }
    });
  } catch (error) {
    logger.error('Error generating executive summary report:', error);
    next(error);
  }
});

export default router;