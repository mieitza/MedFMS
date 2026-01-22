import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { companies } from '../db/schema/companies.js';
import { users } from '../db/schema/users.js';
import { eq, and, like, sql, desc } from 'drizzle-orm';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/companies - List all companies (super_admin only)
router.get('/', authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();
    const { search, active } = req.query;

    let query = db.select().from(companies);

    // Build conditions
    const conditions = [];

    if (search) {
      conditions.push(
        like(companies.companyName, `%${search}%`)
      );
    }

    if (active !== undefined) {
      conditions.push(eq(companies.active, active === 'true'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(desc(companies.createdAt));

    // Get user count per company
    const companiesWithStats = await Promise.all(
      result.map(async (company) => {
        const [userCount] = await db.select({ count: sql<number>`count(*)` })
          .from(users)
          .where(eq(users.companyId, company.id));

        return {
          ...company,
          userCount: userCount?.count || 0
        };
      })
    );

    res.json({
      success: true,
      data: companiesWithStats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies/:id - Get single company
router.get('/:id', authorize('super_admin', 'admin'), async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    // Non-super_admin can only view their own company
    if (req.user?.role !== 'super_admin' && req.user?.companyId !== id) {
      throw new AppError('Access denied', 403);
    }

    const [company] = await db.select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    // Get user count
    const [userCount] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.companyId, id));

    res.json({
      success: true,
      data: {
        ...company,
        userCount: userCount?.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/companies - Create new company (super_admin only)
router.post('/', authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      companyCode: z.string().min(1).max(50),
      companyName: z.string().min(1).max(100),
      legalName: z.string().optional(),
      taxId: z.string().optional(),
      registrationNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      phoneNumber: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      logo: z.string().optional(),
      settings: z.object({
        currency: z.string().optional(),
        dateFormat: z.string().optional(),
        timezone: z.string().optional(),
        language: z.string().optional(),
        enableFuelManagement: z.boolean().optional(),
        enableMaterialsManagement: z.boolean().optional(),
        enableMaintenanceManagement: z.boolean().optional(),
        enableTireManagement: z.boolean().optional(),
        maxUsers: z.number().optional(),
        maxVehicles: z.number().optional(),
      }).optional(),
    });

    const data = schema.parse(req.body);
    const db = getDb();

    // Check if company code already exists
    const [existing] = await db.select({ id: companies.id })
      .from(companies)
      .where(eq(companies.companyCode, data.companyCode))
      .limit(1);

    if (existing) {
      throw new AppError('Company code already exists', 400);
    }

    const [result] = await db.insert(companies)
      .values({
        ...data,
        settings: data.settings ? JSON.stringify(data.settings) : null,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400));
    }
    next(error);
  }
});

// PUT /api/companies/:id - Update company (super_admin only)
router.put('/:id', authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const schema = z.object({
      companyCode: z.string().min(1).max(50).optional(),
      companyName: z.string().min(1).max(100).optional(),
      legalName: z.string().optional(),
      taxId: z.string().optional(),
      registrationNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      phoneNumber: z.string().optional(),
      email: z.string().email().optional().nullable(),
      website: z.string().url().optional().nullable(),
      logo: z.string().optional(),
      settings: z.object({
        currency: z.string().optional(),
        dateFormat: z.string().optional(),
        timezone: z.string().optional(),
        language: z.string().optional(),
        enableFuelManagement: z.boolean().optional(),
        enableMaterialsManagement: z.boolean().optional(),
        enableMaintenanceManagement: z.boolean().optional(),
        enableTireManagement: z.boolean().optional(),
        maxUsers: z.number().optional(),
        maxVehicles: z.number().optional(),
      }).optional(),
      active: z.boolean().optional(),
    });

    const data = schema.parse(req.body);
    const db = getDb();

    // Check if company exists
    const [existing] = await db.select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Company not found', 404);
    }

    // If changing company code, check it doesn't conflict
    if (data.companyCode && data.companyCode !== existing.companyCode) {
      const [conflict] = await db.select({ id: companies.id })
        .from(companies)
        .where(eq(companies.companyCode, data.companyCode))
        .limit(1);

      if (conflict) {
        throw new AppError('Company code already exists', 400);
      }
    }

    const [result] = await db.update(companies)
      .set({
        ...data,
        settings: data.settings ? JSON.stringify(data.settings) : existing.settings,
        updatedAt: new Date()
      })
      .where(eq(companies.id, id))
      .returning();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Validation error: ' + error.errors.map(e => e.message).join(', '), 400));
    }
    next(error);
  }
});

// DELETE /api/companies/:id - Delete company (super_admin only)
router.delete('/:id', authorize('super_admin'), async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    // Check if company exists
    const [existing] = await db.select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!existing) {
      throw new AppError('Company not found', 404);
    }

    // Prevent deleting the default company
    if (existing.companyCode === 'DEFAULT') {
      throw new AppError('Cannot delete the default company', 400);
    }

    // Check if company has users
    const [userCount] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.companyId, id));

    if (userCount && userCount.count > 0) {
      throw new AppError('Cannot delete company with assigned users. Please reassign or remove users first.', 400);
    }

    // Soft delete (set active = false) instead of hard delete
    await db.update(companies)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(companies.id, id));

    res.json({
      success: true,
      message: 'Company deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies/my-company - Get current user's company
router.get('/my-company', async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();

    if (!req.user?.companyId) {
      // Super admin without selected company
      return res.json({
        success: true,
        data: null
      });
    }

    const [company] = await db.select()
      .from(companies)
      .where(eq(companies.id, req.user.companyId))
      .limit(1);

    res.json({
      success: true,
      data: company || null
    });
  } catch (error) {
    next(error);
  }
});

export default router;
