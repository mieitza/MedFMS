import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Units of measurement
export const units = sqliteTable('units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  unitCode: text('unit_code').notNull().unique(),
  unitName: text('unit_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Material types
export const materialTypes = sqliteTable('material_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Material categories
export const materialCategories = sqliteTable('material_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryCode: text('category_code').notNull().unique(),
  categoryName: text('category_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Job positions
export const positions = sqliteTable('positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  positionCode: text('position_code').notNull().unique(),
  positionName: text('position_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// License types
export const licenseTypes = sqliteTable('license_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Inspection types (for vehicle inventory inspections)
export const inspectionTypes = sqliteTable('inspection_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type MaterialType = typeof materialTypes.$inferSelect;
export type NewMaterialType = typeof materialTypes.$inferInsert;
export type MaterialCategory = typeof materialCategories.$inferSelect;
export type NewMaterialCategory = typeof materialCategories.$inferInsert;
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
export type LicenseType = typeof licenseTypes.$inferSelect;
export type NewLicenseType = typeof licenseTypes.$inferInsert;
