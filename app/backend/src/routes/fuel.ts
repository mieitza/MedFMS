import { Router } from 'express';
import { z } from 'zod';
import { eq, and, desc, asc, sql, gte, lte, like } from 'drizzle-orm';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { getDb } from '../db/index.js';
import {
  fuelTypes,
  fuelStations,
  fuelTransactions,
  fuelLimits,
  vehicleFuelTanks,
  fuelBudgets,
  vehicles,
  drivers,
  brands,
  models,
  vehicleTypes,
  vehicleStatuses
} from '../db/schema/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(authenticate);

// Validation schemas
const fuelTransactionSchema = z.object({
  transactionType: z.enum(['purchase', 'consumption']).default('purchase'),
  vehicleId: z.number().positive(),
  driverId: z.number().optional(),
  fuelTypeId: z.number().positive(),
  // Accept both locationId and stationId (frontend may use either)
  locationId: z.number().optional(),
  stationId: z.number().optional(),
  supplierId: z.number().optional(),
  // Accept both transactionDate and date (frontend may use either)
  transactionDate: z.coerce.date().optional(),
  date: z.coerce.date().optional(),
  quantity: z.number().positive(),
  pricePerUnit: z.number().positive(),
  // Accept both totalAmount and totalCost (frontend may use either)
  totalAmount: z.number().positive().optional(),
  totalCost: z.number().positive().optional(),
  odometer: z.number().optional(),
  invoiceNumber: z.string().optional(),
  // Accept both description and notes (frontend may use either)
  description: z.string().optional(),
  notes: z.string().optional(),
}).transform((data) => {
  // Normalize field names to match database schema
  return {
    transactionType: data.transactionType,
    vehicleId: data.vehicleId,
    driverId: data.driverId,
    fuelTypeId: data.fuelTypeId,
    locationId: data.locationId || data.stationId,
    supplierId: data.supplierId,
    transactionDate: data.transactionDate || data.date || new Date(),
    quantity: data.quantity,
    pricePerUnit: data.pricePerUnit,
    totalAmount: data.totalAmount || data.totalCost || (data.quantity * data.pricePerUnit),
    odometer: data.odometer,
    invoiceNumber: data.invoiceNumber,
    description: data.description || data.notes,
  };
});

