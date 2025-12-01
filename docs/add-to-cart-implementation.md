# Add to Cart Implementation

This document describes the Add to Cart functionality implementation for PizzaSpace menu and product pages.

## Overview

The Add to Cart feature integrates with the existing cart API and provides seamless cart management across the application. It supports:

- Simple products with quick add functionality
- Complex products with variants and addons through product details modal
- Real-time cart synchronization
- Loading states and error handling
- Toast notifications for user feedback

## Architecture

### Core Components

1. **Cart API Integration** (`lib/api/cart.ts`)
   - `addToCart()` - Adds items to cart
   - Uses `AddToCartPayload` type for requests

2. **Cart Hooks** (`lib/hooks/use-cart.ts`)
   - `useAddToCart()` - Hook for adding items to cart
   - Handles loading states, error handling, and optimistic updates
   - Shows toast notifications automatically

3. **Cart Store** (`store/cart-store.ts`)
   - Zustand store for cart state management
   - Persists user preferences (not cart items)
   - Provides cart actions and selectors

4. **Device & Store Context**
   - `useDeviceId()` - Gets unique device/session ID
   - `useStore()` - Gets selected store context

### Utility Functions

**File:** `lib/utils/cart-utils.ts`

#### `calculateItemPrice()`
Calculates the total price for a cart item including variants and addons.

```typescript
calculateItemPrice({
  basePrice: number,
  selectedVariant: VariantResponse | null,
  selectedAddons: Map<string, { selected: boolean; quantity: number }>,
  addonList: AddonResponse[],
  pricing: VariantPricingResponse[],
  quantity: number
}): number
```

#### `formatPricingPayload()`
Formats selected variants and addons into the API pricing payload format.

```typescript
formatPricingPayload({
  selectedVariant: VariantResponse | null,
  selectedAddons: Map<string, { selected: boolean; quantity: number }>,
  addonList: AddonResponse[],
  pricing: VariantPricingResponse[]
}): PricingIdsAndQuantity[]
```

#### `createAddToCartPayload()`
Creates a complete AddToCartPayload from product details context.

```typescript
createAddToCartPayload({
  productId: string,
  categoryId: string,
  storeId: string,
  sessionId: string,
  selectedVariant: VariantResponse | null,
  selectedAddons: Map<string, { selected: boolean; quantity: number }>,
  addonList: AddonResponse[],
  pricing: VariantPricingResponse[],
  quantity: number
}): AddToCartPayload | null
```

#### `validateCartPayload()`
Validates cart payload before sending to API.

```typescript
validateCartPayload(payload: AddToCartPayload): {
  isValid: boolean,
  errors: string[]
}
```

## Component Integration

### 1. ProductDetailsContainer
**File:** `components/product-details/product-details-container.tsx`

- Integrates with cart API via `useAddToCart()` hook
- Gets device ID from `useDeviceId()` hook
- Gets store ID from `useStore()` context
- Validates prerequisites before adding to cart
- Handles success/error states with toast notifications
- Closes modal on successful add

**Key Changes:**
```typescript
// Added cart integration
const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();
const deviceId = useDeviceId();
const { selectedStore } = useStore();

// Enhanced handleAddToCart with API integration
const handleAddToCart = async (cartData) => {
  // Validate prerequisites
  if (!deviceId || !selectedStore) return;

  // Create payload using utility function
  const payload = createAddToCartPayload({ /* ... */ });

  // Call API
  const result = await addToCart(payload);

  if (result.success) {
    handleClose(); // Close modal on success
  }
};
```

### 2. ProductCard
**File:** `components/home/menu-section/product-card.tsx`

- Uses `ProductDetailsContainer` which now has cart integration
- No additional changes needed - automatically inherits cart functionality
- Shows product details modal on click
- Modal handles add to cart through integrated API

**Usage:**
```typescript
<ProductCard
  product={product}
  index={index}
  priority={index < 6}
  sizes={imageSizes}
/>
```

### 3. QuickAddButton
**File:** `components/home/menu-section/quick-add-button.tsx`

- For simple products without variants/addons
- Directly integrates with cart API
- Shows loading and success states
- Requires variant and pricing IDs to be passed

**Props:**
```typescript
interface QuickAddButtonProps {
  productId: string;
  productName: string;
  categoryId: string;
  variantId: string;    // Primary variant ID (required)
  pricingId: string;    // Pricing ID for the variant
  onAdd?: (productId: string) => void;
  variant?: "icon" | "full";
  className?: string;
}
```

**Usage:**
```typescript
<QuickAddButton
  productId={product._id}
  productName={product.name}
  categoryId={product.category}
  variantId={primaryVariant._id}
  pricingId={variantPricing._id}
  variant="icon"
/>
```

### 4. StickyActionBar
**File:** `components/product-details/sections/sticky-action-bar.tsx`

- Already supports loading state via `isLoading` prop
- Loading state now reflects cart API call in progress
- Shows animated loading, success, and error states
- Disabled when validation fails

**No changes needed** - receives loading state from parent via ProductDetailsContainer.

## Data Flow

### Adding Product with Variants/Addons (via Modal)

```
User clicks ProductCard
  ↓
ProductDetailsContainer opens modal
  ↓
User selects variants/addons
  ↓
ProductDetailsContext tracks selections
  ↓
User clicks "Add to Cart"
  ↓
ProductDetailsContainer.handleAddToCart()
  ├─ Validates deviceId & selectedStore
  ├─ Creates AddToCartPayload via createAddToCartPayload()
  ├─ Calls useAddToCart().mutate()
  │   ├─ API call to /customer/cart/add
  │   ├─ Updates cart store (optimistic)
  │   └─ Shows toast notification
  └─ Closes modal on success
```

