"use client";

import * as React from "react";
import { VariantGroupCard } from "../cards/variant-group-card";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { VariantGroupsSectionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

/**
 * Variant Groups Section
 *
 * Displays all variant groups using the premium VariantGroupCard component.
 * Groups are sorted with primary variants first.
 *
 * Key logic (from reference code):
 * - Primary variants use selectPrimaryVariant (stores just the variantId)
 * - Sub-variants use selectSubVariant (stores pricing entry)
 */
export function VariantGroupsSection({
  className,
  variantGroupList: propVariantGroupList,
  variantList: propVariantList
}: VariantGroupsSectionProps) {
  const context = useProductDetailsContext();

  // Use props if provided, otherwise fall back to context (props take priority for timing reasons)
  // Memoize to avoid unnecessary re-renders
  const variantGroupList = React.useMemo(
    () => propVariantGroupList ?? context.productData?.variantGroupList ?? [],
    [propVariantGroupList, context.productData?.variantGroupList]
  );

  const variantList = React.useMemo(
    () => propVariantList ?? context.productData?.variantList ?? [],
    [propVariantList, context.productData?.variantList]
  );

  // Sort variant groups: primary first, then secondary
  const sortedGroups = React.useMemo(() => {
    return [...variantGroupList].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return 0;
    });
  }, [variantGroupList]);

  // Get variants for a specific group
  const getVariantsForGroup = (groupId: string) => {
    return variantList.filter((variant) => variant.groupId === groupId);
  };

  if (variantGroupList.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sortedGroups.map((group) => {
        const groupVariants = getVariantsForGroup(group._id);

        // Determine selected variant ID based on group type
        let selectedVariantId: string | undefined;

        if (group.isPrimary) {
          // For primary groups, use the selectedVariantId directly
          selectedVariantId = context.selectedVariantId;
        } else {
          // For sub-variant groups, use the helper function
          selectedVariantId = context.getSelectedSubVariantId(group._id);
        }

        // Handle selection based on group type
        const handleSelect = (variantId: string) => {
          if (group.isPrimary) {
            context.selectPrimaryVariant(variantId);
          } else {
            context.selectSubVariant(variantId);
          }
        };

        return (
          <VariantGroupCard
            key={group._id}
            group={group}
            variants={groupVariants}
            selectedVariantId={selectedVariantId}
            onSelect={handleSelect}
          />
        );
      })}
    </div>
  );
}
