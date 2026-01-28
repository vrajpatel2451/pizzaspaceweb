"use client";

import { ShoppingBag, Truck } from "lucide-react";
import { OrderDeliveryType } from "@/types";
import { cn } from "@/lib/utils";

interface DeliveryTypeSelectorProps {
  value: OrderDeliveryType;
  onChange: (value: OrderDeliveryType) => void;
  className?: string;
  disabled?: boolean;
  showHeader?: boolean;
  compact?: boolean;
}

const deliveryTypes = [
  {
    value: "pickup" as const,
    label: "Collection",
    icon: ShoppingBag,
    description: "Pick up your order",
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
    bgGlow: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
  },
  {
    value: "delivery" as const,
    label: "Delivery",
    icon: Truck,
    description: "Delivered to your door",
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/25",
    bgGlow: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
  },
];

export function DeliveryTypeSelector({
  value,
  onChange,
  className,
  disabled = false,
  showHeader = true,
  compact = false,
}: DeliveryTypeSelectorProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {/* Section Header */}
      {showHeader && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Select Delivery Type
          </h3>
        </div>
      )}

      {/* Premium Card Selection Grid */}
      <div
        className={cn(
          "grid gap-4",
          compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {deliveryTypes.map((type, index) => {
          const isSelected = value === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => !disabled && onChange(type.value)}
              disabled={disabled}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className={cn(
                // Base styles - Premium glass card
                "group relative flex flex-col items-center justify-center",
                compact ? "p-4 sm:p-5" : "p-5 sm:p-7",
                "rounded-2xl border",
                "backdrop-blur-sm",
                "transition-all duration-300 ease-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                // Animation on mount
                "animate-fade-in-up opacity-0 fill-forwards",
                // Default state - subtle glass effect
                !isSelected && [
                  "bg-card/60 border-border/50",
                  "hover:bg-card/80 hover:border-border",
                  "hover:shadow-lg hover:-translate-y-1",
                ],
                // Selected state - premium glow effect
                isSelected && [
                  "border-primary/60 bg-primary/5",
                  "shadow-xl shadow-primary/20",
                  "-translate-y-1",
                  type.bgGlow,
                ],
                // Disabled state
                disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              )}
              aria-pressed={isSelected}
              aria-label={`${type.label}: ${type.description}`}
            >
              {/* Selection ring glow effect */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 pointer-events-none" />
              )}

              {/* Animated corner accent */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl",
                  "opacity-0 transition-opacity duration-300",
                  isSelected && "opacity-100",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 w-8 h-8 translate-x-4 -translate-y-4 rotate-45",
                    "bg-gradient-to-br",
                    type.gradient,
                  )}
                />
              </div>

              {/* Selection checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 animate-pop-in">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg",
                      type.gradient,
                      type.shadowColor,
                    )}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon container with gradient background */}
              <div
                className={cn(
                  "relative mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl",
                  "transition-all duration-300 ease-out",
                  // Default icon background
                  !isSelected && [
                    "bg-muted/50 group-hover:bg-muted",
                    "group-hover:scale-110",
                  ],
                  // Selected icon background - gradient
                  isSelected && [
                    "bg-gradient-to-br shadow-lg",
                    type.gradient,
                    type.shadowColor,
                    "scale-110",
                  ],
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-300",
                    compact ? "size-6 sm:size-7" : "size-7 sm:size-9",
                    isSelected
                      ? "text-white"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  strokeWidth={1.5}
                />

                {/* Subtle icon glow on hover */}
                {!isSelected && (
                  <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "font-semibold transition-colors duration-300",
                  compact ? "text-sm" : "text-base sm:text-lg",
                  isSelected
                    ? "text-foreground"
                    : "text-foreground/80 group-hover:text-foreground",
                )}
              >
                {type.label}
              </span>

              {/* Description */}
              <span
                className={cn(
                  "text-xs text-muted-foreground mt-1 text-center leading-tight",
                  "transition-colors duration-300",
                  isSelected && "text-muted-foreground/80",
                )}
              >
                {type.description}
              </span>

              {/* Bottom accent line */}
              <div
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full",
                  "transition-all duration-300 ease-out",
                  isSelected
                    ? `w-12 bg-gradient-to-r ${type.gradient}`
                    : "w-0 bg-primary",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Selected type contextual message with animation */}
      {value === "delivery" && (
        <div className="animate-fade-in-up">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <Truck className="size-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Get your order delivered to your doorstep. Please select a
              delivery address below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
