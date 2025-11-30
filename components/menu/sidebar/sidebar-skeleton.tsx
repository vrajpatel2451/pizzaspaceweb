import { Skeleton } from "@/components/ui/skeleton";

/**
 * SidebarSkeleton - Loading Component
 *
 * Purpose: Loading skeleton for category sidebar
 * - Matches dimensions of actual sidebar content
 * - Prevents layout shift during loading
 * - Shows placeholder for categories and subcategories
 */
export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <Skeleton className="h-7 w-32" />

      {/* Category items skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Category trigger skeleton */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-8 h-8 rounded-md shrink-0" />
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            {/* Subcategory skeleton (only show for first 2 categories) */}
            {i < 2 && (
              <div className="pl-12 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Clear filters button skeleton */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
