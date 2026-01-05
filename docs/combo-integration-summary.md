# Combo Context Integration Summary

## Quick Overview

This document provides a high-level summary of how combo products integrate with the existing `ProductDetailsContext`. For detailed implementation, see [combo-context-architecture.md](./combo-context-architecture.md).

---

## Key Design Decisions

### 1. Conditional State Management

```typescript
// The context switches behavior based on product.isCombo flag
if (product.isCombo === true) {
  // Use: comboSelections, comboTotalPrice, isComboValid
  // Hide: variants, addons, selectedVariantId, selectedPricingIds
} else {
  // Use: selectedVariantId, selectedPricingIds, totalPrice, isValid
  // Hide: combo-specific state
}
```

### 2. State Structure

**For Regular Products:**
```typescript
{
  selectedVariantId: "var_123",
  selectedPricingIds: [
    { id: "pricing_addon_1", quantity: 2 }
  ]
}
```

**For Combo Products:**
```typescript
{
  comboSelections: {
    "group_pizza_1": [
      {
        productId: "prod_margherita",
        comboGroupProductId: "cgp_123",
        variantId: "var_9inch",
        pricing: [
          { id: "pricing_cheese", quantity: 1, price: 200 }
        ],
        customized: true
      }
    ]
  }
}
```

### 3. Price Calculation Differences

| Aspect | Regular Product | Combo Product |
|--------|----------------|---------------|
| Base Price | `variant.price` or `product.basePrice` | `product.basePrice` only |
| Addon Price | Sum of selected addons | Sum of addons across all combo items |
| Variant Price | Variant pricing affects base | Variants are FREE (defaultVariantId is for addon pricing only) |
| Formula | `(base + addons) × quantity` | `(baseCombo + allComboItemAddons) × quantity` |

---

## State Extensions Required

### New Context Fields

```typescript
interface ProductDetailsContextValue {
  // ... existing fields ...

  // COMBO STATE (only used when isCombo=true)
  comboSelections: ComboGroupSelectionState;
  activeCustomizationGroup: string | null;
  activeCustomizationIndex: number | null;
  customizationProductData: ProductDetailsResponse | null;

  // COMBO ACTIONS
  toggleComboProduct: (groupId, productId, comboGroupProductId, defaultVariantId?) => void;
  openComboCustomization: (groupId, selectionIndex) => Promise<void>;
  closeComboCustomization: () => void;
  updateComboItemPricing: (groupId, selectionIndex, pricing) => void;
  removeComboSelection: (groupId, selectionIndex) => void;

  // COMBO COMPUTED
  getComboGroupValidation: (groupId) => ComboValidationResult;
  isComboValid: boolean;
  comboTotalPrice: number;
}
```

### New State Variables (in Provider)

```typescript
// Add to ProductDetailsProvider
const [comboSelections, setComboSelections] = useState<ComboGroupSelectionState>({});
const [activeCustomizationGroup, setActiveCustomizationGroup] = useState<string | null>(null);
const [activeCustomizationIndex, setActiveCustomizationIndex] = useState<number | null>(null);
const [customizationProductData, setCustomizationProductData] = useState<ProductDetailsResponse | null>(null);
```

---

## Action Implementation Guide

### 1. toggleComboProduct

**Purpose**: Add or remove a product from a combo group's selections.

**Logic Flow**:
```typescript
1. Check if product already selected in group
   - YES: Remove from array
   - NO: Check if under maxSelection limit
     - YES: Add to array with default state
     - NO: Return early (UI should disable button)
```

**State Update**:
```typescript
setComboSelections(prev => ({
  ...prev,
  [groupId]: existingIndex >= 0
    ? groupSelections.filter((_, i) => i !== existingIndex)
    : [...groupSelections, newSelection]
}));
```

### 2. openComboCustomization

**Purpose**: Open customization dialog and fetch product details.

**Logic Flow**:
```typescript
1. Set activeCustomizationGroup = groupId
2. Set activeCustomizationIndex = selectionIndex
3. Fetch full product details via API
4. Set customizationProductData = response
5. Dialog opens automatically (via isOpen check)
```

**Error Handling**:
```typescript
try {
  const response = await fetch(`/api/products/${productId}`);
  const data = await response.json();
  setCustomizationProductData(data);
} catch (err) {
  console.error("Failed to load customization:", err);
  closeComboCustomization(); // Reset on error
}
```

### 3. updateComboItemPricing

**Purpose**: Save addon selections from customization dialog.

**Logic Flow**:
```typescript
1. Update comboSelections[groupId][selectionIndex]
   - Set pricing = new addon selections
   - Set customized = true
2. Close customization dialog
```

**State Update**:
```typescript
setComboSelections(prev => ({
  ...prev,
  [groupId]: groupSelections.map((item, i) =>
    i === selectionIndex
      ? { ...item, pricing, customized: true }
      : item
  )
}));
closeComboCustomization();
```

### 4. getComboGroupValidation

**Purpose**: Check if a combo group meets min/max requirements.

**Logic Flow**:
```typescript
1. Get group config (minSelection, maxSelection)
2. Count selections in comboSelections[groupId]
3. Compare: selectedCount vs min/max
4. Return validation result with error message if invalid
```

**Return Example**:
```typescript
{
  isValid: false,
  error: "Please select at least 2 items",
  selectedCount: 1,
  minRequired: 2,
  maxAllowed: 2
}
```

---

## Component Integration Pattern

### Main Product Page

```tsx
function ProductDetailsContent() {
  const { productData } = useProductDetailsContext();
  const isCombo = productData?.product.isCombo;

  return (
    <div>
      <ProductHeader />
      <ProductImages />

      {/* Conditional rendering */}
      {isCombo ? (
        <ComboGroupsSection />
      ) : (
        <>
          <VariantGroupsSection />
          <AddonGroupsSection />
        </>
      )}

      <QuantitySelector />
      <PriceDisplay /> {/* Uses comboTotalPrice if isCombo */}
      <AddToCartButton />
    </div>
  );
}
```

### Price Display Component

```tsx
function PriceDisplay() {
  const {
    productData,
    totalPrice,      // Regular product price
    comboTotalPrice  // Combo product price
  } = useProductDetailsContext();

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

### Add to Cart Button

```tsx
function AddToCartButton() {
  const {
    productData,
    isValid,      // Regular product validation
    isComboValid, // Combo product validation
    addToCart
  } = useProductDetailsContext();

  const canAddToCart = productData?.product.isCombo
    ? isComboValid
    : isValid;

  return (
    <Button
      disabled={!canAddToCart}
      onClick={addToCart}
    >
      Add to Cart
    </Button>
  );
}
```

---

## Validation Rules

### Regular Product Validation

```typescript
✓ Must have selectedVariantId (if variants exist)
✓ Must respect maxItems constraints
✓ Addon group min/max rules (if not skipValidation)
```

### Combo Product Validation

```typescript
✓ Each combo group must meet minSelection
✓ Each combo group must not exceed maxSelection
✓ All required groups must have selections
✓ No variant-level validation (variants are pre-selected)
```

### Validation UI States

```tsx
// Show per-group errors
<ComboGroupCard>
  {!validation.isValid && (
    <Alert variant="warning">
      {validation.error}
    </Alert>
  )}
</ComboGroupCard>

// Disable add to cart if any group invalid
<Button disabled={!isComboValid}>
  Add to Cart
</Button>
```

---

## Data Flow Diagrams

### Regular Product Flow

```
User selects variant
    ↓
selectPrimaryVariant()
    ↓
selectedVariantId updated
    ↓
User selects addons
    ↓
toggleAddon()
    ↓
selectedPricingIds updated
    ↓
totalPrice recalculated
    ↓
addToCart() → API
```

### Combo Product Flow

```
User selects combo product
    ↓
toggleComboProduct()
    ↓
comboSelections[groupId] updated
    ↓
User clicks "Customize"
    ↓
openComboCustomization()
    ↓
Fetch product details → customizationProductData
    ↓
User selects addons in dialog
    ↓
updateComboItemPricing()
    ↓
comboSelections[groupId][index].pricing updated
    ↓
comboTotalPrice recalculated
    ↓
