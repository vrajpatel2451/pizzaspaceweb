"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Drawer } from "@/components/ui/drawer";
import { ProductDetailsContent } from "./product-details-content";
import type { ProductDetailsModalProps } from "@/types/product-details";
import { bottomsheetVariants } from "@/lib/animations";

export function ProductDetailsBottomsheet({
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
    : bottomsheetVariants;

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
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="bottomsheet-content"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <ProductDetailsContent
                {...contentProps}
                onClose={onClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Drawer>
  );
}
