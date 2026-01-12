import { Router } from 'express';
import { getDb } from '../db/index.js';
import { auditLogs } from '../db/schema/audit.js';
import { users } from '../db/schema/users.js';
import { eq, like, desc, and, gte, lte, or, sql, count } from 'drizzle-orm';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// All audit routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// GET /api/audit - List audit logs with filtering and pagination
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const {
      page = '1',
      limit = '50',
      search = '',
      action = '',
      resource = '',
      userId = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100); // Max 100 per page
    const offset = (pageNum - 1) * limitNum;

    const db = getDb();

    // Build conditions array
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(auditLogs.username, `%${search}%`),
          like(auditLogs.resource, `%${search}%`),
          like(auditLogs.resourceId, `%${search}%`),
          like(auditLogs.details, `%${search}%`)
        )
      );
    }

    if (action) {
      conditions.push(eq(auditLogs.action, action as string));
    }

    if (resource) {
      conditions.push(eq(auditLogs.resource, resource as string));
    }

    if (userId) {
      conditions.push(eq(auditLogs.userId, parseInt(userId as string)));
    }

    if (startDate) {
      const start = new Date(startDate as string);
      conditions.push(gte(auditLogs.timestamp, start));
    }

    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999); // End of day
      conditions.push(lte(auditLogs.timestamp, end));
    }

    // Build query
    let query = db.select({
      id: auditLogs.id,
      userId: auditLogs.userId,
      username: auditLogs.username,
      action: auditLogs.action,
      resource: auditLogs.resource,
      resourceId: auditLogs.resourceId,
      details: auditLogs.details,
      ipAddress: auditLogs.ipAddress,
      userAgent: auditLogs.userAgent,
      timestamp: auditLogs.timestamp,
    }).from(auditLogs);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query
      .orderBy(desc(auditLogs.timestamp))
      .limit(limitNum)
      .offset(offset);

    // Get total count with same filters
    let countQuery = db.select({ count: count() }).from(auditLogs);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as any;
    }
    const [{ count: total }] = await countQuery;

    // Parse JSON details
    const data = result.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null
    }));

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    next(error);
  }
});

// GET /api/audit/stats - Get audit statistics
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const { startDate = '', endDate = '' } = req.query;
    const db = getDb();

    const conditions = [];

    if (startDate) {
      const start = new Date(startDate as string);
      conditions.push(gte(auditLogs.timestamp, start));
    }

    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(auditLogs.timestamp, end));
    }

    // Count by action
    const actionCounts = await db
      .select({
        action: auditLogs.action,
        count: count()
      })
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(auditLogs.action);

    // Count by resource
    const resourceCounts = await db
      .select({
        resource: auditLogs.resource,
        count: count()
      })
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(auditLogs.resource);

    // Total count
    let totalQuery = db.select({ count: count() }).from(auditLogs);
    if (conditions.length > 0) {
      totalQuery = totalQuery.where(and(...conditions)) as any;
    }
    const [{ count: total }] = await totalQuery;

    // Recent activity (last 7 days by day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await db
      .select({
        date: sql<string>`date(${auditLogs.timestamp} / 1000, 'unixepoch')`,
        count: count()
      })
      .from(auditLogs)
      .where(gte(auditLogs.timestamp, sevenDaysAgo))
      .groupBy(sql`date(${auditLogs.timestamp} / 1000, 'unixepoch')`)
      .orderBy(sql`date(${auditLogs.timestamp} / 1000, 'unixepoch')`);

    res.json({
      success: true,
      data: {
        total,
        byAction: actionCounts.reduce((acc, { action, count }) => {
          acc[action] = count;
          return acc;
        }, {} as Record<string, number>),
        byResource: resourceCounts.reduce((acc, { resource, count }) => {
          acc[resource] = count;
          return acc;
        }, {} as Record<string, number>),
        recentActivity: recentActivity.map(({ date, count }) => ({
          date,
          count
        }))
      }
    });
  } catch (error) {
    logger.error('Error fetching audit stats:', error);
    next(error);
  }
});

// GET /api/audit/actions - Get list of unique actions
router.get('/actions', async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();

    const actions = await db
      .selectDistinct({ action: auditLogs.action })
      .from(auditLogs)
      .orderBy(auditLogs.action);

    res.json({
      success: true,
      data: actions.map(a => a.action)
    });
  } catch (error) {
    logger.error('Error fetching audit actions:', error);
    next(error);
  }
});

// GET /api/audit/resources - Get list of unique resources
router.get('/resources', async (req: AuthRequest, res, next) => {
  try {
    const db = getDb();

    const resources = await db
      .selectDistinct({ resource: auditLogs.resource })
      .from(auditLogs)
      .orderBy(auditLogs.resource);

    res.json({
      success: true,
      data: resources.map(r => r.resource)
    });
  } catch (error) {
    logger.error('Error fetching audit resources:', error);
    next(error);
  }
});

// GET /api/audit/:id - Get single audit log entry
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [log] = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id))
      .limit(1);

    if (!log) {
      throw new AppError('Audit log not found', 404);
    }

    res.json({
      success: true,
      data: {
        ...log,
        details: log.details ? JSON.parse(log.details) : null
      }
    });
  } catch (error) {
    logger.error('Error fetching audit log:', error);
    next(error);
  }
});

export default router;
