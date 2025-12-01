/**
 * Product Details Feature Constants
 *
 * Centralized constants to avoid magic numbers and ensure consistency.
 */

/**
 * Quantity constraints
 */
export const QUANTITY = {
  MIN: 1,
  MAX: 99,
  DEFAULT: 1,
} as const;

/**
 * Touch target sizes (iOS HIG and Material Design guidelines)
 */
export const TOUCH_TARGETS = {
  MIN_HEIGHT: 44, // iOS minimum recommended touch target
  BUTTON_HEIGHT: 48, // Material Design recommended button height
  CARD_HEIGHT: 52, // Custom card minimum height
  CARD_HEIGHT_DESKTOP: 56, // Custom card minimum height on desktop
} as const;

/**
 * Breakpoints (must match Tailwind config)
 */
export const BREAKPOINTS = {
  SM: 640, // Small screens (tablets)
  MD: 768, // Medium screens
  LG: 1024, // Large screens
  XL: 1280, // Extra large screens
} as const;

/**
 * Cache configuration
 */
export const CACHE = {
  TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_AGE: 10 * 60 * 1000, // 10 minutes max age
} as const;

/**
 * Animation durations (in seconds)
 */
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  SLOWER: 0.8,
} as const;

/**
 * Modal dimensions
 */
export const MODAL = {
  MAX_WIDTH_SM: "95vw",
  MAX_WIDTH_MD: "lg",
  MAX_WIDTH_LG: "xl",
  MAX_WIDTH_XL: "2xl",
  MAX_HEIGHT: "90vh",
  MAX_HEIGHT_DESKTOP: "85vh",
} as const;

/**
 * Spacing values (px)
 */
export const SPACING = {
  SECTION_GAP: 24, // Gap between sections
  SECTION_GAP_MOBILE: 16, // Gap between sections on mobile
  CARD_GAP: 12, // Gap between cards
  CARD_GAP_MOBILE: 8, // Gap between cards on mobile
} as const;

/**
 * API configuration
 */
export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Validation messages
 */
export const VALIDATION_MESSAGES = {
  VARIANT_REQUIRED: "Please select a",
  ADDON_MIN_NOT_MET: "Please select at least",
  ADDON_MAX_EXCEEDED: "Maximum",
  QUANTITY_MIN: "Quantity must be at least 1",
  QUANTITY_MAX: "Quantity cannot exceed 99",
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load product details",
  ADD_TO_CART_FAILED: "Failed to add item to cart",
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT: "Request timed out. Please try again.",
  UNKNOWN: "An unexpected error occurred",
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_ANIMATIONS: true,
  ENABLE_CACHE: true,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  MODAL: 50,
  MODAL_OVERLAY: 40,
  STICKY_FOOTER: 10,
  BADGE: 5,
} as const;
