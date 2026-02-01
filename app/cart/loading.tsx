import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items & Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items Header */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-32" />

            {/* Cart Item Skeletons */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm"
              >
                <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <Skeleton className="h-9 w-32" />
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Discount Section Skeleton */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <Separator />

          {/* Delivery Type Section Skeleton */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Tabs Skeleton */}
            <div className="grid grid-cols-3 gap-2 h-20 bg-muted rounded-lg p-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />

              {/* Summary Items */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-px w-full my-4" />

              {/* Tax Breakdown Skeleton */}
              <div className="bg-muted/30 rounded-md p-3 space-y-2">
                <Skeleton className="h-3 w-24" />
                <div className="space-y-1.5">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              <Skeleton className="h-px w-full my-4" />

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-16" />
                <div className="text-right space-y-1">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Checkout Button */}
              <Skeleton className="h-11 w-full" />

              {/* Info Text */}
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
