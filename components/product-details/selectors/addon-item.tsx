"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import type { AddonOptionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";
import {
  addonCheckboxVariants,
  addonQuantityVariants,
} from "@/lib/animations";
import { formatPrice } from "@/lib/utils/currency";

export function AddonItem({
  addon,
  quantity,
  price,
  allowMulti,
  maxQuantity,
  onSelect,
  className,
}: AddonOptionProps) {
  const isSelected = quantity > 0;
  const shouldReduceMotion = useReducedMotion();

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;
    onSelect(checked ? 1 : 0);
  };

  const handleQuantityChange = (newQuantity: number) => {
    onSelect(newQuantity);
  };

  // Simplified variants for reduced motion
  const checkboxAnimationVariants = shouldReduceMotion
    ? { unchecked: { scale: 1 }, checked: { scale: 1 } }
    : addonCheckboxVariants;

  const quantityAnimationVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : addonQuantityVariants;

  return (
    <motion.div
      className={cn(
        // Base styles with touch-friendly height
        "flex items-center justify-between rounded-lg border touch-manipulation",
        // Responsive padding and min-height for touch targets
        "p-3 sm:p-3.5 min-h-[52px] sm:min-h-[56px]",
        // Transitions
        "transition-all duration-200",
        // Selected state
        isSelected && "border-primary/50 bg-primary/5",
        // Unselected state
        !isSelected && "border-border bg-background",
        // Hover state (desktop only)
        "sm:hover:bg-muted/50",
        className
      )}
      initial={false}
      animate={{
        backgroundColor: isSelected
          ? "hsl(var(--primary) / 0.05)"
          : "transparent",
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.99 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <motion.div
          variants={checkboxAnimationVariants}
          initial="unchecked"
          animate={isSelected ? "checked" : "unchecked"}
        >
          <Checkbox
            id={`addon-${addon._id}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="shrink-0"
          />
        </motion.div>
        <label
          htmlFor={`addon-${addon._id}`}
          className="cursor-pointer text-sm sm:text-base font-medium text-foreground truncate"
        >
          {addon.label}
        </label>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Animated Quantity Incrementor (only for allowMulti) */}
        <AnimatePresence mode="wait">
          {allowMulti && isSelected && (
            <motion.div
              key="quantity"
              variants={quantityAnimationVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <QuantityIncrementor
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={maxQuantity}
                size="sm"
                className="min-w-[88px] sm:min-w-[96px]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Display */}
        <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap min-w-[60px] text-right">
          {formatPrice(price, { showSign: true })}
        </span>
      </div>
    </motion.div>
  );
}
