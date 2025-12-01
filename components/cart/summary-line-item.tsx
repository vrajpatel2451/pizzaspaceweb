import { cn } from "@/lib/utils";

interface SummaryLineItemProps {
  label: string;
  value: number;
  originalValue?: number;
  showDiscount?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  testId?: string;
}

/**
 * Reusable component for displaying a single line item in the cart summary
 * Supports showing original price with strikethrough when discount is applied
 */
export function SummaryLineItem({
  label,
  value,
  originalValue,
  showDiscount = false,
  className,
  labelClassName,
  valueClassName,
  testId,
}: SummaryLineItemProps) {
  const hasDiscount = showDiscount && originalValue !== undefined && originalValue !== value;

  return (
    <div
      className={cn("flex justify-between text-sm", className)}
      data-testid={testId}
    >
      <span className={cn("text-muted-foreground", labelClassName)}>
        {label}
      </span>
      <div className={cn("text-right", valueClassName)}>
        {hasDiscount && (
          <span className="line-through text-muted-foreground text-xs mr-2">
            £{originalValue.toFixed(2)}
          </span>
        )}
        <span
          className={cn(
            "font-medium",
            hasDiscount && "text-green-600 dark:text-green-400"
          )}
        >
          £{value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
