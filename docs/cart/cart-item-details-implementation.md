# Cart Item Card - Product Details Fetching Implementation

## Overview
Implemented proper product details fetching and display in cart item cards. Each cart item now fetches its own product details using the `useProductDetails` hook and displays accurate information including product image, name, variant, addons, and pricing.

## Files Modified

### 1. `/components/cart/cart-item-card.tsx`
**Changes:**
- Removed dependency on `itemDetails` prop (mock data)
- Added `useProductDetails` hook to fetch product details by `item.itemId`
- Added loading skeleton state while fetching
- Added error state for failed product details fetch
- Implemented proper variant display using `Badge` component
- Implemented addon mapping from `item.pricing` to actual addon labels
- Implemented accurate price calculation (variant price + addons)
- Currency display assumes prices are in pence (divided by 100 for display)

**Key Features:**
```typescript
// Fetch product details automatically
const { data: productDetails, isLoading } = useProductDetails(item.itemId);

// Extract variant info
const variantInfo = useMemo(() => {
  if (!productDetails) return null;
  return productDetails.variantList.find(v => v._id === item.variantId);
}, [productDetails, item.variantId]);

// Extract and map addons
const addonInfo = useMemo(() => {
  if (!productDetails || !item.pricing) return [];
  return item.pricing.map(pricingItem => {
    const addon = productDetails.addonList.find(a => a._id === pricingItem.id);
    return addon ? {
      label: addon.label,
      quantity: pricingItem.quantity,
      price: addon.price
    } : null;
  }).filter(Boolean);
}, [productDetails, item.pricing]);

// Calculate accurate pricing
const itemPrice = useMemo(() => {
  if (!productDetails) return 0;
  const variantPrice = variantInfo?.price || productDetails.product.basePrice;
  const addonsTotal = addonInfo.reduce(
    (sum, addon) => sum + addon.price * addon.quantity,
    0
  );
  return variantPrice + addonsTotal;
}, [productDetails, variantInfo, addonInfo]);
```

**UI Components:**
- Product image from `product.photoList[0]`
- Product name from `product.name`
- Variant displayed as `Badge` with `secondary` variant
- Addons shown as comma-separated list with quantity (e.g., "Extra Cheese x2")
- Quantity control using `QuantityIncrementor` component
- Edit button (pencil icon)
- Delete button (trash icon)

**Loading State:**
- Shows `CartItemSkeleton` component while fetching product details
- Skeleton matches the card layout for smooth loading experience

**Error State:**
- Shows destructive-bordered card with error message if product details fail to load

### 2. `/components/cart/cart-item-list.tsx`
**Changes:**
- Removed `itemDetailsMap` prop
- Removed `loading` prop (each card handles its own loading state)
- Simplified component to just map over items and render `CartItemCard` components

**Before:**
```typescript
interface CartItemListProps {
  items: CartResponse[];
  itemDetailsMap?: Record<string, {...}>;
  loading?: boolean;
  // ...
}
```

**After:**
```typescript
interface CartItemListProps {
  items: CartResponse[];
  onQuantityChange: (cartId: string, newQuantity: number) => Promise<void>;
  onRemove: (cartId: string) => Promise<void>;
  onEditSuccess?: () => void;
  className?: string;
}
```

### 3. `/app/(protected)/cart/page.tsx`
**Changes:**
- Removed mock `itemDetailsMap` creation
- Removed `itemDetailsMap` and `loading` props from `CartItemList` usage

**Before:**
```typescript
const itemDetailsMap = cartItems.reduce((acc, item) => {
  acc[item.itemId] = {
    name: `Product ${item.itemId}`,
    image: "",
    variantName: item.variantId ? `Variant ${item.variantId}` : undefined,
    price: 12.99,
  };
  return acc;
}, {} as Record<...>);

<CartItemList
  items={cartItems}
  itemDetailsMap={itemDetailsMap}
  loading={isLoadingCart}
  // ...
/>
```

**After:**
```typescript
<CartItemList
  items={cartItems}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemoveItem}
  onEditSuccess={handleEditSuccess}
/>
```

## Data Flow

