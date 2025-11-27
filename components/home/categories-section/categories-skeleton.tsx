import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSkeleton() {
  return (
    <div className="relative">
      <div className="flex gap-6 overflow-hidden px-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 flex flex-col items-center">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
            <Skeleton className="w-20 h-4 mt-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
