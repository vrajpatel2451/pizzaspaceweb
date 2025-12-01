/**
 * Product Details Component TypeScript Interfaces
 *
 * This file contains all type definitions for the Product Details feature components.
 * These types extend the base product types from types/product.ts
 */

import type {
  ProductResponse,
  ProductDetailsResponse,
  VariantResponse,
  VariantGroupResponse,
  AddonResponse,
  AddonGroupResponse,
  VariantPricingResponse,
  ProductType
} from './product';

// ============================================================================
// CART TYPES
// ============================================================================

/**
 * Cart item structure for adding to cart
 */
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  selectedVariants: CartItemVariant[];
  selectedAddons: CartItemAddon[];
  specialInstructions?: string;
}

export interface CartItemVariant {
  groupId: string;
  groupLabel: string;
  variantId: string;
  variantLabel: string;
  price: number;
}

export interface CartItemAddon {
  addonId: string;
  addonLabel: string;
  groupId: string;
  groupLabel: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Selection state for variants (groupId -> variantId)
 */
export type VariantSelectionState = Record<string, string>;

/**
 * Selection state for addons (addonId -> quantity)
 * Quantity of 0 means not selected
 */
export type AddonSelectionState = Record<string, number>;

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'variant' | 'addon';
  groupId: string;
  groupLabel: string;
  message: string;
}

/**
 * Product Details Context value
 * Provides product data, selection state, and actions to all child components
 */
export interface ProductDetailsContextValue {
  // Product data (read-only)
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];

  // Selection state
  selectedVariants: VariantSelectionState;
  selectedAddons: AddonSelectionState;
  itemQuantity: number;

  // Actions
  selectVariant: (groupId: string, variantId: string) => void;
  selectAddon: (addonId: string, quantity: number) => void;
  setItemQuantity: (quantity: number) => void;
  resetSelections: () => void;

  // Computed values
  currentPrice: number; // Per item price
  totalPrice: number; // Total price (currentPrice * itemQuantity)
  validation: ValidationResult;

  // Helpers
  getVariantsByGroup: (groupId: string) => VariantResponse[];
  getAddonsByGroup: (groupId: string) => AddonResponse[];
  getVariantPrice: (variantId: string) => number;
  getAddonPrice: (addonId: string) => number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * ProductDetailsContainer - Entry point component
 */
export interface ProductDetailsContainerProps {
  productId: string;
  trigger?: React.ReactNode;
  mode?: 'lazy' | 'eager';
  onAddToCart?: (item: CartItem) => void | Promise<void>;
  className?: string;
  // Edit mode props
  editMode?: 'add' | 'edit';
  cartItem?: import('./cart').CartResponse;
  onEditSuccess?: () => void;
}

/**
 * ProductDetailsTrigger - Trigger element for modal
 */
export interface ProductDetailsTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
}

/**
 * ProductDetailsModal - Responsive modal wrapper
 */
export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  children: React.ReactNode;
}

/**
 * ProductDetailsContent - Shared content component
 */
export interface ProductDetailsContentProps {
  data: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
  onAddToCart?: (item: CartItem) => void | Promise<void>;
}

/**
 * ProductDetailsProvider - Context provider
 */
export interface ProductDetailsProviderProps {
  data: ProductDetailsResponse;
  children: React.ReactNode;
}

/**
 * ProductDetailsBody - Main content body
 */
