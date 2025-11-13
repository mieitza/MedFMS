import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { materials, materialTransactions, warehouses, warehouseTransferRequests, materialUnits } from '../db/schema/materials.js';
import { vehicles } from '../db/schema/vehicles.js';
import { users } from '../db/schema/users.js';
import { eq, like, or, sql, desc, and, gte, lte } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(authenticate);

const materialSchema = z.object({
  materialCode: z.string().min(1).max(50),
  materialName: z.string().min(1).max(100),
  description: z.string().optional(),
  materialTypeId: z.number().optional(),
  categoryId: z.number().optional(),
  unitId: z.number().positive(),
  currentStock: z.number().default(0),
  criticalLevel: z.number().optional(),
  standardPrice: z.number().optional(),
  warehouseId: z.number().optional(),
});

// ========== Material Routes ==========

// GET /api/materials - List all materials
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const db = getDb();

    let query = db.select().from(materials);

    if (search) {
      query = query.where(
        or(
          like(materials.materialCode, `%${search}%`),
          like(materials.materialName, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials/low-stock - Get low stock materials
router.get('/low-stock', async (req, res, next) => {
  try {
    const db = getDb();

    const results = await db.select()
      .from(materials)
      .where(sql`${materials.currentStock} <= ${materials.criticalLevel}`)
      .orderBy(materials.currentStock);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// ========== Warehouse Routes ==========

// GET /api/materials/warehouses - Get all warehouses
router.get('/warehouses', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(warehouses);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials/warehouses/:id - Get warehouse by ID
router.get('/warehouses/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [warehouse] = await db.select()
      .from(warehouses)
      .where(eq(warehouses.id, id))
      .limit(1);

    if (!warehouse) {
      throw new AppError('Warehouse not found', 404);
    }

    res.json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/materials/warehouses - Create warehouse
router.post('/warehouses', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const schema = z.object({
      warehouseCode: z.string().min(1).max(50),
      warehouseName: z.string().min(1).max(100),
      description: z.string().optional(),
      locationId: z.number().optional(),
      capacity: z.number().optional(),
    });

    const data = schema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(warehouses)
      .where(eq(warehouses.warehouseCode, data.warehouseCode))
      .limit(1);

    if (existing) {
      throw new AppError('Warehouse code already exists', 409);
    }

    const result = await db.insert(warehouses).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/materials/warehouses/:id - Update warehouse
router.put('/warehouses/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const schema = z.object({
      warehouseCode: z.string().min(1).max(50),
      warehouseName: z.string().min(1).max(100),
      description: z.string().optional(),
      locationId: z.number().optional(),
      capacity: z.number().optional(),
      responsiblePersonId: z.number().optional(),
    });

    const data = schema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(warehouses)
      .where(eq(warehouses.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Warehouse not found', 404);
    }

    // Check if warehouse code is being changed and if it conflicts with another warehouse
    if (data.warehouseCode !== existing.warehouseCode) {
      const [codeConflict] = await db.select()
        .from(warehouses)
        .where(eq(warehouses.warehouseCode, data.warehouseCode))
        .limit(1);

      if (codeConflict) {
        throw new AppError('Warehouse code already exists', 409);
      }
    }

    const result = await db.update(warehouses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(warehouses.id, id))
      .returning();

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// ========== Material Units Routes ==========

// GET /api/materials/units - Get all material units
router.get('/units', async (req, res, next) => {
  try {
    const db = getDb();
    const { active } = req.query;

    let query = db.select().from(materialUnits);

    if (active !== undefined) {
      query = query.where(eq(materialUnits.active, active === 'true'));
    }

    const results = await query.orderBy(materialUnits.unitName);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Error fetching material units:', error);
    next(error);
  }
});

// POST /api/materials/units - Create material unit (admin only)
router.post('/units', authorize('admin'), async (req, res, next) => {
  try {
    const schema = z.object({
      unitCode: z.string().min(1).max(50),
      unitName: z.string().min(1).max(100),
      unitNamePlural: z.string().optional(),
      abbreviation: z.string().min(1).max(20),
      description: z.string().optional(),
      active: z.boolean().default(true)
    });

    const data = schema.parse(req.body);
    const db = getDb();

    // Check if unit code already exists
    const [existing] = await db.select()
      .from(materialUnits)
      .where(eq(materialUnits.unitCode, data.unitCode))
      .limit(1);

    if (existing) {
      throw new AppError('Unit code already exists', 409);
    }

    const result = await db.insert(materialUnits).values(data).returning();

    logger.info(`Material unit created: ${data.unitCode}`);

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    logger.error('Error creating material unit:', error);
    next(error);
  }
});

// PUT /api/materials/units/:id - Update material unit (admin only)
router.put('/units/:id', authorize('admin'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const schema = z.object({
      unitCode: z.string().min(1).max(50),
      unitName: z.string().min(1).max(100),
      unitNamePlural: z.string().optional(),
      abbreviation: z.string().min(1).max(20),
      description: z.string().optional(),
      active: z.boolean()
    });

    const data = schema.parse(req.body);
    const db = getDb();

    const [existing] = await db.select()
      .from(materialUnits)
      .where(eq(materialUnits.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Material unit not found', 404);
    }

    // Check if unit code conflicts with another unit
    if (data.unitCode !== existing.unitCode) {
      const [codeConflict] = await db.select()
        .from(materialUnits)
        .where(eq(materialUnits.unitCode, data.unitCode))
        .limit(1);

      if (codeConflict) {
        throw new AppError('Unit code already exists', 409);
      }
    }

    const result = await db.update(materialUnits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(materialUnits.id, id))
      .returning();

    logger.info(`Material unit updated: ${data.unitCode}`);

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    logger.error('Error updating material unit:', error);
    next(error);
  }
});

// ========== Warehouse Transfer Request Routes ==========

const transferRequestSchema = z.object({
  transferType: z.enum(['warehouse-to-warehouse', 'warehouse-to-vehicle', 'warehouse-to-employee', 'vehicle-to-warehouse']).default('warehouse-to-warehouse'),
  sourceWarehouseId: z.number().positive().nullable().optional(),
  sourceVehicleId: z.number().positive().nullable().optional(),
  destinationWarehouseId: z.number().positive().nullable().optional(),
  destinationVehicleId: z.number().positive().nullable().optional(),
  destinationEmployeeId: z.number().positive().nullable().optional(),
  materialId: z.number().positive(),
  vehicleInventoryItemId: z.number().positive().nullable().optional(), // Required for vehicle-to-warehouse (returns)
  quantity: z.number().positive(),
  requestedQuantity: z.number().positive().optional(),
  priority: z.number().min(1).max(5).default(3),
  requiredByDate: z.coerce.date().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  autoApprove: z.boolean().default(false)
}).refine((data) => {
  // Ensure correct source based on transfer type
  if (data.transferType === 'vehicle-to-warehouse') {
    return !!data.sourceVehicleId;
  } else {
    return !!data.sourceWarehouseId;
  }
}, {
  message: 'Source must match transfer type'
}).refine((data) => {
  // Ensure at least one destination is set based on transfer type
  if (data.transferType === 'warehouse-to-warehouse' || data.transferType === 'vehicle-to-warehouse') {
    return !!data.destinationWarehouseId;
  } else if (data.transferType === 'warehouse-to-vehicle') {
    return !!data.destinationVehicleId;
  } else if (data.transferType === 'warehouse-to-employee') {
    return !!data.destinationEmployeeId;
  }
  return false;
}, {
  message: 'Destination must match transfer type'
}).refine((data) => {
  // Vehicle inventory item is only required for vehicle-to-warehouse (returns)
  if (data.transferType === 'vehicle-to-warehouse') {
    return !!data.vehicleInventoryItemId;
  }
  return true;
}, {
  message: 'Vehicle inventory item is required for vehicle-to-warehouse transfers'
});

// GET /api/materials/transfer-requests - List all transfer requests
router.get('/transfer-requests', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      sourceWarehouseId,
      destinationWarehouseId,
      materialId,
      startDate,
      endDate
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Create aliases for warehouses to join twice  (for source and destination)
    const sourceWarehouse = alias(warehouses, 'source_warehouse');
    const destWarehouse = alias(warehouses, 'dest_warehouse');

    let query = db.select({
      transferRequest: warehouseTransferRequests,
      sourceWarehouse: sourceWarehouse,
      destinationWarehouse: destWarehouse,
      destinationVehicle: vehicles,
      destinationEmployee: users,
      material: materials
    })
    .from(warehouseTransferRequests)
    .leftJoin(
      sourceWarehouse,
      eq(warehouseTransferRequests.sourceWarehouseId, sourceWarehouse.id)
    )
    .leftJoin(
      destWarehouse,
      eq(warehouseTransferRequests.destinationWarehouseId, destWarehouse.id)
    )
    .leftJoin(
      vehicles,
      eq(warehouseTransferRequests.destinationVehicleId, vehicles.id)
    )
    .leftJoin(
      users,
      eq(warehouseTransferRequests.destinationEmployeeId, users.id)
    )
    .leftJoin(
      materials,
      eq(warehouseTransferRequests.materialId, materials.id)
    );

    // Apply filters
    const conditions = [];
    if (status) conditions.push(eq(warehouseTransferRequests.status, status as string));
    if (priority) conditions.push(eq(warehouseTransferRequests.priority, parseInt(priority as string)));
    if (sourceWarehouseId) conditions.push(eq(warehouseTransferRequests.sourceWarehouseId, parseInt(sourceWarehouseId as string)));
    if (destinationWarehouseId) conditions.push(eq(warehouseTransferRequests.destinationWarehouseId, parseInt(destinationWarehouseId as string)));
    if (materialId) conditions.push(eq(warehouseTransferRequests.materialId, parseInt(materialId as string)));
    if (startDate) conditions.push(gte(warehouseTransferRequests.requestedDate, new Date(startDate as string)));
    if (endDate) conditions.push(lte(warehouseTransferRequests.requestedDate, new Date(endDate as string)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(warehouseTransferRequests.priority), desc(warehouseTransferRequests.requestedDate))
      .limit(parseInt(limit as string))
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: sql`count(*)`.as('count') }).from(warehouseTransferRequests);
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
    logger.error('Error fetching transfer requests:', error);
    next(error);
  }
});

// GET /api/materials/transfer-requests/pending-approval - Get pending transfer requests (managers only)
router.get('/transfer-requests/pending-approval', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const db = getDb();

    const conditions = [eq(warehouseTransferRequests.status, 'pending')];
    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Create aliases for warehouses
    const sourceWarehouse = alias(warehouses, 'source_warehouse');
    const destWarehouse = alias(warehouses, 'dest_warehouse');

    const result = await db.select({
      transferRequest: warehouseTransferRequests,
      sourceWarehouse: sourceWarehouse,
      destinationWarehouse: destWarehouse,
      destinationVehicle: vehicles,
      destinationEmployee: users,
      material: materials
    })
      .from(warehouseTransferRequests)
      .leftJoin(sourceWarehouse, eq(warehouseTransferRequests.sourceWarehouseId, sourceWarehouse.id))
      .leftJoin(destWarehouse, eq(warehouseTransferRequests.destinationWarehouseId, destWarehouse.id))
      .leftJoin(vehicles, eq(warehouseTransferRequests.destinationVehicleId, vehicles.id))
      .leftJoin(users, eq(warehouseTransferRequests.destinationEmployeeId, users.id))
      .leftJoin(materials, eq(warehouseTransferRequests.materialId, materials.id))
      .where(whereClause)
      .orderBy(desc(warehouseTransferRequests.priority), desc(warehouseTransferRequests.requestedDate))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db.select({ count: sql`count(*)` })
      .from(warehouseTransferRequests)
      .where(whereClause);

    const totalPages = Math.ceil(Number(count) / limit);

    res.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages
      }
    });
  } catch (error) {
    logger.error('Error fetching transfer requests for approval:', error);
    next(error);
  }
});

// GET /api/materials/transfer-requests/:id - Get transfer request by ID
router.get('/transfer-requests/:id', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw new AppError('Invalid transfer request ID', 400);
    }

    const [result] = await db.select({
      transferRequest: warehouseTransferRequests,
      sourceWarehouse: warehouses,
      material: materials
    })
      .from(warehouseTransferRequests)
      .leftJoin(warehouses, eq(warehouseTransferRequests.sourceWarehouseId, warehouses.id))
      .leftJoin(materials, eq(warehouseTransferRequests.materialId, materials.id))
      .where(eq(warehouseTransferRequests.id, id))
      .limit(1);

    if (!result) {
      throw new AppError('Transfer request not found', 404);
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error fetching transfer request:', error);
    next(error);
  }
});

