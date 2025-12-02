import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
  animated = false,
  className,
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
        sizeClasses[size],
        animated && "animate-pulse",
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </Badge>
  );
}
