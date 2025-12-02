import {
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
  Truck,
  Home,
  LucideIcon,
} from "lucide-react";
import { OrderStatus } from "@/types/order";

export type StatusVariant = "default" | "success" | "error";

export interface OrderStatusConfig {
  label: string;
  icon: LucideIcon;
  variant: StatusVariant;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  isActive: boolean;
}

/**
 * Single source of truth for order status display configuration
 * Used across all order-related components for consistency
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  initiated: {
    label: "Pending",
    icon: Clock,
    variant: "default",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    dotColor: "bg-blue-500",
    isActive: true,
  },
  payment_confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    variant: "default",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
    isActive: true,
  },
  payment_error: {
    label: "Payment Failed",
    icon: XCircle,
    variant: "error",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200 dark:border-red-800",
    dotColor: "bg-red-500",
    isActive: false,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    variant: "error",
    color: "text-slate-500 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-500/10",
    borderColor: "border-slate-200 dark:border-slate-700",
    dotColor: "bg-slate-400",
    isActive: false,
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    variant: "default",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    dotColor: "bg-orange-500",
    isActive: true,
  },
  ready_to_pickup: {
    label: "Ready for Pickup",
    icon: Package,
    variant: "default",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    dotColor: "bg-amber-500",
    isActive: true,
  },
  on_the_way: {
    label: "On the Way",
    icon: Truck,
    variant: "default",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-500/10",
    borderColor: "border-violet-200 dark:border-violet-800",
    dotColor: "bg-violet-500",
    isActive: true,
  },
  delivered: {
    label: "Delivered",
    icon: Home,
    variant: "success",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    borderColor: "border-green-200 dark:border-green-800",
    dotColor: "bg-green-500",
    isActive: false,
  },
};

/**
 * Get the configuration for a specific order status
 */
export function getOrderStatusConfig(status: OrderStatus): OrderStatusConfig {
  return ORDER_STATUS_CONFIG[status];
}

/**
 * Get just the label for a status
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status].label;
}
