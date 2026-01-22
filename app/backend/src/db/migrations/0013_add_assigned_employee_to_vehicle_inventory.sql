-- Add assigned employee field to vehicle inventory assignments
-- This allows tracking which employee is responsible for specific items (e.g., oxygen tubes, aspirators)

ALTER TABLE vehicle_inventory_assignments ADD COLUMN assigned_employee_id INTEGER REFERENCES drivers(id);
