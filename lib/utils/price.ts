import { OrderDeliveryType } from "@/types/cart";

/**
 * Calculate the display price including packaging charges for delivery orders
 */
export function calculateDisplayPrice(
  basePrice: number,
  packagingCharges: number,
  deliveryType: OrderDeliveryType
): number {
  if (deliveryType === "delivery") {
    return basePrice + packagingCharges;
  }
  return basePrice;
}

/**
 * Get packaging info for display purposes
 */
export function getPackagingInfo(
  packagingCharges: number,
  deliveryType: OrderDeliveryType
): { showPackaging: boolean; amount: number } {
  return {
    showPackaging: deliveryType === "delivery" && packagingCharges > 0,
    amount: packagingCharges,
  };
}

/**
 * Check if a product is available for the selected delivery type
 */
export function isProductAvailableForDeliveryType(
  availableDeliveryTypes: OrderDeliveryType[],
  selectedDeliveryType: OrderDeliveryType
): boolean {
  return availableDeliveryTypes.includes(selectedDeliveryType);
}

/**
 * Format price for display (in INR)
 */
export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}
