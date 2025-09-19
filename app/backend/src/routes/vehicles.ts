import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { vehicles } from '../db/schema/vehicles.js';
import { eq, like, and } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

const vehicleSchema = z.object({
  vehicleCode: z.string().min(1).max(50),
  licensePlate: z.string().min(1).max(20),
  brandId: z.number().positive(),
  modelId: z.number().positive(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  fuelTypeId: z.number().positive(),
  vehicleTypeId: z.number().positive(),
  statusId: z.number().positive(),
  locationId: z.number().optional(),
  departmentId: z.number().optional(),
  driverId: z.number().optional(),
  odometer: z.number().min(0).optional(),
  description: z.string().optional(),
});

// Get all vehicles with pagination and search
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const db = getDb();

    let query = db.select().from(vehicles);

    if (search) {
      query = query.where(
        or(
          like(vehicles.vehicleCode, `%${search}%`),
          like(vehicles.licensePlate, `%${search}%`)
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

// Get vehicle by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();
    const [vehicle] = await db.select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1);

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// Create new vehicle
router.post('/', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = vehicleSchema.parse(req.body);

    const db = getDb();

    // Check if vehicle code or license plate already exists
    const [existing] = await db.select()
      .from(vehicles)
      .where(
        or(
          eq(vehicles.vehicleCode, data.vehicleCode),
          eq(vehicles.licensePlate, data.licensePlate)
        )
      )
      .limit(1);

    if (existing) {
      throw new AppError('Vehicle code or license plate already exists', 409);
    }

    const result = await db.insert(vehicles).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update vehicle
router.put('/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = vehicleSchema.partial().parse(req.body);

    const db = getDb();

    const result = await db.update(vehicles)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete vehicle (soft delete)
router.delete('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();

    const result = await db.update(vehicles)
      .set({
        active: false,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Fix missing import
import { or } from 'drizzle-orm';

export default router;