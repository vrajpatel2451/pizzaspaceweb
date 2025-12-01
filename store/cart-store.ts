import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartResponse, CustomerBillingOnCart, OrderDeliveryType } from '@/types/cart';

const CART_STORAGE_KEY = 'pizzaspace-cart';

interface CartState {
  items: CartResponse[];
  summary: CustomerBillingOnCart | null;
  selectedDiscountIds: string[];
  deliveryType: OrderDeliveryType;
  selectedAddressId: string | null;
  isLoading: boolean;
  isSummaryLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  version: number; // Version tracking for force re-renders
}

interface CartActions {
  setItems: (items: CartResponse[]) => void;
  addItem: (item: CartResponse) => void;
  updateItem: (itemId: string, updates: Partial<CartResponse>) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
  setSummary: (summary: CustomerBillingOnCart | null) => void;
  setDeliveryType: (deliveryType: OrderDeliveryType) => void;
  setSelectedAddress: (addressId: string | null) => void;
  addDiscount: (discountId: string) => void;
  removeDiscount: (discountId: string) => void;
  setDiscounts: (discountIds: string[]) => void;
  clearDiscounts: () => void;
  setLoading: (isLoading: boolean) => void;
  setSummaryLoading: (isSummaryLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (isHydrated: boolean) => void;
  clearCart: () => void;
  getCartIds: () => string[];
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  summary: null,
  selectedDiscountIds: [],
  deliveryType: 'pickup',
  selectedAddressId: null,
  isLoading: false,
  isSummaryLoading: false,
  error: null,
  isHydrated: false,
  version: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setItems: (items) => set((state) => ({ items, version: state.version + 1 })),

      addItem: (item) => set((state) => {
        // Check if item already exists in cart (same itemId and variantId)
        const existingItemIndex = state.items.findIndex(
          (i) => i.itemId === item.itemId && i.variantId === item.variantId
        );

        if (existingItemIndex !== -1) {
          // Update existing item instead of adding duplicate
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = item;
          return { items: updatedItems, version: state.version + 1 };
        }

        // Add new item
        return { items: [...state.items, item], version: state.version + 1 };
      }),

      updateItem: (itemId, updates) => set((state) => ({
        items: state.items.map((item) =>
          item._id === itemId
            ? {
                ...item,
                ...updates,
                // Ensure nested objects are properly updated
                pricing: updates.pricing || item.pricing,
              }
            : item
        ),
        version: state.version + 1,
      })),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item._id !== itemId),
        version: state.version + 1,
      })),

      clearItems: () => set({ items: [] }),

      setSummary: (summary) => set({ summary }),

      setDeliveryType: (deliveryType) => set({ deliveryType }),

      setSelectedAddress: (addressId) => set({ selectedAddressId: addressId }),

      addDiscount: (discountId) => set((state) => ({
        selectedDiscountIds: state.selectedDiscountIds.includes(discountId)
          ? state.selectedDiscountIds
          : [...state.selectedDiscountIds, discountId],
      })),

      removeDiscount: (discountId) => set((state) => ({
        selectedDiscountIds: state.selectedDiscountIds.filter(
          (id) => id !== discountId
        ),
      })),

      setDiscounts: (discountIds) => set({ selectedDiscountIds: discountIds }),

      clearDiscounts: () => set({ selectedDiscountIds: [] }),

      setLoading: (isLoading) => set({ isLoading }),

      setSummaryLoading: (isSummaryLoading) => set({ isSummaryLoading }),

      setError: (error) => set({ error }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      clearCart: () => set({
        items: [],
        summary: null,
        selectedDiscountIds: [],
        error: null,
      }),

      getCartIds: () => get().items.map((item) => item._id),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist user preferences, NOT cart items (those come from API)
      partialize: (state) => ({
        selectedDiscountIds: state.selectedDiscountIds,
        deliveryType: state.deliveryType,
        selectedAddressId: state.selectedAddressId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartSummary = () => useCartStore((state) => state.summary);
export const useSelectedDiscountIds = () => useCartStore((state) => state.selectedDiscountIds);
export const useDeliveryType = () => useCartStore((state) => state.deliveryType);
export const useSelectedAddressId = () => useCartStore((state) => state.selectedAddressId);
export const useIsCartLoading = () => useCartStore((state) => state.isLoading);
export const useIsSummaryLoading = () => useCartStore((state) => state.isSummaryLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useIsCartHydrated = () => useCartStore((state) => state.isHydrated);
export const useCartCount = () => useCartStore((state) =>
  state.items.reduce((total, item) => total + item.quantity, 0)
);
