"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { useCartItems, useDeliveryType } from "@/store/cart-store";
import { CartResponse, OrderDeliveryType } from "@/types/cart";
import { ProductDetailsResponse } from "@/types/product";
import { getProductDetails } from "@/lib/api/products";
import { productDetailsCache } from "@/lib/cache/product-details-cache";

/**
 * Extended cart item with product details for validation
 */
interface CartItemWithProduct extends CartResponse {
  productDetails?: ProductDetailsResponse;
  availableDeliveryTypes?: OrderDeliveryType[];
}

/**
 * Cart validation result
 */
interface CartValidationResult {
  invalidItems: CartItemWithProduct[];
  validItems: CartItemWithProduct[];
  hasInvalidItems: boolean;
  isCartValid: boolean;
  invalidItemCount: number;
  isLoading: boolean;
}

/**
 * Hook to validate cart items against the selected delivery type
 *
 * This hook:
 * 1. Gets cart items from the cart store
 * 2. Gets the current delivery type from the cart store
 * 3. Fetches product details for each cart item to access availableDeliveryTypes
 * 4. Checks each cart item's availableDeliveryTypes against the selected delivery type
 * 5. Returns validation results
 *
 * @returns {CartValidationResult} Validation results including invalid/valid items
 */
export function useCartValidation(): CartValidationResult {
  const cartItems = useCartItems();
  const deliveryType = useDeliveryType();
  const [enrichedItems, setEnrichedItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track cart item IDs to avoid re-fetching on reference changes
  const cartItemIds = useMemo(
    () => cartItems.map(item => item._id).sort().join(','),
    [cartItems]
  );
  const prevCartIdsRef = useRef<string>('');

  // Fetch product details for all cart items
  useEffect(() => {
    // Skip if cart IDs haven't changed
    if (prevCartIdsRef.current === cartItemIds && enrichedItems.length > 0) {
      return;
    }
    prevCartIdsRef.current = cartItemIds;

    let cancelled = false;

    const fetchProductDetails = async () => {
      setIsLoading(true);

      try {
        const itemsWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            if (cancelled) return null;

            // Check cache first
            let productDetails = productDetailsCache.get(item.itemId);

            // Fetch from API if not in cache
            if (!productDetails) {
              const response = await getProductDetails(item.itemId);
              if (response.statusCode === 200 && response.data) {
                productDetails = response.data;
                productDetailsCache.set(item.itemId, response.data);
              }
            }

            const enrichedItem: CartItemWithProduct = {
              ...item,
              productDetails,
              availableDeliveryTypes: productDetails?.product.availableDeliveryTypes,
            };

            return enrichedItem;
          })
        );

        if (!cancelled) {
          setEnrichedItems(itemsWithProducts.filter((item): item is CartItemWithProduct => item !== null));
        }
      } catch {
        if (!cancelled) {
          // Set items without product details on error (fail open)
          setEnrichedItems(cartItems.map(item => ({ ...item })));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setEnrichedItems([]);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [cartItemIds, cartItems, enrichedItems.length]);

  // Validate cart items based on delivery type
  const validationResult = useMemo<CartValidationResult>(() => {
    const invalidItems: CartItemWithProduct[] = [];
    const validItems: CartItemWithProduct[] = [];

    enrichedItems.forEach((item) => {
      // If product details are missing or availableDeliveryTypes is undefined,
      // treat the item as valid (fail open) to avoid blocking checkout
      if (!item.availableDeliveryTypes || item.availableDeliveryTypes.length === 0) {
        validItems.push(item);
        return;
      }

      // Check if the selected delivery type is in the product's available delivery types
      const isValid = item.availableDeliveryTypes.includes(deliveryType);

      if (isValid) {
        validItems.push(item);
      } else {
        invalidItems.push(item);
      }
    });

    const hasInvalidItems = invalidItems.length > 0;
    const isCartValid = !hasInvalidItems;
    const invalidItemCount = invalidItems.length;

    return {
      invalidItems,
      validItems,
      hasInvalidItems,
      isCartValid,
      invalidItemCount,
      isLoading,
    };
  }, [enrichedItems, deliveryType, isLoading]);

  return validationResult;
}
