"use client";

import { UtensilsCrossed, ShoppingBag, Truck } from "lucide-react";
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
    icon: UtensilsCrossed,
    description: "Enjoy at our restaurant",
  },
  {
    value: "pickup" as const,
    label: "Takeaway",
    icon: ShoppingBag,
    description: "Pick up your order",
  },
  {
    value: "delivery" as const,
    label: "Delivery",
    icon: Truck,
    description: "Delivered to your door",
  },
];

export function DeliveryTypeSelector({
  value,
  onChange,
  className,
  disabled = false,
}: DeliveryTypeSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Section Header */}
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Select Delivery Type
        </h3>
      </div>

      {/* Card-based Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {deliveryTypes.map((type) => {
          const isSelected = value === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => !disabled && onChange(type.value)}
              disabled={disabled}
              className={cn(
                // Base styles
                "relative flex flex-col items-center justify-center",
                "p-4 sm:p-5 rounded-xl border-2",
                "transition-all duration-200 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                // Hover state
                !disabled && !isSelected && "hover:border-primary/40 hover:bg-primary/5",
                // Selected state
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-input bg-card",
                // Disabled state
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-pressed={isSelected}
              aria-label={`${type.label}: ${type.description}`}
            >
              {/* Selection indicator dot */}
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary" />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  "size-7 sm:size-9 mb-2 sm:mb-3 transition-colors duration-200",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={1.5}
              />

              {/* Label */}
              <span
                className={cn(
                  "font-semibold text-sm sm:text-base transition-colors duration-200",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {type.label}
              </span>

              {/* Description */}
              <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">
                {type.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected type contextual message */}
      {value === "delivery" && (
        <p className="text-sm text-muted-foreground">
          Get your order delivered to your doorstep. Please select a delivery address below.
        </p>
      )}
    </div>
  );
}
