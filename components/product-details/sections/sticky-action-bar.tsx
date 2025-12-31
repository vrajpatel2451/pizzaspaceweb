"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShoppingBag, AlertCircle, Check } from "lucide-react";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

export interface StickyActionBarProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  totalPrice: number;
  originalPrice?: number;
  isValid: boolean;
  validationErrors?: string[];
  isLoading?: boolean;
  onAddToCart: () => void | Promise<void>;
  className?: string;
  editMode?: "add" | "edit";
}

/**
 * Premium Sticky Action Bar Component
 *
 * Zomato/Swiggy style sticky bottom CTA with:
 * - Backdrop blur effect
 * - QuantityPill on the left
 * - "Add item - $XX.XX" CTA button on the right
 * - Animated price changes
 * - Success animation on add
 * - Safe area padding for notched phones
 * - Validation error display
 */
export function StickyActionBar({
  quantity,
  onQuantityChange,
  totalPrice,
  originalPrice,
  isValid,
  validationErrors = [],
  isLoading = false,
  onAddToCart,
  className,
  editMode = "add",
}: StickyActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  const hasDiscount = originalPrice && originalPrice > totalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - totalPrice) / originalPrice) * 100)
    : 0;

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleAddToCart = async () => {
    if (isLoading) return;

    // Show toast for validation errors
    if (!isValid && validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    if (!isValid) return;
    await onAddToCart();
  };

  return (
    <div
      className={cn(
        // Positioning
        "sticky bottom-[5%] lg:bottom-0 left-0 right-0 z-50",
        // Background with blur
        "bg-background/80 backdrop-blur-xl border-t border-border/40",
        // Safe area for notched phones
        "pb-[env(safe-area-inset-bottom)]",
        // Shadow
        "shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.3)]",
        // Animation
        "transition-all duration-300 motion-reduce:transition-none",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
        className
      )}
    >
      {/* Main Content */}
      <div className="px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Quantity Selector */}
          <div className="shrink-0">
            <QuantityIncrementor
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={10}
              size="lg"
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={!isValid}
            loading={isLoading}
            className={cn(
              // Base styles
              "flex-1 min-h-[44px] sm:min-h-[48px]",
              "rounded-full py-3 px-4 sm:py-3.5 sm:px-6",
              "text-sm sm:text-base font-semibold",
              // Custom gradient background
              "bg-gradient-to-r from-orange-500 to-orange-600",
              "hover:from-orange-600 hover:to-orange-700",
              "shadow-lg shadow-orange-500/30",
              // Disabled state
              "disabled:opacity-60"
            )}
            size="lg"
          >
            {isLoading ? (
              <span className="hidden sm:inline">
                {editMode === "edit" ? "Updating..." : "Adding..."}
              </span>
            ) : (
              <>
                <ShoppingBag className="size-5" />
                <span>{editMode === "edit" ? "Update cart" : "Add item"}</span>
                <span className="mx-1 opacity-60">-</span>
                <span className="font-bold">{formatPrice(totalPrice)}</span>
              </>
            )}
          </Button>
        </div>

        {/* Discount Badge */}
        {hasDiscount && discountPercentage > 0 && (
          <div
            className={cn(
              "mt-2 text-center overflow-hidden transition-all duration-200 motion-reduce:transition-none",
              hasDiscount ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3" />
              You save {discountPercentage}% on this order
            </span>
          </div>
        )}

        {/* Validation Errors */}
        {!isValid && validationErrors.length > 0 && (
          <div
            className={cn(
              "mt-2 space-y-1 overflow-hidden transition-all duration-200 motion-reduce:transition-none",
              validationErrors.length > 0 ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            )}
            role="alert"
          >
            {validationErrors.map((error, index) => (
              <p
                key={index}
                className={cn(
                  "text-xs sm:text-sm text-destructive text-center flex items-center justify-center gap-1",
                  "animate-in fade-in-0 slide-in-from-left-2 duration-200"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AlertCircle className="size-3 shrink-0" />
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
