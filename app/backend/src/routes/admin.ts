import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import * as schema from '../db/schema/index.js';

const router = Router();

router.use(authenticate);

// Map of data types to their table objects and validation schemas
const DATA_TYPE_CONFIG = {
  brands: {
    table: schema.brands,
    schema: z.object({
      brandCode: z.string().min(1).max(50).optional(),
      brandName: z.string().min(1).max(100),
      description: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'brandName',
  },
  models: {
    table: schema.models,
    schema: z.object({
      modelName: z.string().min(1).max(100),
      brandId: z.number().positive(),
      description: z.string().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'modelName',
  },
  locations: {
    table: schema.locations,
    schema: z.object({
      locationCode: z.string().min(1).max(50),
      locationName: z.string().min(1).max(100),
      parentLocationId: z.number().positive().optional().nullable(),
      level: z.number().positive().optional(),
      locationPath: z.string().optional().nullable(),
      responsiblePersonId: z.number().positive().optional().nullable(),
      address: z.string().optional().nullable(),
      cityId: z.number().positive().optional().nullable(),
      phoneNumber: z.string().optional().nullable(),
      capacity: z.number().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'locationName',
  },
  departments: {
    table: schema.departments,
    schema: z.object({
      departmentName: z.string().min(1).max(100),
      departmentCode: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'departmentName',
  },
  cities: {
    table: schema.cities,
    schema: z.object({
      cityName: z.string().min(1).max(100),
      region: z.string().optional(),
      country: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'cityName',
  },
  suppliers: {
    table: schema.suppliers,
    schema: z.object({
      supplierName: z.string().min(1).max(100),
      contactPerson: z.string().optional(),
      contactNumber: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
      taxId: z.string().optional(),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'supplierName',
  },
  vehicleTypes: {
    table: schema.vehicleTypes,
    schema: z.object({
      typeName: z.string().min(1).max(100),
      description: z.string().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'typeName',
  },
  vehicleStatuses: {
    table: schema.vehicleStatuses,
    schema: z.object({
      statusCode: z.string().min(1).max(50),
      statusName: z.string().min(1).max(100),
      description: z.string().optional().nullable(),
      colorCode: z.string().optional().nullable(),
      active: z.boolean().optional(),
    }),
    nameField: 'statusName',
  },
  fuelTypes: {
    table: schema.fuelTypes,
    schema: z.object({
      fuelCode: z.string().min(1).max(50),
      fuelName: z.string().min(1).max(100),
      description: z.string().optional(),
      unit: z.string().optional(),
      currentPrice: z.number().optional(),
      density: z.number().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'fuelName',
  },
  fuelStations: {
    table: schema.fuelStations,
    schema: z.object({
      stationName: z.string().min(1).max(100),
      stationCode: z.string().min(1).max(50),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      fuelTypes: z.string().optional(),
      operatingHours: z.string().optional(),
      paymentMethods: z.string().optional(),
      services: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'stationName',
  },
  units: {
    table: schema.units,
    schema: z.object({
      unitCode: z.string().min(1).max(50),
      unitName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'unitName',
  },
  materialTypes: {
    table: schema.materialTypes,
    schema: z.object({
      typeCode: z.string().min(1).max(50),
      typeName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'typeName',
  },
  materialCategories: {
    table: schema.materialCategories,
    schema: z.object({
      categoryCode: z.string().min(1).max(50),
      categoryName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'categoryName',
  },
  positions: {
    table: schema.positions,
    schema: z.object({
      positionCode: z.string().min(1).max(50),
      positionName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'positionName',
  },
  licenseTypes: {
    table: schema.licenseTypes,
    schema: z.object({
      typeCode: z.string().min(1).max(50),
      typeName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'typeName',
  },
};

// Get list of all available reference data types
router.get('/reference-data-types', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const dataTypes = Object.keys(DATA_TYPE_CONFIG).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    }));

    res.json({
      success: true,
      data: dataTypes,
    });
  } catch (error) {
    next(error);
  }
});

// Get all records for a data type
router.get('/:dataType', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { dataType } = req.params;
    const config = DATA_TYPE_CONFIG[dataType as keyof typeof DATA_TYPE_CONFIG];

    if (!config) {
      throw new AppError('Invalid data type', 400);
    }

    const db = getDb();
    const results = await db.select().from(config.table);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

// Get single record
router.get('/:dataType/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { dataType, id } = req.params;
    const config = DATA_TYPE_CONFIG[dataType as keyof typeof DATA_TYPE_CONFIG];

    if (!config) {
      throw new AppError('Invalid data type', 400);
    }

    const db = getDb();
    const [result] = await db
      .select()
      .from(config.table)
      .where(eq(config.table.id, parseInt(id)))
      .limit(1);

    if (!result) {
      throw new AppError('Record not found', 404);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Create new record
router.post('/:dataType', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { dataType } = req.params;
    const config = DATA_TYPE_CONFIG[dataType as keyof typeof DATA_TYPE_CONFIG];

    if (!config) {
      throw new AppError('Invalid data type', 400);
    }

    const data = config.schema.parse(req.body);
    const db = getDb();

    // Auto-generate code fields if not provided
    const insertData: any = { ...data };

    // For brands, auto-generate brandCode from brandName
    if (dataType === 'brands' && !insertData.brandCode) {
      insertData.brandCode = insertData.brandName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
      console.log('[ADMIN] Auto-generated brandCode:', insertData.brandCode, 'from brandName:', insertData.brandName);
    }

    console.log('[ADMIN] Inserting data for', dataType, ':', insertData);
    const result = await db.insert(config.table).values(insertData).returning();

    res.status(201).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
});

// Update record
router.put('/:dataType/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { dataType, id } = req.params;
    const config = DATA_TYPE_CONFIG[dataType as keyof typeof DATA_TYPE_CONFIG];

    if (!config) {
      throw new AppError('Invalid data type', 400);
    }

    const data = config.schema.partial().parse(req.body);
    const db = getDb();

    const [existing] = await db
      .select()
      .from(config.table)
      .where(eq(config.table.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      throw new AppError('Record not found', 404);
    }

    const result = await db
      .update(config.table)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(config.table.id, parseInt(id)))
      .returning();

    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
});

// Delete record
router.delete('/:dataType/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { dataType, id } = req.params;
    const config = DATA_TYPE_CONFIG[dataType as keyof typeof DATA_TYPE_CONFIG];

    if (!config) {
      throw new AppError('Invalid data type', 400);
    }

    const db = getDb();

    const [existing] = await db
      .select()
      .from(config.table)
      .where(eq(config.table.id, parseInt(id)))
      .limit(1);

    if (!existing) {
      throw new AppError('Record not found', 404);
    }

    await db.delete(config.table).where(eq(config.table.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
