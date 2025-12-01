/**
 * Format utility functions for displaying data
 */

/**
 * Format a number as currency (assumes pence/cents, converts to pounds/dollars)
 * @param amount - Amount in pence/cents
 * @param currency - Currency symbol (default: '£')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = '£'
): string {
  const value = amount / 100;
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Format a number with thousands separator
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('en-GB', defaultOptions).format(dateObj);
}

/**
 * Format a date to a short string (e.g., "12 Jan 2024")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateShort(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a time to a readable string
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a phone number to a readable format
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as UK phone number if it matches expected pattern
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phone;
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default: '...')
 * @returns Truncated text
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Pluralize a word based on count
 * @param count - Count to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Format a percentage
 * @param value - Value to format (0-1 or 0-100)
 * @param asDecimal - Whether the value is a decimal (0-1) or percentage (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  asDecimal: boolean = true,
  decimals: number = 0
): string {
  const percentage = asDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}
