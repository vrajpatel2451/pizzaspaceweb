"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryAccordion } from "./category-accordion";
import { CategoryResponse, SubCategoryResponse } from "@/types";

interface MobileFilterSheetProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearFilters: () => void;
  startTransition?: (callback: () => void) => void;
  isPending?: boolean;
}

/**
 * MobileFilterSheet - Client Component
 *
 * Purpose: Mobile bottom drawer for category/subcategory filters
 * - Uses shadcn Sheet component (bottom side)
 * - Contains CategoryAccordion inside ScrollArea
 * - Footer with Clear All and Apply buttons
 * - Auto-closes on filter selection (optional)
 * - Rounded top corners with backdrop blur
 */
export function MobileFilterSheet({
  categories,
  subcategories,
  activeCategory,
  activeSubcategory,
  open,
  onOpenChange,
  onClearFilters,
  startTransition,
  isPending,
}: MobileFilterSheetProps) {
  // Group subcategories by category ID for the accordion
  const subcategoriesByCategory = new Map<string, SubCategoryResponse[]>();
  subcategories.forEach((sub) => {
    const existing = subcategoriesByCategory.get(sub.categoryId) || [];
    subcategoriesByCategory.set(sub.categoryId, [...existing, sub]);
  });

  // Handle clear all filters and close sheet
  const handleClearAll = useCallback(() => {
    onClearFilters();
    onOpenChange(false);
  }, [onClearFilters, onOpenChange]);

  // Handle apply filters (just close the sheet)
  const handleApply = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Focus management - save previous focus and restore on close
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // Save currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      // Restore focus when sheet closes
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] max-h-[90vh] rounded-t-3xl border-t border-border p-0"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="filter-sheet-title"
        aria-describedby="filter-sheet-description"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 py-3 border-b border-border">
          <SheetTitle
            id="filter-sheet-title"
            className="text-lg sm:text-xl font-semibold"
          >
            Filter Menu
          </SheetTitle>
          <p id="filter-sheet-description" className="sr-only">
            Select categories and subcategories to filter the product menu
          </p>
        </SheetHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="h-[calc(80vh-160px)] px-4 sm:px-6 py-4">
          <CategoryAccordion
            categories={categories}
            subcategoriesByCategory={subcategoriesByCategory}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            startTransition={startTransition}
            isPending={isPending}
          />
        </ScrollArea>

        {/* Footer with Action Buttons - Safe area aware */}
        <SheetFooter
          className="px-4 sm:px-6 py-4 border-t border-border flex-row gap-2 sm:gap-3"
          style={{
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex-1 min-h-[44px]"
            disabled={isPending || (!activeCategory && !activeSubcategory)}
            aria-label="Clear all active filters"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 min-h-[44px] bg-orange-500 hover:bg-orange-600 text-white"
            aria-label="Apply selected filters and close dialog"
            disabled={isPending}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
