import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading State for Menu Page
 * Displays skeleton loaders while data is being fetched
 * Matches the layout structure of the actual page
 */
export default function MenuLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title Skeleton */}
      <Skeleton className="h-9 w-48 mb-6" />

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6">
        {/* Sidebar Skeleton */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            <Skeleton className="h-7 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2 p-3 rounded-lg border">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 min-w-0">
          {/* Product Count Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                {/* Image Skeleton */}
                <Skeleton className="aspect-square w-full rounded-2xl" />
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-3/4" />
                {/* Description Skeleton */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                {/* Price and Button Skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden">
        {/* Product Count Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Image Skeleton */}
              <Skeleton className="aspect-square w-full rounded-2xl" />
              {/* Title Skeleton */}
              <Skeleton className="h-6 w-3/4" />
              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              {/* Price and Button Skeleton */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
