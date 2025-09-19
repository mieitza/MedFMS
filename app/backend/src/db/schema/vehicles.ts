import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const vehicles = sqliteTable('vehicles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleCode: text('vehicle_code').notNull().unique(),
  licensePlate: text('license_plate').notNull().unique(),
  brandId: integer('brand_id').notNull(),
  modelId: integer('model_id').notNull(),
  year: integer('year').notNull(),
  fuelTypeId: integer('fuel_type_id').notNull(),
  vehicleTypeId: integer('vehicle_type_id').notNull(),
  statusId: integer('status_id').notNull(),
  locationId: integer('location_id'),
  departmentId: integer('department_id'),
  driverId: integer('driver_id'),
  registrationDate: integer('registration_date', { mode: 'timestamp' }),
  acquisitionDate: integer('acquisition_date', { mode: 'timestamp' }),
  purchasePrice: real('purchase_price'),
  currentValue: real('current_value'),
  odometer: integer('odometer').notNull().default(0),
  engineNumber: text('engine_number'),
  chassisNumber: text('chassis_number'),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  // Custom fields
  customField1: text('custom_field_1'),
  customField2: text('custom_field_2'),
  customField3: text('custom_field_3'),
  customField4: text('custom_field_4'),
  customField5: text('custom_field_5'),
  customField6: text('custom_field_6'),
  customField7: text('custom_field_7'),
  customField8: text('custom_field_8'),
  customField9: real('custom_field_9'),
  customField10: real('custom_field_10'),
  customField11: text('custom_field_11'), // Reference field
  customField12: text('custom_field_12'), // Reference field
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const vehicleDocuments = sqliteTable('vehicle_documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  documentType: text('document_type').notNull(), // registration, insurance, inspection, etc.
  documentNumber: text('document_number'),
  issueDate: integer('issue_date', { mode: 'timestamp' }),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  filePath: text('file_path'),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const vehiclePhotos = sqliteTable('vehicle_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  photoType: text('photo_type').notNull(), // front, back, side, interior, engine, etc.
  filePath: text('file_path').notNull(),
  caption: text('caption'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type VehicleDocument = typeof vehicleDocuments.$inferSelect;
export type NewVehicleDocument = typeof vehicleDocuments.$inferInsert;
export type VehiclePhoto = typeof vehiclePhotos.$inferSelect;
export type NewVehiclePhoto = typeof vehiclePhotos.$inferInsert;