"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CustomImage } from "@/components/ui/custom-image";
import { CategoryResponse, SubCategoryResponse } from "@/types";
import { cn } from "@/lib/utils";
import { SubcategoryList } from "./subcategory-list";

interface CategoryAccordionProps {
  categories: CategoryResponse[];
  subcategoriesByCategory: Map<string, SubCategoryResponse[]>;
  activeCategory?: string;
  activeSubcategory?: string;
  startTransition?: (callback: () => void) => void;
  isPending?: boolean;
}

/**
 * CategoryAccordion - Client Component
 *
 * Purpose: Interactive accordion for category/subcategory navigation
 * - Renders Radix Accordion with categories as items
 * - Handles category/subcategory selection via URL updates
 * - Shows active states based on URL params
 * - Updates URL on selection (not internal state)
 *
 * Performance: Memoized to prevent re-renders when parent state changes
 */
export const CategoryAccordion = memo(function CategoryAccordion({
  categories,
  subcategoriesByCategory,
  activeCategory,
  activeSubcategory,
  startTransition,
  isPending,
}: CategoryAccordionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /**
   * Handle category selection
   * Updates URL with category ID and clears subcategory
   */
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // If clicking the already active category, clear it
      if (activeCategory === categoryId) {
        params.delete("category");
        params.delete("subcategory");
      } else {
        params.set("category", categoryId);
        params.delete("subcategory"); // Clear subcategory when switching categories
      }

      // Reset pagination
      params.delete("page");

      const queryString = params.toString();
      if (startTransition) {
        startTransition(() => {
          router.push(`${pathname}?${queryString}`, { scroll: false });
        });
      } else {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      }
    },
    [router, pathname, searchParams, activeCategory, startTransition]
  );

  /**
   * Handle subcategory selection
   * Updates URL with subcategory ID
   */
  const handleSubcategorySelect = useCallback(
    (categoryId: string, subcategoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Set both category and subcategory
      params.set("category", categoryId);
      params.set("subcategory", subcategoryId);

      // Reset pagination
      params.delete("page");

      const queryString = params.toString();
      if (startTransition) {
        startTransition(() => {
          router.push(`${pathname}?${queryString}`, { scroll: false });
        });
      } else {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      }
    },
    [router, pathname, searchParams, startTransition]
  );

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    if (startTransition) {
      startTransition(() => {
        router.push(pathname, { scroll: false });
      });
    } else {
      router.push(pathname, { scroll: false });
    }
  }, [router, pathname, startTransition]);

  return (
    <nav aria-label="Category navigation" className="space-y-2">
      <Accordion
        type="single"
        collapsible
        value={activeCategory}
        onValueChange={handleCategorySelect}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category._id;
          const subcategories =
            subcategoriesByCategory.get(category._id) || [];

          return (
            <AccordionItem
              key={category._id}
              value={category._id}
              className="border-b border-border last:border-b-0"
            >
              <div
                className={cn(
                  "transition-transform duration-150 motion-reduce:transition-none",
                  "hover:scale-[1.01] motion-reduce:hover:scale-100"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ease-out hover:no-underline",
                    "min-h-[44px]", // Touch target minimum
                    isActive
                      ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-l-[3px] border-orange-500"
                      : "text-slate-700 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400"
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <CustomImage
                      src={category.imageUrl}
                      alt={category.name}
                      width={28}
                      height={28}
                      className="rounded-md object-cover shrink-0 sm:w-8 sm:h-8"
                      sizes="32px"
                      loading="lazy"
                    />
                    <span className="text-left truncate">{category.name}</span>
                    {subcategories.length > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground font-normal shrink-0">
                        {subcategories.length}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
              </div>

              <AccordionContent className="pb-2">
                {subcategories.length > 0 ? (
                  <SubcategoryList
                    categoryId={category._id}
                    subcategories={subcategories}
                    activeSubcategory={activeSubcategory}
                    onSelect={handleSubcategorySelect}
                    isPending={isPending ?? false}
                  />
                ) : (
                  <p className="px-4 py-2 text-sm text-muted-foreground italic">
                    No subcategories available
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Clear Filters Button */}
      {(activeCategory || activeSubcategory) && (
        <button
          onClick={handleClearFilters}
          disabled={isPending}
          className={cn(
            "w-full min-h-[44px] px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium motion-reduce:transition-none",
            "active:scale-[0.99] motion-reduce:active:scale-100",
            isPending
              ? "text-orange-400 dark:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 cursor-not-allowed opacity-60"
              : "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:scale-[1.01]"
          )}
          aria-label="Clear all category filters"
        >
          Clear Filters
        </button>
      )}
    </nav>
  );
});
