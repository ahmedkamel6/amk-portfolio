import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcryptjs.
 * This abstraction allows easy migration to Argon2 in the future.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Validates password complexity.
 * Minimum 12 characters, Uppercase, Lowercase, Number, Special Character.
 */
export function validatePasswordComplexity(password: string): boolean {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
}
