/**
 * Device ID Utility
 *
 * Generates and validates unique device identifiers using UUID v4.
 * Used for tracking anonymous cart sessions across browser sessions.
 */

/**
 * Generates a unique device ID using crypto.randomUUID with fallback
 * @returns A UUID v4 string
 */
export function generateDeviceId(): string {
  // Try to use native crypto.randomUUID (available in modern browsers and Node.js 16+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  // Generate UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validates if a string is a valid UUID v4
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  if (typeof uuid !== 'string') {
    return false;
  }

  // UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
