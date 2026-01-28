"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { OrderDeliveryType } from "@/types/cart";

export interface UnavailableNoticeProps {
  /**
   * The name of the product that is unavailable
   */
  productName: string;

  /**
   * The current delivery type that the user has selected
   */
  deliveryType: OrderDeliveryType;

  /**
   * The delivery types that this product is available for
   */
  availableDeliveryTypes: OrderDeliveryType[];
}

/**
 * Delivery type display names for user-friendly messages
 */
const DELIVERY_TYPE_LABELS: Record<OrderDeliveryType, string> = {
  delivery: "Delivery",
  pickup: "Collection",
  dineIn: "Dine In",
};

/**
 * Format delivery types into a human-readable list
 * Examples:
 * - ["delivery"] → "Delivery"
 * - ["delivery", "pickup"] → "Delivery or Pickup"
 * - ["delivery", "pickup", "dineIn"] → "Delivery, Pickup, or Dine In"
 */
function formatDeliveryTypesList(types: OrderDeliveryType[]): string {
  if (types.length === 0) return "";
  if (types.length === 1) return DELIVERY_TYPE_LABELS[types[0]];
  if (types.length === 2) {
    return `${DELIVERY_TYPE_LABELS[types[0]]} or ${DELIVERY_TYPE_LABELS[types[1]]}`;
  }

  const allButLast = types
    .slice(0, -1)
    .map((type) => DELIVERY_TYPE_LABELS[type])
    .join(", ");
  const last = DELIVERY_TYPE_LABELS[types[types.length - 1]];

  return `${allButLast}, or ${last}`;
}

/**
 * Unavailable Notice Component
 *
 * Displays an informational alert when a product cannot be added to the cart
 * because it's not available for the current delivery type.
 *
 * Features:
 * - Clear explanation of why the product is unavailable
 * - Shows which delivery types ARE available
 * - Suggests the user change their delivery type
 * - Uses warning/info styling (not destructive/error)
 * - Includes an info icon for visual clarity
 *
 * Used in product details modal/bottomsheet when `availableDeliveryTypes`
 * doesn't include the current `deliveryType`.
 */
export function UnavailableNotice({
  productName,
  deliveryType,
  availableDeliveryTypes,
}: UnavailableNoticeProps) {
  const currentTypeLabel = DELIVERY_TYPE_LABELS[deliveryType];
  const availableTypesText = formatDeliveryTypesList(availableDeliveryTypes);

  return (
    <Alert
      variant="default"
      className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
    >
      <Info className="text-amber-600 dark:text-amber-400" />
      <AlertTitle>Item not available for {currentTypeLabel}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          <span className="font-medium">{productName}</span> is not available
          for {currentTypeLabel.toLowerCase()}.
        </p>
        {availableDeliveryTypes.length > 0 && (
          <p className="text-xs sm:text-sm">
            This item is available for{" "}
            <span className="font-medium">{availableTypesText}</span>. Please
            change your delivery type to add this item to your cart.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
