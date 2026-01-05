# Combo Product Quick Reference Guide

**For developers implementing combo product features**

---

## At a Glance

### When is it a Combo Product?

```typescript
if (product.isCombo === true) {
  // Use combo flow
} else {
  // Use regular variant/addon flow
}
```

### Key Differences

| Feature | Regular Product | Combo Product |
|---------|----------------|---------------|
| **Selection UI** | Variant + Addon groups | Combo groups with selectable products |
| **Price** | Base variant price + addons | Base combo price + all item addons |
| **Validation** | Variant required, addon min/max | Group min/max selections |
| **State** | `selectedVariantId`, `selectedPricingIds` | `comboSelections` (nested structure) |
| **Customization** | Inline addon selection | Dialog per combo item |

---

## Context API Quick Reference

### Reading Combo State

```typescript
const {
  // Check if combo
  productData, // productData.product.isCombo

  // Combo selections
  comboSelections, // { [groupId]: ComboItemSelection[] }

  // Validation
  getComboGroupValidation, // (groupId) => validation result
  isComboValid, // boolean (all groups valid)

  // Price
  comboTotalPrice, // number (in cents)

  // Dialog state
  activeCustomizationGroup, // string | null
  activeCustomizationIndex, // number | null
  customizationProductData, // ProductDetailsResponse | null
} = useProductDetailsContext();
```

### Modifying Combo State

```typescript
const {
  // Toggle product selection
  toggleComboProduct, // (groupId, productId, comboGroupProductId, defaultVariantId?)

  // Open customization
  openComboCustomization, // (groupId, selectionIndex) => Promise<void>

  // Close customization
  closeComboCustomization, // () => void

  // Update pricing
  updateComboItemPricing, // (groupId, selectionIndex, pricing)

  // Remove selection
  removeComboSelection, // (groupId, selectionIndex)
} = useProductDetailsContext();
```

---

## Common Patterns

### 1. Check if Product is Selected

```typescript
const selections = comboSelections[groupId] || [];
const isSelected = selections.some(s => s.productId === productId);

// Get selection index (0-based for array, 1-based for display)
const selectionIndex = selections.findIndex(s => s.productId === productId);
const displayNumber = selectionIndex >= 0 ? selectionIndex + 1 : null;
```

### 2. Check if Can Select More

```typescript
const group = productData.comboGroups.find(g => g.groupId === groupId);
const selections = comboSelections[groupId] || [];
const canSelectMore = selections.length < group.maxSelection;
```

### 3. Check if Group is Valid

```typescript
const validation = getComboGroupValidation(groupId);

if (!validation.isValid) {
  console.log(validation.error); // "Please select at least 2 items"
  console.log(validation.selectedCount); // 1
  console.log(validation.minRequired); // 2
}
```

### 4. Get Current Selection for Editing

```typescript
const currentSelection = comboSelections[groupId]?.[selectionIndex];

if (currentSelection) {
  console.log(currentSelection.productId);
  console.log(currentSelection.pricing); // Existing addon selections
  console.log(currentSelection.customized); // Has user customized?
}
```

### 5. Display Price

```typescript
const { productData, totalPrice, comboTotalPrice } = useProductDetailsContext();

const displayPrice = productData?.product.isCombo
  ? comboTotalPrice
  : totalPrice;

// Convert from cents to dollars
const formattedPrice = `$${(displayPrice / 100).toFixed(2)}`;
```

### 6. Validate Before Add to Cart

```typescript
const { productData, isValid, isComboValid } = useProductDetailsContext();

const canAddToCart = productData?.product.isCombo
  ? isComboValid
  : isValid;

<Button disabled={!canAddToCart} onClick={addToCart}>
  Add to Cart
</Button>
```

---

## Component Usage Examples

### Example 1: Render Combo Groups

```tsx
function ProductDetails() {
  const { productData } = useProductDetailsContext();

  if (!productData) return <Skeleton />;

  return (
    <div>
      {productData.product.isCombo ? (
        <ComboGroupsSection />
      ) : (
        <>
          <VariantGroupsSection />
          <AddonGroupsSection />
        </>
      )}
    </div>
  );
}
```

### Example 2: Combo Group Card

```tsx
function ComboGroupCard({ group, products }: ComboGroupCardProps) {
  const { comboSelections, getComboGroupValidation, toggleComboProduct } =
    useProductDetailsContext();

  const selections = comboSelections[group.groupId] || [];
  const validation = getComboGroupValidation(group.groupId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.label}</CardTitle>
        <p>{selections.length}/{group.maxSelection} selected</p>
      </CardHeader>

      {!validation.isValid && (
        <Alert variant="warning">{validation.error}</Alert>
      )}

      <CardContent>
        {products.map(product => {
          const selectionIndex = selections.findIndex(
            s => s.productId === product.productId
          );

          return (
            <ComboProductItem
              key={product._id}
              product={product}
              groupId={group.groupId}
              selectionIndex={selectionIndex >= 0 ? selectionIndex + 1 : null}
              totalSelected={selections.length}
              maxSelection={group.maxSelection}
              allowCustomization={group.allowCustomization}
              onToggle={() =>
                toggleComboProduct(
                  group.groupId,
                  product.productId,
                  product._id,
                  product.defaultVariantId
                )
              }
              onCustomize={() => openComboCustomization(group.groupId, selectionIndex)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
```

