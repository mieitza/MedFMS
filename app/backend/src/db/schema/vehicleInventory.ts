import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';

// Define inventory item categories
export const vehicleInventoryCategories = sqliteTable('vehicle_inventory_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryCode: text('category_code').notNull().unique(),
  categoryName: text('category_name').notNull(),
  description: text('description'),
  requiresExpiration: integer('requires_expiration', { mode: 'boolean' }).notNull().default(false),
  requiresSerialNumber: integer('requires_serial_number', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Define inventory item templates (e.g., "Oxygen Tube", "Defibrillator", "Fire Extinguisher")
export const vehicleInventoryItems = sqliteTable('vehicle_inventory_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemCode: text('item_code').notNull().unique(),
  itemName: text('item_name').notNull(),
  categoryId: integer('category_id').notNull().references(() => vehicleInventoryCategories.id),
  materialId: integer('material_id'), // Reference to warehouse materials table for transfer integration
  description: text('description'),
  manufacturer: text('manufacturer'),
  model: text('model'),
  unitOfMeasure: text('unit_of_measure'), // pieces, liters, kg, etc.
  minQuantity: integer('min_quantity'), // Minimum required quantity per vehicle
  maxQuantity: integer('max_quantity'), // Maximum allowed quantity per vehicle
  standardPrice: real('standard_price'),
  requiresExpiration: integer('requires_expiration', { mode: 'boolean' }).notNull().default(false),
  requiresSerialNumber: integer('requires_serial_number', { mode: 'boolean' }).notNull().default(false),
  requiresCertification: integer('requires_certification', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Track actual inventory items assigned to vehicles
export const vehicleInventoryAssignments = sqliteTable('vehicle_inventory_assignments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  itemId: integer('item_id').notNull().references(() => vehicleInventoryItems.id),
  serialNumber: text('serial_number'),
  batchNumber: text('batch_number'),
  quantity: integer('quantity').notNull().default(1),
  condition: text('condition').notNull().default('good'), // excellent, good, fair, poor, damaged
  status: text('status').notNull().default('active'), // active, expired, damaged, removed, maintenance

  // Purchase/Assignment info
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }),
  purchasePrice: real('purchase_price'),
  supplierId: integer('supplier_id'),
  assignmentDate: integer('assignment_date', { mode: 'timestamp' }),

  // Expiration tracking
  expirationDate: integer('expiration_date', { mode: 'timestamp' }),
  manufactureDate: integer('manufacture_date', { mode: 'timestamp' }),

  // Inspection/Certification
  lastInspectionDate: integer('last_inspection_date', { mode: 'timestamp' }),
  nextInspectionDate: integer('next_inspection_date', { mode: 'timestamp' }),
  certificationNumber: text('certification_number'),
  certificationDate: integer('certification_date', { mode: 'timestamp' }),
  certificationExpiryDate: integer('certification_expiry_date', { mode: 'timestamp' }),

  // Removal tracking
  removalDate: integer('removal_date', { mode: 'timestamp' }),
  removalReason: text('removal_reason'),
  removalNotes: text('removal_notes'),

  // Additional info
  location: text('location'), // Location within vehicle (e.g., "trunk", "cabin", "driver seat")
  notes: text('notes'),

  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: integer('created_by'),
  updatedBy: integer('updated_by'),
});

// Track inspection/maintenance history for inventory items
export const vehicleInventoryInspections = sqliteTable('vehicle_inventory_inspections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assignmentId: integer('assignment_id').notNull().references(() => vehicleInventoryAssignments.id),
  inspectionDate: integer('inspection_date', { mode: 'timestamp' }).notNull(),
  inspectorId: integer('inspector_id'), // User ID of inspector
  inspectionType: text('inspection_type').notNull(), // routine, emergency, certification, repair
  condition: text('condition').notNull(), // excellent, good, fair, poor, damaged
  notes: text('notes'),
  issuesFound: text('issues_found'),
  actionTaken: text('action_taken'),
  nextInspectionDate: integer('next_inspection_date', { mode: 'timestamp' }),
  passed: integer('passed', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: integer('created_by'),
});

export type VehicleInventoryCategory = typeof vehicleInventoryCategories.$inferSelect;
export type NewVehicleInventoryCategory = typeof vehicleInventoryCategories.$inferInsert;
export type VehicleInventoryItem = typeof vehicleInventoryItems.$inferSelect;
export type NewVehicleInventoryItem = typeof vehicleInventoryItems.$inferInsert;
export type VehicleInventoryAssignment = typeof vehicleInventoryAssignments.$inferSelect;
export type NewVehicleInventoryAssignment = typeof vehicleInventoryAssignments.$inferInsert;
export type VehicleInventoryInspection = typeof vehicleInventoryInspections.$inferSelect;
export type NewVehicleInventoryInspection = typeof vehicleInventoryInspections.$inferInsert;
