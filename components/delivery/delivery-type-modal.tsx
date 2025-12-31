"use client";

import { useState } from "react";
import { OrderDeliveryType } from "@/types/cart";
import { useCartStore } from "@/store/cart-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DeliveryTypeSelector } from "@/components/cart/delivery-type-selector";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryTypeModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeliveryTypeModal({
  open,
  onOpenChange,
}: DeliveryTypeModalProps) {
  const { deliveryType, setDeliveryType, setDeliveryTypeSelected } =
    useCartStore();
  const [selectedType, setSelectedType] =
    useState<OrderDeliveryType>(deliveryType);

  const handleConfirm = () => {
    setDeliveryType(selectedType);
    setDeliveryTypeSelected(true);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
          "p-0 gap-0 border-0",
          "bg-transparent shadow-none"
        )}
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Main card with glass effect */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-background/95 backdrop-blur-xl",
            "border border-border/50",
            "shadow-2xl shadow-black/20"
          )}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top gradient blob */}
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            {/* Bottom gradient blob */}
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Header Section */}
          <DialogHeader className="relative px-6 pt-8 pb-2 text-center">
            {/* Animated sparkle icon */}
            <div className="flex justify-center mb-4 animate-fade-in-down">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-subtle" />
                <div className="relative p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <Sparkles className="size-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground animate-fade-in-up">
              How would you like your order?
            </DialogTitle>

            <DialogDescription className="text-base text-muted-foreground mt-2 animate-fade-in-up animation-delay-100">
              Choose the option that works best for you
            </DialogDescription>
          </DialogHeader>

          {/* Content Section */}
          <div className="relative px-6 py-6 animate-fade-in-up animation-delay-200">
            <DeliveryTypeSelector
              value={selectedType}
              onChange={setSelectedType}
              className="space-y-0"
              showHeader={false}
            />
          </div>

          {/* Footer Section with gradient border */}
          <DialogFooter className="relative px-6 pb-6 pt-2 animate-fade-in-up animation-delay-300">
            {/* Subtle separator line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <Button
              onClick={handleConfirm}
              disabled={!selectedType}
              size="lg"
              className={cn(
                "w-full sm:w-auto min-w-[200px]",
                "h-12 px-8 rounded-xl",
                "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700",
                "text-white font-semibold text-base",
                "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
                "transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                "group"
              )}
            >
              <span>Continue</span>
              <ArrowRight
                className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Button>
          </DialogFooter>

          {/* Bottom decorative accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
