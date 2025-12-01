# Cart and Checkout Hooks - API Integration Layer

This directory contains React hooks that provide a clean API integration layer for cart, address, and discount management. All hooks integrate with Zustand stores for state management and provide optimistic updates, loading states, and error handling.

## Architecture Overview

```
┌─────────────────┐
│  React Component │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│   Custom Hooks   │ ◄─── This Layer
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│   API Functions  │
└────────┬────────┘
         │ updates
         ▼
┌─────────────────┐
│  Zustand Stores  │
└─────────────────┘
```

## Cart Hooks (`use-cart.ts`)

### `useCart(deviceId, storeId, autoFetch?)`

Fetches and manages cart items.

**Parameters:**
- `deviceId: string` - Unique device identifier for session tracking
- `storeId: string` - Store identifier
- `autoFetch?: boolean` - Auto-fetch on mount (default: true)

**Returns:**
```typescript
{
  items: CartResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Example:**
```typescript
'use client';

import { useCart } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function CartPage() {
  const deviceId = useDeviceId();
  const { items, isLoading, error, refetch } = useCart(deviceId, 'store-123');

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {items.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
      <button onClick={refetch}>Refresh Cart</button>
    </div>
  );
}
```

### `useAddToCart()`

Mutation hook for adding items to cart with optimistic updates.

**Returns:**
```typescript
{
  mutate: (data: AddToCartPayload) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useAddToCart } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function ProductCard({ product }) {
  const deviceId = useDeviceId();
  const { mutate: addToCart, isLoading } = useAddToCart();

  const handleAddToCart = async () => {
    const result = await addToCart({
      itemId: product._id,
      categoryId: product.categoryId,
      variantId: selectedVariant._id,
      pricing: selectedPricing,
      quantity: 1,
      sessionId: deviceId,
      storeId: 'store-123',
    });

    if (result.success) {
      // Item added, store updated, toast shown
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### `useUpdateCartItem()`

Mutation hook for updating cart items (quantity, variant, pricing).

**Returns:**
```typescript
{
  mutate: (id: string, data: UpdateCartPayload) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useUpdateCartItem } from '@/lib/hooks';

function CartItemQuantity({ item }) {
  const { mutate: updateItem, isLoading } = useUpdateCartItem();

  const handleQuantityChange = async (newQuantity: number) => {
    await updateItem(item._id, {
      quantity: newQuantity,
      variantId: item.variantId,
      pricing: item.pricing,
      sessionId: item.sessionId,
    });
  };

  return (
    <QuantitySelector
      value={item.quantity}
      onChange={handleQuantityChange}
      disabled={isLoading}
    />
  );
}
```

### `useRemoveCartItem()`

Mutation hook for removing items from cart.

**Returns:**
```typescript
{
  mutate: (id: string, deviceId: string) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useRemoveCartItem } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function CartItem({ item }) {
  const deviceId = useDeviceId();
  const { mutate: removeItem, isLoading } = useRemoveCartItem();

  const handleRemove = async () => {
    await removeItem(item._id, deviceId);
  };

  return (
    <button onClick={handleRemove} disabled={isLoading}>
      {isLoading ? 'Removing...' : 'Remove'}
    </button>
  );
}
```

### `useCartSummary(params, autoFetch?)`

Fetches cart summary with auto-refetch on cart/discount/delivery changes.

**Parameters:**
- `params: Omit<PricingForCartParams, 'cartIds'>` - Summary parameters (storeId)
- `autoFetch?: boolean` - Auto-fetch on mount/changes (default: true)

**Returns:**
```typescript
{
  summary: CustomerBillingOnCart | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Auto-refetch Triggers:**
- Cart items change (add/update/remove)
- Discounts change (add/remove)
- Delivery type changes
- Address changes

**Example:**
```typescript
import { useCartSummary } from '@/lib/hooks';

function CartSummary() {
  const { summary, isLoading } = useCartSummary({ storeId: 'store-123' });

  if (isLoading) return <Skeleton />;
  if (!summary) return null;

  return (
    <div>
      <div>Item Total: ${summary.itemTotal}</div>
      <div>After Discount: ${summary.itemTotalAfterDiscount}</div>
      <div>Delivery: ${summary.deliveryCharges}</div>
      <div>Tax: ${summary.tax.total}</div>
      <div className="font-bold">Total: ${summary.total}</div>
    </div>
  );
}
```

## Address Hooks (`use-address.ts`)

### `useAddresses(autoFetch?)`

Fetches and manages user addresses.

**Returns:**
```typescript
{
  addresses: AddressResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Example:**
```typescript
import { useAddresses } from '@/lib/hooks';

function AddressList() {
  const { addresses, isLoading, error, refetch } = useAddresses();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {addresses.map(address => (
        <AddressCard key={address._id} address={address} />
      ))}
    </div>
  );
}
```

### `useCreateAddress()`

Mutation hook for creating new addresses.

**Returns:**
```typescript
{
  mutate: (data: AddAddressData) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useCreateAddress } from '@/lib/hooks';

function AddAddressForm() {
  const { mutate: createAddress, isLoading } = useCreateAddress();

  const handleSubmit = async (formData: AddAddressData) => {
    const result = await createAddress(formData);
    if (result.success) {
      // Address created, store updated, modal closed, toast shown
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Address'}
      </button>
    </form>
  );
}
```

### `useUpdateAddress()`

Mutation hook for updating existing addresses (full update).

**Returns:**
```typescript
{
  mutate: (addressId: string, data: AddAddressData) => Promise<Result>;
  isLoading: boolean;
}
```

### `useDeleteAddress()`

Mutation hook for deleting addresses with confirmation.

**Returns:**
```typescript
{
  mutate: (addressId: string, skipConfirmation?: boolean) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useDeleteAddress } from '@/lib/hooks';

function DeleteAddressButton({ addressId }) {
  const { mutate: deleteAddress, isLoading } = useDeleteAddress();

  const handleDelete = async () => {
    // First call without confirmation - returns requiresConfirmation
    const result = await deleteAddress(addressId, false);

    if (result.requiresConfirmation) {
      // Show confirmation dialog
      const confirmed = await showConfirmDialog();
      if (confirmed) {
        // Call again with skipConfirmation=true
        await deleteAddress(addressId, true);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      Delete
    </button>
  );
}
```

### `useSetDefaultAddress()`

Mutation hook for setting an address as default.

**Returns:**
```typescript
{
  mutate: (addressId: string) => Promise<Result>;
  isLoading: boolean;
}
```

## Discount Hooks (`use-discount.ts`)

### `useAvailableDiscounts(cartIds, storeId, autoFetch?)`

Fetches applicable discounts for cart items.

**Parameters:**
- `cartIds: string[]` - Array of cart item IDs
- `storeId: string` - Store identifier
- `autoFetch?: boolean` - Auto-fetch on mount (default: true)

**Returns:**
```typescript
{
  discounts: DiscountResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Example:**
```typescript
import { useAvailableDiscounts } from '@/lib/hooks';
import { useCartStore } from '@/store';

function DiscountList() {
  const { getCartIds } = useCartStore();
  const cartIds = getCartIds();

  const { discounts, isLoading } = useAvailableDiscounts(
    cartIds,
    'store-123'
  );

  return (
    <div>
      {discounts.map(discount => (
        <DiscountCard key={discount._id} discount={discount} />
      ))}
    </div>
  );
}
```

### `useSearchDiscounts(cartIds, storeId, search, debounceMs?)`

Searches discounts with debounce (default: 300ms).

**Parameters:**
- `cartIds: string[]` - Array of cart item IDs
- `storeId: string` - Store identifier
- `search: string` - Search query
- `debounceMs?: number` - Debounce delay (default: 300)

**Returns:**
```typescript
{
  results: DiscountResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Example:**
```typescript
import { useState } from 'react';
import { useSearchDiscounts } from '@/lib/hooks';

function DiscountSearch({ cartIds, storeId }) {
  const [search, setSearch] = useState('');
  const { results, isLoading } = useSearchDiscounts(
    cartIds,
    storeId,
    search,
    300 // debounce 300ms
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search discounts..."
      />
      {isLoading && <Spinner />}
      {results.map(discount => (
        <DiscountCard key={discount._id} discount={discount} />
      ))}
    </div>
  );
}
```

### `useApplyDiscount()`

Mutation hook for applying discounts to cart.

**Returns:**
```typescript
{
  mutate: (discountId: string, discountCode?: string) => Promise<Result>;
  isLoading: boolean;
}
```

**Example:**
```typescript
import { useApplyDiscount } from '@/lib/hooks';

function DiscountCard({ discount }) {
  const { mutate: applyDiscount, isLoading } = useApplyDiscount();

  const handleApply = async () => {
    await applyDiscount(discount._id, discount.couponCode);
    // Discount added to cart store, modal closed, toast shown
    // Cart summary will auto-refetch
  };

  return (
    <button onClick={handleApply} disabled={isLoading}>
      {isLoading ? 'Applying...' : 'Apply'}
    </button>
  );
}
```

### `useRemoveDiscount()`

Mutation hook for removing discounts from cart.

**Returns:**
```typescript
{
  mutate: (discountId: string, discountCode?: string) => Promise<Result>;
  isLoading: boolean;
}
```

## Integration with Stores

All hooks integrate with Zustand stores:

### Cart Store (`store/cart-store.ts`)
- Manages cart items, summary, discounts, delivery type, and address
- Persists user preferences (discounts, delivery type, address) to localStorage
- Cart items are fetched from API (not persisted)

### Address Store (`store/address-store.ts`)
- Manages user addresses
- Handles modal states for add/edit/delete
- No persistence (addresses fetched from API)

### Discount Store (`store/discount-store.ts`)
- Manages available discounts
- Handles search query state
- No persistence (discounts fetched from API)

### Device Store (`store/device-store.ts`)
- Manages device ID for anonymous cart tracking
- Auto-generates UUID on first visit
- Persists to localStorage

## Common Patterns

### 1. Protected Cart Access

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/store';
import { useCart } from '@/lib/hooks';

function CartPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { items } = useCart(deviceId, storeId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, router]);

  // Render cart...
}
```

### 2. Device ID Initialization

```typescript
'use client';

import { useEffect } from 'react';
import { useDeviceStore } from '@/store';

function RootLayout({ children }) {
  const { initializeDeviceId, isHydrated } = useDeviceStore();

  useEffect(() => {
    if (isHydrated) {
      initializeDeviceId();
    }
  }, [isHydrated, initializeDeviceId]);

  return <>{children}</>;
}
```

### 3. Auto-refetching Summary

The `useCartSummary` hook automatically refetches when:
- Cart items change (add/update/remove)
- Discounts change
- Delivery type changes
- Selected address changes

This ensures the summary is always up-to-date without manual refetch calls.

## Error Handling

All hooks include:
- Try-catch blocks for error handling
- Toast notifications for success/error (using Sonner)
- Error state returned to component
- Console error logging for debugging

## Loading States

All mutation hooks return `isLoading` for UI feedback:
- Disable buttons during mutations
- Show loading spinners
- Prevent duplicate submissions

## Optimistic Updates

All mutation hooks perform optimistic updates:
1. Call API
2. On success, immediately update Zustand store
3. Show success toast
4. Return success result

This provides instant UI feedback without waiting for re-fetch.

## Best Practices

1. **Always use deviceId from device store** for cart operations
2. **Use auto-fetch** for data fetching hooks (enabled by default)
3. **Handle loading states** in UI
4. **Check result.success** after mutations
5. **Use store selectors** for optimized re-renders
6. **Don't mix hooks and direct API calls** - always use hooks

## TypeScript

All hooks are fully typed with TypeScript. Import types from `@/types`:

```typescript
import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  CustomerBillingOnCart,
  AddressResponse,
  AddAddressData,
  DiscountResponse,
} from '@/types';
```
