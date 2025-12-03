"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Tag } from "lucide-react";
import { DiscountResponse } from "@/types";
import { cn } from "@/lib/utils";

interface AppliedDiscountsProps {
  discounts: DiscountResponse[];
  totalSavings: number;
  onRemove: (discountId: string) => void;
  isRemoving?: boolean;
  className?: string;
}

export function AppliedDiscounts({
  discounts,
  onRemove,
  isRemoving = false,
  className,
}: AppliedDiscountsProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (discounts.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Applied Discount Chips */}
      <div className="flex flex-wrap gap-2">
        {discounts.map((discount, index) => (
          <div
            key={discount._id}
            className={cn(
              "transition-all duration-200",
              "animate-in fade-in-0 zoom-in-95"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Badge
              variant="secondary"
              className="pl-3 pr-2 py-1.5 gap-2 bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
            >
              <div className="flex items-center gap-1.5">
                <Tag className="size-3.5" />
                <span className="font-mono font-semibold">
                  {discount.couponCode}
                </span>
                <span className="text-xs">
                  (-
                  {discount.discountAmountType === "fix"
                    ? formatAmount(discount.discountAmount)
                    : `${discount.discountAmount}%`}
                  )
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-5 hover:bg-green-200 dark:hover:bg-green-900 -mr-1"
                onClick={() => onRemove(discount._id)}
                disabled={isRemoving}
                aria-label={`Remove ${discount.couponCode} discount`}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
