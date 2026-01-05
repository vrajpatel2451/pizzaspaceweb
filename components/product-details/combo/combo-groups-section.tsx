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
    <div className={cn("space-y-4", className)}>
      {/* Combo Groups */}
      {comboGroups.map((group, index) => {
        // Get products that belong to this combo group
        const groupProducts = comboGroupProducts.filter(
          (cgp) => cgp.comboGroupId === group._id
        );

        return (
          <div
            key={group._id}
            className={cn(
              "animate-fade-in-up motion-reduce:animate-none"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ComboGroupCard group={group} products={groupProducts} />
          </div>
        );
      })}

      {/* Customization Dialog - Single instance, controlled by context */}
      <ComboCustomizationDialog />
    </div>
  );
}
