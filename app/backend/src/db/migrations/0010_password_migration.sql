-- Migration: Convert PIN-based authentication to password-based
-- This migration adds password field and mustResetPassword flag for forced password reset

-- Add password column (nullable initially for migration)
ALTER TABLE users ADD COLUMN password TEXT;

-- Add mustResetPassword flag - all existing users must reset their password
ALTER TABLE users ADD COLUMN must_reset_password INTEGER DEFAULT 1 NOT NULL;

-- Copy existing PIN hash to password field (users will need to reset anyway)
-- This allows existing users to log in with their PIN initially
UPDATE users SET password = pin WHERE pin IS NOT NULL;

-- Note: The 'pin' column is kept for backward compatibility during migration period
-- It can be dropped in a future migration after all users have reset their passwords
