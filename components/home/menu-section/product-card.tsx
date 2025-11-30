"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Flame, Sparkles, TrendingUp } from "lucide-react";
import { ProductResponse } from "@/types";
import { QuickAddButton } from "./quick-add-button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

interface ProductCardProps {
  product: ProductResponse;
  index?: number;
}

type BadgeType = "new" | "popular" | "spicy" | null;

function getBadgeType(product: ProductResponse): BadgeType {
  // Check tags for badge indicators
  const tags = product.tags?.map((t) => t.toLowerCase()) || [];

  if (tags.includes("new") || tags.includes("latest")) return "new";
  if (tags.includes("popular") || tags.includes("bestseller") || tags.includes("best seller")) return "popular";
  if (product.spiceLevel?.includes("2_chilli")) return "spicy";

  return null;
}

function ProductBadge({ type }: { type: BadgeType }) {
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
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg",
        config.className
      )}
      role="status"
      aria-label={`${config.label} item`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      <span>{config.label}</span>
    </motion.div>
  );
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}>
      <span className="sr-only">Rating: {rating.toFixed(1)} out of 5 stars</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasHalfStar
              ? "fill-amber-400/50 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          )}
          aria-hidden="true"
        />
      ))}
      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1" aria-hidden="true">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageUrl = product.photoList[0] || "/placeholder.jpg";
  const badgeType = getBadgeType(product);

  // Generate a pseudo-random rating based on product id for consistency
  const rating = 4 + (parseInt(product._id.slice(-2), 16) % 10) / 10;

  // Format size info
  const sizeInfo = product.dishSize
    ? `${product.dishSize.count} ${product.dishSize.unit}`
    : product.weight
    ? `${product.weight}g`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-500 border border-slate-100 dark:border-slate-800"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <ProductBadge type={badgeType} />

        {/* Product Image */}
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={imageUrl}
            alt={`${product.name}${badgeType ? ` - ${badgeType}` : ''}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />
        </motion.div>

        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Quick Add Button - Appears on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <QuickAddButton
            productId={product._id}
            productName={product.name}
            variant="icon"
          />
        </motion.div>
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

        {/* Price and Add Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-orange-500">
              {formatPrice(product.basePrice)}
            </span>
          </div>

          {/* Mobile Add Button - Always Visible */}
          <div className="sm:hidden">
            <QuickAddButton
              productId={product._id}
              productName={product.name}
              variant="icon"
            />
          </div>

          {/* Desktop Add Button - Full Width on Hover */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            className="hidden sm:block"
          >
            <QuickAddButton
              productId={product._id}
              productName={product.name}
              variant="icon"
            />
          </motion.div>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "inset 0 0 0 2px rgba(249, 115, 22, 0.3)",
        }}
      />
    </motion.article>
  );
}
