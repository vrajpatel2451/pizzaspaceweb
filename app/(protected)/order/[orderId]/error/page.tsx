import { getOrderDetails } from "@/lib/api/order";
import { notFound, redirect } from "next/navigation";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";
import { OrderPageHeader } from "@/components/order/shared/order-page-header";
import { FailureActions } from "@/components/order/failure/failure-actions";
import { HelpCard } from "@/components/order/failure/help-card";
import { OrderItemsList } from "@/components/order/shared/order-items-list";
import { OrderSummaryDisplay } from "@/components/order/shared/order-summary-display";

interface OrderErrorPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

/**
 * OrderErrorPage - Server Component for displaying order error/failure
 * Shows error banner, order details, and support information
 * Route: /order/[orderId]/error
 */
export default async function OrderErrorPage({ params }: OrderErrorPageProps) {
  // Await params in Next.js 16
  const { orderId } = await params;

  // Fetch order details from API
  const response = await getOrderDetails(orderId);

  // Handle API errors
  if (!response.data || response.statusCode !== 200) {
    notFound();
  }

  const order = response.data;

  // Redirect if order is not in error state
  // Only show error page for payment_error or cancelled orders
  if (
    order.status !== "payment_error" &&
    order.status !== "cancelled" &&
    order.status !== "initiated"
  ) {
    redirect(`/order/${orderId}`);
  }

  // Format order ID for display
  const formattedOrderId = `#${order._id.substring(0, 8).toUpperCase()}`;

  // Get status configuration
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  // Determine error message based on status
  const isPaymentError = order.status === "payment_error";
  const subtitle = isPaymentError
    ? "We encountered an issue processing your payment. Please try again or contact support for assistance."
    : "We encountered an issue processing your order. Please contact support for assistance.";

  return (
    <div className="min-h-screen bg-background">
      {/* Error Page Header */}
      <OrderPageHeader
        badge={{
          icon: statusConfig.icon,
          label: statusConfig.label,
        }}
        title={{
          prefix: "Order",
          highlight: formattedOrderId,
        }}
        subtitle={subtitle}
        variant="error"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <OrderItemsList items={order.items} title="Order Items" />

            {/* Action Buttons */}
            <FailureActions
              orderId={order._id}
              supportEmail="support@pizzaspace.com"
              supportPhone="+44-123-456-7890"
            />

            {/* Help Card */}
            <HelpCard
              supportEmail="support@pizzaspace.com"
              supportPhone="+44-123-456-7890"
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummaryDisplay billing={order.billing.customerTotal} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate metadata for the error page
 */
export async function generateMetadata({ params }: OrderErrorPageProps) {
  const { orderId } = await params;

  return {
    title: `Order Error - #${orderId} | PizzaSpace`,
    description:
      "There was an issue processing your order. Please contact support for assistance.",
  };
}
