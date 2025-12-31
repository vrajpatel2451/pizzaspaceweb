# Delivery Type Menu Refresh Implementation

## Overview

This document describes the implementation of automatic product list reloading when the delivery type changes on the menu page.

## Problem Statement

When users change the delivery type (Dine In, Takeaway, or Delivery) via:
- The delivery type modal
- The cart page delivery type selector
- Any other delivery type change mechanism

The product list on the menu page should automatically refresh to show only products available for the selected delivery type.

## Solution Architecture

### Approach: URL Parameter + useEffect Tracking

We implemented a solution that combines:
1. URL parameter-based state management
2. Client-side delivery type tracking with useEffect
3. Server-side filtering based on delivery type

This approach ensures:
- Products are filtered server-side based on delivery type
- Changes to delivery type trigger automatic page re-renders
- No unnecessary re-renders occur
- Works when delivery type is changed from anywhere in the app

## Implementation Details

### 1. Server Component Changes (`app/menu/page.tsx`)

**Added delivery type to search params:**

```typescript
interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
    deliveryType?: string; // NEW
  }>;
}
```

**Pass delivery type to products API:**

```typescript
export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const deliveryType = params.deliveryType; // Read from URL

  const [categoriesResult, subcategoriesResult, productsResult] =
    await Promise.all([
      getCategories({ all: true }),
      getSubCategories({ all: true }),
      getProducts({
        categoryId: params.category,
        subCategoryId: params.subcategory,
        search: params.search,
        deliveryType: deliveryType, // Pass to API
        page,
        limit: 12,
      }),
    ]);
  // ... rest of component
}
```

### 2. Client Component Changes (`components/menu/menu-page-client.tsx`)

**Added imports:**

```typescript
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDeliveryType } from "@/store/cart-store";
```

**Added delivery type tracking:**

```typescript
export function MenuPageClient({ ... }: MenuPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track delivery type changes
  const deliveryType = useDeliveryType();
  const prevDeliveryTypeRef = useRef(deliveryType);

  // Update URL when delivery type changes
  useEffect(() => {
    // Skip on initial mount
    if (prevDeliveryTypeRef.current === deliveryType) {
      return;
    }

    prevDeliveryTypeRef.current = deliveryType;

    // Build new URL with updated delivery type
    const params = new URLSearchParams(searchParams.toString());
    params.set('deliveryType', deliveryType);

    // Navigate to updated URL (triggers server component re-render)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [deliveryType, pathname, searchParams, router]);

  // ... rest of component
}
```

## How It Works

### Flow Diagram

```
User changes delivery type
       ↓
deliveryType state updates in cart-store (Zustand)
       ↓
useDeliveryType hook in MenuPageClient detects change
       ↓
useEffect triggers
       ↓
URL updates with new deliveryType parameter
       ↓
Next.js detects URL change
       ↓
Server component (MenuPage) re-renders
       ↓
getProducts API called with new deliveryType
       ↓
Filtered products returned from server
       ↓
MenuPageClient receives new products
       ↓
Product grid updates with filtered products
```

## Key Features

### 1. No Unnecessary Re-renders

- Uses `useRef` to track previous delivery type value
- Only triggers update when delivery type actually changes
- `startTransition` ensures smooth UI updates without blocking

### 2. Preserves Other Filters

- Maintains category, subcategory, search, and page parameters
- Only updates the delivery type parameter
- Users don't lose their filter selections

### 3. No Scroll Disruption

- Uses `{ scroll: false }` option in `router.push()`
- User's scroll position is maintained during update

### 4. Works From Anywhere

The implementation works when delivery type is changed from:
- Delivery type selection modal (first-time users)
- Cart page delivery type selector
- Any future delivery type switcher components

### 5. Server-Side Filtering

- Products are filtered on the server via API
- Reduces client-side data transfer
- Ensures users only see relevant products

## API Integration

The `getProducts` API function already supported delivery type filtering:

```typescript
// lib/api/products.ts
export async function getProducts(params?: ProductQueryParams) {
  const queryParams = new URLSearchParams();
  // ... other params
  if (params?.deliveryType)
    queryParams.append("deliveryType", params.deliveryType);
  // ...
}
```

## Performance Considerations

### Optimizations

1. **useTransition**: Wraps navigation to prevent blocking UI updates
2. **Debouncing**: Not needed as delivery type changes are infrequent user actions
3. **Caching**: Next.js automatically caches server component data
4. **Parallel Fetching**: Categories, subcategories, and products fetch in parallel

### Loading States

- `isPending` state from `useTransition` already used by ProductGrid
- Shows loading indicator during data fetch
- Provides visual feedback to users

## Testing Scenarios

### Test Cases

1. **Initial Load**
   - Page loads with default delivery type (pickup)
   - Products filtered correctly

2. **Change Delivery Type from Modal**
   - User opens delivery type modal
   - Selects different type (e.g., delivery)
   - Modal closes
   - Product list refreshes automatically

3. **Change from Cart Page**
   - User goes to cart page
   - Changes delivery type
   - Navigates back to menu
   - Products reflect new delivery type

4. **Multiple Changes**
   - User changes delivery type multiple times
   - Each change triggers proper refresh
   - No stale data displayed

5. **With Active Filters**
   - User has category/subcategory selected
   - Changes delivery type
   - Filters are preserved
   - Products update correctly

## Future Enhancements

### Potential Improvements

1. **Visual Indicator**: Add a badge showing current delivery type on menu page
2. **Toast Notification**: Show brief toast when products refresh due to delivery type change
3. **Product Count**: Display count of products available per delivery type
4. **Availability Badge**: Show badges on products indicating which delivery types they support

## Related Files

### Modified Files
- `/app/menu/page.tsx` - Server component, added deliveryType handling
- `/components/menu/menu-page-client.tsx` - Client component, added delivery type tracking

### Related Files (No Changes)
- `/lib/api/products.ts` - API function (already supported deliveryType)
- `/types/product.ts` - Type definitions (already included deliveryType in ProductQueryParams)
- `/store/cart-store.ts` - Zustand store (manages deliveryType state)
- `/contexts/delivery-type-context.tsx` - Context for delivery type UI state

## Conclusion

This implementation provides a seamless user experience where product availability automatically updates when delivery type changes, without requiring manual page refreshes or complex state management. The solution leverages Next.js App Router's server components and client-side state synchronization for optimal performance.
