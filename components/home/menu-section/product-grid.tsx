"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ProductResponse, PaginationMeta } from "@/types";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { MenuSkeleton } from "./menu-skeleton";
import Link from "next/link";

interface ProductGridProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categoryId?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function ProductGrid({
  initialProducts,
  initialMeta,
  categoryId,
}: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!meta.hasNextPage || loading) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(meta.currentPage + 1),
        limit: String(meta.itemsPerPage),
      });

      if (categoryId) {
        params.append("categoryId", categoryId);
      }

      const res = await fetch(`/api/products?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      setProducts((prev) => [...prev, ...data.data.data]);
      setMeta(data.data.meta);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 sm:py-24"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No dishes found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We couldn&apos;t find any dishes in this category. Try selecting a different
          category or check back later.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={categoryId || "all"}
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={categoryId ? `tab-${categoryId}` : "tab-all"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
        >
          {products.map((product, index) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-10"
        >
          <MenuSkeleton count={4} />
        </motion.div>
      )}

      {/* Load More & View Full Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16"
      >
        {meta.hasNextPage && !loading && (
          <Button
            onClick={loadMore}
            size="lg"
            variant="outline"
            className="group min-w-[180px] border-2"
          >
            <span>Load More</span>
            <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform" />
          </Button>
        )}

        <Button
          asChild
          size="lg"
          className="group min-w-[200px] bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
        >
          <Link href="/menu">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      {/* Results info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6"
      >
        Showing {products.length} of {meta.totalItems} dishes
      </motion.p>
    </>
  );
}
