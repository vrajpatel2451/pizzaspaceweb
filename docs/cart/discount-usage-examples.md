# Discount Section - Usage Examples

## Basic Usage

### In Cart Page
```tsx
import { DiscountSection } from "@/components/cart";

export default function CartPage() {
  return (
    <div>
      {/* Other cart components */}

      <DiscountSection />

      {/* More components */}
    </div>
  );
}
```

That's it! The component is fully self-contained and requires no props.

## How It Works

### 1. User Enters Discount Code

```
User types "SAVE20" → Clicks Apply →
Component calls getDiscounts({ cartIds, storeId, search: "SAVE20" }) →
Finds exact match → Adds to cart store → Shows success
```

### 2. User Browses Available Discounts

```
User clicks "View All" →
Component fetches all applicable discounts →
Modal opens with searchable list →
User clicks Apply on a discount →
Discount added to cart store → Modal closes
```

### 3. User Removes Discount

```
User clicks X on discount badge →
removeDiscount(id) called →
Discount removed from store →
Cart summary auto-refreshes
```

## Integration with Cart Summary

The component automatically integrates with the cart summary system:

```tsx
// This happens automatically in useCartSummary hook
const { selectedDiscountIds } = useCartStore();

// When discount IDs change, summary refetches with new params
const requestParams = {
  cartIds,
  storeId,
  discountIds: selectedDiscountIds, // ← Automatically included
  deliveryType,
  addressId,
};
```

## Code Examples

### Example 1: Apply Discount Code

```tsx
// Component handles this internally
const handleApplyCode = async () => {
  // 1. Validate input
  if (!trimmedCode) {
    setError("Please enter a coupon code");
    return;
  }

  // 2. Search for discount
  const response = await getDiscounts({
    cartIds: getCartIds(),
    storeId: selectedStore._id,
    search: trimmedCode,
  });

  // 3. Find exact match
  const matchedDiscount = response.data.find(
    d => d.couponCode.toLowerCase() === trimmedCode.toLowerCase()
  );

  // 4. Add to store
  if (matchedDiscount) {
    addDiscount(matchedDiscount._id);
    toast.success(`Discount "${matchedDiscount.couponCode}" applied!`);
  }
};
```

### Example 2: Remove Discount

```tsx
// Component handles this internally
const handleRemoveDiscount = async (discountId: string) => {
  try {
    removeDiscount(discountId); // Updates store
    toast.success("Discount removed");
    // Cart summary auto-refreshes
  } catch (err) {
    toast.error("Error removing discount");
  }
};
```

### Example 3: Calculate Savings

```tsx
// Component handles this internally
const calculateTotalSavings = () => {
  return appliedDiscounts.reduce((total, discount) => {
    if (discount.discountAmountType === "fix") {
      // Fixed amount discount
      return total + discount.discountAmount;
    }
    // Percentage discount - show maximum possible
    return total + (discount.maximumAmount || 0);
  }, 0);
};
```

## Custom Styling

```tsx
// Add custom className
<DiscountSection className="my-custom-class" />
```

## Testing Examples

### Test: Valid Code Application

```typescript
describe('DiscountSection', () => {
  it('should apply valid discount code', async () => {
    // 1. Render component
    render(<DiscountSection />);

    // 2. Type discount code
    const input = screen.getByPlaceholderText('Enter coupon code');
    await userEvent.type(input, 'SAVE20');

    // 3. Click apply
    const applyButton = screen.getByText('Apply');
    await userEvent.click(applyButton);

    // 4. Verify success
    expect(await screen.findByText(/Discount "SAVE20" applied!/)).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input cleared
  });
});
```

### Test: Invalid Code Handling

```typescript
it('should show error for invalid code', async () => {
  render(<DiscountSection />);

  const input = screen.getByPlaceholderText('Enter coupon code');
  await userEvent.type(input, 'INVALID');

  const applyButton = screen.getByText('Apply');
  await userEvent.click(applyButton);

  expect(await screen.findByText(/Invalid or expired discount code/)).toBeInTheDocument();
  expect(input).toHaveValue('INVALID'); // Input retained
});
```

### Test: Duplicate Prevention

```typescript
it('should prevent duplicate discount application', async () => {
  // Apply first time
  const { rerender } = render(<DiscountSection />);

  const input = screen.getByPlaceholderText('Enter coupon code');
  await userEvent.type(input, 'SAVE20');
  await userEvent.click(screen.getByText('Apply'));

  await screen.findByText(/applied!/);

  // Try to apply again
  await userEvent.type(input, 'SAVE20');
  await userEvent.click(screen.getByText('Apply'));

  expect(await screen.findByText(/already applied/)).toBeInTheDocument();
});
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   User Action                            │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              DiscountSection Component                   │
│  - Validates input                                       │
│  - Calls API (getDiscounts)                              │
│  - Updates store (addDiscount/removeDiscount)            │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                  Cart Store                              │
│  - selectedDiscountIds updated                           │
│  - Persisted to localStorage                             │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│            useCartSummary Hook                           │
│  - Detects selectedDiscountIds change                    │
│  - Debounces 300ms                                       │
│  - Calls cart summary API with discount IDs              │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Order Summary Updates                       │
│  - Shows new subtotal                                    │
│  - Shows discount amounts                                │
│  - Shows new total                                       │
└─────────────────────────────────────────────────────────┘
```