### Cart Item Structure
```typescript
{
  _id: string;              // Cart item ID
  itemId: string;           // Product ID (used to fetch product details)
  variantId: string;        // Selected variant ID
  quantity: number;         // Item quantity
  pricing: Array<{          // Selected addons
    id: string;             // Addon ID
    quantity: number;       // Addon quantity
  }>;
}
```

### Product Details Structure
```typescript
{
  product: {
    _id: string;
    name: string;
    photoList: string[];
    basePrice: number;
    // ... other product fields
  };
  variantList: Array<{
    _id: string;
    label: string;
    price: number;
    groupId: string;
  }>;
  addonList: Array<{
    _id: string;
    label: string;
    price: number;
    groupId: string;
  }>;
  // ... other lists
}
```

### Price Calculation Logic
1. **Base Price**: Get variant price if selected, otherwise use product base price
2. **Addon Total**: Sum all selected addons (addon.price × addon.quantity)
3. **Item Price**: Base Price + Addon Total
4. **Item Total**: Item Price × Item Quantity

Example:
```
Variant: Large Pizza (£12.00)
Addons: Extra Cheese x2 (£1.50 each) + Pepperoni x1 (£2.00)
Quantity: 3

Item Price = 1200 + (150 * 2) + (200 * 1) = 1700 pence (£17.00)
Item Total = 1700 * 3 = 5100 pence (£51.00)
```

## Dependencies

### Existing Hooks
- `useProductDetails` from `/lib/hooks/use-product-details.ts`
  - Fetches product details by product ID
  - Returns: `{ data, isLoading, error, refetch }`
  - Automatically fetches on mount by default

### Components Used
- `CustomImage` - Next.js Image wrapper with error handling
- `Badge` - For displaying variant information
- `QuantityIncrementor` - Quantity control component
- `Skeleton` - Loading state skeleton
- `Button` - Edit and delete action buttons
- `Dialog` - Remove confirmation modal
- `EditCartItemModal` - Edit cart item modal

## Testing Checklist

- [ ] Product details fetch correctly by itemId
- [ ] Product image displays from photoList[0]
- [ ] Product name displays correctly
- [ ] Variant badge shows selected variant label
- [ ] Addons display with correct labels and quantities
- [ ] Price calculation is accurate (variant + addons)
- [ ] Total price updates correctly with quantity changes
- [ ] Loading skeleton shows while fetching
- [ ] Error state shows if fetch fails
- [ ] Quantity incrementor updates cart
- [ ] Edit button opens edit modal
- [ ] Delete button shows confirmation dialog
- [ ] Multiple cart items load independently
- [ ] Price display uses correct currency format (£X.XX)

## Known Assumptions

1. **Price Format**: All prices in API are in pence (smallest currency unit)
   - Display divides by 100: `£{(price / 100).toFixed(2)}`
   - If API returns prices in pounds, remove division

2. **Image Fallback**: Uses empty string for missing images
   - CustomImage component handles fallback display

3. **Variant Requirement**: Assumes every cart item has a variant
   - Falls back to base price if variant not found

4. **Addon Mapping**: Maps `item.pricing[].id` to `addonList[]._id`
   - Filters out any addons not found in product details

## Future Enhancements

1. **Caching**: Add request deduplication for same product fetched multiple times
2. **Optimistic Updates**: Show quantity changes immediately before API response
3. **Error Retry**: Add retry button in error state
4. **Price Display**: Add configuration for currency symbol and format
5. **Image Optimization**: Add multiple image sizes for responsive display
6. **Variant Groups**: Show variant group label (e.g., "Size: Large")
7. **Addon Groups**: Group addons by addon group for better organization

## Performance Considerations

1. **Individual Fetches**: Each cart item fetches its own product details
   - Consider batch fetching if many items in cart
   - Consider prefetching on cart page load

2. **Memoization**: Uses `useMemo` for expensive calculations
   - Variant lookup
   - Addon mapping
   - Price calculation

3. **Loading States**: Shows skeleton immediately
   - No layout shift when data loads
   - Better perceived performance

## Related Documentation

- [Add to Cart Implementation](/docs/add-to-cart-implementation.md)
- [Cart Edit Implementation](/docs/cart-edit-implementation.md)
- [Product Details Hook](/lib/hooks/use-product-details.ts)
- [Cart Types](/types/cart.ts)
- [Product Types](/types/product.ts)
