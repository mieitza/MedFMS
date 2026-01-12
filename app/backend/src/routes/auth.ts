import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getDb } from '../db/index.js';
import { users, sessions } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';
import { createAuditLog } from '../middleware/audit.js';
import { validatePassword, isLegacyPin } from '../utils/passwordValidation.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Login schema - accepts both legacy PIN (4-8 chars) and new password (8+ chars)
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(4) // Min 4 to support legacy PIN during migration
});

// Register schema - requires strong password
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(100),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']).optional()
});

// Password reset schema
const resetPasswordSchema = z.object({
  currentPassword: z.string().min(4), // Min 4 to support legacy PIN
  newPassword: z.string().min(8)
});

router.post('/login', strictRateLimiter, async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const db = getDb();

    // Find user
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user || !user.active) {
      throw new AppError('Invalid credentials', 401);
    }

    // Get the stored hash (prefer password field, fallback to pin for migration)
    const storedHash = user.password || user.pin;
    if (!storedHash) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password/PIN
    const validPassword = await bcrypt.compare(password, storedHash);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Create session
    const sessionId = nanoid();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      token,
      expiresAt
    });

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Audit log
    await createAuditLog(
      { id: user.id, username: user.username },
      'LOGIN',
      'auth',
      user.id,
      { role: user.role },
      req
    );

    res.json({
      success: true,
      data: {
        token,
        mustResetPassword: user.mustResetPassword ?? false,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.errors.join('. '), 400);
    }

    const db = getDb();

    // Check if user exists
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existingUser) {
      throw new AppError('Username already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.PASSWORD_SALT_ROUNDS || '10'));

    // Create user with password (no PIN, mustResetPassword = false for new users)
    const result = await db.insert(users).values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      mustResetPassword: false,
      fullName: data.fullName,
      role: data.role || 'viewer'
    }).returning();

    const newUser = result[0];

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Reset password endpoint (for forced password resets and voluntary changes)
router.post('/reset-password', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = resetPasswordSchema.parse(req.body);

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.errors.join('. '), 400);
    }

    const db = getDb();

    // Get current user
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password (check both password and legacy pin)
    const storedHash = user.password || user.pin;
    if (!storedHash) {
      throw new AppError('No password set', 400);
    }

    const validCurrentPassword = await bcrypt.compare(currentPassword, storedHash);
    if (!validCurrentPassword) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_SALT_ROUNDS || '10'));

    // Update user with new password and clear mustResetPassword flag
    await db.update(users)
      .set({
        password: hashedPassword,
        mustResetPassword: false,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user!.id));

    // Audit log
    await createAuditLog(
      { id: user.id, username: user.username },
      'UPDATE',
      'auth',
      user.id,
      { action: 'password_reset' },
      req
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const db = getDb();

      // Get session before deleting for audit log
      const [session] = await db.select()
        .from(sessions)
        .where(eq(sessions.token, token))
        .limit(1);

      if (session) {
        const [user] = await db.select()
          .from(users)
          .where(eq(users.id, session.userId))
          .limit(1);

        await db.delete(sessions).where(eq(sessions.token, token));

        // Audit log
        if (user) {
          await createAuditLog(
            { id: user.id, username: user.username },
            'LOGOUT',
            'auth',
            user.id,
            null,
            req
          );
        }
      }
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
