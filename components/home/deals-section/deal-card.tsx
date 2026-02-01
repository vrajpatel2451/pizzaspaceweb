"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Zap } from "lucide-react";
import { ProductResponse } from "@/types";
import { ProductDetailsContainer } from "@/components/product-details";
import { useDeliveryType } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { CustomImage } from "@/components/ui/custom-image";

interface DealCardProps {
  product: ProductResponse;
  index?: number;
  priority?: boolean;
  sizes?: string;
}

export function DealCard({
  product,
  index = 0,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: DealCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const deliveryType = useDeliveryType();

  const imageUrl = product.photoList[0] || "/placeholder.jpg";

  const displayPrice =
    deliveryType === "delivery"
      ? product.basePrice + (product.packagingCharges || 0)
      : product.basePrice;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 60);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const cardContent = (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        isHovered && "-translate-y-2"
      )}
      style={{ transitionDelay: isVisible ? `${index * 60}ms` : "0ms" }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* Deal Badge */}
        <div
          className={cn(
            "absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all duration-300",
            "bg-red-500 text-white",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2.5"
          )}
          role="status"
          aria-label="Hot Deal item"
        >
          <Zap className="w-3 h-3 fill-white" aria-hidden="true" />
          <span>Hot Deal</span>
        </div>

        {/* Product Image */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-600 ease-out",
            isHovered && "scale-108"
          )}
        >
          <CustomImage
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        {/* Gradient Overlay on Hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Product Name */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-orange-500 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-xl sm:text-2xl font-bold text-orange-500">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {/* Add To Cart Button */}
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            "bg-orange-500 text-white",
            "hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/20",
            "active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          Add To Cart
        </button>
      </div>

      {/* Subtle border glow on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow: "inset 0 0 0 2px rgba(249, 115, 22, 0.3)",
        }}
      />
    </article>
  );

  return (
    <ProductDetailsContainer productId={product._id} trigger={cardContent} />
  );
}
