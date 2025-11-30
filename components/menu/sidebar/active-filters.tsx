"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterChipContainer,
  filterChip,
  chipRemoveButton,
  prefersReducedMotion,
} from "../animations";

interface ActiveFilter {
  id: string;
  label: string;
  type: "category" | "subcategory" | "search";
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

/**
 * ActiveFilters - Client Component
 *
 * Purpose: Display active filter chips (mobile-first, works on desktop too)
 * - Horizontal scrollable chips
 * - Shows current category, subcategory, search
 * - Click X to remove individual filters with spring animation
 * - Clear all button when multiple filters active
 * - Orange brand styling with smooth animations
 * - AnimatePresence for smooth chip add/remove transitions
 * - Respects prefers-reduced-motion accessibility setting
 */
export function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  // Don't render if no active filters
  if (filters.length === 0) {
    return null;
  }

  const shouldAnimate = !prefersReducedMotion();

  return (
    <motion.div
      className="mb-4 sm:mb-5 space-y-2"
      variants={shouldAnimate ? filterChipContainer : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? "visible" : false}
      role="region"
      aria-label="Active filters"
    >
      {/* Screen reader announcement for filter count */}
      <div role="status" aria-live="polite" className="sr-only">
        {filters.length} active {filters.length === 1 ? "filter" : "filters"}
      </div>

      {/* Filter Chips Container - Horizontal Scroll with momentum */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">
          Filters:
        </span>

        <div
          className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filters.map((filter) => (
              <motion.div
                key={filter.id}
                variants={shouldAnimate ? filterChip : undefined}
                initial={shouldAnimate ? "initial" : false}
                animate={shouldAnimate ? "animate" : false}
                exit={shouldAnimate ? "exit" : undefined}
                whileHover={shouldAnimate ? "hover" : undefined}
                layout={shouldAnimate}
                style={{ scrollSnapAlign: "start" }}
              >
                <Badge
                  className={cn(
                    "inline-flex items-center gap-1.5 sm:gap-2 shrink-0",
                    "h-8 sm:h-9 px-2.5 sm:px-3 rounded-full",
                    "bg-orange-100 dark:bg-orange-950",
                    "text-orange-800 dark:text-orange-300",
                    "border border-orange-200 dark:border-orange-900",
                    "text-xs sm:text-sm font-medium",
                    "touch-manipulation"
                  )}
                >
                  <span className="max-w-[120px] sm:max-w-none truncate">
                    {filter.label}
                  </span>
                  <motion.button
                    onClick={() => onRemoveFilter(filter.id)}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0",
                      "text-orange-600 dark:text-orange-400",
                      "hover:bg-orange-600/20 dark:hover:bg-orange-400/20",
                      "active:bg-orange-600/30 dark:active:bg-orange-400/30",
                      "transition-colors duration-150"
                    )}
                    aria-label={`Remove ${filter.label} filter`}
                    variants={shouldAnimate ? chipRemoveButton : undefined}
                    initial={shouldAnimate ? "rest" : false}
                    whileHover={shouldAnimate ? "hover" : undefined}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Clear All Button */}
        {filters.length > 1 && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
            animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
            transition={shouldAnimate ? { delay: 0.1 } : undefined}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="shrink-0 min-h-[32px] sm:min-h-[36px] text-xs sm:text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