// POST /api/materials/transfer-requests - Create transfer request
router.post('/transfer-requests', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const data = transferRequestSchema.parse(req.body);
    const db = getDb();

    // Validate source and destination warehouses are different (for warehouse-to-warehouse transfers)
    if (data.transferType === 'warehouse-to-warehouse' && data.sourceWarehouseId === data.destinationWarehouseId) {
      throw new AppError('Source and destination warehouses must be different', 400);
    }

    // Auto-generate request number
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await db.select({ count: sql`count(*)` }).from(warehouseTransferRequests);
    const requestNumber = `TR${date}${String(Number(count[0].count) + 1).padStart(4, '0')}`;

    // Determine initial status based on auto-approval setting
    const initialStatus = data.autoApprove ? 'approved' : 'pending';

    const transferData: any = {
      ...data,
      requestNumber,
      requestedBy: req.user!.id,
      requestedDate: new Date(),
      status: initialStatus
    };

    // If auto-approved, set approval fields
    if (data.autoApprove) {
      transferData.approvedBy = req.user!.id;
      transferData.approvedDate = new Date();
      transferData.approvedQuantity = data.quantity;
    }

    const result = await db.insert(warehouseTransferRequests).values(transferData).returning();

    logger.info(`Transfer request created: ${requestNumber} (${data.transferType}) by user ${req.user!.username}, status: ${initialStatus}`);

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    logger.error('Error creating transfer request:', error);
    next(error);
  }
});