const fuelStationSchema = z.object({
  stationCode: z.string().min(1).max(50),
  stationName: z.string().min(1).max(100),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
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
      id: fuelTransactions.id,
      transactionType: fuelTransactions.transactionType,
      vehicleId: fuelTransactions.vehicleId,
      driverId: fuelTransactions.driverId,
      fuelTypeId: fuelTransactions.fuelTypeId,
      locationId: fuelTransactions.locationId,
      supplierId: fuelTransactions.supplierId,
      transactionDate: fuelTransactions.transactionDate,
      quantity: fuelTransactions.quantity,
      pricePerUnit: fuelTransactions.pricePerUnit,
      totalAmount: fuelTransactions.totalAmount,
      odometer: fuelTransactions.odometer,
      invoiceNumber: fuelTransactions.invoiceNumber,
      description: fuelTransactions.description,
      approved: fuelTransactions.approved,
      approvedBy: fuelTransactions.approvedBy,
      approvalDate: fuelTransactions.approvalDate,
      createdAt: fuelTransactions.createdAt,
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
      fuelType: {
        id: fuelTypes.id,
        fuelCode: fuelTypes.fuelCode,
        fuelName: fuelTypes.fuelName
      },
      station: {
        id: fuelStations.id,
        stationName: fuelStations.stationName
      }
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .leftJoin(drivers, eq(fuelTransactions.driverId, drivers.id))
    .leftJoin(fuelTypes, eq(fuelTransactions.fuelTypeId, fuelTypes.id))
    .leftJoin(fuelStations, eq(fuelTransactions.locationId, fuelStations.id));

    // Apply filters
    const conditions = [];
    if (vehicleId) conditions.push(eq(fuelTransactions.vehicleId, parseInt(vehicleId as string)));
    if (driverId) conditions.push(eq(fuelTransactions.driverId, parseInt(driverId as string)));
    if (stationId) conditions.push(eq(fuelTransactions.locationId, parseInt(stationId as string)));
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

// Get fuel transaction statistics - MUST be before /transactions/:id
router.get('/transactions/stats', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const { dateFrom, dateTo, vehicleId } = req.query;
    const db = getDb();

    // Build where conditions
    const conditions = [];
    if (dateFrom) {
      conditions.push(gte(fuelTransactions.transactionDate, new Date(dateFrom as string)));
    }
    if (dateTo) {
      conditions.push(lte(fuelTransactions.transactionDate, new Date(dateTo as string)));
    }
    if (vehicleId) {
      conditions.push(eq(fuelTransactions.vehicleId, parseInt(vehicleId as string)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total transactions, quantity, and cost
    const [totals] = await db.select({
      totalTransactions: sql<number>`count(*)`,
      totalQuantity: sql<number>`coalesce(sum(${fuelTransactions.quantity}), 0)`,
      totalCost: sql<number>`coalesce(sum(${fuelTransactions.totalAmount}), 0)`
    })
    .from(fuelTransactions)
    .where(whereClause);

    // Calculate average price per liter
    const averagePricePerLiter = totals.totalQuantity > 0
      ? totals.totalCost / totals.totalQuantity
      : 0;

    // Get transactions by fuel type
    const transactionsByFuelType = await db.select({
      fuelType: fuelTypes.fuelName,
      quantity: sql<number>`coalesce(sum(${fuelTransactions.quantity}), 0)`,
      cost: sql<number>`coalesce(sum(${fuelTransactions.totalAmount}), 0)`
    })
    .from(fuelTransactions)
    .leftJoin(fuelTypes, eq(fuelTransactions.fuelTypeId, fuelTypes.id))
    .where(whereClause)
    .groupBy(fuelTypes.fuelName);

    // Get transactions by vehicle
    const transactionsByVehicle = await db.select({
      vehicleCode: vehicles.vehicleCode,
      quantity: sql<number>`coalesce(sum(${fuelTransactions.quantity}), 0)`,
      cost: sql<number>`coalesce(sum(${fuelTransactions.totalAmount}), 0)`
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .where(whereClause)
    .groupBy(vehicles.vehicleCode)
    .orderBy(desc(sql`sum(${fuelTransactions.totalAmount})`))
    .limit(10);

    // Get monthly trend (last 12 months)
    const monthlyTrend = await db.select({
      month: sql<string>`strftime('%Y-%m', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`,
      quantity: sql<number>`coalesce(sum(${fuelTransactions.quantity}), 0)`,
      cost: sql<number>`coalesce(sum(${fuelTransactions.totalAmount}), 0)`
    })
    .from(fuelTransactions)
    .where(whereClause)
    .groupBy(sql`strftime('%Y-%m', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`)
    .orderBy(sql`strftime('%Y-%m', datetime(${fuelTransactions.transactionDate}, 'unixepoch'))`);

    res.json({
      success: true,
      data: {
        totalTransactions: Number(totals.totalTransactions),
        totalQuantity: Number(totals.totalQuantity),
        totalCost: Number(totals.totalCost),
        averagePricePerLiter: Number(averagePricePerLiter.toFixed(2)),
        transactionsByFuelType: transactionsByFuelType.map(t => ({
          fuelType: t.fuelType || 'Unknown',
          quantity: Number(t.quantity),
          cost: Number(t.cost)
        })),
        transactionsByVehicle: transactionsByVehicle.map(t => ({
          vehicleCode: t.vehicleCode || 'Unknown',
          quantity: Number(t.quantity),
          cost: Number(t.cost)
        })),
        monthlyTrend: monthlyTrend.map(t => ({
          month: t.month,
          quantity: Number(t.quantity),
          cost: Number(t.cost)
        }))
      }
    });
  } catch (error) {
    logger.error('Error fetching fuel statistics:', error);
    next(error);
  }
});

// Get single fuel transaction by ID
router.get('/transactions/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const db = getDb();

    // Use the same query structure as getAll that works
    const [transaction] = await db.select({
      id: fuelTransactions.id,
      transactionType: fuelTransactions.transactionType,
      vehicleId: fuelTransactions.vehicleId,
      driverId: fuelTransactions.driverId,
      fuelTypeId: fuelTransactions.fuelTypeId,
      locationId: fuelTransactions.locationId,
      supplierId: fuelTransactions.supplierId,
      transactionDate: fuelTransactions.transactionDate,
      quantity: fuelTransactions.quantity,
      pricePerUnit: fuelTransactions.pricePerUnit,
      totalAmount: fuelTransactions.totalAmount,
      odometer: fuelTransactions.odometer,
      invoiceNumber: fuelTransactions.invoiceNumber,
      description: fuelTransactions.description,
      approved: fuelTransactions.approved,
      approvedBy: fuelTransactions.approvedBy,
      approvalDate: fuelTransactions.approvalDate,
      createdAt: fuelTransactions.createdAt,
      cardNumber: fuelTransactions.cardNumber,
      costCenter1: fuelTransactions.costCenter1,
      deliveryDate: fuelTransactions.deliveryDate,
      invoiceDate: fuelTransactions.invoiceDate,
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
      fuelType: {
        id: fuelTypes.id,
        fuelCode: fuelTypes.fuelCode,
        fuelName: fuelTypes.fuelName
      },
      station: {
        id: fuelStations.id,
        stationName: fuelStations.stationName
      }
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .leftJoin(drivers, eq(fuelTransactions.driverId, drivers.id))
    .leftJoin(fuelTypes, eq(fuelTransactions.fuelTypeId, fuelTypes.id))
    .leftJoin(fuelStations, eq(fuelTransactions.locationId, fuelStations.id))
    .where(eq(fuelTransactions.id, transactionId))
    .limit(1);

    if (!transaction) {
      throw new AppError('Fuel transaction not found', 404);
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    logger.error('Error fetching fuel transaction:', error);
    next(error);
  }
});

router.post('/transactions', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = fuelTransactionSchema.parse(req.body);
    const db = getDb();

    const result = await db.insert(fuelTransactions).values(data).returning();
    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    logger.error('Error creating fuel transaction:', error);
    next(error);
  }
});

// Approve fuel transaction
router.post('/transactions/:id/approve', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const db = getDb();

    // Check if transaction exists
    const [existing] = await db.select()
      .from(fuelTransactions)
      .where(eq(fuelTransactions.id, transactionId))
      .limit(1);

    if (!existing) {
      throw new AppError('Fuel transaction not found', 404);
    }

    if (existing.approved) {
      throw new AppError('Transaction already approved', 400);
    }

    // Update transaction
    const result = await db.update(fuelTransactions)
      .set({
        approved: true,
        approvedBy: req.user?.id,
        approvalDate: new Date()
      })
      .where(eq(fuelTransactions.id, transactionId))
      .returning();

    res.json({ success: true, data: result[0], message: 'Transaction approved successfully' });
  } catch (error) {
    logger.error('Error approving fuel transaction:', error);
    next(error);
  }
});

// Reject/Unapprove fuel transaction
router.post('/transactions/:id/reject', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id);
    const db = getDb();

    // Check if transaction exists
    const [existing] = await db.select()
      .from(fuelTransactions)
      .where(eq(fuelTransactions.id, transactionId))
      .limit(1);

    if (!existing) {
      throw new AppError('Fuel transaction not found', 404);
    }

    // Update transaction
    const result = await db.update(fuelTransactions)
      .set({
        approved: false,
        approvedBy: null,
        approvalDate: null
      })
      .where(eq(fuelTransactions.id, transactionId))
      .returning();

    res.json({ success: true, data: result[0], message: 'Transaction approval revoked' });
  } catch (error) {
    logger.error('Error rejecting fuel transaction:', error);
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
      totalFuel: sql`sum(${fuelTransactions.quantity})`.as('totalFuel'),
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

// UTA Fuel Card Import endpoint
router.post('/import/uta', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    logger.info('UTA import started', { transactionCount: req.body.transactions?.length });
    const db = getDb();

    const importData = z.array(z.object({
      invoiceDate: z.string(),
      deliveryDate: z.string(),
      deliveryTime: z.string(),
      vehicleReg: z.string(),
      cardNumber: z.union([z.string(), z.number()]),
      kmReading: z.number().optional(),
      costCenter1: z.string().optional(),
      costCenter2: z.string().optional(),
      country: z.string(),
      stationId: z.union([z.string(), z.number()]),
      stationName: z.string(),
      postalCode: z.string().optional(),
      productType: z.string(),
      quantity: z.number(),
      vatRate: z.number(),
      currency: z.string(),
      amountExclVat: z.number(),
      vat: z.number(),
      amountInclVat: z.number(),
      voucherNumber: z.string().optional(),
    })).parse(req.body.transactions);

    logger.info('Import data validated', { count: importData.length });
    const batchId = `UTA-${new Date().getTime()}`;
    const results = { success: 0, failed: 0, errors: [] as any[] };

    // Get or create default reference data
    logger.info('Getting/creating default reference data...');
    let [defaultBrand] = await db.select().from(brands).where(eq(brands.brandCode, 'UNKNOWN')).limit(1);
    if (!defaultBrand) {
      logger.info('Creating default brand...');
      [defaultBrand] = await db.insert(brands).values({
        brandCode: 'UNKNOWN',
        brandName: 'Unknown',
        description: 'Default brand for imported vehicles',
        active: true
      }).returning();
      logger.info('Default brand created', { id: defaultBrand.id });
    }

    let [defaultModel] = await db.select().from(models).where(eq(models.modelCode, 'UNKNOWN')).limit(1);
    if (!defaultModel) {
      [defaultModel] = await db.insert(models).values({
        modelCode: 'UNKNOWN',
        modelName: 'Unknown',
        brandId: defaultBrand.id,
        description: 'Default model for imported vehicles',
        active: true
      }).returning();
    }

    let [defaultVehicleType] = await db.select().from(vehicleTypes).where(eq(vehicleTypes.typeCode, 'CAR')).limit(1);
    if (!defaultVehicleType) {
      [defaultVehicleType] = await db.insert(vehicleTypes).values({
        typeCode: 'CAR',
        typeName: 'Car',
        description: 'Standard passenger car',
        active: true
      }).returning();
    }

    let [defaultStatus] = await db.select().from(vehicleStatuses).where(eq(vehicleStatuses.statusCode, 'ACTIVE')).limit(1);
    if (!defaultStatus) {
      [defaultStatus] = await db.insert(vehicleStatuses).values({
        statusCode: 'ACTIVE',
        statusName: 'Active',
        description: 'Vehicle is active and in use',
        colorCode: '#10B981',
        active: true
      }).returning();
    }

    let [defaultFuelType] = await db.select().from(fuelTypes).where(eq(fuelTypes.fuelCode, 'DIESEL')).limit(1);
    if (!defaultFuelType) {
      [defaultFuelType] = await db.insert(fuelTypes).values({
        fuelCode: 'DIESEL',
        fuelName: 'Diesel',
        description: 'Diesel fuel',
        unit: 'L',
        currentPrice: 1.5,
        active: true
      }).returning();
    }

    logger.info('Starting transaction processing...', { count: importData.length });

    for (const row of importData) {
      try {
        // Normalize license plate (remove all spaces)
        const normalizedPlate = row.vehicleReg.replace(/\s+/g, '');
        logger.info(`Processing vehicle: ${normalizedPlate}`);

        // Find or create vehicle by registration
        // Search both with and without spaces to handle existing data
        let [vehicle] = await db.select().from(vehicles)
          .where(
            sql`REPLACE(${vehicles.licensePlate}, ' ', '') = ${normalizedPlate}`
          ).limit(1);

        if (!vehicle) {
          // Create new vehicle if not found with all required fields
          logger.info(`Creating vehicle: ${normalizedPlate}`);
          [vehicle] = await db.insert(vehicles).values({
            vehicleCode: normalizedPlate,
            licensePlate: normalizedPlate,
            brandId: defaultBrand.id,
            modelId: defaultModel.id,
            fuelTypeId: defaultFuelType.id,
            vehicleTypeId: defaultVehicleType.id,
            statusId: defaultStatus.id,
            active: true
          }).returning();
          logger.info(`Created new vehicle: ${normalizedPlate}`, { id: vehicle.id });
        }

        // Find or create fuel station
        let [station] = await db.select().from(fuelStations)
          .where(eq(fuelStations.stationName, row.stationName)).limit(1);

        if (!station) {
          // Create new station
          [station] = await db.insert(fuelStations).values({
            stationName: row.stationName,
            stationCode: `UTA-${row.stationId}`,
            country: row.country,
            postalCode: row.postalCode,
            active: true
          }).returning();
        }

        // Find or create fuel type based on product
        let fuelTypeName = row.productType;
        if (row.productType === 'Liquid Petrol Gas LPG') fuelTypeName = 'LPG';
        else if (row.productType === 'Super, unleaded') fuelTypeName = 'Gasoline';
        else if (row.productType.includes('Diesel')) fuelTypeName = 'Diesel';
        else if (row.productType.includes('AdBlue')) fuelTypeName = 'AdBlue';

        let [fuelType] = await db.select().from(fuelTypes)
          .where(eq(fuelTypes.fuelName, fuelTypeName)).limit(1);

        if (!fuelType) {
          [fuelType] = await db.insert(fuelTypes).values({
            fuelCode: fuelTypeName.toUpperCase().replace(/\s+/g, '_'),
            fuelName: fuelTypeName,
            unit: 'L',
            currentPrice: row.amountExclVat / row.quantity,
            active: true
          }).returning();
        }

        // Parse dates
        const deliveryDate = parseDDMMYYYYDate(row.deliveryDate);
        const invoiceDate = parseDDMMYYYYDate(row.invoiceDate);

        // Insert fuel transaction
        await db.insert(fuelTransactions).values({
          transactionType: 'purchase',
          vehicleId: vehicle.id,
          fuelTypeId: fuelType.id,
          locationId: station.id,
          transactionDate: deliveryDate,
          quantity: row.quantity,
          pricePerUnit: row.amountExclVat / row.quantity,
          totalAmount: row.amountInclVat,
          odometer: row.kmReading || null,

          // UTA-specific fields
          cardNumber: String(row.cardNumber),
          costCenter1: row.costCenter1,
          costCenter2: row.costCenter2,
          country: row.country,
          postalCode: row.postalCode,
          stationExternalId: String(row.stationId),
          vatRate: row.vatRate,
          vatAmount: row.vat,
          amountExclVat: row.amountExclVat,
          currency: row.currency,
          voucherNumber: row.voucherNumber,
          importBatchId: batchId,
          deliveryDate: deliveryDate,
          deliveryTime: row.deliveryTime,
          invoiceDate: invoiceDate,
          productName: row.productType,
          productCategory: determineFuelCategory(row.productType),
          importSource: 'UTA Excel Import',
          importNotes: `Imported from UTA on ${new Date().toISOString()}`,

          approved: false
        });

        results.success++;
        logger.info(`Transaction ${results.success} imported successfully`);
      } catch (err: any) {
        logger.error(`Error processing row ${row.vehicleReg}:`, {
          message: err.message,
          stack: err.stack,
          vehicleReg: row.vehicleReg,
          stationName: row.stationName
        });
        results.errors.push({ row: row.vehicleReg, error: err.message });
        results.failed++;
      }
    }

    logger.info('Import completed', { success: results.success, failed: results.failed });

    res.json({
      success: true,
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      data: { batchId, ...results }
    });
  } catch (error: any) {
    logger.error('Error importing UTA data:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    next(error);
  }
});

// Helper function to parse DD.MM.YYYY date format
function parseDDMMYYYYDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

// Helper function to determine fuel category
function determineFuelCategory(productType: string): string {
  if (productType.includes('Diesel')) return 'fuel';
  if (productType.includes('LPG')) return 'fuel';
  if (productType.includes('Super')) return 'fuel';
  if (productType.includes('Petrol')) return 'fuel';
  if (productType.includes('AdBlue')) return 'additive';
  if (productType.includes('Vignette')) return 'toll';
  if (productType.includes('cleaning')) return 'service';
  if (productType.includes('oil')) return 'service';
  return 'other';
}

// Get import batches
router.get('/import/batches', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const db = getDb();
    const batches = await db.select({
      batchId: fuelTransactions.importBatchId,
      count: sql`count(*)`.as('count'),
      totalAmount: sql`sum(${fuelTransactions.totalAmount})`.as('totalAmount'),
      importDate: sql`min(${fuelTransactions.createdAt})`.as('importDate'),
    })
    .from(fuelTransactions)
    .where(sql`${fuelTransactions.importBatchId} IS NOT NULL`)
    .groupBy(fuelTransactions.importBatchId)
    .orderBy(desc(sql`min(${fuelTransactions.createdAt})`));

    res.json({ success: true, data: batches });
  } catch (error) {
    logger.error('Error fetching import batches:', error);
    next(error);
  }
});

