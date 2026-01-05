/**
 * Product Combo Type Definitions
 *
 * Type definitions for the Product Combo feature that handles combo products
 * (e.g., "2 X 9 Inch Pizzas" deals). Combo products have combo groups instead
 * of variants/addons, where each group contains selectable products that can
 * be customized with their own variants and addons.
 *
 * Architecture:
 * - ComboGroupSelectionState: Tracks all user selections organized by groupId
 * - ComboItemSelection: Represents a single product selection within a combo group
 * - Multi-selection support: Based on maxSelection per group (not checkboxes)
 * - Nested customization: Each combo item can be individually customized
 * - Selection ordering: Items are numbered in order of selection (1, 2, 3...)
 * - Pricing: Addons contribute to combo item price; base products are included
 */

import type {
  ProductDetailsResponse,
  ComboGroupResponse,
  ComboGroupProductResponse,
} from './product';
import type { PricingIdsAndQuantity } from './cart';

// ============================================================================
// SELECTION STATE TYPES
// ============================================================================

/**
 * Single product selection within a combo group
 *
 * Represents one selected product in a combo group, including its customization.
 * Multiple selections in the same group form an ordered array.
 *
 * @example
 * {
 *   productId: "prod_123",
 *   comboGroupProductId: "cgp_456",
 *   variantId: "var_9inch",
 *   pricing: [
 *     { id: "addon_cheese", quantity: 1, price: 200 },
 *     { id: "addon_pepperoni", quantity: 2, price: 300 }
 *   ],
 *   customized: true
 * }
 */
export interface ComboItemSelection {
  /** Reference to the selected product */
  productId: string;

  /** Reference to ComboGroupProduct._id linking this product to the combo group */
  comboGroupProductId: string;

  /**
   * Variant ID from defaultVariantId (e.g., "9 inch")
   * Used for addon pricing lookup in the variant pricing table
   */
  variantId: string;

  /**
   * Addon selections for this specific combo item
   * Only addons contribute to price; base product is included in combo
   */
  pricing: PricingIdsAndQuantity[];

  /**
   * Whether user has opened the customization dialog for this item
   * Used to show "Customized" badge in the UI
   */
  customized: boolean;
}

/**
 * All combo selections organized by combo group ID
 *
 * Maps each combo group to an array of selected products. The array order
 * represents the selection sequence (used for UI numbering).
 *
 * @example
 * {
 *   "group_pizza_1": [
 *     { productId: "margherita", comboGroupProductId: "cgp_1", ... },
 *     { productId: "pepperoni", comboGroupProductId: "cgp_2", ... }
 *   ],
 *   "group_sides_1": [
 *     { productId: "garlic_bread", comboGroupProductId: "cgp_3", ... }
 *   ]
 * }
 */
export interface ComboGroupSelectionState {
  /**
   * Key: ComboGroup.groupId
   * Value: Array of selections (ordered by selection time)
   */
  [groupId: string]: ComboItemSelection[];
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * ComboGroupsSection - Container for all combo groups
 *
 * Main section component that renders all combo groups for a combo product.
 * Displayed instead of VariantGroupsSection/AddonGroupsSection when isCombo=true.
 */
export interface ComboGroupsSectionProps {
  /** Optional CSS class for styling */
  className?: string;
}

/**
 * ComboGroupCard - Single combo group container
 *
 * Displays one combo group with its title, description, selection requirements,
 * and all available products. Handles validation display for min/max selections.
 *
 * @example
 * <ComboGroupCard
 *   group={{ label: "Choose Your Pizzas", minSelection: 2, maxSelection: 2 }}
 *   products={[{ productId: "margherita", ... }, { productId: "pepperoni", ... }]}
 * />
 */
export interface ComboGroupCardProps {
  /** Combo group metadata (label, min/max, allowCustomization) */
  group: ComboGroupResponse;

  /** List of selectable products for this group */
  products: ComboGroupProductResponse[];