// PUT /api/materials/transfer-requests/:id - Update transfer request
router.put('/transfer-requests/:id', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    const updateData = transferRequestSchema.partial().parse(req.body);

    // Validate source and destination warehouses are different if both provided
    if (updateData.sourceWarehouseId && updateData.destinationWarehouseId &&
        updateData.sourceWarehouseId === updateData.destinationWarehouseId) {
      throw new AppError('Source and destination warehouses must be different', 400);
    }

    const result = await db.update(warehouseTransferRequests)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(warehouseTransferRequests.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Transfer request not found', 404);
    }

    logger.info(`Transfer request updated: ${result[0].requestNumber}`);

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    logger.error('Error updating transfer request:', error);
    next(error);
  }
});

// PATCH /api/materials/transfer-requests/:id/status - Update transfer request status
router.patch('/transfer-requests/:id/status', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'in_transit', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const updateData: any = { status, updatedAt: new Date() };

    if (status === 'approved') {
      updateData.approvedBy = req.user!.id;
      updateData.approvedDate = new Date();
    } else if (status === 'in_transit') {
      updateData.transferDate = new Date();
      updateData.transferredBy = req.user!.id;
    } else if (status === 'completed') {
      updateData.completedDate = new Date();
      updateData.receivedBy = req.user!.id;
      updateData.receivedDate = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedBy = req.user!.id;
      if (notes) {
        updateData.rejectionReason = notes;
      }
    }

    if (notes && status !== 'rejected') {
      updateData.notes = notes;
    }

    const result = await db.update(warehouseTransferRequests)
      .set(updateData)
      .where(eq(warehouseTransferRequests.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Transfer request not found', 404);
    }

    logger.info(`Transfer request status updated: ${result[0].requestNumber} -> ${status}`);

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    logger.error('Error updating transfer request status:', error);
    next(error);
  }
});

