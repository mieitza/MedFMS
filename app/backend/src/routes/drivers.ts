import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { drivers } from '../db/schema/drivers.js';
import { eq, like, or } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate);

const driverSchema = z.object({
  driverCode: z.string().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  fullName: z.string().min(1).max(100),
  idNumber: z.string().optional(),
  licenseNumber: z.string().min(1).max(50),
  licenseType: z.string().min(1).max(20),
  licenseExpiryDate: z.coerce.date().optional(),
  phoneNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  cityId: z.number().optional(),
  dateOfBirth: z.coerce.date().optional(),
  hireDate: z.coerce.date().optional(),
  departmentId: z.number().optional(),
  positionId: z.number().optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const db = getDb();

    let query = db.select().from(drivers);

    if (search) {
      query = query.where(
        or(
          like(drivers.driverCode, `%${search}%`),
          like(drivers.fullName, `%${search}%`),
          like(drivers.licenseNumber, `%${search}%`)
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

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();
    const [driver] = await db.select()
      .from(drivers)
      .where(eq(drivers.id, id))
      .limit(1);

    if (!driver) {
      throw new AppError('Driver not found', 404);
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = driverSchema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(drivers)
      .where(
        or(
          eq(drivers.driverCode, data.driverCode),
          eq(drivers.licenseNumber, data.licenseNumber)
        )
      )
      .limit(1);

    if (existing) {
      throw new AppError('Driver code or license number already exists', 409);
    }

    const result = await db.insert(drivers).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = driverSchema.partial().parse(req.body);

    const db = getDb();

    const result = await db.update(drivers)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(drivers.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Driver not found', 404);
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();

    const result = await db.update(drivers)
      .set({
        active: false,
        updatedAt: new Date()
      })
      .where(eq(drivers.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Driver not found', 404);
    }

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;