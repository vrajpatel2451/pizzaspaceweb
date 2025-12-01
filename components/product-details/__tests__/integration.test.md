# Product Details Integration Tests

This document outlines the integration test cases for the Product Details feature. These tests should verify that all components work together seamlessly with the ProductDetailsContext.

## Test Categories

### 1. Context Integration

- [ ] Verify ProductDetailsProvider wraps all components correctly
- [ ] Confirm first primary variant is auto-selected on load
- [ ] Test that context is accessible from all child components

### 2. Variant Selection

- [ ] Test that selecting a variant updates total price
  - Select primary variant → verify price includes variant.price
  - Select secondary variant → verify price from pricing array
  - Switch between variants → verify price recalculates

- [ ] Verify price calculation logic
  - Primary variants: Use direct variant.price
  - Secondary variants: Lookup in pricing array with primary variant context

### 3. Addon Selection

- [ ] Test that toggling addon updates total price
  - Toggle addon on → price increases
  - Toggle addon off → price decreases

- [ ] Test quantity changes
  - Increase addon quantity → price multiplies
  - Set quantity to 0 → addon deselected

- [ ] Test addon pricing based on primary variant
  - Different primary variants → different addon prices
  - Fallback to group-level pricing when variant-specific not found

### 4. Price Calculation

Formula: `totalPrice = (basePrice + variantPrices + addonPrices) * itemQuantity`

- [ ] Test complete price calculation with all selection types
- [ ] Test item quantity multiplier
- [ ] Edge cases:
  - No variants selected (base price only)
  - Only primary variants
  - Primary + secondary + addons

### 5. Validation

- [ ] Test isValid flag
  - Missing primary variant → isValid=false
  - Addon min not met → isValid=false
  - Addon max exceeded → isValid=false
  - All constraints met → isValid=true

- [ ] Test validationErrors array
  - Contains clear error messages
  - Updates dynamically as selections change

- [ ] Test UI state
  - Add to Cart button disabled when invalid
  - Error messages displayed to user

### 6. Add to Cart Flow

- [ ] Test onAddToCart callback
  - Receives correct CartItem structure
  - Includes all selected variants with labels
  - Includes all selected addons with quantities
  - Includes correct total price

- [ ] Test data transformation
  - Context Maps → CartItem arrays
  - Addon selection Map → filtered array with quantities

- [ ] Test validation prevents submission
  - Button click does nothing when invalid

### 7. Data Fetching

- [ ] Test lazy mode (fetch on modal open)
- [ ] Test eager mode (fetch immediately)
- [ ] Test loading state displays ProductDetailsSkeleton
- [ ] Test error state displays error message
- [ ] Test cache prevents duplicate fetches

### 8. Responsive Behavior

- [ ] Test desktop viewport (≥640px) renders ProductDetailsDialog
- [ ] Test mobile viewport (<640px) renders ProductDetailsBottomsheet

### 9. Edge Cases

- [ ] Handle null/undefined product data
- [ ] Handle empty variant groups
- [ ] Handle empty addon groups
- [ ] Handle missing pricing entries (fallback to 0)
- [ ] Reset selections on modal close

## Implementation Notes

### Tools Required
- React Testing Library
- Jest
- Mock product data

### Key Testing Patterns

1. **Render with Provider**
```typescript
render(
  <ProductDetailsProvider initialData={mockData}>
    <ComponentUnderTest />
  </ProductDetailsProvider>
);
```

2. **Access Context in Tests**
```typescript
const TestComponent = () => {
  const context = useProductDetailsContext();
  return <div data-testid="context-value">{context.totalPrice}</div>;
};
```

3. **Simulate User Interactions**
```typescript
// Select variant
fireEvent.click(screen.getByLabelText('Small'));

// Toggle addon
fireEvent.click(screen.getByLabelText('Extra Cheese'));

// Change quantity
fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
```

4. **Assert Price Changes**
```typescript
expect(screen.getByText('£12.99')).toBeInTheDocument();
```

## Test Data Requirements

### Mock Product with:
- Base price
- Primary variant group (e.g., Size)
- Secondary variant group (e.g., Crust)
- Addon group with min constraint
- Addon group with max constraint
- Complete pricing array
- Variant-specific addon pricing
