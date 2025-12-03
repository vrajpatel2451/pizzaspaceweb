"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { MessageSquare, Info, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CookingRequestSectionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  placeholder?: string;
  quickChips?: string[];
}

const DEFAULT_QUICK_CHIPS = [
  "No onion",
  "No garlic",
  "Less spicy",
  "Extra spicy",
  "No salt",
  "Less oil",
  "No mushrooms",
  "Extra crispy",
];

/**
 * Premium Cooking Request Section
 *
 * Special instructions input with:
 * - "Add a cooking request (optional)" header with info icon
 * - Textarea with placeholder and animated focus state
 * - Character count with color indicators
 * - Quick chips that toggle text in textarea
 * - Smooth animations throughout
 */
export function CookingRequestSection({
  value,
  onChange,
  maxLength = 200,
  className,
  placeholder = "E.g., Please make it less spicy, no onions...",
  quickChips = DEFAULT_QUICK_CHIPS,
}: CookingRequestSectionProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Track which chips are active based on textarea content
  const activeChips = useMemo(() => {
    const active = new Set<string>();
    if (!value) return active;

    quickChips.forEach((chip) => {
      // Case-insensitive check
      if (value.toLowerCase().includes(chip.toLowerCase())) {
        active.add(chip);
      }
    });
    return active;
  }, [value, quickChips]);

  // Toggle chip in textarea
  const handleChipClick = (chip: string) => {
    const isActive = activeChips.has(chip);

    if (isActive) {
      // Remove chip from text (handle various separators)
      const patterns = [
        new RegExp(`\\s*,\\s*${chip}`, "gi"),
        new RegExp(`${chip}\\s*,\\s*`, "gi"),
        new RegExp(`${chip}`, "gi"),
      ];
      let newValue = value;
      patterns.forEach((pattern) => {
        newValue = newValue.replace(pattern, "");
      });
      // Clean up any leftover separators
      newValue = newValue.replace(/,\s*,/g, ", ").replace(/^\s*,\s*/, "").replace(/\s*,\s*$/, "").trim();
      onChange(newValue);
    } else {
      // Add chip to text
      const separator = value.trim() ? ", " : "";
      const newValue = value.trim() + separator + chip;
      if (newValue.length <= maxLength) {
        onChange(newValue);
      }
    }
  };

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  // Clear text
  const handleClear = () => {
    onChange("");
    textareaRef.current?.focus();
  };

  // Character count styling
  const charCountInfo = useMemo(() => {
    const percentage = (value.length / maxLength) * 100;
    if (percentage >= 95) return { color: "text-red-500 dark:text-red-400", label: "Almost at limit" };
    if (percentage >= 80) return { color: "text-amber-500 dark:text-amber-400", label: "Getting close to limit" };
    return { color: "text-muted-foreground", label: "" };
  }, [value.length, maxLength]);

  return (
    <div
      className={cn(
        // Card container
        "rounded-2xl border border-border/50 bg-card overflow-hidden",
        // Premium shadow and dark mode
        "shadow-sm shadow-black/5 dark:shadow-black/20",
        "dark:border-border/30 dark:bg-card/95",
        // Animation
        "transition-all duration-300 motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-transparent border-b border-border/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-muted-foreground" />
          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
            Add a cooking request
          </h3>
          <span className="text-xs text-muted-foreground font-medium">(optional)</span>

          {/* Info Tooltip */}
          <div className="relative ml-auto">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="p-1 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="More information about cooking requests"
            >
              <Info className="size-4 text-muted-foreground" />
            </button>
            {showTooltip && (
              <div
                className={cn(
                  "absolute bottom-full right-0 mb-2 w-56 p-3 z-50",
                  "rounded-xl bg-popover border border-border shadow-lg",
                  "text-xs text-muted-foreground leading-relaxed",
                  "animate-in fade-in-0 zoom-in-95 duration-150"
                )}
                role="tooltip"
              >
                Let us know your preferences. We will try our best to accommodate your request.
                <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 size-2 bg-popover border-r border-b border-border" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Quick Chips */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Quick options
          </p>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip, index) => {
              const isActive = activeChips.has(chip);
              const wouldExceedLimit = !isActive && value.length + chip.length + 2 > maxLength;

              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => !wouldExceedLimit && handleChipClick(chip)}
                  disabled={wouldExceedLimit}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5",
                    "text-xs sm:text-sm font-medium transition-all duration-200 motion-reduce:transition-none",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "touch-manipulation min-h-[36px]",
                    "active:scale-95 motion-reduce:active:scale-100",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : wouldExceedLimit
                        ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                        : "bg-muted/50 text-foreground hover:bg-muted border border-border/50",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 25}ms` : "0ms" }}
                  aria-pressed={isActive}
                  aria-disabled={wouldExceedLimit}
                >
                  {isActive && (
                    <span className="animate-in fade-in-0 zoom-in-50 duration-150">
                      <Check className="size-3 mr-0.5" />
                    </span>
                  )}
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <div
            className={cn(
              "rounded-xl border-2 transition-all duration-200 overflow-hidden",
              isFocused
                ? "border-primary/50 shadow-sm shadow-primary/10"
                : "border-border/50"
            )}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={3}
              className={cn(
                "w-full px-4 py-3 bg-transparent resize-none",
                "text-sm sm:text-base text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none",
                "dark:bg-muted/10"
              )}
              aria-label="Cooking request"
              aria-describedby="char-count-info"
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 bg-muted/20 dark:bg-muted/10">
              {/* Clear Button */}
              {value.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    "text-muted-foreground hover:text-foreground",
                    "focus:outline-none focus-visible:underline",
                    "transition-all duration-200",
                    "animate-in fade-in-0 slide-in-from-left-2"
                  )}
                >
                  <X className="size-3" />
                  Clear
                </button>
              ) : (
                <span />
              )}

              {/* Character Count */}
              <span
                id="char-count-info"
                className={cn("text-xs font-medium tabular-nums", charCountInfo.color)}
                aria-live="polite"
              >
                {charCountInfo.label && (
                  <span className="sr-only">{charCountInfo.label}. </span>
                )}
                {value.length}/{maxLength}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
