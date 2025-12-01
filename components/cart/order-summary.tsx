"use client";

import { useState } from "react";
import {
  CreditCard,
  Banknote,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomerBillingOnCart } from "@/types";
import { cn } from "@/lib/utils";
import { SummaryLineItem } from "./summary-line-item";

// Payment method type
export type PaymentMethod = "online" | "cod";

interface OrderSummaryProps {
  summary: CustomerBillingOnCart | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  className?: string;
  paymentMethod?: PaymentMethod;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  showPaymentMethod?: boolean;
}

// Delivery Fee Modal Content
function DeliveryFeeModal({
  open,
  onClose,
  deliveryCharges,
}: {
  open: boolean;
  onClose: () => void;
  deliveryCharges: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delivery Partner Fee
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Base delivery charges</span>
            <span className="font-medium tabular-nums">
              {"\u00A3"}{deliveryCharges.toFixed(2)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Tax Breakdown Modal Content
function TaxBreakdownModal({
  open,
  onClose,
  tax,
}: {
  open: boolean;
  onClose: () => void;
  tax: CustomerBillingOnCart["tax"];
}) {
  const taxItems = [
    { label: "Tax on item total", value: tax.itemTotal },
    { label: "Tax on packing charges", value: tax.packing },
    { label: "Tax on delivery charges", value: tax.deliveryCharges },
    ...Object.entries(tax.extraCharges || {}).map(([key, value]) => ({
      label: `Tax on ${key.replace(/([A-Z])/g, " $1").trim()}`,
      value,
    })),
  ].filter((item) => item.value > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Tax Breakdown
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 py-2">
          <p className="text-sm text-muted-foreground mb-4">
            Tax breakdown for your order
          </p>
          {taxItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-muted-foreground text-sm">{item.label}</span>
              <span className="font-medium text-sm tabular-nums">
                {"\u00A3"}{item.value.toFixed(2)}
              </span>
            </div>
          ))}
          <Separator className="my-3" />
          <div className="flex justify-between items-center py-2">
            <span className="font-semibold">Total Tax</span>
            <span className="font-semibold tabular-nums">
              {"\u00A3"}{tax.total.toFixed(2)}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Loading skeleton
function OrderSummarySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-6 shadow-sm space-y-4",
        className
      )}
    >
      <Skeleton className="h-6 sm:h-7 w-32 sm:w-36 mb-2" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between py-2">
            <Skeleton className="h-4 w-24 sm:w-28" />
            <Skeleton className="h-4 w-14 sm:w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 sm:h-12 w-full rounded-lg" />
      <Skeleton className="h-px w-full" />
      <div className="flex justify-between py-2">
        <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
        <Skeleton className="h-11 sm:h-12 w-full rounded-lg" />
        <Skeleton className="h-11 sm:h-12 w-full rounded-lg" />
      </div>
      <Skeleton className="h-11 sm:h-12 w-full rounded-full" />
    </div>
  );
}

