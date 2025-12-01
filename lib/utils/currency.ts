/**
 * Currency Formatting Utilities
 *
 * Centralized currency formatting to ensure consistency across the application.
 * All prices are stored in pounds (e.g., 10.00 for £10.00) and formatted for display.
 */

export interface FormatPriceOptions {
  currency?: string;
  locale?: string;
  showCurrency?: boolean;
  showSign?: boolean;
}

/**
 * Format price from pounds to currency string
 *
 * @param amount - Price in pounds (e.g., 12.50 for £12.50)
 * @param options - Formatting options
 * @returns Formatted price string
 *
 * @example
 * formatPrice(12.50) // "£12.50"
 * formatPrice(12.50, { showCurrency: false }) // "12.50"
 * formatPrice(12.50, { showSign: true }) // "+£12.50"
 */
export function formatPrice(
  amount: number,
  options?: FormatPriceOptions
): string {
  const {
    currency = "GBP",
    locale = "en-GB",
    showCurrency = true,
    showSign = false,
  } = options || {};

  // Amount is already in pounds, no conversion needed

  let formattedPrice: string;

  if (showCurrency) {
    formattedPrice = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } else {
    formattedPrice = amount.toFixed(2);
  }

  if (showSign && amount > 0) {
    return `+${formattedPrice}`;
  }

  return formattedPrice;
}

/**
 * Parse currency string to pounds
 *
 * @param priceString - Price string (e.g., "£12.50" or "12.50")
 * @returns Price in pounds
 *
 * @example
 * parsePrice("£12.50") // 12.50
 * parsePrice("12.50") // 12.50
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and parse
  const cleanedString = priceString.replace(/[£$€,\s]/g, "");
  const amount = parseFloat(cleanedString);

  if (isNaN(amount)) {
    return 0;
  }

  return amount;
}

/**
 * Format price range
 *
 * @param minPrice - Minimum price in pounds
 * @param maxPrice - Maximum price in pounds
 * @param options - Formatting options
 * @returns Formatted price range string
 *
 * @example
 * formatPriceRange(10, 20) // "£10.00 - £20.00"
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  options?: FormatPriceOptions
): string {
  const minFormatted = formatPrice(minPrice, options);
  const maxFormatted = formatPrice(maxPrice, options);

  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Calculate percentage discount
 *
 * @param originalPrice - Original price in pounds
 * @param discountedPrice - Discounted price in pounds
 * @returns Percentage discount (0-100)
 *
 * @example
 * calculateDiscount(20, 15) // 25
 */
export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Format discount percentage
 *
 * @param originalPrice - Original price in pounds
 * @param discountedPrice - Discounted price in pounds
 * @returns Formatted discount string
 *
 * @example
 * formatDiscount(20, 15) // "25% off"
 */
export function formatDiscount(
  originalPrice: number,
  discountedPrice: number
): string {
  const discount = calculateDiscount(originalPrice, discountedPrice);
  return `${discount}% off`;
}
