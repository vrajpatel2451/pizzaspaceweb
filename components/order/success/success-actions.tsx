"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SuccessActionsProps {
  orderId: string;
  className?: string;
}

/**
 * SuccessActions - Action buttons for post-order navigation
 * Client component for interactive button behavior
 */
export function SuccessActions({ orderId, className }: SuccessActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto",
        className
      )}
    >
      {/* Primary Action - View Order Details */}
      <Button
        asChild
        size="lg"
        className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90"
      >
        <Link href={`/order/${orderId}`}>
          <Eye className="size-5" />
          View Order Details
        </Link>
      </Button>

      {/* Secondary Action - Order More */}
      <Button
        asChild
        variant="outline"
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
      >
        <Link href="/menu">
          <ShoppingBag className="size-5" />
          Order More
        </Link>
      </Button>
    </div>
  );
}
