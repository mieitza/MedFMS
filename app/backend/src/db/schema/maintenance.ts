import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { vehicles } from './vehicles';
import { drivers } from './drivers';
import { suppliers } from './system';

// Maintenance types and categories
export const maintenanceTypes = sqliteTable('maintenance_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  typeCode: text('type_code').notNull().unique(),
  typeName: text('type_name').notNull(),
  category: text('category').notNull(), // preventive, corrective, emergency, inspection
  description: text('description'),
  estimatedDuration: integer('estimated_duration'), // in minutes
  estimatedCost: real('estimated_cost'),
  priority: integer('priority').notNull().default(3), // 1=urgent, 2=high, 3=normal, 4=low, 5=optional
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Maintenance schedules for vehicles
export const maintenanceSchedules = sqliteTable('maintenance_schedules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  maintenanceTypeId: integer('maintenance_type_id').notNull().references(() => maintenanceTypes.id),

  // Schedule criteria
  intervalType: text('interval_type', { enum: ['kilometers', 'days', 'months', 'hours'] }).notNull(),
  intervalValue: integer('interval_value').notNull(), // e.g., 5000 km, 30 days, 3 months

  // Last maintenance tracking
  lastMaintenanceDate: integer('last_maintenance_date', { mode: 'timestamp' }),
  lastMaintenanceKm: integer('last_maintenance_km'),
  lastMaintenanceHours: integer('last_maintenance_hours'),

  // Next maintenance calculation
  nextMaintenanceDate: integer('next_maintenance_date', { mode: 'timestamp' }),
  nextMaintenanceKm: integer('next_maintenance_km'),
  nextMaintenanceHours: integer('next_maintenance_hours'),

  // Settings
  reminderDaysBefore: integer('reminder_days_before').notNull().default(7),
  reminderKmBefore: integer('reminder_km_before').notNull().default(500),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Maintenance work orders
export const maintenanceWorkOrders = sqliteTable('maintenance_work_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderNumber: text('work_order_number').notNull().unique(),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  maintenanceTypeId: integer('maintenance_type_id').references(() => maintenanceTypes.id),
  scheduleId: integer('schedule_id').references(() => maintenanceSchedules.id),

  // Work order details
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'),
  priority: integer('priority').default(3),

  // Scheduling
  requestedDate: integer('requested_date', { mode: 'timestamp' }).notNull(),
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }),
  startedDate: integer('started_date', { mode: 'timestamp' }),
  completedDate: integer('completed_date', { mode: 'timestamp' }),
  dueDate: integer('due_date', { mode: 'timestamp' }),

  // Assignment and location
  assignedTo: text('assigned_to'),
  facility: text('facility'),

  // Vehicle readings
  odometerReading: integer('odometer_reading'),
  engineHours: integer('engine_hours'),

  // Work details
  workInstructions: text('work_instructions'),
  partsNeeded: text('parts_needed'),
  laborHours: real('labor_hours'),

  // Cost tracking
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  vendor: text('vendor'),
  vendorInvoice: text('vendor_invoice'),

  // Claims
  warrantyClaim: integer('warranty_claim', { mode: 'boolean' }).default(false),
  insuranceClaim: integer('insurance_claim', { mode: 'boolean' }).default(false),

  // Metrics
  downtimeHours: real('downtime_hours'),

  // Approval workflow
  approvalRequired: integer('approval_required', { mode: 'boolean' }).default(false),
  approvedBy: text('approved_by'),
  approvalDate: integer('approval_date', { mode: 'timestamp' }),

  // Completion
  completionNotes: text('completion_notes'),

  // Quality control
  qualityCheck: integer('quality_check', { mode: 'boolean' }).default(false),
  qualityCheckBy: text('quality_check_by'),
  qualityCheckDate: integer('quality_check_date', { mode: 'timestamp' }),
  qualityCheckNotes: text('quality_check_notes'),

  // Follow-up
  followUpRequired: integer('follow_up_required', { mode: 'boolean' }).default(false),
  followUpDate: integer('follow_up_date', { mode: 'timestamp' }),
  followUpNotes: text('follow_up_notes'),

  // Tracking
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`strftime('%s', 'now')`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`strftime('%s', 'now')`),
});

// Parts and materials used in maintenance
export const maintenanceParts = sqliteTable('maintenance_parts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderId: integer('work_order_id').notNull().references(() => maintenanceWorkOrders.id),
  partNumber: text('part_number'),
  partName: text('part_name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: real('unit_price'),
  totalPrice: real('total_price'),
  supplier: text('supplier'),
  warrantyMonths: integer('warranty_months'),
  warrantyKm: integer('warranty_km'),
  coreCharge: real('core_charge'),
  coreReturned: integer('core_returned', { mode: 'boolean' }).default(false),
  installationDate: integer('installation_date', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`strftime('%s', 'now')`),
});

// Labor tracking for maintenance work
export const maintenanceLabor = sqliteTable('maintenance_labor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderId: integer('work_order_id').notNull().references(() => maintenanceWorkOrders.id),
  technicianName: text('technician_name').notNull(),
  laborType: text('labor_type'),
  hoursWorked: real('hours_worked').notNull(),
  hourlyRate: real('hourly_rate'),
  totalCost: real('total_cost'),
  workPerformed: text('work_performed'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`strftime('%s', 'now')`),
});