### Example 3: Product Item

```tsx
function ComboProductItem({
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

  const selection = isSelected
    ? comboSelections[groupId]?.[selectionIndex - 1]
    : null;

  return (
    <div className="flex items-center gap-4">
      <CustomImage
        src={product.product?.photoList[0]}
        alt={product.product?.name || ""}
        width={80}
        height={80}
      />

      <div className="flex-1">
        <h4>{product.product?.name}</h4>
        {selection?.customized && <Badge>Customized</Badge>}
      </div>

      <div className="flex gap-2">
        {isSelected ? (
          <>
            <Badge>Selected {selectionIndex}</Badge>
            {allowCustomization && (
              <Button size="sm" onClick={onCustomize}>
                Customize
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onToggle}>
              Remove
            </Button>
          </>
        ) : (
          <Button disabled={!canSelect} onClick={onToggle}>
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Example 4: Customization Dialog

```tsx
function ComboCustomizationDialog() {
  const {
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,
    comboSelections,
    closeComboCustomization,
    updateComboItemPricing
  } = useProductDetailsContext();

  const isOpen = activeCustomizationGroup !== null;

  if (!isOpen || !customizationProductData) return null;

  const currentSelection =
    comboSelections[activeCustomizationGroup!]?.[activeCustomizationIndex!];

  return (
    <Dialog open={isOpen} onOpenChange={closeComboCustomization}>
      <DialogContent>
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
            onSave={(pricing) => {
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

function CustomizationContent({ onSave }: { onSave: (pricing: any[]) => void }) {
  const { selectedPricingIds } = useProductDetailsContext();

  return (
    <div>
      <AddonGroupsSection />
      <Button onClick={() => onSave(selectedPricingIds)}>
        Save Customization
      </Button>
    </div>
  );
}
```

---

## Common Mistakes to Avoid

### 1. Mixing Regular and Combo State

❌ **Wrong:**
```typescript
if (product.isCombo) {
  // Don't use selectedVariantId for combos
  const price = totalPrice; // Wrong!
}
```

✅ **Correct:**
```typescript
if (product.isCombo) {
  const price = comboTotalPrice;
  // Use comboSelections, not selectedVariantId
}
```

### 2. Array Index Off-by-One

❌ **Wrong:**
```typescript
// selectionIndex from component is 1-based
const selection = comboSelections[groupId][selectionIndex]; // Off by 1!
```

✅ **Correct:**
```typescript
// Convert 1-based display number to 0-based array index
const selection = comboSelections[groupId][selectionIndex - 1];
```

### 3. Forgetting to Handle Empty Arrays

❌ **Wrong:**
```typescript
const selections = comboSelections[groupId];
selections.forEach(s => console.log(s)); // Crash if undefined!
```

✅ **Correct:**
```typescript
const selections = comboSelections[groupId] || [];
selections.forEach(s => console.log(s));
```

### 4. Not Checking Validation Before Add to Cart

❌ **Wrong:**
```typescript
<Button onClick={addToCart}>Add to Cart</Button>
```

✅ **Correct:**
```typescript
const canAdd = productData?.product.isCombo ? isComboValid : isValid;
<Button disabled={!canAdd} onClick={addToCart}>Add to Cart</Button>
```

### 5. Accessing Product Details Before Loading

❌ **Wrong:**
```typescript
const isCombo = productData.product.isCombo; // Crash if null!
```

✅ **Correct:**
```typescript
const isCombo = productData?.product.isCombo ?? false;
```

---

## Debugging Tips

### 1. Log Current Combo State

```typescript
console.log("Combo Selections:", comboSelections);
console.log("Is Valid:", isComboValid);
console.log("Total Price:", comboTotalPrice);

// Log specific group
const groupId = "group_pizza_1";
console.log("Group selections:", comboSelections[groupId]);
console.log("Group validation:", getComboGroupValidation(groupId));
```

### 2. Check Product Data Structure

```typescript
console.log("Is Combo:", productData?.product.isCombo);
console.log("Combo Groups:", productData?.comboGroups);
console.log("Combo Products:", productData?.comboGroupProducts);
```

### 3. Verify Dialog State

```typescript
console.log("Active Group:", activeCustomizationGroup);
console.log("Active Index:", activeCustomizationIndex);
console.log("Product Data Loaded:", !!customizationProductData);
```

### 4. Trace Price Calculation

```typescript
const breakdown = productData?.comboGroups?.map(group => {
  const selections = comboSelections[group.groupId] || [];
  const groupTotal = selections.reduce((sum, sel) => {
    const itemTotal = sel.pricing.reduce(
      (s, p) => s + p.price * p.quantity,
      0
    );
    return sum + itemTotal;
  }, 0);

  return {
    group: group.label,
    selections: selections.length,
    addonTotal: groupTotal
  };
});

console.log("Price Breakdown:", breakdown);
console.log("Base Price:", productData?.product.basePrice);
console.log("Total:", comboTotalPrice);
```

---

## Type Reference

### Key Types

```typescript
// From /types/combo.ts
ComboGroupSelectionState
ComboItemSelection
ComboValidationResult
ComboContextState
ComboContextActions

// From /types/product.ts
ComboGroupResponse
ComboGroupProductResponse

// From /contexts/product-details-context.tsx
ProductDetailsContextValue
PricingSelection
```

### Type Imports

```typescript
import type {
  ComboGroupSelectionState,
  ComboItemSelection,
  ComboValidationResult
} from "@/types/combo";

import type {
  ComboGroupResponse,
  ComboGroupProductResponse
} from "@/types/product";

import type {
  PricingSelection
} from "@/contexts/product-details-context";
```

---

## Constants Reference

```typescript
// From /types/combo.ts

// Default values
COMBO_DEFAULTS.EMPTY_SELECTION_STATE // {}
COMBO_DEFAULTS.DEFAULT_VARIANT_ID // ""
COMBO_DEFAULTS.INITIAL_PRICING // []
COMBO_DEFAULTS.INITIAL_CUSTOMIZED // false

// Error messages
COMBO_ERRORS.VALIDATION_FAILED
COMBO_ERRORS.MIN_NOT_MET(min)
COMBO_ERRORS.MAX_EXCEEDED(max)
COMBO_ERRORS.OUT_OF_RANGE(selected, min, max)

// UI text
COMBO_UI.SELECTED_TEXT(index) // "Selected 1"
COMBO_UI.CUSTOMIZE_TEXT // "Customize"
COMBO_UI.CUSTOMIZED_TEXT // "Customized"
COMBO_UI.REMOVE_TEXT // "Remove"
COMBO_UI.SELECTION_COUNT(selected, max) // "1/2 selected"
```

---

## API Integration

### Add to Cart Payload

```typescript
// Regular product
{
  productId: "prod_123",
  variantId: "var_456",
  pricing: [{ id: "pricing_1", quantity: 2 }],
  quantity: 1,
  totalPrice: 1500
}

// Combo product
{
  productId: "combo_123",
  variantId: "", // Empty
  pricing: [], // Empty
  quantity: 1,
  totalPrice: 2100,
  isCombo: true,
  comboSelections: [
    {
      groupId: "group_pizza_1",
      productId: "prod_margherita",
      pricing: [{ id: "pricing_cheese", quantity: 1, price: 200 }]
    }
  ]
}
```

### Transform Function

```typescript
// Helper to transform comboSelections to API format
function transformComboSelectionsToAPI(
  selections: ComboGroupSelectionState
): FlatComboSelection[] {
  const result: FlatComboSelection[] = [];

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

---

## Testing Checklist

- [ ] Product loads correctly (combo flag detected)
- [ ] Combo groups render with correct products
- [ ] Can select products (respects maxSelection)
- [ ] Can remove products
- [ ] Selection numbers update (1, 2, 3...)
- [ ] Validation shows errors when requirements not met
- [ ] Price updates when selections change
- [ ] Customize button opens dialog
- [ ] Dialog loads product details
- [ ] Can select addons in dialog
- [ ] Save button updates pricing and closes dialog
- [ ] Customized badge appears
- [ ] Price includes addon prices
- [ ] Add to cart disabled when invalid
- [ ] Add to cart sends correct data format
- [ ] Quantity selector works
- [ ] Multiple combo groups work independently

---

## Performance Checklist

- [ ] Use `useMemo` for computed values (price, validation)
- [ ] Use `useCallback` for action functions
- [ ] Memoize context value
- [ ] Avoid unnecessary re-renders
- [ ] Lazy load product details (only on customize)
- [ ] Virtualize long product lists if needed
- [ ] Debounce validation if expensive

---

## Resources

- [Full Architecture Document](./combo-context-architecture.md)
- [Integration Summary](./combo-integration-summary.md)
- [Component Hierarchy](./combo-component-hierarchy.md)
- [Type Definitions](/types/combo.ts)
- [Existing Context](/contexts/product-details-context.tsx)

---

## Quick Troubleshooting

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| "Cannot read property 'isCombo'" | productData is null | Use optional chaining: `productData?.product.isCombo` |
| Selection index off by one | Using 1-based index for array | Convert: `array[displayIndex - 1]` |
| Price not updating | Not using comboTotalPrice | Check: `isCombo ? comboTotalPrice : totalPrice` |
| Validation always fails | Empty comboSelections | Check group initialization and toggleComboProduct |
| Dialog won't open | activeCustomization state not set | Verify openComboCustomization called correctly |
| Customization not saving | Wrong index passed | Ensure selectionIndex is 0-based array index |
| Can't select more items | At maxSelection limit | Check: `totalSelected < maxSelection` |

---

**Last Updated**: 2026-01-05
**Next Steps**: Implement context extensions → Create components → Test flows → Integrate with cart
