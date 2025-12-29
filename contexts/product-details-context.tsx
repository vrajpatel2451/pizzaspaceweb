"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import type { ProductDetailsResponse, VariantPricingResponse, VariantAddonSelectionType } from "@/types/product";

/**
 * Pricing selection with quantity (matches API format)
 * This is the core data structure - stores pricing IDs directly
 */
export interface PricingSelection {
  id: string;      // pricing._id
  quantity: number; // quantity for this pricing entry
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

  // Selection state (following reference code pattern)
  selectedVariantId: string; // Primary variant ID
  selectedPricingIds: PricingSelection[]; // All pricing entries (sub-variants + addons)
  quantity: number;

  // Computed
  totalPrice: number;
  isValid: boolean;
  validationErrors: string[];

  // Actions
  openProductDetails: (productId: string) => void;
  closeProductDetails: () => void;
  selectPrimaryVariant: (variantId: string) => void;
  selectSubVariant: (subVariantId: string) => void;
  toggleAddon: (pricingId: string, qty?: number) => void;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;

  // Helper functions for components
  getSelectedSubVariantId: (groupId: string) => string | undefined;
  isAddonSelected: (addonId: string) => boolean;
  getAddonQuantity: (addonId: string) => number;
  isAddonVisible: (addonId: string) => boolean;
  getAddonPricingId: (addonId: string) => string | undefined;
  getSubVariantPricingId: (subVariantId: string) => string | undefined;

  // maxItems validation helpers
  getSelectedVariantMaxItems: () => { maxItems: number; maxItemTypes: VariantAddonSelectionType } | null;
  getTotalAddonQuantity: () => number;
  getGroupAddonQuantity: (groupId: string) => number;
  getRemainingCapacity: (groupId?: string) => number;
  canAddAddon: (addonId: string, additionalQty?: number) => boolean;
}

/**
 * Context
 */
const ProductDetailsContext = createContext<ProductDetailsContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface ProductDetailsProviderProps {
  children: React.ReactNode;
  initialData?: ProductDetailsResponse | null;
  onAddToCart?: (cartData: {
    productId: string;
    variantId: string;
    pricing: PricingSelection[];
    quantity: number;
    totalPrice: number;
  }) => void;
  // Initial selections for edit mode
  initialVariantId?: string;
  initialPricing?: PricingSelection[];
  initialQuantity?: number;
}

/**
 * Helper to get initial primary variant ID
 */
function getInitialVariantId(
  productData: ProductDetailsResponse | null,
  providedVariantId: string | undefined
): string {
  // If variant was provided (edit mode), use it
  if (providedVariantId) {
    return providedVariantId;
  }

  // Auto-select first primary variant
  if (productData) {
    const primaryGroup = productData.variantGroupList.find((g) => g.isPrimary);
    if (primaryGroup) {
      const firstVariant = productData.variantList.find(
        (v) => v.groupId === primaryGroup._id
      );
      if (firstVariant) {
        return firstVariant._id;
      }
    }
  }

  return "";
}

/**
 * Product Details Provider Component
 */
