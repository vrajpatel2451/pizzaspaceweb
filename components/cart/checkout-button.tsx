"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";

interface CheckoutButtonProps {
  total: number;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
  showPrice?: boolean;
}

/**
 * Checkout button component for the cart summary
 * Shows total price, handles loading and disabled states
 */
export function CheckoutButton({
  total,
  disabled = false,
  loading = false,
  onClick,
  className,
  showPrice = true,
}: CheckoutButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn("w-full", className)}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Proceed to Checkout
          {showPrice && (
            <span className="ml-2 font-semibold">({formatNumber(total)})</span>
          )}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