## API Response Example

### Get Discounts Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "discount123",
      "name": "20% Off Pizzas",
      "description": "Get 20% off all pizzas",
      "couponCode": "SAVE20",
      "hideFromSuggestion": false,
      "discountAmount": 20,
      "discountAmountType": "percentage",
      "maximumAmount": 10,
      "conditionType": "selectedCategories",
      "referenceIds": ["cat1", "cat2"],
      "storeId": "store123",
      "startTime": "2024-01-01T00:00:00Z",
      "endTime": "2024-12-31T23:59:59Z",
      "isNeverEnding": false,
      "customerType": "allCustomers",
      "customerIds": [],
      "discountType": "normal",
      "active": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Common Patterns

### Pattern 1: Check if any discounts applied

```tsx
const { selectedDiscountIds } = useCartStore();
const hasDiscounts = selectedDiscountIds.length > 0;

if (hasDiscounts) {
  // Show discount indicator
}
```

### Pattern 2: Get discount count

```tsx
const { selectedDiscountIds } = useCartStore();
const discountCount = selectedDiscountIds.length;

return (
  <Badge>
    {discountCount} {discountCount === 1 ? 'discount' : 'discounts'} applied
  </Badge>
);
```

### Pattern 3: Programmatically apply discount

```tsx
import { useCartStore } from "@/store/cart-store";

function MyComponent() {
  const { addDiscount } = useCartStore();

  const applySpecialDiscount = () => {
    // Add discount programmatically
    addDiscount("discount123");
  };

  return <Button onClick={applySpecialDiscount}>Apply Welcome Discount</Button>;
}
```

### Pattern 4: Clear all discounts

```tsx
import { useCartStore } from "@/store/cart-store";

function MyComponent() {
  const { clearDiscounts } = useCartStore();

  return (
    <Button variant="destructive" onClick={clearDiscounts}>
      Remove All Discounts
    </Button>
  );
}
```

## Advanced Usage

### Listen to Discount Changes

```tsx
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

function DiscountTracker() {
  const { selectedDiscountIds } = useCartStore();

  useEffect(() => {
    console.log("Discounts changed:", selectedDiscountIds);
    // Track in analytics
    // Update UI
    // etc.
  }, [selectedDiscountIds]);

  return null;
}
```

### Get Applied Discount Details

```tsx
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { getDiscounts } from "@/lib/api/discount";

function AppliedDiscountsList() {
  const { selectedDiscountIds } = useCartStore();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    async function fetchDetails() {
      const response = await getDiscounts({
        cartIds: getCartIds(),
        storeId: selectedStore._id,
      });

      const applied = response.data.filter(
        d => selectedDiscountIds.includes(d._id)
      );
      setDiscounts(applied);
    }

    if (selectedDiscountIds.length > 0) {
      fetchDetails();
    }
  }, [selectedDiscountIds]);

  return (
    <ul>
      {discounts.map(d => (
        <li key={d._id}>{d.name} - {d.couponCode}</li>
      ))}
    </ul>
  );
}
```

## Troubleshooting

### Discounts not persisting
**Issue**: Discounts disappear on page refresh

**Solution**: Check that Zustand persist middleware is configured correctly in cart-store.ts:

```typescript
partialize: (state) => ({
  selectedDiscountIds: state.selectedDiscountIds, // ← Must be included
  deliveryType: state.deliveryType,
  selectedAddressId: state.selectedAddressId,
})
```

### Summary not updating
**Issue**: Cart summary doesn't reflect discount changes

**Solution**: Ensure useCartSummary hook has selectedDiscountIds in dependencies:

```typescript
useEffect(() => {
  fetchSummary();
}, [
  // ... other deps
  JSON.stringify(selectedDiscountIds), // ← Must be included
  fetchSummary,
]);
```

### Duplicate discounts
**Issue**: Same discount can be applied multiple times

**Solution**: Component already prevents this. Check the duplicate detection logic:

```typescript
if (selectedDiscountIds.includes(matchedDiscount._id)) {
  toast.info("Discount already applied");
  return;
}
```

## Best Practices

1. **Always validate on client AND server**
   - Client validation provides immediate feedback
   - Server validation ensures security

2. **Use toast notifications for user feedback**
   - Success: Green toast with checkmark
   - Error: Red toast with details
   - Info: Blue toast for neutral messages

3. **Show loading states**
   - Disable buttons during API calls
   - Show spinner on buttons
   - Prevent double-submission

4. **Handle edge cases**
   - Empty cart
   - No store selected
   - Network failures
   - Invalid responses

5. **Provide clear error messages**
   - "Please enter a coupon code" (empty)
   - "Invalid or expired discount code" (not found)
   - "This discount is already applied" (duplicate)

## Related Documentation

- [Cart Store Documentation](./cart-store-guide.md)
- [Cart Summary Auto-refresh](./cart-summary-auto-refresh.md)
- [Discount API Reference](../api/discount.md)
- [Form Best Practices](../../forms-expert-guide.md)
