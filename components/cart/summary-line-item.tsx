"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryLineItemProps {
  label: string;
  value: number;
  originalValue?: number;
  showDiscount?: boolean;
  hasInfoIcon?: boolean;
  onInfoClick?: () => void;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  testId?: string;
}

/**
 * Premium line item component for order summary
 * Supports strikethrough pricing for discounts and info icon with modal trigger
 */
export function SummaryLineItem({
  label,
  value,
  originalValue,
  showDiscount = false,
  hasInfoIcon = false,
  onInfoClick,
  className,
  labelClassName,
  valueClassName,
  testId,
}: SummaryLineItemProps) {
  const hasDiscount = showDiscount && originalValue !== undefined && originalValue !== value && originalValue > value;

  return (
    <div
      className={cn(
        "flex justify-between items-center py-2 transition-colors duration-200",
        className
      )}
      data-testid={testId}
    >
      {/* Label with optional info icon */}
      <div className="flex items-center gap-1.5">
        <span className={cn("text-muted-foreground text-sm", labelClassName)}>
          {label}
        </span>
        {hasInfoIcon && (
          <button
            type="button"
            onClick={onInfoClick}
            className="inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={`More info about ${label}`}
          >
            <Info className="size-3.5" />
          </button>
        )}
      </div>

      {/* Value with optional strikethrough */}
      <div className={cn("flex items-center gap-2", valueClassName)}>
        {hasDiscount && (
          <span className="text-xs text-muted-foreground/60 line-through font-normal">
            {"\u00A3"}{originalValue.toFixed(2)}
          </span>
        )}
        <span
          className={cn(
            "font-medium text-sm tabular-nums",
            hasDiscount && "text-foreground"
          )}
        >
          {"\u00A3"}{value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
