import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { employees } from '../db/schema/employees.js';
import { eq, like, or, and } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate);

const employeeSchema = z.object({
  employeeCode: z.string().min(1).max(50),
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

    let baseQuery = db.select().from(employees).where(eq(employees.active, true));

    if (search) {
      baseQuery = baseQuery.where(
        and(
          eq(employees.active, true),
          or(
            like(employees.employeeCode, `%${search}%`),
            like(employees.fullName, `%${search}%`),
            like(employees.licenseNumber, `%${search}%`),
            like(employees.email, `%${search}%`)
          )
        )
      );
    }

    const results = await baseQuery.limit(limit).offset(offset);

    // Get total count for pagination
    let totalQuery = db.select({ count: employees.id }).from(employees).where(eq(employees.active, true));

    if (search) {
      totalQuery = totalQuery.where(
        and(
          eq(employees.active, true),
          or(
            like(employees.employeeCode, `%${search}%`),
            like(employees.fullName, `%${search}%`),
            like(employees.licenseNumber, `%${search}%`),
            like(employees.email, `%${search}%`)
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

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();
    const [employee] = await db.select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = employeeSchema.parse(req.body);

    const db = getDb();

    const [existing] = await db.select()
      .from(employees)
      .where(
        or(
          eq(employees.employeeCode, data.employeeCode),
          eq(employees.licenseNumber, data.licenseNumber)
        )
      )
      .limit(1);

    if (existing) {
      throw new AppError('Employee code or license number already exists', 409);
    }

    const result = await db.insert(employees).values(data).returning();

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
    const data = employeeSchema.partial().parse(req.body);

    const db = getDb();

    const result = await db.update(employees)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(employees.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Employee not found', 404);
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

    const result = await db.update(employees)
      .set({
        active: false,
        updatedAt: new Date()
      })
      .where(eq(employees.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Employee not found', 404);
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
