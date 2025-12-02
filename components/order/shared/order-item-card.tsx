import { Badge } from "@/components/ui/badge";
import { OrderItemResponse } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderItemCardProps {
  item: OrderItemResponse;
  showRefundInfo?: boolean;
  className?: string;
}

export function OrderItemCard({
  item,
  showRefundInfo = false,
  className,
}: OrderItemCardProps) {
  const hasDiscount = item.priceAfterDiscount < item.price;
  const savings = item.price - item.priceAfterDiscount;
  const lineTotal = item.priceAfterDiscount * item.quantity;

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0",
        className
      )}
    >
      {/* Left: Item Details */}
      <div className="flex-1 min-w-0">
        {/* Name + Quantity */}
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {item.quantity}x
          </span>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
              {item.name}
            </h4>

            {/* Variants */}
            {item.variants && item.variants.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {item.variants.join(" • ")}
              </p>
            )}

            {/* Addons */}
            {item.addons && item.addons.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                + {item.addons.map((a) => a.name).join(", ")}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex items-center gap-2 mt-2">
              {showRefundInfo && item.isRefunded && (
                <Badge
                  variant="secondary"
                  className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-2 py-0"
                >
                  Refunded
                </Badge>
              )}
              {item.itemStatus === "cancelled" && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0"
                >
                  Cancelled
                </Badge>
              )}
              {item.itemStatus === "returned" && (
                <Badge
                  variant="secondary"
                  className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs px-2 py-0"
                >
                  Returned
                </Badge>
              )}
            </div>

            {/* Refund Message */}
            {showRefundInfo && item.isRefunded && item.refundMessage && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                {item.refundMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
          £{lineTotal.toFixed(2)}
        </p>
        {hasDiscount && (
          <p className="text-xs text-slate-400 line-through tabular-nums">
            £{(item.price * item.quantity).toFixed(2)}
          </p>
        )}
        {hasDiscount && (
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            Save £{(savings * item.quantity).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
