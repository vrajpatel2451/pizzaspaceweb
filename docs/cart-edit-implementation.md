# Cart Item Edit Implementation

This document describes the complete implementation of the Cart Item Edit functionality for PizzaSpace.

## Overview

The Cart Item Edit feature allows users to modify existing cart items by:
- Changing the selected variant
- Adding/removing addons
- Updating addon quantities
- Changing item quantity
- Viewing real-time price updates

## Architecture

### Files Created

1. **lib/hooks/use-product-details.ts**
   - Custom hook for fetching product details
   - Fetches variants, addons, and pricing information
   - Auto-fetch on mount with manual refetch capability
   - Error handling and loading states

2. **components/cart/cart-item-details.tsx**
   - Display component for cart item details
   - Shows product info, selected variant, and addons
   - Displays unit price and total price breakdown
   - Loading skeleton for better UX

3. **components/cart/edit-cart-item-modal.tsx**
   - Full-featured edit modal with form controls
   - Variant selection using RadioGroup
   - Addon selection with Checkbox
   - Quantity controls for items and addons
   - Real-time price calculation
   - Integrates with useUpdateCartItem hook

### Files Modified

4. **components/cart/cart-item-card.tsx**
   - Added Edit button that opens EditCartItemModal
   - Integrated edit functionality with proper callbacks
   - Maintained existing remove and quantity change features

## Component APIs

### useProductDetails Hook

```typescript
const { data, isLoading, error, refetch } = useProductDetails(
  itemId: string,
  autoFetch?: boolean
);
```

**Parameters:**
- `itemId` - Product ID to fetch details for
- `autoFetch` - Auto-fetch on mount (default: true)

**Returns:**
- `data` - ProductDetailsResponse with variants, addons, pricing
- `isLoading` - Loading state
- `error` - Error message if fetch fails
- `refetch` - Function to manually refetch data

### EditCartItemModal

```typescript
<EditCartItemModal
  isOpen={boolean}
  onClose={() => void}
  item={CartResponse}
  onSuccess={() => void}
/>
```

**Props:**
- `isOpen` - Controls modal visibility
- `onClose` - Callback when modal closes
- `item` - Current cart item to edit
- `onSuccess` - Callback on successful update

**Features:**
- Pre-populates form with current item data
- Variant selection with RadioGroup
- Addon selection with Checkbox (single/multi)
- Quantity controls with validation
- Real-time price calculation
- Loading states during API calls
- Error handling with toast notifications

### CartItemCard (Updated)

```typescript
<CartItemCard
  item={CartResponse}
  onQuantityChange={(cartId, newQuantity) => Promise<void>}
  onRemove={(cartId) => Promise<void>}
  onEditSuccess={() => void}
  itemDetails={object}
  className={string}
/>
```

**New Props:**
- `onEditSuccess` - Callback after successful edit (replaces `onEdit`)

**Removed Props:**
- `onEdit` - No longer needed, edit is handled internally

## Data Flow

1. **User clicks Edit button** on CartItemCard
2. **EditCartItemModal opens** with cart item data
3. **useProductDetails hook** fetches full product details
4. **Form initializes** with current variant, addons, quantity
5. **User modifies** selections (variants/addons/quantity)
6. **Price updates** in real-time as selections change
7. **User clicks Save** to submit changes
8. **useUpdateCartItem** sends update to API
9. **Cart store updates** with new item data
10. **Modal closes** and success callback fires
11. **Cart list refreshes** to show updated item

## Validation Rules

### Variants
- At least one variant must be selected
- Only one variant can be selected at a time
- Variant groups enforce single selection

### Addons
- Addon groups can allow single or multiple selections
- Min/max constraints enforced (from addon group config)
- Quantity controls only shown for multi-select groups
- Addon quantities respect group max limit

### Quantity
- Minimum: 1
- Maximum: 99
- Quantity controls disabled during updates

## Error Handling

### Product Details Fetch
- Shows loading spinner while fetching
- Displays error message if fetch fails
- Provides option to retry via refetch

### Cart Update
- Shows loading state on Save button
- Displays toast notification on success/failure
- Maintains modal state on error for retry
- Prevents duplicate submissions

## Styling & UX

