import { TOTP, generateSecret, generateURI, verifySync } from 'otplib';
import crypto from 'crypto';

/**
 * Generates a new TOTP secret.
 */
export function generateTOTPSecret(): string {
  // generateSecret default is usually 20 bytes (160 bits).
  // Some apps prefer base32, otplib generates base32 by default.
  return generateSecret();
}

/**
 * Generates a valid otpauth:// URL for QR code generation.
 */
export function generateTOTPAuthUrl(userEmail: string, secret: string): string {
  return generateURI({
    secret,
    label: userEmail,
    issuer: 'AMK Portfolio',
  });
}

/**
 * Verifies a TOTP token against a secret.
 */
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return verifySync({ token, secret }).valid;
  } catch (err) {
    return false;
  }
}

/**
 * Generates an array of single-use recovery codes.
 * E.g., 10 codes, each 10 characters long.
 */
export function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(5).toString('hex').toUpperCase(); // 10 chars
    codes.push(code);
  }
  return codes;
}

/**
 * Hashes a recovery code for secure DB storage.
 * Uses SHA-256 for fast hashing of recovery codes, as they are high-entropy and single-use.
 */
export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}
