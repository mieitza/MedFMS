import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import {
  vehicleInventoryCategories,
  vehicleInventoryItems,
  vehicleInventoryAssignments,
  vehicleInventoryInspections,
  vehicleInventoryDispensing
} from '../db/schema/vehicleInventory.js';
import { vehicles } from '../db/schema/vehicles.js';
import { eq, and, desc, or, like } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Validation schemas
const categorySchema = z.object({
  categoryCode: z.string().min(1).max(50),
  categoryName: z.string().min(1).max(100),
  description: z.string().optional(),
  requiresExpiration: z.boolean().optional(),
  requiresSerialNumber: z.boolean().optional(),
});

const itemSchema = z.object({
  itemCode: z.string().min(1).max(50),
  itemName: z.string().min(1).max(100),
  categoryId: z.number().positive(),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
  standardPrice: z.number().optional(),
  requiresExpiration: z.boolean().optional(),
  requiresSerialNumber: z.boolean().optional(),
  requiresCertification: z.boolean().optional(),
});

const assignmentSchema = z.object({
  vehicleId: z.number().positive(),
  itemId: z.number().positive(),
  serialNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  quantity: z.number().positive().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'damaged']).optional(),
  status: z.enum(['active', 'expired', 'damaged', 'removed', 'maintenance']).optional(),
  purchaseDate: z.number().optional(),
  purchasePrice: z.number().optional(),
  supplierId: z.number().optional(),
  assignmentDate: z.number().optional(),
  expirationDate: z.number().optional(),
  manufactureDate: z.number().optional(),
  lastInspectionDate: z.number().optional(),
  nextInspectionDate: z.number().optional(),
  certificationNumber: z.string().optional(),
  certificationDate: z.number().optional(),
  certificationExpiryDate: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const inspectionSchema = z.object({
  assignmentId: z.number().positive(),
  inspectionDate: z.number(),
  inspectorId: z.number().optional().nullable(),
  inspectionType: z.string().min(1), // Now dynamic - fetched from inspection_types table
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'damaged']),
  notes: z.string().optional().nullable(),
  issuesFound: z.string().optional().nullable(),
  actionTaken: z.string().optional().nullable(),
  nextInspectionDate: z.number().optional().nullable(),
  passed: z.boolean().optional().nullable(),
});

