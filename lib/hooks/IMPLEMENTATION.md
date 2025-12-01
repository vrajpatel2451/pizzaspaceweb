# Phase 1.3: API Integration Layer - Implementation Summary

## Overview

This implementation provides a comprehensive API integration layer for the PizzaSpace cart feature using React hooks. All hooks integrate with existing Zustand stores and follow React best practices.

## Files Created

### 1. `/lib/hooks/use-cart.ts` (8.1 KB)

**Hooks implemented:**
- `useCart(deviceId, storeId, autoFetch?)` - Fetches cart items
- `useAddToCart()` - Adds items to cart with optimistic updates
- `useUpdateCartItem()` - Updates cart items (quantity, variant, pricing)
- `useRemoveCartItem()` - Removes items from cart
- `useCartSummary(params, autoFetch?)` - Fetches cart summary with auto-refetch

**Key features:**
- Auto-fetches cart on mount
- Optimistic updates for all mutations
- Auto-refetch summary when cart/discounts/delivery/address changes
- Integrates with `cart-store.ts`
- Toast notifications for all operations

### 2. `/lib/hooks/use-address.ts` (7.5 KB)

**Hooks implemented:**
- `useAddresses(autoFetch?)` - Fetches all addresses
- `useCreateAddress()` - Creates new address with modal close
- `useUpdateAddress()` - Full address update
- `useDeleteAddress()` - Deletes address with confirmation pattern
- `useSetDefaultAddress()` - Sets address as default using PATCH

**Key features:**
- Auto-fetches addresses on mount
- Modal state management integration
- Confirmation pattern for destructive operations
- Integrates with `address-store.ts`
- Toast notifications for all operations

### 3. `/lib/hooks/use-discount.ts` (6.7 KB)

**Hooks implemented:**
- `useAvailableDiscounts(cartIds, storeId, autoFetch?)` - Fetches applicable discounts
- `useSearchDiscounts(cartIds, storeId, search, debounceMs?)` - Searches with 300ms debounce
- `useApplyDiscount()` - Applies discount to cart
- `useRemoveDiscount()` - Removes discount from cart

**Key features:**
- Debounced search (configurable, default 300ms)
- Auto-fetches when cart changes
- Duplicate discount prevention
- Integrates with `discount-store.ts` and `cart-store.ts`
- Toast notifications for all operations

### 4. `/lib/hooks/index.ts` (630 B)

Barrel export file for clean imports:
```typescript
import {
  useCart,
  useAddToCart,
  useCreateAddress,
  useApplyDiscount,
  // ... etc
} from '@/lib/hooks';
```

### 5. `/lib/hooks/README.md` (14 KB)

Comprehensive documentation including:
- Architecture overview
- All hook signatures and examples
- Integration patterns
- Store relationships
- Common patterns (protected routes, device ID, auto-refetch)
- Error handling and loading states
- Best practices

## Integration with Existing Stores

### Cart Store (`/store/cart-store.ts`)
- Already existed
- Manages cart items, summary, discounts, delivery type, address
- Persists: discounts, delivery type, address (not items)
- Provides: `getCartIds()` helper function

### Address Store (`/store/address-store.ts`)
- Already existed
- Manages addresses and modal states
- No persistence (API-driven)

### Discount Store (`/store/discount-store.ts`)
- Already existed
- Manages available discounts and search
- No persistence (API-driven)

### Device Store (`/store/device-store.ts`)
- Already existed
- Manages device ID for anonymous carts
- Auto-generates UUID on first visit
- Persists device ID to localStorage

## Technical Implementation Details

### 1. Auto-fetch Pattern

All data-fetching hooks support auto-fetch with proper cleanup:

```typescript
useEffect(() => {
  if (autoFetch && dependencies) {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }
}, [dependencies]);
```

This pattern:
- Avoids synchronous state updates in effects (React Compiler requirement)
- Prevents cascading renders
- Provides proper cleanup

### 2. Optimistic Updates

All mutation hooks follow this pattern:

```typescript
const mutate = async (data) => {
  setIsLoading(true);
  setStoreLoading(true);

  try {
    const response = await apiCall(data);

    if (response.statusCode === 200 && response.data) {
      // Optimistically update store
      updateStore(response.data);
      toast.success('Success message');
      return { success: true, data: response.data };
    } else {
      toast.error(response.errorMessage);
      return { success: false, error: response.errorMessage };
    }
  } catch (err) {
    toast.error('An unexpected error occurred');
    return { success: false, error: errorMsg };
  } finally {
    setIsLoading(false);
    setStoreLoading(false);
  }
};
```

### 3. Auto-refetch Cart Summary

The `useCartSummary` hook automatically refetches when:
- `items.length` changes (cart add/remove)
- `selectedDiscountIds.length` changes (discount add/remove)
- `deliveryType` changes (pickup/delivery/dineIn)
- `selectedAddressId` changes (address selection)

This ensures the summary is always synchronized without manual intervention.

