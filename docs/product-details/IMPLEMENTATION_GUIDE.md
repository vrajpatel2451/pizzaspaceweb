# Product Details - Implementation Guide

## Quick Start

This guide provides step-by-step instructions for implementing the Product Details feature.

## Phase 1: Foundation (Core Infrastructure)

### Step 1: Create Utility Functions

**File**: `/lib/utils/product-details.ts`

```typescript
import type {
  VariantSelectionState,
  AddonSelectionState,
  VariantPricingResponse,
  VariantGroupResponse,
  AddonGroupResponse,
  AddonResponse,
  ValidationResult,
  PriceBreakdown
} from '@/types/product-details';

// Price calculation
export function calculatePrice(
  basePrice: number,
  selectedVariants: VariantSelectionState,
  selectedAddons: AddonSelectionState,
  pricing: VariantPricingResponse[]
): number {
  let total = basePrice;

  // Add variant prices
  for (const variantId of Object.values(selectedVariants)) {
    const variantPricing = pricing.find(
      p => p.type === 'variant' && p.variantId === variantId && p.isVisible
    );
    if (variantPricing) {
      total += variantPricing.price;
    }
  }

  // Add addon prices
  for (const [addonId, quantity] of Object.entries(selectedAddons)) {
    if (quantity > 0) {
      const addonPricing = pricing.find(
        p => p.type === 'addon' && p.addonId === addonId && p.isVisible
      );
      if (addonPricing) {
        total += addonPricing.price * quantity;
      }
    }
  }

  return total;
}

// Validation
export function validateSelections(
  variantGroups: VariantGroupResponse[],
  selectedVariants: VariantSelectionState,
  addonGroups: AddonGroupResponse[],
  selectedAddons: AddonSelectionState,
  addons: AddonResponse[]
): ValidationResult {
  const errors = [];

  // Validate primary variant groups
  for (const group of variantGroups) {
    if (group.isPrimary && !selectedVariants[group._id]) {
      errors.push({
        type: 'variant' as const,
        groupId: group._id,
        groupLabel: group.label,
        message: `Please select a ${group.label.toLowerCase()}`
      });
    }
  }

  // Validate addon groups
  for (const group of addonGroups) {
    const groupAddons = addons.filter(a => a.groupId === group._id);
    const totalSelected = groupAddons.reduce(
      (sum, addon) => sum + (selectedAddons[addon._id] || 0),
      0
    );

    if (totalSelected < group.min) {
      errors.push({
        type: 'addon' as const,
        groupId: group._id,
        groupLabel: group.label,
        message: `Please select at least ${group.min} ${group.label.toLowerCase()}`
      });
    }

    if (totalSelected > group.max) {
      errors.push({
        type: 'addon' as const,
        groupId: group._id,
        groupLabel: group.label,
        message: `Maximum ${group.max} ${group.label.toLowerCase()} allowed`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Group helpers
export function groupVariantsByGroup(variants: VariantResponse[]) {
  return variants.reduce((acc, variant) => {
    if (!acc[variant.groupId]) {
      acc[variant.groupId] = [];
    }
    acc[variant.groupId].push(variant);
    return acc;
  }, {} as Record<string, VariantResponse[]>);
}

export function groupAddonsByGroup(addons: AddonResponse[]) {
  return addons.reduce((acc, addon) => {
    if (!acc[addon.groupId]) {
      acc[addon.groupId] = [];
    }
    acc[addon.groupId].push(addon);
    return acc;
  }, {} as Record<string, AddonResponse[]>);
}

// Sort variant groups (primary first)
export function sortVariantGroups(groups: VariantGroupResponse[]) {
  return groups.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });
}
```

### Step 2: Create API Function

**File**: `/lib/api/products.ts` (extend existing file)

```typescript
import type { ProductDetailsResponse } from '@/types/product';

export async function fetchProductDetails(
  productId: string
): Promise<ProductDetailsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/details`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  return response.json();
}
```

### Step 3: Create Media Query Hook

**File**: `/hooks/use-media-query.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

## Phase 2: Context and State Management

### Step 4: Create ProductDetailsProvider

