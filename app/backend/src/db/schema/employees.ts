import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeCode: text('employee_code').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  fullName: text('full_name').notNull(),
  idNumber: text('id_number').unique(),
  licenseNumber: text('license_number').notNull().unique(),
  licenseType: text('license_type').notNull(),
  licenseExpiryDate: integer('license_expiry_date', { mode: 'timestamp' }),
  phoneNumber: text('phone_number'),
  mobileNumber: text('mobile_number'),
  email: text('email'),
  address: text('address'),
  cityId: integer('city_id'),
  dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }),
  hireDate: integer('hire_date', { mode: 'timestamp' }),
  terminationDate: integer('termination_date', { mode: 'timestamp' }),
  departmentId: integer('department_id'),
  positionId: integer('position_id'),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