// POST /api/materials/transfer-requests/:id/approve - Approve transfer request
router.post('/transfer-requests/:id/approve', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const transferRequestId = parseInt(req.params.id);
    const { notes, approvedQuantity } = req.body;

    const db = getDb();

    // Check if transfer request exists and is pending
    const [existingRequest] = await db.select()
      .from(warehouseTransferRequests)
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .limit(1);

    if (!existingRequest) {
      throw new AppError('Transfer request not found', 404);
    }

    if (existingRequest.status !== 'pending') {
      throw new AppError('Transfer request is not in pending status', 400);
    }

    // Update transfer request status
    const [updatedRequest] = await db.update(warehouseTransferRequests)
      .set({
        status: 'approved',
        approvedBy: req.user!.id,
        approvedDate: new Date(),
        approvedQuantity: approvedQuantity || existingRequest.quantity,
        notes: notes || existingRequest.notes,
        updatedAt: new Date()
      })
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .returning();

    logger.info(`Transfer request approved: ${updatedRequest.requestNumber} by ${req.user!.username}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Transfer request approved successfully'
    });
  } catch (error) {
    logger.error('Error approving transfer request:', error);
    next(error);
  }
});

// POST /api/materials/transfer-requests/:id/reject - Reject transfer request
router.post('/transfer-requests/:id/reject', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const transferRequestId = parseInt(req.params.id);
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new AppError('Rejection reason is required', 400);
    }

    const db = getDb();

    // Check if transfer request exists and is pending
    const [existingRequest] = await db.select()
      .from(warehouseTransferRequests)
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .limit(1);

    if (!existingRequest) {
      throw new AppError('Transfer request not found', 404);
    }

    if (existingRequest.status !== 'pending') {
      throw new AppError('Transfer request is not in pending status', 400);
    }

    // Update transfer request status to rejected
    const [updatedRequest] = await db.update(warehouseTransferRequests)
      .set({
        status: 'rejected',
        rejectedBy: req.user!.id,
        rejectionReason,
        updatedAt: new Date()
      })
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .returning();

    logger.info(`Transfer request rejected: ${updatedRequest.requestNumber} by ${req.user!.username}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Transfer request rejected successfully'
    });
  } catch (error) {
    logger.error('Error rejecting transfer request:', error);
    next(error);
  }
});

