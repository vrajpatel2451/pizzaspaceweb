# Combo Product Implementation Guide

**Step-by-step guide to implementing combo products**

---

## Overview

This guide walks through the implementation in logical steps, with code examples and checkpoints. Follow these steps in order for the smoothest implementation.

---

## Phase 1: Context Extensions

### Step 1.1: Add State Variables

**File**: `/contexts/product-details-context.tsx`

**Action**: Add new state variables to the `ProductDetailsProvider` component.

```typescript
export function ProductDetailsProvider({
  children,
  initialData = null,
  onAddToCart,
  initialVariantId,
  initialPricing,
  initialQuantity = 1,
}: ProductDetailsProviderProps) {
  // ... existing state ...

  // ============================================================================
  // COMBO STATE (add this section)
  // ============================================================================
  const [comboSelections, setComboSelections] = useState<ComboGroupSelectionState>({});
  const [activeCustomizationGroup, setActiveCustomizationGroup] = useState<string | null>(null);
  const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);
  const [customizationProductData, setCustomizationProductData] = useState<ProductDetailsResponse | null>(null);

  // ... rest of component ...
}
```

**Checkpoint**: ✓ TypeScript compiles without errors

### Step 1.2: Add Type Import

**File**: `/contexts/product-details-context.tsx`

**Action**: Import combo types at the top of the file.

```typescript
import type { ProductDetailsResponse, VariantPricingResponse, VariantAddonSelectionType } from "@/types/product";
import type {
  ComboGroupSelectionState,
  ComboItemSelection,
  ComboValidationResult,
} from "@/types/combo";
import type { PricingIdsAndQuantity } from "@/types/cart";
```

**Checkpoint**: ✓ No import errors

### Step 1.3: Initialize Combo State

**File**: `/contexts/product-details-context.tsx`

**Action**: Add effect to initialize combo selections when product loads.

```typescript
// After existing useEffect hooks, add:

// Initialize combo selections when product loads
useEffect(() => {
  if (!productData?.product.isCombo || !productData.comboGroups) {
    setComboSelections({});
    return;
  }

  // Create empty selections for all groups
  const initialSelections: ComboGroupSelectionState = {};
  productData.comboGroups.forEach(group => {
    initialSelections[group.groupId] = [];
  });

  setComboSelections(initialSelections);
}, [productData?.product.isCombo, productData?.comboGroups]);
```

**Checkpoint**: ✓ Combo selections initialize when opening combo product

### Step 1.4: Update closeProductDetails

**File**: `/contexts/product-details-context.tsx`

**Action**: Reset combo state when closing product.

```typescript
const closeProductDetails = useCallback(() => {
  setProductId(null);
  setProductData(null);
  setSelectedVariantId("");
  setSelectedPricingIds([]);
  setQuantityState(1);
  setError(null);

  // Add combo state reset
  setComboSelections({});
  setActiveCustomizationGroup(null);
  setActiveCustomizationIndex(null);
  setCustomizationProductData(null);
}, []);
```

**Checkpoint**: ✓ State resets correctly when closing product

### Step 1.5: Implement toggleComboProduct

**File**: `/contexts/product-details-context.tsx`

**Action**: Add the toggle function after existing action functions.

```typescript
/**
 * Toggle selection of a combo product
 */
const toggleComboProduct = useCallback(
  (
    groupId: string,
    productId: string,
    comboGroupProductId: string,
    defaultVariantId?: string
  ) => {
    setComboSelections(prev => {
      const groupSelections = prev[groupId] || [];

      // Check if already selected
      const existingIndex = groupSelections.findIndex(
        s => s.productId === productId
      );

      if (existingIndex >= 0) {
        // Remove selection
        return {
          ...prev,
          [groupId]: groupSelections.filter((_, i) => i !== existingIndex)
        };
      }

      // Check maxSelection limit
      const group = productData?.comboGroups?.find(g => g.groupId === groupId);
      if (group && groupSelections.length >= group.maxSelection) {
        // At capacity - don't add
        return prev;
      }

      // Add new selection
      const newSelection: ComboItemSelection = {
        productId,
        comboGroupProductId,
        variantId: defaultVariantId || "",
        pricing: [],
        customized: false
      };

      return {
        ...prev,
        [groupId]: [...groupSelections, newSelection]
      };
    });
  },
  [productData]
);
```

