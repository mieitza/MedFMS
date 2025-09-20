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
  maintenanceTypeId: integer('maintenance_type_id').notNull().references(() => maintenanceTypes.id),
  maintenanceScheduleId: integer('maintenance_schedule_id').references(() => maintenanceSchedules.id),

  // Work order details
  title: text('title').notNull(),
  description: text('description'),
  priority: integer('priority').notNull().default(3), // 1=urgent, 2=high, 3=normal, 4=low, 5=optional
  status: text('status', { enum: ['pending', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold'] }).notNull().default('pending'),

  // Scheduling
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }),
  startDate: integer('start_date', { mode: 'timestamp' }),
  completionDate: integer('completion_date', { mode: 'timestamp' }),
  estimatedDuration: integer('estimated_duration'), // in minutes
  actualDuration: integer('actual_duration'), // in minutes

  // Assignment
  assignedTechnicianId: integer('assigned_technician_id'),
  supplierId: integer('supplier_id').references(() => suppliers.id),

  // Vehicle readings
  odometerReadingStart: integer('odometer_reading_start'),
  odometerReadingEnd: integer('odometer_reading_end'),
  engineHoursStart: integer('engine_hours_start'),
  engineHoursEnd: integer('engine_hours_end'),

  // Cost tracking
  estimatedCost: real('estimated_cost'),
  laborCost: real('labor_cost'),
  partsCost: real('parts_cost'),
  externalCost: real('external_cost'),
  totalCost: real('total_cost'),
  currency: text('currency').notNull().default('USD'),

  // Quality control
  qualityCheckPassed: integer('quality_check_passed', { mode: 'boolean' }),
  qualityCheckNotes: text('quality_check_notes'),
  warrantyPeriod: integer('warranty_period'), // in days
  warrantyExpiryDate: integer('warranty_expiry_date', { mode: 'timestamp' }),

  // Additional info
  notes: text('notes'),
  internalNotes: text('internal_notes'),

  // Approval workflow
  requestedBy: integer('requested_by').notNull(),
  approvedBy: integer('approved_by'),
  approvedAt: integer('approved_at', { mode: 'timestamp' }),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Parts and materials used in maintenance
export const maintenanceParts = sqliteTable('maintenance_parts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderId: integer('work_order_id').notNull().references(() => maintenanceWorkOrders.id),
  partNumber: text('part_number').notNull(),
  partName: text('part_name').notNull(),
  partCategory: text('part_category'),

  // Quantity and cost
  quantityUsed: real('quantity_used').notNull(),
  unitOfMeasure: text('unit_of_measure').notNull().default('each'),
  unitCost: real('unit_cost').notNull(),
  totalCost: real('total_cost').notNull(),
  currency: text('currency').notNull().default('USD'),

  // Supplier info
  supplierId: integer('supplier_id').references(() => suppliers.id),
  supplierPartNumber: text('supplier_part_number'),

  // Part details
  manufacturer: text('manufacturer'),
  warrantyPeriod: integer('warranty_period'), // in days
  batchNumber: text('batch_number'),
  serialNumber: text('serial_number'),

  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Labor tracking for maintenance work
export const maintenanceLabor = sqliteTable('maintenance_labor', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workOrderId: integer('work_order_id').notNull().references(() => maintenanceWorkOrders.id),
  technicianId: integer('technician_id'),
  technicianName: text('technician_name').notNull(),

  // Time tracking
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  breakDuration: integer('break_duration').notNull().default(0), // in minutes
  totalHours: real('total_hours'),

  // Cost
  hourlyRate: real('hourly_rate').notNull(),
  totalCost: real('total_cost'),
  currency: text('currency').notNull().default('USD'),

  // Work description
  workDescription: text('work_description'),
  notes: text('notes'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
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
  maintenanceScheduleId: integer('maintenance_schedule_id').references(() => maintenanceSchedules.id),

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