-- Migration: Add ANMDM document path field to vehicles table
-- This field stores the path to the uploaded ANMDM authorization PDF document

ALTER TABLE vehicles ADD COLUMN anmdm_document_path TEXT;
