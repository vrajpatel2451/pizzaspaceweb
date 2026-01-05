"use client";

import * as React from "react";
import { ComboGroupCard } from "./combo-group-card";
import { ComboCustomizationDialog } from "./combo-customization-dialog";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { cn } from "@/lib/utils";
import type { ComboGroupsSectionProps } from "@/types/combo";

/**
 * ComboGroupsSection - Container for all combo groups
 *
 * Main section component that renders all combo groups for a combo product.
 * Displayed instead of VariantGroupsSection/AddonGroupsSection when isCombo=true.
 */
export function ComboGroupsSection({ className }: ComboGroupsSectionProps) {
  const { productData } = useProductDetailsContext();

  // Early return if no combo data
  if (!productData?.comboGroups || !productData?.comboGroupProducts) {
    return null;
  }

  const { comboGroups, comboGroupProducts } = productData;

  // No combo groups to display
  if (comboGroups.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4 sm:space-y-5", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Build Your Combo
        </h2>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {comboGroups.length} selection{comboGroups.length !== 1 ? "s" : ""} required
        </span>
      </div>

      {/* Combo Groups */}
      <div className="space-y-4">
        {comboGroups.map((group, index) => {
          // Get products that belong to this combo group
          const groupProducts = comboGroupProducts.filter(
            (cgp) => cgp.comboGroupId === group._id
          );

          return (
            <div
              key={group._id}
              className={cn(
                "animate-fade-in-up motion-reduce:animate-none",
                `stagger-${Math.min(index + 1, 5)}`
              )}
            >
              <ComboGroupCard group={group} products={groupProducts} />
            </div>
          );
        })}
      </div>

      {/* Customization Dialog - Single instance, controlled by context */}
      <ComboCustomizationDialog />
    </div>
  );
}
