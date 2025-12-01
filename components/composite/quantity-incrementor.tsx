"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantityIncrementorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

const QuantityIncrementor = React.forwardRef<
  HTMLDivElement,
  QuantityIncrementorProps
>(
  (
    {
      value,
      onChange,
      min = 1,
      max = 99,
      step = 1,
      disabled = false,
      className,
      size = "default",
    },
    ref
  ) => {
    const handleDecrement = () => {
      if (value > min) {
        onChange(Math.max(min, value - step));
      }
    };

    const handleIncrement = () => {
      if (value < max) {
        onChange(Math.min(max, value + step));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (!isNaN(newValue)) {
        onChange(Math.min(max, Math.max(min, newValue)));
      }
    };

    const sizeClasses = {
      sm: {
        container: "h-8",
        button: "w-8 h-8",
        input: "w-10 text-sm",
        icon: "size-3",
      },
      default: {
        container: "h-11",
        button: "w-11 h-11",
        input: "w-12 text-base",
        icon: "size-4",
      },
      lg: {
        container: "h-12",
        button: "w-12 h-12",
        input: "w-14 text-lg",
        icon: "size-5",
      },
    };

    const sizes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-lg border border-input bg-background",
          sizes.container,
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={cn(
            "flex items-center justify-center rounded-l-lg border-r border-input transition-colors",
            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
            "cursor-pointer",
            sizes.button
          )}
          aria-label="Decrease quantity"
        >
          <Minus className={cn(sizes.icon, "text-foreground")} />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            "text-center font-semibold bg-transparent border-none outline-none",
            "focus:ring-0 disabled:cursor-not-allowed",
            sizes.input
          )}
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(
            "flex items-center justify-center rounded-r-lg border-l border-input transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
            "cursor-pointer",
            sizes.button
          )}
          aria-label="Increase quantity"
        >
          <Plus className={cn(sizes.icon)} />
        </button>
      </div>
    );
  }
);

QuantityIncrementor.displayName = "QuantityIncrementor";

export { QuantityIncrementor };
