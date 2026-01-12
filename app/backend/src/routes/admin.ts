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
      brandName: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(100).optional(), // Frontend compatibility
      description: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      active: z.boolean().optional(),
      isActive: z.boolean().optional(), // Frontend compatibility
    }).refine(data => data.brandName || data.name, {
      message: "Either 'brandName' or 'name' is required"
    }),
    nameField: 'brandName',
  },
  models: {
    table: schema.models,
    schema: z.object({
      modelCode: z.string().min(1).max(50).optional(),
      modelName: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(100).optional(), // Frontend compatibility
      brandId: z.number().positive(),
      description: z.string().optional().nullable(),
      active: z.boolean().optional(),
      isActive: z.boolean().optional(), // Frontend compatibility
    }).refine(data => data.modelName || data.name, {
      message: "Either 'modelName' or 'name' is required"
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
      cityCode: z.string().min(1).max(50).optional(),
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
      supplierCode: z.string().min(1).max(50).optional(),
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
    codeField: 'supplierCode',
  },
  vehicleTypes: {
    table: schema.vehicleTypes,
    schema: z.object({
      typeCode: z.string().min(1).max(50).optional(),
      typeName: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(100).optional(), // Frontend compatibility
      description: z.string().optional().nullable(),
      active: z.boolean().optional(),
      isActive: z.boolean().optional(), // Frontend compatibility
    }).refine(data => data.typeName || data.name, {
      message: "Either 'typeName' or 'name' is required"
    }),
    nameField: 'typeName',
  },
  vehicleStatuses: {
    table: schema.vehicleStatuses,
    schema: z.object({
      statusCode: z.string().min(1).max(50).optional(),
      statusName: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(100).optional(), // Frontend compatibility
      description: z.string().optional().nullable(),
      colorCode: z.string().optional().nullable(),
      active: z.boolean().optional(),
      isActive: z.boolean().optional(), // Frontend compatibility
    }).refine(data => data.statusName || data.name, {
      message: "Either 'statusName' or 'name' is required"
    }),
    nameField: 'statusName',
  },
  fuelTypes: {
    table: schema.fuelTypes,
    schema: z.object({
      fuelCode: z.string().min(1).max(50).optional(),
      fuelName: z.string().min(1).max(100).optional(),
      name: z.string().min(1).max(100).optional(), // Frontend compatibility
      description: z.string().optional(),
      unit: z.string().optional(),
      currentPrice: z.number().optional(),
      density: z.number().optional(),
      active: z.boolean().optional(),
      isActive: z.boolean().optional(), // Frontend compatibility
    }).refine(data => data.fuelName || data.name, {
      message: "Either 'fuelName' or 'name' is required"
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
  inspectionTypes: {
    table: schema.inspectionTypes,
    schema: z.object({
      typeCode: z.string().min(1).max(50).optional(),
      typeName: z.string().min(1).max(100),
      description: z.string().optional(),
      active: z.boolean().optional(),
    }),
    nameField: 'typeName',
  },
  maintenanceTypes: {
    table: schema.maintenanceTypes,
    schema: z.object({
      typeCode: z.string().min(1).max(50).optional(),
      typeName: z.string().min(1).max(100),
      category: z.enum(['preventive', 'corrective', 'emergency', 'inspection']),
      description: z.string().optional(),
      estimatedDuration: z.number().optional(), // in minutes
      estimatedCost: z.number().optional(),
      priority: z.number().min(1).max(5).optional(),
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

    // Normalize frontend field names to database field names
    // Handle 'name' -> specific name field mapping
    if (dataType === 'brands' && insertData.name && !insertData.brandName) {
      insertData.brandName = insertData.name;
      delete insertData.name;
    }
    if (dataType === 'models' && insertData.name && !insertData.modelName) {
      insertData.modelName = insertData.name;
      delete insertData.name;
    }
    if (dataType === 'vehicleTypes' && insertData.name && !insertData.typeName) {
      insertData.typeName = insertData.name;
      delete insertData.name;
    }
    if (dataType === 'vehicleStatuses' && insertData.name && !insertData.statusName) {
      insertData.statusName = insertData.name;
      delete insertData.name;
    }
    if (dataType === 'fuelTypes' && insertData.name && !insertData.fuelName) {
      insertData.fuelName = insertData.name;
      delete insertData.name;
    }

    // Handle 'isActive' -> 'active' mapping
    if (insertData.isActive !== undefined && insertData.active === undefined) {
      insertData.active = insertData.isActive;
      delete insertData.isActive;
    }

    // For brands, auto-generate brandCode from brandName
    if (dataType === 'brands' && !insertData.brandCode) {
      insertData.brandCode = insertData.brandName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For models, auto-generate modelCode from modelName
    if (dataType === 'models' && !insertData.modelCode) {
      insertData.modelCode = insertData.modelName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For cities, auto-generate cityCode from cityName
    if (dataType === 'cities' && !insertData.cityCode) {
      insertData.cityCode = insertData.cityName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For suppliers, auto-generate supplierCode from supplierName
    if (dataType === 'suppliers' && !insertData.supplierCode) {
      insertData.supplierCode = insertData.supplierName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For fuelTypes, auto-generate fuelCode from fuelName and set default currentPrice
    if (dataType === 'fuelTypes') {
      if (!insertData.fuelCode) {
        insertData.fuelCode = insertData.fuelName
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '_')
          .substring(0, 50);
      }
      // Set default currentPrice if not provided (required by database)
      if (insertData.currentPrice === undefined) {
        insertData.currentPrice = 0;
      }
    }

    // For vehicleTypes, auto-generate typeCode from typeName
    if (dataType === 'vehicleTypes' && !insertData.typeCode) {
      insertData.typeCode = insertData.typeName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For vehicleStatuses, auto-generate statusCode from statusName
    if (dataType === 'vehicleStatuses' && !insertData.statusCode) {
      insertData.statusCode = insertData.statusName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For inspectionTypes, auto-generate typeCode from typeName
    if (dataType === 'inspectionTypes' && !insertData.typeCode) {
      insertData.typeCode = insertData.typeName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

    // For maintenanceTypes, auto-generate typeCode from typeName
    if (dataType === 'maintenanceTypes' && !insertData.typeCode) {
      insertData.typeCode = insertData.typeName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 50);
    }

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

    // For partial updates, we need to handle validation differently
    // since .refine() returns ZodEffects which doesn't have .partial()
    const rawData = req.body;
    let data: any;

    try {
      data = config.schema.parse(rawData);
    } catch {
      // If full validation fails, try parsing without the refine validation
      // This is acceptable for partial updates
      const baseSchema = config.schema instanceof z.ZodEffects
        ? (config.schema as any)._def.schema
        : config.schema;
      data = baseSchema.partial().parse(rawData);
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

    // Normalize frontend field names to database field names
    const updateData: any = { ...data };

    // Handle 'name' -> specific name field mapping
    if (dataType === 'brands' && updateData.name && !updateData.brandName) {
      updateData.brandName = updateData.name;
      delete updateData.name;
    }
    if (dataType === 'models' && updateData.name && !updateData.modelName) {
      updateData.modelName = updateData.name;
      delete updateData.name;
    }
    if (dataType === 'vehicleTypes' && updateData.name && !updateData.typeName) {
      updateData.typeName = updateData.name;
      delete updateData.name;
    }
    if (dataType === 'vehicleStatuses' && updateData.name && !updateData.statusName) {
      updateData.statusName = updateData.name;
      delete updateData.name;
    }
    if (dataType === 'fuelTypes' && updateData.name && !updateData.fuelName) {
      updateData.fuelName = updateData.name;
      delete updateData.name;
    }

    // Handle 'isActive' -> 'active' mapping
    if (updateData.isActive !== undefined && updateData.active === undefined) {
      updateData.active = updateData.isActive;
      delete updateData.isActive;
    }

    const result = await db
      .update(config.table)
      .set({ ...updateData, updatedAt: new Date() })
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
