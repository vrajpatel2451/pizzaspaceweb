"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetailsContent } from "./product-details-content";
import type { ProductDetailsModalProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

export function ProductDetailsDialog({
  isOpen,
  onClose,
  isProcessing,
  ...contentProps
}: Omit<ProductDetailsModalProps, 'productId' | 'children'> & React.ComponentProps<typeof ProductDetailsContent> & { isProcessing?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          // Override grid with flex for proper height chain
          "!flex !flex-col",
          // Responsive max-width
          "max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl",
          // Explicit height for proper scrolling (h-full cascade)
          "h-[90vh] sm:h-[85vh]",
          // No padding (content handles its own)
          "p-0",
          // No gap (override default gap-4)
          "gap-0",
          // Hide overflow (ScrollArea inside handles scrolling)
          "overflow-hidden",
          // Rounded corners
          "rounded-2xl"
        )}
        showCloseButton={true}
        aria-describedby="product-description"
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only" id="product-dialog-title">
          Product Details
        </DialogTitle>

        {/* Hidden description for screen readers */}
        <p id="product-description" className="sr-only">
          Customize your product with available options and add to cart
        </p>

        {/* Animated Product Details Content */}
        {isOpen && (
          <div
            className={cn(
              "flex-1 min-h-0 flex flex-col transition-all motion-reduce:transition-none",
              prefersReducedMotion ? "" : "duration-300",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <ProductDetailsContent
              {...contentProps}
              onClose={onClose}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
