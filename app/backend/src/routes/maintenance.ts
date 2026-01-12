import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc, sql, gte, lte, like, or, isNull } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import {
  maintenanceTypes,
  maintenanceSchedules,
  maintenanceWorkOrders,
  maintenanceParts,
  maintenanceLabor,
  maintenanceHistory,
  maintenanceAlerts,
  inspectionChecklists,
  vehicleInspections,
  vehicles,
  drivers
} from '../db/schema/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(authenticate);

// Validation schemas
const maintenanceTypeSchema = z.object({
  typeCode: z.string().min(1).max(50),
  typeName: z.string().min(1).max(100),
  category: z.enum(['preventive', 'corrective', 'emergency', 'inspection']),
  description: z.string().optional(),
  estimatedDuration: z.number().optional(),
  estimatedCost: z.number().optional(),
  priority: z.number().min(1).max(5).default(3),
});

const workOrderSchema = z.object({
  vehicleId: z.number().positive(),
  maintenanceTypeId: z.number().positive().optional(),
  typeId: z.number().positive().optional(), // Frontend compatibility
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priority: z.union([
    z.number().min(1).max(5),
    z.string().transform(val => {
      // Handle string priority values like 'low', 'medium', 'high'
      const priorityMap: Record<string, number> = {
        'low': 1, 'medium': 3, 'high': 5,
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
      };
      return priorityMap[val.toLowerCase()] || 3;
    })
  ]).default(3),
  status: z.string().optional(),
  scheduledDate: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  vendor: z.string().optional(),
  estimatedCost: z.number().optional(),
  odometerReading: z.number().optional(),
  engineHours: z.number().optional(),
  notes: z.string().optional(),
}).refine(data => data.maintenanceTypeId || data.typeId, {
  message: "Either 'maintenanceTypeId' or 'typeId' is required"
}).transform((data) => {
  // Normalize field names and set defaults
  const { typeId, ...rest } = data;
  return {
    ...rest,
    maintenanceTypeId: data.maintenanceTypeId || typeId,
    title: data.title || `Maintenance Work Order`,
    status: data.status || 'pending',
  };
});

// Maintenance Types endpoints
router.get('/types', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { category, active } = req.query;

    let query = db.select().from(maintenanceTypes);

    const conditions = [];
    if (category) conditions.push(eq(maintenanceTypes.category, category as string));
    if (active !== undefined) conditions.push(eq(maintenanceTypes.active, active === 'true'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(asc(maintenanceTypes.priority), asc(maintenanceTypes.typeName));
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error fetching maintenance types:', error);
    next(error);
  }
});

router.post('/types', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const data = maintenanceTypeSchema.parse(req.body);
    const db = getDb();

    const [existing] = await db.select()
      .from(maintenanceTypes)
      .where(eq(maintenanceTypes.typeCode, data.typeCode))
      .limit(1);

    if (existing) {
      throw new AppError('Maintenance type code already exists', 409);
    }

    const result = await db.insert(maintenanceTypes).values(data).returning();
    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error creating maintenance type:', error);
    next(error);
  }
});

