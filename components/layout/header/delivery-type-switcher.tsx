"use client";

import * as React from "react";
import { Truck, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useDeliveryTypeContext } from "@/contexts/delivery-type-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderDeliveryType } from "@/types/cart";

interface DeliveryTypeSwitcherProps {
  className?: string;
}

/**
 * Maps delivery type to display information
 */
const deliveryTypeConfig: Record<
  OrderDeliveryType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
  }
> = {
  delivery: {
    label: "Delivery",
    icon: Truck,
    ariaLabel: "Delivery - Click to change delivery type",
  },
  pickup: {
    label: "Collection",
    icon: ShoppingBag,
    ariaLabel: "Collection - Click to change delivery type",
  },
  dineIn: {
    label: "Dine In",
    icon: UtensilsCrossed,
    ariaLabel: "Dine In - Click to change delivery type",
  },
};

export function DeliveryTypeSwitcher({ className }: DeliveryTypeSwitcherProps) {
  const { deliveryType, openModal } = useDeliveryTypeContext();

  const config = deliveryTypeConfig[deliveryType];
  const Icon = config.icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={openModal}
      className={cn(
        "relative gap-2 transition-all",
        "hover:bg-accent/50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label={config.ariaLabel}
    >
      <Icon className="size-4 shrink-0" />
      <span className="hidden md:inline-block truncate max-w-[150px] lg:max-w-[200px]">
        {config.label}
      </span>
    </Button>
  );
}
