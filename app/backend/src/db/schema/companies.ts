import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Companies table for multi-tenancy support
export const companies = sqliteTable('companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyCode: text('company_code').notNull().unique(),
  companyName: text('company_name').notNull(),
  legalName: text('legal_name'),
  taxId: text('tax_id'), // CUI/CIF
  registrationNumber: text('registration_number'), // J number
  address: text('address'),
  city: text('city'),
  county: text('county'),
  postalCode: text('postal_code'),
  country: text('country').default('Romania'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  website: text('website'),
  logo: text('logo'), // URL or base64
  // Settings stored as JSON for flexibility
  settings: text('settings', { mode: 'json' }).$type<CompanySettings>(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Type for company-specific settings
export interface CompanySettings {
  currency?: string;
  dateFormat?: string;
  timezone?: string;
  language?: string;
  // Feature flags
  enableFuelManagement?: boolean;
  enableMaterialsManagement?: boolean;
  enableMaintenanceManagement?: boolean;
  enableTireManagement?: boolean;
  // Limits
  maxUsers?: number;
  maxVehicles?: number;
}

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