### 4. Debounced Search

The `useSearchDiscounts` hook implements debouncing:

```typescript
// Debounce state
const [debouncedSearch, setDebouncedSearch] = useState(search);

// Debounce effect
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, debounceMs);
  return () => clearTimeout(timer);
}, [search, debounceMs]);

// Search effect (triggered by debounced value)
useEffect(() => {
  if (debouncedSearch !== undefined) {
    searchDiscounts();
  }
}, [debouncedSearch]);
```

### 5. Error Handling

All hooks include:
- Try-catch blocks
- API error handling
- Toast notifications (success/error)
- Error state returned to component
- Console logging for debugging

### 6. Loading States

All hooks return loading state for UI feedback:
- Local `isLoading` state
- Store-level loading state (for global UI)
- Both set/cleared together

## Usage Examples

### Complete Cart Flow

```typescript
'use client';

import { useCart, useAddToCart, useCartSummary } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function CartPage() {
  const deviceId = useDeviceId();
  const storeId = 'store-123';

  // Fetch cart items (auto-fetches on mount)
  const { items, isLoading, refetch } = useCart(deviceId, storeId);

  // Fetch summary (auto-refetches when cart changes)
  const { summary, isLoading: summaryLoading } = useCartSummary({ storeId });

  if (isLoading) return <Spinner />;

  return (
    <div>
      {items.map(item => (
        <CartItem key={item._id} item={item} />
      ))}

      {summary && (
        <CartSummary summary={summary} loading={summaryLoading} />
      )}
    </div>
  );
}
```

### Complete Address Flow

```typescript
'use client';

import {
  useAddresses,
  useCreateAddress,
  useSetDefaultAddress,
} from '@/lib/hooks';

function AddressManagement() {
  const { addresses, isLoading } = useAddresses();
  const { mutate: createAddress } = useCreateAddress();
  const { mutate: setDefault } = useSetDefaultAddress();

  const handleCreate = async (data) => {
    const result = await createAddress(data);
    // Address created, modal closed, toast shown
  };

  const handleSetDefault = async (addressId) => {
    await setDefault(addressId);
    // Default updated, store synchronized
  };

  return <AddressList addresses={addresses} />;
}
```

### Complete Discount Flow

```typescript
'use client';

import {
  useAvailableDiscounts,
  useSearchDiscounts,
  useApplyDiscount,
} from '@/lib/hooks';
import { useCartStore } from '@/store';

function DiscountModal() {
  const [search, setSearch] = useState('');
  const { getCartIds } = useCartStore();
  const cartIds = getCartIds();

  // Search with debounce
  const { results, isLoading } = useSearchDiscounts(
    cartIds,
    'store-123',
    search
  );

  const { mutate: applyDiscount } = useApplyDiscount();

  const handleApply = async (discount) => {
    await applyDiscount(discount._id, discount.couponCode);
    // Discount applied, modal closed, summary auto-refetches
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search discounts..."
      />
      {results.map(discount => (
        <DiscountCard
          key={discount._id}
          discount={discount}
          onApply={() => handleApply(discount)}
        />
      ))}
    </div>
  );
}
```

## API Compatibility

All hooks use the existing API functions from:
- `/lib/api/cart.ts`
- `/lib/api/address.ts`
- `/lib/api/discount.ts`

No changes to API functions were required. The hooks are pure integration layers.

## Type Safety

All hooks are fully typed with TypeScript using types from:
- `/types/cart.ts`
- `/types/address.ts`
- `/types/discount.ts`
- `/types/api.ts`

## Testing Considerations

To test these hooks:

1. **Unit Testing**: Use `@testing-library/react-hooks`
2. **Integration Testing**: Test with actual stores
3. **Mock API calls**: Mock the API functions
4. **Test auto-fetch**: Verify effects trigger correctly
5. **Test optimistic updates**: Verify store updates
6. **Test error handling**: Verify error states and toasts

## Performance Considerations

1. **Selector hooks**: All stores export selector hooks for optimized re-renders
2. **useCallback**: All fetch functions use `useCallback` to prevent recreations
3. **Debouncing**: Search is debounced to prevent excessive API calls
4. **Auto-refetch dependencies**: Only essential dependencies trigger refetch

## Next Steps

With this API integration layer complete, you can now:

1. **Build UI Components**: Create cart, address, and discount UI components
2. **Protected Routes**: Implement protected cart route with login redirect
3. **Checkout Flow**: Build the complete checkout flow using these hooks
4. **Testing**: Write comprehensive tests for all hooks
5. **Error Boundaries**: Add error boundaries for graceful error handling

## Compliance

This implementation:
- Uses React 19 and Next.js 16 App Router
- Follows TypeScript strict mode
- Uses `'use client'` directive (hooks are client-only)
- Passes ESLint with no errors
- Compatible with React Compiler
- Uses Sonner for toast notifications (already in project)
- Integrates with existing Zustand stores
- Maintains existing API contract
