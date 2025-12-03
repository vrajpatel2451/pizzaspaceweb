"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantityPillProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

const sizeConfig = {
  sm: {
    container: "h-8 rounded-lg gap-1 px-1",
    button: "size-7 min-w-[28px] min-h-[28px]",
    value: "w-7 text-sm",
    icon: "size-3.5",
  },
  default: {
    container: "h-9 rounded-lg gap-2 px-1",
    button: "size-8 min-w-[32px] min-h-[32px]",
    value: "w-8 text-base",
    icon: "size-4",
  },
  lg: {
    container: "h-10 rounded-lg gap-2 px-1.5",
    button: "size-9 min-w-[36px] min-h-[36px]",
    value: "w-9 text-lg",
    icon: "size-4.5",
  },
};

const variantConfig = {
  primary: {
    container: "bg-orange-500 text-white shadow-sm",
    button: "hover:bg-white/10 active:bg-white/20",
    buttonDisabled: "opacity-50",
  },
  secondary: {
    container: "bg-primary text-primary-foreground shadow-sm",
    button: "hover:bg-primary-foreground/10 active:bg-primary-foreground/20",
    buttonDisabled: "opacity-50",
  },
  outline: {
    container: "bg-background border border-border text-foreground shadow-sm",
    button: "hover:bg-accent active:bg-accent/80",
    buttonDisabled: "opacity-50",
  },
};

/**
 * Premium Quantity Pill Component
 *
 * Zomato/Swiggy style quantity counter with clean, compact design,
 * subtle animations, and smooth interactions.
 * Supports primary (solid orange), secondary, and outline variants.
 */
export const QuantityPill = React.forwardRef<HTMLDivElement, QuantityPillProps>(
  (
    {
      value,
      onChange,
      min = 1,
      max = 99,
      disabled = false,
      className,
      size = "default",
      variant = "primary",
    },
    ref
  ) => {
    const [direction, setDirection] = useState<"up" | "down">("up");
    const [valueKey, setValueKey] = useState(0);
    const sizes = sizeConfig[size];
    const variants = variantConfig[variant];

    const handleDecrement = () => {
      if (value > min && !disabled) {
        setDirection("down");
        setValueKey((k) => k + 1);
        onChange(value - 1);
      }
    };

    const handleIncrement = () => {
      if (value < max && !disabled) {
        setDirection("up");
        setValueKey((k) => k + 1);
        onChange(value + 1);
      }
    };

    const canDecrement = value > min && !disabled;
    const canIncrement = value < max && !disabled;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center overflow-hidden",
          "touch-manipulation select-none",
          sizes.container,
          variants.container,
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        role="group"
        aria-label="Quantity selector"
      >
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0",
            "active:scale-[0.92] motion-reduce:active:scale-100",
            sizes.button,
            variants.button,
            !canDecrement && variants.buttonDisabled
          )}
          aria-label="Decrease quantity"
          aria-disabled={!canDecrement}
        >
          <Minus className={sizes.icon} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Value Display with Animation */}
        <div
          className={cn(
            "relative flex items-center justify-center font-bold tabular-nums",
            sizes.value
          )}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            key={valueKey}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-all duration-200 motion-reduce:transition-none",
              valueKey > 0 && (direction === "up"
                ? "animate-in fade-in-0 slide-in-from-bottom-2"
                : "animate-in fade-in-0 slide-in-from-top-2")
            )}
          >
            {value}
          </span>
          {/* Invisible spacer for consistent width */}
          <span className="invisible" aria-hidden="true">
            {value}
          </span>
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0",
            "active:scale-[0.92] motion-reduce:active:scale-100",
            sizes.button,
            variants.button,
            !canIncrement && variants.buttonDisabled
          )}
          aria-label="Increase quantity"
          aria-disabled={!canIncrement}
        >
          <Plus className={sizes.icon} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    );
  }
);

QuantityPill.displayName = "QuantityPill";

/**
 * Compact Quantity Pill for inline use (e.g., in addon rows)
 */
export const CompactQuantityPill = React.forwardRef<
  HTMLDivElement,
  Omit<QuantityPillProps, "size" | "variant">
>((props, ref) => {
  return <QuantityPill ref={ref} {...props} size="sm" variant="outline" />;
});

CompactQuantityPill.displayName = "CompactQuantityPill";
