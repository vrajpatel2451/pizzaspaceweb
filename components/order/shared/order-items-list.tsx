import { OrderItemResponse } from "@/types/order";
import { OrderItemReviewResponse } from "@/types/orderReview";
import { OrderItemCard } from "./order-item-card";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface OrderItemsListProps {
  items: OrderItemResponse[];
  title?: string;
  showRefundInfo?: boolean;
  itemReviews?: OrderItemReviewResponse[];
  className?: string;
}

export function OrderItemsList({
  items,
  title = "Order Items",
  showRefundInfo = false,
  itemReviews,
  className,
}: OrderItemsListProps) {
  // Create a map of item reviews by itemId for quick lookup
  const reviewsMap = itemReviews?.reduce((acc, review) => {
    acc[review.itemId] = review;
    return acc;
  }, {} as Record<string, OrderItemReviewResponse>);
  // Empty state
  if (!items || items.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-card p-6 sm:p-8 shadow-sm",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Items</h3>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            This order does not contain any items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>

      {/* Items */}
      <div className="px-4 sm:px-6">
        {items.map((item, index) => (
          <OrderItemCard
            key={`${item.itemId}-${index}`}
            item={item}
            showRefundInfo={showRefundInfo}
            itemReview={reviewsMap?.[item.itemId]}
          />
        ))}
      </div>
    </div>
  );
}
