-- Add Rovinieta, Asigurare (Insurance), and ITP (Periodic Technical Inspection) expiry date fields to vehicles table
-- These fields track important document expirations that require alerts

ALTER TABLE vehicles ADD COLUMN rovinieta_expiry_date INTEGER;
ALTER TABLE vehicles ADD COLUMN asigurare_expiry_date INTEGER;
ALTER TABLE vehicles ADD COLUMN itp_expiry_date INTEGER;