**Checkpoint**: ✓ Can add/remove products from combo selections

### Step 1.6: Implement Customization Functions

**File**: `/contexts/product-details-context.tsx`

**Action**: Add customization dialog functions.

```typescript
/**
 * Open customization dialog for a combo item
 */
const openComboCustomization = useCallback(
  async (groupId: string, selectionIndex: number) => {
    const selections = comboSelections[groupId];
    if (!selections || !selections[selectionIndex]) {
      console.error("Invalid selection index");
      return;
    }

    const selection = selections[selectionIndex];

    // Set dialog state
    setActiveCustomizationGroup(groupId);
    setActiveCustomizationIndex(selectionIndex);

    try {
      // Fetch full product details
      const response = await fetch(`/api/products?ids=${selection.productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      const productData = data.data?.[0];

      if (!productData) throw new Error("Product not found");

      setCustomizationProductData(productData);
    } catch (err) {
      console.error("Failed to load customization data:", err);
      setError(err as Error);
      // Close dialog on error
      closeComboCustomization();
    }
  },
  [comboSelections]
);

/**
 * Close customization dialog
 */
const closeComboCustomization = useCallback(() => {
  setActiveCustomizationGroup(null);
  setActiveCustomizationIndex(null);
  setCustomizationProductData(null);
}, []);

/**
 * Update pricing for a combo item
 */
const updateComboItemPricing = useCallback(
  (
    groupId: string,
    selectionIndex: number,
    pricing: PricingIdsAndQuantity[]
  ) => {
    setComboSelections(prev => {
      const groupSelections = prev[groupId];
      if (!groupSelections || !groupSelections[selectionIndex]) {
        return prev;
      }

      const updatedSelections = [...groupSelections];
      updatedSelections[selectionIndex] = {
        ...updatedSelections[selectionIndex],
        pricing,
        customized: true
      };

      return {
        ...prev,
        [groupId]: updatedSelections
      };
    });

    closeComboCustomization();
  },
  [closeComboCustomization]
);

/**
 * Remove a combo selection
 */
const removeComboSelection = useCallback(
  (groupId: string, selectionIndex: number) => {
    setComboSelections(prev => {
      const groupSelections = prev[groupId];
      if (!groupSelections) return prev;

      return {
        ...prev,
        [groupId]: groupSelections.filter((_, i) => i !== selectionIndex)
      };
    });
  },
  []
);
```

**Checkpoint**: ✓ All combo actions implemented

### Step 1.7: Implement Validation Functions

**File**: `/contexts/product-details-context.tsx`

**Action**: Add validation logic.

```typescript
/**
 * Get validation result for a combo group
 */
const getComboGroupValidation = useCallback(
  (groupId: string): ComboValidationResult => {
    const group = productData?.comboGroups?.find(g => g.groupId === groupId);
    const selections = comboSelections[groupId] || [];

    if (!group) {
      return {
        isValid: false,
        error: "Group not found",
        selectedCount: 0,
        minRequired: 0,
        maxAllowed: 0
      };
    }

    const selectedCount = selections.length;
    const { minSelection, maxSelection } = group;

    // Check minimum
    if (selectedCount < minSelection) {
      return {
        isValid: false,
        error: `Please select at least ${minSelection} item${minSelection === 1 ? '' : 's'}`,
        selectedCount,
        minRequired: minSelection,
        maxAllowed: maxSelection
      };
    }

    // Check maximum
    if (selectedCount > maxSelection) {
      return {
        isValid: false,
        error: `Maximum ${maxSelection} item${maxSelection === 1 ? '' : 's'} allowed`,
        selectedCount,
        minRequired: minSelection,
        maxAllowed: maxSelection
      };
    }

    return {
      isValid: true,
      selectedCount,
      minRequired: minSelection,
      maxAllowed: maxSelection
    };
  },
  [productData, comboSelections]
);
```

**Checkpoint**: ✓ Validation works for individual groups

### Step 1.8: Implement Computed Values

**File**: `/contexts/product-details-context.tsx`

**Action**: Add computed values for combo validation and pricing.

```typescript
/**
 * Check if all combo groups are valid
 */
