import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Pills skeleton */}
      <div className="flex gap-3 justify-center flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-11 w-24 rounded-full"
          />
        ))}
      </div>

      {/* Filter tags skeleton */}
      <div className="flex gap-2 justify-center flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 w-20 rounded-full"
          />
        ))}
      </div>

      {/* Divider skeleton */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        <Skeleton className="w-24 h-4 rounded" />
        <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl"
          >
            <Skeleton className="absolute inset-0" />
            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
              <Skeleton className="w-32 h-6 rounded mb-2" />
              <Skeleton className="w-24 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Button skeleton */}
      <div className="flex justify-center pt-4">
        <Skeleton className="w-44 h-14 rounded-full" />
      </div>
    </div>
  );
}
