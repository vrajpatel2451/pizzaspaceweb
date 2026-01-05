"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { useDeliveryType } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils/currency";
import type { VariantGroupResponse, VariantResponse } from "@/types/product";
import { cn } from "@/lib/utils";

export interface VariantGroupCardProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

/**
 * Premium Variant Group Card Component
 *
 * Zomato/Swiggy style variant selection card with:
 * - Clean white card with subtle border
 * - "Required - Select any 1 option" labels
 * - Radio indicators on the right side
 * - "Most Ordered" badges on popular options
 * - Price modifiers aligned right
 * - Smooth selection animations
 */
// Collapse threshold - show first N variants, then "see more" button
const COLLAPSE_THRESHOLD = 4;

export function VariantGroupCard({
  group,
  variants,
  selectedVariantId,
  onSelect,
  className,
}: VariantGroupCardProps) {
  const context = useProductDetailsContext();
  const deliveryType = useDeliveryType();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Collapse logic
  const shouldCollapse = variants.length > COLLAPSE_THRESHOLD;
  const displayedVariants = shouldCollapse && !isExpanded
    ? variants.slice(0, COLLAPSE_THRESHOLD)
    : variants;
  const hiddenCount = variants.length - COLLAPSE_THRESHOLD;

  /**
   * Calculate variant price
   * - For primary variants: use variant.price + variant.packagingCharges for delivery
   * - For sub-variants: lookup in pricing array (no packaging added)
   */
  const calculateVariantPrice = useCallback(
    (variantId: string): number => {
      if (!context.productData) return 0;

      const variant = variants.find((v) => v._id === variantId);
      if (!variant) return 0;

      if (group.isPrimary) {
        // Primary variant: use direct price + variant's packaging charges for delivery
        const variantPackaging = deliveryType === "delivery" ? (variant.packagingCharges || 0) : 0;
        return variant.price + variantPackaging;
      } else {
        // Sub-variant: lookup in pricing array (no packaging - it's already in base)
        const pricing = context.productData.pricing.find(
          (p) =>
            p.type === "variant" &&
            p.variantId === context.selectedVariantId &&
            p.subVariantId === variantId
        );
        return pricing?.price ?? 0;
      }
    },
    [context.productData, context.selectedVariantId, group.isPrimary, variants, deliveryType]
  );

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
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
            {group.label}
          </h3>
          {group.isPrimary && (
            <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
              Required
            </span>
          )}
        </div>
        {group.description && (
          <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
            {group.description}
          </p>
        )}
      </div>

      {/* Variant Options */}
      <div
        role="radiogroup"
        aria-label={`Select ${group.label.toLowerCase()}`}
        aria-required={group.isPrimary}
        className="divide-y divide-border/30"
      >
        {displayedVariants.map((variant, index) => {
          const isSelected = selectedVariantId === variant._id;
          const price = calculateVariantPrice(variant._id);

          return (
            <div
              key={variant._id}
              className={cn(
                "transition-all duration-200 motion-reduce:transition-none",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: isVisible ? `${index * 40}ms` : "0ms" }}
            >
              <VariantOptionRow
                variant={variant}
                price={price}
                isSelected={isSelected}
                isPrimary={group.isPrimary}
                onSelect={() => onSelect(variant._id)}
              />
            </div>
          );
        })}
      </div>

      {/* See More / See Less Button */}
      {shouldCollapse && (
        <div className="px-4 py-3 border-t border-border/30">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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
 * Individual Variant Option Row
 */
interface VariantOptionRowProps {
  variant: VariantResponse;
  price: number;
  isSelected: boolean;
  isPrimary: boolean;
  onSelect: () => void;
}

function VariantOptionRow({
  variant,
  price,
  isSelected,
  isPrimary,
  onSelect,
}: VariantOptionRowProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200",
        "min-h-[60px] touch-manipulation",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50",
        isSelected
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-muted/40 dark:hover:bg-muted/20 active:bg-muted/60",
        "active:scale-[0.995]"
      )}
    >
      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-sm sm:text-base font-medium transition-colors",
            isSelected ? "text-foreground" : "text-foreground/85"
          )}
        >
          {variant.label}
        </span>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right mr-3">
        <span
          className={cn(
            "text-sm sm:text-base font-semibold tabular-nums transition-colors",
            price > 0
              ? isSelected
                ? "text-primary"
                : "text-foreground/80"
              : "text-muted-foreground"
          )}
        >
          {isPrimary
            ? formatPrice(price) // Primary variants show full price
            : price > 0
              ? formatPrice(price, { showSign: true }) // Sub-variants show +price
              : "Included"}
        </span>
      </div>

      {/* Premium Radio Indicator */}
      <div className="shrink-0">
        <div
          className={cn(
            "size-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isSelected
              ? "border-primary bg-primary shadow-md shadow-primary/30 scale-110"
              : "border-border/80 bg-background dark:border-border/60"
          )}
        >
          {isSelected && (
            <div className="animate-in fade-in-0 zoom-in-50 duration-200">
              <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * Horizontal Variant Selector
 * Alternative layout for size/type selections shown as chips
 */
export interface HorizontalVariantSelectorProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

export function HorizontalVariantSelector({
  group,
  variants,
  selectedVariantId,
  onSelect,
  className,
}: HorizontalVariantSelectorProps) {
  const context = useProductDetailsContext();
  const deliveryType = useDeliveryType();

  /**
   * Calculate variant price
   * - For primary variants: use variant.price + variant.packagingCharges for delivery
   * - For sub-variants: lookup in pricing array
   */
  const calculateVariantPrice = useCallback(
    (variantId: string): number => {
      if (!context.productData) return 0;

      const variant = variants.find((v) => v._id === variantId);
      if (!variant) return 0;

      if (group.isPrimary) {
        const variantPackaging = deliveryType === "delivery" ? (variant.packagingCharges || 0) : 0;
        return variant.price + variantPackaging;
      } else {
        const pricing = context.productData.pricing.find(
          (p) =>
            p.type === "variant" &&
            p.variantId === context.selectedVariantId &&
            p.subVariantId === variantId
        );
        return pricing?.price ?? 0;
      }
    },
    [context.productData, context.selectedVariantId, group.isPrimary, variants, deliveryType]
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {group.label}
          {group.isPrimary && (
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              (Required)
            </span>
          )}
        </h3>
      </div>

      {/* Horizontal Chips */}
      <div
        role="radiogroup"
        aria-label={`Select ${group.label.toLowerCase()}`}
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant._id;
          const price = calculateVariantPrice(variant._id);

          return (
            <button
              key={variant._id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(variant._id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5",
                "text-sm font-medium transition-all duration-200",
                "min-h-[44px] touch-manipulation",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "active:scale-95",
                isSelected
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "bg-muted/40 text-foreground hover:bg-muted/70 border border-border/40 dark:bg-muted/30"
              )}
            >
              <span>{variant.label}</span>
              {price > 0 && (
                <span className={cn(
                  "text-xs",
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  +{formatPrice(price, { showCurrency: false })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