const dispensingSchema = z.object({
  assignmentId: z.number().positive(),
  vehicleId: z.number().positive(),
  dispensedBy: z.number().positive(),
  dispensedDate: z.number(),
  quantityDispensed: z.number().positive(),
  patientName: z.string().optional(),
  patientId: z.string().optional(),
  patientAge: z.number().optional(),
  patientGender: z.string().optional(),
  incidentType: z.string().optional(),
  incidentLocation: z.string().optional(),
  incidentDescription: z.string().optional(),
  diagnosis: z.string().optional(),
  symptoms: z.string().optional(),
  treatmentNotes: z.string().optional(),
  dispatchNumber: z.string().optional(),
  missionId: z.number().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// ===== CATEGORIES =====

// Get all categories
router.get('/categories', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db
      .select()
      .from(vehicleInventoryCategories)
      .where(eq(vehicleInventoryCategories.active, true))
      .orderBy(vehicleInventoryCategories.categoryName);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Create category
router.post('/categories', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const db = getDb();

    const result = await db.insert(vehicleInventoryCategories).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// ===== ITEMS =====

// Get all items
router.get('/items', async (req, res, next) => {
  try {
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

    const db = getDb();
    let query = db
      .select({
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories
      })
      .from(vehicleInventoryItems)
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .where(eq(vehicleInventoryItems.active, true));

    if (search) {
      query = query.where(
        and(
          eq(vehicleInventoryItems.active, true),
          or(
            like(vehicleInventoryItems.itemCode, `%${search}%`),
            like(vehicleInventoryItems.itemName, `%${search}%`)
          )
        )
      );
    }

    if (categoryId) {
      query = query.where(
        and(
          eq(vehicleInventoryItems.active, true),
          eq(vehicleInventoryItems.categoryId, categoryId)
        )
      );
    }

    const results = await query.orderBy(vehicleInventoryItems.itemName);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Get item by ID
router.get('/items/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [result] = await db
      .select({
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories
      })
      .from(vehicleInventoryItems)
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .where(and(eq(vehicleInventoryItems.id, id), eq(vehicleInventoryItems.active, true)))
      .limit(1);

    if (!result) {
      throw new AppError('Item not found', 404);
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Create item
router.post('/items', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const data = itemSchema.parse(req.body);
    const db = getDb();

    const result = await db.insert(vehicleInventoryItems).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update item
router.put('/items/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = itemSchema.partial().parse(req.body);
    const db = getDb();

    const result = await db
      .update(vehicleInventoryItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vehicleInventoryItems.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Item not found', 404);
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete item (soft delete)
router.delete('/items/:id', authorize('admin'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const result = await db
      .update(vehicleInventoryItems)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(vehicleInventoryItems.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Item not found', 404);
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ===== ASSIGNMENTS =====

// Get assignments for a vehicle
router.get('/vehicles/:vehicleId/assignments', async (req, res, next) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const status = req.query.status as string;

    const db = getDb();
    let query = db
      .select({
        assignment: vehicleInventoryAssignments,
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories
      })
      .from(vehicleInventoryAssignments)
      .leftJoin(vehicleInventoryItems, eq(vehicleInventoryAssignments.itemId, vehicleInventoryItems.id))
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .where(
        and(
          eq(vehicleInventoryAssignments.vehicleId, vehicleId),
          eq(vehicleInventoryAssignments.active, true)
        )
      );

    if (status) {
      query = query.where(
        and(
          eq(vehicleInventoryAssignments.vehicleId, vehicleId),
          eq(vehicleInventoryAssignments.active, true),
          eq(vehicleInventoryAssignments.status, status)
        )
      );
    }

    const results = await query.orderBy(vehicleInventoryItems.itemName);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Get assignment by ID
router.get('/assignments/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [result] = await db
      .select({
        assignment: vehicleInventoryAssignments,
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories,
        vehicle: vehicles
      })
      .from(vehicleInventoryAssignments)
      .leftJoin(vehicleInventoryItems, eq(vehicleInventoryAssignments.itemId, vehicleInventoryItems.id))
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .leftJoin(vehicles, eq(vehicleInventoryAssignments.vehicleId, vehicles.id))
      .where(and(eq(vehicleInventoryAssignments.id, id), eq(vehicleInventoryAssignments.active, true)))
      .limit(1);

    if (!result) {
      throw new AppError('Assignment not found', 404);
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Create assignment
router.post('/assignments', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = assignmentSchema.parse(req.body);
    const db = getDb();

    const userId = (req as any).user?.id;

    const result = await db.insert(vehicleInventoryAssignments).values({
      ...data,
      createdBy: userId
    }).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update assignment
router.put('/assignments/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = assignmentSchema.partial().parse(req.body);
    const db = getDb();

    const userId = (req as any).user?.id;

    const result = await db
      .update(vehicleInventoryAssignments)
      .set({ ...data, updatedAt: new Date(), updatedBy: userId })
      .where(eq(vehicleInventoryAssignments.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Assignment not found', 404);
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Remove assignment (soft delete)
router.delete('/assignments/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const result = await db
      .update(vehicleInventoryAssignments)
      .set({
        active: false,
        status: 'removed',
        removalDate: Date.now(),
        updatedAt: new Date()
      })
      .where(eq(vehicleInventoryAssignments.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Assignment not found', 404);
    }

    res.json({
      success: true,
      message: 'Assignment removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ===== INSPECTIONS =====

// Get inspections for an assignment
router.get('/assignments/:assignmentId/inspections', async (req, res, next) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const db = getDb();

    const results = await db
      .select()
      .from(vehicleInventoryInspections)
      .where(eq(vehicleInventoryInspections.assignmentId, assignmentId))
      .orderBy(desc(vehicleInventoryInspections.inspectionDate));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Create inspection
router.post('/inspections', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = inspectionSchema.parse(req.body);
    const db = getDb();

    const userId = (req as any).user?.id;

    // Convert timestamp numbers to Date objects for drizzle's timestamp mode
    const inspectionDate = new Date(data.inspectionDate);
    const nextInspectionDate = data.nextInspectionDate ? new Date(data.nextInspectionDate) : null;

    const result = await db.insert(vehicleInventoryInspections).values({
      assignmentId: data.assignmentId,
      inspectionDate,
      inspectorId: data.inspectorId ?? undefined,
      inspectionType: data.inspectionType,
      condition: data.condition,
      notes: data.notes ?? undefined,
      issuesFound: data.issuesFound ?? undefined,
      actionTaken: data.actionTaken ?? undefined,
      nextInspectionDate: nextInspectionDate ?? undefined,
      passed: data.passed ?? true,
      createdBy: userId
    }).returning();

    // Update the assignment's last inspection date
    await db
      .update(vehicleInventoryAssignments)
      .set({
        lastInspectionDate: inspectionDate,
        nextInspectionDate: nextInspectionDate ?? undefined,
        condition: data.condition,
        updatedAt: new Date()
      })
      .where(eq(vehicleInventoryAssignments.id, data.assignmentId));

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// ===== DISPENSING =====

// Get dispensing records for a vehicle
router.get('/vehicles/:vehicleId/dispensing', async (req, res, next) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const db = getDb();

    const results = await db
      .select({
        dispensing: vehicleInventoryDispensing,
        assignment: vehicleInventoryAssignments,
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories
      })
      .from(vehicleInventoryDispensing)
      .leftJoin(vehicleInventoryAssignments, eq(vehicleInventoryDispensing.assignmentId, vehicleInventoryAssignments.id))
      .leftJoin(vehicleInventoryItems, eq(vehicleInventoryAssignments.itemId, vehicleInventoryItems.id))
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .where(eq(vehicleInventoryDispensing.vehicleId, vehicleId))
      .orderBy(desc(vehicleInventoryDispensing.dispensedDate));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Get dispensing records for an assignment
router.get('/assignments/:assignmentId/dispensing', async (req, res, next) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const db = getDb();

    const results = await db
      .select()
      .from(vehicleInventoryDispensing)
      .where(eq(vehicleInventoryDispensing.assignmentId, assignmentId))
      .orderBy(desc(vehicleInventoryDispensing.dispensedDate));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Create dispensing record (dispense item to patient)
router.post('/dispensing', authorize('admin', 'manager', 'operator', 'driver'), async (req, res, next) => {
  try {
    const data = dispensingSchema.parse(req.body);
    const db = getDb();

    const userId = (req as any).user?.id;

    // Get the current assignment to check available quantity
    const [assignment] = await db
      .select()
      .from(vehicleInventoryAssignments)
      .where(eq(vehicleInventoryAssignments.id, data.assignmentId))
      .limit(1);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    if (assignment.quantity < data.quantityDispensed) {
      throw new AppError('Insufficient quantity available', 400);
    }

    // Create dispensing record
    const result = await db.insert(vehicleInventoryDispensing).values({
      ...data,
      createdBy: userId
    }).returning();

    // Update assignment quantity
    const newQuantity = assignment.quantity - data.quantityDispensed;
    await db
      .update(vehicleInventoryAssignments)
      .set({
        quantity: newQuantity,
        status: newQuantity === 0 ? 'removed' : assignment.status,
        updatedAt: new Date(),
        updatedBy: userId
      })
      .where(eq(vehicleInventoryAssignments.id, data.assignmentId));

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get dispensing record by ID
router.get('/dispensing/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [result] = await db
      .select({
        dispensing: vehicleInventoryDispensing,
        assignment: vehicleInventoryAssignments,
        item: vehicleInventoryItems,
        category: vehicleInventoryCategories,
        vehicle: vehicles
      })
      .from(vehicleInventoryDispensing)
      .leftJoin(vehicleInventoryAssignments, eq(vehicleInventoryDispensing.assignmentId, vehicleInventoryAssignments.id))
      .leftJoin(vehicleInventoryItems, eq(vehicleInventoryAssignments.itemId, vehicleInventoryItems.id))
      .leftJoin(vehicleInventoryCategories, eq(vehicleInventoryItems.categoryId, vehicleInventoryCategories.id))
      .leftJoin(vehicles, eq(vehicleInventoryDispensing.vehicleId, vehicles.id))
      .where(eq(vehicleInventoryDispensing.id, id))
      .limit(1);

    if (!result) {
      throw new AppError('Dispensing record not found', 404);
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
