"use client";

import * as React from "react";
import { AmountType } from "@/types";
import { cn } from "@/lib/utils";

interface DiscountAmountProps {
  amount: number;
  amountType: AmountType;
  maximumAmount?: number;
  className?: string;
  showMaximum?: boolean;
}

export function DiscountAmount({
  amount,
  amountType,
  maximumAmount,
  className,
  showMaximum = true,
}: DiscountAmountProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const displayAmount = React.useMemo(() => {
    if (amountType === "percentage") {
      return `${amount}% OFF`;
    }
    return `${formatAmount(amount)} OFF`;
  }, [amount, amountType]);

  const hasMaximum = showMaximum && amountType === "percentage" && maximumAmount && maximumAmount > 0;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="text-2xl font-bold text-primary">
        {displayAmount}
      </div>
      {hasMaximum && (
        <div className="text-xs text-muted-foreground">
          Max discount: {formatAmount(maximumAmount)}
        </div>
      )}
    </div>
  );
}
