-- Migration: Add ANMDM Authorization (aviz) fields to vehicles table
-- ANMDM = Autoritatea Națională pentru Administrare și Reglementare în Transporturi
-- These fields track vehicle authorization/permits for transportation

ALTER TABLE vehicles ADD COLUMN anmdm_auth_number TEXT;
ALTER TABLE vehicles ADD COLUMN anmdm_auth_type TEXT;
ALTER TABLE vehicles ADD COLUMN anmdm_issue_date INTEGER;
ALTER TABLE vehicles ADD COLUMN anmdm_expiry_date INTEGER;
ALTER TABLE vehicles ADD COLUMN anmdm_issuing_authority TEXT;
ALTER TABLE vehicles ADD COLUMN anmdm_notes TEXT;
