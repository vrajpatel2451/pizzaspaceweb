"use client";

import * as React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { VariantResponse } from "@/types/product";
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
  return (
    <div
      onClick={onSelect}
      className={cn(
        // Base styles with touch-friendly height
        "relative flex items-center justify-between rounded-xl border cursor-pointer touch-manipulation",
        // Responsive padding and min-height for touch targets
        "p-3 sm:p-4 min-h-[52px] sm:min-h-[56px]",
        // Transitions
        "transition-all duration-200 motion-reduce:transition-none",
        // Hover states (desktop only)
        "sm:hover:border-primary sm:hover:bg-primary/5 sm:hover:shadow-md sm:hover:-translate-y-0.5",
        "motion-reduce:sm:hover:translate-y-0",
        // Selected state
        isSelected && [
          "border-primary border-2 bg-primary/10",
          "ring-2 ring-primary/20 shadow-sm",
        ],
        // Unselected state
        !isSelected && "border-border bg-background",
        // Tap effect
        "active:scale-[0.98] motion-reduce:active:scale-100",
        className
      )}
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
    </div>
  );
}
