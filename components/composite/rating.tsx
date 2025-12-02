"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    const [lastSelectedIndex, setLastSelectedIndex] = React.useState<number | null>(null);

    const sizeClasses = {
      sm: "size-3.5",
      default: "size-5",
      lg: "size-7",
    };

    // Touch target sizes for interactive buttons (min 44x44px for accessibility)
    const touchTargetClasses = {
      sm: "min-w-[32px] min-h-[32px]",
      default: "min-w-[40px] min-h-[40px]",
      lg: "min-w-[44px] min-h-[44px]",
    };

    const textSizes = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    };

    const containerGap = {
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-1.5",
    };

    const displayValue = hoverValue ?? value;

    const handleClick = (starIndex: number, isHalf: boolean) => {
      if (!interactive || disabled) return;
      const newValue = isHalf ? starIndex + 0.5 : starIndex + 1;
      setLastSelectedIndex(starIndex);
      onChange?.(newValue);
      // Clear animation trigger after animation completes
      setTimeout(() => setLastSelectedIndex(null), 400);
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
      const isHovered = hoverValue !== null && index < Math.ceil(hoverValue);
      const isFilled = fillPercent > 0;
      const wasJustSelected = lastSelectedIndex === index;

      const starContent = (
        <>
          <Star
            className={cn(
              sizeClasses[size],
              "text-gray-200 dark:text-gray-700 transition-colors duration-200"
            )}
            fill="currentColor"
          />
          <span
            className="absolute inset-0 overflow-hidden transition-all duration-200"
            style={{ width: `${fillPercent}%` }}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? "text-amber-400" : "text-gray-200 dark:text-gray-700",
                "drop-shadow-sm transition-colors duration-200"
              )}
              fill="currentColor"
            />
          </span>
        </>
      );

      return (
        <motion.span
          key={index}
          className="relative inline-block"
          initial={false}
          animate={{
            scale: wasJustSelected ? [1, 1.3, 1] : isHovered ? 1.15 : 1,
            rotate: wasJustSelected ? [0, -10, 10, 0] : 0,
          }}
          transition={{
            scale: wasJustSelected
              ? { duration: 0.4, ease: "easeOut" }
              : { duration: 0.15, ease: "easeOut" },
            rotate: wasJustSelected
              ? { duration: 0.4, ease: "easeOut" }
              : { duration: 0.1 },
          }}
        >
          {interactive && !disabled ? (
            <button
              type="button"
              className={cn(
                "relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm cursor-pointer",
                "transition-transform duration-150 ease-out flex items-center justify-center",
                touchTargetClasses[size],
                isHovered && "drop-shadow-md"
              )}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isHalf = precision === "half" && x < rect.width / 2;
                handleClick(index, isHalf);
              }}
              aria-label={`Rate ${index + 1} out of ${max} stars`}
              aria-pressed={fillPercent > 0}
            >
              {starContent}
            </button>
          ) : (
            starContent
          )}
        </motion.span>
      );
    };

    // Get rating label text
    const getRatingLabel = (val: number): string => {
      if (val === 0) return "Select rating";
      if (val <= 1) return "Poor";
      if (val <= 2) return "Fair";
      if (val <= 3) return "Good";
      if (val <= 4) return "Very Good";
      return "Excellent";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center",
          containerGap[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        role={interactive ? "group" : "img"}
        aria-label={interactive ? `Rate from 1 to ${max} stars. Current rating: ${value} stars` : `Rating: ${value} out of ${max} stars`}
      >
        <div className={cn("inline-flex items-center", containerGap[size])}>
          {Array.from({ length: max }, (_, i) => renderStar(i))}
        </div>
        {showValue && (
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 ml-2"
            >
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  textSizes[size],
                  value > 0 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {value.toFixed(1)}
              </span>
              {interactive && size === "lg" && (
                <span className="text-sm text-muted-foreground">
                  {getRatingLabel(displayValue)}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating };
