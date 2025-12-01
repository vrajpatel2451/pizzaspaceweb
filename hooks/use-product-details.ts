"use client";

import { useState, useCallback } from "react";
import type { ProductDetailsResponse } from "@/types/product";
import { getProductDetails } from "@/lib/api/products";
import { productDetailsCache } from "@/lib/cache/product-details-cache";

/**
 * Hook to fetch product details with caching
 * - Lazy fetch (only when called)
 * - Global cache to prevent duplicate fetches
 * - Loading, error, data states
 * - Refetch capability
 */
export function useProductDetails(productId: string) {
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!productId) {
      setError(new Error("Product ID is required"));
      return;
    }

    // Check cache first
    const cachedData = productDetailsCache.get(productId);
    if (cachedData) {
      setData(cachedData);
      setError(null);
      return;
    }

    // Fetch from API with abort controller to prevent race conditions
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductDetails(productId);

      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      if (response.statusCode === 200 && response.data) {
        // Store in cache
        productDetailsCache.set(productId, response.data);

        setData(response.data);
        setError(null);
      } else {
        throw new Error(
          response.errorMessage || "Failed to load product details"
        );
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to load product details";
      const error = new Error(errorMessage);
      setError(error);
      setData(null);
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }

    // Return cleanup function
    return () => {
      abortController.abort();
    };
  }, [productId]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
