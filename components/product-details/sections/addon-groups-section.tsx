"use client";

import * as React from "react";
import { AddonGroupCard } from "../cards/addon-group-card";
import { SelectionCounter } from "../badges/selection-counter";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { AddonGroupsSectionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

/**
 * Addon Groups Section
 *
 * Displays all addon groups using the premium AddonGroupCard component.
 * The card handles visibility filtering based on current variant.
 *
 * Key logic (from reference code):
 * - Addon groups are filtered to only show those with visible addons for current variant
 * - Each addon's visibility is determined by the pricing array (type="addon", isVisible=true)
 */
export function AddonGroupsSection({
  className,
  addonGroupList: propAddonGroupList,
  addonList: propAddonList
}: AddonGroupsSectionProps) {
  const context = useProductDetailsContext();

  // Use props if provided, otherwise fall back to context (props take priority for timing reasons)
  // Memoize to avoid unnecessary re-renders
  const addonGroupList = React.useMemo(
    () => propAddonGroupList ?? context.productData?.addonGroupList ?? [],
    [propAddonGroupList, context.productData?.addonGroupList]
  );

  const addonList = React.useMemo(
    () => propAddonList ?? context.productData?.addonList ?? [],
    [propAddonList, context.productData?.addonList]
  );

  // Get addons for a specific group
  const getAddonsForGroup = (groupId: string) => {
    return addonList.filter((addon) => addon.groupId === groupId);
  };

  // Handler to clear all addons in a group
  const handleClearGroup = (groupId: string) => {
    const groupAddons = getAddonsForGroup(groupId);
    groupAddons.forEach((addon) => {
      const pricingId = context.getAddonPricingId(addon._id);
      if (pricingId && context.isAddonSelected(addon._id)) {
        context.toggleAddon(pricingId, 0); // Set to 0 to remove
      }
    });
  };

  // Get variant constraints for overall counter
  const variantConstraints = context.getSelectedVariantMaxItems();
  const showOverallCounter =
    variantConstraints?.maxItemTypes === "overall" &&
    (variantConstraints?.maxItems ?? 0) > 0;
  const totalQuantity = context.getTotalAddonQuantity();

  if (addonGroupList.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Counter Header */}
      {showOverallCounter && (
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-foreground">
            Add-ons
          </span>
          <SelectionCounter
            current={totalQuantity}
            max={variantConstraints!.maxItems}
          />
        </div>
      )}

      {addonGroupList.map((group) => {
        const groupAddons = getAddonsForGroup(group._id);

        // Skip groups with no addons
        if (groupAddons.length === 0) {
          return null;
        }

        return (
          <AddonGroupCard
            key={group._id}
            group={group}
            addons={groupAddons}
            onClearAll={() => handleClearGroup(group._id)}
          />
        );
      })}
    </div>
  );
}
