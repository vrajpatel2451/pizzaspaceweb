/**
 * UK Phone Number Validation and Formatting
 *
 * Supports UK phone number formats:
 * - Mobile: 07xxx xxxxxx
 * - London: 020 xxxx xxxx
 * - Other: 01xxx xxxxxx, 02xxx xxxxxx, 03xxx xxxxxx
 * - International: +44 xxx xxxx xxxx
 */

/**
 * Validates a UK phone number
 *
 * Accepts formats:
 * - +44 7xxx xxxxxx (international mobile)
 * - +44 20 xxxx xxxx (international landline)
 * - 07xxx xxxxxx (mobile)
 * - 020 xxxx xxxx (London landline)
 * - 01xxx xxxxxx (other landlines)
 *
 * @param phone - The phone number to validate
 * @returns true if valid UK phone number
 */
export function isValidUKPhone(phone: string): boolean {
  // Remove all whitespace and formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // UK phone number patterns:
  // +44 followed by 9-10 digits (international format)
  // OR 0 followed by 9-10 digits (national format)
  const ukPhoneRegex = /^(?:\+44|0)(?:[1-3]\d{8,9}|7\d{9})$/;

  return ukPhoneRegex.test(cleaned);
}

/**
 * Formats a UK phone number in standard display format
 *
 * Converts to:
 * - Mobile: +44 7xxx xxxxxx
 * - London: +44 20 xxxx xxxx
 * - Other landline: +44 1xxx xxxxxx
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number or original if invalid
 */
export function formatUKPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle international format (+44)
  if (cleaned.startsWith('44')) {
    const nationalNumber = cleaned.substring(2);

    // Mobile number (07xxx xxxxxx -> +44 7xxx xxxxxx)
    if (nationalNumber.startsWith('7') && nationalNumber.length === 10) {
      return `+44 ${nationalNumber.substring(0, 4)} ${nationalNumber.substring(4, 7)} ${nationalNumber.substring(7)}`;
    }

    // London landline (020 xxxx xxxx -> +44 20 xxxx xxxx)
    if (nationalNumber.startsWith('20') && nationalNumber.length === 10) {
      return `+44 20 ${nationalNumber.substring(2, 6)} ${nationalNumber.substring(6)}`;
    }

    // Other landlines (01xxx or 02/03xxx)
    if (nationalNumber.length === 10) {
      return `+44 ${nationalNumber.substring(0, 4)} ${nationalNumber.substring(4, 7)} ${nationalNumber.substring(7)}`;
    }
  }

  // Handle national format (starts with 0)
  if (cleaned.startsWith('0')) {
    // Convert to international format
    const nationalNumber = cleaned.substring(1);

    // Mobile number (07xxx xxxxxx)
    if (nationalNumber.startsWith('7') && nationalNumber.length === 10) {
      return `+44 ${nationalNumber.substring(0, 4)} ${nationalNumber.substring(4, 7)} ${nationalNumber.substring(7)}`;
    }

    // London landline (020 xxxx xxxx)
    if (nationalNumber.startsWith('20') && nationalNumber.length === 10) {
      return `+44 20 ${nationalNumber.substring(2, 6)} ${nationalNumber.substring(6)}`;
    }

    // Other landlines
    if (nationalNumber.length === 10) {
      return `+44 ${nationalNumber.substring(0, 4)} ${nationalNumber.substring(4, 7)} ${nationalNumber.substring(7)}`;
    }
  }

  // Return original if no pattern matches
  return phone;
}

/**
 * Formats a UK phone number for display in national format
 *
 * Converts to:
 * - Mobile: 07xxx xxxxxx
 * - London: 020 xxxx xxxx
 * - Other: 01xxx xxxxxx
 *
 * @param phone - The phone number to format
 * @returns Formatted phone number in national format
 */
export function formatUKPhoneNational(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // Handle international format
  if (cleaned.startsWith('44')) {
    const nationalNumber = '0' + cleaned.substring(2);

    // Mobile
    if (nationalNumber.startsWith('07') && nationalNumber.length === 11) {
      return `${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5, 8)} ${nationalNumber.substring(8)}`;
    }

    // London landline
    if (nationalNumber.startsWith('020') && nationalNumber.length === 11) {
      return `020 ${nationalNumber.substring(3, 7)} ${nationalNumber.substring(7)}`;
    }

    // Other landlines
    if (nationalNumber.length === 11) {
      return `${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5, 8)} ${nationalNumber.substring(8)}`;
    }
  }

  // Handle national format
  if (cleaned.startsWith('0')) {
    // Mobile
    if (cleaned.startsWith('07') && cleaned.length === 11) {
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }

    // London landline
    if (cleaned.startsWith('020') && cleaned.length === 11) {
      return `020 ${cleaned.substring(3, 7)} ${cleaned.substring(7)}`;
    }

    // Other landlines
    if (cleaned.length === 11) {
      return `${cleaned.substring(0, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }
  }

  return phone;
}

/**
 * Extracts the phone number for use in tel: links
 *
 * @param phone - The phone number to convert
 * @returns Clean phone number for tel: links (e.g., +447xxx...)
 */
export function getPhoneTelLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // Convert to international format
  if (cleaned.startsWith('44')) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith('0')) {
    return `+44${cleaned.substring(1)}`;
  }

  return phone;
}
