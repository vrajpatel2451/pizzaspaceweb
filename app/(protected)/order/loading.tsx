import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderHistoryLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Skeleton */}
      <section className="relative bg-white dark:bg-slate-950 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-14">
            {/* Badge Skeleton */}
            <div className="mb-4 flex justify-center">
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-12 w-64 mx-auto mb-4" />

            {/* Subtitle Skeleton */}
            <Skeleton className="h-6 w-96 mx-auto" />

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Skeleton className="w-12 h-0.5" />
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-12 h-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Skeleton className="h-10 w-full sm:w-48" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="p-6 space-y-4">
              {/* Order ID and Date */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Total Amount */}
              <Skeleton className="h-8 w-24" />

              {/* Items Count */}
              <Skeleton className="h-4 w-20" />

              {/* Status Badge */}
              <Skeleton className="h-6 w-32" />

              {/* Store Name */}
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
