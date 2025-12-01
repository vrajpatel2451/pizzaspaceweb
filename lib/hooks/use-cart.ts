"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  getCartSummary,
} from "@/lib/api/cart";
import { useCartStore } from "@/store/cart-store";
import {
  AddToCartPayload,
  CartResponse,
  CustomerBillingOnCart,
  PricingForCartParams,
  UpdateCartPayload,
} from "@/types";

/**
 * Hook to fetch and manage cart items
 * @param deviceId - Unique device identifier for session tracking
 * @param storeId - Store identifier
 * @param autoFetch - Whether to automatically fetch cart on mount (default: true)
 */
export function useCart(
  deviceId: string,
  storeId: string,
  autoFetch: boolean = true
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setItems, items, setLoading: setStoreLoading } = useCartStore();

  const fetchCart = useCallback(async () => {
    if (!deviceId || !storeId) {
      return;
    }

    setIsLoading(true);
    setStoreLoading(true);
    setError(null);

    try {
      const response = await getCart(deviceId, storeId);

      if (response.statusCode === 200 && response.data) {
        setItems(response.data);
      } else {
        const errorMsg = response.errorMessage || "Failed to fetch cart";
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while fetching cart";
      setError(errorMsg);
      console.error("Cart fetch error:", err);
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
    }
  }, [deviceId, storeId, setItems, setStoreLoading]);

  // Auto-fetch cart on mount if enabled
  useEffect(() => {
    if (autoFetch && deviceId && storeId) {
      // Wrap in setTimeout to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        fetchCart();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFetch, deviceId, storeId, fetchCart]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchCart,
  };
}

/**
 * Hook to add items to cart
 * @param refetchOnSuccess - Whether to refetch the entire cart after successful add (default: false)
 */
export function useAddToCart(refetchOnSuccess: boolean = false) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, setItems, setLoading: setStoreLoading } = useCartStore();

  const mutate = useCallback(
    async (data: AddToCartPayload) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await addToCart(data);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          addItem(response.data);
          toast.success("Item added to cart");

          // Optionally refetch entire cart for consistency
          if (refetchOnSuccess) {
            try {
              const cartResponse = await getCart(data.sessionId, data.storeId);
              if (cartResponse.statusCode === 200 && cartResponse.data) {
                setItems(cartResponse.data);
              }
            } catch (refetchError) {
              console.error("Failed to refetch cart after add:", refetchError);
              // Don't fail the operation if refetch fails
            }
          }

          return { success: true, data: response.data };
        } else {
          const errorMsg =
            response.errorMessage || "Failed to add item to cart";
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = "An unexpected error occurred";
        toast.error(errorMsg);
        console.error("Add to cart error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [addItem, setItems, setStoreLoading, refetchOnSuccess]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to update cart items
 * @param refetchOnSuccess - Whether to refetch the entire cart after successful update (default: false)
 */
export function useUpdateCartItem(refetchOnSuccess: boolean = false) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateItem, setItems, setLoading: setStoreLoading } = useCartStore();

  const mutate = useCallback(
    async (id: string, data: UpdateCartPayload, storeId?: string) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await updateCart(id, data);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          updateItem(id, response.data);
          toast.success("Cart updated");

          // Optionally refetch entire cart for consistency
          if (refetchOnSuccess && data.sessionId && storeId) {
            try {
              const cartResponse = await getCart(data.sessionId, storeId);
              if (cartResponse.statusCode === 200 && cartResponse.data) {
                setItems(cartResponse.data);
              }
            } catch (refetchError) {
              console.error(
                "Failed to refetch cart after update:",
                refetchError
              );
              // Don't fail the operation if refetch fails
            }
          }

          return { success: true, data: response.data };
        } else {
          const errorMsg = response.errorMessage || "Failed to update cart";
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = "An unexpected error occurred";
        toast.error(errorMsg);
        console.error("Update cart error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [updateItem, setItems, setStoreLoading, refetchOnSuccess]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to remove items from cart
 * @param refetchOnSuccess - Whether to refetch the entire cart after successful removal (default: false)
 */
export function useRemoveCartItem(refetchOnSuccess: boolean = false) {
  const [isLoading, setIsLoading] = useState(false);
  const { removeItem, setItems, setLoading: setStoreLoading } = useCartStore();

  const mutate = useCallback(
    async (id: string, deviceId: string, storeId?: string) => {
      setIsLoading(true);
      setStoreLoading(true);

      try {
        const response = await removeFromCart(id, deviceId);

        if (response.statusCode === 200 && response.data) {
          // Optimistically update the store
          removeItem(id);
          toast.success("Item removed from cart");

          // Optionally refetch entire cart for consistency
          if (refetchOnSuccess && deviceId && storeId) {
            try {
              const cartResponse = await getCart(deviceId, storeId);
              if (cartResponse.statusCode === 200 && cartResponse.data) {
                setItems(cartResponse.data);
              }
            } catch (refetchError) {
              console.error(
                "Failed to refetch cart after remove:",
                refetchError
              );
              // Don't fail the operation if refetch fails
            }
          }

          return { success: true };
        } else {
          const errorMsg = response.errorMessage || "Failed to remove item";
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = "An unexpected error occurred";
        toast.error(errorMsg);
        console.error("Remove from cart error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    },
    [removeItem, setItems, setStoreLoading, refetchOnSuccess]
  );

  return {
    mutate,
    isLoading,
  };
}

/**
 * Hook to fetch cart summary with auto-refetch on cart/discount/delivery changes
 * Implements debouncing to prevent API spam during rapid changes
 * @param params - Cart summary parameters
 * @param autoFetch - Whether to automatically fetch summary on mount/changes (default: true)
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 */
export function useCartSummary(
  params: Omit<PricingForCartParams, "cartIds">,
  autoFetch: boolean = true,
  debounceMs: number = 300
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    items,
    summary,
    setSummary,
    selectedDiscountIds,
    deliveryType,
    selectedAddressId,
    setSummaryLoading,
    getCartIds,
  } = useCartStore();

  const fetchSummary = useCallback(async () => {
    const cartIds = getCartIds();

    // Don't fetch if there are no cart items
    if (cartIds.length === 0) {
      setSummary(null);
      return;
    }

    if (!params.storeId) {
      return;
    }

    setIsLoading(true);
    setSummaryLoading(true);
    setError(null);

    try {
      const requestParams: PricingForCartParams = {
        cartIds,
        storeId: params.storeId,
        discountIds:
          selectedDiscountIds.length > 0 ? selectedDiscountIds : undefined,
        deliveryType: deliveryType || undefined,
        addressId: selectedAddressId || undefined,
      };

      const response = await getCartSummary(requestParams);

      if (response.statusCode === 201 && response.data) {
        setSummary(response.data);
      } else {
        const errorMsg =
          response.errorMessage || "Failed to fetch cart summary";
        setError(errorMsg);
        setSummary(null);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while fetching summary";
      setError(errorMsg);
      setSummary(null);
      console.error("Cart summary error:", err);
    } finally {
      setIsLoading(false);
      setSummaryLoading(false);
    }
  }, [
    getCartIds,
    params.storeId,
    selectedDiscountIds,
    deliveryType,
    selectedAddressId,
    setSummary,
    setSummaryLoading,
  ]);

  // Auto-fetch summary when dependencies change with debouncing
  useEffect(() => {
    if (!autoFetch || !params.storeId) {
      return;
    }

    // Debounce the fetch to prevent API spam during rapid changes
    const debounceTimer = setTimeout(() => {
      fetchSummary();
    }, debounceMs);

    return () => clearTimeout(debounceTimer);
  }, [
    autoFetch,
    params.storeId,
    // Trigger when cart items change (using JSON.stringify for deep comparison)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(items.map((item) => ({ id: item._id, qty: item.quantity }))),
    // Trigger when discounts change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(selectedDiscountIds),
    deliveryType,
    selectedAddressId,
    debounceMs,
    fetchSummary,
  ]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}
