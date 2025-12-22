"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectionCounterProps {
  current: number;
  max: number;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * Selection Counter Badge
 * Shows "X/Y selected" with visual feedback when limit is reached
 */
export function SelectionCounter({
  current,
  max,
  className,
  variant = "default",
}: SelectionCounterProps) {
  const isAtLimit = current >= max;
  const isNearLimit = current >= max - 1 && current < max;

  if (!Number.isFinite(max) || max <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-xs font-medium tabular-nums transition-colors duration-200",
        variant === "compact" && "px-2 py-0.5 text-[10px]",
        isAtLimit
          ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
          : isNearLimit
            ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
            : "bg-muted text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span>{current}/{max}</span>
      <span className="sr-only">
        {current} of {max} items selected
        {isAtLimit && ". Limit reached."}
      </span>
    </div>
  );
}
