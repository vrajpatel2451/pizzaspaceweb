# Quick Start Guide - Cart Hooks

## Installation

All hooks are ready to use. Just import them:

```typescript
import {
  useCart,
  useAddToCart,
  useCartSummary,
  useAddresses,
  useApplyDiscount,
} from '@/lib/hooks';
```

## Essential Imports

```typescript
// Hooks
import { useCart, useAddToCart, useCartSummary } from '@/lib/hooks';

// Store selectors
import { useDeviceId } from '@/store';

// Types
import { AddToCartPayload } from '@/types';
```

## 5-Minute Examples

### 1. Display Cart Items

```typescript
'use client';

import { useCart } from '@/lib/hooks';
import { useDeviceId } from '@/store';

export default function CartPage() {
  const deviceId = useDeviceId();
  const { items, isLoading } = useCart(deviceId!, 'store-123');

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Cart</h1>
      {items.map(item => (
        <div key={item._id}>
          {item.itemId} - Qty: {item.quantity}
        </div>
      ))}
    </div>
  );
}
```

### 2. Add to Cart Button

```typescript
'use client';

import { useAddToCart } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function AddToCartButton({ product, variant, pricing }) {
  const deviceId = useDeviceId();
  const { mutate: addToCart, isLoading } = useAddToCart();

  const handleClick = () => {
    addToCart({
      itemId: product._id,
      categoryId: product.categoryId,
      variantId: variant._id,
      pricing,
      quantity: 1,
      sessionId: deviceId!,
      storeId: 'store-123',
    });
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### 3. Cart Summary

```typescript
'use client';

import { useCartSummary } from '@/lib/hooks';

function CartSummary() {
  const { summary, isLoading } = useCartSummary({ storeId: 'store-123' });

  if (isLoading) return <p>Calculating...</p>;
  if (!summary) return null;

  return (
    <div>
      <div>Subtotal: ${summary.itemTotal}</div>
      <div>Discount: -${summary.totalDiscount}</div>
      <div>Tax: ${summary.tax.total}</div>
      <div className="font-bold">Total: ${summary.total}</div>
    </div>
  );
}
```

### 4. Update Quantity

```typescript
'use client';

import { useUpdateCartItem } from '@/lib/hooks';

function QuantitySelector({ item }) {
  const { mutate: updateItem, isLoading } = useUpdateCartItem();

  const handleChange = (newQty: number) => {
    updateItem(item._id, {
      quantity: newQty,
      variantId: item.variantId,
      pricing: item.pricing,
      sessionId: item.sessionId,
    });
  };

  return (
    <div>
      <button onClick={() => handleChange(item.quantity - 1)}>-</button>
      <span>{item.quantity}</span>
      <button onClick={() => handleChange(item.quantity + 1)}>+</button>
    </div>
  );
}
```

### 5. Remove from Cart

```typescript
'use client';

import { useRemoveCartItem } from '@/lib/hooks';
import { useDeviceId } from '@/store';

function RemoveButton({ itemId }) {
  const deviceId = useDeviceId();
  const { mutate: removeItem, isLoading } = useRemoveCartItem();

  return (
    <button
      onClick={() => removeItem(itemId, deviceId!)}
      disabled={isLoading}
    >
      Remove
    </button>
  );
}
```

### 6. Address List

```typescript
'use client';

import { useAddresses } from '@/lib/hooks';

function AddressList() {
  const { addresses, isLoading } = useAddresses();

  if (isLoading) return <p>Loading addresses...</p>;

  return (
    <div>
      {addresses.map(address => (
        <div key={address._id}>
          <h3>{address.name}</h3>
          <p>{address.line1}, {address.area}</p>
          {address.isDefault && <span>Default</span>}
        </div>
      ))}
    </div>
  );
}
```

### 7. Create Address

```typescript
'use client';

import { useCreateAddress } from '@/lib/hooks';
import { useState } from 'react';