**File**: `/components/product-details/ProductDetailsProvider.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type {
  ProductDetailsContextValue,
  VariantSelectionState,
  AddonSelectionState
} from '@/types/product-details';
import type { ProductDetailsResponse } from '@/types/product';
import {
  calculatePrice,
  validateSelections,
  groupVariantsByGroup,
  groupAddonsByGroup
} from '@/lib/utils/product-details';

const ProductDetailsContext = createContext<ProductDetailsContextValue | null>(null);

export function useProductDetailsContext() {
  const context = useContext(ProductDetailsContext);
  if (!context) {
    throw new Error('useProductDetailsContext must be used within ProductDetailsProvider');
  }
  return context;
}

export function ProductDetailsProvider({
  data,
  children
}: {
  data: ProductDetailsResponse;
  children: React.ReactNode;
}) {
  const [selectedVariants, setSelectedVariants] = useState<VariantSelectionState>({});
  const [selectedAddons, setSelectedAddons] = useState<AddonSelectionState>({});
  const [itemQuantity, setItemQuantity] = useState(1);

  // Actions
  const selectVariant = useCallback((groupId: string, variantId: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupId]: variantId }));
  }, []);

  const selectAddon = useCallback((addonId: string, quantity: number) => {
    setSelectedAddons(prev => ({ ...prev, [addonId]: quantity }));
  }, []);

  const resetSelections = useCallback(() => {
    setSelectedVariants({});
    setSelectedAddons({});
    setItemQuantity(1);
  }, []);

  // Computed values
  const currentPrice = useMemo(() => {
    return calculatePrice(
      data.product.basePrice,
      selectedVariants,
      selectedAddons,
      data.pricing
    );
  }, [data.product.basePrice, selectedVariants, selectedAddons, data.pricing]);

  const totalPrice = currentPrice * itemQuantity;

  const validation = useMemo(() => {
    return validateSelections(
      data.variantGroupList,
      selectedVariants,
      data.addonGroupList,
      selectedAddons,
      data.addonList
    );
  }, [data.variantGroupList, selectedVariants, data.addonGroupList, selectedAddons, data.addonList]);

  // Helpers
  const variantsByGroup = useMemo(
    () => groupVariantsByGroup(data.variantList),
    [data.variantList]
  );

  const addonsByGroup = useMemo(
    () => groupAddonsByGroup(data.addonList),
    [data.addonList]
  );

  const getVariantsByGroup = useCallback(
    (groupId: string) => variantsByGroup[groupId] || [],
    [variantsByGroup]
  );

  const getAddonsByGroup = useCallback(
    (groupId: string) => addonsByGroup[groupId] || [],
    [addonsByGroup]
  );

  const getVariantPrice = useCallback(
    (variantId: string) => {
      const pricingRule = data.pricing.find(
        p => p.type === 'variant' && p.variantId === variantId && p.isVisible
      );
      return pricingRule?.price || 0;
    },
    [data.pricing]
  );

  const getAddonPrice = useCallback(
    (addonId: string) => {
      const pricingRule = data.pricing.find(
        p => p.type === 'addon' && p.addonId === addonId && p.isVisible
      );
      return pricingRule?.price || 0;
    },
    [data.pricing]
  );

  const value: ProductDetailsContextValue = {
    // Data
    product: data.product,
    variantList: data.variantList,
    variantGroupList: data.variantGroupList,
    addonList: data.addonList,
    addonGroupList: data.addonGroupList,
    pricing: data.pricing,

    // State
    selectedVariants,
    selectedAddons,
    itemQuantity,

    // Actions
    selectVariant,
    selectAddon,
    setItemQuantity,
    resetSelections,

    // Computed
    currentPrice,
    totalPrice,
    validation,

    // Helpers
    getVariantsByGroup,
    getAddonsByGroup,
    getVariantPrice,
    getAddonPrice
  };

  return (
    <ProductDetailsContext.Provider value={value}>
      {children}
    </ProductDetailsContext.Provider>
  );
}
```

## Phase 3: Core Components

### Step 5: Create ProductDetailsContainer

**File**: `/components/product-details/ProductDetailsContainer.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ProductDetailsModal } from './ProductDetailsModal';
import type { ProductDetailsContainerProps, CartItem } from '@/types/product-details';

export function ProductDetailsContainer({
  productId,
  trigger,
  onAddToCart,
  className
}: ProductDetailsContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleAddToCart = async (item: CartItem) => {
    await onAddToCart?.(item);
    handleClose();
  };

  return (
    <>
      <div onClick={handleOpen} className={className}>
        {trigger}
      </div>

      <ProductDetailsModal
        isOpen={isOpen}
        onClose={handleClose}
        productId={productId}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
```

