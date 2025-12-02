import { ShoppingBag } from "lucide-react";
import { OrderPageHeader } from "@/components/order/shared/order-page-header";
import { OrderHistoryClient } from "@/components/order/history/order-history-client";
import { getOrders } from "@/lib/api/order";
import { OrderStatus, TimeRange } from "@/types/order";

interface OrderHistoryPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    timerange?: TimeRange;
    status?: string;
  }>;
}

export default async function OrderHistoryPage({
  searchParams,
}: OrderHistoryPageProps) {
  const params = await searchParams;

  // Parse query parameters
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "12");
  const timerange = (params.timerange as TimeRange) || "all";
  const status = params.status;

  // Convert timerange to startTime/endTime
  const now = new Date();
  let startTime: string | undefined;

  switch (timerange) {
    case "last7days":
      startTime = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    case "last30days":
      startTime = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    case "last90days":
    case "last3months":
      startTime = new Date(
        now.getTime() - 90 * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    case "lastyear":
      startTime = new Date(
        now.getTime() - 365 * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    default:
      startTime = undefined;
  }

  // Fetch orders from API
  const response = await getOrders({
    page,
    limit,
    startTime,
    endTime: now.toISOString(),
    status: status as OrderStatus | undefined,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const orders = response.data?.data || [];
  const errorMessage =
    response.statusCode >= 400 ? response.errorMessage : undefined;
  const pagination = response.data?.meta || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Premium Page Header */}
      <OrderPageHeader
        badge={{
          icon: ShoppingBag,
          label: "Orders",
        }}
        title={{
          prefix: "My",
          highlight: "Orders",
        }}
        subtitle="Track your pizza orders and order history"
        variant="default"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <OrderHistoryClient
          initialOrders={orders}
          initialPagination={{
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            total: pagination.totalItems,
            totalPages: pagination.totalPages,
          }}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
