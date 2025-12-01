"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Track which chips are active based on textarea content
  const activeChips = React.useMemo(() => {
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
  const charCountInfo = React.useMemo(() => {
    const percentage = (value.length / maxLength) * 100;
    if (percentage >= 95) return { color: "text-red-500 dark:text-red-400", label: "Almost at limit" };
    if (percentage >= 80) return { color: "text-amber-500 dark:text-amber-400", label: "Getting close to limit" };
    return { color: "text-muted-foreground", label: "" };
  }, [value.length, maxLength]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.025,
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <motion.div
      className={cn(
        // Card container
        "rounded-2xl border border-border/50 bg-card overflow-hidden",
        // Premium shadow and dark mode
        "shadow-sm shadow-black/5 dark:shadow-black/20",
        "dark:border-border/30 dark:bg-card/95",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute bottom-full right-0 mb-2 w-56 p-3 z-50",
                    "rounded-xl bg-popover border border-border shadow-lg",
                    "text-xs text-muted-foreground leading-relaxed"
                  )}
                  role="tooltip"
                >
                  Let us know your preferences. We will try our best to accommodate your request.
                  <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 size-2 bg-popover border-r border-b border-border" />
                </motion.div>
              )}
            </AnimatePresence>
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
                <motion.button
                  key={chip}
                  type="button"
                  custom={index}
                  variants={chipVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => !wouldExceedLimit && handleChipClick(chip)}
                  disabled={wouldExceedLimit}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5",
                    "text-xs sm:text-sm font-medium transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "touch-manipulation min-h-[36px]",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : wouldExceedLimit
                        ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                        : "bg-muted/50 text-foreground hover:bg-muted border border-border/50"
                  )}
                  whileTap={shouldReduceMotion || wouldExceedLimit ? undefined : { scale: 0.95 }}
                  aria-pressed={isActive}
                  aria-disabled={wouldExceedLimit}
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <Check className="size-3 mr-0.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {chip}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <motion.div
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
              <AnimatePresence>
                {value.length > 0 ? (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      "text-muted-foreground hover:text-foreground",
                      "focus:outline-none focus-visible:underline",
                      "transition-colors"
                    )}
                  >
                    <X className="size-3" />
                    Clear
                  </motion.button>
                ) : (
                  <span />
                )}
              </AnimatePresence>

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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
