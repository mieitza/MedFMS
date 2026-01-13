import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { getDb } from '../db/index.js';
import { vehicles } from '../db/schema/vehicles.js';
import { brands, models, vehicleTypes, vehicleStatuses, locations, departments, systemFuelTypes } from '../db/schema/system.js';
import { auditLogs } from '../db/schema/audit.js';
import { nanoid } from 'nanoid';
import { employees } from '../db/schema/employees.js';
import { fuelTypes } from '../db/schema/fuel.js';
import { eq, like, and, or, inArray } from 'drizzle-orm';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// Configure multer for ANMDM document uploads
const uploadsDir = path.join(process.cwd(), 'uploads', 'anmdm');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure uploads directory for import documents
const importDocsDir = path.join(process.cwd(), 'uploads', 'import-docs');
fs.mkdir(importDocsDir, { recursive: true }).catch(console.error);

// In-memory store for import batches (for rollback capability within 24 hours)
// In production, this should be stored in database
interface ImportBatch {
  batchId: string;
  vehicleIds: number[];
  importedAt: Date;
  userId: number;
  username: string;
}
const importBatches = new Map<string, ImportBatch>();

// Clean up old import batches (older than 24 hours)
setInterval(() => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  for (const [batchId, batch] of importBatches.entries()) {
    if (batch.importedAt < twentyFourHoursAgo) {
      importBatches.delete(batchId);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// Helper function to log audit entries
async function logAudit(
  db: ReturnType<typeof getDb>,
  userId: number | undefined,
  username: string | undefined,
  action: string,
  resource: string,
  resourceId: string,
  details: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await db.insert(auditLogs).values({
      userId,
      username,
      action,
      resource,
      resourceId,
      details: JSON.stringify(details),
      ipAddress,
      userAgent,
    });
  } catch (error) {
    logger.error('Failed to log audit entry:', error);
  }
}

const anmdmStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const vehicleId = req.params.id;
    const uploadPath = path.join(uploadsDir, vehicleId);
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `anmdm-${uniqueSuffix}${ext}`);
  }
});

const anmdmUpload = multer({
  storage: anmdmStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for ANMDM documents
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for ANMDM documents'), false);
    }
  }
});

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

const vehicleSchema = z.object({
  vehicleCode: z.string().min(1).max(50),
  licensePlate: z.string().min(1).max(20),
  brandId: z.number().positive(),
  modelId: z.number().positive(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  fuelTypeId: z.number().positive(),
  vehicleTypeId: z.number().positive(),
  statusId: z.number().positive(),
  locationId: z.number().optional(),
  departmentId: z.number().optional(),
  employeeId: z.number().optional(),
  odometer: z.number().min(0).optional(),
  description: z.string().optional(),
  // ANMDM Authorization fields
  anmdmAuthNumber: z.string().optional(),
  anmdmAuthType: z.string().optional(),
  anmdmIssueDate: z.string().optional(), // Will be converted to timestamp
  anmdmExpiryDate: z.string().optional(), // Will be converted to timestamp
  anmdmIssuingAuthority: z.string().optional(),
  anmdmNotes: z.string().optional(),
});

// Get all vehicles with pagination and search
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    const db = getDb();

    // Build query with joins
    let baseQuery = db
      .select({
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate,
        brandId: vehicles.brandId,
        brandName: brands.brandName,
        modelId: vehicles.modelId,
        modelName: models.modelName,
        year: vehicles.year,
        fuelTypeId: vehicles.fuelTypeId,
        fuelTypeName: fuelTypes.fuelName,
        vehicleTypeId: vehicles.vehicleTypeId,
        vehicleTypeName: vehicleTypes.typeName,
        statusId: vehicles.statusId,
        statusName: vehicleStatuses.statusName,
        employeeId: vehicles.employeeId,
        employeeName: employees.fullName,
        odometer: vehicles.odometer,
        description: vehicles.description,
        active: vehicles.active,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt
      })
      .from(vehicles)
      .leftJoin(brands, eq(vehicles.brandId, brands.id))
      .leftJoin(models, eq(vehicles.modelId, models.id))
      .leftJoin(fuelTypes, eq(vehicles.fuelTypeId, fuelTypes.id))
      .leftJoin(vehicleTypes, eq(vehicles.vehicleTypeId, vehicleTypes.id))
      .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
      .leftJoin(employees, eq(vehicles.employeeId, employees.id))
      .where(eq(vehicles.active, true));

    if (search) {
      baseQuery = baseQuery.where(
        and(
          eq(vehicles.active, true),
          or(
            like(vehicles.vehicleCode, `%${search}%`),
            like(vehicles.licensePlate, `%${search}%`),
            like(brands.brandName, `%${search}%`),
            like(models.modelName, `%${search}%`)
          )
        )
      );
    }

    const results = await baseQuery.limit(limit).offset(offset);

    // Get total count for pagination
    const totalQuery = db
      .select({ count: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.active, true));

    if (search) {
      totalQuery.where(
        and(
          eq(vehicles.active, true),
          or(
            like(vehicles.vehicleCode, `%${search}%`),
            like(vehicles.licensePlate, `%${search}%`)
          )
        )
      );
    }

    const totalResult = await totalQuery;
    const total = totalResult.length;

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();
    const [vehicle] = await db
      .select({
        id: vehicles.id,
        vehicleCode: vehicles.vehicleCode,
        licensePlate: vehicles.licensePlate,
        brandId: vehicles.brandId,
        brandName: brands.brandName,
        modelId: vehicles.modelId,
        modelName: models.modelName,
        year: vehicles.year,
        fuelTypeId: vehicles.fuelTypeId,
        fuelTypeName: fuelTypes.fuelName,
        vehicleTypeId: vehicles.vehicleTypeId,
        vehicleTypeName: vehicleTypes.typeName,
        statusId: vehicles.statusId,
        statusName: vehicleStatuses.statusName,
        locationId: vehicles.locationId,
        departmentId: vehicles.departmentId,
        employeeId: vehicles.employeeId,
        employeeName: employees.fullName,
        odometer: vehicles.odometer,
        description: vehicles.description,
        active: vehicles.active,
        // ANMDM Authorization fields
        anmdmAuthNumber: vehicles.anmdmAuthNumber,
        anmdmAuthType: vehicles.anmdmAuthType,
        anmdmIssueDate: vehicles.anmdmIssueDate,
        anmdmExpiryDate: vehicles.anmdmExpiryDate,
        anmdmIssuingAuthority: vehicles.anmdmIssuingAuthority,
        anmdmNotes: vehicles.anmdmNotes,
        anmdmDocumentPath: vehicles.anmdmDocumentPath,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt
      })
      .from(vehicles)
      .leftJoin(brands, eq(vehicles.brandId, brands.id))
      .leftJoin(models, eq(vehicles.modelId, models.id))
      .leftJoin(fuelTypes, eq(vehicles.fuelTypeId, fuelTypes.id))
      .leftJoin(vehicleTypes, eq(vehicles.vehicleTypeId, vehicleTypes.id))
      .leftJoin(vehicleStatuses, eq(vehicles.statusId, vehicleStatuses.id))
      .leftJoin(employees, eq(vehicles.employeeId, employees.id))
      .where(and(eq(vehicles.id, id), eq(vehicles.active, true)))
      .limit(1);

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
});

