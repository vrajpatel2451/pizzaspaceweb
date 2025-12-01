"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const [prevPrice, setPrevPrice] = React.useState(totalPrice);

  const hasDiscount = originalPrice && originalPrice > totalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - totalPrice) / originalPrice) * 100)
    : 0;

  // Track price changes for animation direction
  const priceDirection = totalPrice > prevPrice ? "up" : "down";

  React.useEffect(() => {
    setPrevPrice(totalPrice);
  }, [totalPrice]);

  const handleAddToCart = async () => {
    if (!isValid || isLoading) return;
    await onAddToCart();
  };

  // Animation variants
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
      },
    },
  };

  const priceVariants = {
    enter: (direction: string) => ({
      y: direction === "up" ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30,
      },
    },
    exit: (direction: string) => ({
      y: direction === "up" ? -20 : 20,
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    }),
  };


  return (
    <motion.div
      className={cn(
        // Positioning
        "sticky bottom-[5%] lg:bottom-0 left-0 right-0 z-50",
        // Background with blur
        "bg-background/80 backdrop-blur-xl border-t border-border/40",
        // Safe area for notched phones
        "pb-[env(safe-area-inset-bottom)]",
        // Shadow
        "shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.3)]",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
              size="sm"
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
                <div className="flex flex-col items-end leading-tight">
                  <AnimatePresence mode="popLayout" custom={priceDirection}>
                    <motion.span
                      key={totalPrice}
                      custom={priceDirection}
                      variants={shouldReduceMotion ? undefined : priceVariants}
                      initial={shouldReduceMotion ? undefined : "enter"}
                      animate="center"
                      exit={shouldReduceMotion ? undefined : "exit"}
                      className="font-bold"
                    >
                      {formatPrice(totalPrice)}
                    </motion.span>
                  </AnimatePresence>
                  {hasDiscount && (
                    <span className="text-[10px] line-through opacity-70">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </>
            )}
          </Button>
        </div>

        {/* Discount Badge */}
        <AnimatePresence>
          {hasDiscount && discountPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-center"
            >
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-3" />
                You save {discountPercentage}% on this order
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Errors */}
        <AnimatePresence>
          {!isValid && validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1"
              role="alert"
            >
              {validationErrors.map((error, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-xs sm:text-sm text-destructive text-center flex items-center justify-center gap-1"
                >
                  <AlertCircle className="size-3 shrink-0" />
                  {error}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
