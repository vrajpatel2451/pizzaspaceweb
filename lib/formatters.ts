/**
 * Format a number as UK price (GBP)
 */
export function formatPrice(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 2 } = options ?? {};
  const formatted = new Intl.NumberFormat("en-GB", {
    style: showSymbol ? "currency" : "decimal",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return formatted;
}

/**
 * Format a date in UK format (DD/MM/YYYY or custom)
 */
export function formatDate(
  date: Date | string | number,
  options?: {
    format?: "short" | "medium" | "long" | "relative";
    includeTime?: boolean;
  }
): string {
  const { format = "short", includeTime = false } = options ?? {};
  const dateObj = date instanceof Date ? date : new Date(date);

  if (format === "relative") {
    return formatRelativeTime(dateObj);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: format === "short" ? "2-digit" : format === "medium" ? "short" : "long",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return new Intl.DateTimeFormat("en-GB", formatOptions).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(date, { format: "short" });
}

/**
 * Format time only (HH:MM in 24-hour format)
 */
export function formatTime(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format for UK
  }).format(dateObj);
}