export interface ProductDetailsBodyProps {
  onClose: () => void;
  onAddToCart?: (item: CartItem) => void | Promise<void>;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

/**
 * ProductImageSection - Product image carousel/gallery
 */
export interface ProductImageSectionProps {
  images: string[];
  productName: string;
  productType: ProductType;
  className?: string;
}

/**
 * ProductInfoSection - Product information display
 */
export interface ProductInfoSectionProps {
  product: ProductResponse;
  className?: string;
}

/**
 * VariantGroupsSection - All variant groups
 */
export interface VariantGroupsSectionProps {
  className?: string;
  /** Pass data directly to avoid context timing issues */
  variantGroupList?: VariantGroupResponse[];
  variantList?: VariantResponse[];
}

/**
 * AddonGroupsSection - All addon groups
 */
export interface AddonGroupsSectionProps {
  className?: string;
  /** Pass data directly to avoid context timing issues */
  addonGroupList?: AddonGroupResponse[];
  addonList?: AddonResponse[];
}

/**
 * AddToCartSection - Sticky footer with cart action
 */
export interface AddToCartSectionProps {
  onAddToCart: () => void;
  isLoading?: boolean;
  className?: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * VariantGroup - Single variant group with radio selection
 */
export interface VariantGroupProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

/**
 * VariantOption - Single variant radio option
 */
export interface VariantOptionProps {
  variant: VariantResponse;
  isSelected: boolean;
  price: number;
  onSelect: () => void;
  className?: string;
}

/**
 * AddonGroup - Single addon group with checkbox/quantity selection
 */
export interface AddonGroupProps {
  group: AddonGroupResponse;
  addons: AddonResponse[];
  selectedAddons: AddonSelectionState;
  onSelect: (addonId: string, quantity: number) => void;
  error?: string;
  className?: string;
}

/**
 * AddonOption - Single addon checkbox/quantity option
 */
export interface AddonOptionProps {
  addon: AddonResponse;
  quantity: number;
  price: number;
  allowMulti: boolean;
  maxQuantity: number;
  onSelect: (quantity: number) => void;
  className?: string;
}

/**
 * PriceCalculator - Real-time price display
 */
export interface PriceCalculatorProps {
  basePrice: number;
  selectedVariants: VariantSelectionState;
  selectedAddons: AddonSelectionState;
  pricing: VariantPricingResponse[];
  itemQuantity: number;
  showBreakdown?: boolean;
  className?: string;
}

/**
 * ProductBadge - Product type indicator (veg/non-veg/vegan)
 */
export interface ProductBadgeProps {
  type: ProductType;
  className?: string;
}

/**
 * SpiceLevelIndicator - Spice level display
 */
export interface SpiceLevelIndicatorProps {
  level: number; // 0, 1, or 2 (chilli count)
  className?: string;
}

/**
 * NutritionalInfo - Nutritional information display
 */
export interface NutritionalInfoProps {
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  weight?: number;
  className?: string;
}

/**
 * AllergyInfo - Allergy information display
 */
export interface AllergyInfoProps {
  allergens: string[];
  className?: string;
}

/**
 * IngredientList - Ingredient list display
 */
export interface IngredientListProps {
  ingredients: Array<{ name: string; count: number }>;
  className?: string;
}

/**
 * ServingInfo - Serving size and people count
 */
export interface ServingInfoProps {
  noOfPeople: number;
  dishSize?: {
    count: number;
    unit: string;
  };
  className?: string;
}

// ============================================================================
// LOADING & ERROR STATES
// ============================================================================

/**
 * ProductDetailsSkeleton - Loading skeleton
 */
export interface ProductDetailsSkeletonProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * ProductDetailsError - Error state display
 */
export interface ProductDetailsErrorProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * useProductDetails - Hook to fetch and cache product details
 */
export interface UseProductDetailsOptions {
  productId: string;
  enabled?: boolean;
  onSuccess?: (data: ProductDetailsResponse) => void;
  onError?: (error: Error) => void;
}

export interface UseProductDetailsResult {
  data: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * usePriceCalculation - Hook to calculate price based on selections
 */
export interface UsePriceCalculationOptions {
  basePrice: number;
  selectedVariants: VariantSelectionState;
  selectedAddons: AddonSelectionState;
  pricing: VariantPricingResponse[];
  itemQuantity: number;
}

export interface UsePriceCalculationResult {
  currentPrice: number;
  totalPrice: number;
  breakdown: PriceBreakdown;
}

export interface PriceBreakdown {
  base: number;
  variants: Array<{
    label: string;
    price: number;
  }>;
  addons: Array<{
    label: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  quantity: number;
  total: number;
}

/**
 * useSelectionValidation - Hook to validate selections
 */
export interface UseSelectionValidationOptions {
  variantGroups: VariantGroupResponse[];
  selectedVariants: VariantSelectionState;
  addonGroups: AddonGroupResponse[];
  selectedAddons: AddonSelectionState;
  addons: AddonResponse[];
}

export interface UseSelectionValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  getGroupError: (groupId: string) => string | undefined;
}

/**
 * useMediaQuery - Hook to detect viewport size
 */
export interface UseMediaQueryResult {
  matches: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Price calculation input
 */
export interface PriceCalculationInput {
  basePrice: number;
  variantPrices: number[];
  addonPrices: Array<{ price: number; quantity: number }>;
  itemQuantity: number;
}

/**
 * Price calculation output
 */
export interface PriceCalculationOutput {
  currentPrice: number;
  totalPrice: number;
}

/**
 * Grouped variants (by variant group)
 */
export interface GroupedVariants {
  [groupId: string]: VariantResponse[];
}

/**
 * Grouped addons (by addon group)
 */
export interface GroupedAddons {
  [groupId: string]: AddonResponse[];
}

/**
 * Sorted variant groups (primary first, then secondary)
 */
export interface SortedVariantGroups {
  primary: VariantGroupResponse[];
  secondary: VariantGroupResponse[];
}

/**
 * Cache entry for product details
 */
export interface ProductDetailsCache {
  [productId: string]: {
    data: ProductDetailsResponse;
    timestamp: number;
    expiresAt: number;
  };
}

/**
 * API request options
 */
export interface FetchProductDetailsOptions {
  productId: string;
  signal?: AbortSignal;
  cache?: boolean;
  cacheTime?: number; // milliseconds
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Variant selection handler
 */
export type VariantSelectionHandler = (
  groupId: string,
  variantId: string
) => void;

/**
 * Addon selection handler
 */
export type AddonSelectionHandler = (addonId: string, quantity: number) => void;

/**
 * Quantity change handler
 */
export type QuantityChangeHandler = (quantity: number) => void;

/**
 * Add to cart handler
 */
export type AddToCartHandler = (item: CartItem) => void | Promise<void>;

/**
 * Close modal handler
 */
export type CloseModalHandler = () => void;

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default values for selections
 */
export const PRODUCT_DETAILS_DEFAULTS = {
  ITEM_QUANTITY_MIN: 1,
  ITEM_QUANTITY_MAX: 99,
  ITEM_QUANTITY_DEFAULT: 1,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  DESKTOP_BREAKPOINT: 640, // px (sm breakpoint)
} as const;

/**
 * Error messages
 */
export const PRODUCT_DETAILS_ERRORS = {
  FETCH_FAILED: 'Failed to load product details',
  VARIANT_REQUIRED: 'Please select a',
  ADDON_MIN_NOT_MET: 'Please select at least',
  ADDON_MAX_EXCEEDED: 'Maximum',
  ADD_TO_CART_FAILED: 'Failed to add item to cart',
} as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for ProductDetailsResponse
 */
export function isProductDetailsResponse(
  data: unknown
): data is ProductDetailsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'product' in data &&
    'variantList' in data &&
    'variantGroupList' in data &&
    'addonList' in data &&
    'addonGroupList' in data &&
    'pricing' in data
  );
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(
  error: unknown
): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'groupId' in error &&
    'message' in error
  );
}

/**
 * Type guard for CartItem
 */
export function isCartItem(item: unknown): item is CartItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'productId' in item &&
    'quantity' in item &&
    'totalPrice' in item &&
    'selectedVariants' in item &&
    'selectedAddons' in item
  );
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Extract variant IDs from selection state
 */
export type VariantId = string;

/**
 * Extract addon IDs from selection state
 */
export type AddonId = string;

/**
 * Extract group IDs
 */
export type GroupId = string;

/**
 * Price value in smallest currency unit (pence)
 */
export type PriceInPence = number;

/**
 * Quantity value
 */
export type Quantity = number;

/**
 * Component display mode
 */
export type DisplayMode = 'desktop' | 'mobile';

/**
 * Data fetching mode
 */
export type FetchMode = 'lazy' | 'eager';

/**
 * Selection mode for addons
 */
export type AddonSelectionMode = 'single' | 'multiple';

/**
 * Price display format
 */
export type PriceDisplayFormat = 'total' | 'breakdown';
