"use client";

import { useState, useCallback, useRef } from "react";
import type { ProductDetailsResponse } from "@/types/product";
import { getProductDetails } from "@/lib/api/products";

/**
 * Hook to fetch product details
 * - Lazy fetch (only when called)
 * - Loading, error, data states
 * - Refetch capability
 * @param productId - The product ID to fetch
 * @param storeId - Optional store ID to include in the API request
 */
export function useProductDetails(productId: string, storeId?: string) {
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to always have latest values in callback without recreating it
  const productIdRef = useRef(productId);
  const storeIdRef = useRef(storeId);
  productIdRef.current = productId;
  storeIdRef.current = storeId;

  const refetch = useCallback(async () => {
    const currentProductId = productIdRef.current;
    const currentStoreId = storeIdRef.current;

    if (!currentProductId) {
      setError(new Error("Product ID is required"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductDetails(currentProductId, currentStoreId);

      if (response.statusCode === 200 && response.data) {
        setData(response.data);
        setError(null);
      } else {
        throw new Error(
          response.errorMessage || "Failed to load product details"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load product details";
      const error = new Error(errorMessage);
      setError(error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
