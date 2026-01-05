# Combo Product Component Hierarchy

## Visual Component Tree

```
ProductDetailsProvider
│
├─ ProductDetailsContent (conditional rendering)
│  │
│  ├─ ProductHeader
│  ├─ ProductImages
│  │
│  ├─ [CONDITIONAL: if isCombo]
│  │  │
│  │  └─ ComboGroupsSection
│  │     │
│  │     ├─ ComboGroupCard (group 1)
│  │     │  │
│  │     │  ├─ GroupHeader
│  │     │  │  ├─ Title & Description
│  │     │  │  └─ SelectionCount (X/Y selected)
│  │     │  │
│  │     │  ├─ ValidationAlert (if invalid)
│  │     │  │
│  │     │  └─ ComboProductItem (product 1)
│  │     │     ├─ ProductImage
│  │     │     ├─ ProductInfo
│  │     │     │  └─ CustomizedBadge (if customized)
│  │     │     └─ ActionButtons
│  │     │        ├─ SelectButton (if not selected)
│  │     │        └─ [if selected]
│  │     │           ├─ SelectedBadge (shows number)
│  │     │           ├─ CustomizeButton
│  │     │           └─ RemoveButton
│  │     │
│  │     ├─ ComboGroupCard (group 2)
│  │     │  └─ ... (same structure)
│  │     │
│  │     └─ ComboCustomizationDialog
│  │        │
│  │        ├─ DialogHeader
│  │        │  └─ Product Name
│  │        │
│  │        ├─ [Nested ProductDetailsProvider]
│  │        │  │
│  │        │  ├─ VariantGroupsSection
│  │        │  │  └─ VariantCards (read-only or limited)
│  │        │  │
│  │        │  └─ AddonGroupsSection
│  │        │     │
│  │        │     ├─ AddonGroupCard (group 1)
│  │        │     │  └─ AddonItems
│  │        │     │     └─ AddonCheckbox/Counter
│  │        │     │
│  │        │     └─ AddonGroupCard (group 2)
│  │        │        └─ ... (existing addon UI)
│  │        │
│  │        ├─ PriceBreakdown
│  │        │  └─ Addon Total Display
│  │        │
│  │        └─ DialogFooter
│  │           └─ SaveButton
│  │
│  └─ [CONDITIONAL: if NOT isCombo]
│     │
│     ├─ VariantGroupsSection
│     │  └─ ... (existing variant UI)
│     │
│     └─ AddonGroupsSection
│        └─ ... (existing addon UI)
│
├─ QuantitySelector
│
├─ PriceDisplay
│  ├─ [if isCombo] → comboTotalPrice
│  └─ [else] → totalPrice
│
└─ AddToCartButton
   ├─ [if isCombo] → disabled={!isComboValid}
   └─ [else] → disabled={!isValid}
```

---

## Component Responsibility Matrix

| Component | Responsibilities | Context Access | State Management |
|-----------|-----------------|----------------|------------------|
| **ProductDetailsProvider** | • Manage all state<br>• Provide context<br>• Handle API calls<br>• Calculate prices<br>• Run validations | N/A (provides) | All state (combo + regular) |
| **ProductDetailsContent** | • Conditional rendering<br>• Route to combo or regular flow | `productData` | None (presentational) |
| **ComboGroupsSection** | • Render all combo groups<br>• Render customization dialog | `productData.comboGroups`<br>`productData.comboGroupProducts` | None |
| **ComboGroupCard** | • Display group info<br>• Show selection count<br>• Show validation errors<br>• List selectable products | `comboSelections`<br>`getComboGroupValidation` | None |
| **ComboProductItem** | • Display product info<br>• Show selection state<br>• Handle toggle/customize clicks | `comboSelections` | None |
| **ComboCustomizationDialog** | • Show/hide dialog<br>• Fetch product details<br>• Render nested customization | `activeCustomizationGroup`<br>`activeCustomizationIndex`<br>`customizationProductData` | Dialog open/close |
| **QuantitySelector** | • Allow quantity input<br>• Update context | `quantity`<br>`setQuantity` | Local input state |
| **PriceDisplay** | • Show current price<br>• Conditional based on isCombo | `totalPrice` or `comboTotalPrice` | None |
| **AddToCartButton** | • Submit to cart<br>• Show validation state | `isValid` or `isComboValid`<br>`addToCart` | None |

---

## Data Flow Diagram

### Selection Flow