const isComboValid = useMemo(() => {
  if (!productData?.product.isCombo || !productData.comboGroups) {
    return false;
  }

  return productData.comboGroups.every(group => {
    const validation = getComboGroupValidation(group.groupId);
    return validation.isValid;
  });
}, [productData, getComboGroupValidation]);

/**
 * Calculate total combo price
 */
const comboTotalPrice = useMemo(() => {
  if (!productData?.product.isCombo) return 0;

  // Start with base combo price
  let total = productData.product.basePrice;

  // Add addon prices from all combo items
  Object.values(comboSelections).forEach(groupSelections => {
    groupSelections.forEach(selection => {
      // Sum all addon prices for this item
      const itemAddonTotal = selection.pricing.reduce(
        (sum, pricing) => sum + (pricing.price * pricing.quantity),
        0
      );
      total += itemAddonTotal;
    });
  });

  // Multiply by quantity
  return total * quantity;
}, [productData, comboSelections, quantity]);
```

**Checkpoint**: ✓ Price calculation works correctly

### Step 1.9: Update Context Value

**File**: `/contexts/product-details-context.tsx`

**Action**: Add combo state to context value.

```typescript
const value = useMemo<ProductDetailsContextValue>(
  () => ({
    // ... existing values ...

    // Combo state
    comboSelections,
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,

    // Combo actions
    toggleComboProduct,
    openComboCustomization,
    closeComboCustomization,
    updateComboItemPricing,
    removeComboSelection,

    // Combo computed
    getComboGroupValidation,
    isComboValid,
    comboTotalPrice,
  }),
  [
    // ... existing dependencies ...

    // Combo dependencies
    comboSelections,
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,
    toggleComboProduct,
    openComboCustomization,
    closeComboCustomization,
    updateComboItemPricing,
    removeComboSelection,
    getComboGroupValidation,
    isComboValid,
    comboTotalPrice,
  ]
);
```

**Checkpoint**: ✓ Context provides all combo values

### Step 1.10: Update Context Interface

**File**: `/contexts/product-details-context.tsx`

**Action**: Update the `ProductDetailsContextValue` interface.

```typescript
interface ProductDetailsContextValue {
  // ... existing fields ...

  // Combo state
  comboSelections: ComboGroupSelectionState;
  activeCustomizationGroup: string | null;
  activeCustomizationIndex: number | null;
  customizationProductData: ProductDetailsResponse | null;

  // Combo actions
  toggleComboProduct: (
    groupId: string,
    productId: string,
    comboGroupProductId: string,
    defaultVariantId?: string
  ) => void;
  openComboCustomization: (groupId: string, selectionIndex: number) => Promise<void>;
  closeComboCustomization: () => void;
  updateComboItemPricing: (
    groupId: string,
    selectionIndex: number,
    pricing: PricingIdsAndQuantity[]
  ) => void;
  removeComboSelection: (groupId: string, selectionIndex: number) => void;

  // Combo computed
  getComboGroupValidation: (groupId: string) => ComboValidationResult;
  isComboValid: boolean;
  comboTotalPrice: number;
}
```

**Checkpoint**: ✓ TypeScript shows no errors, all types are correct

---

## Phase 2: Component Creation

### Step 2.1: Create ComboProductItem

**File**: `/components/product/combo/ComboProductItem.tsx` (new file)

```typescript
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/custom-image";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { ComboProductItemProps } from "@/types/combo";
import { COMBO_UI } from "@/types/combo";

