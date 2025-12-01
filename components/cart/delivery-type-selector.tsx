"use client";

import { Home, ShoppingBag, Truck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderDeliveryType } from "@/types";
import { cn } from "@/lib/utils";

interface DeliveryTypeSelectorProps {
  value: OrderDeliveryType;
  onChange: (value: OrderDeliveryType) => void;
  className?: string;
  disabled?: boolean;
}

const deliveryTypes = [
  {
    value: "dineIn" as const,
    label: "Dine In",
    icon: Home,
    description: "Enjoy your meal at our restaurant",
  },
  {
    value: "pickup" as const,
    label: "Pickup",
    icon: ShoppingBag,
    description: "Collect your order from the store",
  },
  {
    value: "delivery" as const,
    label: "Delivery",
    icon: Truck,
    description: "We'll deliver to your doorstep",
  },
];

export function DeliveryTypeSelector({
  value,
  onChange,
  className,
  disabled = false,
}: DeliveryTypeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-base font-semibold mb-1">Delivery Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you&apos;d like to receive your order
        </p>
      </div>

      <Tabs
        value={value}
        onValueChange={(val) => onChange(val as OrderDeliveryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted">
          {deliveryTypes.map((type) => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 data-[state=active]:bg-background",
                "sm:flex-row sm:gap-2 sm:py-2"
              )}
            >
              <type.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-xs sm:text-sm font-medium">
                  {type.label}
                </span>
                <span className="hidden lg:block text-[10px] text-muted-foreground font-normal">
                  {type.description}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Mobile descriptions */}
      <div className="lg:hidden">
        {deliveryTypes.map((type) => {
          if (type.value !== value) return null;
          return (
            <p
              key={type.value}
              className="text-xs text-muted-foreground text-center"
            >
              {type.description}
            </p>
          );
        })}
      </div>
    </div>
  );
}
