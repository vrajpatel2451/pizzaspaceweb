import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceWrapperProps {
  value: number;
  currency?: string;
  locale?: string;
  showCurrency?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "primary" | "muted";
}

const sizeClasses = {
  sm: "text-sm",
  default: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

const variantClasses = {
  default: "text-foreground",
  primary: "text-primary",
  muted: "text-muted-foreground",
};

export function PriceWrapper({
  value,
  currency = "GBP",
  locale = "en-GB",
  showCurrency = true,
  className,
  size = "default",
  variant = "default",
}: PriceWrapperProps) {
  const formattedPrice = React.useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: showCurrency ? "currency" : "decimal",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(value);
  }, [value, currency, locale, showCurrency]);

  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="text"
      aria-label={`Price: ${formattedPrice}`}
    >
      {formattedPrice}
    </span>
  );
}
