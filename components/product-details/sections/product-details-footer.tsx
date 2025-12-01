"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { AddToCartSectionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";
import {
  priceChangeVariants,
  addToCartButtonVariants,
} from "@/lib/animations";
import { formatPrice } from "@/lib/utils/currency";

export function ProductDetailsFooter({
  isLoading,
  className,
}: Omit<AddToCartSectionProps, 'onAddToCart'>) {
  const context = useProductDetailsContext();
  const shouldReduceMotion = useReducedMotion();
  const [buttonState, setButtonState] = React.useState<"idle" | "loading" | "success">("idle");

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

  // Simplified variants for reduced motion
  const priceAnimationVariants = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : priceChangeVariants;

  const buttonAnimationVariants = shouldReduceMotion
    ? { idle: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 1 }, loading: { scale: 1 }, success: { scale: 1 } }
    : addToCartButtonVariants;

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

        {/* Animated Total Price Display - Responsive sizing */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs sm:text-sm text-muted-foreground">Total</span>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={context.totalPrice}
                variants={priceAnimationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xl sm:text-2xl font-bold text-primary truncate"
              >
                <span className="sr-only">Total price: </span>
                {formatPrice(context.totalPrice)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Animated Add to Cart Button - Responsive sizing */}
        <motion.div
          className="shrink-0"
          variants={buttonAnimationVariants}
          initial="idle"
          animate={buttonState}
          whileHover={!context.isValid || isLoading ? undefined : "hover"}
          whileTap={!context.isValid || isLoading ? undefined : "tap"}
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
              buttonState === "success" && "bg-green-500 hover:bg-green-600"
            )}
            size="lg"
          >
            <AnimatePresence mode="wait">
              {buttonState === "loading" ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="hidden sm:inline">Adding...</span>
                </motion.span>
              ) : buttonState === "success" ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <span className="hidden sm:inline">Added!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      {/* Animated Validation Error Messages */}
      <AnimatePresence>
        {!context.isValid && context.validationErrors.length > 0 && (
          <motion.div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 space-y-1 overflow-hidden"
          >
            {context.validationErrors.map((error, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-xs sm:text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
