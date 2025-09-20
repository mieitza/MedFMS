import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { getDb } from '../db/index.js';
import { documents, documentCategories, photos } from '../db/schema/documents.js';
import { eq, and, or } from 'drizzle-orm';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
router.use(authenticate);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { entityType, entityId } = req.body;
    const uploadPath = path.join(uploadsDir, entityType, entityId);
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

const documentSchema = z.object({
  documentName: z.string().min(1).max(100),
  categoryId: z.number().optional(),
  entityType: z.enum(['vehicle', 'driver', 'user', 'maintenance_work_order']),
  entityId: z.number().positive(),
  description: z.string().optional(),
  expiryDate: z.string().optional(),
  isPublic: z.boolean().optional().default(false)
});

const photoSchema = z.object({
  photoName: z.string().min(1).max(100),
  entityType: z.enum(['vehicle', 'driver', 'user', 'incident', 'maintenance_work_order']),
  entityId: z.number().positive(),
  description: z.string().optional(),
  isPrimary: z.boolean().optional().default(false)
});

// Document Categories
router.get('/categories', async (req, res, next) => {
  try {
    const db = getDb();
    const categories = await db.select()
      .from(documentCategories)
      .where(eq(documentCategories.active, true));

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Get documents for an entity
router.get('/:entityType/:entityId', async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const db = getDb();

    const entityDocs = await db.select({
      id: documents.id,
      documentName: documents.documentName,
      originalFileName: documents.originalFileName,
      fileSize: documents.fileSize,
      mimeType: documents.mimeType,
      categoryId: documents.categoryId,
      categoryName: documentCategories.categoryName,
      description: documents.description,
      expiryDate: documents.expiryDate,
      isPublic: documents.isPublic,
      createdAt: documents.createdAt
    })
      .from(documents)
      .leftJoin(documentCategories, eq(documents.categoryId, documentCategories.id))
      .where(
        and(
          eq(documents.entityType, entityType),
          eq(documents.entityId, parseInt(entityId)),
          eq(documents.active, true)
        )
      );

    res.json({
      success: true,
      data: entityDocs
    });
  } catch (error) {
    next(error);
  }
});

// Upload document
router.post('/upload', authorize('admin', 'manager', 'operator'), upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file provided', 400);
    }

    const data = documentSchema.parse({
      ...req.body,
      entityId: parseInt(req.body.entityId),
      categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
      isPublic: req.body.isPublic === 'true'
    });

    const db = getDb();
    const result = await db.insert(documents).values({
      ...data,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id
    }).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    if (req.file) {
      // Clean up uploaded file if database insert fails
      fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
});

// Download document
router.get('/download/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [document] = await db.select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.active, true)))
      .limit(1);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Check if user has access to document
    if (!document.isPublic && req.user.role !== 'admin') {
      // Additional access control logic can be added here
    }

    // Check if file exists
    try {
      await fs.access(document.filePath);
    } catch {
      throw new AppError('File not found on disk', 404);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${document.originalFileName}"`);
    res.setHeader('Content-Type', document.mimeType);
    res.sendFile(path.resolve(document.filePath));
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [document] = await db.select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Soft delete
    await db.update(documents)
      .set({
        active: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(documents.id, id));

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Photo endpoints
router.get('/photos/:entityType/:entityId', async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const db = getDb();

    const entityPhotos = await db.select()
      .from(photos)
      .where(
        and(
          eq(photos.entityType, entityType),
          eq(photos.entityId, parseInt(entityId)),
          eq(photos.active, true)
        )
      );

    res.json({
      success: true,
      data: entityPhotos
    });
  } catch (error) {
    next(error);
  }
});

// Upload photo
router.post('/photos/upload', authorize('admin', 'manager', 'operator'), upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No photo provided', 400);
    }

    // Validate it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      throw new AppError('File must be an image', 400);
    }

    const data = photoSchema.parse({
      ...req.body,
      entityId: parseInt(req.body.entityId),
      isPrimary: req.body.isPrimary === 'true'
    });

    const db = getDb();

    // If this is set as primary, unset other primary photos for this entity
    if (data.isPrimary) {
      await db.update(photos)
        .set({ isPrimary: false })
        .where(
          and(
            eq(photos.entityType, data.entityType),
            eq(photos.entityId, data.entityId),
            eq(photos.active, true)
          )
        );
    }

    const result = await db.insert(photos).values({
      ...data,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id
    }).returning();

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
});

// Serve photo
router.get('/photos/view/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    const [photo] = await db.select()
      .from(photos)
      .where(and(eq(photos.id, id), eq(photos.active, true)))
      .limit(1);

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    try {
      await fs.access(photo.filePath);
    } catch {
      throw new AppError('Photo file not found', 404);
    }

    res.setHeader('Content-Type', photo.mimeType);
    res.sendFile(path.resolve(photo.filePath));
  } catch (error) {
    next(error);
  }
});

// Delete photo
router.delete('/photos/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDb();

    await db.update(photos)
      .set({
        active: false,
        updatedAt: new Date().toISOString()
      })
      .where(eq(photos.id, id));

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;