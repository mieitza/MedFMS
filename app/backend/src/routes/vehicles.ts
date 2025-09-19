import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { vehicles } from '../db/schema/vehicles.js';
import { brands, models, vehicleTypes, vehicleStatuses } from '../db/schema/system.js';
import { drivers } from '../db/schema/drivers.js';
import { fuelTypes } from '../db/schema/fuel.js';
import { eq, like, and, or } from 'drizzle-orm';
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

    // Build query with joins
    let baseQuery = db
      .select({
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate,
        brandId: vehicles.brandId,
        brandName: brands.brandName,
        modelId: vehicles.modelId,
        modelName: models.modelName,
        year: vehicles.year,
        fuelTypeId: vehicles.fuelTypeId,
        fuelTypeName: fuelTypes.fuelName,
        vehicleTypeId: vehicles.vehicleTypeId,
        vehicleTypeName: vehicleTypes.typeName,
        statusId: vehicles.statusId,
        statusName: vehicleStatuses.statusName,
        driverId: vehicles.driverId,
        driverName: drivers.fullName,
        odometer: vehicles.odometer,
        description: vehicles.description,
        active: vehicles.active,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt
      })
      .from(vehicles)
      .leftJoin(brands, eq(vehicles.brandId, brands.id))
      .leftJoin(models, eq(vehicles.modelId, models.id))
      .leftJoin(fuelTypes, eq(vehicles.fuelTypeId, fuelTypes.id))
      .leftJoin(vehicleTypes, eq(vehicles.vehicleTypeId, vehicleTypes.id))
      .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
      .leftJoin(drivers, eq(vehicles.driverId, drivers.id))
      .where(eq(vehicles.active, true));

    if (search) {
      baseQuery = baseQuery.where(
        and(
          eq(vehicles.active, true),
          or(
            like(vehicles.vehicleCode, `%${search}%`),
            like(vehicles.licensePlate, `%${search}%`),
            like(brands.brandName, `%${search}%`),
            like(models.modelName, `%${search}%`)
          )
        )
      );
    }

    const results = await baseQuery.limit(limit).offset(offset);

    // Get total count for pagination
    const totalQuery = db
      .select({ count: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.active, true));

    if (search) {
      totalQuery.where(
        and(
          eq(vehicles.active, true),
          or(
            like(vehicles.vehicleCode, `%${search}%`),
            like(vehicles.licensePlate, `%${search}%`)
          )
        )
      );
    }

    const totalResult = await totalQuery;
    const total = totalResult.length;

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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