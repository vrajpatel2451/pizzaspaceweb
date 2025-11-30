"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductResponse } from "@/types";
import { ProductCard } from "@/components/home/menu-section/product-card";
import {
  productGridContainer,
  productGridItem,
  prefersReducedMotion,
} from "../animations";

interface ProductGridProps {
  products: ProductResponse[];
}

/**
 * ProductGrid - Client Component
 *
 * Renders the product grid using the existing ProductCard component.
 * Features:
 * - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
 * - Framer Motion stagger animation with AnimatePresence
 * - Smooth transitions when products change (filter/pagination)
 * - Respects prefers-reduced-motion accessibility setting
 * - Reuses existing ProductCard component from home page
 * - Priority loading for first 6 products (above-fold)
 * - Optimized sizes attribute for responsive images
 *
 * Performance Optimizations:
 * - React.memo to prevent unnecessary re-renders
 * - Priority prop for first 6 images (LCP optimization)
 * - Proper sizes attribute for responsive loading
 * - Lazy loading for below-fold images
 *
 * Animation Specs (from UX Design):
 * - Stagger: 50ms delay between cards
 * - Duration: 400ms base animation
 * - Easing: ease-out for natural deceleration
 * - Exit: Fade and scale down on removal
 */
export const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
  const shouldAnimate = !prefersReducedMotion();

  // Responsive sizes based on grid layout:
  // Mobile (xs): 2 cols = 50vw
  // Tablet (sm-md): 2 cols = 50vw
  // Desktop (lg+): 3 cols = 33vw
  const imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <motion.div
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
      variants={shouldAnimate ? productGridContainer : undefined}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? "visible" : false}
      role="list"
      aria-label={`Product grid showing ${products.length} items`}
      aria-live="polite"
      aria-busy="false"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            variants={shouldAnimate ? productGridItem : undefined}
            initial={shouldAnimate ? "hidden" : false}
            animate={shouldAnimate ? "visible" : false}
            exit={shouldAnimate ? "exit" : undefined}
            layout={shouldAnimate}
            role="listitem"
            className="h-full"
          >
            <ProductCard
              product={product}
              index={index}
              priority={index < 6}
              sizes={imageSizes}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});
