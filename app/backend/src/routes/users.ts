import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq, like, or, desc } from 'drizzle-orm';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  pin: z.string().min(4).max(8),
  fullName: z.string().min(1).max(100),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']),
  departmentId: z.number().positive().optional(),
  locationId: z.number().positive().optional(),
  phoneNumber: z.string().optional(),
  active: z.boolean().optional()
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(1).max(100).optional(),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']).optional(),
  departmentId: z.number().positive().nullable().optional(),
  locationId: z.number().positive().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  active: z.boolean().optional()
});

const changePinSchema = z.object({
  currentPin: z.string().min(4).max(8),
  newPin: z.string().min(4).max(8)
});

const resetPinSchema = z.object({
  newPin: z.string().min(4).max(8)
});

// GET /api/users - List all users (admin, manager)
router.get('/', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const { page = '1', limit = '50', search = '', role = '', active = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = getDb();
    let query = db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      departmentId: users.departmentId,
      locationId: users.locationId,
      phoneNumber: users.phoneNumber,
      active: users.active,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    }).from(users);

    // Apply filters
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(users.username, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.fullName, `%${search}%`)
        )
      );
    }
    if (role) {
      conditions.push(eq(users.role, role as string));
    }
    if (active !== '') {
      conditions.push(eq(users.active, active === 'true'));
    }

    if (conditions.length > 0) {
      query = query.where(or(...conditions));
    }

    const result = await query
      .orderBy(desc(users.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: users.id })
      .from(users)
      .execute() as any;

    res.json({
      success: true,
      data: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || result.length,
        totalPages: Math.ceil((count || result.length) / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
});

// GET /api/users/me - Get current user profile
router.get('/me', async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();

    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }

    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      departmentId: users.departmentId,
      locationId: users.locationId,
      phoneNumber: users.phoneNumber,
      active: users.active,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    next(error);
  }
});

// PUT /api/users/me - Update own profile
router.put('/me', async (req: AuthRequest, res, next) => {
  try {
    const updateOwnProfileSchema = z.object({
      email: z.string().email().optional(),
      fullName: z.string().min(1).max(100).optional(),
      phoneNumber: z.string().nullable().optional()
    });

    const data = updateOwnProfileSchema.parse(req.body);
    const db = getDb();

    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }

    // Check email uniqueness if changed
    if (data.email) {
      const [emailExists] = await db.select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (emailExists && emailExists.id !== req.user.id) {
        throw new AppError('Email already exists', 409);
      }
    }

    const result = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user.id))
      .returning();

    logger.info(`Profile updated by user: ${req.user.username}`);

    res.json({
      success: true,
      data: result[0],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    next(error);
  }
});

// PATCH /api/users/me/change-pin - Change own PIN
router.patch('/me/change-pin', async (req: AuthRequest, res, next) => {
  try {
    const { currentPin, newPin } = changePinSchema.parse(req.body);
    const db = getDb();

    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }

    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current PIN
    const validPin = await bcrypt.compare(currentPin, user.pin);
    if (!validPin) {
      throw new AppError('Current PIN is incorrect', 400);
    }

    // Hash new PIN
    const hashedPin = await bcrypt.hash(newPin, parseInt(process.env.PIN_SALT_ROUNDS || '10'));

    await db.update(users)
      .set({ pin: hashedPin, updatedAt: new Date() })
      .where(eq(users.id, req.user.id));

    logger.info(`PIN changed for user: ${user.username}`);

    res.json({
      success: true,
      message: 'PIN changed successfully'
    });
  } catch (error) {
    logger.error('Error changing PIN:', error);
    next(error);
  }
});

