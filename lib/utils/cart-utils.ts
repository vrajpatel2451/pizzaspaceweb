import {
  AddToCartPayload,
  PricingIdsAndQuantity,
} from "@/types/cart";
import {
  VariantResponse,
  AddonResponse,
  VariantPricingResponse,
} from "@/types/product";

/**
 * Calculate total item price based on selected variants and addons
 */
export function calculateItemPrice(params: {
  basePrice: number;
  selectedVariant: VariantResponse | null;
  selectedAddons: Map<string, { selected: boolean; quantity: number }>;
  addonList: AddonResponse[];
  pricing: VariantPricingResponse[];
  quantity: number;
}): number {
  const {
    basePrice,
    selectedVariant,
    selectedAddons,
    addonList,
    pricing,
    quantity,
  } = params;

  // Start with base price or variant price
  let itemPrice = basePrice;

  // Add variant price if selected
  if (selectedVariant) {
    const variantPricing = pricing.find(
      (p) =>
        p.type === "variant" &&
        p.variantId === selectedVariant._id &&
        p.isVisible
    );
    if (variantPricing) {
      itemPrice = variantPricing.price;
    } else {
      itemPrice = selectedVariant.price;
    }
  }

  // Add addon prices
  selectedAddons.forEach((selection, addonId) => {
    if (!selection.selected || selection.quantity <= 0) return;

    const addon = addonList.find((a) => a._id === addonId);
    if (!addon) return;

    // Check if there's a specific pricing for this addon with the selected variant
    const addonPricing = pricing.find(
      (p) =>
        p.type === "addon" &&
        p.addonId === addonId &&
        p.variantId === selectedVariant?._id &&
        p.isVisible
    );

    const addonPrice = addonPricing?.price ?? addon.price;
    itemPrice += addonPrice * selection.quantity;
  });

  return itemPrice * quantity;
}

/**
 * Format pricing payload for cart API
 */
export function formatPricingPayload(params: {
  selectedVariant: VariantResponse | null;
  selectedAddons: Map<string, { selected: boolean; quantity: number }>;
  addonList: AddonResponse[];
  pricing: VariantPricingResponse[];
}): PricingIdsAndQuantity[] {
  const { selectedVariant, selectedAddons, addonList, pricing } = params;

  const pricingPayload: PricingIdsAndQuantity[] = [];

  // Add variant pricing if selected
  if (selectedVariant) {
    const variantPricing = pricing.find(
      (p) =>
        p.type === "variant" &&
        p.variantId === selectedVariant._id &&
        p.isVisible
    );

    if (variantPricing) {
      pricingPayload.push({
        id: variantPricing._id,
        quantity: 1,
      });
    }
  }

  // Add addon pricing for selected addons
  selectedAddons.forEach((selection, addonId) => {
    if (!selection.selected || selection.quantity <= 0) return;

    const addon = addonList.find((a) => a._id === addonId);
    if (!addon) return;

    // Find pricing entry for this addon with the selected variant
    const addonPricing = pricing.find(
      (p) =>
        p.type === "addon" &&
        p.addonId === addonId &&
        p.variantId === selectedVariant?._id &&
        p.isVisible
    );

    if (addonPricing) {
      pricingPayload.push({
        id: addonPricing._id,
        quantity: selection.quantity,
      });
    }
  });

  return pricingPayload;
}

/**
 * Validate cart payload before sending to API
 */
export function validateCartPayload(
  payload: AddToCartPayload
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!payload.itemId) {
    errors.push("Product ID is required");
  }

  if (!payload.categoryId) {
    errors.push("Category ID is required");
  }

  if (!payload.storeId) {
    errors.push("Store ID is required");
  }

  if (!payload.sessionId) {
    errors.push("Session ID is required");
  }

  if (!payload.variantId) {
    errors.push("Please select a variant");
  }

  if (!payload.quantity || payload.quantity < 1) {
    errors.push("Quantity must be at least 1");
  }

  if (!payload.pricing || payload.pricing.length === 0) {
    errors.push("Pricing information is missing");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create AddToCartPayload from product details context
 */
export function createAddToCartPayload(params: {
  productId: string;
  categoryId: string;
  storeId: string;
  sessionId: string;
  selectedVariant: VariantResponse | null;
  selectedAddons: Map<string, { selected: boolean; quantity: number }>;
  addonList: AddonResponse[];
  pricing: VariantPricingResponse[];
  quantity: number;
}): AddToCartPayload | null {
  const {
    productId,
    categoryId,
    storeId,
    sessionId,
    selectedVariant,
    selectedAddons,
    addonList,
    pricing,
    quantity,
  } = params;

  // Validate variant selection
  if (!selectedVariant) {
    return null;
  }

  // Format pricing payload
  const pricingPayload = formatPricingPayload({
    selectedVariant,
    selectedAddons,
    addonList,
    pricing,
  });

  // Create payload
  const payload: AddToCartPayload = {
    itemId: productId,
    categoryId,
    storeId,
    sessionId,
    variantId: selectedVariant._id,
    pricing: pricingPayload,
    quantity,
  };

  return payload;
}
