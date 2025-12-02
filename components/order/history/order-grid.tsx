import Link from "next/link";
import { AlertCircle, PackageX } from "lucide-react";
import { OrderResponse } from "@/types/order";
import { OrderCard } from "./order-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OrderGridProps {
  orders: OrderResponse[];
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function OrderGrid({
  orders,
  emptyMessage = "No orders found",
  errorMessage,
  className,
}: OrderGridProps) {
  // Show error state if there's an error message
  if (errorMessage) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-16 px-4",
          className
        )}
      >
        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6 mb-6">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
          {errorMessage}
        </p>
        <Button asChild variant="outline">
          <Link href="/order">Try Again</Link>
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-16 px-4",
          className
        )}
      >
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-6">
          <PackageX className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
          You haven&apos;t placed any orders yet. Start ordering your favorite
          pizzas now!
        </p>
        <Button asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}

// Skeleton component for loading state
export function OrderGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5"
        >
          {/* Header: Store & Menu */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          {/* Items Preview */}
          <div className="mb-3 space-y-1">
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Footer: Amount & Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
