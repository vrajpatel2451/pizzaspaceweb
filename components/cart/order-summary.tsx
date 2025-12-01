"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CustomerBillingOnCart } from "@/types";
import { cn } from "@/lib/utils";
import { SummaryLineItem } from "./summary-line-item";
import { CheckoutButton } from "./checkout-button";

interface OrderSummaryProps {
  summary: CustomerBillingOnCart | null;
  loading?: boolean;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  className?: string;
}

export function OrderSummary({
  summary,
  loading = false,
  onCheckout,
  checkoutDisabled = false,
  className,
}: OrderSummaryProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-card p-6 shadow-sm space-y-4",
          className
        )}
      >
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full my-4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const totalSavings = summary.totalDiscount;
  const hasExtraCharges =
    summary.extraCharges && Object.keys(summary.extraCharges).length > 0;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm space-y-4",
        className
      )}
    >
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-3">
        {/* Item Total */}
        <SummaryLineItem
          label="Item Total"
          value={summary.itemTotalAfterDiscount}
          originalValue={summary.itemTotal}
          showDiscount
          testId="summary-item-total"
        />

        {/* Packing Charges */}
        {summary.packingCharges > 0 && (
          <SummaryLineItem
            label="Packing Charges"
            value={summary.packingChargesAfterDiscount}
            originalValue={summary.packingCharges}
            showDiscount
            testId="summary-packing-charges"
          />
        )}

        {/* Delivery Charges */}
        {summary.deliveryCharges > 0 && (
          <SummaryLineItem
            label="Delivery Charges"
            value={summary.deliveryChargesAfterDiscount}
            originalValue={summary.deliveryCharges}
            showDiscount
            testId="summary-delivery-charges"
          />
        )}

        {/* Extra Charges */}
        {hasExtraCharges &&
          Object.entries(summary.extraCharges).map(([key, [original, final]]) => (
            <SummaryLineItem
              key={key}
              label={key.replace(/([A-Z])/g, " $1").trim()}
              value={final}
              originalValue={original}
              showDiscount
              labelClassName="capitalize"
              testId={`summary-extra-${key}`}
            />
          ))}

        <Separator />

        {/* Tax Breakdown */}
        <div className="space-y-2 bg-muted/30 rounded-md p-3">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Tax Breakdown
          </p>
          <div className="space-y-1.5 text-sm">
            {summary.tax.itemTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">
                  Tax on Items
                </span>
                <span className="text-xs">
                  £{summary.tax.itemTotal.toFixed(2)}
                </span>
              </div>
            )}
            {summary.tax.packing > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">
                  Tax on Packing
                </span>
                <span className="text-xs">
                  £{summary.tax.packing.toFixed(2)}
                </span>
              </div>
            )}
            {summary.tax.deliveryCharges > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">
                  Tax on Delivery
                </span>
                <span className="text-xs">
                  £{summary.tax.deliveryCharges.toFixed(2)}
                </span>
              </div>
            )}
            {summary.tax.extraCharges &&
              Object.keys(summary.tax.extraCharges).length > 0 &&
              Object.entries(summary.tax.extraCharges).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground text-xs capitalize">
                    Tax on {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-xs">£{value.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>

        <Separator />

        {/* Total with Savings Badge */}
        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold text-base">Total</span>
          <div className="text-right">
            <span className="font-bold text-lg">
              £{summary.total.toFixed(2)}
            </span>
            {totalSavings > 0 && (
              <div className="mt-1">
                <Badge variant="success" size="sm">
                  <Tag className="h-3 w-3 mr-1" />
                  You save £{totalSavings.toFixed(2)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <CheckoutButton
        total={summary.total}
        disabled={checkoutDisabled}
        loading={loading}
        onClick={onCheckout}
      />

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center">
        All prices include applicable taxes
      </p>
    </div>
  );
}