// Work Orders endpoints
router.get('/work-orders', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const {
      page = 1,
      limit = 20,
      vehicleId,
      status,
      priority,
      assignedTo,
      startDate,
      endDate
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select({
      workOrder: {
        id: maintenanceWorkOrders.id,
        workOrderNumber: maintenanceWorkOrders.workOrderNumber,
        vehicleId: maintenanceWorkOrders.vehicleId,
        maintenanceTypeId: maintenanceWorkOrders.maintenanceTypeId,
        scheduleId: maintenanceWorkOrders.scheduleId,
        title: maintenanceWorkOrders.title,
        description: maintenanceWorkOrders.description,
        status: maintenanceWorkOrders.status,
        priority: maintenanceWorkOrders.priority,
        requestedDate: maintenanceWorkOrders.requestedDate,
        scheduledDate: maintenanceWorkOrders.scheduledDate,
        startedDate: maintenanceWorkOrders.startedDate,
        completedDate: maintenanceWorkOrders.completedDate,
        dueDate: maintenanceWorkOrders.dueDate,
        assignedTo: maintenanceWorkOrders.assignedTo,
        facility: maintenanceWorkOrders.facility,
        odometerReading: maintenanceWorkOrders.odometerReading,
        engineHours: maintenanceWorkOrders.engineHours,
        workInstructions: maintenanceWorkOrders.workInstructions,
        partsNeeded: maintenanceWorkOrders.partsNeeded,
        laborHours: maintenanceWorkOrders.laborHours,
        estimatedCost: maintenanceWorkOrders.estimatedCost,
        actualCost: maintenanceWorkOrders.actualCost,
        vendor: maintenanceWorkOrders.vendor,
        vendorInvoice: maintenanceWorkOrders.vendorInvoice,
        warrantyClaim: maintenanceWorkOrders.warrantyClaim,
        insuranceClaim: maintenanceWorkOrders.insuranceClaim,
        downtimeHours: maintenanceWorkOrders.downtimeHours,
        approvalRequired: maintenanceWorkOrders.approvalRequired,
        approvedBy: maintenanceWorkOrders.approvedBy,
        approvalDate: maintenanceWorkOrders.approvalDate,
        completionNotes: maintenanceWorkOrders.completionNotes,
        qualityCheck: maintenanceWorkOrders.qualityCheck,
        qualityCheckBy: maintenanceWorkOrders.qualityCheckBy,
        qualityCheckDate: maintenanceWorkOrders.qualityCheckDate,
        qualityCheckNotes: maintenanceWorkOrders.qualityCheckNotes,
        followUpRequired: maintenanceWorkOrders.followUpRequired,
        followUpDate: maintenanceWorkOrders.followUpDate,
        followUpNotes: maintenanceWorkOrders.followUpNotes,
        createdBy: maintenanceWorkOrders.createdBy,
        createdAt: maintenanceWorkOrders.createdAt,
        updatedAt: maintenanceWorkOrders.updatedAt
      },
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      maintenanceType: {
        id: maintenanceTypes.id,
        typeCode: maintenanceTypes.typeCode,
        typeName: maintenanceTypes.typeName,
        category: maintenanceTypes.category
      }
    })
    .from(maintenanceWorkOrders)
    .leftJoin(vehicles, eq(maintenanceWorkOrders.vehicleId, vehicles.id))
    .leftJoin(maintenanceTypes, eq(maintenanceWorkOrders.maintenanceTypeId, maintenanceTypes.id));

    // Apply filters
    const conditions = [];
    if (vehicleId) conditions.push(eq(maintenanceWorkOrders.vehicleId, parseInt(vehicleId as string)));
    if (status) conditions.push(eq(maintenanceWorkOrders.status, status as string));
    if (priority) conditions.push(eq(maintenanceWorkOrders.priority, parseInt(priority as string)));
    if (assignedTo) conditions.push(eq(maintenanceWorkOrders.assignedTo, assignedTo as string));
    if (startDate) conditions.push(gte(maintenanceWorkOrders.scheduledDate, new Date(startDate as string)));
    if (endDate) conditions.push(lte(maintenanceWorkOrders.scheduledDate, new Date(endDate as string)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(maintenanceWorkOrders.priority), asc(maintenanceWorkOrders.scheduledDate))
      .limit(parseInt(limit as string))
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: sql`count(*)`.as('count') }).from(maintenanceWorkOrders);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;

    // Flatten the results to match frontend expectations
    const flattenedResults = results.map(row => ({
      ...row.workOrder,
      vehicle: row.vehicle,
      maintenanceType: row.maintenanceType ? {
        id: row.maintenanceType.id,
        name: row.maintenanceType.typeName,
        code: row.maintenanceType.typeCode,
        category: row.maintenanceType.category,
      } : null,
    }));

    res.json({
      success: true,
      data: flattenedResults,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: Number(count),
        totalItems: Number(count),
        pages: Math.ceil(Number(count) / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Error fetching work orders:', error);
    next(error);
  }
});

router.post('/work-orders', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = workOrderSchema.parse(req.body);
    const db = getDb();

    // Auto-generate work order number
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.select({ count: sql`count(*)` }).from(maintenanceWorkOrders);
    const workOrderNumber = `WO${date}${String(Number(count[0].count) + 1).padStart(4, '0')}`;

    const result = await db.insert(maintenanceWorkOrders).values({
      ...data,
      workOrderNumber,
      requestedDate: new Date(),
      createdBy: req.user?.id?.toString()
    }).returning();

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error creating work order:', error);
    next(error);
  }
});