// POST /api/materials/transfer-requests/:id/complete - Complete transfer and update stock
router.post('/transfer-requests/:id/complete', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const transferRequestId = parseInt(req.params.id);
    const { qualityCheckNotes, transferredQuantity, condition, serialNumber, batchNumber, location } = req.body;

    const db = getDb();

    // Check if transfer request exists and is in approved or in_transit status
    const [existingRequest] = await db.select()
      .from(warehouseTransferRequests)
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .limit(1);

    if (!existingRequest) {
      throw new AppError('Transfer request not found', 404);
    }

    if (existingRequest.status !== 'in_transit' && existingRequest.status !== 'approved') {
      throw new AppError('Transfer request must be in approved or in_transit status to complete', 400);
    }

    const finalQuantity = transferredQuantity || existingRequest.approvedQuantity || existingRequest.quantity;

    // Handle different transfer types
    if (existingRequest.transferType === 'warehouse-to-warehouse') {
      // Original warehouse-to-warehouse logic
      // Decrease source warehouse stock
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} - ${finalQuantity}`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(materials.id, existingRequest.materialId),
            eq(materials.warehouseId, existingRequest.sourceWarehouseId)
          )
        );

      // Increase destination warehouse stock
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} + ${finalQuantity}`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(materials.id, existingRequest.materialId),
            eq(materials.warehouseId, existingRequest.destinationWarehouseId!)
          )
        );

    } else if (existingRequest.transferType === 'warehouse-to-vehicle') {
      // Decrease source warehouse stock
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} - ${finalQuantity}`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(materials.id, existingRequest.materialId),
            eq(materials.warehouseId, existingRequest.sourceWarehouseId)
          )
        );

      // Create vehicle inventory assignment
      const { vehicleInventoryAssignments, vehicleInventoryItems } = await import('../db/schema/vehicleInventory.js');

      // Find the vehicle inventory item that corresponds to this material
      // Look for a vehicleInventoryItem that has this materialId
      const [inventoryItem] = await db.select()
        .from(vehicleInventoryItems)
        .where(eq(vehicleInventoryItems.materialId, existingRequest.materialId))
        .limit(1);

      if (!inventoryItem) {
        throw new AppError('No vehicle inventory item found for this material. Please create a vehicle inventory item linked to this material first.', 400);
      }

      await db.insert(vehicleInventoryAssignments).values({
        vehicleId: existingRequest.destinationVehicleId!,
        itemId: inventoryItem.id,
        quantity: Math.floor(finalQuantity), // Convert to integer for quantity
        serialNumber: serialNumber || null,
        batchNumber: batchNumber || null,
        condition: condition || (qualityCheckNotes ? 'good' : 'good'),
        status: 'active',
        assignmentDate: new Date(),
        location: location || null,
        notes: qualityCheckNotes || null,
        createdBy: req.user!.id,
        active: true
      });

      // Create material transaction for exit
      await db.insert(materialTransactions).values({
        transactionType: 'exit',
        materialId: existingRequest.materialId,
        quantity: finalQuantity,
        transactionDate: new Date(),
        warehouseId: existingRequest.sourceWarehouseId,
        vehicleId: existingRequest.destinationVehicleId!,
        description: `Transfer to vehicle (${existingRequest.requestNumber})`,
        approved: true,
        approvedBy: req.user!.id,
        approvalDate: new Date(),
        userId: req.user!.id
      });

    } else if (existingRequest.transferType === 'vehicle-to-warehouse') {
      // Find and deactivate the vehicle inventory assignment
      const { vehicleInventoryAssignments } = await import('../db/schema/vehicleInventory.js');

      await db.update(vehicleInventoryAssignments)
        .set({
          status: 'removed',
          removalDate: new Date(),
          removalReason: 'Returned to warehouse',
          removalNotes: qualityCheckNotes || existingRequest.notes,
          active: false,
          updatedBy: req.user!.id,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(vehicleInventoryAssignments.vehicleId, existingRequest.destinationVehicleId!),
            eq(vehicleInventoryAssignments.itemId, existingRequest.vehicleInventoryItemId!),
            eq(vehicleInventoryAssignments.active, true)
          )
        );

      // Increase destination warehouse stock
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} + ${finalQuantity}`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(materials.id, existingRequest.materialId),
            eq(materials.warehouseId, existingRequest.destinationWarehouseId!)
          )
        );

      // Create material transaction for entry
      await db.insert(materialTransactions).values({
        transactionType: 'entry',
        materialId: existingRequest.materialId,
        quantity: finalQuantity,
        transactionDate: new Date(),
        warehouseId: existingRequest.destinationWarehouseId!,
        vehicleId: existingRequest.destinationVehicleId!,
        description: `Return from vehicle (${existingRequest.requestNumber})`,
        approved: true,
        approvedBy: req.user!.id,
        approvalDate: new Date(),
        userId: req.user!.id
      });

    } else if (existingRequest.transferType === 'warehouse-to-employee') {
      // Decrease source warehouse stock
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} - ${finalQuantity}`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(materials.id, existingRequest.materialId),
            eq(materials.warehouseId, existingRequest.sourceWarehouseId)
          )
        );

      // Create material transaction for employee assignment
      await db.insert(materialTransactions).values({
        transactionType: 'exit',
        materialId: existingRequest.materialId,
        quantity: finalQuantity,
        transactionDate: new Date(),
        warehouseId: existingRequest.sourceWarehouseId,
        description: `Transfer to employee (${existingRequest.requestNumber})`,
        approved: true,
        approvedBy: req.user!.id,
        approvalDate: new Date(),
        userId: req.user!.id
      });

      // TODO: Create employee inventory assignment table in future
      logger.info(`Material transferred to employee ${existingRequest.destinationEmployeeId}`);
    }

    // Update transfer request status to completed
    const [updatedRequest] = await db.update(warehouseTransferRequests)
      .set({
        status: 'completed',
        completedDate: new Date(),
        receivedBy: req.user!.id,
        receivedDate: new Date(),
        transferredQuantity: finalQuantity,
        qualityCheck: qualityCheckNotes ? true : false,
        qualityCheckBy: qualityCheckNotes ? req.user!.id : null,
        qualityCheckDate: qualityCheckNotes ? new Date() : null,
        qualityCheckNotes: qualityCheckNotes || null,
        updatedAt: new Date()
      })
      .where(eq(warehouseTransferRequests.id, transferRequestId))
      .returning();

    logger.info(`Transfer request completed: ${updatedRequest.requestNumber} (${existingRequest.transferType}) by ${req.user!.username}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Transfer completed successfully'
    });
  } catch (error) {
    logger.error('Error completing transfer request:', error);
    next(error);
  }
});

