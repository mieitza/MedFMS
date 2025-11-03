import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// System definition tables for reference data

export const brands = sqliteTable('brands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  brandCode: text('brand_code').notNull().unique(),
  brandName: text('brand_name').notNull(),
  description: text('description'),
  country: text('country'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const models = sqliteTable('models', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  modelCode: text('model_code').notNull().unique(),
  modelName: text('model_name').notNull(),
  brandId: integer('brand_id').notNull().references(() => brands.id),
  year: integer('year'),
  fuelType: text('fuel_type'),
  engineCapacity: real('engine_capacity'),
  transmissionType: text('transmission_type'),
  bodyType: text('body_type'),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  locationCode: text('location_code').notNull().unique(),
  locationName: text('location_name').notNull(),
  parentLocationId: integer('parent_location_id'),
  level: integer('level').notNull().default(1),
  locationPath: text('location_path'),
  responsiblePersonId: integer('responsible_person_id'),
  address: text('address'),
  cityId: integer('city_id'),
  phoneNumber: text('phone_number'),
  capacity: integer('capacity'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const departments = sqliteTable('departments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  departmentCode: text('department_code').notNull().unique(),
  departmentName: text('department_name').notNull(),
  parentDepartmentId: integer('parent_department_id'),
  managerId: integer('manager_id'),
  locationId: integer('location_id').references(() => locations.id),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cities = sqliteTable('cities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cityCode: text('city_code').notNull().unique(),
  cityName: text('city_name').notNull(),
  stateProvince: text('state_province'),
  country: text('country'),
  postalCode: text('postal_code'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const suppliers = sqliteTable('suppliers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplierCode: text('supplier_code').notNull().unique(),
  supplierName: text('supplier_name').notNull(),
  contactPerson: text('contact_person'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  address: text('address'),
  cityId: integer('city_id').references(() => cities.id),
  taxNumber: text('tax_number'),
  bankAccount: text('bank_account'),
  supplierType: text('supplier_type'), // fuel, material, service, tire
  rating: integer('rating'),
  notes: text('notes'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const vehicleTypes = sqliteTable('vehicle_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const vehicleStatuses = sqliteTable('vehicle_statuses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  statusCode: text('status_code').notNull().unique(),
  statusName: text('status_name').notNull(),
  description: text('description'),
  colorCode: text('color_code'), // For UI display
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const systemFuelTypes = sqliteTable('system_fuel_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  description: text('description'),
  unit: text('unit').notNull().default('L'), // Default unit is liters
  pricePerUnit: real('price_per_unit'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const penaltyDefinitions = sqliteTable('penalty_definitions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  penaltyCode: text('penalty_code').notNull().unique(),
  penaltyName: text('penalty_name').notNull(),
  penaltyType: text('penalty_type'),
  description: text('description'),
  standardAmount: real('standard_amount'),
  currency: text('currency').notNull().default('RON'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const customFields = sqliteTable('custom_fields', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type').notNull(), // vehicle, material, etc.
  fieldNumber: integer('field_number').notNull(), // 1-12
  fieldName: text('field_name').notNull(),
  fieldType: text('field_type').notNull(), // text, number, date, reference
  required: integer('required', { mode: 'boolean' }).notNull().default(false),
  defaultValue: text('default_value'),
  referenceTable: text('reference_table'), // For reference fields
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type VehicleType = typeof vehicleTypes.$inferSelect;
export type NewVehicleType = typeof vehicleTypes.$inferInsert;
export type VehicleStatus = typeof vehicleStatuses.$inferSelect;
export type NewVehicleStatus = typeof vehicleStatuses.$inferInsert;
export type SystemFuelType = typeof systemFuelTypes.$inferSelect;
export type NewSystemFuelType = typeof systemFuelTypes.$inferInsert;
export type PenaltyDefinition = typeof penaltyDefinitions.$inferSelect;
export type NewPenaltyDefinition = typeof penaltyDefinitions.$inferInsert;
export type CustomField = typeof customFields.$inferSelect;
export type NewCustomField = typeof customFields.$inferInsert;