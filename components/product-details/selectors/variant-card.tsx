"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { VariantResponse } from "@/types/product";
import { variantCardVariants } from "@/lib/animations";
import { formatPrice } from "@/lib/utils/currency";

interface VariantCardProps {
  variant: VariantResponse;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

export function VariantCard({
  variant,
  price,
  isSelected,
  onSelect,
  className,
}: VariantCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Simplified variants for reduced motion
  const animationVariants = shouldReduceMotion
    ? {
        unselected: { scale: 1 },
        selected: { scale: 1 },
        hover: { scale: 1 },
      }
    : variantCardVariants;

  return (
    <motion.div
      onClick={onSelect}
      className={cn(
        // Base styles with touch-friendly height
        "relative flex items-center justify-between rounded-xl border cursor-pointer touch-manipulation",
        // Responsive padding and min-height for touch targets
        "p-3 sm:p-4 min-h-[52px] sm:min-h-[56px]",
        // Transitions
        "transition-all duration-200",
        // Hover states (desktop only)
        "sm:hover:border-primary sm:hover:bg-primary/5 sm:hover:shadow-md",
        // Selected state
        isSelected && [
          "border-primary border-2 bg-primary/10",
          "ring-2 ring-primary/20 shadow-sm",
        ],
        // Unselected state
        !isSelected && "border-border bg-background",
        className
      )}
      variants={animationVariants}
      initial="unselected"
      animate={isSelected ? "selected" : "unselected"}
      whileHover="hover"
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <RadioGroupItem
          value={variant._id}
          id={`variant-${variant._id}`}
          className="shrink-0"
        />
        <label
          htmlFor={`variant-${variant._id}`}
          className="cursor-pointer font-medium text-sm sm:text-base text-foreground truncate"
        >
          {variant.label}
        </label>
      </div>
      {price > 0 && (
        <span className="text-sm sm:text-base font-semibold text-primary shrink-0 ml-2">
          {formatPrice(price, { showSign: true })}
        </span>
      )}
    </motion.div>
  );
}
