import { getOrderDetails } from "@/lib/api/order";
import { notFound, redirect } from "next/navigation";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";
import { OrderPageHeader } from "@/components/order/shared/order-page-header";
import { SuccessActions } from "@/components/order/success/success-actions";
import { OrderItemsList } from "@/components/order/shared/order-items-list";
import { OrderSummaryDisplay } from "@/components/order/shared/order-summary-display";

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

/**
 * Order Success Page - Displays order confirmation after successful checkout
 * Server Component that fetches order details and displays success message
 */
export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;

  // Fetch order details
  const response = await getOrderDetails(orderId);

  // Handle error states
  if (response.statusCode !== 200 || !response.data) {
    console.error("Failed to fetch order details:", response.errorMessage);
    notFound();
  }

  const order = response.data;

  // Redirect if order is not in a success state
  // Only show success page for freshly placed orders
  const successStatuses = ["initiated", "payment_confirmed"];
  if (!successStatuses.includes(order.status)) {
    redirect(`/order/${orderId}`);
  }

  // Format order ID for display
  const formattedOrderId = `#${order._id.substring(0, 8).toUpperCase()}`;

  // Get status configuration
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="min-h-screen bg-background">
      {/* Success Page Header */}
      <OrderPageHeader
        badge={{
          icon: statusConfig.icon,
          label: statusConfig.label,
        }}
        title={{
          prefix: "Order",
          highlight: formattedOrderId,
        }}
        subtitle="Thank you for your order! We're preparing your delicious pizza. Estimated delivery in 30-45 minutes."
        variant="success"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <SuccessActions orderId={order._id} />
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <OrderItemsList
              items={order.items}
              title={`Order Items (${order.items.length})`}
            />
          </div>

          {/* Order Summary - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <OrderSummaryDisplay billing={order.billing.customerTotal} />
          </div>
        </div>

        {/* Additional Information */}
        {order.customerMessage && (
          <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Order Notes
            </h3>
            <p className="text-sm text-foreground">{order.customerMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generate metadata for the success page
 */
export async function generateMetadata({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  return {
    title: `Order Success - #${orderId}`,
    description: "Your order has been placed successfully!",
  };
}
