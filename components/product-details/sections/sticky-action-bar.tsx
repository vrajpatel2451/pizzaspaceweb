"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, Check, Loader2, AlertCircle } from "lucide-react";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
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
}

type ButtonState = "idle" | "loading" | "success" | "error";

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
}: StickyActionBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const [buttonState, setButtonState] = React.useState<ButtonState>("idle");
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

  // Handle loading state changes
  React.useEffect(() => {
    if (isLoading && buttonState === "idle") {
      setButtonState("loading");
    } else if (!isLoading && buttonState === "loading") {
      setButtonState("success");
      const timer = setTimeout(() => {
        setButtonState("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, buttonState]);

  const handleAddToCart = async () => {
    if (!isValid || buttonState !== "idle") return;

    try {
      setButtonState("loading");
      await onAddToCart();
      setButtonState("success");

      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    } catch {
      setButtonState("error");
      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    }
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

  const buttonContentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Button content based on state
  const renderButtonContent = () => {
    switch (buttonState) {
      case "loading":
        return (
          <motion.div
            key="loading"
            variants={buttonContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="size-5" />
            </motion.div>
            <span className="hidden sm:inline">Adding...</span>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            key="success"
            variants={buttonContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check className="size-5" strokeWidth={3} />
            </motion.div>
            <span className="hidden sm:inline">Added!</span>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            key="error"
            variants={buttonContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <AlertCircle className="size-5" />
            <span className="hidden sm:inline">Failed</span>
          </motion.div>
        );

      default:
        return (
          <motion.div
            key="idle"
            variants={buttonContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="size-5" />
            <span>Add item</span>
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
          </motion.div>
        );
    }
  };

  // Get button styles based on state
  const getButtonStyles = () => {
    switch (buttonState) {
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-emerald-500/30";
      case "error":
        return "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-red-500/30";
      default:
        return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30";
    }
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
          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={!isValid || buttonState !== "idle"}
            className={cn(
              // Base styles
              "flex-1 inline-flex items-center justify-center",
              "rounded-full py-3 px-4 sm:py-3.5 sm:px-6 min-h-[44px] sm:min-h-[48px]",
              "text-sm sm:text-base md:text-lg font-semibold text-white",
              // Shadow
              "shadow-lg",
              // Transitions
              "transition-all duration-200",
              // Focus
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
              // Disabled
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              // State-based colors
              getButtonStyles()
            )}
            whileTap={
              shouldReduceMotion || !isValid || buttonState !== "idle"
                ? undefined
                : { scale: 0.98 }
            }
            aria-busy={buttonState === "loading"}
            aria-disabled={!isValid || buttonState !== "idle"}
          >
            <AnimatePresence mode="wait">
              {renderButtonContent()}
            </AnimatePresence>
          </motion.button>
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
