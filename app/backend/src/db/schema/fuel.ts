import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';
import { drivers } from './drivers';
import { suppliers } from './system';

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

// Fuel stations where fuel is purchased
export const fuelStations = sqliteTable('fuel_stations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  stationName: text('station_name').notNull(),
  stationCode: text('station_code').notNull().unique(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  phone: text('phone'),
  email: text('email'),
  fuelTypes: text('fuel_types'), // JSON array
  operatingHours: text('operating_hours'),
  paymentMethods: text('payment_methods'), // JSON array
  services: text('services'), // JSON array
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const fuelTransactions = sqliteTable('fuel_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transactionType: text('transaction_type', { enum: ['purchase', 'consumption'] }).notNull(),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  driverId: integer('driver_id').references(() => drivers.id),
  fuelTypeId: integer('fuel_type_id').notNull().references(() => fuelTypes.id),
  locationId: integer('location_id').references(() => fuelStations.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),

  // Transaction details
  transactionDate: integer('transaction_date', { mode: 'timestamp' }).notNull(),
  quantity: real('quantity').notNull(),
  pricePerUnit: real('price_per_unit').notNull(),
  totalAmount: real('total_amount').notNull(),

  // Vehicle reading
  odometer: integer('odometer'),

  // Additional info
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

// Fuel tank capacity and current levels per vehicle
export const vehicleFuelTanks = sqliteTable('vehicle_fuel_tanks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  tankNumber: integer('tank_number').notNull().default(1), // For vehicles with multiple tanks
  fuelTypeId: integer('fuel_type_id').notNull().references(() => fuelTypes.id),

  capacity: real('capacity').notNull(), // Maximum tank capacity in liters
  currentLevel: real('current_level').notNull().default(0), // Current fuel level in liters
  minimumLevel: real('minimum_level').notNull().default(0), // Alert threshold

  lastUpdated: integer('last_updated', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Fuel budgets and allocations
export const fuelBudgets = sqliteTable('fuel_budgets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  budgetCode: text('budget_code').notNull().unique(),
  budgetName: text('budget_name').notNull(),

  // Budget period
  periodType: text('period_type', { enum: ['monthly', 'quarterly', 'yearly'] }).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),

  // Budget amounts
  allocatedAmount: real('allocated_amount').notNull(),
  spentAmount: real('spent_amount').notNull().default(0),
  remainingAmount: real('remaining_amount').notNull(),
  currency: text('currency').notNull().default('USD'),

  // Scope
  departmentId: integer('department_id'),
  vehicleId: integer('vehicle_id').references(() => vehicles.id), // Vehicle-specific budget

  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Fuel cards for cashless transactions
export const fuelCards = sqliteTable('fuel_cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cardNumber: text('card_number').notNull().unique(),
  cardProvider: text('card_provider').notNull(), // Shell, BP, Total, etc.

  // Assignment
  vehicleId: integer('vehicle_id').references(() => vehicles.id),
  driverId: integer('driver_id').references(() => drivers.id),

  // Card details
  expiryDate: integer('expiry_date', { mode: 'timestamp' }),
  creditLimit: real('credit_limit'),
  currentBalance: real('current_balance').notNull().default(0),

  // Usage restrictions
  dailyLimit: real('daily_limit'),
  weeklyLimit: real('weekly_limit'),
  monthlyLimit: real('monthly_limit'),
  allowedFuelTypes: text('allowed_fuel_types'), // JSON array of fuel type IDs
  allowedStations: text('allowed_stations'), // JSON array of station IDs

  pinCode: text('pin_code'), // Encrypted
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  blocked: integer('blocked', { mode: 'boolean' }).notNull().default(false),
  blockReason: text('block_reason'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type FuelType = typeof fuelTypes.$inferSelect;
export type NewFuelType = typeof fuelTypes.$inferInsert;
export type FuelStation = typeof fuelStations.$inferSelect;
export type NewFuelStation = typeof fuelStations.$inferInsert;
export type FuelTransaction = typeof fuelTransactions.$inferSelect;
export type NewFuelTransaction = typeof fuelTransactions.$inferInsert;
export type FuelLimit = typeof fuelLimits.$inferSelect;
export type NewFuelLimit = typeof fuelLimits.$inferInsert;
export type VehicleFuelTank = typeof vehicleFuelTanks.$inferSelect;
export type NewVehicleFuelTank = typeof vehicleFuelTanks.$inferInsert;
export type FuelBudget = typeof fuelBudgets.$inferSelect;
export type NewFuelBudget = typeof fuelBudgets.$inferInsert;
export type FuelCard = typeof fuelCards.$inferSelect;
export type NewFuelCard = typeof fuelCards.$inferInsert;