  /** Optional CSS class for styling */
  className?: string;
}

/**
 * ComboProductItem - Single selectable product in a combo group
 *
 * Displays a product with selection state and customization options.
 * Selection UI shows: [Product Name]...[Selected X][Customize]
 * where X is the 1-based selection order number.
 *
 * Selection behavior:
 * - If under maxSelection: Toggle adds/removes product
 * - If at maxSelection: Cannot add more (button disabled)
 * - Selection numbers are based on array order (first selected = 1)
 *
 * @example
 * <ComboProductItem
 *   product={{ name: "Margherita Pizza", photoList: [...] }}
 *   groupId="group_pizza_1"
 *   selectionIndex={1}  // Shows "Selected 1"
 *   totalSelected={2}
 *   maxSelection={2}
 *   allowCustomization={true}
 *   onToggle={() => {}}
 *   onCustomize={() => {}}
 * />
 */
export interface ComboProductItemProps {
  /** Product data from ComboGroupProductResponse */
  product: ComboGroupProductResponse;

  /** Parent combo group ID (for state lookup) */
  groupId: string;

  /**
   * Selection order number (1-based) if selected, null if not selected
   * Used to display "Selected X" badge
   */
  selectionIndex: number | null;

  /** Total number of products selected in this group */
  totalSelected: number;

  /** Maximum number of products allowed in this group */
  maxSelection: number;

  /** Whether this group allows product customization */
  allowCustomization: boolean;

  /** Handler to add/remove this product from selections */
  onToggle: () => void;

  /** Handler to open customization dialog for this product */
  onCustomize: () => void;

  /** Optional CSS class for styling */
  className?: string;
}

/**
 * ComboCustomizationDialog - Modal for customizing a selected combo product
 *
 * Opens a full product details view for a specific combo item selection,
 * allowing users to customize variants and addons. Pricing from this
 * customization is saved back to the ComboItemSelection.pricing array.
 *
 * Dialog flow:
 * 1. User clicks "Customize" on a selected combo product
 * 2. Dialog fetches full product details (variants, addons, pricing)
 * 3. User customizes using standard product details UI
 * 4. On save, pricing selections are stored in ComboItemSelection
 * 5. Dialog closes and shows "Customized" badge on the product
 *
 * @example
 * <ComboCustomizationDialog
 *   isOpen={true}
 *   onClose={() => {}}
 *   groupId="group_pizza_1"
 *   selectionIndex={0}  // 0-based array index
 * />
 */
export interface ComboCustomizationDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;

  /** Handler to close the dialog */
  onClose: () => void;

  /** Combo group ID containing the selection to customize */
  groupId: string;

  /**
   * Array index of the selection to customize (0-based)
   * Used to lookup and update the correct ComboItemSelection
   */
  selectionIndex: number;

  /** Optional CSS class for styling */
  className?: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation result for a single combo group
 *
 * Checks if the group meets min/max selection requirements.
 *
 * @example
 * {
 *   isValid: false,
 *   error: "Please select at least 2 items",
 *   selectedCount: 1,
 *   minRequired: 2,
 *   maxAllowed: 2
 * }
 */
export interface ComboValidationResult {
  /** Whether the group meets selection requirements */
  isValid: boolean;

  /** Error message if validation fails, undefined if valid */
  error?: string;

  /** Current number of selected products in this group */
  selectedCount: number;

  /** Minimum required selections (from ComboGroup.minSelection) */
  minRequired: number;

  /** Maximum allowed selections (from ComboGroup.maxSelection) */
  maxAllowed: number;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Context state extension for combo products
 *
 * Extends ProductDetailsContextValue with combo-specific state.
 * This state is only used when product.isCombo === true.
 */
export interface ComboContextState {
  /** All combo selections organized by group ID */
  comboSelections: ComboGroupSelectionState;

  /**
   * Currently active customization dialog's group ID
   * Null when no dialog is open
   */
  activeCustomizationGroup: string | null;

  /**
   * Currently active customization dialog's selection index
   * Null when no dialog is open. This is the 0-based array index.
   */
  activeCustomizationIndex: number | null;

  /**
   * Full product details for the item being customized
   * Null when no customization dialog is open
   * Fetched on-demand when user clicks "Customize"
   */
  customizationProductData: ProductDetailsResponse | null;
}

/**
 * Context actions extension for combo products
 *
 * Extends ProductDetailsContextValue with combo-specific actions.
 */
export interface ComboContextActions {
  /**
   * Toggle selection of a combo product
   *
   * If not selected: Adds to selections array (if under maxSelection)
   * If selected: Removes from selections array
   *
   * @param groupId - Combo group ID
   * @param productId - Product to toggle
   * @param comboGroupProductId - ComboGroupProduct._id reference
   * @param defaultVariantId - Default variant ID for addon pricing lookup
   */
  toggleComboProduct: (
    groupId: string,
    productId: string,
    comboGroupProductId: string,
    defaultVariantId?: string
  ) => void;