// DELETE /api/materials/transfer-requests/:id - Delete transfer request (admin/manager only)
router.delete('/transfer-requests/:id', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const transferRequestId = parseInt(req.params.id);
    const db = getDb();

    // Check if transfer request exists
    const [existingRequest] = await db.select()
      .from(warehouseTransferRequests)
      .where(eq(warehouseTransferRequests.id, transferRequestId));

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Transfer request not found'
      });
    }

    // Delete the transfer request
    await db.delete(warehouseTransferRequests)
      .where(eq(warehouseTransferRequests.id, transferRequestId));

    logger.info(`Transfer request deleted: ${existingRequest.requestNumber} by ${req.user!.username}`);

    res.json({
      success: true,
      message: 'Transfer request deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting transfer request:', error);
    next(error);
  }
});

// ========== Material Transaction Routes ==========

const transactionSchema = z.object({
  transactionType: z.enum(['entry', 'exit', 'transfer']),
  materialId: z.number().positive(),
  quantity: z.number(),
  unitPrice: z.number().optional(),
  totalAmount: z.number().optional(),
  transactionDate: z.string().transform(date => new Date(date)),
  warehouseId: z.number().optional(),
  locationId: z.number().optional(),
  supplierId: z.number().optional(),
  invoiceNumber: z.string().optional(),
  workOrderId: z.number().optional(),
  vehicleId: z.number().optional(),
  description: z.string().optional(),
});