### Step 6: Create ProductDetailsModal

**File**: `/components/product-details/ProductDetailsModal.tsx`

```typescript
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import { ProductDetailsContent } from './ProductDetailsContent';
import { useProductDetails } from './hooks/useProductDetails';
import type { CartItem } from '@/types/product-details';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onAddToCart?: (item: CartItem) => void | Promise<void>;
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  onAddToCart
}: ProductDetailsModalProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const { data, isLoading, error } = useProductDetails({ productId, enabled: isOpen });

  const content = (
    <ProductDetailsContent
      data={data}
      isLoading={isLoading}
      error={error}
      onClose={onClose}
      onAddToCart={onAddToCart}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="bottom"
      size="full"
      showCloseButton={false}
    >
      {content}
    </Drawer>
  );
}
```

## Phase 4: Section Components

Continue implementing sections following the architecture document:

1. **ProductImageSection** - Image carousel
2. **ProductInfoSection** - Product details
3. **VariantGroupsSection** - Variant selection
4. **AddonGroupsSection** - Addon selection
5. **AddToCartSection** - Cart actions

## Implementation Checklist

### Foundation
- [ ] Create utility functions (price calculation, validation)
- [ ] Create API function (fetchProductDetails)
- [ ] Create media query hook
- [ ] Add TypeScript interfaces to project

### Context & State
- [ ] Create ProductDetailsProvider
- [ ] Create useProductDetailsContext hook
- [ ] Create useProductDetails hook (API fetch)
- [ ] Implement selection state management
- [ ] Implement price calculation
- [ ] Implement validation logic

### Core Components
- [ ] ProductDetailsContainer (modal orchestrator)
- [ ] ProductDetailsModal (responsive wrapper)
- [ ] ProductDetailsContent (shared content)
- [ ] ProductDetailsBody (layout)

### Section Components
- [ ] ProductImageSection (carousel)
- [ ] ProductInfoSection (details + accordion)
- [ ] VariantGroupsSection (radio groups)
- [ ] AddonGroupsSection (checkbox + quantity)
- [ ] AddToCartSection (sticky footer)

### Sub-Components
- [ ] VariantGroup (single variant group)
- [ ] VariantOption (single variant)
- [ ] AddonGroup (single addon group)
- [ ] AddonOption (single addon)
- [ ] PriceCalculator (price display)
- [ ] ProductBadge (veg/non-veg)
- [ ] NutritionalInfo
- [ ] AllergyInfo

### Loading & Error States
- [ ] ProductDetailsSkeleton
- [ ] ProductDetailsError
- [ ] Loading states for buttons
- [ ] Optimistic UI updates

### Testing
- [ ] Desktop dialog functionality
- [ ] Mobile drawer functionality
- [ ] Viewport switching
- [ ] Variant selection
- [ ] Addon selection
- [ ] Price calculation
- [ ] Validation
- [ ] Add to cart
- [ ] Keyboard navigation
- [ ] Screen reader testing

### Polish
- [ ] Animations (framer-motion)
- [ ] Error handling
- [ ] Loading states
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Code review

## Tips for Implementation

1. **Start Small**: Build one section at a time, test thoroughly
2. **Use Existing Components**: Reuse Dialog, Drawer, RadioGroup, Checkbox, etc.
3. **Follow Patterns**: Match styling and patterns from product-card.tsx
4. **Type Safety**: Use TypeScript interfaces strictly
5. **Test Early**: Test on both desktop and mobile throughout development
6. **Accessibility First**: Add ARIA labels, keyboard support from the start

## Common Pitfalls to Avoid

1. Don't fetch data on every render - use lazy loading + caching
2. Don't forget null checks for optional API fields
3. Don't hardcode prices - use pricing API response
4. Don't skip primary variant validation
5. Don't forget to handle addon min/max constraints
6. Don't render Drawer on server - use 'use client'
7. Don't forget to reset selections on modal close

## Next Steps After Implementation

1. Add to cart functionality (integrate with cart context)
2. Special instructions textarea
3. Favorite/save for later
4. Share product
5. Product recommendations
6. Reviews and ratings
7. Quantity discounts
8. Time-based pricing (lunch specials)
