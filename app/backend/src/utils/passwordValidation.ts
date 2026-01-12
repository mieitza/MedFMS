/**
 * Password validation utility
 * Rules: 8+ characters, mixed case (upper + lower), at least one number
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a string could be a legacy PIN (4-8 chars, typically numeric)
 * Used during migration to detect if user is logging in with old PIN
 */
export function isLegacyPin(value: string): boolean {
  return value.length >= 4 && value.length <= 8;
}
