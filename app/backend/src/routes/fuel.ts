import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { fuelTransactions, fuelTypes } from '../db/schema/fuel.js';
import { eq } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate);

const fuelTransactionSchema = z.object({
  transactionType: z.enum(['entry', 'exit', 'transfer']),
  vehicleId: z.number().optional(),
  driverId: z.number().optional(),
  fuelTypeId: z.number().positive(),
  quantity: z.number().positive(),
  pricePerUnit: z.number().positive(),
  totalAmount: z.number().positive(),
  odometer: z.number().optional(),
  transactionDate: z.coerce.date(),
  locationId: z.number().optional(),
  supplierId: z.number().optional(),
  invoiceNumber: z.string().optional(),
  description: z.string().optional(),
});

router.get('/transactions', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const vehicleId = req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined;
    const offset = (page - 1) * limit;

    const db = getDb();

    let query = db.select().from(fuelTransactions);

    if (vehicleId) {
      query = query.where(eq(fuelTransactions.vehicleId, vehicleId));
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

router.get('/types', async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(fuelTypes);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

router.post('/transactions', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = fuelTransactionSchema.parse(req.body);

    const db = getDb();

    const result = await db.insert(fuelTransactions).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

router.post('/types', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const schema = z.object({
      fuelCode: z.string().min(1).max(50),
      fuelName: z.string().min(1).max(100),
      description: z.string().optional(),
      unit: z.string().default('L'),
      currentPrice: z.number().positive(),
      density: z.number().optional(),
    });

    const data = schema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(fuelTypes)
      .where(eq(fuelTypes.fuelCode, data.fuelCode))
      .limit(1);

    if (existing) {
      throw new AppError('Fuel type code already exists', 409);
    }

    const result = await db.insert(fuelTypes).values(data).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;