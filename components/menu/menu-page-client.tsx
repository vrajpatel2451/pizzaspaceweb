"use client";

import { useState, useCallback, useMemo, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { CategoryResponse, SubCategoryResponse, ProductResponse } from "@/types";
import { CategoryAccordion } from "./sidebar/category-accordion";
import { FilterTrigger } from "./sidebar/filter-trigger";
import { ActiveFilters } from "./sidebar/active-filters";
import { SkipLink } from "./skip-link";
import { ScreenReaderAnnouncer } from "./screen-reader-announcer";
import { ProductGrid } from "./product-grid/product-grid";
import { MenuEmpty } from "./states/menu-empty";

// Dynamic import for mobile-only component to reduce initial bundle size
const MobileFilterSheet = dynamic(
  () => import("./sidebar/mobile-filter-sheet").then((mod) => ({ default: mod.MobileFilterSheet })),
  {
    ssr: false, // Mobile component doesn't need SSR
  }
);

interface MenuPageClientProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  products: ProductResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  initialFilters: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
    page: number;
  };
}

/**
 * MenuPageClient - Client Component
 *
 * Purpose: Orchestrates responsive layout and manages ephemeral UI state
 * - Manages mobile filter sheet open/close state
 * - Provides URL update functions to children
 * - Handles desktop/mobile layout switching
 * - Coordinates scroll behavior on filter/page change
 */
