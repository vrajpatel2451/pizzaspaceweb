import { ProductResponse, PaginationMeta } from "@/types";
import { MenuEmpty } from "@/components/menu/states/menu-empty";
import { ProductGrid } from "./product-grid";

interface MenuFilters {
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
}

interface ProductGridContainerProps {
  products: ProductResponse[];
  pagination: PaginationMeta;
  filters: MenuFilters;
}

/**
 * ProductGridContainer - Server Component
 *
 * Receives product data from parent page and handles empty state logic.
 * Passes data to the client-side ProductGrid component for rendering.
 */
export default function ProductGridContainer({
  products,
  pagination,
  filters,
}: ProductGridContainerProps) {
  const hasActiveFilters = Boolean(
    filters.categoryId || filters.subCategoryId || filters.search
  );

  // Empty State - No Products Found
  if (products.length === 0) {
    return (
      <MenuEmpty
        hasActiveFilters={hasActiveFilters}
        filterContext={
          filters.search
            ? `No results for "${filters.search}"`
            : hasActiveFilters
            ? "No products match your filters"
            : "No products available"
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Count Display */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {products.length} of {pagination.totalItems} products
        </p>

        {/* Optional: Sorting/View Toggle could go here */}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
