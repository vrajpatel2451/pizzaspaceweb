"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { CompactQuantityPill } from "../controls/quantity-pill";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { formatPrice } from "@/lib/utils/currency";
import type { AddonGroupResponse, AddonResponse } from "@/types/product";
import { cn } from "@/lib/utils";

export interface AddonGroupCardProps {
  group: AddonGroupResponse;
  addons: AddonResponse[];
  className?: string;
  onClearAll?: () => void;
}

const COLLAPSE_THRESHOLD = 4;

/**
 * Premium Addon Group Card Component
 *
 * Zomato/Swiggy style addon selection card with:
 * - Header with "Add-ons" and "Clear" button
 * - Checkbox on left side
 * - "Most Ordered" badges for popular items
 * - Quantity counter appears when selected
 * - Expandable "+X more" if many addons
 * - Smooth animations throughout
 *
 * Uses the new context pattern:
 * - Uses context.isAddonVisible() to check visibility
 * - Uses context.getAddonPricingId() to get pricing ID
 * - Uses context.toggleAddon(pricingId, qty) for selection
 */
export function AddonGroupCard({
  group,
  addons,
  className,
  onClearAll,
}: AddonGroupCardProps) {
  const context = useProductDetailsContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Filter addons that are visible for current variant
  const visibleAddons = useMemo(() => {
    return addons.filter((addon) => context.isAddonVisible(addon._id));
  }, [addons, context]);

  // Get addon price from pricing array
  const getAddonPrice = useCallback(
    (addonId: string): number => {
      if (!context.productData) return 0;

      const pricing = context.productData.pricing.find(
        (p) =>
          p.type === "addon" &&
          p.variantId === context.selectedVariantId &&
          p.addonId === addonId
      );
      return pricing?.price ?? 0;
    },
    [context.productData, context.selectedVariantId]
  );

  // Selection counts - only count visible addons
  const selectedCount = visibleAddons.filter((addon) =>
    context.isAddonSelected(addon._id)
  ).length;
  const hasAnySelected = selectedCount > 0;

  // Collapse logic
  const shouldCollapse = visibleAddons.length > COLLAPSE_THRESHOLD;
  const displayedAddons =
    shouldCollapse && !isExpanded
      ? visibleAddons.slice(0, COLLAPSE_THRESHOLD)
      : visibleAddons;
  const hiddenCount = visibleAddons.length - COLLAPSE_THRESHOLD;

  // Handlers
  const handleToggleAddon = (addonId: string, isSelected: boolean) => {
    const pricingId = context.getAddonPricingId(addonId);
    if (!pricingId) return;
    context.toggleAddon(pricingId, isSelected ? 1 : 0);
  };

  const handleQuantityChange = (addonId: string, quantity: number) => {
    const pricingId = context.getAddonPricingId(addonId);
    if (!pricingId) return;
    context.toggleAddon(pricingId, quantity);
  };

  // Don't render if no visible addons
  if (visibleAddons.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Card container
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
      {/* Card Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-transparent border-b border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                {group.label}
              </h3>
            </div>
            {group.description && (
              <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
                {group.description}
              </p>
            )}
          </div>

          {/* Clear Button */}
          {hasAnySelected && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                "text-xs font-medium text-orange-600 dark:text-orange-400",
                "bg-orange-500/10 hover:bg-orange-500/20 dark:bg-orange-500/15",
                "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                "animate-in fade-in-0 zoom-in-95"
              )}
            >
              <X className="size-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Addon Options */}
      <div
        role="group"
        aria-label={`Select ${group.label.toLowerCase()} addons`}
        className="divide-y divide-border/30"
      >
        {displayedAddons.map((addon, index) => {
          const isSelected = context.isAddonSelected(addon._id);
          const quantity = context.getAddonQuantity(addon._id);
          const price = getAddonPrice(addon._id);

          return (
            <div
              key={addon._id}
              className={cn(
                "transition-all duration-200 motion-reduce:transition-none",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
            >
              <AddonOptionRow
                addon={addon}
                price={price}
                quantity={quantity}
                isSelected={isSelected}
                allowMulti={group.allowMulti}
                maxQuantity={group.max > 0 ? group.max : 10}
                onToggle={(selected) => handleToggleAddon(addon._id, selected)}
                onQuantityChange={(qty) => handleQuantityChange(addon._id, qty)}
              />
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      {shouldCollapse && (
        <div className="px-4 py-3 border-t border-border/30">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5",
              "text-sm font-medium text-orange-600 dark:text-orange-400",
              "bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-500/10",
              "transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
    </div>
  );
}

/**
 * Individual Addon Option Row
 */
interface AddonOptionRowProps {
  addon: AddonResponse;
  price: number;
  quantity: number;
  isSelected: boolean;
  allowMulti: boolean;
  maxQuantity: number;
  onToggle: (selected: boolean) => void;
  onQuantityChange: (quantity: number) => void;
}

function AddonOptionRow({
  addon,
  price,
  quantity,
  isSelected,
  allowMulti,
  maxQuantity,
  onToggle,
  onQuantityChange,
}: AddonOptionRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-4 transition-all duration-200",
        "min-h-[60px]",
        isSelected
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-muted/40 dark:hover:bg-muted/20"
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isSelected}
        onClick={() => onToggle(!isSelected)}
        className={cn(
          "size-[22px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "touch-manipulation active:scale-90",
          isSelected
            ? "border-primary bg-primary shadow-sm shadow-primary/30"
            : "border-border/80 bg-background hover:border-primary/50 dark:border-border/60"
        )}
        aria-label={`${isSelected ? "Remove" : "Add"} ${addon.label}`}
      >
        {isSelected && (
          <div className="animate-in fade-in-0 zoom-in-50 duration-200">
            <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
          </div>
        )}
      </button>

      {/* Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onToggle(!isSelected)}
      >
        <span
          className={cn(
            "text-sm sm:text-base font-medium transition-colors",
            isSelected ? "text-foreground" : "text-foreground/85"
          )}
        >
          {addon.label}
        </span>
      </div>

      {/* Quantity Counter (for multi-select) */}
      {isSelected && allowMulti && (
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-all duration-200 motion-reduce:transition-none",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <CompactQuantityPill
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            max={maxQuantity}
          />
        </div>
      )}

      {/* Price */}
      <div className="shrink-0 text-right min-w-[65px]">
        <span
          className={cn(
            "text-sm sm:text-base font-semibold tabular-nums transition-colors",
            isSelected
              ? "text-primary"
              : "text-foreground/80"
          )}
        >
          {formatPrice(price, { showSign: true })}
        </span>
      </div>
    </div>
  );
}
