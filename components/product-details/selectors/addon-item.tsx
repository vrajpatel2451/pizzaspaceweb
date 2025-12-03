"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import type { AddonOptionProps } from "@/types/product-details";
import { cn } from "@/lib/utils";
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

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;
    onSelect(checked ? 1 : 0);
  };

  const handleQuantityChange = (newQuantity: number) => {
    onSelect(newQuantity);
  };

  return (
    <div
      className={cn(
        // Base styles with touch-friendly height
        "flex items-center justify-between rounded-lg border touch-manipulation",
        // Responsive padding and min-height for touch targets
        "p-3 sm:p-3.5 min-h-[52px] sm:min-h-[56px]",
        // Transitions
        "transition-all duration-200 motion-reduce:transition-none",
        // Selected state
        isSelected && "border-primary/50 bg-primary/5",
        // Unselected state
        !isSelected && "border-border bg-background",
        // Hover state (desktop only)
        "sm:hover:bg-muted/50",
        // Tap effect
        "active:scale-[0.99] motion-reduce:active:scale-100",
        className
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div
          className={cn(
            "transition-transform duration-200 motion-reduce:transition-none",
            isSelected && "scale-110"
          )}
        >
          <Checkbox
            id={`addon-${addon._id}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="shrink-0"
          />
        </div>
        <label
          htmlFor={`addon-${addon._id}`}
          className="cursor-pointer text-sm sm:text-base font-medium text-foreground truncate"
        >
          {addon.label}
        </label>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quantity Incrementor (only for allowMulti) */}
        {allowMulti && isSelected && (
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-200">
            <QuantityIncrementor
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={maxQuantity}
              size="sm"
              className="min-w-[88px] sm:min-w-[96px]"
            />
          </div>
        )}

        {/* Price Display */}
        <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap min-w-[60px] text-right">
          {formatPrice(price, { showSign: true })}
        </span>
      </div>
    </div>
  );
}
