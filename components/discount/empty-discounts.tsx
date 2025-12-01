"use client";

import * as React from "react";
import { Ticket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyDiscountsProps {
  className?: string;
  message?: string;
}

export function EmptyDiscounts({
  className,
  message = "No discounts available at the moment",
}: EmptyDiscountsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="relative mb-4">
        <Ticket className="size-16 text-muted-foreground/40" strokeWidth={1.5} />
        <Sparkles className="absolute -top-1 -right-1 size-6 text-muted-foreground/40" />
      </div>

      <h3 className="text-lg font-semibold mb-2">No Discounts Available</h3>

      <p className="text-sm text-muted-foreground max-w-sm">
        {message}
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        Check back later for exciting offers!
      </p>
    </div>
  );
}