### Quick Add (Simple Products)

```
User clicks QuickAddButton
  ↓
QuickAddButton.handleAdd()
  ├─ Validates deviceId & selectedStore
  ├─ Creates AddToCartPayload with defaults
  ├─ Calls useAddToCart().mutate()
  │   ├─ API call to /customer/cart/add
  │   ├─ Updates cart store (optimistic)
  │   └─ Shows toast notification
  └─ Shows success animation
```

## API Payload Structure

### AddToCartPayload

```typescript
{
  itemId: string;          // Product ID
  categoryId: string;      // Category ID
  storeId: string;         // Selected store ID
  sessionId: string;       // Device/session ID
  variantId: string;       // Selected variant ID (required)
  pricing: [               // Pricing entries
    {
      id: string;          // Pricing ID (from VariantPricingResponse)
      quantity: number;    // Quantity (1 for variants, n for addons)
    }
  ];
  quantity: number;        // Total item quantity
}
```

### Example Payload

```json
{
  "itemId": "prod_123",
  "categoryId": "cat_456",
  "storeId": "store_789",
  "sessionId": "device_abc",
  "variantId": "variant_xyz",
  "pricing": [
    { "id": "pricing_var_1", "quantity": 1 },
    { "id": "pricing_addon_1", "quantity": 2 },
    { "id": "pricing_addon_2", "quantity": 1 }
  ],
  "quantity": 1
}
```

## Error Handling

### Prerequisites Validation

The implementation validates these prerequisites before adding to cart:

1. **Device ID** - Must exist (from localStorage)
   - Error: "Session not initialized. Please refresh the page."

2. **Selected Store** - Must be selected
   - Error: "Please select a store first"

3. **Product Data** - Must be loaded
   - Error: "Product data not loaded"

4. **Variant Selection** - Primary variant must be selected
   - Error: "Please select a variant"

### API Errors

Handled automatically by `useAddToCart()` hook:
- Shows error toast with message from API
- Logs error to console
- Returns `{ success: false, error: string }`

## Loading States

### Modal/Dialog States

- **isLoading** - Product data loading
- **isAddingToCart** - Cart API call in progress
- Combined state passed to modal: `isLoading || isAddingToCart`

### Button States

QuickAddButton:
- `isAdding` - API call in progress (shows loading animation)
- `isAdded` - Success state (shows checkmark for 2 seconds)

StickyActionBar:
- `idle` - Ready to add
- `loading` - API call in progress
- `success` - Added successfully (shows checkmark for 2 seconds)
- `error` - Failed (shows error icon for 2 seconds)

## Toast Notifications

All cart operations show toast notifications:

- **Success:** "Item added to cart" (green toast)
- **Error:** Shows specific error message (red toast)
- **Prerequisites:** Shows validation error (red toast)

Toasts are shown automatically by the `useAddToCart()` hook.

## TypeScript Types

### Key Types Used

```typescript
// Cart types
import { AddToCartPayload, CartResponse, PricingIdsAndQuantity } from "@/types/cart";

// Product types
import { VariantResponse, AddonResponse, VariantPricingResponse } from "@/types/product";

// Hook return type
interface UseAddToCartReturn {
  mutate: (data: AddToCartPayload) => Promise<{ success: boolean; data?: CartResponse; error?: string }>;
  isLoading: boolean;
}
```

## Best Practices

1. **Always validate prerequisites** before calling cart API
2. **Use utility functions** for payload creation to ensure consistency
3. **Handle loading states** to provide user feedback
4. **Close modal on success** to improve UX
5. **Show toast notifications** for all cart operations
6. **Validate selections** before allowing add to cart

## Testing Checklist

- [ ] Product with variants opens modal
- [ ] Can select different variants
- [ ] Can select multiple addons
- [ ] Price updates correctly with selections
- [ ] Add to cart button disabled when invalid
- [ ] Loading state shows during API call
- [ ] Success toast shows on successful add
- [ ] Error toast shows on API error
- [ ] Modal closes on successful add
- [ ] Cart count updates after adding
- [ ] QuickAddButton works for simple products
- [ ] Store selection required error shows
- [ ] Device ID validation works

## Future Enhancements

1. **Optimistic UI Updates** - Show item in cart immediately
2. **Undo Functionality** - Allow users to undo add to cart
3. **Quick View** - Preview product without opening full modal
4. **Recently Added** - Show recently added items in a mini cart
5. **Cart Animation** - Animate item flying to cart icon
6. **Keyboard Navigation** - Support keyboard shortcuts for add to cart

## Troubleshooting

### "Session not initialized" error
- Device ID is not set in localStorage
- Solution: Refresh the page or check device-store initialization

### "Please select a store first" error
- No store is selected in store context
- Solution: Select a store from store selector

### Cart not updating after add
- Check browser console for API errors
- Verify cart store is receiving updates
- Check network tab for API response

### Modal not closing after add
- Check `handleAddToCart` success handling
- Verify `handleClose` is being called
- Check for errors preventing success flow

## Related Files

- `/lib/api/cart.ts` - Cart API functions
- `/lib/hooks/use-cart.ts` - Cart hooks
- `/lib/utils/cart-utils.ts` - Cart utility functions
- `/store/cart-store.ts` - Cart state management
- `/store/device-store.ts` - Device ID management
- `/lib/contexts/store-context.tsx` - Store selection context
- `/components/product-details/product-details-container.tsx` - Product details modal
- `/components/home/menu-section/product-card.tsx` - Product card component
- `/components/home/menu-section/quick-add-button.tsx` - Quick add button
- `/types/cart.ts` - Cart TypeScript types
- `/types/product.ts` - Product TypeScript types