// Get work orders for approval (managers only) - Must come before /:id route
router.get('/work-orders/pending-approval', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const statusFilter = req.query.status as string;
    const priorityFilter = req.query.priority as string;

    const db = getDb();

    // Build where conditions
    const conditions = [eq(maintenanceWorkOrders.status, 'pending')];

    if (priorityFilter) {
      conditions.push(eq(maintenanceWorkOrders.priority, parseInt(priorityFilter)));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const result = await db.select({
      workOrder: {
        id: maintenanceWorkOrders.id,
        workOrderNumber: maintenanceWorkOrders.workOrderNumber,
        vehicleId: maintenanceWorkOrders.vehicleId,
        maintenanceTypeId: maintenanceWorkOrders.maintenanceTypeId,
        scheduleId: maintenanceWorkOrders.scheduleId,
        title: maintenanceWorkOrders.title,
        description: maintenanceWorkOrders.description,
        status: maintenanceWorkOrders.status,
        priority: maintenanceWorkOrders.priority,
        requestedDate: maintenanceWorkOrders.requestedDate,
        scheduledDate: maintenanceWorkOrders.scheduledDate,
        startedDate: maintenanceWorkOrders.startedDate,
        completedDate: maintenanceWorkOrders.completedDate,
        dueDate: maintenanceWorkOrders.dueDate,
        assignedTo: maintenanceWorkOrders.assignedTo,
        facility: maintenanceWorkOrders.facility,
        odometerReading: maintenanceWorkOrders.odometerReading,
        engineHours: maintenanceWorkOrders.engineHours,
        workInstructions: maintenanceWorkOrders.workInstructions,
        partsNeeded: maintenanceWorkOrders.partsNeeded,
        laborHours: maintenanceWorkOrders.laborHours,
        estimatedCost: maintenanceWorkOrders.estimatedCost,
        actualCost: maintenanceWorkOrders.actualCost,
        vendor: maintenanceWorkOrders.vendor,
        vendorInvoice: maintenanceWorkOrders.vendorInvoice,
        warrantyClaim: maintenanceWorkOrders.warrantyClaim,
        insuranceClaim: maintenanceWorkOrders.insuranceClaim,
        downtimeHours: maintenanceWorkOrders.downtimeHours,
        approvalRequired: maintenanceWorkOrders.approvalRequired,
        approvedBy: maintenanceWorkOrders.approvedBy,
        approvalDate: maintenanceWorkOrders.approvalDate,
        completionNotes: maintenanceWorkOrders.completionNotes,
        qualityCheck: maintenanceWorkOrders.qualityCheck,
        qualityCheckBy: maintenanceWorkOrders.qualityCheckBy,
        qualityCheckDate: maintenanceWorkOrders.qualityCheckDate,
        qualityCheckNotes: maintenanceWorkOrders.qualityCheckNotes,
        followUpRequired: maintenanceWorkOrders.followUpRequired,
        followUpDate: maintenanceWorkOrders.followUpDate,
        followUpNotes: maintenanceWorkOrders.followUpNotes,
        createdBy: maintenanceWorkOrders.createdBy,
        createdAt: maintenanceWorkOrders.createdAt,
        updatedAt: maintenanceWorkOrders.updatedAt
      },
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      maintenanceType: {
        id: maintenanceTypes.id,
        typeCode: maintenanceTypes.typeCode,
        typeName: maintenanceTypes.typeName,
        category: maintenanceTypes.category
      }
    })
      .from(maintenanceWorkOrders)
      .leftJoin(vehicles, eq(maintenanceWorkOrders.vehicleId, vehicles.id))
      .leftJoin(maintenanceTypes, eq(maintenanceWorkOrders.maintenanceTypeId, maintenanceTypes.id))
      .where(whereClause)
      .orderBy(desc(maintenanceWorkOrders.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db.select({ count: sql`count(*)` })
      .from(maintenanceWorkOrders)
      .where(whereClause);

    const totalPages = Math.ceil(Number(count) / limit);

    // Flatten the results to match frontend expectations
    const flattenedResults = result.map(row => ({
      ...row.workOrder,
      vehicle: row.vehicle,
      maintenanceType: row.maintenanceType ? {
        id: row.maintenanceType.id,
        name: row.maintenanceType.typeName,
        code: row.maintenanceType.typeCode,
        category: row.maintenanceType.category,
      } : null,
    }));

    res.json({
      success: true,
      data: flattenedResults,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalItems: Number(count),
        totalPages
      }
    });
  } catch (error) {
    logger.error('Error fetching work orders for approval:', error);
    next(error);
  }
});

