import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const materials = sqliteTable('materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  materialCode: text('material_code').notNull().unique(),
  materialName: text('material_name').notNull(),
  description: text('description'),
  materialTypeId: integer('material_type_id'),
  categoryId: integer('category_id'),
  unitId: integer('unit_id').notNull(),
  currentStock: real('current_stock').notNull().default(0),
  criticalLevel: real('critical_level'),
  standardPrice: real('standard_price'),
  lastPurchasePrice: real('last_purchase_price'),
  lastPurchaseDate: integer('last_purchase_date', { mode: 'timestamp' }),
  lastSalePrice: real('last_sale_price'),
  lastSaleDate: integer('last_sale_date', { mode: 'timestamp' }),
  supplierId: integer('supplier_id'),
  barcodeNumber: text('barcode_number'),
  serialNumber: text('serial_number'),
  shelfLocation: text('shelf_location'),
  warehouseId: integer('warehouse_id'),
  expirationDate: integer('expiration_date', { mode: 'timestamp' }),
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

export const warehouses = sqliteTable('warehouses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  warehouseCode: text('warehouse_code').notNull().unique(),
  warehouseName: text('warehouse_name').notNull(),
  description: text('description'),
  locationId: integer('location_id'),
  responsiblePersonId: integer('responsible_person_id'),
  capacity: real('capacity'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const materialTransactions = sqliteTable('material_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transactionType: text('transaction_type').notNull(), // entry, exit, transfer
  materialId: integer('material_id').notNull().references(() => materials.id),
  quantity: real('quantity').notNull(),
  unitPrice: real('unit_price'),
  totalAmount: real('total_amount'),
  transactionDate: integer('transaction_date', { mode: 'timestamp' }).notNull(),
  warehouseId: integer('warehouse_id').references(() => warehouses.id),
  locationId: integer('location_id'),
  supplierId: integer('supplier_id'),
  invoiceNumber: text('invoice_number'),
  workOrderId: integer('work_order_id'),
  vehicleId: integer('vehicle_id'),
  description: text('description'),
  approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
  approvedBy: integer('approved_by'),
  approvalDate: integer('approval_date', { mode: 'timestamp' }),
  userId: integer('user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Material units (for customizable unit labels)
export const materialUnits = sqliteTable('material_units', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  unitCode: text('unit_code').notNull().unique(),
  unitName: text('unit_name').notNull(),
  unitNamePlural: text('unit_name_plural'),
  abbreviation: text('abbreviation').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Warehouse transfer requests (similar to maintenance work orders)
export const warehouseTransferRequests = sqliteTable('warehouse_transfer_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  requestNumber: text('request_number').notNull().unique(),

  // Source and destination
  sourceWarehouseId: integer('source_warehouse_id').notNull().references(() => warehouses.id),
  destinationWarehouseId: integer('destination_warehouse_id').notNull().references(() => warehouses.id),
  materialId: integer('material_id').notNull().references(() => materials.id),

  // Request details
  quantity: real('quantity').notNull(),
  requestedQuantity: real('requested_quantity'),
  approvedQuantity: real('approved_quantity'),
  transferredQuantity: real('transferred_quantity'),

  // Status workflow
  status: text('status').notNull().default('pending'), // pending, approved, rejected, in_transit, completed, cancelled
  priority: integer('priority').notNull().default(3), // 1=urgent, 2=high, 3=normal, 4=low

  // Dates
  requestedDate: integer('requested_date', { mode: 'timestamp' }).notNull(),
  requiredByDate: integer('required_by_date', { mode: 'timestamp' }),
  approvedDate: integer('approved_date', { mode: 'timestamp' }),
  transferDate: integer('transfer_date', { mode: 'timestamp' }),
  completedDate: integer('completed_date', { mode: 'timestamp' }),

  // Request information
  reason: text('reason'),
  notes: text('notes'),

  // Approval workflow
  requestedBy: integer('requested_by').notNull(),
  approvedBy: integer('approved_by'),
  rejectedBy: integer('rejected_by'),
  rejectionReason: text('rejection_reason'),

  // Transfer information
  transferredBy: integer('transferred_by'),
  receivedBy: integer('received_by'),
  receivedDate: integer('received_date', { mode: 'timestamp' }),

  // Quality check
  qualityCheck: integer('quality_check', { mode: 'boolean' }).default(false),
  qualityCheckBy: integer('quality_check_by'),
  qualityCheckDate: integer('quality_check_date', { mode: 'timestamp' }),
  qualityCheckNotes: text('quality_check_notes'),

  // Tracking
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Material = typeof materials.$inferSelect;
export type NewMaterial = typeof materials.$inferInsert;
export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
export type MaterialTransaction = typeof materialTransactions.$inferSelect;
export type NewMaterialTransaction = typeof materialTransactions.$inferInsert;
export type MaterialUnit = typeof materialUnits.$inferSelect;
export type NewMaterialUnit = typeof materialUnits.$inferInsert;
export type WarehouseTransferRequest = typeof warehouseTransferRequests.$inferSelect;
export type NewWarehouseTransferRequest = typeof warehouseTransferRequests.$inferInsert;