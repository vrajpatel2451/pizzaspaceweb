"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Flame, Sparkles, TrendingUp, Plus } from "lucide-react";
import { ProductResponse } from "@/types";
import { ProductDetailsContainer } from "@/components/product-details";
import { useDeliveryType } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { CustomImage } from "@/components/ui/custom-image";

interface ProductCardProps {
  product: ProductResponse;
  index?: number;
  priority?: boolean;
  sizes?: string;
}

type BadgeType = "new" | "popular" | "spicy" | null;

function getBadgeType(product: ProductResponse): BadgeType {
  // Check tags for badge indicators
  const tags = product.tags?.map((t) => t.toLowerCase()) || [];

  if (tags.includes("new") || tags.includes("latest")) return "new";
  if (
    tags.includes("popular") ||
    tags.includes("bestseller") ||
    tags.includes("best seller")
  )
    return "popular";
  if (product.spiceLevel?.includes("2_chilli")) return "spicy";

  return null;
}

function ProductBadge({
  type,
  isVisible,
}: {
  type: BadgeType;
  isVisible: boolean;
}) {
  if (!type) return null;

  const badgeConfig = {
    new: {
      icon: Sparkles,
      label: "New",
      className: "bg-emerald-500 text-white",
    },
    popular: {
      icon: TrendingUp,
      label: "Popular",
      className: "bg-orange-500 text-white",
    },
    spicy: {
      icon: Flame,
      label: "Spicy",
      className: "bg-red-500 text-white",
    },
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all duration-300",
        config.className,
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2.5",
      )}
      role="status"
      aria-label={`${config.label} item`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="sr-only">
        Rating: {rating.toFixed(1)} out of 5 stars
      </span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasHalfStar
                ? "fill-amber-400/50 text-amber-400"
                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700",
          )}
          aria-hidden="true"
        />
      ))}
      <span
        className="text-xs text-slate-500 dark:text-slate-400 ml-1"
        aria-hidden="true"
      >
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProductCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const deliveryType = useDeliveryType();

  const imageUrl = product.photoList[0] || "/placeholder.jpg";
  const badgeType = getBadgeType(product);

  // Show base price + product's packaging charges for delivery
  // (This is before variant selection, so we use product-level packaging)
  const displayPrice =
    deliveryType === "delivery"
      ? product.basePrice + (product.packagingCharges || 0)
      : product.basePrice;

  // Generate a pseudo-random rating based on product id for consistency
  const rating = 4 + (parseInt(product._id.slice(-2), 16) % 10) / 10;

  // Format size info
  const sizeInfo = product.dishSize
    ? `${product.dishSize.count} ${product.dishSize.unit}`
    : product.weight
      ? `${product.weight}g`
      : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay based on index for staggered animation
          setTimeout(() => {
            setIsVisible(true);
          }, index * 50);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  // Card content to be wrapped by ProductDetailsContainer
  const cardContent = (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        isHovered && "-translate-y-2",
      )}
      style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ProductBadge type={badgeType} isVisible={isVisible} />

        {/* Product Image */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-600 ease-out",
            isHovered && "scale-108",
          )}
        >
          <CustomImage
            src={imageUrl}
            alt={`${product.name}${badgeType ? ` - ${badgeType}` : ""}`}
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
            isHovered ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Size/Weight Info */}
        {sizeInfo && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-1.5">
            {sizeInfo}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-orange-500 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={rating} />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-orange-500">
              {formatPrice(displayPrice)}
            </span>
          </div>
          {/* Add Indicator on Mobile */}
          <div className="sm:hidden w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
            <Plus className="w-5 h-5" />
          </div>

          {/* Desktop Add Indicator */}
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-md">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
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