// Get work order statistics - Must come before /:id route
router.get('/work-orders/stats', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { dateFrom, dateTo, vehicleId } = req.query;

    // Build conditions array
    const conditions = [];

    if (vehicleId) {
      conditions.push(eq(maintenanceWorkOrders.vehicleId, parseInt(vehicleId as string)));
    }

    if (dateFrom) {
      conditions.push(gte(maintenanceWorkOrders.createdAt, new Date(dateFrom as string)));
    }

    if (dateTo) {
      conditions.push(lte(maintenanceWorkOrders.createdAt, new Date(dateTo as string)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total counts by status
    const statusCounts = await db.select({
      status: maintenanceWorkOrders.status,
      count: sql<number>`count(*)`.as('count'),
      totalCost: sql<number>`coalesce(sum(${maintenanceWorkOrders.actualCost}), 0)`.as('totalCost')
    })
      .from(maintenanceWorkOrders)
      .where(whereClause)
      .groupBy(maintenanceWorkOrders.status);

    // Calculate totals
    let totalWorkOrders = 0;
    let pendingWorkOrders = 0;
    let inProgressWorkOrders = 0;
    let completedWorkOrders = 0;
    let totalCost = 0;

    for (const row of statusCounts) {
      totalWorkOrders += Number(row.count);
      totalCost += Number(row.totalCost);

      if (row.status === 'pending') pendingWorkOrders = Number(row.count);
      else if (row.status === 'in_progress') inProgressWorkOrders = Number(row.count);
      else if (row.status === 'completed') completedWorkOrders = Number(row.count);
    }

    const averageCost = totalWorkOrders > 0 ? totalCost / totalWorkOrders : 0;

    // Get work orders by maintenance type
    const workOrdersByType = await db.select({
      maintenanceType: maintenanceTypes.typeName,
      count: sql<number>`count(*)`.as('count'),
      cost: sql<number>`coalesce(sum(${maintenanceWorkOrders.actualCost}), 0)`.as('cost')
    })
      .from(maintenanceWorkOrders)
      .leftJoin(maintenanceTypes, eq(maintenanceWorkOrders.maintenanceTypeId, maintenanceTypes.id))
      .where(whereClause)
      .groupBy(maintenanceTypes.typeName);

    // Get work orders by vehicle
    const workOrdersByVehicle = await db.select({
      vehicleCode: vehicles.vehicleCode,
      count: sql<number>`count(*)`.as('count'),
      cost: sql<number>`coalesce(sum(${maintenanceWorkOrders.actualCost}), 0)`.as('cost')
    })
      .from(maintenanceWorkOrders)
      .leftJoin(vehicles, eq(maintenanceWorkOrders.vehicleId, vehicles.id))
      .where(whereClause)
      .groupBy(vehicles.vehicleCode)
      .limit(10);

    // Get monthly trend (last 12 months)
    const monthlyTrend = await db.select({
      month: sql<string>`strftime('%Y-%m', ${maintenanceWorkOrders.createdAt})`.as('month'),
      count: sql<number>`count(*)`.as('count'),
      cost: sql<number>`coalesce(sum(${maintenanceWorkOrders.actualCost}), 0)`.as('cost')
    })
      .from(maintenanceWorkOrders)
      .where(whereClause)
      .groupBy(sql`strftime('%Y-%m', ${maintenanceWorkOrders.createdAt})`)
      .orderBy(desc(sql`strftime('%Y-%m', ${maintenanceWorkOrders.createdAt})`))
      .limit(12);

    res.json({
      success: true,
      data: {
        totalWorkOrders,
        pendingWorkOrders,
        inProgressWorkOrders,
        completedWorkOrders,
        totalCost,
        averageCost,
        workOrdersByType: workOrdersByType.map(row => ({
          maintenanceType: row.maintenanceType || 'Necunoscut',
          count: Number(row.count),
          cost: Number(row.cost)
        })),
        workOrdersByVehicle: workOrdersByVehicle.map(row => ({
          vehicleCode: row.vehicleCode || 'Necunoscut',
          count: Number(row.count),
          cost: Number(row.cost)
        })),
        monthlyTrend: monthlyTrend.map(row => ({
          month: row.month,
          count: Number(row.count),
          cost: Number(row.cost)
        })).reverse()
      }
    });
  } catch (error) {
    logger.error('Error fetching maintenance stats:', error);
    next(error);
  }
});

router.get('/work-orders/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);

    // Validate that id is a valid number
    if (isNaN(id)) {
      throw new AppError('Invalid work order ID', 400);
    }

    const [result] = await db.select({
      maintenance_work_orders: maintenanceWorkOrders,
      vehicles: vehicles,
      maintenance_types: maintenanceTypes
    })
      .from(maintenanceWorkOrders)
      .leftJoin(vehicles, eq(maintenanceWorkOrders.vehicleId, vehicles.id))
      .leftJoin(maintenanceTypes, eq(maintenanceWorkOrders.maintenanceTypeId, maintenanceTypes.id))
      .where(eq(maintenanceWorkOrders.id, id))
      .limit(1);


    if (!result) {
      throw new AppError('Work order not found', 404);
    }

    // Get parts and labor associated with this work order
    const parts = await db.select().from(maintenanceParts)
      .where(eq(maintenanceParts.workOrderId, id));

    const labor = await db.select().from(maintenanceLabor)
      .where(eq(maintenanceLabor.workOrderId, id));

    // Flatten the result to match frontend expectations
    const workOrder = {
      ...result.maintenance_work_orders,
      vehicle: result.vehicles ? {
        id: result.vehicles.id,
        vehicleCode: result.vehicles.vehicleCode,
        licensePlate: result.vehicles.licensePlate
      } : null,
      maintenanceType: result.maintenance_types ? {
        id: result.maintenance_types.id,
        name: result.maintenance_types.typeName,
        category: result.maintenance_types.category
      } : null,
      parts,
      labor
    };

    res.json({
      success: true,
      data: workOrder
    });
  } catch (error) {
    logger.error('Error fetching work order:', error);
    next(error);
  }
});

