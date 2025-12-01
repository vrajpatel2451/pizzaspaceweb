"use client";

import * as React from "react";
import { useCartStore } from "@/store/cart-store";
import { useDeviceStore } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { useAuthStore } from "@/store/auth-store";
import { getCart } from "@/lib/api/cart";

interface CartContextType {
  isInitialized: boolean;
  refetchCart: () => Promise<void>;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { selectedStore } = useStore();
  const { isAuthenticated, isHydrated: isAuthHydrated } = useAuthStore();
  const { deviceId, isHydrated: isDeviceHydrated, initializeDeviceId } = useDeviceStore();
  const { setItems, setLoading, setError, isHydrated: isCartHydrated } = useCartStore();

  // Track previous storeId to detect changes
  const prevStoreIdRef = React.useRef<string | null>(null);

  // Initialize device ID on mount
  React.useEffect(() => {
    if (isDeviceHydrated && !deviceId) {
      initializeDeviceId();
    }
  }, [isDeviceHydrated, deviceId, initializeDeviceId]);

  // Fetch cart function
  const fetchCart = React.useCallback(async () => {
    if (!deviceId || !selectedStore?._id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getCart(deviceId, selectedStore._id);

      if (response.statusCode === 200 && response.data) {
        setItems(response.data);
      } else {
        setError(response.errorMessage || "Failed to fetch cart");
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setError("An unexpected error occurred while fetching cart");
      setItems([]);
    } finally {
      setLoading(false);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [deviceId, selectedStore?._id, setItems, setLoading, setError, isInitialized]);

  // Fetch cart on mount and when dependencies change
  React.useEffect(() => {
    // Wait for all stores to be hydrated
    if (!isAuthHydrated || !isDeviceHydrated || !isCartHydrated) {
      return;
    }

    const currentStoreId = selectedStore?._id || null;

    // Check if store has changed
    const storeChanged = prevStoreIdRef.current !== null && prevStoreIdRef.current !== currentStoreId;

    // Update the ref
    prevStoreIdRef.current = currentStoreId;

    // Fetch cart if:
    // 1. Initial load (not initialized yet)
    // 2. Store has changed
    if (!isInitialized || storeChanged) {
      if (deviceId && currentStoreId) {
        fetchCart();
      } else {
        // No deviceId or storeId, mark as initialized anyway
        setIsInitialized(true);
      }
    }
  }, [
    isAuthHydrated,
    isDeviceHydrated,
    isCartHydrated,
    deviceId,
    selectedStore?._id,
    isInitialized,
    fetchCart,
  ]);

  // Refetch cart when user logs in/out
  React.useEffect(() => {
    if (isAuthHydrated && isInitialized && deviceId && selectedStore?._id) {
      fetchCart();
    }
  }, [isAuthenticated, isAuthHydrated, isInitialized, deviceId, selectedStore?._id, fetchCart]);

  const value = React.useMemo(
    () => ({
      isInitialized,
      refetchCart: fetchCart,
    }),
    [isInitialized, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