function AddAddressForm() {
  const { mutate: createAddress, isLoading } = useCreateAddress();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    area: '',
    county: '',
    country: 'USA',
    zip: '',
    type: 'home' as const,
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form inputs */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Address'}
      </button>
    </form>
  );
}
```

### 8. Apply Discount

```typescript
'use client';

import { useAvailableDiscounts, useApplyDiscount } from '@/lib/hooks';
import { useCartStore } from '@/store';

function DiscountList() {
  const { getCartIds } = useCartStore();
  const { discounts } = useAvailableDiscounts(getCartIds(), 'store-123');
  const { mutate: applyDiscount, isLoading } = useApplyDiscount();

  return (
    <div>
      {discounts.map(discount => (
        <div key={discount._id}>
          <span>{discount.name}</span>
          <button
            onClick={() => applyDiscount(discount._id, discount.couponCode)}
            disabled={isLoading}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 9. Search Discounts

```typescript
'use client';

import { useState } from 'react';
import { useSearchDiscounts } from '@/lib/hooks';
import { useCartStore } from '@/store';

function DiscountSearch() {
  const [search, setSearch] = useState('');
  const { getCartIds } = useCartStore();
  const { results, isLoading } = useSearchDiscounts(
    getCartIds(),
    'store-123',
    search
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search discounts..."
      />
      {isLoading && <span>Searching...</span>}
      {results.map(discount => (
        <div key={discount._id}>{discount.name}</div>
      ))}
    </div>
  );
}
```

### 10. Set Default Address

```typescript
'use client';

import { useSetDefaultAddress } from '@/lib/hooks';

function AddressCard({ address }) {
  const { mutate: setDefault, isLoading } = useSetDefaultAddress();

  return (
    <div>
      <h3>{address.name}</h3>
      {!address.isDefault && (
        <button
          onClick={() => setDefault(address._id)}
          disabled={isLoading}
        >
          Set as Default
        </button>
      )}
    </div>
  );
}
```

## Common Patterns

### Device ID Initialization

Always initialize device ID in your root layout or provider:

```typescript
'use client';

import { useEffect } from 'react';
import { useDeviceStore } from '@/store';

export function DeviceInitializer({ children }) {
  const { initializeDeviceId, isHydrated } = useDeviceStore();

  useEffect(() => {
    if (isHydrated) {
      initializeDeviceId();
    }
  }, [isHydrated, initializeDeviceId]);

  return <>{children}</>;
}
```

### Protected Cart Route

Redirect to login if not authenticated:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/store';

export default function CartPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, router]);

  // Render cart...
}
```

### Manual Refetch

All hooks provide a `refetch` function:

```typescript
const { items, refetch } = useCart(deviceId, storeId);

// Later, manually refetch
<button onClick={refetch}>Refresh Cart</button>
```

### Disable Auto-fetch

If you want to control when data is fetched:

```typescript
// Disable auto-fetch
const { items, refetch } = useCart(deviceId, storeId, false);

// Manually trigger fetch
useEffect(() => {
  if (someCondition) {
    refetch();
  }
}, [someCondition]);
```

## Store Selectors

Use store selectors for optimized re-renders:

```typescript
import {
  useCartItems,
  useCartSummary,
  useSelectedDiscountIds,
  useDeliveryType,
  useCartCount,
} from '@/store';

// Each selector only re-renders when its specific value changes
const items = useCartItems();
const summary = useCartSummary();
const discounts = useSelectedDiscountIds();
const deliveryType = useDeliveryType();
const count = useCartCount();
```

## Error Handling

All hooks return error state:

```typescript
const { items, isLoading, error } = useCart(deviceId, storeId);

if (error) {
  return <ErrorMessage message={error} />;
}
```

Errors also show toast notifications automatically.

## TypeScript Tips

Import types as needed:

```typescript
import type {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  AddressResponse,
  AddAddressData,
  DiscountResponse,
} from '@/types';
```

## Need More Help?

- See `/lib/hooks/README.md` for detailed documentation
- See `/lib/hooks/IMPLEMENTATION.md` for implementation details
- Check existing stores in `/store/` for state management
- Review API functions in `/lib/api/` for backend calls
