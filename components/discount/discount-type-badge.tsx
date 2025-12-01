"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Plus,
  Tag
} from "lucide-react";
import { DiscountType } from "@/types";
import { cn } from "@/lib/utils";

interface DiscountTypeBadgeProps {
  type: DiscountType;
  className?: string;
  showIcon?: boolean;
}

const discountTypeConfig = {
  normal: {
    label: "General",
    icon: Tag,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  packaging: {
    label: "Packaging",
    icon: Package,
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  deliveryCharges: {
    label: "Delivery",
    icon: Truck,
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  extraCharges: {
    label: "Extras",
    icon: Plus,
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
} as const;

export function DiscountTypeBadge({
  type,
  className,
  showIcon = true,
}: DiscountTypeBadgeProps) {
  const config = discountTypeConfig[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="mr-1 size-3" />}
      {config.label}
    </Badge>
  );
}
