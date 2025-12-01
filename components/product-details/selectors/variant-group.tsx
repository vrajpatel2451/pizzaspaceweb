"use client";

import * as React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { VariantCard } from "./variant-card";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { VariantGroupProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

export function VariantGroup({
  group,
  variants,
  selectedVariantId,
  onSelect,
  className,
}: VariantGroupProps) {
  const context = useProductDetailsContext();

  /**
   * Calculate variant price
   * - For primary variants: use variant.price directly
   * - For sub-variants: lookup in pricing array
   */
  const calculateVariantPrice = React.useCallback(
    (variantId: string): number => {
      if (!context.productData) return 0;

      const variant = variants.find((v) => v._id === variantId);
      if (!variant) return 0;

      if (group.isPrimary) {
        // Primary variant: use direct price
        return variant.price;
      } else {
        // Sub-variant: lookup in pricing array
        const pricing = context.productData.pricing.find(
          (p) =>
            p.type === "variant" &&
            p.variantId === context.selectedVariantId &&
            p.subVariantId === variantId
        );
        return pricing?.price ?? 0;
      }
    },
    [context.productData, context.selectedVariantId, group.isPrimary, variants]
  );

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Group Label */}
      <div>
        <h3
          id={`variant-group-${group._id}`}
          className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-foreground"
        >
          {group.label}
          {group.isPrimary && (
            <>
              <span className="ml-2 text-xs font-normal text-muted-foreground" aria-hidden="true">
                (Required)
              </span>
              <span className="sr-only">required</span>
            </>
          )}
        </h3>
        {group.description && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {group.description}
          </p>
        )}
      </div>

      {/* Radio Group with Variant Cards - Responsive layout */}
      <RadioGroup
        value={selectedVariantId}
        onValueChange={onSelect}
        aria-label={`Select ${group.label.toLowerCase()}`}
        aria-labelledby={`variant-group-${group._id}`}
        aria-required={group.isPrimary}
        className={cn(
          // Mobile: vertical stack
          "space-y-2",
          // Desktop: grid if 3+ variants and not primary (primary stays vertical for clarity)
          variants.length >= 3 && !group.isPrimary && "sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0",
          variants.length >= 4 && !group.isPrimary && "lg:grid-cols-3"
        )}
      >
        {variants.map((variant) => (
          <VariantCard
            key={variant._id}
            variant={variant}
            price={calculateVariantPrice(variant._id)}
            isSelected={selectedVariantId === variant._id}
            onSelect={() => onSelect(variant._id)}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
