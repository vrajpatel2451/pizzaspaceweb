'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProductDetails } from '@/lib/api/products';
import { ProductDetailsResponse } from '@/types';

/**
 * Hook to fetch product details including variants and addons
 * @param itemId - Product ID to fetch details for
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 */
export function useProductDetails(itemId: string, autoFetch: boolean = true) {
  const [data, setData] = useState<ProductDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!itemId) {
      setError('Product ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductDetails(itemId);

      if (response.statusCode === 200 && response.data) {
        setData(response.data);
      } else {
        const errorMsg = response.errorMessage || 'Failed to fetch product details';
        setError(errorMsg);
        setData(null);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred while fetching product details';
      setError(errorMsg);
      setData(null);
      console.error('Product details fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  // Auto-fetch product details on mount if enabled
  useEffect(() => {
    if (autoFetch && itemId) {
      const timer = setTimeout(() => {
        fetchDetails();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFetch, itemId, fetchDetails]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDetails,
  };
}
