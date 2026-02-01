"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Zap } from "lucide-react";
import { ProductResponse } from "@/types";
import { ProductDetailsContainer } from "@/components/product-details";
import { useDeliveryType } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { CustomImage } from "@/components/ui/custom-image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const cardRef = useRef<HTMLDivElement>(null);
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
    <Card
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-500 border-slate-800 bg-slate-900 text-white",
        "hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        isHovered && "-translate-y-1"
      )}
      style={{ transitionDelay: isVisible ? `${index * 60}ms` : "0ms" }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Deal Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-orange-500 text-white border-0 shadow-lg shadow-red-500/20",
            "transition-all duration-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          )}
        >
          <Zap className="w-3 h-3 mr-1 fill-white" />
          Hot Deal
        </Badge>

        {/* Product Image */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-600 ease-out",
            isHovered && "scale-105"
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {/* Quick Add on Hover */}
        <div
          className={cn(
            "absolute bottom-3 right-3 w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg transition-all duration-300",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <Plus className="w-4 h-4" />
        </div>
      </div>

      <CardContent className="p-4 pb-2">
        {/* Product Name */}
        <h3 className="font-bold text-base text-white mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-2">
        <button
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
            "bg-orange-500 text-white",
            "hover:bg-orange-400 hover:shadow-md hover:shadow-orange-500/20",
            "active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          Order Now
        </button>
      </CardFooter>

      {/* Hover border glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow: "inset 0 0 0 2px rgba(249, 115, 22, 0.3)",
        }}
      />
    </Card>
  );

  return (
    <ProductDetailsContainer productId={product._id} trigger={cardContent} />
  );
}
