"use client";

import { useState } from "react";
import { ProductResponse, PaginationMeta } from "@/types";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { MenuSkeleton } from "./menu-skeleton";

interface ProductGridProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categoryId?: string;
}

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
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div
        id="menu-panel"
        role="tabpanel"
        aria-labelledby={categoryId ? `tab-${categoryId}` : "tab-all"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {loading && (
        <div className="mt-8">
          <MenuSkeleton />
        </div>
      )}

      {meta.hasNextPage && !loading && (
        <div className="text-center mt-8">
          <Button onClick={loadMore} size="lg" variant="outline">
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
