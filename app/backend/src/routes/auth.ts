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

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  pin: z.string().min(4).max(8)
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  pin: z.string().min(4).max(8),
  fullName: z.string().min(1).max(100),
  role: z.enum(['admin', 'manager', 'operator', 'viewer']).optional()
});

router.post('/login', strictRateLimiter, async (req, res, next) => {
  try {
    const { username, pin } = loginSchema.parse(req.body);

    const db = getDb();

    // Find user
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user || !user.active) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify PIN
    const validPin = await bcrypt.compare(pin, user.pin);
    if (!validPin) {
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

    const db = getDb();

    // Check if user exists
    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existingUser) {
      throw new AppError('Username already exists', 409);
    }

    // Hash PIN
    const hashedPin = await bcrypt.hash(data.pin, parseInt(process.env.PIN_SALT_ROUNDS || '10'));

    // Create user
    const result = await db.insert(users).values({
      username: data.username,
      email: data.email,
      pin: hashedPin,
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