```
User Action: "Select Pizza 1"
       ↓
ComboProductItem.onToggle()
       ↓
toggleComboProduct(groupId, productId, ...)
       ↓
setComboSelections(prev => ...)
       ↓
Context updates comboSelections state
       ↓
       ├─→ ComboGroupCard re-renders
       │   └─→ Updates selection count
       │
       ├─→ ComboProductItem re-renders
       │   └─→ Shows "Selected 1" badge
       │
       ├─→ isComboValid recalculates
       │   └─→ AddToCartButton updates disabled state
       │
       └─→ comboTotalPrice recalculates
           └─→ PriceDisplay updates
```

### Customization Flow

```
User Action: "Customize Pizza 1"
       ↓
ComboProductItem.onCustomize()
       ↓
openComboCustomization(groupId, selectionIndex)
       ↓
Set activeCustomizationGroup/Index
       ↓
Fetch product details API
       ↓
Set customizationProductData
       ↓
ComboCustomizationDialog renders
       ↓
       └─→ Nested ProductDetailsProvider initializes
           ├─→ initialVariantId = selection.variantId
           └─→ initialPricing = selection.pricing
       ↓
User selects addons in nested provider
       ↓
User clicks "Save"
       ↓
ComboCustomizationContent.onSave(selectedPricingIds)
       ↓
updateComboItemPricing(groupId, selectionIndex, pricing)
       ↓
Update comboSelections[groupId][selectionIndex]
├─→ Set pricing = new values
└─→ Set customized = true
       ↓
closeComboCustomization()
       ↓
       ├─→ ComboProductItem re-renders
       │   └─→ Shows "Customized" badge
       │
       └─→ comboTotalPrice recalculates
           └─→ PriceDisplay updates
```

---

## State Dependencies

### Regular Product State

```
State Tree:
├─ selectedVariantId
│  ├─ Used by: VariantGroupsSection
│  ├─ Used by: AddonGroupsSection (for visibility)
│  └─ Affects: totalPrice, isValid
│
├─ selectedPricingIds
│  ├─ Used by: AddonGroupsSection
│  └─ Affects: totalPrice, isValid
│
├─ totalPrice
│  ├─ Computed from: selectedVariantId, selectedPricingIds
│  └─ Used by: PriceDisplay, AddToCartButton
│
└─ isValid
   ├─ Computed from: selectedVariantId, selectedPricingIds
   └─ Used by: AddToCartButton
```

### Combo Product State

```
State Tree:
├─ comboSelections
│  ├─ Used by: ComboGroupCard, ComboProductItem
│  ├─ Updated by: toggleComboProduct, updateComboItemPricing, removeComboSelection
│  └─ Affects: comboTotalPrice, isComboValid
│
├─ activeCustomizationGroup
│  ├─ Used by: ComboCustomizationDialog (isOpen check)
│  └─ Set by: openComboCustomization, closeComboCustomization
│
├─ activeCustomizationIndex
│  ├─ Used by: ComboCustomizationDialog (selection lookup)
│  └─ Set by: openComboCustomization, closeComboCustomization
│
├─ customizationProductData
│  ├─ Used by: ComboCustomizationDialog (nested provider)
│  └─ Set by: openComboCustomization API fetch
│
├─ comboTotalPrice
│  ├─ Computed from: comboSelections, product.basePrice, quantity
│  └─ Used by: PriceDisplay, AddToCartButton
│
└─ isComboValid
   ├─ Computed from: comboSelections, comboGroups validation
   └─ Used by: AddToCartButton
```

---

## Component Props Interface

### ComboGroupsSection

```typescript
interface ComboGroupsSectionProps {
  className?: string;
}

// Context Access:
// - productData (comboGroups, comboGroupProducts)
// - activeCustomizationGroup, activeCustomizationIndex
// - customizationProductData
```

### ComboGroupCard

```typescript
interface ComboGroupCardProps {
  group: ComboGroupResponse;           // Group config (min/max, label)
  products: ComboGroupProductResponse[]; // Selectable products for this group
  className?: string;
}

// Context Access:
// - comboSelections (for selection state)
// - getComboGroupValidation (for validation display)
// - toggleComboProduct (pass to items)
// - openComboCustomization (pass to items)
```

### ComboProductItem

```typescript
interface ComboProductItemProps {
  product: ComboGroupProductResponse;
  groupId: string;
  selectionIndex: number | null;    // 1-based display number (null if not selected)
  totalSelected: number;             // Current selections in group
  maxSelection: number;              // Max allowed in group
  allowCustomization: boolean;       // Can this be customized?
  onToggle: () => void;              // Toggle selection
  onCustomize: () => void;           // Open customization
  className?: string;
}

// Context Access (via parent):
// - comboSelections (for customized badge)
```

