# Cart Validation Hook - Phase 5.1

## Overview

The `useCartValidation` hook validates cart items against the selected delivery type. It ensures that all items in the cart support the currently selected delivery method (pickup, delivery, or dine-in).

## File Location

`/Users/vrajpatel/Documents/personal/pizzaspace_web/hooks/use-cart-validation.ts`

## Features

1. **Automatic Cart Validation**: Automatically validates cart items when cart contents or delivery type changes
2. **Product Details Enrichment**: Fetches product details for each cart item to access `availableDeliveryTypes`
3. **Caching**: Uses product details cache to minimize API calls
4. **Loading State**: Provides loading state while fetching product details
5. **Fail-Safe Behavior**: Treats items with missing product details as valid to avoid blocking checkout unnecessarily

## Hook API

### Return Type

```typescript
interface CartValidationResult {
  invalidItems: CartItemWithProduct[];      // Items that don't support selected delivery type
  validItems: CartItemWithProduct[];        // Items that support selected delivery type
  hasInvalidItems: boolean;                 // True if there are any invalid items
  isCartValid: boolean;                     // True if checkout can proceed (no invalid items)
  invalidItemCount: number;                 // Number of invalid items
  isLoading: boolean;                       // True while fetching product details
}
```

### Extended Cart Item Type

```typescript
interface CartItemWithProduct extends CartResponse {
  productDetails?: ProductDetailsResponse;
  availableDeliveryTypes?: OrderDeliveryType[];
}
```

## How It Works

1. **Get Cart Data**: Retrieves cart items and delivery type from cart store using `useCartItems()` and `useDeliveryType()`

2. **Enrich with Product Details**: For each cart item:
   - Checks product details cache first
   - Fetches from API if not cached
   - Stores result in cache for future use
   - Extracts `availableDeliveryTypes` from product

3. **Validate Items**: For each enriched cart item:
   - Checks if current delivery type is in product's `availableDeliveryTypes` array
   - Categorizes as valid or invalid
   - Falls back to valid if product details are missing (fail-safe)

4. **Return Results**: Provides validation status and categorized items

## Usage Examples

### Basic Usage

```typescript
import { useCartValidation } from "@/hooks/use-cart-validation";

function CartPage() {
  const {
    invalidItems,
    validItems,
    hasInvalidItems,
    isCartValid,
    invalidItemCount,
    isLoading,
  } = useCartValidation();

  if (isLoading) {
    return <div>Validating cart...</div>;
  }

  return (
    <div>
      {hasInvalidItems && (
        <Alert variant="warning">
          {invalidItemCount} items not available for selected delivery type
        </Alert>
      )}

      <CheckoutButton disabled={!isCartValid} />
    </div>
  );
}
```

### Display Invalid Items Banner

```typescript
function InvalidItemsBanner() {
  const { hasInvalidItems, invalidItems } = useCartValidation();

  if (!hasInvalidItems) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
      <h4 className="font-semibold">Items not available for delivery type:</h4>
      <ul>
        {invalidItems.map((item) => (
          <li key={item._id}>
            {item.productDetails?.product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Conditional Checkout Button

```typescript
function CheckoutButton() {
  const { isCartValid, isLoading, invalidItemCount } = useCartValidation();

  return (
    <button
      disabled={!isCartValid || isLoading}
      className="checkout-button"
    >
      {isLoading
        ? "Validating..."
        : isCartValid
        ? "Proceed to Checkout"
        : `Cannot checkout (${invalidItemCount} invalid items)`}
    </button>
  );
}
```

## Dependencies

- `@/store/cart-store`: Cart state management
  - `useCartItems()`: Get cart items
  - `useDeliveryType()`: Get selected delivery type

- `@/lib/api/products`: Product API client
  - `getProductDetails()`: Fetch product details

- `@/lib/cache/product-details-cache`: Product details cache
  - Minimizes API calls for repeated product lookups

- `@/types/cart`: Cart types
  - `CartResponse`: Cart item type
  - `OrderDeliveryType`: Delivery type enum

- `@/types/product`: Product types
  - `ProductDetailsResponse`: Product details type

## Implementation Details

### Performance Optimizations

1. **Parallel Fetching**: Uses `Promise.all()` to fetch all product details in parallel
2. **Caching**: Checks cache before making API calls
3. **Memoization**: Uses `useMemo()` to prevent unnecessary validation re-runs
4. **Selective Re-renders**: Only re-validates when cart items or delivery type changes

### Error Handling

- Catches API errors and logs them
- Falls back to treating items as valid on error (fail-safe)
- Prevents checkout blocking due to temporary API issues

### Edge Cases

1. **Empty Cart**: Returns empty arrays and valid state when cart is empty
2. **Missing Product Details**: Treats items as valid if product details cannot be fetched
3. **Missing availableDeliveryTypes**: Treats items as valid if field is empty/undefined
4. **Loading State**: Provides `isLoading` flag for UI feedback during data fetching

## Testing Scenarios

1. **Valid Cart**: All items support selected delivery type
2. **Invalid Cart**: Some items don't support selected delivery type
3. **Mixed Cart**: Some valid, some invalid items
4. **Empty Cart**: No items to validate
5. **Delivery Type Change**: Validation updates when delivery type changes
6. **Cart Item Addition**: Validation updates when items are added
7. **Cart Item Removal**: Validation updates when items are removed
8. **API Error**: Gracefully handles product details fetch failures

## Integration with Phase 5.1

This hook is part of Phase 5.1 of the delivery type selection feature:

- **Phase 5.1**: Cart Validation
  - Validate cart items against selected delivery type
  - Show invalid items to user
  - Prevent checkout if cart is invalid

See `docs/delivery-type-selection-plan.md` for complete feature documentation.

## Future Enhancements

Potential improvements for future phases:

1. **Auto-removal Option**: Automatically remove invalid items
2. **Delivery Type Suggestions**: Suggest alternative delivery types that would make cart valid
3. **Real-time Validation**: Validate during product addition before adding to cart
4. **Batch Validation API**: Backend endpoint to validate entire cart in single request
5. **Optimistic UI Updates**: Show validation state immediately, confirm with API
