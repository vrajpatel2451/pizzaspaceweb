"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "8",
        });

        if (activeCategory !== "all") {
          params.append("categoryId", activeCategory);
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
    };

    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      <MenuTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <MenuSkeleton />
      ) : (
        <ProductGrid
          initialProducts={products}
          initialMeta={meta}
          categoryId={activeCategory === "all" ? undefined : activeCategory}
        />
      )}
    </>
  );
}
