"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getDiscounts } from "@/lib/api/discount";
import { useDiscountStore } from "@/store/discount-store";
import { useCartStore } from "@/store/cart-store";
import { DiscountResponse, GetApplicableDiscountsParams } from "@/types";

/**
 * Hook to fetch available discounts for cart items
 * @param cartIds - Array of cart item IDs
 * @param storeId - Store identifier
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 */
export function useAvailableDiscounts(
  cartIds: string[],
  storeId: string,
  autoFetch: boolean = true
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    availableDiscounts,
    setDiscounts,
    setLoading: setStoreLoading,
  } = useDiscountStore();

  const fetchDiscounts = useCallback(async () => {
    // Don't fetch if there are no cart items
    if (cartIds.length === 0 || !storeId) {
      setDiscounts([]);
      return;
    }

    setIsLoading(true);
    setStoreLoading(true);
    setError(null);

    try {
      const params: GetApplicableDiscountsParams = {
        cartIds,
        storeId,
      };

      const response = await getDiscounts(params);

      if (response.statusCode === 201 && response.data) {
        setDiscounts(response.data);
      } else {
        const errorMsg = response.errorMessage || "Failed to fetch discounts";
        setError(errorMsg);
        setDiscounts([]);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while fetching discounts";
      setError(errorMsg);
      setDiscounts([]);
      console.error("Fetch discounts error:", err);
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  }, [cartIds, storeId, setDiscounts, setStoreLoading]);

  // Auto-fetch on mount or when cart items change
  useEffect(() => {
    if (autoFetch && storeId) {
      // Wrap in setTimeout to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        fetchDiscounts();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFetch, cartIds.length, storeId, fetchDiscounts]);

  return {
    discounts: availableDiscounts,
    isLoading,
    error,
    refetch: fetchDiscounts,
  };
}

/**
 * Hook to search discounts with debounce
 * @param cartIds - Array of cart item IDs
 * @param storeId - Store identifier
 * @param search - Search query string
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 */
export function useSearchDiscounts(
  cartIds: string[],
  storeId: string,
  search: string = "",
  debounceMs: number = 300
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<DiscountResponse[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  const searchDiscounts = useCallback(async () => {
    // Don't search if there are no cart items
    if (cartIds.length === 0 || !storeId) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params: GetApplicableDiscountsParams = {
        cartIds,
        storeId,
        search: debouncedSearch || undefined,
      };

      const response = await getDiscounts(params);

      if (response.statusCode === 201 && response.data) {
        setSearchResults(response.data);
      } else {
        const errorMsg = response.errorMessage || "Failed to search discounts";
        setError(errorMsg);
        setSearchResults([]);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while searching";
      setError(errorMsg);
      setSearchResults([]);
      console.error("Search discounts error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cartIds, storeId, debouncedSearch]);

  // Trigger search when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== undefined && storeId) {
      // Wrap in setTimeout to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        searchDiscounts();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearch, cartIds.length, storeId, searchDiscounts]);

  return {
    results: searchResults,
    isLoading,
    error,
    refetch: searchDiscounts,
  };
}

/**
 * Hook to apply a discount to the cart
 */
export function useApplyDiscount() {
  const [isLoading, setIsLoading] = useState(false);
  const { addDiscount, selectedDiscountIds } = useCartStore();
  const { closeModal } = useDiscountStore();

  const mutate = useCallback(
    async (discountId: string, discountCode?: string) => {
      // Check if discount is already applied
      if (selectedDiscountIds.includes(discountId)) {
        toast.info("This discount is already applied");
        return { success: false, error: "Discount already applied" };
      }

      setIsLoading(true);

      try {
        // Add discount to cart store
        addDiscount(discountId);

        const message = discountCode
          ? `Discount "${discountCode}" applied`
          : "Discount applied successfully";

        toast.success(message);
        closeModal();

        return { success: true };
      } catch (err) {
        const errorMsg = "Failed to apply discount";
        toast.error(errorMsg);
        console.error("Apply discount error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [addDiscount, selectedDiscountIds, closeModal]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to remove a discount from the cart
 */
export function useRemoveDiscount() {
  const [isLoading, setIsLoading] = useState(false);
  const { removeDiscount } = useCartStore();

  const mutate = useCallback(
    async (discountId: string, discountCode?: string) => {
      setIsLoading(true);

      try {
        // Remove discount from cart store
        removeDiscount(discountId);

        const message = discountCode
          ? `Discount "${discountCode}" removed`
          : "Discount removed";

        toast.success(message);

        return { success: true };
      } catch (err) {
        const errorMsg = "Failed to remove discount";
        toast.error(errorMsg);
        console.error("Remove discount error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [removeDiscount]
  );

  return {
    mutate,
    isLoading,
  };
}
