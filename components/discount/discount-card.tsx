"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { DiscountResponse } from "@/types";
import { DiscountTypeBadge } from "./discount-type-badge";
import { DiscountAmount } from "./discount-amount";
import { DiscountValidity } from "./discount-validity";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils/format";

interface DiscountCardProps {
  discount: DiscountResponse;
  isApplied?: boolean;
  isDisabled?: boolean;
  onApply?: (discountId: string) => void;
  className?: string;
}

export function DiscountCard({
  discount,
  isApplied = false,
  isDisabled = false,
  onApply,
  className,
}: DiscountCardProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isApplying, setIsApplying] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(discount.couponCode);
      setIsCopied(true);
      toast.success("Coupon code copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled || isApplied || !onApply) return;

    setIsApplying(true);
    try {
      await onApply(discount._id);
    } finally {
      setIsApplying(false);
    }
  };

  const getConditionText = () => {
    switch (discount.conditionType) {
      case "allProducts":
        return "Valid on all products";
      case "selectedCategories":
        return `Valid on ${discount.referenceIds.length} selected categories`;
      case "selectedProducts":
        return `Valid on ${discount.referenceIds.length} selected products`;
      default:
        return "";
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 border-dashed transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer",
        isApplied && "border-green-500 bg-green-50/50 dark:bg-green-950/20",
        isDisabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={() => !isDisabled && setIsExpanded(!isExpanded)}
    >
      {/* Decorative ticket notches */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full bg-background border-2 border-dashed" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-4 rounded-full bg-background border-2 border-dashed" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">{discount.name}</h3>
              <DiscountTypeBadge type={discount.discountType} />
              {isApplied && (
                <Badge className="bg-green-600 text-white">
                  <Check className="mr-1 size-3" />
                  Applied
                </Badge>
              )}
            </div>

            {/* Coupon Code with Copy Button */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-secondary/50 border border-dashed border-primary/50 rounded font-mono text-sm font-semibold uppercase tracking-wider">
                {discount.couponCode}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                {isCopied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <DiscountAmount
              amount={discount.discountAmount}
              amountType={discount.discountAmountType}
              maximumAmount={discount.maximumAmount}
              showMaximum={false}
              className="items-end"
            />
            <Button
              variant={isApplied ? "secondary" : "default"}
              size="sm"
              onClick={handleApply}
              disabled={isDisabled || isApplied}
              loading={isApplying}
              className={cn("min-w-[90px]", isApplied && "cursor-default")}
            >
              {isApplied ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Basic Info - Always Visible */}
        <div className="space-y-2">
          {discount.discountAmountType === "percentage" &&
            discount.maximumAmount > 0 && (
              <div className="text-sm text-muted-foreground">
                Maximum discount: {formatNumber(discount.maximumAmount)}
              </div>
            )}

          <DiscountValidity
            startTime={discount.startTime}
            endTime={discount.endTime}
            isNeverEnding={discount.isNeverEnding}
            showCountdown={isExpanded}
          />
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 border-t pt-3"
            >
              {discount.description && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {discount.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-1">Applicable Items</h4>
                <p className="text-sm text-muted-foreground">
                  {getConditionText()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Customer Type</h4>
                <p className="text-sm text-muted-foreground">
                  {discount.customerType === "allCustomers"
                    ? "Available for all customers"
                    : "New customers only"}
                </p>
              </div>

              {discount.customerIds && discount.customerIds.length > 0 && (
                <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                  <Info className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    This discount is available for specific customers only
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center justify-center gap-1 w-full py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="size-4" />
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
