import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';
import { users, sessions } from '../db/schema/users.js';
import { eq, and, gt } from 'drizzle-orm';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

// Internal service secret for server-to-server communication
const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || 'chat-assistant-internal-secret';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for internal service authentication (server-to-server calls)
    const internalService = req.headers['x-internal-service'];
    if (internalService === 'chat-assistant') {
      // Verify the request is from localhost for additional security
      const isLocalRequest =
        req.ip === '127.0.0.1' ||
        req.ip === '::1' ||
        req.ip === '::ffff:127.0.0.1' ||
        req.hostname === 'localhost';

      if (isLocalRequest) {
        // Set a system user for internal requests
        req.user = {
          id: 0,
          username: 'system',
          email: 'system@internal',
          role: 'admin', // Internal service has admin access for read operations
        };
        return next();
      }
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    const db = getDb();

    // Check if session exists and is valid
    const [session] = await db.select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      throw new AppError('Invalid or expired session', 401);
    }

    // Get user details
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role
    })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Authentication error:', error);

    // Handle JWT-specific errors
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token format. Please log out and log in again.', 401));
      }
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Token expired. Please log in again.', 401));
      }
    }

    next(new AppError('Invalid authentication token', 401));
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};