// Maintenance history and reports
export const maintenanceHistory = sqliteTable('maintenance_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  workOrderId: integer('work_order_id').notNull().references(() => maintenanceWorkOrders.id),
  maintenanceTypeId: integer('maintenance_type_id').notNull().references(() => maintenanceTypes.id),

  // Maintenance event details
  maintenanceDate: integer('maintenance_date', { mode: 'timestamp' }).notNull(),
  odometerReading: integer('odometer_reading'),
  engineHours: integer('engine_hours'),

  // What was done
  workPerformed: text('work_performed').notNull(),
  partsReplaced: text('parts_replaced'), // JSON array of part names
  issues: text('issues'), // Issues found during maintenance
  recommendations: text('recommendations'), // Future maintenance recommendations

  // Performance impact
  fuelEfficiencyBefore: real('fuel_efficiency_before'),
  fuelEfficiencyAfter: real('fuel_efficiency_after'),
  performanceNotes: text('performance_notes'),

  // Cost summary
  totalCost: real('total_cost').notNull(),
  laborCost: real('labor_cost'),
  partsCost: real('parts_cost'),
  externalCost: real('external_cost'),
  currency: text('currency').notNull().default('USD'),

  // Duration
  duration: integer('duration'), // in minutes
  downtime: integer('downtime'), // vehicle unavailability in minutes

  // Quality and warranty
  qualityRating: integer('quality_rating'), // 1-5 scale
  warrantyPeriod: integer('warranty_period'), // in days
  warrantyExpiryDate: integer('warranty_expiry_date', { mode: 'timestamp' }),

  // Personnel
  performedBy: text('performed_by'),
  supervisedBy: text('supervised_by'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Maintenance alerts and notifications
export const maintenanceAlerts = sqliteTable('maintenance_alerts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  scheduleId: integer('schedule_id').references(() => maintenanceSchedules.id),

  // Alert details
  alertType: text('alert_type', { enum: ['due', 'overdue', 'upcoming', 'critical'] }).notNull(),
  alertTitle: text('alert_title').notNull(),
  alertMessage: text('alert_message').notNull(),
  priority: integer('priority').notNull().default(3),

  // Due information
  dueDate: integer('due_date', { mode: 'timestamp' }),
  dueKilometers: integer('due_kilometers'),
  dueHours: integer('due_hours'),
  daysPastDue: integer('days_past_due'),
  kilometersPastDue: integer('kilometers_past_due'),

  // Status
  acknowledged: integer('acknowledged', { mode: 'boolean' }).notNull().default(false),
  acknowledgedBy: integer('acknowledged_by'),
  acknowledgedAt: integer('acknowledged_at', { mode: 'timestamp' }),
  resolved: integer('resolved', { mode: 'boolean' }).notNull().default(false),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Vehicle inspection checklists
export const inspectionChecklists = sqliteTable('inspection_checklists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  checklistName: text('checklist_name').notNull(),
  checklistType: text('checklist_type', { enum: ['daily', 'weekly', 'monthly', 'pre_trip', 'post_trip'] }).notNull(),
  vehicleTypeId: integer('vehicle_type_id'),

  // Checklist items (JSON array)
  checklistItems: text('checklist_items').notNull(),

  // Settings
  required: integer('required', { mode: 'boolean' }).notNull().default(false),
  frequency: integer('frequency'), // days between required inspections
  active: integer('active', { mode: 'boolean' }).notNull().default(true),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Completed vehicle inspections
export const vehicleInspections = sqliteTable('vehicle_inspections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  inspectionNumber: text('inspection_number').notNull().unique(),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  checklistId: integer('checklist_id').notNull().references(() => inspectionChecklists.id),
  driverId: integer('driver_id').references(() => drivers.id),

  // Inspection details
  inspectionDate: integer('inspection_date', { mode: 'timestamp' }).notNull(),
  inspectionType: text('inspection_type').notNull(),
  odometerReading: integer('odometer_reading'),
  engineHours: integer('engine_hours'),
  fuelLevel: real('fuel_level'),

  // Results
  overallStatus: text('overall_status', { enum: ['pass', 'fail', 'conditional'] }).notNull(),
  checklistResults: text('checklist_results').notNull(), // JSON with item results

  // Issues and notes
  issuesFound: text('issues_found'),
  recommendations: text('recommendations'),
  nextInspectionDue: integer('next_inspection_due', { mode: 'timestamp' }),

  // Personnel
  inspectedBy: text('inspected_by').notNull(),
  supervisedBy: text('supervised_by'),

  // Follow-up
  followUpRequired: integer('follow_up_required', { mode: 'boolean' }).notNull().default(false),
  followUpNotes: text('follow_up_notes'),
  followUpCompleted: integer('follow_up_completed', { mode: 'boolean' }).notNull().default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export types
export type MaintenanceType = typeof maintenanceTypes.$inferSelect;
export type NewMaintenanceType = typeof maintenanceTypes.$inferInsert;
export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type NewMaintenanceSchedule = typeof maintenanceSchedules.$inferInsert;
export type MaintenanceWorkOrder = typeof maintenanceWorkOrders.$inferSelect;
export type NewMaintenanceWorkOrder = typeof maintenanceWorkOrders.$inferInsert;
export type MaintenancePart = typeof maintenanceParts.$inferSelect;
export type NewMaintenancePart = typeof maintenanceParts.$inferInsert;
export type MaintenanceLabor = typeof maintenanceLabor.$inferSelect;
export type NewMaintenanceLabor = typeof maintenanceLabor.$inferInsert;
export type MaintenanceHistory = typeof maintenanceHistory.$inferSelect;
export type NewMaintenanceHistory = typeof maintenanceHistory.$inferInsert;
export type MaintenanceAlert = typeof maintenanceAlerts.$inferSelect;
export type NewMaintenanceAlert = typeof maintenanceAlerts.$inferInsert;
export type InspectionChecklist = typeof inspectionChecklists.$inferSelect;
export type NewInspectionChecklist = typeof inspectionChecklists.$inferInsert;
export type VehicleInspection = typeof vehicleInspections.$inferSelect;
export type NewVehicleInspection = typeof vehicleInspections.$inferInsert;