// POST /api/materials/transactions - Create material transaction
router.post('/transactions', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = transactionSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const db = getDb();

    const result = await db.insert(materialTransactions).values({
      ...data,
      userId,
      approved: false
    }).returning();

    if (data.transactionType === 'entry') {
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} + ${data.quantity}`,
          updatedAt: new Date()
        })
        .where(eq(materials.id, data.materialId));
    } else if (data.transactionType === 'exit') {
      await db.update(materials)
        .set({
          currentStock: sql`${materials.currentStock} - ${data.quantity}`,
          updatedAt: new Date()
        })
        .where(eq(materials.id, data.materialId));
    }

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// ========== Material CRUD Routes (must come after specific routes) ==========

// GET /api/materials/:id/transactions - Get material transactions
router.get('/:id/transactions', async (req, res, next) => {
  try {
    const materialId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const db = getDb();

    const results = await db.select()
      .from(materialTransactions)
      .where(eq(materialTransactions.materialId, materialId))
      .limit(limit)
      .offset(offset)
      .orderBy(materialTransactions.transactionDate);

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials/:id - Get material by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();
    const [material] = await db.select()
      .from(materials)
      .where(eq(materials.id, id))
      .limit(1);

    if (!material) {
      throw new AppError('Material not found', 404);
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/materials - Create material
router.post('/', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = materialSchema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(materials)
      .where(eq(materials.materialCode, data.materialCode))
      .limit(1);

    if (existing) {
      throw new AppError('Material code already exists', 409);
    }

    const result = await db.insert(materials).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/materials/:id - Update material
router.put('/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = materialSchema.partial().parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(materials)
      .where(eq(materials.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Material not found', 404);
    }

    const result = await db.update(materials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(materials.id, id))
      .returning();

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/materials/:id - Delete material
router.delete('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();

    const [existing] = await db.select()
      .from(materials)
      .where(eq(materials.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Material not found', 404);
    }

    await db.delete(materials).where(eq(materials.id, id));

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/materials/vehicles/:vehicleId/materials - Get all materials currently in a vehicle
router.get('/vehicles/:vehicleId/materials', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const db = getDb();

    // Get all completed warehouse-to-vehicle transfers (materials added to vehicle)
    const transfersToVehicle = await db.select({
      id: warehouseTransferRequests.id,
      requestNumber: warehouseTransferRequests.requestNumber,
      materialId: warehouseTransferRequests.materialId,
      materialCode: materials.materialCode,
      materialName: materials.materialName,
      quantity: warehouseTransferRequests.transferredQuantity,
      transferDate: warehouseTransferRequests.transferDate,
      completedDate: warehouseTransferRequests.completedDate,
      transferType: warehouseTransferRequests.transferType
    })
    .from(warehouseTransferRequests)
    .leftJoin(materials, eq(warehouseTransferRequests.materialId, materials.id))
    .where(
      and(
        eq(warehouseTransferRequests.destinationVehicleId, vehicleId),
        eq(warehouseTransferRequests.transferType, 'warehouse-to-vehicle'),
        eq(warehouseTransferRequests.status, 'completed')
      )
    )
    .orderBy(desc(warehouseTransferRequests.completedDate));

    // Get all completed vehicle-to-warehouse transfers (materials returned from vehicle)
    const transfersFromVehicle = await db.select({
      id: warehouseTransferRequests.id,
      materialId: warehouseTransferRequests.materialId,
      quantity: warehouseTransferRequests.transferredQuantity,
      transferDate: warehouseTransferRequests.transferDate
    })
    .from(warehouseTransferRequests)
    .where(
      and(
        eq(warehouseTransferRequests.sourceVehicleId, vehicleId),
        eq(warehouseTransferRequests.transferType, 'vehicle-to-warehouse'),
        eq(warehouseTransferRequests.status, 'completed')
      )
    );

    // Calculate net quantities for each material
    const materialQuantities = new Map<number, {
      materialId: number;
      materialCode: string;
      materialName: string;
      quantity: number;
      lastTransferDate: Date | null;
      requestNumber: string;
    }>();

    // Add materials from warehouse-to-vehicle transfers
    for (const transfer of transfersToVehicle) {
      const existing = materialQuantities.get(transfer.materialId!);
      const quantity = Number(transfer.quantity) || 0;

      if (existing) {
        existing.quantity += quantity;
      } else {
        materialQuantities.set(transfer.materialId!, {
          materialId: transfer.materialId!,
          materialCode: transfer.materialCode || '',
          materialName: transfer.materialName || '',
          quantity: quantity,
          lastTransferDate: transfer.completedDate,
          requestNumber: transfer.requestNumber
        });
      }
    }

    // Subtract materials from vehicle-to-warehouse transfers (returns)
    for (const transfer of transfersFromVehicle) {
      const existing = materialQuantities.get(transfer.materialId!);
      const quantity = Number(transfer.quantity) || 0;

      if (existing) {
        existing.quantity -= quantity;
      }
    }

    // Filter out materials with zero or negative quantities
    const activeMaterials = Array.from(materialQuantities.values())
      .filter(m => m.quantity > 0)
      .sort((a, b) => a.materialName.localeCompare(b.materialName));

    res.json({
      success: true,
      data: activeMaterials
    });
  } catch (error) {
    logger.error('Error fetching vehicle materials:', error);
    next(error);
  }
});

// Get materials currently assigned to an employee from unified transfer system
router.get('/employees/:employeeId/materials', authorize('admin', 'manager', 'operator'), async (req: AuthRequest, res, next) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const db = getDb();

    // Get all completed warehouse-to-employee transfers (materials assigned to employee)
    const transfersToEmployee = await db.select({
      id: warehouseTransferRequests.id,
      requestNumber: warehouseTransferRequests.requestNumber,
      materialId: warehouseTransferRequests.materialId,
      materialCode: materials.materialCode,
      materialName: materials.materialName,
      quantity: warehouseTransferRequests.transferredQuantity,
      transferDate: warehouseTransferRequests.transferDate,
      completedDate: warehouseTransferRequests.completedDate,
      transferType: warehouseTransferRequests.transferType
    })
    .from(warehouseTransferRequests)
    .leftJoin(materials, eq(warehouseTransferRequests.materialId, materials.id))
    .where(
      and(
        eq(warehouseTransferRequests.destinationEmployeeId, employeeId),
        eq(warehouseTransferRequests.transferType, 'warehouse-to-employee'),
        eq(warehouseTransferRequests.status, 'completed')
      )
    );

    // Calculate quantities for each material
    const materialQuantities = new Map();

    // Add materials from warehouse-to-employee transfers
    for (const transfer of transfersToEmployee) {
      const existing = materialQuantities.get(transfer.materialId);
      const quantity = Number(transfer.quantity) || 0;
      if (existing) {
        existing.quantity += quantity;
      } else {
        materialQuantities.set(transfer.materialId, {
          materialId: transfer.materialId,
          materialCode: transfer.materialCode || '',
          materialName: transfer.materialName || '',
          quantity: quantity,
          lastTransferDate: transfer.completedDate,
          requestNumber: transfer.requestNumber
        });
      }
    }

    // Filter out materials with zero or negative quantities
    const activeMaterials = Array.from(materialQuantities.values())
      .filter(m => m.quantity > 0)
      .sort((a, b) => a.materialName.localeCompare(b.materialName));

    res.json({
      success: true,
      data: activeMaterials
    });
  } catch (error) {
    logger.error('Error fetching employee materials:', error);
    next(error);
  }
});

export default router;
