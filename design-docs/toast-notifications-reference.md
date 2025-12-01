# Toast Notifications Reference

Quick reference guide for all toast notifications in the cart system.

## Toast Messages by Category

### Success Messages

| Operation | Message | Location |
|-----------|---------|----------|
| Add to Cart | `Item added to cart` | `lib/hooks/use-cart.ts:102` |
| Update Cart | `Cart updated` | `lib/hooks/use-cart.ts:161` |
| Remove Item | `Item removed from cart` | `lib/hooks/use-cart.ts:220` |

### Error Messages - API Failures

| Operation | Message | Location |
|-----------|---------|----------|
| Add to Cart | `Failed to add item to cart` | `lib/hooks/use-cart.ts:120` |
| Update Cart | `Failed to update cart` | `lib/hooks/use-cart.ts:179` |
| Remove Item | `Failed to remove item` | `lib/hooks/use-cart.ts:238` |

### Error Messages - Unexpected Errors

| Operation | Message | Location |
|-----------|---------|----------|
| Add to Cart | `An unexpected error occurred` | `lib/hooks/use-cart.ts:125` |
| Update Cart | `An unexpected error occurred` | `lib/hooks/use-cart.ts:184` |
| Remove Item | `An unexpected error occurred` | `lib/hooks/use-cart.ts:243` |

### Error Messages - Validation

| Condition | Message | Location |
|-----------|---------|----------|
| No Device ID | `Session not initialized. Please refresh the page.` | `product-details-container.tsx:67`<br>`quick-add-button.tsx:48` |
| No Store Selected | `Please select a store first` | `product-details-container.tsx:72`<br>`quick-add-button.tsx:53` |
| No Product Data | `Product data not loaded` | `product-details-container.tsx:77` |
| No Variant Selected | `Please select a variant` | `product-details-container.tsx:91`<br>`edit-cart-item-modal.tsx:164` |
| Invalid Cart Data | `Invalid cart data` | `product-details-container.tsx:109` |
| No Product Details (Edit) | `Product details not loaded` | `edit-cart-item-modal.tsx:142` |

## Toast Usage by Component

### use-cart.ts (Hook)
Handles all cart operation toasts automatically:
- `useAddToCart` - Add operation toasts
- `useUpdateCartItem` - Update operation toasts
- `useRemoveCartItem` - Remove operation toasts
- `useCartSummary` - No toasts (silent updates)

### product-details-container.tsx
Handles validation toasts before delegating to `useAddToCart`:
- Session validation
- Store validation
- Product data validation
- Variant selection validation

### quick-add-button.tsx
Handles validation toasts before delegating to `useAddToCart`:
- Session validation
- Store validation

### edit-cart-item-modal.tsx
Handles validation toasts before delegating to `useUpdateCartItem`:
- Product details validation
- Variant selection validation

### cart-item-card.tsx
Pure UI component - delegates to parent callbacks that use hooks.
No direct toast calls (handled by hooks).

## Implementation Pattern

```typescript
// Standard pattern used throughout the codebase
const result = await cartOperation(payload);

if (result.success) {
  toast.success("Success message");
  // Additional success logic (close modals, etc.)
} else {
  toast.error(result.error || "Fallback error message");
}
```

## Toast Library

**Library:** `sonner`
**Import:** `import { toast } from 'sonner';`

**Methods Used:**
- `toast.success(message)` - Success notifications
- `toast.error(message)` - Error notifications

## Testing Checklist

When testing cart operations, verify:

- [ ] Add to cart shows success toast
- [ ] Add to cart shows error toast on failure
- [ ] Update cart shows success toast
- [ ] Update cart shows error toast on failure
- [ ] Remove item shows success toast
- [ ] Remove item shows error toast on failure
- [ ] No store selected shows validation toast
- [ ] No variant selected shows validation toast
- [ ] Session not initialized shows validation toast
- [ ] Only one toast appears per operation (no duplicates)
- [ ] Toasts appear in correct position and timing
- [ ] Modal/dialog closes after successful operations
