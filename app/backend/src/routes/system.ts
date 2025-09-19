import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { brands, models, locations, departments, cities, vehicleTypes, vehicleStatuses } from '../db/schema/system.js';
import { eq } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate);

// Brands endpoints
router.get('/brands', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(brands);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

router.post('/brands', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const schema = z.object({
      brandCode: z.string().min(1).max(50),
      brandName: z.string().min(1).max(100),
      description: z.string().optional(),
      country: z.string().optional(),
    });

    const data = schema.parse(req.body);
    const db = getDb();

    const result = await db.insert(brands).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Models endpoints
router.get('/models', async (req, res, next) => {
  try {
    const brandId = req.query.brandId ? parseInt(req.query.brandId as string) : undefined;
    const db = getDb();

    let query = db.select().from(models);

    if (brandId) {
      query = query.where(eq(models.brandId, brandId));
    }

    const results = await query;

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Locations endpoints
router.get('/locations', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(locations);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Departments endpoints
router.get('/departments', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(departments);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Cities endpoints
router.get('/cities', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(cities);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Vehicle types endpoints
router.get('/vehicle-types', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(vehicleTypes);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Vehicle statuses endpoints
router.get('/vehicle-statuses', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(vehicleStatuses);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

export default router;