export function OrderSummary({
  summary,
  loading = false,
  error = null,
  onRetry,
  onCheckout,
  checkoutDisabled = false,
  className,
  paymentMethod = "online",
  onPaymentMethodChange,
  showPaymentMethod = true,
}: OrderSummaryProps) {
  const [deliveryFeeModalOpen, setDeliveryFeeModalOpen] = useState(false);
  const [taxModalOpen, setTaxModalOpen] = useState(false);

  if (loading) {
    return <OrderSummarySkeleton className={className} />;
  }

  // Show error state when summary is null and not loading
  if (!summary && !loading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Unable to load summary</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-[280px]">
            {error || "We couldn't calculate your order total. Please try again."}
          </p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const totalSavings = summary.totalDiscount;

  // Get platform fee and handling charges from extra charges
  const platformFee =
    summary.extraCharges?.["Platform Fee"] ||
    summary.extraCharges?.["platformFee"];
  const handlingCharges =
    summary.extraCharges?.["Handling Charges"] ||
    summary.extraCharges?.["handlingCharges"];

  // Get other extra charges (excluding platform fee and handling)
  const otherExtraCharges = Object.entries(summary.extraCharges || {}).filter(
    ([key]) =>
      ![
        "Platform Fee",
        "platformFee",
        "Handling Charges",
        "handlingCharges",
      ].includes(key)
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-6 shadow-sm space-y-4",
        className
      )}
    >
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-bold tracking-tight">Order Summary</h2>

      {/* Line Items */}
      <div className="space-y-0.5">
        {/* Item Total */}
        <SummaryLineItem
          label="Item total"
          value={summary.itemTotalAfterDiscount}
          originalValue={summary.itemTotal}
          showDiscount
          testId="summary-item-total"
        />

        {/* Packing Charges */}
        {summary.packingCharges > 0 && (
          <SummaryLineItem
            label="Packing charges"
            value={summary.packingChargesAfterDiscount}
            originalValue={summary.packingCharges}
            showDiscount
            testId="summary-packing-charges"
          />
        )}

        {/* Delivery Fee with Info Icon */}
        {summary.deliveryCharges > 0 && (
          <SummaryLineItem
            label="Delivery fee"
            value={summary.deliveryChargesAfterDiscount}
            originalValue={summary.deliveryCharges}
            showDiscount
            hasInfoIcon
            onInfoClick={() => setDeliveryFeeModalOpen(true)}
            testId="summary-delivery-fee"
          />
        )}

        {/* Platform Fee */}
        {platformFee && (
          <SummaryLineItem
            label="Platform Fee"
            value={platformFee[1]}
            originalValue={platformFee[0]}
            showDiscount
            testId="summary-platform-fee"
          />
        )}

        {/* Handling Charges */}
        {handlingCharges && (
          <SummaryLineItem
            label="Handling Charges"
            value={handlingCharges[1]}
            originalValue={handlingCharges[0]}
            showDiscount
            testId="summary-handling-charges"
          />
        )}

        {/* Other Extra Charges */}
        {otherExtraCharges.map(([key, [original, final]]) => (
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

        {/* Tax with Info Icon */}
        <SummaryLineItem
          label="Tax"
          value={summary.tax.total}
          hasInfoIcon
          onInfoClick={() => setTaxModalOpen(true)}
          testId="summary-tax"
        />
      </div>

      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <Sparkles className="size-3.5 sm:size-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">
            You saved {"\u00A3"}{totalSavings.toFixed(2)} on this order
          </span>
        </div>
      )}

      <Separator />

      {/* Grand Total */}
      <div className="flex justify-between items-center py-1">
        <span className="text-base sm:text-lg font-bold">Grand Total</span>
        <span className="text-xl sm:text-xl font-bold text-primary tabular-nums">
          {"\u00A3"}{summary.total.toFixed(2)}
        </span>
      </div>

      <Separator />

      {/* Payment Method Selection */}
      {showPaymentMethod && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <span className="font-semibold text-xs sm:text-sm">Payment Method</span>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              onPaymentMethodChange?.(value as PaymentMethod)
            }
            className="gap-2"
          >
            {/* Online Payment Option */}
            <Label
              htmlFor="payment-online"
              className={cn(
                "flex items-center gap-3 p-3 min-h-[44px] rounded-lg border cursor-pointer transition-all duration-200",
                paymentMethod === "online"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              <RadioGroupItem value="online" id="payment-online" />
              <CreditCard className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Online Payment</span>
            </Label>

            {/* Cash on Delivery Option */}
            <Label
              htmlFor="payment-cod"
              className={cn(
                "flex items-center gap-3 p-3 min-h-[44px] rounded-lg border cursor-pointer transition-all duration-200",
                paymentMethod === "cod"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              <RadioGroupItem value="cod" id="payment-cod" />
              <Banknote className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Cash on Delivery</span>
            </Label>
          </RadioGroup>
        </div>
      )}

      {/* Place Order Button */}
      <Button
        onClick={onCheckout}
        disabled={checkoutDisabled || loading}
        className="w-full min-h-[44px] h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <ShoppingBag className="size-4 mr-2" />
        Place Order - {"\u00A3"}{summary.total.toFixed(2)}
      </Button>

      {/* Modals */}
      <DeliveryFeeModal
        open={deliveryFeeModalOpen}
        onClose={() => setDeliveryFeeModalOpen(false)}
        deliveryCharges={summary.deliveryChargesAfterDiscount}
      />

      <TaxBreakdownModal
        open={taxModalOpen}
        onClose={() => setTaxModalOpen(false)}
        tax={summary.tax}
      />
    </div>
  );
}