export function ProductDetailsProvider({
  children,
  initialData = null,
  onAddToCart,
  initialVariantId,
  initialPricing,
  initialQuantity = 1,
}: ProductDetailsProviderProps) {
  // Product state
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductDetailsResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Selection state (following reference code pattern)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    () => getInitialVariantId(initialData, initialVariantId)
  );
  const [selectedPricingIds, setSelectedPricingIds] = useState<PricingSelection[]>(
    () => initialPricing || []
  );
  const [quantity, setQuantityState] = useState(initialQuantity);

  // Track previous initialData to detect changes
  const prevInitialDataRef = useRef<ProductDetailsResponse | null>(null);
  const isFirstRender = useRef(true);

  // ============================================================================
  // HELPER FUNCTIONS (following reference code pattern)
  // ============================================================================

  /**
   * Find variant pricing entry for a sub-variant
   */
  const findVariantPricing = useCallback(
    (primaryId: string, subId: string): VariantPricingResponse | undefined => {
      if (!productData) return undefined;
      return productData.pricing.find(
        (p) =>
          p.type === "variant" &&
          p.variantId === primaryId &&
          p.subVariantId === subId
      );
    },
    [productData]
  );

  /**
   * Find addon pricing entry
   */
  const findAddonPricing = useCallback(
    (variantId: string, addonId: string): VariantPricingResponse | undefined => {
      if (!productData) return undefined;
      return productData.pricing.find(
        (p) =>
          p.type === "addon" &&
          p.variantId === variantId &&
          p.addonId === addonId
      );
    },
    [productData]
  );

  // ============================================================================
  // SYNC EFFECTS
  // ============================================================================

  // Sync productData when initialData changes
  useEffect(() => {
    // Skip first render - already initialized via useState
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevInitialDataRef.current = initialData;
      return;
    }

    // Only sync if initialData actually changed (not just re-rendered)
    if (initialData !== prevInitialDataRef.current) {
      prevInitialDataRef.current = initialData;

      // Update product data
      setProductData(initialData);

      // Re-initialize selections when data changes
      if (initialData) {
        // Set variant (either from provided initial or auto-select primary)
        const newVariantId = getInitialVariantId(initialData, initialVariantId);
        setSelectedVariantId(newVariantId);

        // Set pricing if provided (edit mode)
        if (initialPricing && initialPricing.length > 0) {
          setSelectedPricingIds([...initialPricing]);
        } else {
          setSelectedPricingIds([]);
        }

        // Set quantity
        setQuantityState(initialQuantity);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional prop->state sync only on initialData change
  }, [initialData]);

  // Sync when initial selections change (for edit mode)
  useEffect(() => {
    if (initialVariantId) {
      setSelectedVariantId(initialVariantId);
    }
  }, [initialVariantId]);

  useEffect(() => {
    if (initialPricing && initialPricing.length > 0) {
      setSelectedPricingIds([...initialPricing]);
    }
  }, [initialPricing]);

  // ============================================================================
  // ACTIONS (following reference code pattern)
  // ============================================================================

  const openProductDetails = useCallback((id: string) => {
    setProductId(id);
    setIsLoading(true);
  }, []);

  const closeProductDetails = useCallback(() => {
    setProductId(null);
    setProductData(null);
    setSelectedVariantId("");
    setSelectedPricingIds([]);
    setQuantityState(1);
    setError(null);
  }, []);

  /**
   * Select primary variant - clears ALL pricing when variant changes
   * This ensures user starts fresh when switching variants (better UX)
   */
  const selectPrimaryVariant = useCallback(
    (variantId: string) => {
      if (selectedVariantId !== variantId) {
        // Clear ALL pricing selections when primary variant changes
        // This includes both sub-variants AND addons for better UX
        setSelectedPricingIds([]);
      }
      setSelectedVariantId(variantId);
    },
    [selectedVariantId]
  );

  /**
   * Select sub-variant - updates pricing entries
   * (Following reference code handleSelectSubVariant logic)
   */
  const selectSubVariant = useCallback(
    (subVariantId: string) => {
      const p = findVariantPricing(selectedVariantId, subVariantId);

      if (!p) {
        // If no pricing found, remove any existing variant pricing for this primary
        setSelectedPricingIds((prev) =>
          prev.filter((x) => {
            const entry = productData?.pricing.find((e) => e._id === x.id);
            return !(
              entry?.type === "variant" && entry.variantId === selectedVariantId
            );
          })
        );
        return;
      }

      setSelectedPricingIds((prev) => {
        const exists = prev.find((x) => x.id === p._id);
        if (exists) return prev;

        // Remove other variant pricing for same primary variant
        const removeIds = productData?.pricing
          .filter(
            (e) => e.type === "variant" && e.variantId === selectedVariantId
          )
          .map((e) => e._id) || [];

        return [
          ...prev.filter((x) => !removeIds.includes(x.id)),
          { id: p._id, quantity: 1 },
        ];
      });
    },
    [selectedVariantId, findVariantPricing, productData]
  );

  /**
   * Toggle addon selection
   * (Following reference code toggleAddon logic)
   */
  const toggleAddon = useCallback(
    (pricingId: string, qty = 1) => {
      setSelectedPricingIds((prev) => {
        const exists = prev.find((p) => p.id === pricingId);

        if (exists) {
          // If qty is 0, remove it
          if (qty === 0) return prev.filter((p) => p.id !== pricingId);

          // Otherwise update quantity
          return prev.map((p) =>
            p.id === pricingId ? { ...p, quantity: qty } : p
          );
        }

        // Add new addon
        return [...prev, { id: pricingId, quantity: qty }];
      });
    },
    []
  );

  const setQuantity = useCallback((qty: number) => {
    setQuantityState(qty);
  }, []);

  // ============================================================================
  // COMPONENT HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get selected sub-variant ID for a group
   */
  const getSelectedSubVariantId = useCallback(
    (groupId: string): string | undefined => {
      if (!productData) return undefined;

      // Find variants in this group
      const groupVariants = productData.variantList.filter(
        (v) => v.groupId === groupId
      );

      // Check which one has a selected pricing entry
      for (const variant of groupVariants) {
        const pricing = findVariantPricing(selectedVariantId, variant._id);
        if (pricing && selectedPricingIds.some((p) => p.id === pricing._id)) {
          return variant._id;
        }
      }

      return undefined;
    },
    [productData, selectedVariantId, selectedPricingIds, findVariantPricing]
  );

  /**
   * Check if addon is selected
   */
  const isAddonSelected = useCallback(
    (addonId: string): boolean => {
      const pricing = findAddonPricing(selectedVariantId, addonId);
      if (!pricing) return false;
      return selectedPricingIds.some((p) => p.id === pricing._id);
    },
    [selectedVariantId, selectedPricingIds, findAddonPricing]
  );

  /**
   * Get addon quantity
   */
  const getAddonQuantity = useCallback(
    (addonId: string): number => {
      const pricing = findAddonPricing(selectedVariantId, addonId);
      if (!pricing) return 0;
      const entry = selectedPricingIds.find((p) => p.id === pricing._id);
      return entry?.quantity || 0;
    },
    [selectedVariantId, selectedPricingIds, findAddonPricing]
  );

  /**
   * Check if addon is visible for current variant
   */
  const isAddonVisible = useCallback(
    (addonId: string): boolean => {
      const pricing = findAddonPricing(selectedVariantId, addonId);
      return pricing?.isVisible ?? false;
    },
    [selectedVariantId, findAddonPricing]
  );

  /**
   * Get addon pricing ID for current variant
   */
  const getAddonPricingId = useCallback(
    (addonId: string): string | undefined => {
      const pricing = findAddonPricing(selectedVariantId, addonId);
      return pricing?._id;
    },
    [selectedVariantId, findAddonPricing]
  );

  /**
   * Get sub-variant pricing ID
   */
  const getSubVariantPricingId = useCallback(
    (subVariantId: string): string | undefined => {
      const pricing = findVariantPricing(selectedVariantId, subVariantId);
      return pricing?._id;
    },
    [selectedVariantId, findVariantPricing]
  );

  // ============================================================================
  // maxItems VALIDATION HELPERS
  // ============================================================================

  /**
   * Get maxItems constraints from selected variant
   */
  const getSelectedVariantMaxItems = useCallback((): { maxItems: number; maxItemTypes: VariantAddonSelectionType } | null => {
    if (!productData || !selectedVariantId) return null;
    const variant = productData.variantList.find(v => v._id === selectedVariantId);
    if (!variant) return null;
    return {
      maxItems: variant.maxItems,
      maxItemTypes: variant.maxItemTypes,
    };
  }, [productData, selectedVariantId]);

  /**
   * Calculate total addon quantity across all groups
   * @param excludeSkipValidation - if true, exclude addons from groups with skipValidation=true
   */
  const getTotalAddonQuantity = useCallback((excludeSkipValidation = false): number => {
    if (!productData) return 0;

    return selectedPricingIds.reduce((total, selection) => {
      const pricing = productData.pricing.find(p => p._id === selection.id);
      if (pricing?.type !== "addon") return total;

      // If excluding skipValidation groups, check the addon's group
      if (excludeSkipValidation) {
        const addon = productData.addonList.find(a => a._id === pricing.addonId);
        const group = productData.addonGroupList.find(g => g._id === addon?.groupId);
        if (group?.skipValidation) {
          return total; // Skip this addon's quantity
        }
      }

      return total + selection.quantity;
    }, 0);
  }, [productData, selectedPricingIds]);

  /**
   * Calculate addon quantity within a specific group
   * Returns 0 if the group has skipValidation=true (to skip maxItems validation)
   */
  const getGroupAddonQuantity = useCallback((groupId: string): number => {
    if (!productData) return 0;

    // Check if this group has skipValidation - if so, return 0 to skip validation
    const group = productData.addonGroupList.find(g => g._id === groupId);
    if (group?.skipValidation) {
      return 0;
    }

    return selectedPricingIds.reduce((total, selection) => {
      const pricing = productData.pricing.find(p => p._id === selection.id);
      if (pricing?.type !== "addon") return total;

      const addon = productData.addonList.find(a => a._id === pricing.addonId);
      if (addon?.groupId === groupId) {
        return total + selection.quantity;
      }
      return total;
    }, 0);
  }, [productData, selectedPricingIds]);

  /**
   * Get remaining capacity based on maxItemTypes mode
   * If groupId provided and mode is perGroup, returns remaining for that group
   * Otherwise returns overall remaining
   */
  const getRemainingCapacity = useCallback((groupId?: string): number => {
    const constraints = getSelectedVariantMaxItems();
    if (!constraints || constraints.maxItemTypes === "none") {
      return Infinity;
    }

    if (constraints.maxItemTypes === "perGroup" && groupId) {
      const used = getGroupAddonQuantity(groupId);
      return Math.max(0, constraints.maxItems - used);
    }

    if (constraints.maxItemTypes === "overall") {
      // Exclude skipValidation groups from the count
      const used = getTotalAddonQuantity(true);
      return Math.max(0, constraints.maxItems - used);
    }

    return Infinity;
  }, [getSelectedVariantMaxItems, getTotalAddonQuantity, getGroupAddonQuantity]);

  /**
   * Check if an addon can be added (or quantity increased)
   */
  const canAddAddon = useCallback((addonId: string, additionalQty = 1): boolean => {
    if (!productData) return false;

    const addon = productData.addonList.find(a => a._id === addonId);
    if (!addon) return false;

    // Check if addon's group has skipValidation - if so, always allow adding
    const addonGroup = productData.addonGroupList.find(g => g._id === addon.groupId);
    if (addonGroup?.skipValidation) {
      return true; // Skip validation for this group
    }

    const constraints = getSelectedVariantMaxItems();
    if (!constraints || constraints.maxItemTypes === "none") {
      return true; // No variant-level limit
    }

    if (constraints.maxItemTypes === "perGroup") {
      const remaining = getRemainingCapacity(addon.groupId);
      return remaining >= additionalQty;
    }

    if (constraints.maxItemTypes === "overall") {
      const remaining = getRemainingCapacity();
      return remaining >= additionalQty;
    }

    return true;
  }, [productData, getSelectedVariantMaxItems, getRemainingCapacity]);

  // ============================================================================
  // COMPUTED VALUES (following reference code amount calculation)
  // ============================================================================

  /**
   * Calculate total price
   * Logic from reference:
   * 1. Get base from primary variant price (or product basePrice)
   * 2. Add extra from selected pricing entries
   * 3. Multiply by quantity
   */
  const totalPrice = useMemo(() => {
    if (!productData) return 0;

    // Calculate extra from pricing entries
    const extra = productData.pricing
      .map((pr) => {
        const entry = selectedPricingIds.find((x) => x.id === pr._id);
        if (!entry) return 0;
        return pr.type === "addon" ? pr.price * entry.quantity : pr.price;
      })
      .reduce((a, b) => a + b, 0);

    // Get base price from primary variant or product
    const primaryVariant = productData.variantList.find(
      (v) => v._id === selectedVariantId
    );
    const base = primaryVariant
      ? primaryVariant.price
      : productData.product.basePrice;

    return (base + extra) * quantity;
  }, [quantity, selectedVariantId, selectedPricingIds, productData]);

  /**
   * Validation
   */
  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!productData) {
      return { isValid: false, errors };
    }

    // Check primary variant is selected (only if variants exist)
    const primaryGroup = productData.variantGroupList.find((g) => g.isPrimary);
    const hasPrimaryVariants = primaryGroup && productData.variantList.some(
      (v) => v.groupId === primaryGroup._id
    );
    if (hasPrimaryVariants && !selectedVariantId) {
      errors.push("Please select a variant");
    }

    // Validate maxItems constraint (excludes addon groups with skipValidation=true)
    const constraints = getSelectedVariantMaxItems();
    if (constraints && constraints.maxItemTypes !== "none" && constraints.maxItems > 0) {
      if (constraints.maxItemTypes === "overall") {
        // Exclude skipValidation groups from total count
        const total = getTotalAddonQuantity(true);
        if (total > constraints.maxItems) {
          errors.push(`Maximum ${constraints.maxItems} addon items allowed. You have selected ${total}.`);
        }
      } else if (constraints.maxItemTypes === "perGroup") {
        for (const group of productData.addonGroupList) {
          // Skip groups with skipValidation=true (getGroupAddonQuantity returns 0 for these)
          if (group.skipValidation) continue;
          const groupTotal = getGroupAddonQuantity(group._id);
          if (groupTotal > constraints.maxItems) {
            errors.push(`Maximum ${constraints.maxItems} items per group. "${group.label}" has ${groupTotal}.`);
            break; // Show only first error
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [productData, selectedVariantId, getSelectedVariantMaxItems, getTotalAddonQuantity, getGroupAddonQuantity]);

  // ============================================================================
  // ADD TO CART ACTION
  // ============================================================================

  const addToCart = useCallback(() => {
    if (!productData || !onAddToCart) return;

    onAddToCart({
      productId: productData.product._id,
      variantId: selectedVariantId,
      pricing: selectedPricingIds,
      quantity,
      totalPrice,
    });
  }, [productData, selectedVariantId, selectedPricingIds, quantity, totalPrice, onAddToCart]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<ProductDetailsContextValue>(
    () => ({
      productId,
      productData,
      isLoading,
      error,
      selectedVariantId,
      selectedPricingIds,
      quantity,
      totalPrice,
      isValid: validation.isValid,
      validationErrors: validation.errors,
      openProductDetails,
      closeProductDetails,
      selectPrimaryVariant,
      selectSubVariant,
      toggleAddon,
      setQuantity,
      addToCart,
      getSelectedSubVariantId,
      isAddonSelected,
      getAddonQuantity,
      isAddonVisible,
      getAddonPricingId,
      getSubVariantPricingId,
      // maxItems validation helpers
      getSelectedVariantMaxItems,
      getTotalAddonQuantity,
      getGroupAddonQuantity,
      getRemainingCapacity,
      canAddAddon,
    }),
    [
      productId,
      productData,
      isLoading,
      error,
      selectedVariantId,
      selectedPricingIds,
      quantity,
      totalPrice,
      validation.isValid,
      validation.errors,
      openProductDetails,
      closeProductDetails,
      selectPrimaryVariant,
      selectSubVariant,
      toggleAddon,
      setQuantity,
      addToCart,
      getSelectedSubVariantId,
      isAddonSelected,
      getAddonQuantity,
      isAddonVisible,
      getAddonPricingId,
      getSubVariantPricingId,
      getSelectedVariantMaxItems,
      getTotalAddonQuantity,
      getGroupAddonQuantity,
      getRemainingCapacity,
      canAddAddon,
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
