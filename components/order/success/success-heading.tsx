import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessHeadingProps {
  orderId: string;
  estimatedTime?: string;
  className?: string;
}

/**
 * SuccessHeading - Celebratory success banner for order placement
 * Displays success message, order ID, and estimated delivery time
 */
export function SuccessHeading({
  orderId,
  estimatedTime,
  className,
}: SuccessHeadingProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 shadow-sm",
        className
      )}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Success Icon with animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 dark:bg-green-400/20 rounded-full animate-ping" />
            <div className="relative size-16 sm:size-20 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center animate-scale-in">
              <CheckCircle className="size-10 sm:size-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 tracking-tight flex items-center justify-center gap-2">
              Order Placed Successfully!
              <span className="text-2xl" role="img" aria-label="Party popper">
                🎉
              </span>
            </h1>
            <p className="text-base sm:text-lg text-green-800 dark:text-green-200">
              Thank you for your order! We&apos;re preparing your delicious
              pizza.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-green-700 dark:text-green-300">
                Order ID:
              </span>
              <span className="text-sm font-mono font-semibold text-green-900 dark:text-green-100 bg-green-200/50 dark:bg-green-800/50 px-3 py-1 rounded-md">
                #{orderId}
              </span>
            </div>

            {estimatedTime && (
              <p className="text-sm text-green-700 dark:text-green-300">
                Estimated delivery: {estimatedTime}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