router.put('/work-orders/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    const updateData = workOrderSchema.partial().parse(req.body);

    const result = await db.update(maintenanceWorkOrders)
      .set(updateData)
      .where(eq(maintenanceWorkOrders.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Work order not found', 404);
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error updating work order:', error);
    next(error);
  }
});

// Update work order status
router.patch('/work-orders/:id/status', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const updateData: any = { status };

    if (status === 'approved') {
      updateData.approvedBy = req.user.id;
      updateData.approvalDate = new Date();
    } else if (status === 'in_progress') {
      updateData.startedDate = new Date();
    } else if (status === 'completed') {
      updateData.completedDate = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const result = await db.update(maintenanceWorkOrders)
      .set(updateData)
      .where(eq(maintenanceWorkOrders.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Work order not found', 404);
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error updating work order status:', error);
    next(error);
  }
});

// Maintenance alerts endpoint
router.get('/alerts', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { vehicleId, alertType, resolved } = req.query;

    let query = db.select({
      alert: maintenanceAlerts,
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      }
    })
    .from(maintenanceAlerts)
    .leftJoin(vehicles, eq(maintenanceAlerts.vehicleId, vehicles.id));

    const conditions = [];
    if (vehicleId) conditions.push(eq(maintenanceAlerts.vehicleId, parseInt(vehicleId as string)));
    if (alertType) conditions.push(eq(maintenanceAlerts.alertType, alertType as string));
    if (resolved !== undefined) conditions.push(eq(maintenanceAlerts.resolved, resolved === 'true'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(desc(maintenanceAlerts.priority), desc(maintenanceAlerts.createdAt));
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error fetching maintenance alerts:', error);
    next(error);
  }
});

