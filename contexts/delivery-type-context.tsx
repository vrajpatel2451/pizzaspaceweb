"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useCartStore, useDeliveryType, useIsDeliveryTypeSelected, useCartItems } from "@/store/cart-store";
import type { OrderDeliveryType } from "@/types/cart";
import { useCartValidation } from "@/hooks/use-cart-validation";

/**
 * Delivery Type Context value
 */
interface DeliveryTypeContextValue {
  deliveryType: OrderDeliveryType;
  isDeliveryTypeSelected: boolean;
  showModal: boolean;
  pendingDeliveryType: OrderDeliveryType | null;
  showChangeDialog: boolean;
  affectedItemsForChange: Array<{ id: string; name: string }>;
  setDeliveryType: (type: OrderDeliveryType) => void;
  openModal: () => void;
  closeModal: () => void;
  initiateDeliveryTypeChange: (type: OrderDeliveryType) => void;
  confirmDeliveryTypeChange: () => void;
  cancelDeliveryTypeChange: () => void;
}

/**
 * Context
 */
const DeliveryTypeContext = createContext<DeliveryTypeContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface DeliveryTypeProviderProps {
  children: React.ReactNode;
}

/**
 * Delivery Type Provider Component
 *
 * Manages delivery type selection state and modal visibility.
 * Integrates with Zustand cart store for persistence.
 * Handles delivery type changes with cart item validation.
 */
export function DeliveryTypeProvider({ children }: DeliveryTypeProviderProps) {
  // Read from Zustand store
  const deliveryType = useDeliveryType();
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();
  const cartItems = useCartItems();

  // Get store actions
  const setDeliveryTypeAction = useCartStore((state) => state.setDeliveryType);
  const setDeliveryTypeSelectedAction = useCartStore((state) => state.setDeliveryTypeSelected);
  const removeItem = useCartStore((state) => state.removeItem);

  // Local modal state - initialize based on delivery type selection status
  const [showModal, setShowModal] = useState(() => !isDeliveryTypeSelected);

  // Delivery type change state
  const [pendingDeliveryType, setPendingDeliveryType] = useState<OrderDeliveryType | null>(null);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [affectedItemsForChange, setAffectedItemsForChange] = useState<Array<{ id: string; name: string }>>([]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Get items that would be affected by changing to a new delivery type
   * Uses a temporary delivery type check to simulate what validation would look like
   */
  const getAffectedItemsForNewDeliveryType = useCallback(
    async (newType: OrderDeliveryType): Promise<Array<{ id: string; name: string }>> => {
      // Import necessary functions
      const { getProductDetails } = await import("@/lib/api/products");
      const { productDetailsCache } = await import("@/lib/cache/product-details-cache");

      const affected: Array<{ id: string; name: string }> = [];

      for (const item of cartItems) {
        try {
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

          if (productDetails) {
            const availableTypes = productDetails.product.availableDeliveryTypes;

            // If product doesn't support the new delivery type, mark as affected
            if (availableTypes && availableTypes.length > 0 && !availableTypes.includes(newType)) {
              affected.push({
                id: item._id,
                name: productDetails.product.name,
              });
            }
          }
        } catch {
          // Fail silently - product will be treated as valid if check fails
        }
      }

      return affected;
    },
    [cartItems]
  );

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Set delivery type and mark as selected
   */
  const setDeliveryType = useCallback(
    (type: OrderDeliveryType) => {
      setDeliveryTypeAction(type);
      setDeliveryTypeSelectedAction(true);
    },
    [setDeliveryTypeAction, setDeliveryTypeSelectedAction]
  );

  /**
   * Open delivery type selection modal
   */
  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  /**
   * Close delivery type selection modal
   */
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  /**
   * Initiate delivery type change
   * Shows confirmation dialog if cart has items that would be affected
   */
  const initiateDeliveryTypeChange = useCallback(
    async (type: OrderDeliveryType) => {
      // If cart is empty or same type, change directly
      if (cartItems.length === 0 || type === deliveryType) {
        setDeliveryType(type);
        return;
      }

      // Check which items would be affected
      const affected = await getAffectedItemsForNewDeliveryType(type);

      // If no items are affected, change directly
      if (affected.length === 0) {
        setDeliveryType(type);
        return;
      }

      // Show confirmation dialog with affected items
      setPendingDeliveryType(type);
      setAffectedItemsForChange(affected);
      setShowChangeDialog(true);
    },
    [cartItems.length, deliveryType, setDeliveryType, getAffectedItemsForNewDeliveryType]
  );

  /**
   * Confirm delivery type change
   * Removes affected items and updates delivery type
   */
  const confirmDeliveryTypeChange = useCallback(() => {
    if (!pendingDeliveryType) return;

    // Remove all affected items from cart
    affectedItemsForChange.forEach((item) => {
      removeItem(item.id);
    });

    // Update delivery type
    setDeliveryType(pendingDeliveryType);

    // Reset state
    setPendingDeliveryType(null);
    setAffectedItemsForChange([]);
    setShowChangeDialog(false);
  }, [pendingDeliveryType, affectedItemsForChange, removeItem, setDeliveryType]);

  /**
   * Cancel delivery type change
   */
  const cancelDeliveryTypeChange = useCallback(() => {
    setPendingDeliveryType(null);
    setAffectedItemsForChange([]);
    setShowChangeDialog(false);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<DeliveryTypeContextValue>(
    () => ({
      deliveryType,
      isDeliveryTypeSelected,
      showModal,
      pendingDeliveryType,
      showChangeDialog,
      affectedItemsForChange,
      setDeliveryType,
      openModal,
      closeModal,
      initiateDeliveryTypeChange,
      confirmDeliveryTypeChange,
      cancelDeliveryTypeChange,
    }),
    [
      deliveryType,
      isDeliveryTypeSelected,
      showModal,
      pendingDeliveryType,
      showChangeDialog,
      affectedItemsForChange,
      setDeliveryType,
      openModal,
      closeModal,
      initiateDeliveryTypeChange,
      confirmDeliveryTypeChange,
      cancelDeliveryTypeChange,
    ]
  );

  return (
    <DeliveryTypeContext.Provider value={value}>
      {children}
    </DeliveryTypeContext.Provider>
  );
}

/**
 * Hook to use Delivery Type Context
 */
export function useDeliveryTypeContext(): DeliveryTypeContextValue {
  const context = useContext(DeliveryTypeContext);

  if (context === undefined) {
    throw new Error(
      "useDeliveryTypeContext must be used within a DeliveryTypeProvider"
    );
  }

  return context;
}
