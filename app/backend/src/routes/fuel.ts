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
  transactionType: z.enum(['purchase', 'consumption']),
  vehicleId: z.number().positive(),
  driverId: z.number().optional(),
  fuelTypeId: z.number().positive(),
  locationId: z.number().optional(),
  supplierId: z.number().optional(),
  transactionDate: z.coerce.date(),
  quantity: z.number().positive(),
  pricePerUnit: z.number().positive(),
  totalAmount: z.number().positive(),
  odometer: z.number().optional(),
  invoiceNumber: z.string().optional(),
  description: z.string().optional(),
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
      station: {
        id: fuelStations.id,
        stationName: fuelStations.stationName
      }
    })
    .from(fuelTransactions)
    .leftJoin(vehicles, eq(fuelTransactions.vehicleId, vehicles.id))
    .leftJoin(drivers, eq(fuelTransactions.driverId, drivers.id))
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

export default router;