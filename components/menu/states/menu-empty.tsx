"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pizza, SearchX, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  emptyStateContainer,
  emptyStateIcon,
  prefersReducedMotion,
} from "../animations";

interface MenuEmptyProps {
  hasActiveFilters: boolean;
  filterContext?: string;
}

/**
 * MenuEmpty - Client Component
 *
 * Empty state component for when no products are found.
 * Features:
 * - Different messages based on context (filters vs no products)
 * - Clear filters CTA when filters are active
 * - Browse all products CTA when no filters
 * - Pizza-themed illustration using lucide-react icons
 * - Gentle floating animation for illustration
 * - Respects prefers-reduced-motion accessibility setting
 */
export function MenuEmpty({
  hasActiveFilters,
  filterContext = "No products found",
}: MenuEmptyProps) {
  const router = useRouter();
  const shouldAnimate = !prefersReducedMotion();

  /**
   * Clear all filters and navigate to base menu page
   */
  const handleClearFilters = () => {
    router.push("/menu");
  };

  /**
   * Navigate to menu page with all products
   */
  const handleBrowseAll = () => {
    router.push("/menu");
  };

  // Select appropriate icon based on context
  const EmptyIcon = hasActiveFilters ? SearchX : Pizza;
  const iconColor = hasActiveFilters ? "text-slate-400" : "text-orange-500";
  const iconBgColor = hasActiveFilters
    ? "bg-slate-100 dark:bg-slate-800"
    : "bg-orange-50 dark:bg-orange-950";

  return (
    <div
      className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] py-8 sm:py-12 px-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.div
        variants={shouldAnimate ? emptyStateContainer : undefined}
        initial={shouldAnimate ? "hidden" : false}
        animate={shouldAnimate ? "visible" : false}
        className="w-full"
      >
        <Card
          className={cn(
            "w-full max-w-md mx-auto text-center",
            "border-2 border-dashed border-orange-200 dark:border-orange-900",
            "bg-white dark:bg-slate-900"
          )}
        >
          <CardHeader className="px-4 sm:px-6">
            {/* Illustration Circle with floating animation */}
            <motion.div
              className={cn(
                "mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center",
                "w-20 h-20 sm:w-24 sm:h-24",
                iconBgColor
              )}
              aria-hidden="true"
              variants={shouldAnimate ? emptyStateIcon : undefined}
              initial={shouldAnimate ? "initial" : false}
              animate={shouldAnimate ? ["animate", "float"] : false}
            >
              <EmptyIcon className={cn("w-10 h-10 sm:w-12 sm:h-12", iconColor)} />
            </motion.div>

            {/* Title */}
            <CardTitle
              className={cn(
                "text-lg sm:text-xl font-semibold",
                hasActiveFilters
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-orange-800 dark:text-orange-300"
              )}
            >
              {filterContext}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 px-4 sm:px-6">
            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {hasActiveFilters ? (
                <>
                  We couldn&apos;t find any products matching your criteria.
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Try adjusting your filters or search terms.
                </>
              ) : (
                <>
                  No products are available at the moment.
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Check back soon for new delicious items!
                </>
              )}
            </p>

            {/* Additional help for filter context */}
            {hasActiveFilters && (
              <motion.div
                className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-orange-50 dark:bg-orange-950 rounded-lg"
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                transition={shouldAnimate ? { delay: 0.3 } : undefined}
              >
                <p className="text-xs text-orange-700 dark:text-orange-400 flex items-center justify-center gap-1.5 sm:gap-2">
                  <Filter className="w-3 h-3" />
                  Active filters applied
                </p>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4 sm:px-6 pb-4 sm:pb-6">
            {hasActiveFilters ? (
              <>
                {/* Clear Filters Button */}
                <motion.div
                  initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
                  animate={shouldAnimate ? { opacity: 1, x: 0 } : false}
                  transition={shouldAnimate ? { delay: 0.4 } : undefined}
                  className="w-full sm:w-auto"
                >
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="w-full min-h-[44px] border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
                    aria-label="Clear all active filters and show all products"
                  >
                    Clear Filters
                  </Button>
                </motion.div>

                {/* Browse All Button */}
                <motion.div
                  initial={shouldAnimate ? { opacity: 0, x: 10 } : false}
                  animate={shouldAnimate ? { opacity: 1, x: 0 } : false}
                  transition={shouldAnimate ? { delay: 0.5 } : undefined}
                  className="w-full sm:w-auto"
                >
                  <Button
                    onClick={handleBrowseAll}
                    className="w-full min-h-[44px] bg-orange-500 hover:bg-orange-600 text-white"
                    aria-label="Browse all available products"
                  >
                    Browse All Products
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                transition={shouldAnimate ? { delay: 0.4 } : undefined}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={handleBrowseAll}
                  className="w-full min-h-[44px] bg-orange-500 hover:bg-orange-600 text-white"
                  aria-label="View the complete menu"
                >
                  View Menu
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