  /**
   * Open customization dialog for a selected combo product
   *
   * Fetches full product details and opens the customization dialog.
   * Sets activeCustomizationGroup and activeCustomizationIndex.
   *
   * @param groupId - Combo group ID
   * @param selectionIndex - Array index of selection to customize (0-based)
   * @returns Promise that resolves when product data is loaded
   */
  openComboCustomization: (
    groupId: string,
    selectionIndex: number
  ) => Promise<void>;

  /**
   * Close customization dialog
   *
   * Clears activeCustomizationGroup, activeCustomizationIndex, and
   * customizationProductData.
   */
  closeComboCustomization: () => void;

  /**
   * Update addon pricing for a specific combo item
   *
   * Called when user completes customization dialog. Updates the
   * pricing array and sets customized flag to true.
   *
   * @param groupId - Combo group ID
   * @param selectionIndex - Array index of selection (0-based)
   * @param pricing - Updated addon selections with quantities and prices
   */
  updateComboItemPricing: (
    groupId: string,
    selectionIndex: number,
    pricing: PricingIdsAndQuantity[]
  ) => void;

  /**
   * Remove a specific combo selection
   *
   * Removes item from selections array. Selection order is maintained
   * by array index, so removal shifts subsequent items down.
   *
   * @param groupId - Combo group ID
   * @param selectionIndex - Array index of selection to remove (0-based)
   */
  removeComboSelection: (groupId: string, selectionIndex: number) => void;

  /**
   * Get validation result for a specific combo group
   *
   * Checks if the group meets min/max selection requirements.
   *
   * @param groupId - Combo group ID to validate
   * @returns Validation result with error message if invalid
   */
  getComboGroupValidation: (groupId: string) => ComboValidationResult;

  /**
   * Whether all combo groups pass validation
   *
   * Computed from all group validations. Must be true to add to cart.
   */
  isComboValid: boolean;

  /**
   * Total price for all combo addon customizations
   *
   * Sum of all addon prices across all combo item selections.
   * Does not include base combo price (handled separately).
   */
  comboTotalPrice: number;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Flattened combo selection for API submission
 *
 * Transforms ComboGroupSelectionState into the format expected by
 * the cart API (matches cart.ts ComboSelection type).
 */
export interface FlatComboSelection {
  /** Combo group ID */
  groupId: string;

  /** Selected product ID */
  productId: string;

  /** Addon selections with quantities and prices */
  pricing: PricingIdsAndQuantity[];
}

/**
 * Combo price breakdown
 *
 * Detailed breakdown of combo pricing for display purposes.
 */
export interface ComboPriceBreakdown {
  /** Base combo price (from product.basePrice) */
  baseComboPrice: number;

  /** Price of addons per combo group */
  groupPrices: Array<{
    groupId: string;
    groupLabel: string;
    items: Array<{
      productName: string;
      addonTotal: number;
    }>;
    groupTotal: number;
  }>;

  /** Total addon price across all groups */
  totalAddonPrice: number;

  /** Final total (baseComboPrice + totalAddonPrice) */
  totalPrice: number;
}

/**
 * Combo group selection count summary
 *
 * Summary of selections per group for validation and UI display.
 */
export interface ComboGroupSelectionSummary {
  /** Combo group ID */
  groupId: string;

  /** Group label for display */
  label: string;

  /** Number of items selected */
  selectedCount: number;

  /** Minimum required selections */
  minRequired: number;

  /** Maximum allowed selections */
  maxAllowed: number;

  /** Whether the group is valid */
  isValid: boolean;

