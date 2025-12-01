"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/product";

export interface ProductTypeBadgeProps {
  type: ProductType;
  className?: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  animate?: boolean;
  variant?: "pill" | "square";
}

const typeConfig: Record<ProductType, {
  label: string;
  shortLabel: string;
  dotColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}> = {
  veg: {
    label: "Vegetarian",
    shortLabel: "Veg",
    dotColor: "bg-emerald-500 dark:bg-emerald-400",
    borderColor: "border-emerald-500 dark:border-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  non_veg: {
    label: "Non-Vegetarian",
    shortLabel: "Non-Veg",
    dotColor: "bg-red-500 dark:bg-red-400",
    borderColor: "border-red-500 dark:border-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
  },
  vegan: {
    label: "Vegan",
    shortLabel: "Vegan",
    dotColor: "bg-green-600 dark:bg-green-500",
    borderColor: "border-green-600 dark:border-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
  },
};

const sizeConfig = {
  sm: {
    pill: "px-1.5 py-0.5 gap-1 text-[10px]",
    square: "size-3.5",
    dot: "size-1.5",
    innerDot: "size-1",
  },
  default: {
    pill: "px-2 py-1 gap-1.5 text-xs",
    square: "size-4",
    dot: "size-2",
    innerDot: "size-1.5",
  },
  lg: {
    pill: "px-2.5 py-1.5 gap-2 text-sm",
    square: "size-5",
    dot: "size-2.5",
    innerDot: "size-2",
  },
};

/**
 * Premium Veg/Non-veg badge component inspired by Zomato/Swiggy
 * Supports both pill (with label) and square (icon only) variants
 */
export function ProductTypeBadge({
  type,
  className,
  size = "default",
  showLabel = true,
  animate = true,
  variant = "pill",
}: ProductTypeBadgeProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = typeConfig[type];
  const sizes = sizeConfig[size];

  // Square indicator icon (Zomato style)
  const squareIndicator = (
    <span
      className={cn(
        "flex items-center justify-center shrink-0 rounded border-[1.5px]",
        sizes.square,
        config.borderColor,
        "bg-white dark:bg-gray-900"
      )}
    >
      <span
        className={cn(
          "rounded-full",
          sizes.innerDot,
          config.dotColor
        )}
      />
    </span>
  );

  // Square-only variant (compact indicator)
  if (variant === "square") {
    return (
      <span
        className={cn("inline-block", className)}
        title={config.label}
        aria-label={config.label}
        role="img"
      >
        {squareIndicator}
      </span>
    );
  }

  // Pill variant with label
  const pillContent = (
    <>
      {squareIndicator}
      {showLabel && (
        <span className={cn("whitespace-nowrap font-medium", config.textColor)}>
          {config.shortLabel}
        </span>
      )}
    </>
  );

  const pillClasses = cn(
    // Base styles
    "inline-flex items-center rounded-full",
    // Border
    "border",
    config.borderColor + "/40",
    // Background
    config.bgColor,
    // Size
    sizes.pill,
    className
  );

  if (!animate || shouldReduceMotion) {
    return (
      <span className={pillClasses} role="img" aria-label={config.label}>
        {pillContent}
      </span>
    );
  }

  return (
    <motion.span
      className={pillClasses}
      role="img"
      aria-label={config.label}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      {pillContent}
    </motion.span>
  );
}

/**
 * Compact square indicator only (for inline use in lists)
 */
export function ProductTypeIndicator({
  type,
  className,
  size = "default",
}: Pick<ProductTypeBadgeProps, "type" | "className" | "size">) {
  const config = typeConfig[type];
  const sizes = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 rounded border-[1.5px]",
        sizes.square,
        config.borderColor,
        "bg-white dark:bg-gray-900",
        className
      )}
      title={config.label}
      aria-label={config.label}
      role="img"
    >
      <span
        className={cn(
          "rounded-full",
          sizes.innerDot,
          config.dotColor
        )}
      />
    </span>
  );
}