### ComboCustomizationDialog

```typescript
interface ComboCustomizationDialogProps {
  // No props - gets state from context
}

// Context Access:
// - activeCustomizationGroup (for isOpen check)
// - activeCustomizationIndex (for selection lookup)
// - customizationProductData (for nested provider)
// - comboSelections (for current selection)
// - closeComboCustomization (for onClose)
// - updateComboItemPricing (for onSave)
```

---

## Event Flow Patterns

### Pattern 1: User Selects Product

```
[UI Event]
ComboProductItem button click
    ↓
[Component Handler]
onToggle() prop function
    ↓
[Parent Handler]
ComboGroupCard: () => handleToggle(product)
    ↓
[Context Action]
toggleComboProduct(groupId, productId, comboGroupProductId, defaultVariantId)
    ↓
[State Update]
setComboSelections(prev => ...)
    ↓
[Context Re-render]
All consumers of comboSelections re-render
    ↓
[UI Update]
- ComboProductItem shows "Selected X" badge
- ComboGroupCard updates count
- PriceDisplay updates price
- AddToCartButton updates validation
```

### Pattern 2: User Customizes Product

```
[UI Event]
ComboProductItem "Customize" button click
    ↓
[Component Handler]
onCustomize() prop function
    ↓
[Parent Handler]
ComboGroupCard: () => handleCustomize(selectionIndex)
    ↓
[Context Action]
openComboCustomization(groupId, selectionIndex)
    ↓
[Async Operation]
fetch(`/api/products/${productId}`)
    ↓
[State Updates]
1. setActiveCustomizationGroup(groupId)
2. setActiveCustomizationIndex(selectionIndex)
3. setCustomizationProductData(response)
    ↓
[Dialog Opens]
ComboCustomizationDialog isOpen=true
    ↓
[Nested Provider]
ProductDetailsProvider with customization data
    ↓
[User Interaction]
User selects addons in dialog
    ↓
[Save Action]
ComboCustomizationContent.onSave(pricing)
    ↓
[Context Action]
updateComboItemPricing(groupId, selectionIndex, pricing)
    ↓
[State Updates]
1. Update comboSelections[groupId][selectionIndex]
2. closeComboCustomization()
    ↓
[UI Updates]
- Dialog closes
- ComboProductItem shows "Customized" badge
- PriceDisplay updates with addon prices
```

---

## Conditional Rendering Map

```
ProductDetailsContent
│
├─ IF product.isCombo === true
│  │
│  ├─ SHOW: ComboGroupsSection
│  ├─ HIDE: VariantGroupsSection
│  ├─ HIDE: AddonGroupsSection
│  │
│  ├─ PriceDisplay uses: comboTotalPrice
│  ├─ AddToCartButton uses: isComboValid
│  │
│  └─ ComboCustomizationDialog
│     │
│     └─ IF activeCustomizationGroup !== null
│        │
│        ├─ SHOW: Dialog
│        │
│        └─ [Nested ProductDetailsProvider]
│           │
│           ├─ SHOW: VariantGroupsSection (limited)
│           └─ SHOW: AddonGroupsSection (full)
│
└─ ELSE (regular product)
   │
   ├─ HIDE: ComboGroupsSection
   ├─ SHOW: VariantGroupsSection
   ├─ SHOW: AddonGroupsSection
   │
   ├─ PriceDisplay uses: totalPrice
   └─ AddToCartButton uses: isValid
```

---

## Component File Structure

```
components/
├─ product/
│  ├─ ProductDetailsContent.tsx         (main conditional component)
│  ├─ ProductHeader.tsx                  (shared)
│  ├─ ProductImages.tsx                  (shared)
│  │
│  ├─ combo/
│  │  ├─ ComboGroupsSection.tsx         (new)
│  │  ├─ ComboGroupCard.tsx             (new)
│  │  ├─ ComboProductItem.tsx           (new)
│  │  └─ ComboCustomizationDialog.tsx   (new)
│  │
│  ├─ variants/
│  │  ├─ VariantGroupsSection.tsx       (existing)
│  │  └─ VariantCard.tsx                (existing)
│  │
│  ├─ addons/
│  │  ├─ AddonGroupsSection.tsx         (existing)
│  │  └─ AddonCard.tsx                  (existing)
│  │
│  ├─ QuantitySelector.tsx              (shared, updated)
│  ├─ PriceDisplay.tsx                  (shared, updated)
│  └─ AddToCartButton.tsx               (shared, updated)
│
contexts/
└─ product-details-context.tsx          (extend with combo state)
```

