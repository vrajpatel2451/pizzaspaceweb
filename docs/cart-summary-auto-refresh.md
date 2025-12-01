# Cart Summary Auto-Refresh Implementation

## Overview

This document describes the implementation of the auto-refreshing cart summary functionality for PizzaSpace. The cart summary automatically updates whenever cart items, discounts, delivery type, or selected address changes, with debouncing to prevent API spam.

## Components Implemented

### 1. Updated Hook: `lib/hooks/use-cart.ts` - `useCartSummary`

**Features:**
- Auto-refetches when cart items change
- Auto-refetches when discountIds change
- Auto-refetches when deliveryType changes
- Auto-refetches when selectedAddressId changes
- Implements 300ms debouncing to prevent API spam
- Uses deep comparison for cart items and discounts

**Usage:**
```typescript
const { summary, isLoading, error, refetch } = useCartSummary(
  { storeId },
  true,      // autoFetch
  300        // debounce delay in ms
);
```

**Parameters:**
- `params` - Object containing `storeId`
- `autoFetch` - Boolean to enable/disable auto-fetching (default: true)
- `debounceMs` - Debounce delay in milliseconds (default: 300)

**Returns:**
- `summary` - CustomerBillingOnCart | null
- `isLoading` - Boolean indicating loading state
- `error` - Error message string or null
- `refetch` - Function to manually trigger a refetch

### 2. New Component: `components/cart/summary-line-item.tsx`

Reusable component for displaying individual line items in the cart summary.

**Features:**
- Displays label and value
- Shows strikethrough original price when discount is applied
- Highlights discounted values in green
- Supports custom styling via className props

**Props:**
```typescript
interface SummaryLineItemProps {
  label: string;
  value: number;
  originalValue?: number;
  showDiscount?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  testId?: string;
}
```

**Usage:**
```tsx
<SummaryLineItem
  label="Item Total"
  value={summary.itemTotalAfterDiscount}
  originalValue={summary.itemTotal}
  showDiscount
  testId="summary-item-total"
/>
```

### 3. New Component: `components/cart/checkout-button.tsx`

Dedicated checkout button component with loading states.

**Features:**
- Shows total price in button text
- Displays loading spinner during processing
- Handles disabled state
- Customizable via className

**Props:**
```typescript
interface CheckoutButtonProps {
  total: number;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
  showPrice?: boolean;
}
```

**Usage:**
```tsx
<CheckoutButton
  total={summary.total}
  disabled={checkoutDisabled}
  loading={loading}
  onClick={onCheckout}
/>
```

### 4. Updated Component: `components/cart/order-summary.tsx`

**Changes:**
- Now uses `SummaryLineItem` for all price line items
- Uses `CheckoutButton` for the checkout action
- Maintains all existing functionality:
  - Tax breakdown display
  - Savings badge
  - Loading skeleton
  - All pricing fields

**Props remain the same:**
```typescript
interface OrderSummaryProps {
  summary: CustomerBillingOnCart | null;
  loading?: boolean;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  className?: string;
}
```

### 5. Updated Page: `app/(protected)/cart/page.tsx`

**Changes:**
- Now uses cart store (`useCartStore`) for state management
- Uses `useCart` hook for fetching cart items
- Uses `useCartSummary` hook for auto-refreshing summary
- Uses `useUpdateCartItem` and `useRemoveCartItem` hooks for mutations
- Removed manual summary fetching logic
- Summary auto-updates on any cart/discount/delivery/address change

**Key Implementation Details:**

```typescript
// Cart hooks with auto-refresh
const { isLoading: isLoadingCart, refetch: refetchCart } = useCart(
  deviceId,
  storeId,
  true
);

const { mutate: updateCartItem } = useUpdateCartItem();
const { mutate: removeCartItem } = useRemoveCartItem();

// Cart summary hook with auto-refresh and 300ms debounce
const { summary, isLoading: isLoadingSummary } = useCartSummary(
  { storeId },
  true,
  300
);
```

## Auto-Refresh Behavior

### Triggers

The cart summary automatically refetches when:

1. **Cart Items Change**
   - Item added to cart
   - Item removed from cart
   - Quantity updated
   - Item edited

2. **Discounts Change**
   - Discount code applied
   - Discount code removed

3. **Delivery Type Changes**
   - User switches between pickup/delivery/dineIn

4. **Selected Address Changes**
   - User selects a different delivery address

### Debouncing

- Default debounce: 300ms
- Prevents multiple API calls during rapid changes
- Example: Changing quantity from 1 to 5 rapidly will only trigger one API call after 300ms of inactivity

### Implementation Details

```typescript
// Auto-fetch summary when dependencies change with debouncing
useEffect(() => {
  if (!autoFetch || !params.storeId) {
    return;
  }

  // Debounce the fetch to prevent API spam during rapid changes
  const debounceTimer = setTimeout(() => {
    fetchSummary();
  }, debounceMs);

  return () => clearTimeout(debounceTimer);
}, [
  autoFetch,
  params.storeId,
  // Deep comparison for cart items
  JSON.stringify(items.map((item) => ({ id: item._id, qty: item.quantity }))),
  // Deep comparison for discounts
  JSON.stringify(selectedDiscountIds),
  deliveryType,
  selectedAddressId,
  debounceMs,
  fetchSummary,
]);
```

## Data Flow

```
User Action (e.g., add item, change quantity)
    ↓
Cart Store Updated (via mutation hook)
    ↓
useCartSummary detects change in dependencies
    ↓
Debounce Timer (300ms)
    ↓
API Call: getCartSummary(params)
    ↓
Store Updated with new summary
    ↓
UI Re-renders with updated summary
```

## Error Handling

- All errors are caught and displayed via toast notifications
- Error state is stored in the hook
- Failed requests don't prevent further attempts
- Loading states are properly managed

## Testing Checklist

- [ ] Summary updates when adding items to cart
- [ ] Summary updates when removing items from cart
- [ ] Summary updates when changing item quantity
- [ ] Summary updates when applying discount code
- [ ] Summary updates when removing discount code
- [ ] Summary updates when changing delivery type
- [ ] Summary updates when selecting delivery address
- [ ] Debouncing works (rapid changes trigger only one API call)
- [ ] Loading state displays during fetch
- [ ] Error states are handled gracefully
- [ ] "You saved" badge shows when totalDiscount > 0
- [ ] Checkout button is disabled when cart is empty
- [ ] Checkout button is disabled when delivery selected but no address

## Files Modified

1. `/lib/hooks/use-cart.ts` - Updated useCartSummary hook
2. `/components/cart/summary-line-item.tsx` - New component
3. `/components/cart/checkout-button.tsx` - New component
4. `/components/cart/order-summary.tsx` - Updated to use new components
5. `/components/cart/cart-item-list.tsx` - Fixed prop types
6. `/components/cart/index.ts` - Added new exports
7. `/app/(protected)/cart/page.tsx` - Updated to use hooks

## Dependencies

All existing dependencies are used. No new packages required.

## API Integration

Uses existing API:
- `getCartSummary(params: PricingForCartParams)`

**Request Params:**
```typescript
{
  cartIds: string[];
  discountIds?: string[];
  storeId: string;
  addressId?: string;
  deliveryType?: OrderDeliveryType;
}
```

**Response:**
```typescript
{
  statusCode: number;
  data: CustomerBillingOnCart | null;
  errorMessage?: string;
}
```

## Performance Considerations

1. **Debouncing**: Prevents excessive API calls during rapid changes
2. **Deep Comparison**: Uses JSON.stringify for cart items and discounts to avoid unnecessary re-fetches
3. **Conditional Fetching**: Only fetches when cart has items
4. **Optimistic Updates**: Store is updated immediately for better UX
5. **Loading States**: Clear feedback during async operations

## Future Enhancements

1. Add retry logic for failed requests
2. Implement optimistic UI updates for summary
3. Add analytics tracking for summary updates
4. Cache summary data with TTL
5. Add unit tests for debouncing logic
6. Add integration tests for auto-refresh behavior
