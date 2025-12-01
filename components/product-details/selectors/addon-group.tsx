"use client";

import * as React from "react";
import { AddonItem } from "./addon-item";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { getAddonPrice } from "@/lib/utils/price-calculator";
import type { AddonGroupProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

export function AddonGroup({
  group,
  addons,
  selectedAddons,
  onSelect,
  error,
  className,
}: AddonGroupProps) {
  const context = useProductDetailsContext();

  // Get primary variant ID from context for price calculation
  const primaryVariantId = React.useMemo(() => {
    if (!context.productData) return null;

    for (const [groupId, variantId] of context.selectedVariants.entries()) {
      const variantGroup = context.productData.variantGroupList.find(
        (g) => g._id === groupId
      );
      if (variantGroup?.isPrimary) {
        return variantId;
      }
    }
    return null;
  }, [context.selectedVariants, context.productData]);

  // Calculate addon price using price-calculator utility
  const calculateAddonPrice = (addonId: string) => {
    if (!context.productData) return 0;

    return getAddonPrice(
      addonId,
      primaryVariantId,
      context.productData.pricing
    );
  };

  // Calculate selection count
  const selectedCount = addons.filter(
    (addon) => selectedAddons[addon._id] > 0
  ).length;

  const isMinMet = selectedCount >= group.min;

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Group Label and Status */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3
            id={`addon-group-${group._id}`}
            className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            {group.label}
          </h3>
          {group.min > 0 && (
            <span
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold shrink-0",
                isMinMet
                  ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span className="sr-only">
                {isMinMet ? "Requirement met: " : "Required: "}
              </span>
              {selectedCount}/{group.min} required
            </span>
          )}
        </div>
        {group.description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {group.description}
          </p>
        )}
        {group.max > 0 && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Select up to {group.max} items
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-1 text-xs sm:text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}
      </div>

      {/* Addon Items - Responsive spacing */}
      <div
        role="group"
        aria-labelledby={`addon-group-${group._id}`}
        className="space-y-2"
      >
        {addons.map((addon) => {
          const quantity = selectedAddons[addon._id] || 0;
          const addonPrice = calculateAddonPrice(addon._id);

          return (
            <AddonItem
              key={addon._id}
              addon={addon}
              quantity={quantity}
              price={addonPrice}
              allowMulti={group.allowMulti}
              maxQuantity={group.max > 0 ? group.max : 10}
              onSelect={(newQuantity) => onSelect(addon._id, newQuantity)}
            />
          );
        })}
      </div>
    </div>
  );
}
