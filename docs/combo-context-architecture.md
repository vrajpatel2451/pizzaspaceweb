# Combo Product State Management Architecture

## Overview

This document defines the architecture for extending `ProductDetailsContext` to support combo products. When `product.isCombo === true`, the context switches from variant/addon selection flow to combo group selection flow.

## Table of Contents

1. [State Shape](#state-shape)
2. [Context Integration](#context-integration)
3. [Action Flow Diagrams](#action-flow-diagrams)
4. [Price Calculation](#price-calculation)
5. [Validation Logic](#validation-logic)
6. [Component Integration](#component-integration)
7. [Usage Examples](#usage-examples)

---

## State Shape

### Extended Context State

```typescript
interface ProductDetailsContextValue {
  // ============================================================================
  // EXISTING STATE (for regular products)
  // ============================================================================
  productId: string | null;
  productData: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  selectedVariantId: string;
  selectedPricingIds: PricingSelection[];
  quantity: number;
  totalPrice: number;
  isValid: boolean;
  validationErrors: string[];

  // ============================================================================
  // NEW COMBO STATE (only used when product.isCombo === true)
  // ============================================================================

  // All selections organized by combo group ID
  comboSelections: ComboGroupSelectionState;

  // Currently active customization dialog state
  activeCustomizationGroup: string | null;
  activeCustomizationIndex: number | null;
  customizationProductData: ProductDetailsResponse | null;

  // ============================================================================
  // COMBO ACTIONS
  // ============================================================================

  // Selection management
  toggleComboProduct: (
    groupId: string,
    productId: string,
    comboGroupProductId: string,
    defaultVariantId?: string
  ) => void;

  // Customization dialog
  openComboCustomization: (groupId: string, selectionIndex: number) => Promise<void>;
  closeComboCustomization: () => void;

  // Update selections
  updateComboItemPricing: (
    groupId: string,
    selectionIndex: number,
    pricing: PricingIdsAndQuantity[]
  ) => void;
  removeComboSelection: (groupId: string, selectionIndex: number) => void;

  // Validation & computed values
  getComboGroupValidation: (groupId: string) => ComboValidationResult;
  isComboValid: boolean;
  comboTotalPrice: number;
}
```

### ComboGroupSelectionState Structure

```typescript
// Example state for "2 X 9 Inch Pizzas" combo
{
  "group_pizza_1": [
    {
      productId: "prod_margherita",
      comboGroupProductId: "cgp_123",
      variantId: "var_9inch",
      pricing: [
        { id: "pricing_cheese_extra", quantity: 1, price: 200 },
        { id: "pricing_pepperoni", quantity: 2, price: 300 }
      ],
      customized: true
    },
    {
      productId: "prod_pepperoni",
      comboGroupProductId: "cgp_124",
      variantId: "var_9inch",
      pricing: [],
      customized: false
    }
  ],
  "group_sides_1": [
    {
      productId: "prod_garlic_bread",
      comboGroupProductId: "cgp_125",
      variantId: "var_regular",
      pricing: [
        { id: "pricing_cheese_dip", quantity: 1, price: 100 }
      ],
      customized: true
    }
  ]
}
```

---

## Context Integration

### Conditional Rendering Logic

```typescript
// In ProductDetailsProvider component
const isComboProduct = productData?.product.isCombo ?? false;

// Conditional initialization
useEffect(() => {
  if (isComboProduct) {
    // Initialize combo selections
    initializeComboState();
  } else {
    // Use existing variant/addon initialization
    initializeRegularProductState();
  }
}, [productData, isComboProduct]);
```

### State Initialization

```typescript
// Initialize combo selections when product loads
const initializeComboState = useCallback(() => {
  if (!productData?.comboGroups) return;

  // Create empty selections map for all groups
  const initialSelections: ComboGroupSelectionState = {};

  productData.comboGroups.forEach(group => {
    initialSelections[group.groupId] = [];
  });

  setComboSelections(initialSelections);
}, [productData]);
```

### State Reset on Product Change

```typescript
// Reset combo state when closing product details
const closeProductDetails = useCallback(() => {
  // Reset regular product state
  setProductId(null);
  setProductData(null);
  setSelectedVariantId("");
  setSelectedPricingIds([]);
  setQuantityState(1);

  // Reset combo state
  setComboSelections({});
  setActiveCustomizationGroup(null);
  setActiveCustomizationIndex(null);
  setCustomizationProductData(null);

  setError(null);
}, []);
```

---

## Action Flow Diagrams

### 1. Toggle Combo Product Selection

```
User clicks "Select" on ComboProductItem
    ↓
toggleComboProduct(groupId, productId, comboGroupProductId, defaultVariantId)
    ↓
Check if product already selected in group
    ↓
    ├─ YES → Remove from selections array
    │         Update UI to show "Select" button
    │
    └─ NO → Check if under maxSelection limit
             ↓
             ├─ YES → Add to selections array
             │         Create ComboItemSelection object
             │         - Set variantId = defaultVariantId
             │         - Set pricing = []
             │         - Set customized = false
             │         Update UI to show selection number
             │
             └─ NO → Show error or disable button
                     (handled by UI component)
```

**Implementation:**

```typescript
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
        // Don't add - at max capacity
        return prev;
      }

      // Add new selection
      const newSelection: ComboItemSelection = {
        productId,
        comboGroupProductId,
        variantId: defaultVariantId || COMBO_DEFAULTS.DEFAULT_VARIANT_ID,
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

### 2. Open Customization Dialog

```
User clicks "Customize" on selected combo item
    ↓
openComboCustomization(groupId, selectionIndex)
    ↓
Set activeCustomizationGroup = groupId
Set activeCustomizationIndex = selectionIndex
    ↓
Get productId from comboSelections[groupId][selectionIndex]
    ↓
Fetch full product details (variants, addons, pricing)
    ↓
Set customizationProductData = fetched data
    ↓
Dialog opens with full product customization UI
```

**Implementation:**

```typescript
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
      const response = await fetch(`/api/products/${selection.productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const productData: ProductDetailsResponse = await response.json();
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

const closeComboCustomization = useCallback(() => {
  setActiveCustomizationGroup(null);
  setActiveCustomizationIndex(null);
  setCustomizationProductData(null);
}, []);
```

### 3. Update Combo Item Pricing

```
User completes customization in dialog
    ↓
User clicks "Save" or "Add to Combo"
    ↓
updateComboItemPricing(groupId, selectionIndex, pricing)
    ↓
Update comboSelections[groupId][selectionIndex]
    - Set pricing = new addon selections
    - Set customized = true
    ↓
Close customization dialog
    ↓
UI shows "Customized" badge on combo item
```

**Implementation:**

```typescript
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

    // Close the customization dialog
    closeComboCustomization();
  },
  [closeComboCustomization]
);
```

### 4. Remove Combo Selection

```
User clicks "Remove" or toggles off a selected item
    ↓
removeComboSelection(groupId, selectionIndex)
    ↓
Remove item from comboSelections[groupId] array
    ↓
Subsequent items shift down in array
    ↓
UI updates selection numbers (1, 2, 3...)
```

**Implementation:**

```typescript
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

---

## Price Calculation

### Formula

```
Total Combo Price = Base Combo Price + Total Addon Price

Where:
- Base Combo Price = product.basePrice (includes all base products)
- Total Addon Price = Sum of all addon prices from all combo item customizations
```

### Implementation

```typescript
const comboTotalPrice = useMemo(() => {
  if (!productData?.product.isCombo) return 0;

  // Start with base combo price
  let total = productData.product.basePrice;

  // Add addon prices from all combo items
  Object.values(comboSelections).forEach(groupSelections => {
    groupSelections.forEach(selection => {
      // Sum all addon prices for this combo item
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

### Price Breakdown Utility

```typescript
const getComboPriceBreakdown = useCallback((): ComboPriceBreakdown | null => {
  if (!productData?.product.isCombo || !productData.comboGroups) return null;

  const baseComboPrice = productData.product.basePrice;
  const groupPrices: ComboPriceBreakdown['groupPrices'] = [];
  let totalAddonPrice = 0;

  productData.comboGroups.forEach(group => {
    const selections = comboSelections[group.groupId] || [];
    const items = selections.map(selection => {
      // Get product name from comboGroupProducts
      const cgp = productData.comboGroupProducts?.find(
        p => p._id === selection.comboGroupProductId
      );
      const productName = cgp?.product?.name || "Unknown Product";

      // Calculate addon total for this item
      const addonTotal = selection.pricing.reduce(
        (sum, p) => sum + (p.price * p.quantity),
        0
      );

      return { productName, addonTotal };
    });

    const groupTotal = items.reduce((sum, item) => sum + item.addonTotal, 0);
    totalAddonPrice += groupTotal;

    groupPrices.push({
      groupId: group.groupId,
      groupLabel: group.label,
      items,
      groupTotal
    });
  });

  return {
    baseComboPrice,
    groupPrices,
    totalAddonPrice,
    totalPrice: baseComboPrice + totalAddonPrice
  };
}, [productData, comboSelections]);
```

---

## Validation Logic

### Group Validation

```typescript
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

    // Check minimum requirement
    if (selectedCount < minSelection) {
      return {
        isValid: false,
        error: COMBO_ERRORS.MIN_NOT_MET(minSelection),
        selectedCount,
        minRequired: minSelection,
        maxAllowed: maxSelection
      };
    }

    // Check maximum limit
    if (selectedCount > maxSelection) {
      return {
        isValid: false,
        error: COMBO_ERRORS.MAX_EXCEEDED(maxSelection),
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

### Overall Validation

```typescript
const isComboValid = useMemo(() => {
  if (!productData?.product.isCombo || !productData.comboGroups) {
    return false;
  }

  // Check all groups meet requirements
  return productData.comboGroups.every(group => {
    const validation = getComboGroupValidation(group.groupId);
    return validation.isValid;
  });
}, [productData, getComboGroupValidation]);
```

### Add to Cart Validation

```typescript
const addToCart = useCallback(() => {
  if (!productData || !onAddToCart) return;

  // For combo products, use combo validation
  if (productData.product.isCombo) {
    if (!isComboValid) {
      // Show validation errors
      const errors = productData.comboGroups
        ?.map(g => getComboGroupValidation(g.groupId))
        .filter(v => !v.isValid)
        .map(v => v.error)
        .filter(Boolean) as string[];

      console.error("Combo validation failed:", errors);
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
      // Additional combo-specific data
      isCombo: true,
      comboSelections: comboData
    });
    return;
  }

  // Regular product flow (existing logic)
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
```

---

## Component Integration

### Main Product Details Page

```tsx
// app/product/[id]/page.tsx or similar
export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const productData = await fetchProductDetails(params.id);

  return (
    <ProductDetailsProvider initialData={productData}>
      <ProductDetailsContent />
    </ProductDetailsProvider>
  );
}

function ProductDetailsContent() {
  const { productData } = useProductDetailsContext();

  if (!productData) return <ProductDetailsSkeleton />;

  const isCombo = productData.product.isCombo;

  return (
    <div>
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

### ComboGroupsSection Component

```tsx
// components/product/ComboGroupsSection.tsx
export function ComboGroupsSection({ className }: ComboGroupsSectionProps) {
  const { productData } = useProductDetailsContext();

  if (!productData?.comboGroups || !productData?.comboGroupProducts) {
    return null;
  }

  return (
    <div className={className}>
      <h2>Build Your Combo</h2>

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

      {/* Customization dialog */}
      <ComboCustomizationDialog />
    </div>
  );
}
```

### ComboGroupCard Component

```tsx
// components/product/ComboGroupCard.tsx
export function ComboGroupCard({ group, products }: ComboGroupCardProps) {
  const { comboSelections, getComboGroupValidation } = useProductDetailsContext();

  const selections = comboSelections[group.groupId] || [];
  const validation = getComboGroupValidation(group.groupId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.label}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
        <SelectionCount>
          {COMBO_UI.SELECTION_COUNT(selections.length, group.maxSelection)}
        </SelectionCount>
      </CardHeader>

      <CardContent>
        {/* Show validation error if invalid */}
        {!validation.isValid && validation.error && (
          <Alert variant="warning">
            <AlertDescription>{validation.error}</AlertDescription>
          </Alert>
        )}

        {/* Product items */}
        <div className="grid gap-4">
          {products.map(product => {
            const selectionIndex = selections.findIndex(
              s => s.productId === product.productId
            );
            const isSelected = selectionIndex >= 0;

            return (
              <ComboProductItem
                key={product._id}
                product={product}
                groupId={group.groupId}
                selectionIndex={isSelected ? selectionIndex + 1 : null}
                totalSelected={selections.length}
                maxSelection={group.maxSelection}
                allowCustomization={group.allowCustomization}
                onToggle={() => handleToggle(product)}
                onCustomize={() => handleCustomize(selectionIndex)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

### ComboProductItem Component

```tsx
// components/product/ComboProductItem.tsx
export function ComboProductItem({
  product,
  groupId,
  selectionIndex,
  totalSelected,
  maxSelection,
  allowCustomization,
  onToggle,
  onCustomize
}: ComboProductItemProps) {
  const { comboSelections } = useProductDetailsContext();

  const isSelected = selectionIndex !== null;
  const canSelect = !isSelected && totalSelected < maxSelection;
  const isCustomized = isSelected &&
    comboSelections[groupId]?.[selectionIndex - 1]?.customized;

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      {/* Product Image */}
      <CustomImage
        src={product.product?.photoList[0]}
        alt={product.product?.name || "Product"}
        width={80}
        height={80}
        className="rounded-md"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h4 className="font-semibold">{product.product?.name}</h4>
        {isCustomized && (
          <Badge variant="secondary">{COMBO_UI.CUSTOMIZED_TEXT}</Badge>
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
              <Button
                variant="outline"
                size="sm"
                onClick={onCustomize}
              >
                {COMBO_UI.CUSTOMIZE_TEXT}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              {COMBO_UI.REMOVE_TEXT}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            disabled={!canSelect}
            onClick={onToggle}
          >
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
```

### ComboCustomizationDialog Component

```tsx
// components/product/ComboCustomizationDialog.tsx
export function ComboCustomizationDialog() {
  const {
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,
    comboSelections,
    closeComboCustomization,
    updateComboItemPricing
  } = useProductDetailsContext();

  const isOpen = activeCustomizationGroup !== null &&
                 activeCustomizationIndex !== null;

  if (!isOpen || !customizationProductData) {
    return null;
  }

  // Get current selection to pre-populate addons
  const currentSelection =
    comboSelections[activeCustomizationGroup!]?.[activeCustomizationIndex!];

  const handleSave = (pricingData: PricingIdsAndQuantity[]) => {
    updateComboItemPricing(
      activeCustomizationGroup!,
      activeCustomizationIndex!,
      pricingData
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeComboCustomization}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Customize {customizationProductData.product.name}
          </DialogTitle>
        </DialogHeader>

        {/* Nested ProductDetailsProvider for customization */}
        <ProductDetailsProvider
          initialData={customizationProductData}
          initialVariantId={currentSelection?.variantId}
          initialPricing={currentSelection?.pricing}
        >
          <ComboCustomizationContent onSave={handleSave} />
        </ProductDetailsProvider>
      </DialogContent>
    </Dialog>
  );
}

function ComboCustomizationContent({
  onSave
}: {
  onSave: (pricing: PricingIdsAndQuantity[]) => void
}) {
  const { selectedPricingIds, totalPrice } = useProductDetailsContext();

  return (
    <div>
      {/* Show variant selection (read-only or limited) */}
      <VariantGroupsSection />

      {/* Show addon selection */}
      <AddonGroupsSection />

      {/* Show price */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex justify-between">
          <span>Addon Total:</span>
          <span className="font-semibold">
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Save button */}
      <DialogFooter className="mt-6">
        <Button onClick={() => onSave(selectedPricingIds)}>
          Save Customization
        </Button>
      </DialogFooter>
    </div>
  );
}
```

---

## Usage Examples

### Example 1: Basic Combo Selection Flow

```typescript
// User flow for "2 X 9 Inch Pizzas" combo
const user = async () => {
  // 1. Open product details page
  // Context initializes with empty combo selections

  // 2. Select first pizza
  toggleComboProduct(
    "group_pizza_1",
    "prod_margherita",
    "cgp_123",
    "var_9inch"
  );
  // Result: comboSelections["group_pizza_1"] = [
  //   { productId: "prod_margherita", variantId: "var_9inch", pricing: [], customized: false }
  // ]

  // 3. Select second pizza
  toggleComboProduct(
    "group_pizza_1",
    "prod_pepperoni",
    "cgp_124",
    "var_9inch"
  );
  // Result: comboSelections["group_pizza_1"] = [
  //   { productId: "prod_margherita", ... },
  //   { productId: "prod_pepperoni", variantId: "var_9inch", pricing: [], customized: false }
  // ]

  // 4. Validation passes (minSelection=2, maxSelection=2, selected=2)
  // isComboValid = true

  // 5. Add to cart
  addToCart();
  // Sends combo data with selections to cart API
};
```

### Example 2: Customization Flow

```typescript
// User customizes a combo item
const userCustomization = async () => {
  // 1. User has selected a pizza
  // comboSelections["group_pizza_1"][0] exists

  // 2. Click "Customize" button
  await openComboCustomization("group_pizza_1", 0);

  // 3. Dialog opens, fetches product details
  // customizationProductData is loaded with full pizza details

  // 4. User selects addons in nested ProductDetailsProvider
  // toggleAddon("pricing_cheese_extra", 1)
  // toggleAddon("pricing_pepperoni", 2)

  // 5. User clicks "Save"
  updateComboItemPricing("group_pizza_1", 0, [
    { id: "pricing_cheese_extra", quantity: 1, price: 200 },
    { id: "pricing_pepperoni", quantity: 2, price: 300 }
  ]);

  // 6. Result: comboSelections["group_pizza_1"][0] = {
  //   productId: "prod_margherita",
  //   variantId: "var_9inch",
  //   pricing: [
  //     { id: "pricing_cheese_extra", quantity: 1, price: 200 },
  //     { id: "pricing_pepperoni", quantity: 2, price: 300 }
  //   ],
  //   customized: true
  // }

  // 7. UI shows "Customized" badge
  // comboTotalPrice updates to include addon prices
};
```

### Example 3: Price Calculation

```typescript
// Price calculation example
const priceExample = () => {
  // Given:
  const baseComboPrice = 1500; // $15.00

  const comboSelections = {
    "group_pizza_1": [
      {
        productId: "prod_margherita",
        pricing: [
          { id: "addon_1", quantity: 1, price: 200 }, // +$2.00
          { id: "addon_2", quantity: 2, price: 150 }  // +$3.00
        ]
      },
      {
        productId: "prod_pepperoni",
        pricing: [
          { id: "addon_3", quantity: 1, price: 100 }  // +$1.00
        ]
      }
    ]
  };

  // Calculation:
  // Base: $15.00
  // Pizza 1 addons: $2.00 + $3.00 = $5.00
  // Pizza 2 addons: $1.00
  // Total: $15.00 + $5.00 + $1.00 = $21.00

  // With quantity = 2:
  // Final Total: $21.00 × 2 = $42.00
};
```

### Example 4: Validation States

```typescript
// Validation example for "Choose 1-2 Sides" group
const validationExample = () => {
  // Group: minSelection=1, maxSelection=2

  // State 1: No selections
  const selections1 = [];
  const validation1 = getComboGroupValidation("group_sides_1");
  // Result: {
  //   isValid: false,
  //   error: "Please select at least 1 item",
  //   selectedCount: 0,
  //   minRequired: 1,
  //   maxAllowed: 2
  // }

  // State 2: One selection
  const selections2 = [
    { productId: "prod_garlic_bread", ... }
  ];
  const validation2 = getComboGroupValidation("group_sides_1");
  // Result: {
  //   isValid: true,
  //   selectedCount: 1,
  //   minRequired: 1,
  //   maxAllowed: 2
  // }

  // State 3: Two selections
  const selections3 = [
    { productId: "prod_garlic_bread", ... },
    { productId: "prod_wings", ... }
  ];
  const validation3 = getComboGroupValidation("group_sides_1");
  // Result: {
  //   isValid: true,
  //   selectedCount: 2,
  //   minRequired: 1,
  //   maxAllowed: 2
  // }

  // State 4: Try to add third (blocked by UI)
  // Button disabled when totalSelected >= maxSelection
};
```

---

## Implementation Checklist

- [ ] Add combo state fields to ProductDetailsContext
- [ ] Add combo action functions to ProductDetailsContext
- [ ] Implement `toggleComboProduct` action
- [ ] Implement `openComboCustomization` action with API fetch
- [ ] Implement `closeComboCustomization` action
- [ ] Implement `updateComboItemPricing` action
- [ ] Implement `removeComboSelection` action
- [ ] Implement `getComboGroupValidation` function
- [ ] Implement `isComboValid` computed value
- [ ] Implement `comboTotalPrice` computed value
- [ ] Update `addToCart` to handle combo products
- [ ] Create `ComboGroupsSection` component
- [ ] Create `ComboGroupCard` component
- [ ] Create `ComboProductItem` component
- [ ] Create `ComboCustomizationDialog` component
- [ ] Add conditional rendering in main product details page
- [ ] Update price display to use `comboTotalPrice` for combos
- [ ] Add validation error display for combo groups
- [ ] Test combo selection flow
- [ ] Test customization dialog flow
- [ ] Test price calculation
- [ ] Test validation logic
- [ ] Test add to cart for combo products

---

## Technical Notes

### State Management Considerations

1. **State Isolation**: Combo state is completely separate from variant/addon state. Never mix the two flows.

2. **Array Indexing**: Selection order matters for UI display. Always use array indices to maintain selection order (1, 2, 3...).

3. **Dialog State**: Only one customization dialog can be open at a time. `activeCustomizationGroup` and `activeCustomizationIndex` track which combo item is being customized.

4. **Data Fetching**: Product details are fetched on-demand when user clicks "Customize". This avoids loading full details for all selectable products upfront.

### Performance Optimization

1. **Memoization**: All computed values (`comboTotalPrice`, `isComboValid`) use `useMemo` to avoid unnecessary recalculations.

2. **Callback Stability**: All action functions use `useCallback` with proper dependencies.

3. **Selective Re-renders**: Context value is memoized to prevent unnecessary re-renders of child components.

### Error Handling

1. **API Failures**: If product fetch fails in `openComboCustomization`, show error and keep dialog closed.

2. **Invalid Selections**: Validate all selections before allowing "Add to Cart". Show clear error messages per group.

3. **Missing Data**: Handle cases where `comboGroups` or `comboGroupProducts` are undefined/empty.

### TypeScript Safety

1. All combo types are defined in `/types/combo.ts`
2. Use type guards from combo.ts for runtime validation
3. Leverage discriminated unions for combo vs regular product handling
4. Ensure all nullable fields are properly checked before use

---

## File Locations

| File | Description |
|------|-------------|
| `/types/combo.ts` | All combo type definitions |
| `/contexts/product-details-context.tsx` | Context provider to extend |
| `/components/product/ComboGroupsSection.tsx` | Main combo section component |
| `/components/product/ComboGroupCard.tsx` | Individual group card |
| `/components/product/ComboProductItem.tsx` | Selectable product item |
| `/components/product/ComboCustomizationDialog.tsx` | Customization modal |

---

## Next Steps

1. Review this architecture document with the team
2. Implement context extensions in `product-details-context.tsx`
3. Create combo UI components following the specifications
4. Test with real combo product data
5. Update cart API integration for combo products
6. Document any deviations or improvements during implementation
