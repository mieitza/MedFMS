import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sql, count, eq } from 'drizzle-orm';
import {
  vehicles,
  employees,
  materials,
  fuelTransactions
} from '../db/schema/index.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Get dashboard statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const db = getDb();

    // Get vehicle count (active vehicles only)
    const vehicleCountResult = await db
      .select({ count: count() })
      .from(vehicles)
      .where(eq(vehicles.active, true));

    // Get fuel transaction count
    const fuelTransactionCountResult = await db
      .select({ count: count() })
      .from(fuelTransactions);

    // Get material items count (active materials only)
    const materialItemsCountResult = await db
      .select({ count: count() })
      .from(materials)
      .where(eq(materials.active, true));

    // Get active employees count
    const activeEmployeesCountResult = await db
      .select({ count: count() })
      .from(employees)
      .where(eq(employees.active, true));

    const stats = {
      vehicleCount: vehicleCountResult[0]?.count || 0,
      fuelTransactions: fuelTransactionCountResult[0]?.count || 0,
      materialItems: materialItemsCountResult[0]?.count || 0,
      activeEmployees: activeEmployeesCountResult[0]?.count || 0
    };

    logger.info('Dashboard stats retrieved', { stats });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Failed to get dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics'
    });
  }
});

export default router;
