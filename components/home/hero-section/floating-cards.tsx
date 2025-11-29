"use client";

import { motion } from "framer-motion";
import { Star, Clock, Flame } from "lucide-react";

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  badge?: string;
  badgeColor?: "orange" | "green" | "red";
  gradientFrom: string;
  gradientTo: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.9,
    badge: "Best Seller",
    badgeColor: "orange",
    gradientFrom: "from-amber-200",
    gradientTo: "to-orange-400",
  },
  {
    id: "2",
    name: "Pepperoni Special",
    price: 14.99,
    rating: 4.8,
    badge: "Hot",
    badgeColor: "red",
    gradientFrom: "from-red-300",
    gradientTo: "to-orange-500",
  },
];

const badgeColors = {
  orange: "bg-primary text-white",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
};

function FloatingProductCard({
  product,
  delay = 0,
  className = "",
}: {
  product: FeaturedProduct;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="group relative"
      >
        <div className="relative bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/30 p-3 border border-gray-100/80 dark:border-navy-700 backdrop-blur-sm overflow-hidden">
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

          {/* Badge */}
          {product.badge && (
            <div
              className={`absolute -top-1 -right-1 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg ${badgeColors[product.badgeColor || "orange"]}`}
            >
              <span className="flex items-center gap-1">
                {product.badgeColor === "red" && <Flame className="w-3 h-3" />}
                {product.badge}
              </span>
            </div>
          )}

          {/* Product Image Placeholder */}
          <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo} dark:opacity-90`}>
            {/* Mini pizza placeholder */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-300 dark:to-yellow-400 flex items-center justify-center">
              <div className="w-[70%] h-[70%] rounded-full bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500 dark:to-red-600 relative">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300" />
                <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-red-600" />
                <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-red-600" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-2.5 space-y-1.5">
            <h4 className="text-sm font-semibold text-foreground truncate max-w-[100px] sm:max-w-[112px]">
              {product.name}
            </h4>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-muted-foreground">
                {product.rating}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeliveryBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="absolute bottom-[15%] left-[5%] lg:left-[10%]"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3.5,
          delay: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/30 px-4 py-3 border border-gray-100/80 dark:border-navy-700 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Delivery Time
              </p>
              <p className="text-lg font-bold text-foreground">30 min</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrdersBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 1.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="absolute top-[20%] right-[5%] lg:right-[8%]"
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/30 px-4 py-3 border border-gray-100/80 dark:border-navy-700 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 border-2 border-white dark:border-navy-800 flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-white">
                    {["J", "M", "S"][i - 1]}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">500+</p>
              <p className="text-[10px] font-medium text-muted-foreground">
                Orders Complete
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      {/* Product Cards */}
      <FloatingProductCard
        product={featuredProducts[0]}
        delay={0.5}
        className="top-[25%] right-[12%] lg:right-[15%] z-20"
      />
      <FloatingProductCard
        product={featuredProducts[1]}
        delay={0.7}
        className="bottom-[20%] right-[20%] lg:right-[25%] z-10"
      />

      {/* Info Badges */}
      <DeliveryBadge />
      <OrdersBadge />
    </div>
  );
}
