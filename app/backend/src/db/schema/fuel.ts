import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';
import { drivers } from './drivers';

export const fuelTypes = sqliteTable('fuel_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fuelCode: text('fuel_code').notNull().unique(),
  fuelName: text('fuel_name').notNull(),
  description: text('description'),
  unit: text('unit').notNull().default('L'), // Liters, Gallons, etc.
  currentPrice: real('current_price').notNull(),
  density: real('density'), // kg/L for calculations
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const fuelTransactions = sqliteTable('fuel_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transactionType: text('transaction_type').notNull(), // entry, exit, transfer
  vehicleId: integer('vehicle_id').references(() => vehicles.id),
  driverId: integer('driver_id').references(() => drivers.id),
  fuelTypeId: integer('fuel_type_id').notNull().references(() => fuelTypes.id),
  quantity: real('quantity').notNull(),
  pricePerUnit: real('price_per_unit').notNull(),
  totalAmount: real('total_amount').notNull(),
  odometer: integer('odometer'),
  transactionDate: integer('transaction_date', { mode: 'timestamp' }).notNull(),
  locationId: integer('location_id'),
  supplierId: integer('supplier_id'),
  invoiceNumber: text('invoice_number'),
  description: text('description'),
  approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
  approvedBy: integer('approved_by'),
  approvalDate: integer('approval_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const fuelLimits = sqliteTable('fuel_limits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  fuelTypeId: integer('fuel_type_id').notNull().references(() => fuelTypes.id),
  dailyLimit: real('daily_limit'),
  weeklyLimit: real('weekly_limit'),
  monthlyLimit: real('monthly_limit'),
  unitLimit: real('unit_limit'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  effectiveDate: integer('effective_date', { mode: 'timestamp' }).notNull(),
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type FuelType = typeof fuelTypes.$inferSelect;
export type NewFuelType = typeof fuelTypes.$inferInsert;
export type FuelTransaction = typeof fuelTransactions.$inferSelect;
export type NewFuelTransaction = typeof fuelTransactions.$inferInsert;
export type FuelLimit = typeof fuelLimits.$inferSelect;
export type NewFuelLimit = typeof fuelLimits.$inferInsert;