export function MenuPageClient({
  categories,
  subcategories,
  products,
  pagination,
  initialFilters,
}: MenuPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Mobile filter sheet state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Loading state for filter transitions
  const [isPending, startTransition] = useTransition();

  // Group subcategories by category for accordion
  const subcategoriesByCategory = useMemo(() => {
    const map = new Map<string, SubCategoryResponse[]>();
    subcategories.forEach((sub) => {
      const existing = map.get(sub.categoryId) || [];
      map.set(sub.categoryId, [...existing, sub]);
    });
    return map;
  }, [subcategories]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (initialFilters.categoryId) count++;
    if (initialFilters.subCategoryId) count++;
    if (initialFilters.search) count++;
    return count;
  }, [initialFilters]);

  // Build active filters array for chips
  const activeFilters = useMemo(() => {
    const filters: Array<{
      id: string;
      label: string;
      type: "category" | "subcategory" | "search";
    }> = [];

    if (initialFilters.categoryId) {
      const category = categories.find((c) => c._id === initialFilters.categoryId);
      if (category) {
        filters.push({
          id: "category",
          label: category.name,
          type: "category",
        });
      }
    }

    if (initialFilters.subCategoryId) {
      const subcategory = subcategories.find(
        (s) => s._id === initialFilters.subCategoryId
      );
      if (subcategory) {
        filters.push({
          id: "subcategory",
          label: subcategory.name,
          type: "subcategory",
        });
      }
    }

    if (initialFilters.search) {
      filters.push({
        id: "search",
        label: `"${initialFilters.search}"`,
        type: "search",
      });
    }

    return filters;
  }, [initialFilters, categories, subcategories]);

  // Handle removing individual filter
  const handleRemoveFilter = useCallback(
    (filterId: string) => {
      router.push(pathname, { scroll: false });

      // Build new URL without the removed filter
      const params = new URLSearchParams();

      if (filterId === "category") {
        // Remove category and subcategory
        if (initialFilters.search) params.set("search", initialFilters.search);
      } else if (filterId === "subcategory") {
        // Remove only subcategory, keep category
        if (initialFilters.categoryId)
          params.set("category", initialFilters.categoryId);
        if (initialFilters.search) params.set("search", initialFilters.search);
      } else if (filterId === "search") {
        // Remove only search, keep category/subcategory
        if (initialFilters.categoryId)
          params.set("category", initialFilters.categoryId);
        if (initialFilters.subCategoryId)
          params.set("subcategory", initialFilters.subCategoryId);
      }

      const queryString = params.toString();
      router.push(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false }
      );
    },
    [router, pathname, initialFilters]
  );

  // Handle clearing all filters
  const handleClearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Compute announcement message from props (no state needed)
  const announcement = useMemo(() => {
    const categoryName = initialFilters.categoryId
      ? categories.find((c) => c._id === initialFilters.categoryId)?.name
      : null;
    const subcategoryName = initialFilters.subCategoryId
      ? subcategories.find((s) => s._id === initialFilters.subCategoryId)?.name
      : null;

    if (categoryName || subcategoryName) {
      const parts = [];
      if (subcategoryName) parts.push(subcategoryName);
      else if (categoryName) parts.push(categoryName);

      if (parts.length > 0) {
        return `Filtered by ${parts.join(", ")}. Showing ${products.length} of ${pagination.totalItems} products`;
      }
    } else if (initialFilters.search) {
      return `Searching for "${initialFilters.search}". Showing ${products.length} of ${pagination.totalItems} products`;
    }
    return "";
  }, [initialFilters, products.length, pagination.totalItems, categories, subcategories]);

  return (
    <>
      {/* Skip Link for keyboard navigation */}
      <SkipLink />

      {/* Screen Reader Announcer */}
      <ScreenReaderAnnouncer message={announcement} />
      {/* Desktop Layout - Sidebar visible, FAB hidden */}
      <div className="hidden lg:flex gap-6 xl:gap-8">
        {/* Desktop Sidebar - Sticky with proper width */}
        <aside
          className="w-64 xl:w-72 shrink-0"
          aria-label="Product filters"
          role="complementary"
        >
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto">
            <h2 className="text-xl font-semibold">Categories</h2>
            <CategoryAccordion
              categories={categories}
              subcategoriesByCategory={subcategoriesByCategory}
              activeCategory={initialFilters.categoryId}
              activeSubcategory={initialFilters.subCategoryId}
              startTransition={startTransition}
              isPending={isPending}
            />
          </div>
        </aside>

        {/* Desktop Main Content */}
        <main id="main-content" className="flex-1 min-w-0" tabIndex={-1}>
          {products.length === 0 ? (
            <MenuEmpty
              hasActiveFilters={activeFilterCount > 0}
              filterContext={
                activeFilterCount > 0
                  ? "No products match your filters"
                  : "No products available"
              }
            />
          ) : (
            <>
              {/* Product count */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} of {pagination.totalItems} products
                </p>
              </div>

              {/* Product Grid - Optimized with priority loading */}
              <ProductGrid products={products} isPending={isPending} />

              {/* Pagination placeholder */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`h-10 w-10 rounded-lg border text-sm font-medium transition-colors ${
                        pagination.currentPage === i + 1
                          ? "bg-primary text-white border-primary"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile/Tablet Layout - Hidden sidebar, show FAB and sheet */}
      <div className="lg:hidden" id="main-content" tabIndex={-1}>
        {/* Active Filters Chips (shown above grid) */}
        <ActiveFilters
          filters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {products.length === 0 ? (
          <MenuEmpty
            hasActiveFilters={activeFilterCount > 0}
            filterContext={
              activeFilterCount > 0
                ? "No products match your filters"
                : "No products available"
            }
          />
        ) : (
          <>
            {/* Product count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalItems} products
              </p>
            </div>

            {/* Product Grid - Optimized with priority loading */}
            <ProductGrid products={products} isPending={isPending} />

            {/* Pagination - Responsive sizing */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2 pb-20">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg border text-sm font-medium transition-colors ${
                      pagination.currentPage === i + 1
                        ? "bg-primary text-white border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filter FAB (shown on mobile only) */}
      <FilterTrigger
        activeFilterCount={activeFilterCount}
        onClick={() => setIsFilterSheetOpen(true)}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        categories={categories}
        subcategories={subcategories}
        activeCategory={initialFilters.categoryId}
        activeSubcategory={initialFilters.subCategoryId}
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        onClearFilters={handleClearAllFilters}
        startTransition={startTransition}
        isPending={isPending}
      />
    </>
  );
}
