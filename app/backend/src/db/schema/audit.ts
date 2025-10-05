import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id'),
  username: text('username'),
  action: text('action').notNull(), // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
  resource: text('resource').notNull(), // users, vehicles, fuel, etc.
  resourceId: text('resource_id'), // ID of the affected resource
  details: text('details'), // JSON string with additional details
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
