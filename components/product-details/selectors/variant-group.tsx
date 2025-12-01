"use client";

import * as React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { VariantCard } from "./variant-card";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { getVariantPrice } from "@/lib/utils/price-calculator";
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

  // Calculate variant price using price-calculator utility
  const calculateVariantPrice = (variantId: string) => {
    if (!context.productData) return 0;

    return getVariantPrice(
      variantId,
      primaryVariantId,
      context.productData.variantList,
      context.productData.variantGroupList,
      context.productData.pricing
    );
  };

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