---

## Memoization Strategy

### Computed Values (useMemo)

```typescript
// Combo-specific computed values
const comboTotalPrice = useMemo(() => {
  // Recalculate when:
  // - comboSelections changes
  // - product.basePrice changes
  // - quantity changes
}, [comboSelections, productData?.product.basePrice, quantity]);

const isComboValid = useMemo(() => {
  // Recalculate when:
  // - comboSelections changes
  // - comboGroups changes
}, [comboSelections, productData?.comboGroups]);
```

### Callback Functions (useCallback)

```typescript
// Combo actions
const toggleComboProduct = useCallback((groupId, productId, ...) => {
  // Dependencies:
  // - productData (for maxSelection check)
}, [productData]);

const openComboCustomization = useCallback(async (groupId, index) => {
  // Dependencies:
  // - comboSelections (to get productId)
}, [comboSelections]);

const updateComboItemPricing = useCallback((groupId, index, pricing) => {
  // Dependencies:
  // - closeComboCustomization function
}, [closeComboCustomization]);

const getComboGroupValidation = useCallback((groupId) => {
  // Dependencies:
  // - productData (for group config)
  // - comboSelections (for current state)
}, [productData, comboSelections]);
```

---

## Re-render Optimization

### Context Value Memoization

```typescript
const value = useMemo<ProductDetailsContextValue>(
  () => ({
    // ... all values ...
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
  }),
  [
    // All dependencies that affect these values
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
    // ... plus regular product dependencies ...
  ]
);
```

### Component-Level Optimization

```typescript
// Memoize expensive list renders
const ComboProductList = memo(function ComboProductList({
  products,
  groupId
}: {
  products: ComboGroupProductResponse[];
  groupId: string;
}) {
  return (
    <>
      {products.map(product => (
        <ComboProductItem key={product._id} product={product} groupId={groupId} />
      ))}
    </>
  );
});
```

---

## Error Boundaries

### Recommended Boundaries

```tsx
// Top-level: Catch product loading errors
<ErrorBoundary fallback={<ProductErrorFallback />}>
  <ProductDetailsProvider>
    <ProductDetailsContent />
  </ProductDetailsProvider>
</ErrorBoundary>

// Combo section: Catch combo-specific errors
<ErrorBoundary fallback={<ComboErrorFallback />}>
  <ComboGroupsSection />
</ErrorBoundary>

// Customization dialog: Catch dialog errors
<ErrorBoundary fallback={<CustomizationErrorFallback />}>
  <ComboCustomizationDialog />
</ErrorBoundary>
```

---

## Testing Strategy

### Unit Tests

```typescript
// Context actions
describe("toggleComboProduct", () => {
  it("adds product when not selected");
  it("removes product when already selected");
  it("respects maxSelection limit");
  it("initializes with correct default state");
});

describe("openComboCustomization", () => {
  it("sets dialog state correctly");
  it("fetches product details");
  it("handles fetch errors");
});

describe("updateComboItemPricing", () => {
  it("updates pricing correctly");
  it("sets customized flag to true");
  it("closes dialog after save");
});

describe("getComboGroupValidation", () => {
  it("validates min selection requirement");
  it("validates max selection limit");
  it("returns correct error messages");
});
```

### Integration Tests

```typescript
// Component interactions
describe("Combo selection flow", () => {
  it("user can select products in a group");
  it("selection count updates correctly");
  it("validation errors show when requirements not met");
  it("price updates when selections change");
});

describe("Customization flow", () => {
  it("dialog opens when customize clicked");
  it("product details load in dialog");
  it("user can select addons");
  it("pricing saves correctly");
  it("customized badge appears");
});
```

### E2E Tests

```typescript
// Full user journeys
describe("Combo product purchase", () => {
  it("user can complete combo and add to cart");
  it("user can customize combo items");
  it("validation prevents incomplete combos");
  it("price calculation is correct");
  it("cart receives correct combo data");
});
```

---

## Summary

This component hierarchy document provides:

1. **Visual component tree** showing parent-child relationships
2. **Responsibility matrix** defining what each component does
3. **Data flow diagrams** showing how actions propagate
4. **State dependencies** mapping state to components
5. **Event flow patterns** documenting user interaction flows
6. **Conditional rendering map** showing when components appear
7. **File structure** organizing code by feature
8. **Optimization strategies** for performance
9. **Testing approach** for quality assurance

Use this alongside the main architecture document for implementation guidance.
