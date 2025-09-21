import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { materials, materialTransactions, warehouses } from '../db/schema/materials.js';
import { eq, like, or, sql } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

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

export default router;