"use client";

import React from "react";
import { OrderDeliveryType } from "@/types/cart";
import { calculateDisplayPrice, formatPrice } from "@/lib/utils/price";
import { cn } from "@/lib/utils";

/**
 * Size variants for the price display
 * - sm: Compact size for cards and list items
 * - md: Default size for general use
 * - lg: Large size for primary CTAs and action bars
 */
type PriceSize = "sm" | "md" | "lg";

export interface PriceDisplayProps {
  /**
   * Base price of the product in pounds
   */
  basePrice: number;

  /**
   * Additional packaging charges in pounds
   * Only applied for delivery orders
   */
  packagingCharges?: number;

  /**
   * Type of delivery/order
   * Packaging charges are only added for "delivery" type
   */
  deliveryType: OrderDeliveryType;

  /**
   * Whether to show price breakdown
   * When true, displays base price + packaging charges separately
   */
  showBreakdown?: boolean;

  /**
   * Size variant for typography scaling
   * @default "md"
   */
  size?: PriceSize;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Whether to animate price changes
   * @default true
   */
  animate?: boolean;
}

/**
 * Size-specific typography configuration
 */
const SIZE_CONFIG: Record<
  PriceSize,
  {
    total: string;
    breakdown: string;
    packaging: string;
  }
> = {
  sm: {
    total: "text-base font-bold",
    breakdown: "text-sm font-medium",
    packaging: "text-[10px] font-medium",
  },
  md: {
    total: "text-xl sm:text-2xl font-bold",
    breakdown: "text-base sm:text-lg font-semibold",
    packaging: "text-xs font-medium",
  },
  lg: {
    total: "text-2xl sm:text-3xl font-bold",
    breakdown: "text-lg sm:text-xl font-semibold",
    packaging: "text-sm font-medium",
  },
};

/**
 * Price Display Component for Phase 3.2
 *
 * A reusable component for showing price with optional packaging breakdown.
 * Automatically calculates total price based on delivery type and packaging charges.
 *
 * Features:
 * - Automatic price calculation using price utilities
 * - Conditional packaging charge display for delivery orders
 * - Multiple size variants (sm, md, lg)
 * - Optional animated price transitions
 * - Accessible price information with ARIA labels
 * - Mobile-responsive typography
 *
 * @example
 * ```tsx
 * // Simple usage
 * <PriceDisplay
 *   basePrice={12.50}
 *   deliveryType="pickup"
 * />
 *
 * // With packaging breakdown
 * <PriceDisplay
 *   basePrice={12.50}
 *   packagingCharges={0.50}
 *   deliveryType="delivery"
 *   showBreakdown
 * />
 *
 * // Large size for CTA
 * <PriceDisplay
 *   basePrice={15.00}
 *   deliveryType="dineIn"
 *   size="lg"
 * />
 * ```
 */
export function PriceDisplay({
  basePrice,
  packagingCharges = 0,
  deliveryType,
  showBreakdown = false,
  size = "md",
  className,
  animate = true,
}: PriceDisplayProps) {
  // Calculate total price using the price utility
  const totalPrice = calculateDisplayPrice(basePrice, packagingCharges, deliveryType);

  // Determine if packaging should be shown
  const shouldShowPackaging =
    showBreakdown && deliveryType === "delivery" && packagingCharges > 0;

  // Get size-specific styles
  const sizeStyles = SIZE_CONFIG[size];

  // Simple animation trigger using price as key
  // This will re-mount the element when price changes, triggering animations
  const animationKey = animate ? totalPrice.toFixed(2) : "static";

  // Create accessible label for screen readers
  const accessibleLabel = shouldShowPackaging
    ? `Total price ${formatPrice(totalPrice)}, including ${formatPrice(basePrice)} base price and ${formatPrice(packagingCharges)} packaging charge`
    : `Price ${formatPrice(totalPrice)}`;

  return (
    <div
      className={cn("flex flex-col gap-0.5", className)}
      role="region"
      aria-label={accessibleLabel}
    >
      {/* Total Price */}
      <div
        key={animationKey}
        className={cn(
          "text-orange-500 dark:text-orange-400",
          sizeStyles.total,
          animate && "animate-count-up"
        )}
        aria-live="polite"
      >
        {formatPrice(totalPrice)}
      </div>

      {/* Breakdown: Base Price + Packaging */}
      {shouldShowPackaging && (
        <div
          key={`breakdown-${animationKey}`}
          className={cn(
            "flex items-baseline gap-1 text-muted-foreground",
            sizeStyles.packaging,
            animate && "animate-fade-in animation-delay-100"
          )}
          aria-hidden="true"
        >
          <span className="line-clamp-1">
            {formatPrice(basePrice)}
          </span>
          <span className="text-[10px] opacity-60">+</span>
          <span className="line-clamp-1">
            {formatPrice(packagingCharges)} packaging
          </span>
        </div>
      )}

      {/* Screen reader only detailed breakdown */}
      {shouldShowPackaging && (
        <span className="sr-only">
          Base price: {formatPrice(basePrice)}, Packaging: {formatPrice(packagingCharges)}
        </span>
      )}
    </div>
  );
}

/**
 * Compact Price Display Variant
 *
 * A simplified version without breakdown, optimized for tight spaces.
 * Always uses "sm" size and removes breakdown option.
 *
 * @example
 * ```tsx
 * <CompactPriceDisplay
 *   basePrice={12.50}
 *   packagingCharges={0.50}
 *   deliveryType="delivery"
 * />
 * ```
 */
export function CompactPriceDisplay({
  basePrice,
  packagingCharges = 0,
  deliveryType,
  className,
}: Omit<PriceDisplayProps, "showBreakdown" | "size" | "animate">) {
  return (
    <PriceDisplay
      basePrice={basePrice}
      packagingCharges={packagingCharges}
      deliveryType={deliveryType}
      size="sm"
      showBreakdown={false}
      animate={false}
      className={className}
    />
  );
}
