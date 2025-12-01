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
        const selectedVariantId = context.selectedVariants.get(group._id);

        return (
          <VariantGroupCard
            key={group._id}
            group={group}
            variants={groupVariants}
            selectedVariantId={selectedVariantId}
            onSelect={(variantId) => context.selectVariant(group._id, variantId)}
          />
        );
      })}
    </div>
  );
}
