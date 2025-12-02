import { getOrderTickets } from "@/lib/api/orderTicket";
import { getOrderDetails } from "@/lib/api/order";
import { TicketsClient } from "@/components/order/tickets";
import { OrderPageHeader } from "@/components/order/shared/order-page-header";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TicketsPage({
  params,
  searchParams,
}: PageProps) {
  // Await params and searchParams
  const { orderId } = await params;
  const resolvedSearchParams = await searchParams;

  // Parse pagination params
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 12;

  // Fetch order details and tickets in parallel
  const [orderResponse, ticketsResponse] = await Promise.all([
    getOrderDetails(orderId),
    getOrderTickets(orderId, { currentPage, limit }),
  ]);

  // Handle order not found
  if (!orderResponse.data || orderResponse.statusCode !== 200) {
    notFound();
  }

  const order = orderResponse.data;
  const storeId = order.seller.info._id;
  const formattedOrderId = `#${order._id.substring(0, 8).toUpperCase()}`;
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  // Handle tickets error response
  if (!ticketsResponse.data || ticketsResponse.statusCode !== 200) {
    return (
      <div className="min-h-screen bg-background">
        <OrderPageHeader
          badge={{
            icon: AlertCircle,
            label: "Support Tickets",
          }}
          title={{
            prefix: "Tickets for Order",
            highlight: formattedOrderId,
          }}
          subtitle={`Report issues and get support for your order from ${order.seller.info.name}.`}
          variant={statusConfig.variant}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <TicketsClient
            orderId={orderId}
            storeId={storeId}
            initialTickets={[]}
            initialPagination={{
              page: currentPage,
              limit,
              total: 0,
              totalPages: 0,
            }}
            errorMessage={
              ticketsResponse.errorMessage ||
              "Failed to load tickets. Please try again later."
            }
          />
        </div>
      </div>
    );
  }

  const { data: tickets, meta } = ticketsResponse.data;

  return (
    <div className="min-h-screen bg-background">
      <OrderPageHeader
        badge={{
          icon: AlertCircle,
          label: "Support Tickets",
        }}
        title={{
          prefix: "Tickets for Order",
          highlight: formattedOrderId,
        }}
        subtitle={`Report issues and get support for your order from ${order.seller.info.name}.`}
        variant={statusConfig.variant}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <TicketsClient
          orderId={orderId}
          storeId={storeId}
          initialTickets={tickets}
          initialPagination={{
            page: meta.currentPage,
            limit: meta.itemsPerPage,
            total: meta.totalItems,
            totalPages: meta.totalPages,
          }}
        />
      </div>
    </div>
  );
}
