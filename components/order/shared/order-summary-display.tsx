import { Sparkles } from "lucide-react";
import { CustomerBillingOnCart } from "@/types/cart";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryDisplayProps {
  billing: CustomerBillingOnCart;
  className?: string;
}

/**
 * OrderSummaryDisplay - Read-only order summary for order pages
 * Shows billing breakdown without checkout functionality
 */
export function OrderSummaryDisplay({
  billing,
  className,
}: OrderSummaryDisplayProps) {
  const totalSavings = billing.totalDiscount;

  // Get platform fee and handling charges from extra charges
  const platformFee =
    billing.extraCharges?.["Platform Fee"] ||
    billing.extraCharges?.["platformFee"];
  const handlingCharges =
    billing.extraCharges?.["Handling Charges"] ||
    billing.extraCharges?.["handlingCharges"];

  // Get other extra charges (excluding platform fee and handling)
  const otherExtraCharges = Object.entries(billing.extraCharges || {}).filter(
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
      <h2 className="text-lg sm:text-xl font-bold tracking-tight">
        Payment Summary
      </h2>

      {/* Line Items */}
      <div className="space-y-2">
        {/* Item Total */}
        <SummaryRow
          label="Item total"
          value={billing.itemTotalAfterDiscount}
          originalValue={
            billing.itemTotal !== billing.itemTotalAfterDiscount
              ? billing.itemTotal
              : undefined
          }
        />

        {/* Packing Charges */}
        {billing.packingCharges > 0 && (
          <SummaryRow
            label="Packing charges"
            value={billing.packingChargesAfterDiscount}
            originalValue={
              billing.packingCharges !== billing.packingChargesAfterDiscount
                ? billing.packingCharges
                : undefined
            }
          />
        )}

        {/* Delivery Fee */}
        {billing.deliveryCharges > 0 && (
          <SummaryRow
            label="Delivery fee"
            value={billing.deliveryChargesAfterDiscount}
            originalValue={
              billing.deliveryCharges !== billing.deliveryChargesAfterDiscount
                ? billing.deliveryCharges
                : undefined
            }
          />
        )}

        {/* Platform Fee */}
        {platformFee && (
          <SummaryRow
            label="Platform Fee"
            value={platformFee[1]}
            originalValue={platformFee[0] !== platformFee[1] ? platformFee[0] : undefined}
          />
        )}

        {/* Handling Charges */}
        {handlingCharges && (
          <SummaryRow
            label="Handling Charges"
            value={handlingCharges[1]}
            originalValue={
              handlingCharges[0] !== handlingCharges[1] ? handlingCharges[0] : undefined
            }
          />
        )}

        {/* Other Extra Charges */}
        {otherExtraCharges.map(([key, [original, final]]) => (
          <SummaryRow
            key={key}
            label={key.replace(/([A-Z])/g, " $1").trim()}
            value={final}
            originalValue={original !== final ? original : undefined}
          />
        ))}

        {/* Tax */}
        <SummaryRow label="Tax" value={billing.tax.total} />
      </div>

      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <Sparkles className="size-3.5 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            You saved £{totalSavings.toFixed(2)} on this order
          </span>
        </div>
      )}

      <Separator />

      {/* Grand Total */}
      <div className="flex justify-between items-center">
        <span className="text-base sm:text-lg font-bold">Total Paid</span>
        <span className="text-xl font-bold text-primary tabular-nums">
          £{billing.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// Simple summary row component
function SummaryRow({
  label,
  value,
  originalValue,
}: {
  label: string;
  value: number;
  originalValue?: number;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {originalValue !== undefined && originalValue > value && (
          <span className="text-xs text-muted-foreground line-through tabular-nums">
            £{originalValue.toFixed(2)}
          </span>
        )}
        <span className="text-sm font-medium tabular-nums">
          £{value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
