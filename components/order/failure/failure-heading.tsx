import { XCircle } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface FailureHeadingProps {
  orderId: string;
  status?: OrderStatus;
  className?: string;
}

/**
 * FailureHeading - Error banner component for failed orders
 * Displays error message, order ID, and large X icon
 * Server Component - No client-side interactivity needed
 */
export function FailureHeading({
  orderId,
  status,
  className,
}: FailureHeadingProps) {
  // Determine error type based on status
  const isPaymentError = status === "payment_error";
  const headline = isPaymentError ? "Payment Failed" : "Order Error";
  const message = isPaymentError
    ? "We encountered an issue processing your payment. Please try again or contact support for assistance."
    : "We encountered an issue processing your order. Please contact support for assistance.";

  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-6 sm:p-8 border border-red-200 dark:border-red-800 shadow-sm ${className || ""}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
            <XCircle
              className="size-8 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-100 mb-2">
            {headline}
          </h1>
          <p className="text-base sm:text-lg text-red-800 dark:text-red-200 mb-3">
            {message}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Order ID:
            </span>
            <span className="text-sm font-mono font-bold text-red-900 dark:text-red-100 bg-red-200 dark:bg-red-800 px-2 py-1 rounded">
              #{orderId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
