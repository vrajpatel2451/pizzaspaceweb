"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => Promise<void>;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export function QuantityControl({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}: QuantityControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDecrease = async () => {
    if (quantity <= min || isUpdating || disabled) return;

    setIsUpdating(true);
    try {
      await onQuantityChange(quantity - 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (quantity >= max || isUpdating || disabled) return;

    setIsUpdating(true);
    try {
      await onQuantityChange(quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border bg-background",
        className
      )}
      role="group"
      aria-label="Quantity controls"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDecrease}
        disabled={quantity <= min || isUpdating || disabled}
        loading={isUpdating}
        className="h-8 w-8 rounded-l-lg rounded-r-none hover:bg-accent"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div
        className="flex h-8 w-10 items-center justify-center text-sm font-medium tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleIncrease}
        disabled={quantity >= max || isUpdating || disabled}
        loading={isUpdating}
        className="h-8 w-8 rounded-l-none rounded-r-lg hover:bg-accent"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
