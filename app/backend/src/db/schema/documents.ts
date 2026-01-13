import { integer, text, sqliteTable, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const documentCategories = sqliteTable('document_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryName: text('category_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  documentName: text('document_name').notNull(),
  originalFileName: text('original_file_name').notNull(),
  storedFileName: text('stored_file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  categoryId: integer('category_id').references(() => documentCategories.id),
  entityType: text('entity_type', { enum: ['vehicle', 'employee', 'user', 'maintenance_work_order'] }).notNull(),
  entityId: integer('entity_id').notNull(),
  description: text('description'),
  expiryDate: text('expiry_date'),
  uploadedBy: integer('uploaded_by').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const photos = sqliteTable('photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  photoName: text('photo_name').notNull(),
  originalFileName: text('original_file_name').notNull(),
  storedFileName: text('stored_file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  width: integer('width'),
  height: integer('height'),
  entityType: text('entity_type', { enum: ['vehicle', 'employee', 'user', 'incident', 'maintenance_work_order'] }).notNull(),
  entityId: integer('entity_id').notNull(),
  description: text('description'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  uploadedBy: integer('uploaded_by').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});