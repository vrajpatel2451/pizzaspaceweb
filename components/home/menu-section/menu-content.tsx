"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductResponse, CategoryResponse, PaginationMeta } from "@/types";
import { MenuTabs } from "./menu-tabs";
import { ProductGrid } from "./product-grid";
import { MenuSkeleton } from "./menu-skeleton";

interface MenuContentProps {
  initialProducts: ProductResponse[];
  categories: CategoryResponse[];
  initialMeta: PaginationMeta;
}

export function MenuContent({
  initialProducts,
  categories,
  initialMeta,
}: MenuContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchProducts = useCallback(async (categoryId: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "8",
      });

      if (categoryId !== "all") {
        params.append("categoryId", categoryId);
      }

      const res = await fetch(`/api/products?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      setProducts(data.data.data);
      setMeta(data.data.meta);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip initial fetch since we already have data from server
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    fetchProducts(activeCategory);
  }, [activeCategory, fetchProducts, isInitialRender]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;
    setActiveCategory(categoryId);
  };

  return (
    <div className="relative">
      {/* Category Tabs */}
      <MenuTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MenuSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={`products-${activeCategory}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ProductGrid
              initialProducts={products}
              initialMeta={meta}
              categoryId={activeCategory === "all" ? undefined : activeCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
