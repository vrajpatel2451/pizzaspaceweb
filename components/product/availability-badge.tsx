import React from "react";
import { XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderDeliveryType } from "@/types/cart";
import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  available: boolean;
  deliveryType: OrderDeliveryType;
  className?: string;
}

const DELIVERY_TYPE_LABELS: Record<OrderDeliveryType, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  dineIn: "Dine In",
};

export function AvailabilityBadge({
  available,
  deliveryType,
  className,
}: AvailabilityBadgeProps) {
  // Don't render anything if the product is available
  if (available) {
    return null;
  }

  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[deliveryType];
  const badgeText = `Not available for ${deliveryTypeLabel}`;

  return (
    <Badge
      variant="destructive"
      size="sm"
      className={cn(
        "gap-1 absolute top-2 right-2 shadow-md z-10",
        className
      )}
      aria-label={badgeText}
      role="status"
    >
      <XCircle className="size-3" aria-hidden="true" />
      <span>{badgeText}</span>
    </Badge>
  );
}
