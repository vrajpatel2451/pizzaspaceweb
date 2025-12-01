import type {
  VariantResponse,
  VariantGroupResponse,
  AddonResponse,
  VariantPricingResponse,
} from "@/types/product";

/**
 * Addon selection with quantity
 */
interface AddonSelection {
  selected: boolean;
  quantity: number;
}

/**
 * Calculate total price based on selections
 *
 * Logic:
 * 1. Start with base product price
 * 2. Add primary variant price (direct from variant.price)
 * 3. Add secondary variant prices (lookup in VariantPricingResponse)
 * 4. Add addon prices (lookup in VariantPricingResponse, multiply by quantity)
 * 5. Multiply final by quantity
 */
export function calculateTotalPrice(params: {
  basePrice: number;
  selectedVariants: Map<string, string>;
  selectedAddons: Map<string, AddonSelection>;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  pricing: VariantPricingResponse[];
  quantity: number;
}): number {
  const {
    basePrice,
    selectedVariants,
    selectedAddons,
    variantList,
    variantGroupList,
    pricing,
    quantity,
  } = params;

  let itemPrice = basePrice;

  // Find primary variant ID
  const primaryVariantId = getPrimaryVariantId(
    selectedVariants,
    variantGroupList
  );

  // Add variant prices
  for (const [, variantId] of selectedVariants.entries()) {
    const variantPrice = getVariantPrice(
      variantId,
      primaryVariantId,
      variantList,
      variantGroupList,
      pricing
    );
    itemPrice += variantPrice;
  }

  // Add addon prices
  for (const [addonId, selection] of selectedAddons.entries()) {
    if (selection.selected && selection.quantity > 0) {
      const addonPrice = getAddonPrice(addonId, primaryVariantId, pricing);
      itemPrice += addonPrice * selection.quantity;
    }
  }

  // Multiply by quantity
  return itemPrice * quantity;
}

/**
 * Get price for a specific variant
 *
 * For primary variants: use variant.price directly
 * For secondary variants: lookup in pricing array where:
 *   - type="variant"
 *   - variantId matches the primary variant
 *   - subVariantId matches the secondary variant
 */
export function getVariantPrice(
  variantId: string,
  primaryVariantId: string | null,
  variantList: VariantResponse[],
  variantGroupList: VariantGroupResponse[],
  pricing: VariantPricingResponse[]
): number {
  const variant = variantList.find((v) => v._id === variantId);
  if (!variant) return 0;

  // Check if this is a primary variant
  const group = variantGroupList.find((g) => g._id === variant.groupId);
  if (!group) return 0;

  if (group.isPrimary) {
    // Primary variant: use direct price
    return variant.price;
  } else {
    // Secondary variant: lookup in pricing array
    if (!primaryVariantId) return 0;

    const pricingEntry = pricing.find(
      (p) =>
        p.type === "variant" &&
        p.variantId === primaryVariantId &&
        p.subVariantId === variantId &&
        p.isVisible
    );

    return pricingEntry ? pricingEntry.price : 0;
  }
}

/**
 * Get price for a specific addon
 *
 * Lookup in pricing array where:
 *   - type="addon"
 *   - variantId matches the primary variant (or "addonGroup" for group-level pricing)
 *   - addonId matches the addon
 */
export function getAddonPrice(
  addonId: string,
  primaryVariantId: string | null,
  pricing: VariantPricingResponse[]
): number {
  if (!primaryVariantId) {
    // If no primary variant, check for group-level pricing
    const groupPricing = pricing.find(
      (p) => p.type === "addonGroup" && p.addonId === addonId && p.isVisible
    );
    return groupPricing ? groupPricing.price : 0;
  }

  // Check for variant-specific addon pricing
  const variantPricing = pricing.find(
    (p) =>
      p.type === "addon" &&
      p.variantId === primaryVariantId &&
      p.addonId === addonId &&
      p.isVisible
  );

  if (variantPricing) {
    return variantPricing.price;
  }

  // Fall back to group-level pricing
  const groupPricing = pricing.find(
    (p) => p.type === "addonGroup" && p.addonId === addonId && p.isVisible
  );

  return groupPricing ? groupPricing.price : 0;
}

/**
 * Helper to find the primary variant ID from selections
 */
function getPrimaryVariantId(
  selectedVariants: Map<string, string>,
  variantGroupList: VariantGroupResponse[]
): string | null {
  for (const [groupId, variantId] of selectedVariants.entries()) {
    const group = variantGroupList.find((g) => g._id === groupId);
    if (group?.isPrimary) {
      return variantId;
    }
  }
  return null;
}
