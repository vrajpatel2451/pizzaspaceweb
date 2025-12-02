"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  MoreVertical,
  Eye,
  RotateCcw,
  MessageCircle,
  Star,
} from "lucide-react";
import { OrderResponse } from "@/types/order";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/order-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: OrderResponse;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const config = ORDER_STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  // Format relative time
  const timeAgo = formatDistanceToNow(new Date(order.createdDate), {
    addSuffix: true,
  });

  // Format order ID
  const shortOrderId = order._id.substring(0, 8).toUpperCase();

  // Format currency
  const totalAmount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(order.billing.customerTotal.total);

  // Get item count and names
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemNames = order.items.slice(0, 2).map((item) => item.name);
  const hasMoreItems = order.items.length > 2;

  // Store initial
  const storeInitial = order.seller.info.name.charAt(0).toUpperCase();

  // Can reorder (only delivered/cancelled orders)
  const canReorder =
    order.status === "delivered" || order.status === "cancelled";

  // Can rate (only delivered orders)
  const canRate = order.status === "delivered";

  return (
    <div
      className={cn(
        "relative rounded-xl border border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900/50",
        "hover:border-slate-300 dark:hover:border-slate-700",
        "hover:shadow-md dark:hover:shadow-slate-900/50",
        "transition-all duration-200",
        className
      )}
    >
      <div className="p-4 sm:p-5">
        {/* Header: Store & Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Store Info */}
          <Link
            href={`/order/${order._id}`}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            <div
              className={cn(
                "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400",
                "font-semibold text-base"
              )}
            >
              {storeInitial}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {order.seller.info.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </Link>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={`/order/${order._id}`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {canRate && (
                <DropdownMenuItem className="cursor-pointer">
                  <Star className="mr-2 h-4 w-4" />
                  Rate Order
                </DropdownMenuItem>
              )}
              {canReorder && (
                <DropdownMenuItem className="cursor-pointer">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reorder
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Get Help
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Order Items Preview */}
        <Link href={`/order/${order._id}`} className="block mb-3">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <span className="line-clamp-1">
              {itemNames.join(", ")}
              {hasMoreItems && (
                <span className="text-slate-400 dark:text-slate-500">
                  {" "}
                  +{order.items.length - 2} more
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </Link>

        {/* Footer: Amount, Order ID & Status */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/order/${order._id}`}
            className="flex items-baseline gap-2"
          >
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              {totalAmount}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              #{shortOrderId}
            </span>
          </Link>

          {/* Status Badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              config.bgColor,
              config.color
            )}
          >
            {config.isActive && (
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    config.dotColor
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-1.5 w-1.5",
                    config.dotColor
                  )}
                />
              </span>
            )}
            <StatusIcon className="w-3 h-3" />
            <span>{config.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
