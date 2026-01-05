"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { SelectionCounter } from "../badges/selection-counter";
import { CustomImage } from "@/components/ui/custom-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { cn } from "@/lib/utils";
import type { ComboGroupCardProps } from "@/types/combo";

// Collapse threshold - show first N items, then "see more" button
const COLLAPSE_THRESHOLD = 4;

/**
 * ComboGroupCard - Single combo group container
 *
 * Styled to match VariantGroupCard and AddonGroupCard patterns:
 * - Premium card with rounded corners and subtle shadow
 * - Header with gradient background
 * - SelectionCounter (X/Y) in header
 * - Highlighted rows when selected
 * - "+X more options" collapse button
 */
export function ComboGroupCard({
  group,
  products,
  className,
}: ComboGroupCardProps) {
  const {
    comboSelections,
    toggleComboProduct,
    openComboCustomization,
    getComboGroupValidation,
  } = useProductDetailsContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Get selections for this group
  const groupSelections = comboSelections[group.groupId] || [];
  const validation = getComboGroupValidation(group.groupId);
  const selectedCount = validation.selectedCount;
  const { minSelection, maxSelection, allowCustomization, label, description } = group;

  // Determine if this group is required (minSelection > 0)
  const isRequired = minSelection > 0;

  // Collapse logic
  const shouldCollapse = products.length > COLLAPSE_THRESHOLD;
  const displayedProducts = shouldCollapse && !isExpanded
    ? products.slice(0, COLLAPSE_THRESHOLD)
    : products;
  const hiddenCount = products.length - COLLAPSE_THRESHOLD;

  // Handler for toggling product selection
  const handleToggle = React.useCallback(
    (productId: string, comboGroupProductId: string, defaultVariantId: string) => {
      toggleComboProduct(group.groupId, productId, comboGroupProductId, defaultVariantId);
    },
    [group.groupId, toggleComboProduct]
  );

  // Handler for opening customization dialog
  const handleCustomize = React.useCallback(
    (selectionIndex: number) => {
      openComboCustomization(group.groupId, selectionIndex);
    },
    [group.groupId, openComboCustomization]
  );

  // Check if a product is selected and get its index
  const getSelectionInfo = (productId: string) => {
    const index = groupSelections.findIndex(s => s.productId === productId);
    return {
      isSelected: index >= 0,
      index,
      selection: index >= 0 ? groupSelections[index] : null,
    };
  };

  // Check if more items can be selected
  const canSelectMore = selectedCount < maxSelection;

  return (
    <div
      className={cn(
        // Card container - matches variant/addon card styling
        "rounded-2xl border border-border/50 bg-card overflow-hidden",
        // Premium shadow and dark mode
        "shadow-sm shadow-black/5 dark:shadow-black/20",
        "dark:border-border/30 dark:bg-card/95",
        // Animation
        "transition-all duration-300 motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className
      )}
    >
      {/* Card Header - matches addon-group-card header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-transparent border-b border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                {label}
              </h3>
              {isRequired && (
                <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
                  Required
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Selection Counter - matches addon group style */}
          <SelectionCounter
            current={selectedCount}
            max={maxSelection}
            variant="compact"
          />
        </div>
      </div>

      {/* Product Options */}
      <div
        role="group"
        aria-label={`Select ${label.toLowerCase()} items`}
        className="divide-y divide-border/30"
      >
        {displayedProducts.map((product, index) => {
          const { isSelected, index: selectionArrayIndex, selection } = getSelectionInfo(product.productId);
          const productName = product.product?.name ?? "Unknown Product";
          const productImage = product.product?.photoList?.[0];
          const productType = product.product?.type;
          const isCustomized = selection?.customized ?? false;
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <div
              key={product._id}
              className={cn(
                "transition-all duration-200 motion-reduce:transition-none",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
            >
              {/* Product Row - matches addon option row styling */}
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-4 transition-all duration-200",
                  "min-h-[60px]",
                  isDisabled && "opacity-50 cursor-not-allowed",
                  isSelected
                    ? "bg-primary/5 dark:bg-primary/10"
                    : isDisabled
                      ? "bg-muted/20"
                      : "hover:bg-muted/40 dark:hover:bg-muted/20"
                )}
              >
                {/* Checkbox/Radio - matches addon checkbox style */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-disabled={isDisabled}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleToggle(
                    product.productId,
                    product._id,
                    product.defaultVariantId || ""
                  )}
                  className={cn(
                    "size-[22px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "touch-manipulation active:scale-90",
                    isDisabled && "cursor-not-allowed opacity-50",
                    isSelected
                      ? "border-primary bg-primary shadow-sm shadow-primary/30"
                      : isDisabled
                        ? "border-border/50 bg-muted/30"
                        : "border-border/80 bg-background hover:border-primary/50 dark:border-border/60"
                  )}
                  aria-label={`${isSelected ? "Remove" : "Add"} ${productName}${isDisabled ? " (limit reached)" : ""}`}
                >
                  {isSelected && (
                    <div className="animate-in fade-in-0 zoom-in-50 duration-200">
                      <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Product Image */}
                {productImage && (
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden">
                    <CustomImage
                      src={productImage}
                      alt={productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content - clickable to toggle */}
                <div
                  className={cn(
                    "flex-1 min-w-0",
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                  onClick={() => !isDisabled && handleToggle(
                    product.productId,
                    product._id,
                    product.defaultVariantId || ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm sm:text-base font-medium transition-colors truncate",
                        isSelected ? "text-foreground" : "text-foreground/85"
                      )}
                    >
                      {productName}
                    </span>
                    {/* Veg/Non-veg badge */}
                    {(productType === "veg" || productType === "vegan") && (
                      <Badge variant="veg" size="sm" className="shrink-0">
                        {productType === "vegan" ? "Vegan" : "Veg"}
                      </Badge>
                    )}
                    {productType === "non_veg" && (
                      <Badge variant="nonveg" size="sm" className="shrink-0">
                        Non-Veg
                      </Badge>
                    )}
                  </div>
                  {/* Customized indicator */}
                  {isCustomized && isSelected && (
                    <span className="text-xs text-primary mt-0.5">
                      Customized
                    </span>
                  )}
                </div>

                {/* Customize Button - only shown when selected and allowed */}
                {isSelected && allowCustomization && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectionArrayIndex >= 0) {
                        handleCustomize(selectionArrayIndex);
                      }
                    }}
                    className={cn(
                      "shrink-0 text-xs sm:text-sm h-7 sm:h-8",
                      "border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground",
                      "animate-in fade-in-0 zoom-in-95"
                    )}
                  >
                    Customize
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Button - matches variant/addon "+X more" style */}
      {shouldCollapse && (
        <div className="px-4 py-3 border-t border-border/30">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5",
              "text-sm font-medium text-primary",
              "bg-primary/5 hover:bg-primary/10",
              "transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <span
              className={cn(
                "transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            >
              <ChevronDown className="size-4" />
            </span>
            {isExpanded ? "Show less" : `+${hiddenCount} more options`}
          </button>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
          No products available in this group
        </div>
      )}
    </div>
  );
}
