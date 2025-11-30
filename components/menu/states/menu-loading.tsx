import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MenuLoadingProps {
  /**
   * Number of skeleton cards to display
   * @default 12
   */
  count?: number;

  /**
   * Whether to show the sidebar skeleton (desktop only)
   * @default true
   */
  showSidebar?: boolean;
}

/**
 * MenuLoading - Loading State Component
 *
 * Skeleton loader for the menu page that matches the actual content dimensions.
 * Features:
 * - Grid skeleton matching product card dimensions
 * - Optional sidebar skeleton for desktop layout
 * - Responsive design (1 col mobile, 2 tablet, 3 desktop)
 * - Shimmer animation built into shadcn Skeleton
 */
export function MenuLoading({ count = 12, showSidebar = true }: MenuLoadingProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar Skeleton - Desktop Only */}
        {showSidebar && (
          <aside className="hidden lg:block w-64 shrink-0 space-y-4">
            {/* Sidebar Title */}
            <Skeleton className="h-8 w-32 mb-4" />

            {/* Category Items */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                {/* Category Header */}
                <Skeleton className="h-10 w-full rounded-lg" />

                {/* Subcategories (for first 2 categories) */}
                {i < 2 && (
                  <div className="pl-8 space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-6 w-2/3 rounded-md" />
                  </div>
                )}
              </div>
            ))}

            {/* Clear Filters Button */}
            <Skeleton className="h-10 w-full rounded-md mt-6" />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Product Count Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-center gap-2">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductCardSkeleton
 *
 * Individual product card skeleton that matches ProductCard dimensions.
 * Includes:
 * - Square image placeholder
 * - Title, description, and metadata skeletons
 * - Price and button skeletons
 */
function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl overflow-hidden",
        "shadow-sm border border-slate-100 dark:border-slate-800"
      )}
    >
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Size/Weight Info */}
        <Skeleton className="h-3 w-16" />

        {/* Product Name */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description (2 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Rating */}
        <Skeleton className="h-4 w-24" />

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * GridOnlyLoading
 *
 * Simplified loading state for when only the product grid needs to reload
 * (e.g., during pagination or filtering)
 */
export function GridOnlyLoading({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Product Count Skeleton */}
      <Skeleton className="h-5 w-48" />

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