// Create new vehicle
router.post('/', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const data = vehicleSchema.parse(req.body);

    const db = getDb();

    // Check if vehicle code or license plate already exists
    const [existing] = await db.select()
      .from(vehicles)
      .where(
        or(
          eq(vehicles.vehicleCode, data.vehicleCode),
          eq(vehicles.licensePlate, data.licensePlate)
        )
      )
      .limit(1);

    if (existing) {
      throw new AppError('Vehicle code or license plate already exists', 409);
    }

    // Convert ANMDM date strings to timestamps if provided (only if not empty)
    const insertData: any = { ...data };
    if (data.anmdmIssueDate && data.anmdmIssueDate.trim() !== '') {
      insertData.anmdmIssueDate = new Date(data.anmdmIssueDate);
    } else {
      delete insertData.anmdmIssueDate;
    }
    if (data.anmdmExpiryDate && data.anmdmExpiryDate.trim() !== '') {
      insertData.anmdmExpiryDate = new Date(data.anmdmExpiryDate);
    } else {
      delete insertData.anmdmExpiryDate;
    }

    const result = await db.insert(vehicles).values(insertData).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update vehicle
router.put('/:id', authorize('admin', 'manager', 'operator'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = vehicleSchema.partial().parse(req.body);

    const db = getDb();

    // Convert ANMDM date strings to timestamps if provided (only if not empty)
    const updateData: any = { ...data };
    if (data.anmdmIssueDate && data.anmdmIssueDate.trim() !== '') {
      updateData.anmdmIssueDate = new Date(data.anmdmIssueDate);
    } else if (data.anmdmIssueDate === '') {
      updateData.anmdmIssueDate = null;
    }
    if (data.anmdmExpiryDate && data.anmdmExpiryDate.trim() !== '') {
      updateData.anmdmExpiryDate = new Date(data.anmdmExpiryDate);
    } else if (data.anmdmExpiryDate === '') {
      updateData.anmdmExpiryDate = null;
    }

    const result = await db.update(vehicles)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete vehicle (soft delete)
router.delete('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const db = getDb();

    const result = await db.update(vehicles)
      .set({
        active: false,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Upload ANMDM document (PDF)
router.post('/:id/anmdm-document', authorize('admin', 'manager', 'operator'), anmdmUpload.single('anmdmDocument'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (!req.file) {
      throw new AppError('No file provided', 400);
    }

    const db = getDb();

    // Check if vehicle exists
    const [existingVehicle] = await db.select()
      .from(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.active, true)))
      .limit(1);

    if (!existingVehicle) {
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);
      throw new AppError('Vehicle not found', 404);
    }

    // If there's an existing document, delete the old file
    if (existingVehicle.anmdmDocumentPath) {
      await fs.unlink(existingVehicle.anmdmDocumentPath).catch(console.error);
    }

    // Update vehicle with new document path
    const result = await db.update(vehicles)
      .set({
        anmdmDocumentPath: req.file.path,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id))
      .returning();

    res.json({
      success: true,
      data: {
        anmdmDocumentPath: req.file.path,
        originalFileName: req.file.originalname,
        fileSize: req.file.size
      },
      message: 'ANMDM document uploaded successfully'
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
});

// Download ANMDM document
router.get('/:id/anmdm-document', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [vehicle] = await db.select({
      anmdmDocumentPath: vehicles.anmdmDocumentPath,
      licensePlate: vehicles.licensePlate
    })
      .from(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.active, true)))
      .limit(1);

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (!vehicle.anmdmDocumentPath) {
      throw new AppError('No ANMDM document found for this vehicle', 404);
    }

    // Check if file exists
    try {
      await fs.access(vehicle.anmdmDocumentPath);
    } catch {
      throw new AppError('Document file not found on disk', 404);
    }

    const fileName = `ANMDM_${vehicle.licensePlate}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.resolve(vehicle.anmdmDocumentPath));
  } catch (error) {
    next(error);
  }
});

// Delete ANMDM document
router.delete('/:id/anmdm-document', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [vehicle] = await db.select({
      anmdmDocumentPath: vehicles.anmdmDocumentPath
    })
      .from(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.active, true)))
      .limit(1);

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (!vehicle.anmdmDocumentPath) {
      throw new AppError('No ANMDM document to delete', 404);
    }

    // Delete the file from disk
    await fs.unlink(vehicle.anmdmDocumentPath).catch(console.error);

    // Update vehicle to remove document path
    await db.update(vehicles)
      .set({
        anmdmDocumentPath: null,
        updatedAt: new Date()
      })
      .where(eq(vehicles.id, id));

    res.json({
      success: true,
      message: 'ANMDM document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ===== VEHICLE IMPORT =====

// Import validation schema for each row
const vehicleImportRowSchema = z.object({
  vehicleCode: z.string().min(1).max(50),
  licensePlate: z.string().min(1).max(20),
  brandName: z.string().min(1), // Will be looked up
  modelName: z.string().min(1), // Will be looked up
  year: z.union([z.number(), z.string()]).optional(),
  fuelTypeName: z.string().min(1), // Will be looked up
  vehicleTypeName: z.string().min(1), // Will be looked up
  statusName: z.string().optional(), // Will be looked up, defaults to first status
  locationName: z.string().optional(), // Will be looked up
  departmentName: z.string().optional(), // Will be looked up
  odometer: z.union([z.number(), z.string()]).optional(),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  description: z.string().optional(),
  registrationDate: z.string().optional(),
  acquisitionDate: z.string().optional(),
  purchasePrice: z.union([z.number(), z.string()]).optional(),
  currentValue: z.union([z.number(), z.string()]).optional(),
  // ANMDM fields for import
  anmdmAuthNumber: z.string().optional(),
  anmdmAuthType: z.string().optional(),
  anmdmIssueDate: z.string().optional(),
  anmdmExpiryDate: z.string().optional(),
  anmdmIssuingAuthority: z.string().optional(),
  anmdmNotes: z.string().optional(),
});

// Helper function to validate a single vehicle row
async function validateVehicleRow(
  row: any,
  rowNum: number,
  brandMap: Map<string, any>,
  allModels: any[],
  fuelTypeMap: Map<string, any>,
  vehicleTypeMap: Map<string, any>,
  statusMap: Map<string, any>,
  locationMap: Map<string, any>,
  departmentMap: Map<string, any>,
  defaultStatus: any
): Promise<{ valid: boolean; data?: any; error?: string }> {
  try {
    // Validate row structure
    const validatedRow = vehicleImportRowSchema.parse(row);

    // Look up brand
    const brand = brandMap.get(validatedRow.brandName.toLowerCase());
    if (!brand) {
      throw new Error(`Brand "${validatedRow.brandName}" not found`);
    }

    // Look up model (must match brand)
    const modelKey = `${brand.id}-${validatedRow.modelName.toLowerCase()}`;
    let model = allModels.find(m =>
      m.brandId === brand.id && m.modelName.toLowerCase() === validatedRow.modelName.toLowerCase()
    );

    // If model not found for this brand, try to find any model with this name
    if (!model) {
      model = allModels.find(m => m.modelName.toLowerCase() === validatedRow.modelName.toLowerCase());
      if (!model) {
        throw new Error(`Model "${validatedRow.modelName}" not found`);
      }
    }

    // Look up fuel type
    const fuelType = fuelTypeMap.get(validatedRow.fuelTypeName.toLowerCase());
    if (!fuelType) {
      throw new Error(`Fuel type "${validatedRow.fuelTypeName}" not found`);
    }

    // Look up vehicle type
    const vehicleType = vehicleTypeMap.get(validatedRow.vehicleTypeName.toLowerCase());
    if (!vehicleType) {
      throw new Error(`Vehicle type "${validatedRow.vehicleTypeName}" not found`);
    }

    // Look up status (optional, use default if not provided)
    let status = defaultStatus;
    if (validatedRow.statusName) {
      status = statusMap.get(validatedRow.statusName.toLowerCase());
      if (!status) {
        throw new Error(`Status "${validatedRow.statusName}" not found`);
      }
    }

    if (!status) {
      throw new Error('No vehicle status available. Please create at least one status first.');
    }

    // Look up location (optional)
    let locationId = undefined;
    if (validatedRow.locationName) {
      const location = locationMap.get(validatedRow.locationName.toLowerCase());
      if (!location) {
        throw new Error(`Location "${validatedRow.locationName}" not found`);
      }
      locationId = location.id;
    }

    // Look up department (optional)
    let departmentId = undefined;
    if (validatedRow.departmentName) {
      const department = departmentMap.get(validatedRow.departmentName.toLowerCase());
      if (!department) {
        throw new Error(`Department "${validatedRow.departmentName}" not found`);
      }
      departmentId = department.id;
    }

    // Parse dates
    const parseDate = (dateStr: string | undefined): Date | undefined => {
      if (!dateStr) return undefined;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date;
    };

    // Parse numbers
    const parseNumber = (val: string | number | undefined): number | undefined => {
      if (val === undefined || val === '') return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : num;
    };

    return {
      valid: true,
      data: {
        vehicleCode: validatedRow.vehicleCode,
        licensePlate: validatedRow.licensePlate,
        brandId: brand.id,
        modelId: model.id,
        year: parseNumber(validatedRow.year),
        fuelTypeId: fuelType.id,
        vehicleTypeId: vehicleType.id,
        statusId: status.id,
        locationId,
        departmentId,
        odometer: parseNumber(validatedRow.odometer) || 0,
        engineNumber: validatedRow.engineNumber,
        chassisNumber: validatedRow.chassisNumber,
        description: validatedRow.description,
        registrationDate: parseDate(validatedRow.registrationDate),
        acquisitionDate: parseDate(validatedRow.acquisitionDate),
        purchasePrice: parseNumber(validatedRow.purchasePrice),
        currentValue: parseNumber(validatedRow.currentValue),
        anmdmAuthNumber: validatedRow.anmdmAuthNumber,
        anmdmAuthType: validatedRow.anmdmAuthType,
        anmdmIssueDate: parseDate(validatedRow.anmdmIssueDate),
        anmdmExpiryDate: parseDate(validatedRow.anmdmExpiryDate),
        anmdmIssuingAuthority: validatedRow.anmdmIssuingAuthority,
        anmdmNotes: validatedRow.anmdmNotes,
      }
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Unknown validation error'
    };
  }
}

// DRY-RUN: Validate import data without actually importing
router.post('/import/validate', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const { vehicles: vehicleData } = req.body;

    if (!Array.isArray(vehicleData) || vehicleData.length === 0) {
      throw new AppError('No vehicle data provided', 400);
    }

    const db = getDb();
    const results = {
      totalRows: vehicleData.length,
      validRows: 0,
      invalidRows: 0,
      errors: [] as { row: number; error: string; data?: any }[],
      warnings: [] as { row: number; warning: string }[],
      duplicates: [] as { row: number; field: string; value: string }[]
    };

    // Pre-fetch all reference data for lookups
    const [
      allBrands,
      allModels,
      allFuelTypes,
      allVehicleTypes,
      allStatuses,
      allLocations,
      allDepartments,
      existingVehicles
    ] = await Promise.all([
      db.select().from(brands).where(eq(brands.active, true)),
      db.select().from(models).where(eq(models.active, true)),
      db.select().from(fuelTypes).where(eq(fuelTypes.active, true)),
      db.select().from(vehicleTypes).where(eq(vehicleTypes.active, true)),
      db.select().from(vehicleStatuses).where(eq(vehicleStatuses.active, true)),
      db.select().from(locations).where(eq(locations.active, true)),
      db.select().from(departments).where(eq(departments.active, true)),
      db.select({ vehicleCode: vehicles.vehicleCode, licensePlate: vehicles.licensePlate }).from(vehicles).where(eq(vehicles.active, true))
    ]);

    // Create lookup maps (case-insensitive)
    const brandMap = new Map(allBrands.map(b => [b.brandName.toLowerCase(), b]));
    const fuelTypeMap = new Map(allFuelTypes.map(f => [f.fuelName.toLowerCase(), f]));
    const vehicleTypeMap = new Map(allVehicleTypes.map(t => [t.typeName.toLowerCase(), t]));
    const statusMap = new Map(allStatuses.map(s => [s.statusName.toLowerCase(), s]));
    const locationMap = new Map(allLocations.map(l => [l.locationName.toLowerCase(), l]));
    const departmentMap = new Map(allDepartments.map(d => [d.departmentName.toLowerCase(), d]));

    // Create sets for duplicate checking
    const existingCodes = new Set(existingVehicles.map(v => v.vehicleCode.toLowerCase()));
    const existingPlates = new Set(existingVehicles.map(v => v.licensePlate.toLowerCase()));
    const importCodes = new Set<string>();
    const importPlates = new Set<string>();

    // Get default status if available
    const defaultStatus = allStatuses[0];

    // Validate each row
    for (let i = 0; i < vehicleData.length; i++) {
      const rowNum = i + 1;
      const row = vehicleData[i];

      // Check for duplicates within import data
      if (row.vehicleCode) {
        const code = row.vehicleCode.toLowerCase();
        if (importCodes.has(code)) {
          results.duplicates.push({ row: rowNum, field: 'vehicleCode', value: row.vehicleCode });
        }
        importCodes.add(code);

        // Check against existing vehicles
        if (existingCodes.has(code)) {
          results.duplicates.push({ row: rowNum, field: 'vehicleCode', value: `${row.vehicleCode} (already exists)` });
        }
      }

      if (row.licensePlate) {
        const plate = row.licensePlate.toLowerCase();
        if (importPlates.has(plate)) {
          results.duplicates.push({ row: rowNum, field: 'licensePlate', value: row.licensePlate });
        }
        importPlates.add(plate);

        // Check against existing vehicles
        if (existingPlates.has(plate)) {
          results.duplicates.push({ row: rowNum, field: 'licensePlate', value: `${row.licensePlate} (already exists)` });
        }
      }

      const validation = await validateVehicleRow(
        row,
        rowNum,
        brandMap,
        allModels,
        fuelTypeMap,
        vehicleTypeMap,
        statusMap,
        locationMap,
        departmentMap,
        defaultStatus
      );

      if (validation.valid) {
        results.validRows++;
      } else {
        results.invalidRows++;
        results.errors.push({
          row: rowNum,
          error: validation.error || 'Unknown error',
          data: { vehicleCode: row.vehicleCode, licensePlate: row.licensePlate }
        });
      }
    }

    // Add duplicate errors to the error list
    for (const dup of results.duplicates) {
      results.errors.push({
        row: dup.row,
        error: `Duplicate ${dup.field}: ${dup.value}`,
      });
      // Don't double count if already counted as invalid
      if (!results.errors.some(e => e.row === dup.row && !e.error.includes('Duplicate'))) {
        results.invalidRows++;
        results.validRows--;
      }
    }

    // Log validation attempt to audit
    await logAudit(
      db,
      req.user?.id,
      req.user?.username,
      'VALIDATE',
      'vehicle-import',
      'dry-run',
      {
        totalRows: results.totalRows,
        validRows: results.validRows,
        invalidRows: results.invalidRows,
        errorsCount: results.errors.length
      },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      success: true,
      message: results.invalidRows === 0
        ? `All ${results.validRows} vehicles validated successfully`
        : `Validation completed: ${results.validRows} valid, ${results.invalidRows} invalid`,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Import vehicles from Excel data with transaction support and audit logging
router.post('/import', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  const db = getDb();
  const batchId = nanoid(10);
  const importedVehicleIds: number[] = [];

  try {
    const { vehicles: vehicleData, skipInvalid = false } = req.body;

    if (!Array.isArray(vehicleData) || vehicleData.length === 0) {
      throw new AppError('No vehicle data provided', 400);
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as { row: number; error: string; data?: any }[],
      batchId,
      canRollback: true,
      rollbackExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Pre-fetch all reference data for lookups
    const [
      allBrands,
      allModels,
      allFuelTypes,
      allVehicleTypes,
      allStatuses,
      allLocations,
      allDepartments,
      existingVehicles
    ] = await Promise.all([
      db.select().from(brands).where(eq(brands.active, true)),
      db.select().from(models).where(eq(models.active, true)),
      db.select().from(fuelTypes).where(eq(fuelTypes.active, true)),
      db.select().from(vehicleTypes).where(eq(vehicleTypes.active, true)),
      db.select().from(vehicleStatuses).where(eq(vehicleStatuses.active, true)),
      db.select().from(locations).where(eq(locations.active, true)),
      db.select().from(departments).where(eq(departments.active, true)),
      db.select({ vehicleCode: vehicles.vehicleCode, licensePlate: vehicles.licensePlate }).from(vehicles).where(eq(vehicles.active, true))
    ]);

    // Create lookup maps (case-insensitive)
    const brandMap = new Map(allBrands.map(b => [b.brandName.toLowerCase(), b]));
    const fuelTypeMap = new Map(allFuelTypes.map(f => [f.fuelName.toLowerCase(), f]));
    const vehicleTypeMap = new Map(allVehicleTypes.map(t => [t.typeName.toLowerCase(), t]));
    const statusMap = new Map(allStatuses.map(s => [s.statusName.toLowerCase(), s]));
    const locationMap = new Map(allLocations.map(l => [l.locationName.toLowerCase(), l]));
    const departmentMap = new Map(allDepartments.map(d => [d.departmentName.toLowerCase(), d]));

    // Create sets for duplicate checking
    const existingCodes = new Set(existingVehicles.map(v => v.vehicleCode.toLowerCase()));
    const existingPlates = new Set(existingVehicles.map(v => v.licensePlate.toLowerCase()));

    // Get default status if available
    const defaultStatus = allStatuses[0];

    // First pass: validate all rows if not skipping invalid
    const validatedRows: { rowNum: number; data: any }[] = [];

    for (let i = 0; i < vehicleData.length; i++) {
      const rowNum = i + 1;
      const row = vehicleData[i];

      // Check for duplicates against existing vehicles
      if (row.vehicleCode && existingCodes.has(row.vehicleCode.toLowerCase())) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          error: `Vehicle code "${row.vehicleCode}" already exists`,
          data: { vehicleCode: row.vehicleCode, licensePlate: row.licensePlate }
        });
        continue;
      }

      if (row.licensePlate && existingPlates.has(row.licensePlate.toLowerCase())) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          error: `License plate "${row.licensePlate}" already exists`,
          data: { vehicleCode: row.vehicleCode, licensePlate: row.licensePlate }
        });
        continue;
      }

      const validation = await validateVehicleRow(
        row,
        rowNum,
        brandMap,
        allModels,
        fuelTypeMap,
        vehicleTypeMap,
        statusMap,
        locationMap,
        departmentMap,
        defaultStatus
      );

      if (validation.valid && validation.data) {
        validatedRows.push({ rowNum, data: validation.data });
        // Add to existing sets to catch duplicates within the import
        existingCodes.add(row.vehicleCode.toLowerCase());
        existingPlates.add(row.licensePlate.toLowerCase());
      } else {
        results.failed++;
        results.errors.push({
          row: rowNum,
          error: validation.error || 'Unknown error',
          data: { vehicleCode: row.vehicleCode, licensePlate: row.licensePlate }
        });
      }
    }

    // If not skipping invalid and there are errors, don't proceed
    if (!skipInvalid && results.failed > 0) {
      throw new AppError(`Validation failed: ${results.failed} invalid rows. Use dry-run to check errors first.`, 400);
    }

    // Second pass: insert all validated vehicles
    // Using individual inserts with error handling for transaction-like behavior
    for (const { rowNum, data } of validatedRows) {
      try {
        const [inserted] = await db.insert(vehicles).values(data).returning({ id: vehicles.id });
        importedVehicleIds.push(inserted.id);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          error: error.message || 'Database insert error',
          data: { vehicleCode: data.vehicleCode, licensePlate: data.licensePlate }
        });

        // If we have errors and not skipping invalid, rollback all inserted vehicles
        if (!skipInvalid) {
          // Rollback: delete all imported vehicles
          if (importedVehicleIds.length > 0) {
            await db.update(vehicles)
              .set({ active: false, updatedAt: new Date() })
              .where(inArray(vehicles.id, importedVehicleIds));
          }
          throw new AppError(`Import failed at row ${rowNum}: ${error.message}. All changes rolled back.`, 500);
        }
      }
    }

    // Store batch info for potential rollback
    if (importedVehicleIds.length > 0 && req.user) {
      importBatches.set(batchId, {
        batchId,
        vehicleIds: importedVehicleIds,
        importedAt: new Date(),
        userId: req.user.id,
        username: req.user.username
      });
    }

    // Log successful import to audit
    await logAudit(
      db,
      req.user?.id,
      req.user?.username,
      'IMPORT',
      'vehicle-import',
      batchId,
      {
        totalRows: vehicleData.length,
        successCount: results.success,
        failedCount: results.failed,
        vehicleIds: importedVehicleIds,
        errors: results.errors.length > 0 ? results.errors.slice(0, 10) : undefined // Limit error details in audit
      },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      success: true,
      message: `Import completed: ${results.success} vehicles imported, ${results.failed} failed`,
      data: results
    });
  } catch (error: any) {
    // Log failed import attempt to audit
    await logAudit(
      db,
      req.user?.id,
      req.user?.username,
      'IMPORT_FAILED',
      'vehicle-import',
      batchId,
      {
        error: error.message,
        rolledBack: importedVehicleIds.length > 0
      },
      req.ip,
      req.headers['user-agent']
    );

    next(error);
  }
});

// Rollback a vehicle import batch
router.post('/import/:batchId/rollback', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const { batchId } = req.params;
    const db = getDb();

    // Check if batch exists and is rollbackable
    const batch = importBatches.get(batchId);

    if (!batch) {
      throw new AppError('Import batch not found or rollback period has expired (24 hours)', 404);
    }

    // Check if user is authorized (same user or admin)
    if (req.user?.role !== 'admin' && req.user?.id !== batch.userId) {
      throw new AppError('You can only rollback your own imports', 403);
    }

    // Soft delete all vehicles in the batch
    const result = await db.update(vehicles)
      .set({ active: false, updatedAt: new Date() })
      .where(inArray(vehicles.id, batch.vehicleIds))
      .returning({ id: vehicles.id });

    // Remove batch from store
    importBatches.delete(batchId);

    // Log rollback to audit
    await logAudit(
      db,
      req.user?.id,
      req.user?.username,
      'IMPORT_ROLLBACK',
      'vehicle-import',
      batchId,
      {
        vehicleCount: result.length,
        vehicleIds: batch.vehicleIds,
        originalImportBy: batch.username,
        originalImportAt: batch.importedAt
      },
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      success: true,
      message: `Successfully rolled back import batch ${batchId}: ${result.length} vehicles removed`,
      data: {
        batchId,
        vehiclesRemoved: result.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get import batch status (check if rollback is available)
router.get('/import/:batchId/status', authorize('admin', 'manager'), async (req: AuthRequest, res, next) => {
  try {
    const { batchId } = req.params;

    const batch = importBatches.get(batchId);

    if (!batch) {
      res.json({
        success: true,
        data: {
          batchId,
          found: false,
          canRollback: false,
          message: 'Batch not found or rollback period expired'
        }
      });
      return;
    }

    const expiresAt = new Date(batch.importedAt.getTime() + 24 * 60 * 60 * 1000);
    const canRollback = req.user?.role === 'admin' || req.user?.id === batch.userId;

    res.json({
      success: true,
      data: {
        batchId,
        found: true,
        canRollback,
        vehicleCount: batch.vehicleIds.length,
        importedAt: batch.importedAt,
        importedBy: batch.username,
        rollbackExpiresAt: expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get import template info (list of required fields and reference values)
router.get('/import/template-info', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const db = getDb();

    // Fetch all reference data
    const [
      allBrands,
      allModels,
      allFuelTypes,
      allVehicleTypes,
      allStatuses,
      allLocations,
      allDepartments
    ] = await Promise.all([
      db.select().from(brands).where(eq(brands.active, true)),
      db.select().from(models).where(eq(models.active, true)),
      db.select().from(fuelTypes).where(eq(fuelTypes.active, true)),
      db.select().from(vehicleTypes).where(eq(vehicleTypes.active, true)),
      db.select().from(vehicleStatuses).where(eq(vehicleStatuses.active, true)),
      db.select().from(locations).where(eq(locations.active, true)),
      db.select().from(departments).where(eq(departments.active, true))
    ]);

    res.json({
      success: true,
      data: {
        columns: [
          { name: 'vehicleCode', required: true, description: 'Unique vehicle code' },
          { name: 'licensePlate', required: true, description: 'License plate number' },
          { name: 'brandName', required: true, description: 'Vehicle brand name' },
          { name: 'modelName', required: true, description: 'Vehicle model name' },
          { name: 'year', required: false, description: 'Year of manufacture' },
          { name: 'fuelTypeName', required: true, description: 'Fuel type' },
          { name: 'vehicleTypeName', required: true, description: 'Vehicle type' },
          { name: 'statusName', required: false, description: 'Vehicle status (defaults to first available)' },
          { name: 'locationName', required: false, description: 'Location name' },
          { name: 'departmentName', required: false, description: 'Department name' },
          { name: 'odometer', required: false, description: 'Current odometer reading' },
          { name: 'engineNumber', required: false, description: 'Engine number' },
          { name: 'chassisNumber', required: false, description: 'Chassis/VIN number' },
          { name: 'description', required: false, description: 'Vehicle description' },
          { name: 'registrationDate', required: false, description: 'Registration date (YYYY-MM-DD)' },
          { name: 'acquisitionDate', required: false, description: 'Acquisition date (YYYY-MM-DD)' },
          { name: 'purchasePrice', required: false, description: 'Purchase price' },
          { name: 'currentValue', required: false, description: 'Current value' },
          { name: 'anmdmAuthNumber', required: false, description: 'ANMDM Authorization Number' },
          { name: 'anmdmAuthType', required: false, description: 'ANMDM Authorization Type' },
          { name: 'anmdmIssueDate', required: false, description: 'ANMDM Issue Date (YYYY-MM-DD)' },
          { name: 'anmdmExpiryDate', required: false, description: 'ANMDM Expiry Date (YYYY-MM-DD)' },
          { name: 'anmdmIssuingAuthority', required: false, description: 'ANMDM Issuing Authority' },
          { name: 'anmdmNotes', required: false, description: 'ANMDM Notes' }
        ],
        referenceData: {
          brands: allBrands.map(b => b.brandName),
          models: allModels.map(m => ({ name: m.modelName, brand: allBrands.find(b => b.id === m.brandId)?.brandName })),
          fuelTypes: allFuelTypes.map(f => f.fuelName),
          vehicleTypes: allVehicleTypes.map(t => t.typeName),
          statuses: allStatuses.map(s => s.statusName),
          locations: allLocations.map(l => l.locationName),
          departments: allDepartments.map(d => d.departmentName)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Configure multer for bulk document uploads during import
const importDocsStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const batchId = req.params.batchId || 'temp';
    const uploadPath = path.join(importDocsDir, batchId);
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Keep original filename for matching purposes
    cb(null, file.originalname);
  }
});

const importDocsUpload = multer({
  storage: importDocsStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 100 // Max 100 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF for ANMDM documents and images for photos
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files (JPEG, PNG, WebP) are allowed'), false);
    }
  }
});

// Bulk import ANMDM documents and photos for vehicles
// Documents are matched to vehicles by vehicle code or license plate in filename
router.post('/import/:batchId/documents', authorize('admin', 'manager'), importDocsUpload.array('documents', 100), async (req: AuthRequest, res, next) => {
  try {
    const { batchId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError('No files provided', 400);
    }

    const db = getDb();
    const results = {
      batchId,
      totalFiles: files.length,
      matched: 0,
      unmatched: 0,
      errors: [] as { filename: string; error: string }[],
      matchedVehicles: [] as { vehicleCode: string; licensePlate: string; documentType: string; filename: string }[]
    };

    // Get all active vehicles for matching
    const allVehicles = await db.select({
      id: vehicles.id,
      vehicleCode: vehicles.vehicleCode,
      licensePlate: vehicles.licensePlate
    }).from(vehicles).where(eq(vehicles.active, true));

    // Create lookup maps for matching
    const vehicleByCode = new Map(allVehicles.map(v => [v.vehicleCode.toLowerCase(), v]));
    const vehicleByPlate = new Map(allVehicles.map(v => [v.licensePlate.toLowerCase().replace(/[^a-z0-9]/g, ''), v]));

    for (const file of files) {
      try {
        const filename = file.originalname;
        const filenameNoExt = path.parse(filename).name.toLowerCase();
        const ext = path.extname(filename).toLowerCase();
        const isPdf = ext === '.pdf';
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

        // Try to find matching vehicle
        let matchedVehicle = null;

        // First try exact code match
        for (const [code, vehicle] of vehicleByCode) {
          if (filenameNoExt.includes(code)) {
            matchedVehicle = vehicle;
            break;
          }
        }

        // If not found, try license plate match (normalize by removing non-alphanumeric)
        if (!matchedVehicle) {
          const normalizedFilename = filenameNoExt.replace(/[^a-z0-9]/g, '');
          for (const [plate, vehicle] of vehicleByPlate) {
            if (normalizedFilename.includes(plate)) {
              matchedVehicle = vehicle;
              break;
            }
          }
        }

        if (matchedVehicle) {
          const vehicleDir = path.join(uploadsDir, matchedVehicle.id.toString());
          await fs.mkdir(vehicleDir, { recursive: true });

          if (isPdf) {
            // Move PDF to vehicle's ANMDM document location
            const newPath = path.join(vehicleDir, `anmdm-${Date.now()}${ext}`);
            await fs.rename(file.path, newPath);

            // Update vehicle with ANMDM document path
            await db.update(vehicles)
              .set({
                anmdmDocumentPath: newPath,
                updatedAt: new Date()
              })
              .where(eq(vehicles.id, matchedVehicle.id));

            results.matched++;
            results.matchedVehicles.push({
              vehicleCode: allVehicles.find(v => v.id === matchedVehicle!.id)!.vehicleCode,
              licensePlate: allVehicles.find(v => v.id === matchedVehicle!.id)!.licensePlate,
              documentType: 'anmdm',
              filename
            });
          } else if (isImage) {
            // For photos, we would need a photos table - for now just move to vehicle directory
            const photosDir = path.join(process.cwd(), 'uploads', 'vehicle-photos', matchedVehicle.id.toString());
            await fs.mkdir(photosDir, { recursive: true });
            const newPath = path.join(photosDir, `photo-${Date.now()}${ext}`);
            await fs.rename(file.path, newPath);

            results.matched++;
            results.matchedVehicles.push({
              vehicleCode: allVehicles.find(v => v.id === matchedVehicle!.id)!.vehicleCode,
              licensePlate: allVehicles.find(v => v.id === matchedVehicle!.id)!.licensePlate,
              documentType: 'photo',
              filename
            });
          }
        } else {
          results.unmatched++;
          results.errors.push({
            filename,
            error: 'Could not match to any vehicle by code or license plate'
          });
          // Clean up unmatched file
          await fs.unlink(file.path).catch(() => {});
        }
      } catch (error: any) {
        results.errors.push({
          filename: file.originalname,
          error: error.message || 'Unknown error processing file'
        });
        // Clean up on error
        await fs.unlink(file.path).catch(() => {});
      }
    }

    // Log document import to audit
    await logAudit(
      db,
      req.user?.id,
      req.user?.username,
      'IMPORT_DOCUMENTS',
      'vehicle-import',
      batchId,
      {
        totalFiles: results.totalFiles,
        matched: results.matched,
        unmatched: results.unmatched
      },
      req.ip,
      req.headers['user-agent']
    );

    // Clean up batch directory
    const batchDir = path.join(importDocsDir, batchId);
    await fs.rm(batchDir, { recursive: true, force: true }).catch(() => {});

    res.json({
      success: true,
      message: `Document import completed: ${results.matched} matched, ${results.unmatched} unmatched`,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

export default router;