// GET /api/users/:id - Get user details
router.get('/:id', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDb();

    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      departmentId: users.departmentId,
      locationId: users.locationId,
      phoneNumber: users.phoneNumber,
      active: users.active,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching user:', error);
    next(error);
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', authorize('admin'), async (req: AuthRequest, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const db = getDb();

    // Check if username exists
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existingUser) {
      throw new AppError('Username already exists', 409);
    }

    // Check if email exists
    const [existingEmail] = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingEmail) {
      throw new AppError('Email already exists', 409);
    }

    // Hash PIN
    const hashedPin = await bcrypt.hash(data.pin, parseInt(process.env.PIN_SALT_ROUNDS || '10'));

    // Create user
    const result = await db.insert(users).values({
      username: data.username,
      email: data.email,
      pin: hashedPin,
      fullName: data.fullName,
      role: data.role,
      departmentId: data.departmentId,
      locationId: data.locationId,
      phoneNumber: data.phoneNumber,
      active: data.active !== undefined ? data.active : true
    }).returning();

    const newUser = result[0];

    logger.info(`User created: ${newUser.username} by ${req.user?.username}`);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      },
      message: 'User created successfully'
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    next(error);
  }
});

// PUT /api/users/:id - Update user (admin, manager with restrictions)
router.put('/:id', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const data = updateUserSchema.parse(req.body);
    const db = getDb();

    // Get existing user
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Managers cannot modify admins or change roles
    if (req.user?.role === 'manager') {
      if (existingUser.role === 'admin') {
        throw new AppError('Managers cannot modify admin users', 403);
      }
      if (data.role && data.role !== existingUser.role) {
        throw new AppError('Managers cannot change user roles', 403);
      }
    }

    // Check email uniqueness if changed
    if (data.email && data.email !== existingUser.email) {
      const [emailExists] = await db.select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (emailExists) {
        throw new AppError('Email already exists', 409);
      }
    }

    // Update user
    const result = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    logger.info(`User updated: ${existingUser.username} by ${req.user?.username}`);

    res.json({
      success: true,
      data: result[0],
      message: 'User updated successfully'
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    next(error);
  }
});

// DELETE /api/users/:id - Soft delete user (admin only)
router.delete('/:id', authorize('admin'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDb();

    // Prevent self-deletion
    if (userId === req.user?.id) {
      throw new AppError('Cannot delete your own account', 400);
    }

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Soft delete by setting active to false
    await db.update(users)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(users.id, userId));

    logger.info(`User deleted: ${existingUser.username} by ${req.user?.username}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    next(error);
  }
});

// PATCH /api/users/:id/activate - Activate user (admin only)
router.patch('/:id/activate', authorize('admin'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDb();

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    await db.update(users)
      .set({ active: true, updatedAt: new Date() })
      .where(eq(users.id, userId));

    logger.info(`User activated: ${existingUser.username} by ${req.user?.username}`);

    res.json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    logger.error('Error activating user:', error);
    next(error);
  }
});

// PATCH /api/users/:id/deactivate - Deactivate user (admin only)
router.patch('/:id/deactivate', authorize('admin'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDb();

    // Prevent self-deactivation
    if (userId === req.user?.id) {
      throw new AppError('Cannot deactivate your own account', 400);
    }

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    await db.update(users)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(users.id, userId));

    logger.info(`User deactivated: ${existingUser.username} by ${req.user?.username}`);

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    logger.error('Error deactivating user:', error);
    next(error);
  }
});

// PATCH /api/users/:id/reset-pin - Reset user PIN (admin only)
router.patch('/:id/reset-pin', authorize('admin'), async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPin } = resetPinSchema.parse(req.body);
    const db = getDb();

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Hash new PIN
    const hashedPin = await bcrypt.hash(newPin, parseInt(process.env.PIN_SALT_ROUNDS || '10'));

    await db.update(users)
      .set({ pin: hashedPin, updatedAt: new Date() })
      .where(eq(users.id, userId));

    logger.info(`PIN reset for user: ${existingUser.username} by ${req.user?.username}`);

    res.json({
      success: true,
      message: 'PIN reset successfully'
    });
  } catch (error) {
    logger.error('Error resetting PIN:', error);
    next(error);
  }
});

export default router;