### Visual Feedback
- Selected variants highlighted with primary border
- Selected addons highlighted with primary background
- Hover states on all interactive elements
- Loading spinners during async operations

### Accessibility
- Proper ARIA labels on all controls
- Keyboard navigation support
- Screen reader announcements for price changes
- Focus management in modal

### Responsive Design
- Mobile-optimized layout
- Touch-friendly controls
- Scrollable content in modal
- Proper spacing and padding

## Integration Example

```typescript
// In your cart page or component
import { CartItemCard } from '@/components/cart/cart-item-card';
import { useUpdateCartItem, useRemoveCartItem } from '@/lib/hooks/use-cart';

function CartPage() {
  const { mutate: updateCart } = useUpdateCartItem();
  const { mutate: removeCart } = useRemoveCartItem();

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    await updateCart(cartId, {
      quantity: newQuantity,
      // ... other required fields
    });
  };

  const handleRemove = async (cartId: string) => {
    await removeCart(cartId, deviceId);
  };

  const handleEditSuccess = () => {
    // Refetch cart or update UI
    console.log('Cart item updated successfully');
  };

  return (
    <div>
      {cartItems.map((item) => (
        <CartItemCard
          key={item._id}
          item={item}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
          onEditSuccess={handleEditSuccess}
          itemDetails={{
            name: productName,
            image: productImage,
            variantName: variantName,
            price: itemPrice,
          }}
        />
      ))}
    </div>
  );
}
```

## Dependencies

### Existing Components Used
- `Modal` - Base modal component
- `Button` - Action buttons
- `RadioGroup` / `RadioGroupItem` - Variant selection
- `Checkbox` - Addon selection
- `Label` - Form labels
- `Badge` - Product type indicators
- `CustomImage` - Image display
- `QuantityControl` - Quantity selector
- `Dialog` - Remove confirmation

### Hooks Used
- `useProductDetails` - Fetch product data (NEW)
- `useUpdateCartItem` - Update cart items
- `useState` - Component state
- `useEffect` - Side effects
- `useMemo` - Memoized calculations

### External Libraries
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui` - Primitive components

## API Integration

### Endpoints Used

1. **GET /product/details/:productId**
   - Fetches complete product details
   - Returns variants, addons, pricing
   - Used by useProductDetails hook

2. **PUT /cart/:cartId**
   - Updates cart item
   - Payload: { variantId, pricing, quantity, sessionId }
   - Returns updated cart item

## Best Practices

1. **State Management**
   - Local state for form controls
   - Global cart store for cart data
   - Optimistic updates for better UX

2. **Performance**
   - Memoized price calculations
   - Conditional rendering based on data availability
   - Debounced API calls where appropriate

3. **Type Safety**
   - Full TypeScript coverage
   - Proper typing for all props and state
   - Type guards for API responses

4. **User Experience**
   - Loading states for all async operations
   - Toast notifications for feedback
   - Modal prevents data loss with confirmation
   - Real-time price updates

## Testing Considerations

### Unit Tests
- useProductDetails hook fetch logic
- Price calculation accuracy
- Form validation rules
- Error handling scenarios

### Integration Tests
- Modal open/close flow
- Form submission with API
- Cart store updates
- Error recovery

### E2E Tests
- Complete edit flow
- Variant changes
- Addon selection
- Quantity updates
- Error scenarios

## Future Enhancements

1. **Undo/Redo** - Allow users to revert changes
2. **Comparison View** - Show before/after changes
3. **Bulk Edit** - Edit multiple items at once
4. **Smart Suggestions** - Recommend popular addons
5. **Favorites** - Save favorite combinations
6. **Notes** - Add special instructions per item

## Troubleshooting

### Common Issues

**Problem:** Modal doesn't open
- **Solution:** Check isOpen prop is controlled correctly

**Problem:** Price not updating
- **Solution:** Verify pricing data structure from API

**Problem:** Addons not pre-selected
- **Solution:** Check pricing ID mapping in initialization

**Problem:** Update fails silently
- **Solution:** Check network tab for API errors

## Support

For questions or issues with this implementation:
1. Check the API documentation
2. Review the type definitions
3. Test with sample data
4. Check browser console for errors
5. Verify network requests in DevTools
