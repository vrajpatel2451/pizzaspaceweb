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
}

export function DealCard({ product, index = 0, priority = false }: DealCardProps) {
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
          setTimeout(() => setIsVisible(true), index * 80);
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
        "group relative flex-shrink-0 w-[280px] sm:w-[320px] bg-slate-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
        "shadow-lg shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/20",
        "border border-slate-800 hover:border-orange-500/40",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
    >
      {/* Deal Ribbon */}
      <div className="absolute top-4 -left-8 z-20 rotate-[-35deg]">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-10 py-1 shadow-lg">
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">
            Deal
          </span>
        </div>
      </div>

      {/* Lightning Badge */}
      <div
        className={cn(
          "absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
          "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/30",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75",
          "transition-all duration-500"
        )}
        style={{ transitionDelay: isVisible ? `${index * 80 + 200}ms` : "0ms" }}
      >
        <Zap className="w-3 h-3 fill-yellow-900" />
        <span>Hot</span>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 ease-out",
            isHovered && "scale-110"
          )}
        >
          <CustomImage
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="320px"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />

        {/* Price on image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
              {formatPrice(displayPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-base sm:text-lg text-white mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-4 min-h-[2rem]">
          {product.description}
        </p>

        {/* CTA Button */}
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            "bg-gradient-to-r from-orange-500 to-red-500 text-white",
            "hover:from-orange-400 hover:to-red-400 hover:shadow-lg hover:shadow-orange-500/25",
            "active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Order Now</span>
        </button>
      </div>

      {/* Hover glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow: "inset 0 0 0 2px rgba(249, 115, 22, 0.4)",
        }}
      />
    </article>
  );

  return (
    <ProductDetailsContainer productId={product._id} trigger={cardContent} />
  );
}