// Maintenance schedules endpoint
router.get('/schedules', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { vehicleId } = req.query;

    let query = db.select({
      schedule: maintenanceSchedules,
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      maintenanceType: {
        id: maintenanceTypes.id,
        typeName: maintenanceTypes.typeName,
        category: maintenanceTypes.category
      }
    })
    .from(maintenanceSchedules)
    .leftJoin(vehicles, eq(maintenanceSchedules.vehicleId, vehicles.id))
    .leftJoin(maintenanceTypes, eq(maintenanceSchedules.maintenanceTypeId, maintenanceTypes.id))
    .where(eq(maintenanceSchedules.active, true));

    if (vehicleId) {
      query = query.where(and(
        eq(maintenanceSchedules.active, true),
        eq(maintenanceSchedules.vehicleId, parseInt(vehicleId as string))
      ));
    }

    const results = await query.orderBy(asc(maintenanceSchedules.nextMaintenanceDate));
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error fetching maintenance schedules:', error);
    next(error);
  }
});

// Maintenance history endpoint
router.get('/history', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { vehicleId, maintenanceTypeId, startDate, endDate, page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select({
      history: maintenanceHistory,
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      maintenanceType: {
        id: maintenanceTypes.id,
        typeName: maintenanceTypes.typeName,
        category: maintenanceTypes.category
      }
    })
    .from(maintenanceHistory)
    .leftJoin(vehicles, eq(maintenanceHistory.vehicleId, vehicles.id))
    .leftJoin(maintenanceTypes, eq(maintenanceHistory.maintenanceTypeId, maintenanceTypes.id));

    const conditions = [];
    if (vehicleId) conditions.push(eq(maintenanceHistory.vehicleId, parseInt(vehicleId as string)));
    if (maintenanceTypeId) conditions.push(eq(maintenanceHistory.maintenanceTypeId, parseInt(maintenanceTypeId as string)));
    if (startDate) conditions.push(gte(maintenanceHistory.maintenanceDate, new Date(startDate as string)));
    if (endDate) conditions.push(lte(maintenanceHistory.maintenanceDate, new Date(endDate as string)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(maintenanceHistory.maintenanceDate))
      .limit(parseInt(limit as string))
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: sql`count(*)`.as('count') }).from(maintenanceHistory);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;

    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: Number(count),
        pages: Math.ceil(Number(count) / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Error fetching maintenance history:', error);
    next(error);
  }
});

