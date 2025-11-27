"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
  precision?: "full" | "half";
  className?: string;
  disabled?: boolean;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      max = 5,
      size = "default",
      showValue = false,
      interactive = false,
      onChange,
      precision = "half",
      className,
      disabled = false,
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const sizeClasses = {
      sm: "size-3.5",
      default: "size-5",
      lg: "size-6",
    };

    const textSizes = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    };

    const displayValue = hoverValue ?? value;

    const handleClick = (starIndex: number, isHalf: boolean) => {
      if (!interactive || disabled) return;
      const newValue = isHalf ? starIndex + 0.5 : starIndex + 1;
      onChange?.(newValue);
    };

    const handleMouseMove = (
      e: React.MouseEvent<HTMLButtonElement>,
      starIndex: number
    ) => {
      if (!interactive || disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isHalf = precision === "half" && x < rect.width / 2;
      setHoverValue(isHalf ? starIndex + 0.5 : starIndex + 1);
    };

    const handleMouseLeave = () => {
      if (!interactive || disabled) return;
      setHoverValue(null);
    };

    const renderStar = (index: number) => {
      const fillPercent = Math.min(100, Math.max(0, (displayValue - index) * 100));

      return (
        <span key={index} className="relative inline-block">
          {interactive && !disabled ? (
            <button
              type="button"
              className="relative focus:outline-none focus:ring-2 focus:ring-primary rounded"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isHalf = precision === "half" && x < rect.width / 2;
                handleClick(index, isHalf);
              }}
              aria-label={`Rate ${index + 1} star${index + 1 !== 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-gray-300 dark:text-gray-600"
                )}
                fill="currentColor"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "text-yellow-400"
                  )}
                  fill="currentColor"
                />
              </span>
            </button>
          ) : (
            <>
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-gray-300 dark:text-gray-600"
                )}
                fill="currentColor"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "text-yellow-400"
                  )}
                  fill="currentColor"
                />
              </span>
            </>
          )}
        </span>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-0.5",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${value} out of ${max} stars`}
      >
        {Array.from({ length: max }, (_, i) => renderStar(i))}
        {showValue && (
          <span
            className={cn(
              "ml-1.5 font-medium text-foreground",
              textSizes[size]
            )}
          >
            {value.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating };
