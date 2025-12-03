"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductResponse, CategoryResponse, PaginationMeta } from "@/types";
import { MenuTabs } from "./menu-tabs";
import { ProductGrid } from "./product-grid";
import { MenuSkeleton } from "./menu-skeleton";
import { cn } from "@/lib/utils";

interface MenuContentProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categories: CategoryResponse[];
  initialCategoryId?: string;
}

export function MenuContent({
  initialProducts,
  initialMeta,
  categories,
  initialCategoryId,
}: MenuContentProps) {
  const [activeCategory, setActiveCategory] = useState(
    initialCategoryId || "all"
  );
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = useCallback(async (categoryId: string) => {
    setActiveCategory(categoryId);
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
      if (!res.ok) throw new Error("Failed to fetch products");

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
    if (initialCategoryId && initialCategoryId !== activeCategory) {
      handleCategoryChange(initialCategoryId);
    }
  }, [initialCategoryId, activeCategory, handleCategoryChange]);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Category Tabs */}
      <MenuTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Grid */}
      <div className="relative">
        {loading ? (
          <div
            key="skeleton"
            className="animate-in fade-in-0 duration-200 motion-reduce:animate-none"
          >
            <MenuSkeleton />
          </div>
        ) : (
          <div
            key={`products-${activeCategory}`}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
          >
            <ProductGrid
              initialProducts={products}
              initialMeta={meta}
              categoryId={activeCategory === "all" ? undefined : activeCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
