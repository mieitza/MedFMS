import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';
import { users, sessions } from '../db/schema/users.js';
import { companies } from '../db/schema/companies.js';
import { eq, and, gt } from 'drizzle-orm';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    companyId: number | null; // User's assigned company (null for super_admin)
    selectedCompanyId: number | null; // Currently selected company (for super_admin switching)
    effectiveCompanyId: number | null; // The company to filter data by
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
          role: 'super_admin', // Internal service has super_admin access
          companyId: null,
          selectedCompanyId: null,
          effectiveCompanyId: null, // Can see all companies
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

    // Get user details including companyId
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      companyId: users.companyId
    })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Handle company selection for super_admin
    let selectedCompanyId: number | null = null;
    const selectedCompanyHeader = req.headers['x-selected-company'];

    if (user.role === 'super_admin' && selectedCompanyHeader) {
      // Super admin can switch companies via header
      const parsedCompanyId = parseInt(selectedCompanyHeader as string, 10);
      if (!isNaN(parsedCompanyId)) {
        // Verify the company exists
        const [company] = await db.select({ id: companies.id })
          .from(companies)
          .where(and(eq(companies.id, parsedCompanyId), eq(companies.active, true)))
          .limit(1);

        if (company) {
          selectedCompanyId = company.id;
        }
      }
    }

    // Determine effective company ID for data filtering
    // - For super_admin: use selectedCompanyId if set, otherwise null (sees all)
    // - For other users: use their assigned companyId
    const effectiveCompanyId = user.role === 'super_admin'
      ? selectedCompanyId
      : user.companyId;

    req.user = {
      ...user,
      selectedCompanyId,
      effectiveCompanyId
    };
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

    // super_admin always has access
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// Middleware to require a specific company context
// Used for routes that require company-scoped data
export const requireCompanyContext = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  // super_admin without selected company can still proceed (sees all data)
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Regular users must have a company assigned
  if (!req.user.companyId) {
    return next(new AppError('No company assigned to user', 403));
  }

  next();
};

// Helper function to get company filter condition for queries
// Returns the companyId to filter by, or null if no filtering needed (super_admin seeing all)
export const getCompanyFilter = (req: AuthRequest): number | null => {
  return req.user?.effectiveCompanyId ?? null;
};