addToCart() → API (with combo data)
```

---

## API Integration Changes

### Regular Product Add to Cart

```typescript
POST /api/cart
{
  productId: "prod_123",
  variantId: "var_456",
  pricing: [
    { id: "pricing_1", quantity: 2 }
  ],
  quantity: 1,
  totalPrice: 1500
}
```

### Combo Product Add to Cart

```typescript
POST /api/cart
{
  productId: "combo_123",
  variantId: "",              // Empty for combos
  pricing: [],                // Empty for combos
  quantity: 1,
  totalPrice: 2100,
  isCombo: true,
  comboSelections: [
    {
      groupId: "group_pizza_1",
      productId: "prod_margherita",
      pricing: [
        { id: "pricing_cheese", quantity: 1, price: 200 }
      ]
    },
    {
      groupId: "group_pizza_1",
      productId: "prod_pepperoni",
      pricing: []
    }
  ]
}
```

---

## Testing Scenarios

### Test Case 1: Basic Selection

```typescript
✓ Select products in combo group
✓ Verify selection order (1, 2, 3...)
✓ Check validation passes when min/max met
✓ Verify price updates correctly
```

### Test Case 2: Customization

```typescript
✓ Open customization dialog
✓ Verify product details loaded
✓ Select addons
✓ Save and verify pricing updated
✓ Check "Customized" badge appears
```

### Test Case 3: Validation

```typescript
✓ Try to add to cart with incomplete selections
✓ Verify error messages per group
✓ Complete selections and verify validation passes
✓ Test min/max edge cases (0, 1, max, max+1)
```

### Test Case 4: Edge Cases

```typescript
✓ Remove selection (verify array re-indexes)
✓ Toggle same product on/off
✓ Open/close dialog without saving
✓ Switch between regular and combo products
✓ Multiple combo groups (verify independence)
```

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Only fetch product details when "Customize" is clicked
2. **Memoization**: Use `useMemo` for computed values (price, validation)
3. **Callback Stability**: Use `useCallback` for all action functions
4. **Context Splitting**: Consider splitting combo state if re-renders become issue

### Potential Bottlenecks

1. **Large Combo Groups**: If many products per group, virtualize list
2. **Complex Pricing**: Memoize price calculations per group
3. **Validation**: Only validate affected group on selection change
4. **API Calls**: Cache product details for customization dialog

---

## Migration Path

### Phase 1: Context Extension
- [ ] Add combo state variables
- [ ] Add combo action functions
- [ ] Update context value interface
- [ ] Test context in isolation

### Phase 2: Component Creation
- [ ] Create ComboGroupsSection
- [ ] Create ComboGroupCard
- [ ] Create ComboProductItem
- [ ] Create ComboCustomizationDialog

### Phase 3: Integration
- [ ] Add conditional rendering to main page
- [ ] Update price display logic
- [ ] Update validation logic
- [ ] Update add to cart logic

### Phase 4: Testing & Refinement
- [ ] Test all user flows
- [ ] Test edge cases
- [ ] Performance optimization
- [ ] Final polish and bug fixes

---

## Questions & Considerations

### Open Questions

1. **Q**: Should we allow editing combo items in cart?
   **A**: TBD - May require additional cart context state

2. **Q**: Can users change quantity per combo item or only overall combo quantity?
   **A**: Only overall combo quantity (individual items are fixed)

3. **Q**: What happens if a product in a combo becomes unavailable?
   **A**: TBD - Need fallback/substitution logic

### Design Decisions to Confirm

1. **Selection Order**: Array index = selection order (current approach)
   - Alternative: Add explicit `order` field to ComboItemSelection

2. **Variant Selection**: defaultVariantId is fixed (current approach)
   - Alternative: Allow variant selection per combo item

3. **Dialog State**: Single customization dialog at a time (current approach)
   - Alternative: Support multiple simultaneous customizations

4. **Price Display**: Show breakdown or just total? (current: just total)
   - Alternative: Add expandable price breakdown component

---

## Related Documentation

- [Combo Types Definition](../types/combo.ts)
- [Product Types](../types/product.ts)
- [Cart Types](../types/cart.ts)
- [Existing Context](../contexts/product-details-context.tsx)
- [Full Architecture Document](./combo-context-architecture.md)

---

## Support & Feedback

For questions or feedback on this architecture, please:
1. Review the full architecture document first
2. Check if your question is covered in "Open Questions" section
3. Discuss with the team before making significant changes
4. Document any deviations during implementation
