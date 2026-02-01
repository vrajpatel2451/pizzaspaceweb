"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
 * - Uses local temp state for selections
 * - Only applies filters to URL when "Apply Filters" is clicked
 * - "Clear All" resets temp state and applies clear
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Temporary local state for selections (only applied on "Apply Filters")
  const [tempCategory, setTempCategory] = useState<string | undefined>(activeCategory);
  const [tempSubcategory, setTempSubcategory] = useState<string | undefined>(activeSubcategory);

  // Sync temp state when sheet opens via wrapped onOpenChange
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      // Sheet is opening - sync temp state from current URL filters
      setTempCategory(activeCategory);
      setTempSubcategory(activeSubcategory);
    }
    onOpenChange(nextOpen);
  }, [activeCategory, activeSubcategory, onOpenChange]);

  // Group subcategories by category ID for the accordion
  const subcategoriesByCategory = useMemo(() => {
    const map = new Map<string, SubCategoryResponse[]>();
    subcategories.forEach((sub) => {
      const existing = map.get(sub.categoryId) || [];
      map.set(sub.categoryId, [...existing, sub]);
    });
    return map;
  }, [subcategories]);

  // Handle local category change (temp state only)
  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setTempCategory(categoryId);
    setTempSubcategory(undefined);
  }, []);

  // Handle local subcategory change (temp state only)
  const handleSubcategoryChange = useCallback((categoryId: string, subcategoryId: string) => {
    setTempCategory(categoryId);
    setTempSubcategory(subcategoryId);
  }, []);

  // Apply filters to URL and close sheet
  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (tempCategory) {
      params.set("category", tempCategory);
    } else {
      params.delete("category");
    }

    if (tempSubcategory) {
      params.set("subcategory", tempSubcategory);
    } else {
      params.delete("subcategory");
    }

    params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    if (startTransition) {
      startTransition(() => {
        router.push(url, { scroll: false });
      });
    } else {
      router.push(url, { scroll: false });
    }

    onOpenChange(false);
  }, [tempCategory, tempSubcategory, searchParams, pathname, router, startTransition, onOpenChange]);

  // Clear all filters and close sheet
  const handleClearAll = useCallback(() => {
    setTempCategory(undefined);
    setTempSubcategory(undefined);
    onClearFilters();
    onOpenChange(false);
  }, [onClearFilters, onOpenChange]);

  // Focus management
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[70vh] max-h-[80vh] rounded-t-3xl border-t border-border p-0 flex flex-col"
        aria-modal="true"
        role="dialog"
        aria-labelledby="filter-sheet-title"
        aria-describedby="filter-sheet-description"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 py-3 border-b border-border shrink-0">
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

        {/* Scrollable Content Area - flex-1 fills remaining space */}
        <ScrollArea className="flex-1 min-h-0 px-4 sm:px-6 py-4">
          <CategoryAccordion
            categories={categories}
            subcategoriesByCategory={subcategoriesByCategory}
            activeCategory={tempCategory}
            activeSubcategory={tempSubcategory}
            isPending={isPending}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
          />
        </ScrollArea>

        {/* Footer - shrink-0 ensures it never gets cut off */}
        <SheetFooter
          className="px-4 sm:px-6 py-4 border-t border-border flex-row gap-2 sm:gap-3 shrink-0"
          style={{
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex-1 min-h-11"
            disabled={isPending || (!tempCategory && !tempSubcategory)}
            aria-label="Clear all active filters"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 min-h-11 bg-orange-500 hover:bg-orange-600 text-white"
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
