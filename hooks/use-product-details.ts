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
 * @param productId - The product ID to fetch
 * @param storeId - Optional store ID to include in the API request
 */
export function useProductDetails(productId: string, storeId?: string) {
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create cache key that includes storeId if provided
  const cacheKey = storeId ? `${productId}:${storeId}` : productId;

  const refetch = useCallback(async () => {
    if (!productId) {
      setError(new Error("Product ID is required"));
      return;
    }

    // Check cache first
    const cachedData = productDetailsCache.get(cacheKey);
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
      const response = await getProductDetails(productId, storeId);

      // Check if the request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      if (response.statusCode === 200 && response.data) {
        // Store in cache
        productDetailsCache.set(cacheKey, response.data);

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
  }, [productId, storeId, cacheKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
