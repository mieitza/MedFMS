import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index.js';
import { auditLogs } from '../db/schema/audit.js';
import { AuthRequest } from './auth.js';
import { logger } from '../utils/logger.js';

export interface AuditOptions {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'APPROVE' | 'REJECT';
  resource: string;
  getResourceId?: (req: Request) => string | null;
  getDetails?: (req: Request, res: Response) => Record<string, any> | null;
}

/**
 * Creates an audit logging middleware
 * @param options Audit configuration options
 */
export const auditLog = (options: AuditOptions) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to log after successful response
    res.json = function (body: any) {
      // Only log if response was successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Don't await - log asynchronously
        logAudit(req, res, options, body).catch(error => {
          logger.error('Failed to create audit log:', error);
        });
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Log an audit entry
 */
async function logAudit(
  req: AuthRequest,
  res: Response,
  options: AuditOptions,
  responseBody: any
) {
  try {
    const db = getDb();

    let resourceId: string | null = null;
    if (options.getResourceId) {
      resourceId = options.getResourceId(req);
    } else if (req.params.id) {
      resourceId = req.params.id;
    } else if (responseBody?.data?.id) {
      resourceId = String(responseBody.data.id);
    }

    let details: Record<string, any> | null = null;
    if (options.getDetails) {
      details = options.getDetails(req, res);
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket.remoteAddress
      || null;

    await db.insert(auditLogs).values({
      userId: req.user?.id || null,
      username: req.user?.username || null,
      action: options.action,
      resource: options.resource,
      resourceId,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent: req.headers['user-agent'] || null,
    });
  } catch (error) {
    logger.error('Error creating audit log:', error);
    // Don't throw - we don't want audit failures to break the request
  }
}

/**
 * Manually create an audit log entry (for use in route handlers)
 */
export async function createAuditLog(
  user: { id: number; username: string } | null,
  action: AuditOptions['action'],
  resource: string,
  resourceId?: string | number | null,
  details?: Record<string, any> | null,
  req?: Request
) {
  try {
    const db = getDb();

    const ipAddress = req
      ? ((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress)
      : null;

    await db.insert(auditLogs).values({
      userId: user?.id || null,
      username: user?.username || null,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent: req?.headers['user-agent'] || null,
    });
  } catch (error) {
    logger.error('Error creating audit log:', error);
  }
}
