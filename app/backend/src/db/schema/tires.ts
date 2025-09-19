import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';

export const tireDefinitions = sqliteTable('tire_definitions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tireCode: text('tire_code').notNull().unique(),
  tireName: text('tire_name').notNull(),
  brandId: integer('brand_id'),
  modelId: integer('model_id'),
  size: text('size').notNull(),
  loadIndex: text('load_index'),
  speedIndex: text('speed_index'),
  tireType: text('tire_type'), // summer, winter, all_season
  pattern: text('pattern'),
  description: text('description'),
  standardPrice: real('standard_price'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const axles = sqliteTable('axles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  axleName: text('axle_name').notNull(),
  axleType: text('axle_type').notNull(), // front, rear, trailer
  axlePosition: integer('axle_position').notNull(),
  maxTireCount: integer('max_tire_count').notNull(),
  currentTireCount: integer('current_tire_count').notNull().default(0),
  tireSize: text('tire_size'),
  loadCapacity: real('load_capacity'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const tireInventory = sqliteTable('tire_inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tireDefinitionId: integer('tire_definition_id').notNull().references(() => tireDefinitions.id),
  serialNumber: text('serial_number').unique(),
  barcodeNumber: text('barcode_number'),
  vehicleId: integer('vehicle_id').references(() => vehicles.id),
  axleId: integer('axle_id').references(() => axles.id),
  axlePosition: text('axle_position'), // front_left, front_right, rear_left, rear_right, etc.
  installationDate: integer('installation_date', { mode: 'timestamp' }),
  installationOdometer: integer('installation_odometer'),
  currentOdometer: integer('current_odometer'),
  totalMileage: integer('total_mileage').default(0),
  condition: text('condition'), // new, good, fair, poor, damaged
  wearLevel: real('wear_level'), // percentage
  pressureLevel: real('pressure_level'),
  lastInspectionDate: integer('last_inspection_date', { mode: 'timestamp' }),
  nextInspectionDate: integer('next_inspection_date', { mode: 'timestamp' }),
  removalDate: integer('removal_date', { mode: 'timestamp' }),
  removalOdometer: integer('removal_odometer'),
  removalReason: text('removal_reason'),
  status: text('status').notNull().default('stored'), // active, stored, disposed, transferred
  warehouseId: integer('warehouse_id'),
  locationId: integer('location_id'),
  supplierId: integer('supplier_id'),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }),
  purchasePrice: real('purchase_price'),
  warrantyExpiryDate: integer('warranty_expiry_date', { mode: 'timestamp' }),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type TireDefinition = typeof tireDefinitions.$inferSelect;
export type NewTireDefinition = typeof tireDefinitions.$inferInsert;
export type Axle = typeof axles.$inferSelect;
export type NewAxle = typeof axles.$inferInsert;
export type TireInventory = typeof tireInventory.$inferSelect;
export type NewTireInventory = typeof tireInventory.$inferInsert;