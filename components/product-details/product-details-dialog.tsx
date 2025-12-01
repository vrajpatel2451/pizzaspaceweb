"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetailsContent } from "./product-details-content";
import type { ProductDetailsModalProps } from "@/types/product-details";
import { dialogVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function ProductDetailsDialog({
  isOpen,
  onClose,
  ...contentProps
}: Omit<ProductDetailsModalProps, 'productId' | 'children'> & React.ComponentProps<typeof ProductDetailsContent>) {
  const shouldReduceMotion = useReducedMotion();

  // Simplified variants for reduced motion
  const variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : dialogVariants;

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
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="dialog-content"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 min-h-0 flex flex-col"
            >
              <ProductDetailsContent
                {...contentProps}
                onClose={onClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
