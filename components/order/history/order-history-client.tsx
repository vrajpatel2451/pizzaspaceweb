"use client";

import { useEffect, useState, useTransition } from "react";
import { OrderResponse } from "@/types/order";
import { OrderFilters } from "./order-filters";
import { OrderGrid, OrderGridSkeleton } from "./order-grid";
import { OrderPagination } from "./order-pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderHistoryClientProps {
  initialOrders: OrderResponse[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errorMessage?: string;
}

export function OrderHistoryClient({
  initialOrders,
  initialPagination,
  errorMessage,
}: OrderHistoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  // Track URL changes to show loading state
  useEffect(() => {
    setIsNavigating(false);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setIsNavigating(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`/order?${params.toString()}`);
    });
  };

  const isLoading = isPending || isNavigating;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <OrderFilters onFilterChange={() => setIsNavigating(true)} />

      {/* Order Grid */}
      {isLoading ? (
        <OrderGridSkeleton />
      ) : (
        <OrderGrid orders={initialOrders} errorMessage={errorMessage} />
      )}

      {/* Pagination */}
      {initialPagination.totalPages > 1 && !isLoading && (
        <OrderPagination
          currentPage={initialPagination.page}
          totalPages={initialPagination.totalPages}
          totalItems={initialPagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