// Dashboard stats endpoint
router.get('/dashboard', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();

    // Get pending work orders count
    const [pendingWorkOrders] = await db.select({ count: sql`count(*)`.as('count') })
      .from(maintenanceWorkOrders)
      .where(eq(maintenanceWorkOrders.status, 'pending'));

    // Get overdue maintenance count
    const [overdueMaintenance] = await db.select({ count: sql`count(*)`.as('count') })
      .from(maintenanceAlerts)
      .where(and(
        eq(maintenanceAlerts.alertType, 'overdue'),
        eq(maintenanceAlerts.resolved, false)
      ));

    // Get upcoming maintenance (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const [upcomingMaintenance] = await db.select({ count: sql`count(*)`.as('count') })
      .from(maintenanceWorkOrders)
      .where(and(
        eq(maintenanceWorkOrders.status, 'approved'),
        lte(maintenanceWorkOrders.scheduledDate, sevenDaysFromNow)
      ));

    // Get this month's maintenance cost
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const [monthlyMaintenanceCost] = await db.select({ total: sql`sum(${maintenanceWorkOrders.actualCost})`.as('total') })
      .from(maintenanceWorkOrders)
      .where(and(
        eq(maintenanceWorkOrders.status, 'completed'),
        gte(maintenanceWorkOrders.completedDate, firstDayOfMonth)
      ));

    res.json({
      success: true,
      data: {
        pendingWorkOrders: Number(pendingWorkOrders.count),
        overdueMaintenance: Number(overdueMaintenance.count),
        upcomingMaintenance: Number(upcomingMaintenance.count),
        monthlyMaintenanceCost: Number(monthlyMaintenanceCost.total) || 0
      }
    });
  } catch (error) {
    logger.error('Error fetching maintenance dashboard data:', error);
    next(error);
  }
});


// Approve work order
router.post('/work-orders/:id/approve', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const workOrderId = parseInt(req.params.id);
    const { notes } = req.body;

    const db = getDb();

    // Check if work order exists and is pending
    const [existingWorkOrder] = await db.select()
      .from(maintenanceWorkOrders)
      .where(eq(maintenanceWorkOrders.id, workOrderId))
      .limit(1);

    if (!existingWorkOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (existingWorkOrder.status !== 'pending') {
      throw new AppError('Work order is not in pending status', 400);
    }

    // Update work order status
    const [updatedWorkOrder] = await db.update(maintenanceWorkOrders)
      .set({
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        internalNotes: notes || null,
        updatedAt: new Date()
      })
      .where(eq(maintenanceWorkOrders.id, workOrderId))
      .returning();

    res.json({
      success: true,
      data: updatedWorkOrder,
      message: 'Work order approved successfully'
    });
  } catch (error) {
    logger.error('Error approving work order:', error);
    next(error);
  }
});

// Reject work order
router.post('/work-orders/:id/reject', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const workOrderId = parseInt(req.params.id);
    const { notes } = req.body;

    if (!notes || notes.trim().length === 0) {
      throw new AppError('Rejection reason is required', 400);
    }

    const db = getDb();

    // Check if work order exists and is pending
    const [existingWorkOrder] = await db.select()
      .from(maintenanceWorkOrders)
      .where(eq(maintenanceWorkOrders.id, workOrderId))
      .limit(1);

    if (!existingWorkOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (existingWorkOrder.status !== 'pending') {
      throw new AppError('Work order is not in pending status', 400);
    }

    // Update work order status to cancelled with rejection reason
    const [updatedWorkOrder] = await db.update(maintenanceWorkOrders)
      .set({
        status: 'cancelled',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        internalNotes: `REJECTED: ${notes}`,
        updatedAt: new Date()
      })
      .where(eq(maintenanceWorkOrders.id, workOrderId))
      .returning();

    res.json({
      success: true,
      data: updatedWorkOrder,
      message: 'Work order rejected successfully'
    });
  } catch (error) {
    logger.error('Error rejecting work order:', error);
    next(error);
  }
});

// Delete work order (admin/manager only)
router.delete('/work-orders/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const workOrderId = parseInt(req.params.id);
    const db = getDb();

    // Check if work order exists
    const [existingWorkOrder] = await db.select()
      .from(maintenanceWorkOrders)
      .where(eq(maintenanceWorkOrders.id, workOrderId));

    if (!existingWorkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Work order not found'
      });
    }

    // Delete the work order
    await db.delete(maintenanceWorkOrders)
      .where(eq(maintenanceWorkOrders.id, workOrderId));

    res.json({
      success: true,
      message: 'Work order deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting work order:', error);
    next(error);
  }
});

export default router;