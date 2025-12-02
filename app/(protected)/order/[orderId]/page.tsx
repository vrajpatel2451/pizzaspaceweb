import { notFound } from "next/navigation";
import { getOrderDetails } from "@/lib/api/order";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";
import { OrderPageHeader } from "@/components/order/shared/order-page-header";
import { OrderDetailsHeader } from "@/components/order/details/order-details-header";
import { OrderStatusTimeline } from "@/components/order/details/order-status-timeline";
import { OrderInformation } from "@/components/order/details/order-information";
import { StoreDetails } from "@/components/order/details/store-details";
import { DeliveryRiderDetails } from "@/components/order/details/delivery-rider-details";
import { OrderItemsList } from "@/components/order/shared/order-items-list";
import { OrderSummaryDisplay } from "@/components/order/shared/order-summary-display";

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;

  // Fetch order details
  const response = await getOrderDetails(orderId);

  // Handle error cases
  if (!response.data || response.statusCode !== 200) {
    notFound();
  }

  const order = response.data;

  // Format order ID for display
  const formattedOrderId = `#${order._id.substring(0, 8).toUpperCase()}`;

  // Get status configuration
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Page Header */}
      <OrderPageHeader
        badge={{
          icon: statusConfig.icon,
          label: statusConfig.label,
        }}
        title={{
          prefix: "Order",
          highlight: formattedOrderId,
        }}
        subtitle={`View your order details, track status, and manage your order from ${order.seller.info.name}.`}
        variant={statusConfig.variant}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Order Details Header with Back + Actions */}
        <OrderDetailsHeader order={order} className="mb-6" />

        {/* Order Status Timeline */}
        <OrderStatusTimeline
          currentStatus={order.status}
          statusList={order.statusList}
          className="mb-8"
        />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (Items + Summary) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <OrderItemsList
              items={order.items}
              title={`Order Items (${order.items.length})`}
              showRefundInfo
            />

            {/* Order Summary */}
            <OrderSummaryDisplay billing={order.billing.customerTotal} />
          </div>

          {/* Sidebar Column (Info Sections) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Order Information */}
            <OrderInformation
              status={order.status}
              paymentMethod={order.payment.method}
              paymentRefId={order.payment.refId}
            />

            {/* Store Details */}
            <StoreDetails store={order.seller.info} />

            {/* Delivery Rider Details (conditional) */}
            {order.rider?.info && (
              <DeliveryRiderDetails rider={order.rider.info} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
