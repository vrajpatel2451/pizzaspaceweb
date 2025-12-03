"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/drawer";
import { ProductDetailsContent } from "./product-details-content";
import type { ProductDetailsModalProps } from "@/types/product-details";
import { cn } from "@/lib/utils";

export function ProductDetailsBottomsheet({
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="bottom"
      size="full"
      showCloseButton={true}
      title="Product Details"
    >
      {/* Hidden description for screen readers */}
      <p id="product-bottomsheet-description" className="sr-only">
        Customize your product with available options and add to cart
      </p>

      {/* Animated Product Details Content with safe area support - maximized for mobile */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto overscroll-contain scrollbar-hide pb-[env(safe-area-inset-bottom)]">
        {isOpen && (
          <div
            className={cn(
              "h-full transition-all motion-reduce:transition-none",
              prefersReducedMotion ? "" : "duration-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <ProductDetailsContent
              {...contentProps}
              onClose={onClose}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}
