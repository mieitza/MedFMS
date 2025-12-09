import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { getDb } from '../db/index.js';
import { vehicles } from '../db/schema/vehicles.js';
import { brands, models, vehicleTypes, vehicleStatuses } from '../db/schema/system.js';
import { drivers } from '../db/schema/drivers.js';
import { fuelTypes } from '../db/schema/fuel.js';
import { eq, like, and, or } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

// Configure multer for ANMDM document uploads
const uploadsDir = path.join(process.cwd(), 'uploads', 'anmdm');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

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
  driverId: z.number().optional(),
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
        driverId: vehicles.driverId,
        driverName: drivers.fullName,
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
      .leftJoin(drivers, eq(vehicles.driverId, drivers.id))
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
        driverId: vehicles.driverId,
        driverName: drivers.fullName,
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
      .leftJoin(drivers, eq(vehicles.driverId, drivers.id))
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

export default router;