"use client";

import { memo, useState, useEffect } from "react";
import { ProductResponse } from "@/types";
import { ProductCard } from "@/components/home/menu-section/product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductResponse[];
  isPending?: boolean;
}

/**
 * ProductGrid - Client Component
 *
 * Renders the product grid using the existing ProductCard component.
 * Features:
 * - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
 * - CSS stagger animation
 * - Smooth transitions when products change (filter/pagination)
 * - Respects prefers-reduced-motion accessibility setting
 * - Reuses existing ProductCard component from home page
 * - Priority loading for first 6 products (above-fold)
 * - Optimized sizes attribute for responsive images
 */
export const ProductGrid = memo(function ProductGrid({ products, isPending = false }: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger visibility animation on products change
  useEffect(() => {
    setIsVisible(false);
    requestAnimationFrame(() => setIsVisible(true));
  }, [products]);

  // Responsive sizes based on grid layout:
  // Mobile (xs): 2 cols = 50vw
  // Tablet (sm-md): 2 cols = 50vw
  // Desktop (lg+): 3 cols = 33vw
  const imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div className="relative">
      <div
        className={cn(
          "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6",
          "transition-opacity duration-300 motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        role="list"
        aria-label={`Product grid showing ${products.length} items`}
        aria-live="polite"
        aria-busy={isPending ? "true" : "false"}
        aria-atomic="false"
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            role="listitem"
            className={cn(
              "h-full transition-all duration-400 motion-reduce:transition-none",
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
            )}
            style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
          >
            <ProductCard
              product={product}
              index={index}
              priority={index < 6}
              sizes={imageSizes}
            />
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10 transition-opacity duration-200"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-3">
            {/* Spinner */}
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-foreground">Loading products...</p>
          </div>
        </div>
      )}
    </div>
  );
});