  /** Error message if invalid */
  error?: string;
}

// ============================================================================
// UTILITY FUNCTIONS TYPE SIGNATURES
// ============================================================================

/**
 * Transform combo selections to API format
 */
export type TransformComboSelectionsToAPI = (
  selections: ComboGroupSelectionState
) => FlatComboSelection[];

/**
 * Calculate total combo price
 */
export type CalculateComboPriceFunction = (
  basePrice: number,
  selections: ComboGroupSelectionState
) => number;

/**
 * Validate all combo groups
 */
export type ValidateComboGroupsFunction = (
  comboGroups: ComboGroupResponse[],
  selections: ComboGroupSelectionState
) => ComboGroupSelectionSummary[];

/**
 * Check if combo is ready for cart
 */
export type IsComboReadyForCartFunction = (
  comboGroups: ComboGroupResponse[],
  selections: ComboGroupSelectionState
) => boolean;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for ComboItemSelection
 */
export function isComboItemSelection(
  item: unknown
): item is ComboItemSelection {
  return (
    typeof item === 'object' &&
    item !== null &&
    'productId' in item &&
    'comboGroupProductId' in item &&
    'variantId' in item &&
    'pricing' in item &&
    'customized' in item &&
    typeof (item as ComboItemSelection).productId === 'string' &&
    typeof (item as ComboItemSelection).comboGroupProductId === 'string' &&
    typeof (item as ComboItemSelection).variantId === 'string' &&
    Array.isArray((item as ComboItemSelection).pricing) &&
    typeof (item as ComboItemSelection).customized === 'boolean'
  );
}

/**
 * Type guard for ComboGroupSelectionState
 */
export function isComboGroupSelectionState(
  state: unknown
): state is ComboGroupSelectionState {
  if (typeof state !== 'object' || state === null) return false;

  return Object.values(state).every(
    (value) =>
      Array.isArray(value) && value.every((item) => isComboItemSelection(item))
  );
}

/**
 * Type guard for ComboValidationResult
 */
export function isComboValidationResult(
  result: unknown
): result is ComboValidationResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'isValid' in result &&
    'selectedCount' in result &&
    'minRequired' in result &&
    'maxAllowed' in result &&
    typeof (result as ComboValidationResult).isValid === 'boolean' &&
    typeof (result as ComboValidationResult).selectedCount === 'number' &&
    typeof (result as ComboValidationResult).minRequired === 'number' &&
    typeof (result as ComboValidationResult).maxAllowed === 'number'
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default values for combo selections
 */
export const COMBO_DEFAULTS = {
  /** Default empty combo selection state */
  EMPTY_SELECTION_STATE: {} as ComboGroupSelectionState,

  /** Default variant ID when none is specified */
  DEFAULT_VARIANT_ID: '',

  /** Initial customization state (no addons selected) */
  INITIAL_PRICING: [] as PricingIdsAndQuantity[],

  /** Initial customized flag (not customized yet) */
  INITIAL_CUSTOMIZED: false,
} as const;

/**
 * Error messages for combo validation
 */
export const COMBO_ERRORS = {
  /** Generic validation error */
  VALIDATION_FAILED: 'Please complete all combo selections',

  /** Minimum selection not met */
  MIN_NOT_MET: (min: number) => `Please select at least ${min} item${min === 1 ? '' : 's'}`,

  /** Maximum selection exceeded */
  MAX_EXCEEDED: (max: number) => `Maximum ${max} item${max === 1 ? '' : 's'} allowed`,

  /** Selection out of range */
  OUT_OF_RANGE: (selected: number, min: number, max: number) =>
    `Select between ${min} and ${max} items (currently ${selected})`,

  /** Product fetch failed */
  PRODUCT_FETCH_FAILED: 'Failed to load product details for customization',

  /** Customization save failed */
  CUSTOMIZATION_SAVE_FAILED: 'Failed to save customization',
} as const;

/**
 * UI display constants
 */
export const COMBO_UI = {
  /** Text for selected badge */
  SELECTED_TEXT: (index: number) => `Selected ${index}`,

  /** Text for customize button */
  CUSTOMIZE_TEXT: 'Customize',

  /** Text for customized badge */
  CUSTOMIZED_TEXT: 'Customized',

  /** Text for remove button */
  REMOVE_TEXT: 'Remove',

  /** Text for selection count */
  SELECTION_COUNT: (selected: number, max: number) => `${selected}/${max} selected`,

  /** Text for required indicator */
  REQUIRED_TEXT: 'Required',

  /** Text for optional indicator */
  OPTIONAL_TEXT: 'Optional',
} as const;
