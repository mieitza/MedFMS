import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc, sql, gte, lte, like } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import {
  fuelTypes,
  fuelStations,
  fuelTransactions,
  fuelLimits,
  vehicleFuelTanks,
  fuelBudgets,
  fuelCards,
  vehicles,
  drivers
} from '../db/schema/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(authenticate);

// Validation schemas
const fuelTransactionSchema = z.object({
  transactionNumber: z.string().optional(),
  transactionType: z.enum(['purchase', 'consumption']),
  vehicleId: z.number().positive(),
  driverId: z.number().optional(),
  fuelTypeId: z.number().positive(),
  fuelStationId: z.number().optional(),
  transactionDate: z.coerce.date(),
  quantity: z.number().positive(),
  pricePerLiter: z.number().positive().optional(),
  totalAmount: z.number().positive().optional(),
  currency: z.string().default('USD'),
  odometerReading: z.number().optional(),
  previousOdometerReading: z.number().optional(),
  paymentMethod: z.string().optional(),
  receiptNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  vatAmount: z.number().optional(),
  notes: z.string().optional(),
});

const fuelStationSchema = z.object({
  stationCode: z.string().min(1).max(50),
  stationName: z.string().min(1).max(100),
  address: z.string().optional(),
  cityId: z.number().optional(),
  contactPerson: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  contractNumber: z.string().optional(),
  discountRate: z.number().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

// Fuel Types endpoints
router.get('/types', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const results = await db.select().from(fuelTypes).where(eq(fuelTypes.active, true));
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error fetching fuel types:', error);
    next(error);
  }
});

router.post('/types', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const schema = z.object({
      fuelCode: z.string().min(1).max(50),
      fuelName: z.string().min(1).max(100),
      description: z.string().optional(),
      unit: z.string().default('L'),
      currentPrice: z.number().positive(),
      density: z.number().optional(),
    });

    const data = schema.parse(req.body);
    const db = getDb();

    const [existing] = await db.select()
      .from(fuelTypes)
      .where(eq(fuelTypes.fuelCode, data.fuelCode))
      .limit(1);

    if (existing) {
      throw new AppError('Fuel type code already exists', 409);
    }

    const result = await db.insert(fuelTypes).values(data).returning();
    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error creating fuel type:', error);
    next(error);
  }
});

// Fuel Stations endpoints
router.get('/stations', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { search, active } = req.query;

    let query = db.select().from(fuelStations);

    if (search) {
      query = query.where(like(fuelStations.stationName, `%${search}%`));
    }

    if (active !== undefined) {
      query = query.where(eq(fuelStations.active, active === 'true'));
    }

    const results = await query.orderBy(asc(fuelStations.stationName));
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error fetching fuel stations:', error);
    next(error);
  }
});

router.post('/stations', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const data = fuelStationSchema.parse(req.body);
    const db = getDb();

    const [existing] = await db.select()
      .from(fuelStations)
      .where(eq(fuelStations.stationCode, data.stationCode))
      .limit(1);

    if (existing) {
      throw new AppError('Station code already exists', 409);
    }

    const result = await db.insert(fuelStations).values(data).returning();
    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error creating fuel station:', error);
    next(error);
  }
});

// Fuel Transactions endpoints
router.get('/transactions', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const {
      page = 1,
      limit = 20,
      vehicleId,
      driverId,
      stationId,
      startDate,
      endDate,
      transactionType,
      approved
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = db.select({
      transaction: fuelTransactions,
      vehicle: {
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      driver: {
        id: drivers.id,
        fullName: drivers.fullName,
        driverCode: drivers.driverCode
      },
      station: {
        id: fuelStations.id,
        stationName: fuelStations.stationName
      }
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .leftJoin(drivers, eq(fuelTransactions.driverId, drivers.id))
    .leftJoin(fuelStations, eq(fuelTransactions.fuelStationId, fuelStations.id));

    // Apply filters
    const conditions = [];
    if (vehicleId) conditions.push(eq(fuelTransactions.vehicleId, parseInt(vehicleId as string)));
    if (driverId) conditions.push(eq(fuelTransactions.driverId, parseInt(driverId as string)));
    if (stationId) conditions.push(eq(fuelTransactions.fuelStationId, parseInt(stationId as string)));
    if (transactionType) conditions.push(eq(fuelTransactions.transactionType, transactionType as string));
    if (approved !== undefined) conditions.push(eq(fuelTransactions.approved, approved === 'true'));
    if (startDate) conditions.push(gte(fuelTransactions.transactionDate, new Date(startDate as string)));
    if (endDate) conditions.push(lte(fuelTransactions.transactionDate, new Date(endDate as string)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(fuelTransactions.transactionDate))
      .limit(parseInt(limit as string))
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: sql`count(*)`.as('count') }).from(fuelTransactions);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;

    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: Number(count),
        pages: Math.ceil(Number(count) / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Error fetching fuel transactions:', error);
    next(error);
  }
});

router.post('/transactions', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = fuelTransactionSchema.parse(req.body);
    const db = getDb();

    // Auto-generate transaction number if not provided
    if (!data.transactionNumber) {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const count = await db.select({ count: sql`count(*)` }).from(fuelTransactions);
      data.transactionNumber = `FT${date}${String(Number(count[0].count) + 1).padStart(4, '0')}`;
    }

    // Calculate fuel efficiency if both odometer readings are provided
    if (data.odometerReading && data.previousOdometerReading && data.quantity) {
      const distance = data.odometerReading - data.previousOdometerReading;
      const distanceTraveled = distance;
      let fuelEfficiency;
      if (distance > 0 && data.quantity > 0) {
        fuelEfficiency = distance / data.quantity;
      }

      const result = await db.insert(fuelTransactions).values({
        ...data,
        distanceTraveled,
        fuelEfficiency,
        createdBy: req.user.id
      }).returning();

      res.status(201).json({ success: true, data: result[0] });
    } else {
      const result = await db.insert(fuelTransactions).values({
        ...data,
        createdBy: req.user.id
      }).returning();

      res.status(201).json({ success: true, data: result[0] });
    }
  } catch (error) {
    logger.error('Error creating fuel transaction:', error);
    next(error);
  }
});

// Fuel efficiency reports
router.get('/reports/efficiency', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const db = getDb();
    const { vehicleId, startDate, endDate } = req.query;

    const conditions = [eq(fuelTransactions.approved, true)];
    if (vehicleId) conditions.push(eq(fuelTransactions.vehicleId, parseInt(vehicleId as string)));
    if (startDate) conditions.push(gte(fuelTransactions.transactionDate, new Date(startDate as string)));
    if (endDate) conditions.push(lte(fuelTransactions.transactionDate, new Date(endDate as string)));

    const results = await db.select({
      vehicleId: fuelTransactions.vehicleId,
      vehicle: {
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate
      },
      totalDistance: sql`sum(${fuelTransactions.distanceTraveled})`.as('totalDistance'),
      totalFuel: sql`sum(${fuelTransactions.quantity})`.as('totalFuel'),
      avgEfficiency: sql`avg(${fuelTransactions.fuelEfficiency})`.as('avgEfficiency'),
      totalCost: sql`sum(${fuelTransactions.totalAmount})`.as('totalCost'),
      transactionCount: sql`count(*)`.as('transactionCount')
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .where(and(...conditions))
    .groupBy(fuelTransactions.vehicleId)
    .orderBy(asc(vehicles.vehicleCode));

    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error generating fuel efficiency report:', error);
    next(error);
  }
});

export default router;