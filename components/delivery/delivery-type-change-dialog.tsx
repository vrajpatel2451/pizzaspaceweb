"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { OrderDeliveryType } from "@/types/cart";

/**
 * Props for DeliveryTypeChangeDialog component
 */
export interface DeliveryTypeChangeDialogProps {
  /**
   * Controls dialog visibility
   */
  open: boolean;

  /**
   * Callback when dialog visibility changes
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Current selected delivery type
   */
  currentDeliveryType: OrderDeliveryType;

  /**
   * New delivery type user wants to switch to
   */
  newDeliveryType: OrderDeliveryType;

  /**
   * List of cart items that will become unavailable
   */
  affectedItems: Array<{ id: string; name: string }>;

  /**
   * Callback when user confirms the delivery type change
   */
  onConfirm: () => void;

  /**
   * Callback when user cancels the change
   */
  onCancel: () => void;
}

/**
 * Format delivery type for display
 */
function formatDeliveryType(type: OrderDeliveryType): string {
  const displayNames: Record<OrderDeliveryType, string> = {
    dineIn: "Dine In",
    pickup: "Pickup",
    delivery: "Delivery",
  };
  return displayNames[type];
}

/**
 * DeliveryTypeChangeDialog Component
 *
 * Displays a confirmation dialog when user attempts to change delivery type
 * while having items in cart that won't be available for the new delivery type.
 *
 * Features:
 * - Shows count of affected items
 * - Lists all items that will be removed
 * - Warning styling with amber/orange theme
 * - Accessible with proper ARIA labels
 * - Scrollable list for many items
 * - Clear cancel and confirm actions
 *
 * @example
 * ```tsx
 * <DeliveryTypeChangeDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   currentDeliveryType="pickup"
 *   newDeliveryType="delivery"
 *   affectedItems={[
 *     { id: "1", name: "Margherita Pizza" },
 *     { id: "2", name: "Caesar Salad" }
 *   ]}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function DeliveryTypeChangeDialog({
  open,
  onOpenChange,
  currentDeliveryType,
  newDeliveryType,
  affectedItems,
  onConfirm,
  onCancel,
}: DeliveryTypeChangeDialogProps) {
  const affectedCount = affectedItems.length;

  /**
   * Handle confirm button click
   */
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="delivery-type-change-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle
              className="h-5 w-5 text-amber-600"
              aria-hidden="true"
            />
            Change Delivery Type?
          </DialogTitle>
          <DialogDescription id="delivery-type-change-description">
            Changing from {formatDeliveryType(currentDeliveryType)} to{" "}
            {formatDeliveryType(newDeliveryType)} will affect your cart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alert */}
          <Alert variant="default" className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              {affectedCount === 1
                ? "1 item in your cart is not available for "
                : `${affectedCount} items in your cart are not available for `}
              {formatDeliveryType(newDeliveryType).toLowerCase()} and will be
              removed.
            </AlertDescription>
          </Alert>

          {/* Affected Items List */}
          {affectedCount > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                Items to be removed:
              </h3>
              <div
                className="max-h-[200px] overflow-y-auto rounded-md border border-gray-200 bg-gray-50"
                role="list"
                aria-label="List of items that will be removed from cart"
              >
                <ul className="divide-y divide-gray-200">
                  {affectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-3 text-sm text-gray-700"
                      role="listitem"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Informational Text */}
          <p className="text-sm text-gray-600">
            You can continue browsing and add new items available for{" "}
            {formatDeliveryType(newDeliveryType).toLowerCase()} after
            confirming this change.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            aria-label="Cancel delivery type change"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
            aria-label={`Change delivery type to ${formatDeliveryType(
              newDeliveryType
            )}`}
          >
            Change Delivery Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