// Generic CSV/Excel import endpoint for fuel transactions
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const allowedExts = ['.xlsx', '.xls', '.csv'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'));
    }
  },
});

router.post('/transactions/import', authorize('admin', 'manager'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    logger.info('File import started', { filename: req.file.originalname, size: req.file.size });
    const db = getDb();

    // Parse file based on type
    let data: Record<string, unknown>[] = [];
    const ext = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'));

    if (ext === '.csv') {
      // Parse CSV
      const csvContent = req.file.buffer.toString('utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new AppError('CSV file must have headers and at least one data row', 400);
      }
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    } else {
      // Parse Excel
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // First, get raw data to find the actual header row
      const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });

      // Find the header row - look for rows that contain typical header keywords
      const headerKeywords = ['vehicle', 'vehicul', 'quantity', 'cantitate', 'date', 'data', 'invoice', 'card', 'station', 'amount', 'delivery'];
      let headerRowIndex = 0;

      for (let i = 0; i < Math.min(rawData.length, 10); i++) {
        const row = rawData[i];
        if (Array.isArray(row)) {
          const rowStr = row.join(' ').toLowerCase();
          const matchCount = headerKeywords.filter(kw => rowStr.includes(kw)).length;
          if (matchCount >= 3) {
            headerRowIndex = i;
            logger.info(`Found header row at index ${i}`, { row: row.slice(0, 5) });
            break;
          }
        }
      }

      // Re-parse with the correct header row
      if (headerRowIndex > 0) {
        // Skip rows before the header and use that row as headers
        const headers = rawData[headerRowIndex] as string[];
        data = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
          const rowValues = rawData[i] as string[];
          if (rowValues && rowValues.some(v => v !== '')) {
            const rowObj: Record<string, unknown> = {};
            headers.forEach((header, idx) => {
              if (header && typeof header === 'string' && header.trim()) {
                rowObj[header.trim()] = rowValues[idx] ?? '';
              }
            });
            data.push(rowObj);
          }
        }
        logger.info(`Parsed Excel with header row at index ${headerRowIndex}`, { dataRows: data.length });
      } else {
        // Standard parsing - headers in first row
        data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      }
    }

    // Log the column headers found
    const sampleRow = data[0];
    const detectedColumns = Object.keys(sampleRow);
    logger.info('Parsed file data', { rowCount: data.length, columns: detectedColumns });

    if (data.length === 0) {
      throw new AppError('File contains no data', 400);
    }

    // Get reference data
    const [defaultBrand] = await db.select().from(brands).where(eq(brands.brandCode, 'UNKNOWN')).limit(1);
    const [defaultModel] = await db.select().from(models).where(eq(models.modelCode, 'UNKNOWN')).limit(1);
    const [defaultVehicleType] = await db.select().from(vehicleTypes).where(eq(vehicleTypes.typeCode, 'CAR')).limit(1);
    const [defaultStatus] = await db.select().from(vehicleStatuses).where(eq(vehicleStatuses.statusCode, 'ACTIVE')).limit(1);
    const [defaultFuelType] = await db.select().from(fuelTypes).where(eq(fuelTypes.fuelCode, 'DIESEL')).limit(1);

    const batchId = `CSV-${new Date().getTime()}`;
    const results = { imported: 0, errors: [] as string[] };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row and 0-indexing

      try {
        // Map common header variations to our fields
        const getField = (row: Record<string, unknown>, ...keys: string[]): string => {
          for (const key of keys) {
            const value = Object.entries(row).find(([k]) =>
              k.toLowerCase().includes(key.toLowerCase())
            )?.[1];
            if (value !== undefined && value !== null && value !== '') {
              return String(value);
            }
          }
          return '';
        };

        // Try exact match first, then partial match
        const getFieldExact = (row: Record<string, unknown>, ...keys: string[]): string => {
          // First try exact match (case insensitive)
          for (const key of keys) {
            const value = Object.entries(row).find(([k]) =>
              k.toLowerCase() === key.toLowerCase()
            )?.[1];
            if (value !== undefined && value !== null && value !== '') {
              return String(value);
            }
          }
          // Then try partial match
          return getField(row, ...keys);
        };

        // Vehicle registration - expanded patterns including UTA format
        const vehicleReg = getFieldExact(row,
          'Vehicle registration no.', 'Vehicle registration no', // UTA format exact
          'Vehicle reg.', 'Vehicle reg', 'vehiclereg',
          'nr_auto', 'nr auto', 'nrauto',
          'vehicul', 'vehicle',
          'license', 'licensePlate', 'license_plate',
          'plate', 'numar', 'inmatriculare',
          'reg', 'registration'
        );

        // Quantity - expanded patterns
        const quantity = parseFloat(getFieldExact(row,
          'Quantity', 'quantity', // UTA format
          'cantitate', 'litri', 'liters', 'litres',
          'qty', 'amount_liters'
        ) || '0');

        // Total cost - expanded patterns (UTA uses "Turnover incl. VAT")
        const totalCost = parseFloat(getFieldExact(row,
          'Turnover incl. VAT', 'Turnover incl VAT', // UTA format exact
          'Turnover excl. VAT', 'Turnover excl VAT',
          'Amount incl. VAT', 'Amount incl VAT', 'amountinclvat',
          'Amount excl. VAT', 'Amount excl VAT',
          'valoare', 'cost', 'total', 'amount',
          'suma', 'pret_total', 'total_cost'
        ) || '0');

        // Odometer (UTA uses "km reading")
        const odometer = parseInt(getFieldExact(row,
          'km reading', 'kmreading', // UTA format exact
          'Km reading',
          'km', 'odometer', 'kilometraj', 'kilometri',
          'mileage', 'distance'
        ) || '0');

        // Date - expanded patterns (UTA uses "Delivery date")
        const dateStr = getFieldExact(row,
          'Delivery date', 'deliverydate', // UTA format exact
          'Inv. date', 'Invoice date', 'invoicedate',
          'data', 'date', 'transaction_date',
          'data_tranzactie', 'transaction'
        );

        // Fuel type (UTA uses "Type of goods")
        const fuelTypeName = getFieldExact(row,
          'Type of goods', 'typeofgoods', // UTA format exact
          'Product type', 'producttype',
          'tip_combustibil', 'combustibil', 'fuel', 'tip',
          'fuel_type', 'fueltype', 'produs'
        ) || 'Diesel';

        // Station name (UTA uses "Point of acceptance")
        const stationName = getFieldExact(row,
          'Point of acceptance', 'pointofacceptance', // UTA format exact
          'Station name', 'stationname',
          'statie', 'station', 'benzinarie',
          'locatie', 'location', 'supplier'
        );

        // Card number (UTA uses "Card number")
        const cardNumber = getFieldExact(row,
          'Card number', 'cardnumber', // UTA format exact
          'Card No.', 'Card No', 'cardno',
          'card', 'card_number',
          'numar_card', 'card_nr'
        );

        // Validate required fields
        if (!vehicleReg) {
          // On first error, include the detected columns to help debugging
          if (results.errors.length === 0) {
            results.errors.push(`Coloane detectate: ${detectedColumns.join(', ')}`);
          }
          results.errors.push(`Rând ${rowNum}: Lipsește numărul de înmatriculare`);
          continue;
        }
        if (!quantity || quantity <= 0) {
          results.errors.push(`Rând ${rowNum}: Cantitate invalidă pentru ${vehicleReg}`);
          continue;
        }

        // Normalize license plate
        const normalizedPlate = vehicleReg.replace(/\s+/g, '');

        // Find or create vehicle
        let [vehicle] = await db.select().from(vehicles)
          .where(sql`REPLACE(${vehicles.licensePlate}, ' ', '') = ${normalizedPlate}`)
          .limit(1);

        if (!vehicle) {
          if (defaultBrand && defaultModel && defaultVehicleType && defaultStatus && defaultFuelType) {
            [vehicle] = await db.insert(vehicles).values({
              vehicleCode: normalizedPlate,
              licensePlate: normalizedPlate,
              brandId: defaultBrand.id,
              modelId: defaultModel.id,
              fuelTypeId: defaultFuelType.id,
              vehicleTypeId: defaultVehicleType.id,
              statusId: defaultStatus.id,
              active: true
            }).returning();
            logger.info(`Created new vehicle: ${normalizedPlate}`);
          } else {
            results.errors.push(`Rând ${rowNum}: Vehiculul ${vehicleReg} nu există și nu s-a putut crea automat`);
            continue;
          }
        }

        // Find or create fuel type
        let [fuelType] = await db.select().from(fuelTypes)
          .where(like(fuelTypes.fuelName, `%${fuelTypeName}%`))
          .limit(1);

        if (!fuelType) {
          fuelType = defaultFuelType;
        }

        if (!fuelType) {
          results.errors.push(`Rând ${rowNum}: Tipul de combustibil ${fuelTypeName} nu există`);
          continue;
        }

        // Find or create station if provided
        let stationId: number | null = null;
        if (stationName) {
          // Try exact match first
          let [station] = await db.select().from(fuelStations)
            .where(eq(fuelStations.stationName, stationName))
            .limit(1);

          // If not found, try partial match
          if (!station) {
            [station] = await db.select().from(fuelStations)
              .where(like(fuelStations.stationName, `%${stationName}%`))
              .limit(1);
          }

          if (!station) {
            // Generate unique station code based on name hash + random suffix
            const stationCode = `IMP-${stationName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            try {
              [station] = await db.insert(fuelStations).values({
                stationCode: stationCode,
                stationName: stationName,
                active: true
              }).returning();
            } catch (stationErr: unknown) {
              // If station creation fails (duplicate), try to find it again
              [station] = await db.select().from(fuelStations)
                .where(eq(fuelStations.stationName, stationName))
                .limit(1);
              if (!station) {
                throw stationErr;
              }
            }
          }
          stationId = station.id;
        }

        // Parse date
        let transactionDate = new Date();
        if (dateStr) {
          // Try various date formats
          if (dateStr.includes('.')) {
            // DD.MM.YYYY
            const [day, month, year] = dateStr.split('.');
            transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else if (dateStr.includes('-')) {
            // YYYY-MM-DD or DD-MM-YYYY
            transactionDate = new Date(dateStr);
          } else if (dateStr.includes('/')) {
            // DD/MM/YYYY or MM/DD/YYYY
            const parts = dateStr.split('/');
            if (parts[0].length === 4) {
              transactionDate = new Date(dateStr);
            } else {
              transactionDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            }
          }
        }

        // Calculate price per unit
        const pricePerUnit = quantity > 0 && totalCost > 0 ? totalCost / quantity : fuelType.currentPrice || 7.5;

        // Insert fuel transaction
        await db.insert(fuelTransactions).values({
          transactionType: 'purchase',
          vehicleId: vehicle.id,
          fuelTypeId: fuelType.id,
          locationId: stationId,
          transactionDate: transactionDate,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
          totalAmount: totalCost > 0 ? totalCost : quantity * pricePerUnit,
          odometer: odometer > 0 ? odometer : null,
          cardNumber: cardNumber || null,
          importBatchId: batchId,
          importSource: 'CSV Import',
          approved: false
        });

        results.imported++;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`Error processing row ${rowNum}:`, { error: errorMessage, row });
        results.errors.push(`Rând ${rowNum}: ${errorMessage}`);
      }
    }

    logger.info('Import completed', { imported: results.imported, errors: results.errors.length });

    res.json({
      success: true,
      data: results,
      message: `Import finalizat: ${results.imported} tranzacții importate${results.errors.length > 0 ? `, ${results.errors.length} erori` : ''}`
    });
  } catch (error) {
    logger.error('Error importing fuel transactions:', error);
    next(error);
  }
});

export default router;