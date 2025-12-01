"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Tag, Sparkles } from "lucide-react";
import { DiscountResponse } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AppliedDiscountsProps {
  discounts: DiscountResponse[];
  totalSavings: number;
  onRemove: (discountId: string) => void;
  isRemoving?: boolean;
  className?: string;
}

export function AppliedDiscounts({
  discounts,
  totalSavings,
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

  const calculateDiscountSavings = (discount: DiscountResponse) => {
    // This is a simplified calculation - in real app this would come from the pricing API
    if (discount.discountAmountType === "fix") {
      return discount.discountAmount;
    }
    // For percentage, show the maximum amount as potential savings
    return discount.maximumAmount || 0;
  };

  if (discounts.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Applied Discount Chips */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {discounts.map((discount) => (
            <motion.div
              key={discount._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
