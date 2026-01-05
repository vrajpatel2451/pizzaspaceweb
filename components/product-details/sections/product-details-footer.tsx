"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { useDeliveryType } from "@/store/cart-store";
import type { AddToCartSectionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/currency";

export function ProductDetailsFooter({
  isLoading,
  className,
}: Omit<AddToCartSectionProps, 'onAddToCart'>) {
  const context = useProductDetailsContext();
  const deliveryType = useDeliveryType();
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");
  const [priceKey, setPriceKey] = useState(0);

  // Get selected primary variant for packaging charges
  const selectedPrimaryVariant = context.productData?.variantList.find(
    (v) => v._id === context.selectedVariantId
  );

  // Simple pricing: if delivery, add packaging charges per item
  // Use variant's packaging if available, otherwise fall back to product's
  const packagingTotal = deliveryType === "delivery"
    ? (selectedPrimaryVariant?.packagingCharges ?? context.productData?.product.packagingCharges ?? 0) * context.quantity
    : 0;
  const displayTotal = context.totalPrice + packagingTotal;

  const [prevPrice, setPrevPrice] = useState(displayTotal);

  // Track price changes for animation
  useEffect(() => {
    if (displayTotal !== prevPrice) {
      setPriceKey((k) => k + 1);
      setPrevPrice(displayTotal);
    }
  }, [displayTotal, prevPrice]);

  // Handle button click with animation states
  const handleAddToCart = async () => {
    if (!context.isValid || isLoading) return;

    setButtonState("loading");

    try {
      await context.addToCart();
      setButtonState("success");

      // Reset to idle after success animation
      setTimeout(() => {
        setButtonState("idle");
      }, 1500);
    } catch {
      setButtonState("idle");
    }
  };

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10",
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        // Responsive padding with safe area support
        "p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-[calc(1rem+env(safe-area-inset-bottom))]",
        "shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quantity Selector */}
        <div className="shrink-0">
          <QuantityIncrementor
            value={context.quantity}
            onChange={context.setQuantity}
            min={1}
            max={99}
            size="default"
            className="min-h-[44px]"
          />
        </div>

        {/* Price Display - Just the total, no breakdown */}
        <div className="flex-1 min-w-0">
          <span
            key={priceKey}
            className={cn(
              "text-xl sm:text-2xl font-bold text-primary truncate block",
              "transition-all duration-200 motion-reduce:transition-none",
              priceKey > 0 && "animate-in fade-in-0 slide-in-from-top-2"
            )}
            role="status"
            aria-live="polite"
          >
            {formatPrice(displayTotal)}
          </span>
        </div>

        {/* Add to Cart Button - Responsive sizing */}
        <div
          className={cn(
            "shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            "hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
            "motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
          )}
        >
          <Button
            onClick={handleAddToCart}
            disabled={!context.isValid || isLoading}
            aria-busy={buttonState === "loading"}
            aria-disabled={!context.isValid || isLoading}
            aria-label={
              buttonState === "loading"
                ? "Adding to cart"
                : buttonState === "success"
                ? "Added to cart successfully"
                : "Add to cart"
            }
            className={cn(
              "shrink-0 min-h-[44px] sm:min-h-[48px]",
              "text-sm sm:text-base",
              "px-4 sm:px-6",
              "transition-colors duration-300",
              buttonState === "success" && "bg-green-500 hover:bg-green-600"
            )}
            size="lg"
          >
            {buttonState === "loading" ? (
              <span className="flex items-center gap-2 animate-in fade-in-0 duration-200">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </span>
            ) : buttonState === "success" ? (
              <span className="flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                    className="animate-draw-check"
                  />
                </svg>
                <span className="hidden sm:inline">Added!</span>
              </span>
            ) : (
              <span className="animate-in fade-in-0 duration-200">
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Error Messages */}
      {!context.isValid && context.validationErrors.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="mt-2 space-y-1 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          {context.validationErrors.map((error, index) => (
            <p
              key={index}
              className="text-xs sm:text-sm text-destructive text-center animate-in fade-in-0 slide-in-from-left-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {error}
            </p>
          ))}
        </div>
      )}

      {/* CSS for checkmark animation */}
      <style jsx>{`
        @keyframes draw-check {
          from {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
          }
          to {
            stroke-dasharray: 24;
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-check {
          animation: draw-check 0.3s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-draw-check {
            animation: none;
            stroke-dasharray: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
