"use client";

import * as React from "react";
import { AddonGroupCard } from "../cards/addon-group-card";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { AddonGroupsSectionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

/**
 * Addon Groups Section
 *
 * Displays all addon groups using the premium AddonGroupCard component.
 * Handles selection state and provides clear all functionality.
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

  // Convert Map to Record for compatibility with AddonGroupCard component
  const selectedAddonsRecord = React.useMemo(() => {
    const record: Record<string, number> = {};
    for (const [addonId, selection] of context.selectedAddons.entries()) {
      record[addonId] = selection.selected ? selection.quantity : 0;
    }
    return record;
  }, [context.selectedAddons]);

  // Handler to convert quantity to addon selection
  const handleAddonSelect = (addonId: string, quantity: number) => {
    if (quantity > 0) {
      context.setAddonQuantity(addonId, quantity);
    } else {
      // If quantity is 0, deselect the addon
      const currentSelection = context.selectedAddons.get(addonId);
      if (currentSelection?.selected) {
        context.toggleAddon(addonId);
      }
    }
  };

  // Handler to clear all addons in a group
  const handleClearGroup = (groupId: string) => {
    const groupAddons = getAddonsForGroup(groupId);
    groupAddons.forEach((addon) => {
      const selection = context.selectedAddons.get(addon._id);
      if (selection?.selected) {
        context.toggleAddon(addon._id);
      }
    });
  };

  if (addonGroupList.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {addonGroupList.map((group) => {
        const groupAddons = getAddonsForGroup(group._id);

        return (
          <AddonGroupCard
            key={group._id}
            group={group}
            addons={groupAddons}
            selectedAddons={selectedAddonsRecord}
            onSelect={handleAddonSelect}
            onClearAll={() => handleClearGroup(group._id)}
          />
        );
      })}
    </div>
  );
}
