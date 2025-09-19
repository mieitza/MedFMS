import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles.js';

export const serviceDefinitions = sqliteTable('service_definitions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serviceCode: text('service_code').notNull().unique(),
  serviceName: text('service_name').notNull(),
  serviceType: text('service_type').notNull(), // maintenance, repair, inspection
  category: text('category'),
  description: text('description'),
  standardDuration: integer('standard_duration'), // in hours
  standardCost: real('standard_cost'),
  requiredSkills: text('required_skills'),
  frequencyType: text('frequency_type'), // km, time, both
  frequencyValue: integer('frequency_value'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const serviceTransactions = sqliteTable('service_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderNumber: text('work_order_number').notNull().unique(),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  serviceDefinitionId: integer('service_definition_id').references(() => serviceDefinitions.id),
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }),
  actualStartDate: integer('actual_start_date', { mode: 'timestamp' }),
  actualEndDate: integer('actual_end_date', { mode: 'timestamp' }),
  odometer: integer('odometer'),
  description: text('description'),
  serviceProviderId: integer('service_provider_id'),
  laborCost: real('labor_cost'),
  materialCost: real('material_cost'),
  totalCost: real('total_cost'),
  status: text('status').notNull().default('scheduled'), // scheduled, in_progress, completed, cancelled
  approvedBy: integer('approved_by'),
  approvalDate: integer('approval_date', { mode: 'timestamp' }),
  notes: text('notes'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insuranceRecords = sqliteTable('insurance_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  policyNumber: text('policy_number').notNull(),
  insuranceCompanyId: integer('insurance_company_id'),
  policyType: text('policy_type'), // comprehensive, liability, collision
  coverageAmount: real('coverage_amount'),
  premiumAmount: real('premium_amount'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  deductibleAmount: real('deductible_amount'),
  agentName: text('agent_name'),
  agentPhone: text('agent_phone'),
  status: text('status').notNull().default('active'), // active, expired, cancelled
  notes: text('notes'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const accidentRecords = sqliteTable('accident_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  driverId: integer('driver_id'),
  accidentDate: integer('accident_date', { mode: 'timestamp' }).notNull(),
  location: text('location'),
  description: text('description'),
  severity: text('severity'), // minor, major, total_loss
  faultPercentage: integer('fault_percentage'),
  policeReportNumber: text('police_report_number'),
  insuranceClaimNumber: text('insurance_claim_number'),
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  status: text('status').notNull().default('reported'), // reported, under_investigation, closed
  notes: text('notes'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const penaltyRecords = sqliteTable('penalty_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  driverId: integer('driver_id'),
  penaltyDefinitionId: integer('penalty_definition_id'),
  violationDate: integer('violation_date', { mode: 'timestamp' }).notNull(),
  violationLocation: text('violation_location'),
  fineAmount: real('fine_amount').notNull(),
  paidAmount: real('paid_amount').default(0),
  paymentDate: integer('payment_date', { mode: 'timestamp' }),
  paymentStatus: text('payment_status').notNull().default('unpaid'), // unpaid, partial, paid, disputed
  dueDate: integer('due_date', { mode: 'timestamp' }),
  referenceNumber: text('reference_number'),
  notes: text('notes'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type ServiceDefinition = typeof serviceDefinitions.$inferSelect;
export type NewServiceDefinition = typeof serviceDefinitions.$inferInsert;
export type ServiceTransaction = typeof serviceTransactions.$inferSelect;
export type NewServiceTransaction = typeof serviceTransactions.$inferInsert;
export type InsuranceRecord = typeof insuranceRecords.$inferSelect;
export type NewInsuranceRecord = typeof insuranceRecords.$inferInsert;
export type AccidentRecord = typeof accidentRecords.$inferSelect;
export type NewAccidentRecord = typeof accidentRecords.$inferInsert;
export type PenaltyRecord = typeof penaltyRecords.$inferSelect;
export type NewPenaltyRecord = typeof penaltyRecords.$inferInsert;