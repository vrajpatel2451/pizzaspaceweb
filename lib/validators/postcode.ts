/**
 * UK Postcode Validation and Formatting
 *
 * Supports all valid UK postcode formats:
 * - A9 9AA (e.g., M1 1AA)
 * - A99 9AA (e.g., M60 1NW)
 * - A9A 9AA (e.g., M1A 1AA)
 * - AA9 9AA (e.g., CR2 6XH)
 * - AA99 9AA (e.g., DN55 1PT)
 * - AA9A 9AA (e.g., EC1A 1BB)
 *
 * Where:
 * - A = Letter
 * - 9 = Number
 */

/**
 * Validates a UK postcode
 *
 * Accepts all valid UK postcode formats with or without space
 *
 * @param postcode - The postcode to validate
 * @returns true if valid UK postcode
 */
export function isValidUKPostcode(postcode: string): boolean {
  // Remove all whitespace and convert to uppercase
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();

  // UK postcode regex pattern
  // Validates against all 6 UK postcode formats
  const postcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i;

  // Additional validation: must be 5-7 characters (without space)
  if (cleaned.length < 5 || cleaned.length > 7) {
    return false;
  }

  return postcodeRegex.test(postcode.trim());
}

/**
 * Formats a UK postcode with proper spacing
 *
 * Converts to: XX## #XX format
 * Examples:
 * - SW1A1AA -> SW1A 1AA
 * - m11aa -> M1 1AA
 * - CR26XH -> CR2 6XH
 *
 * @param postcode - The postcode to format
 * @returns Formatted postcode or original if invalid
 */
export function formatUKPostcode(postcode: string): string {
  // Remove all whitespace and convert to uppercase
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();

  // Validate length
  if (cleaned.length < 5 || cleaned.length > 7) {
    return postcode;
  }

  // Split into outward and inward codes
  // The inward code is always 3 characters (1 digit + 2 letters)
  if (cleaned.length >= 5) {
    const outward = cleaned.slice(0, -3);
    const inward = cleaned.slice(-3);

    // Validate inward code format (1 digit + 2 letters)
    const inwardRegex = /^\d[A-Z]{2}$/;
    if (!inwardRegex.test(inward)) {
      return postcode;
    }

    return `${outward} ${inward}`;
  }

  return postcode;
}

/**
 * Extracts the outward code (area) from a UK postcode
 *
 * Examples:
 * - SW1A 1AA -> SW1A
 * - M1 1AA -> M1
 * - CR2 6XH -> CR2
 *
 * @param postcode - The postcode to extract from
 * @returns Outward code (area) or empty string if invalid
 */
export function getPostcodeArea(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();

  if (cleaned.length >= 5) {
    return cleaned.slice(0, -3);
  }

  return '';
}

/**
 * Extracts the district from a UK postcode
 *
 * Examples:
 * - SW1A 1AA -> SW
 * - M1 1AA -> M
 * - CR2 6XH -> CR
 *
 * @param postcode - The postcode to extract from
 * @returns District code or empty string if invalid
 */
export function getPostcodeDistrict(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();

  // Extract the letter(s) at the beginning
  const match = cleaned.match(/^[A-Z]{1,2}/);
  return match ? match[0] : '';
}

/**
 * Validates and formats a UK postcode
 *
 * Convenience function that validates and formats in one step
 *
 * @param postcode - The postcode to validate and format
 * @returns Formatted postcode if valid, null if invalid
 */
export function validateAndFormatPostcode(postcode: string): string | null {
  if (!isValidUKPostcode(postcode)) {
    return null;
  }

  return formatUKPostcode(postcode);
}

/**
 * Common UK postcode examples for testing/documentation
 */
export const POSTCODE_EXAMPLES = {
  LONDON_WEST_END: 'SW1A 1AA', // Buckingham Palace
  LONDON_CITY: 'EC1A 1BB', // Bank of England area
  MANCHESTER: 'M1 1AA',
  BIRMINGHAM: 'B1 1AA',
  GLASGOW: 'G1 1AA',
  EDINBURGH: 'EH1 1AA',
  CARDIFF: 'CF10 1AA',
  BELFAST: 'BT1 1AA',
} as const;
