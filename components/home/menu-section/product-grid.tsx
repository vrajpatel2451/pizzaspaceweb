"use client";

import { useState } from "react";
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

export function ProductGrid({
  initialProducts,
  initialMeta,
  categoryId,
}: ProductGridProps) {
  // Ensure initialProducts is always an array
  const safeInitialProducts = Array.isArray(initialProducts) ? initialProducts : [];
  const [products, setProducts] = useState(safeInitialProducts);
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
      <div className="text-center py-16 sm:py-24 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
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
      </div>
    );
  }

  return (
    <>
      <div
        key={categoryId || "all"}
        id="menu-panel"
        role="tabpanel"
        aria-labelledby={categoryId ? `tab-${categoryId}` : "tab-all"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            className="animate-in fade-in-0 zoom-in-95 duration-500 motion-reduce:animate-none"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-10 animate-in fade-in-0 duration-300 motion-reduce:animate-none">
          <MenuSkeleton count={4} />
        </div>
      )}

      {/* Load More & View Full Menu */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none" style={{ animationDelay: "400ms" }}>
        {meta.hasNextPage && !loading && (
          <Button
            onClick={loadMore}
            size="lg"
            variant="outline"
            className="group min-w-[180px] border-2"
          >
            <span>Load More</span>
            <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" />
          </Button>
        )}

        <Button
          asChild
          size="lg"
          className="group min-w-[200px] bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 motion-reduce:transition-none"
        >
          <Link href="/menu">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </Button>
      </div>
    </>
  );
}