export function ComboProductItem({
  product,
  groupId,
  selectionIndex,
  totalSelected,
  maxSelection,
  allowCustomization,
  onToggle,
  onCustomize,
  className
}: ComboProductItemProps) {
  const { comboSelections } = useProductDetailsContext();

  const isSelected = selectionIndex !== null;
  const canSelect = !isSelected && totalSelected < maxSelection;

  // Get actual selection data (convert 1-based display to 0-based array)
  const selection = isSelected
    ? comboSelections[groupId]?.[selectionIndex - 1]
    : null;

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-lg ${className || ''}`}>
      {/* Product Image */}
      <CustomImage
        src={product.product?.photoList[0] || ''}
        alt={product.product?.name || 'Product'}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h4 className="font-semibold">{product.product?.name}</h4>
        {selection?.customized && (
          <Badge variant="secondary" className="mt-1">
            {COMBO_UI.CUSTOMIZED_TEXT}
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isSelected ? (
          <>
            <Badge variant="default">
              {COMBO_UI.SELECTED_TEXT(selectionIndex)}
            </Badge>

            {allowCustomization && (
              <Button variant="outline" size="sm" onClick={onCustomize}>
                {COMBO_UI.CUSTOMIZE_TEXT}
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onToggle}>
              {COMBO_UI.REMOVE_TEXT}
            </Button>
          </>
        ) : (
          <Button variant="outline" disabled={!canSelect} onClick={onToggle}>
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Checkpoint**: ✓ Component renders without errors

### Step 2.2: Create ComboGroupCard

**File**: `/components/product/combo/ComboGroupCard.tsx` (new file)

```typescript
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { ComboProductItem } from "./ComboProductItem";
import type { ComboGroupCardProps } from "@/types/combo";
import { COMBO_UI } from "@/types/combo";

export function ComboGroupCard({
  group,
  products,
  className
}: ComboGroupCardProps) {
  const {
    comboSelections,
    getComboGroupValidation,
    toggleComboProduct,
    openComboCustomization
  } = useProductDetailsContext();

  const selections = comboSelections[group.groupId] || [];
  const validation = getComboGroupValidation(group.groupId);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{group.label}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {COMBO_UI.SELECTION_COUNT(selections.length, group.maxSelection)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Validation Error */}
        {!validation.isValid && validation.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{validation.error}</AlertDescription>
          </Alert>
        )}

        {/* Product Items */}
        <div className="space-y-4">
          {products.map(product => {
            const selectionIndex = selections.findIndex(
              s => s.productId === product.productId
            );
            const displayIndex = selectionIndex >= 0 ? selectionIndex + 1 : null;

            return (
              <ComboProductItem
                key={product._id}
                product={product}
                groupId={group.groupId}
                selectionIndex={displayIndex}
                totalSelected={selections.length}
                maxSelection={group.maxSelection}
                allowCustomization={group.allowCustomization}
                onToggle={() =>
                  toggleComboProduct(
                    group.groupId,
                    product.productId!,
                    product._id,
                    product.defaultVariantId
                  )
                }
                onCustomize={() =>
                  openComboCustomization(group.groupId, selectionIndex)
                }
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Checkpoint**: ✓ Group card renders all products

### Step 2.3: Create ComboCustomizationDialog

**File**: `/components/product/combo/ComboCustomizationDialog.tsx` (new file)

```typescript
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { ProductDetailsProvider } from "@/contexts/product-details-context";
import { AddonGroupsSection } from "@/components/product/addons/AddonGroupsSection";

export function ComboCustomizationDialog() {
  const {
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,
    comboSelections,
    closeComboCustomization,
    updateComboItemPricing
  } = useProductDetailsContext();

  const isOpen =
    activeCustomizationGroup !== null &&
    activeCustomizationIndex !== null &&
    customizationProductData !== null;

  if (!isOpen || !customizationProductData) {
    return null;
  }

  const currentSelection =
    comboSelections[activeCustomizationGroup!]?.[activeCustomizationIndex!];

  return (
    <Dialog open={isOpen} onOpenChange={closeComboCustomization}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Customize {customizationProductData.product.name}
          </DialogTitle>
        </DialogHeader>

        <ProductDetailsProvider
          initialData={customizationProductData}
          initialVariantId={currentSelection?.variantId}
          initialPricing={currentSelection?.pricing}
        >
          <CustomizationContent
            onSave={pricing => {
              updateComboItemPricing(
                activeCustomizationGroup!,
                activeCustomizationIndex!,
                pricing
              );
            }}
          />
        </ProductDetailsProvider>
      </DialogContent>
    </Dialog>
  );
}

function CustomizationContent({
  onSave
}: {
  onSave: (pricing: any[]) => void;
}) {
  const { selectedPricingIds, totalPrice } = useProductDetailsContext();

  return (
    <div className="space-y-6">
      {/* Addon selection */}
      <AddonGroupsSection />

      {/* Price display */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Addon Total:</span>
          <span className="text-lg font-semibold">
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Save button */}
      <DialogFooter>
        <Button onClick={() => onSave(selectedPricingIds)} size="lg" className="w-full">
          Save Customization
        </Button>
      </DialogFooter>
    </div>
  );
}
```

**Checkpoint**: ✓ Dialog opens and customization works

### Step 2.4: Create ComboGroupsSection

**File**: `/components/product/combo/ComboGroupsSection.tsx` (new file)

```typescript
"use client";

import { useProductDetailsContext } from "@/contexts/product-details-context";
import { ComboGroupCard } from "./ComboGroupCard";
import { ComboCustomizationDialog } from "./ComboCustomizationDialog";
import type { ComboGroupsSectionProps } from "@/types/combo";

export function ComboGroupsSection({ className }: ComboGroupsSectionProps) {
  const { productData } = useProductDetailsContext();

  if (!productData?.comboGroups || !productData?.comboGroupProducts) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">Build Your Combo</h2>

      <div className="space-y-6">
        {productData.comboGroups.map(group => {
          // Get products for this group
          const groupProducts = productData.comboGroupProducts.filter(
            cgp => cgp.comboGroupId === group._id
          );

          return (
            <ComboGroupCard
              key={group._id}
              group={group}
              products={groupProducts}
            />
          );
        })}
      </div>

      {/* Customization dialog */}
      <ComboCustomizationDialog />
    </div>
  );
}
```

**Checkpoint**: ✓ All groups render correctly

### Step 2.5: Create Barrel Export

**File**: `/components/product/combo/index.ts` (new file)

```typescript
export { ComboGroupsSection } from "./ComboGroupsSection";
export { ComboGroupCard } from "./ComboGroupCard";
export { ComboProductItem } from "./ComboProductItem";
export { ComboCustomizationDialog } from "./ComboCustomizationDialog";
```

**Checkpoint**: ✓ Components can be imported easily

---

## Phase 3: UI Integration

### Step 3.1: Update Price Display

**File**: Find your price display component (e.g., `/components/product/PriceDisplay.tsx`)

**Action**: Add conditional logic for combo pricing.

```typescript
"use client";

import { useProductDetailsContext } from "@/contexts/product-details-context";

export function PriceDisplay() {
  const {
    productData,
    totalPrice,
    comboTotalPrice
  } = useProductDetailsContext();

  // Use comboTotalPrice for combos, totalPrice for regular products
  const displayPrice = productData?.product.isCombo
    ? comboTotalPrice
    : totalPrice;

  return (
    <div className="text-2xl font-bold">
      ${(displayPrice / 100).toFixed(2)}
    </div>
  );
}
```

**Checkpoint**: ✓ Price displays correctly for both product types

### Step 3.2: Update Add to Cart Button

**File**: Find your add to cart button component

**Action**: Add conditional validation check.

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { useProductDetailsContext } from "@/contexts/product-details-context";

export function AddToCartButton() {
  const {
    productData,
    isValid,
    isComboValid,
    addToCart
  } = useProductDetailsContext();

  // Use combo validation for combos
  const canAddToCart = productData?.product.isCombo
    ? isComboValid
    : isValid;

  return (
    <Button
      disabled={!canAddToCart}
      onClick={addToCart}
      size="lg"
      className="w-full"
    >
      Add to Cart
    </Button>
  );
}
```

**Checkpoint**: ✓ Button disabled state works correctly

### Step 3.3: Update Main Product Page

**File**: Your main product details page (e.g., `/app/product/[id]/page.tsx`)

**Action**: Add conditional rendering for combo vs regular products.

```typescript
"use client";

import { useProductDetailsContext } from "@/contexts/product-details-context";
import { ComboGroupsSection } from "@/components/product/combo";
import { VariantGroupsSection } from "@/components/product/variants";
import { AddonGroupsSection } from "@/components/product/addons";

export function ProductDetailsContent() {
  const { productData } = useProductDetailsContext();

  if (!productData) {
    return <ProductDetailsSkeleton />;
  }

  const isCombo = productData.product.isCombo;

  return (
    <div className="space-y-6">
      <ProductHeader product={productData.product} />
      <ProductImages photos={productData.product.photoList} />

      {/* Conditional rendering based on product type */}
      {isCombo ? (
        <ComboGroupsSection />
      ) : (
        <>
          <VariantGroupsSection />
          <AddonGroupsSection />
        </>
      )}

      <QuantitySelector />
      <PriceDisplay />
      <AddToCartButton />
    </div>
  );
}
```

**Checkpoint**: ✓ Correct UI shows for each product type

---

## Phase 4: Testing

### Step 4.1: Manual Testing Checklist

- [ ] Open combo product → Combo groups render
- [ ] Open regular product → Variants/addons render
- [ ] Select product in combo group → "Selected 1" badge appears
- [ ] Select second product → "Selected 2" badge appears
- [ ] Click customize → Dialog opens
- [ ] Select addons in dialog → Price updates
- [ ] Save customization → "Customized" badge appears
- [ ] Check price → Includes addon prices
- [ ] Remove selection → Badge disappears
- [ ] Try selecting beyond max → Button disabled
- [ ] Try adding to cart incomplete → Button disabled
- [ ] Complete all groups → Button enabled
- [ ] Add to cart → Correct data sent

### Step 4.2: Edge Cases to Test

- [ ] Group with min=0 (optional) → Can skip
- [ ] Group with min=1, max=1 (required single) → Must select one
- [ ] Group with min=2, max=3 (range) → Must select 2-3
- [ ] Customization without saving → Changes not applied
- [ ] Dialog close with X button → State resets
- [ ] Select, customize, then remove → State cleaned up
- [ ] Multiple groups → Independent validation
- [ ] Switch products in customization → Correct data loaded

### Step 4.3: Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Phase 5: Cart Integration

### Step 5.1: Update addToCart Function

**File**: `/contexts/product-details-context.tsx`

**Action**: Modify `addToCart` to handle combo products.

```typescript
const addToCart = useCallback(() => {
  if (!productData || !onAddToCart) return;

  // Handle combo products
  if (productData.product.isCombo) {
    if (!isComboValid) {
      console.error("Combo validation failed");
      return;
    }

    // Transform combo selections to API format
    const comboData = transformComboSelectionsToAPI(comboSelections);

    onAddToCart({
      productId: productData.product._id,
      variantId: "", // Not used for combos
      pricing: [], // Not used for combos
      quantity,
      totalPrice: comboTotalPrice,
      // Combo-specific data
      isCombo: true,
      comboSelections: comboData
    });
    return;
  }

  // Handle regular products (existing logic)
  if (!validation.isValid) return;

  onAddToCart({
    productId: productData.product._id,
    variantId: selectedVariantId,
    pricing: selectedPricingIds,
    quantity,
    totalPrice,
  });
}, [
  productData,
  isComboValid,
  comboSelections,
  comboTotalPrice,
  validation.isValid,
  selectedVariantId,
  selectedPricingIds,
  quantity,
  totalPrice,
  onAddToCart
]);

// Helper function to transform selections
function transformComboSelectionsToAPI(selections: ComboGroupSelectionState) {
  const result: any[] = [];

  Object.entries(selections).forEach(([groupId, groupSelections]) => {
    groupSelections.forEach(selection => {
      result.push({
        groupId,
        productId: selection.productId,
        pricing: selection.pricing
      });
    });
  });

  return result;
}
```

**Checkpoint**: ✓ Correct data sent to cart API

### Step 5.2: Update Cart API Handler

**File**: Your cart API handler (e.g., `/app/api/cart/route.ts`)

**Action**: Handle combo product format.

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  if (body.isCombo) {
    // Handle combo product
    // body.comboSelections contains the combo data
    return handleComboAddToCart(body);
  } else {
    // Handle regular product
    return handleRegularAddToCart(body);
  }
}
```

**Checkpoint**: ✓ Cart API accepts combo format

---

## Phase 6: Polish & Optimization

### Step 6.1: Add Loading States

```typescript
// In ComboCustomizationDialog
const [isLoading, setIsLoading] = useState(false);

const openComboCustomization = async (...) => {
  setIsLoading(true);
  try {
    // ... fetch logic ...
  } finally {
    setIsLoading(false);
  }
};
```

### Step 6.2: Add Error Handling

```typescript
// Add toast notifications for errors
import { toast } from "@/components/ui/use-toast";

const openComboCustomization = async (...) => {
  try {
    // ... fetch logic ...
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to load customization options",
      variant: "destructive"
    });
  }
};
```

### Step 6.3: Add Animations

```typescript
// Add transitions to selection badges
<Badge
  variant="default"
  className="transition-all duration-200 animate-in fade-in"
>
  Selected {selectionIndex}
</Badge>
```

### Step 6.4: Optimize Re-renders

```typescript
// Memoize expensive components
import { memo } from "react";

export const ComboProductItem = memo(function ComboProductItem(props) {
  // ... component code ...
});
```

---

## Verification Checklist

### Context
- [ ] All combo state variables added
- [ ] All combo actions implemented
- [ ] All computed values working
- [ ] Context value includes combo fields
- [ ] TypeScript types are correct
- [ ] State resets on product close

### Components
- [ ] ComboGroupsSection renders
- [ ] ComboGroupCard shows validation
- [ ] ComboProductItem handles selection
- [ ] ComboCustomizationDialog works
- [ ] All components have proper types
- [ ] Barrel export exists

### Integration
- [ ] Price display uses correct price
- [ ] Add to cart uses correct validation
- [ ] Main page renders conditionally
- [ ] Cart API handles combo format
- [ ] Error handling in place
- [ ] Loading states shown

### Testing
- [ ] Basic flows work
- [ ] Edge cases handled
- [ ] Cross-browser tested
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Troubleshooting Common Issues

### Issue: TypeScript errors about missing fields

**Solution**: Ensure you've updated the `ProductDetailsContextValue` interface with all combo fields.

### Issue: Dialog doesn't open

**Solution**: Check that `openComboCustomization` is setting `activeCustomizationGroup` and `activeCustomizationIndex` correctly.

### Issue: Price not updating

**Solution**: Verify `comboTotalPrice` is being calculated in a `useMemo` and that `PriceDisplay` is using it for combo products.

### Issue: Validation always fails

**Solution**: Check that `comboSelections` is being initialized correctly when product loads.

### Issue: Can't select products

**Solution**: Verify `toggleComboProduct` is being called with correct parameters and that `maxSelection` check isn't blocking selection.

---

## Next Steps

After completing all phases:

1. **User Testing**: Have real users test the combo flow
2. **Performance Monitoring**: Check for any performance issues
3. **Analytics**: Track combo product conversions
4. **Iteration**: Gather feedback and improve UX
5. **Documentation**: Update user-facing docs with combo feature

---

## Resources

- [Architecture Document](./combo-context-architecture.md)
- [Quick Reference](./combo-quick-reference.md)
- [Component Hierarchy](./combo-component-hierarchy.md)
- [Type Definitions](/types/combo.ts)

---

**Estimated Implementation Time**: 8-12 hours for an experienced developer

**Last Updated**: 2026-01-05
