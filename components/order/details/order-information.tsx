import { Clock, CreditCard, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus, PaymentType } from "@/types/order";
import { OrderReviewResponse } from "@/types/orderReview";
import { OrderStatusBadge } from "@/components/order/shared/order-status-badge";
import { ReviewDisplayCard } from "@/components/order/review";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";

interface OrderInformationProps {
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentRefId: string;
  orderReview?: OrderReviewResponse | null;
  className?: string;
}

export function OrderInformation({
  status,
  paymentMethod,
  paymentRefId,
  orderReview,
  className,
}: OrderInformationProps) {
  // Payment method icon and label
  const paymentInfo = {
    online: {
      icon: CreditCard,
      label: "Online Payment",
    },
    cash: {
      icon: Banknote,
      label: "Cash on Delivery",
    },
  };

  const PaymentIcon = paymentInfo[paymentMethod].icon;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-orange-500" />
          <span>Order Information</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <OrderStatusBadge status={status} size="md" showIcon />
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Payment Method
          </p>
          <div className="flex items-center gap-2 text-foreground">
            <PaymentIcon className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">
              {paymentInfo[paymentMethod].label}
            </span>
          </div>
        </div>

        {/* Payment Reference ID (only for online payments) */}
        {paymentMethod === "online" && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Payment Reference ID
            </p>
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border">
              <code className="flex-1 text-xs break-all font-mono text-foreground">
                {paymentRefId}
              </code>
              <CopyButton value={paymentRefId} />
            </div>
          </div>
        )}

        {/* Order Review (if exists) */}
        {orderReview && (
          <div className="pt-2 border-t">
            <ReviewDisplayCard
              rating={orderReview.overallRatings}
              message={orderReview.overallMessage}
              title="Your Rating"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
