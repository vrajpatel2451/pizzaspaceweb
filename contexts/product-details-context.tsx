"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type { ProductDetailsResponse } from "@/types/product";
import { calculateTotalPrice } from "@/lib/utils/price-calculator";
import { validateSelections } from "@/lib/utils/product-validation";

/**
 * Addon selection state
 */
interface AddonSelection {
  selected: boolean;
  quantity: number;
}

/**
 * Product Details Context value
 */
interface ProductDetailsContextValue {
  // Product data
  productId: string | null;
  productData: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;

  // Selection state
  selectedVariants: Map<string, string>; // groupId -> variantId
  selectedAddons: Map<string, AddonSelection>; // addonId -> {selected, quantity}
  quantity: number;

  // Computed
  totalPrice: number;
  isValid: boolean;
  validationErrors: string[];

  // Actions
  openProductDetails: (productId: string) => void;
  closeProductDetails: () => void;
  selectVariant: (groupId: string, variantId: string) => void;
  toggleAddon: (addonId: string) => void;
  setAddonQuantity: (addonId: string, quantity: number) => void;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;
}

/**
 * Context
 */
const ProductDetailsContext = createContext<
  ProductDetailsContextValue | undefined
>(undefined);

/**
 * Provider Props
 */
interface ProductDetailsProviderProps {
  children: React.ReactNode;
  initialData?: ProductDetailsResponse | null;
  onAddToCart?: (cartData: {
    productId: string;
    selectedVariants: Map<string, string>;
    selectedAddons: Map<string, AddonSelection>;
    quantity: number;
    totalPrice: number;
  }) => void;
}

/**
 * Product Details Provider Component
 */
export function ProductDetailsProvider({
  children,
  initialData = null,
  onAddToCart,
}: ProductDetailsProviderProps) {
  // Product state
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] =
    useState<ProductDetailsResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // CRITICAL: Sync productData when initialData changes from parent
  useEffect(() => {
    if (initialData) {
      setProductData(initialData);
    }
  }, [initialData]);

  // Selection state
  const [selectedVariants, setSelectedVariants] = useState<
    Map<string, string>
  >(new Map());
  const [selectedAddons, setSelectedAddons] = useState<
    Map<string, AddonSelection>
  >(new Map());
  const [quantity, setQuantity] = useState(1);

  // Auto-select first primary variant when data loads
  // Only run when productData changes to avoid infinite loop
  useEffect(() => {
    if (!productData) return;

    const primaryGroup = productData.variantGroupList.find((g) => g.isPrimary);
    if (!primaryGroup) return;

    // Use functional update to avoid stale closure
    setSelectedVariants((prev) => {
      // Check if already selected
      if (prev.has(primaryGroup._id)) return prev;

      // Find first variant in this group
      const firstVariant = productData.variantList.find(
        (v) => v.groupId === primaryGroup._id
      );

      if (firstVariant) {
        const next = new Map(prev);
        next.set(primaryGroup._id, firstVariant._id);
        return next;
      }

      return prev;
    });
  }, [productData]);

  // Actions
  const openProductDetails = useCallback((id: string) => {
    setProductId(id);
    setIsLoading(true);
    // In a real implementation, this would trigger data fetching
  }, []);

  const closeProductDetails = useCallback(() => {
    setProductId(null);
    setProductData(null);
    setSelectedVariants(new Map());
    setSelectedAddons(new Map());
    setQuantity(1);
    setError(null);
  }, []);

  const selectVariant = useCallback((groupId: string, variantId: string) => {
    setSelectedVariants((prev) => {
      const next = new Map(prev);
      next.set(groupId, variantId);
      return next;
    });
  }, []);

  const toggleAddon = useCallback((addonId: string) => {
    setSelectedAddons((prev) => {
      const next = new Map(prev);
      const currentSelection = next.get(addonId);

      if (currentSelection?.selected) {
        // Deselect
        next.set(addonId, { selected: false, quantity: 0 });
      } else {
        // Select with quantity 1
        next.set(addonId, { selected: true, quantity: 1 });
      }

      return next;
    });
  }, []);

  const setAddonQuantity = useCallback((addonId: string, quantity: number) => {
    setSelectedAddons((prev) => {
      const next = new Map(prev);

      if (quantity <= 0) {
        // Deselect if quantity is 0 or negative
        next.set(addonId, { selected: false, quantity: 0 });
      } else {
        // Update quantity and mark as selected
        next.set(addonId, { selected: true, quantity });
      }

      return next;
    });
  }, []);

  // Computed: Total Price
  const totalPrice = useMemo(() => {
    if (!productData) return 0;

    return calculateTotalPrice({
      basePrice: productData.product.basePrice,
      selectedVariants,
      selectedAddons,
      variantList: productData.variantList,
      variantGroupList: productData.variantGroupList,
      addonList: productData.addonList,
      pricing: productData.pricing,
      quantity,
    });
  }, [productData, selectedVariants, selectedAddons, quantity]);

  // Computed: Validation
  const validation = useMemo(() => {
    if (!productData) {
      return { isValid: false, errors: [] };
    }

    return validateSelections({
      selectedVariants,
      selectedAddons,
      variantGroupList: productData.variantGroupList,
      addonGroupList: productData.addonGroupList,
      addonList: productData.addonList,
      quantity,
    });
  }, [productData, selectedVariants, selectedAddons, quantity]);

  // Add to cart action (must be after totalPrice is computed)
  const addToCart = useCallback(() => {
    if (!productData || !onAddToCart) return;

    onAddToCart({
      productId: productData.product._id,
      selectedVariants,
      selectedAddons,
      quantity,
      totalPrice,
    });
  }, [productData, selectedVariants, selectedAddons, quantity, totalPrice, onAddToCart]);

  // Context value - Memoized to prevent unnecessary re-renders
  const value = useMemo<ProductDetailsContextValue>(
    () => ({
      // Product data
      productId,
      productData,
      isLoading,
      error,

      // Selection state
      selectedVariants,
      selectedAddons,
      quantity,

      // Computed
      totalPrice,
      isValid: validation.isValid,
      validationErrors: validation.errors,

      // Actions
      openProductDetails,
      closeProductDetails,
      selectVariant,
      toggleAddon,
      setAddonQuantity,
      setQuantity,
      addToCart,
    }),
    [
      productId,
      productData,
      isLoading,
      error,
      selectedVariants,
      selectedAddons,
      quantity,
      totalPrice,
      validation.isValid,
      validation.errors,
      openProductDetails,
      closeProductDetails,
      selectVariant,
      toggleAddon,
      setAddonQuantity,
      setQuantity,
      addToCart,
    ]
  );

  return (
    <ProductDetailsContext.Provider value={value}>
      {children}
    </ProductDetailsContext.Provider>
  );
}

/**
 * Hook to use Product Details Context
 */
export function useProductDetailsContext(): ProductDetailsContextValue {
  const context = useContext(ProductDetailsContext);

  if (context === undefined) {
    throw new Error(
      "useProductDetailsContext must be used within a ProductDetailsProvider"
    );
  }

  return context;
}
