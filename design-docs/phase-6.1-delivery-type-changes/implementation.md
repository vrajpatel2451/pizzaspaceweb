# Phase 6.1: Delivery Type Change Handling - Implementation Guide

## Overview

This implementation adds confirmation dialog functionality when users attempt to change delivery type while having items in their cart that won't be available for the new delivery type.

## Files Created

### `/components/delivery/delivery-type-change-dialog.tsx`

A production-ready confirmation dialog component that:

- Displays when user tries to change delivery type with affected cart items
- Shows count and list of items that will become unavailable
- Uses amber/orange warning styling (informational, not destructive)
- Provides clear Cancel and Confirm actions
- Fully accessible with ARIA labels and semantic HTML
- Scrollable list for many affected items (max-height: 200px)

**Component Props:**

```typescript
interface DeliveryTypeChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDeliveryType: OrderDeliveryType;
  newDeliveryType: OrderDeliveryType;
  affectedItems: Array<{ id: string; name: string }>;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Key Features:**

- Formats delivery type names for display ("dineIn" → "Dine In")
- Shows affected item count in warning alert
- Lists all affected items by name
- Provides informational text about what happens next
- Fully keyboard accessible
- Screen reader friendly with proper ARIA attributes

## Files Modified

### `/components/delivery/index.ts`

Added export for the new dialog component:

```typescript
export { DeliveryTypeChangeDialog } from "./delivery-type-change-dialog";
```

### `/contexts/delivery-type-context.tsx`

Enhanced the context with delivery type change handling:

**New Context Values:**

```typescript
interface DeliveryTypeContextValue {
  // ... existing values
  pendingDeliveryType: OrderDeliveryType | null;
  showChangeDialog: boolean;
  affectedItemsForChange: Array<{ id: string; name: string }>;
  initiateDeliveryTypeChange: (type: OrderDeliveryType) => void;
  confirmDeliveryTypeChange: () => void;
  cancelDeliveryTypeChange: () => void;
}
```

**New State:**

- `pendingDeliveryType`: Stores the delivery type user wants to change to
- `showChangeDialog`: Controls visibility of the confirmation dialog
- `affectedItemsForChange`: List of cart items that will be removed

**New Functions:**

1. **`getAffectedItemsForNewDeliveryType(newType)`**

   - Helper function that checks which cart items won't be available
   - Fetches product details from cache or API
   - Compares `availableDeliveryTypes` with the new type
   - Returns array of affected items with id and name

2. **`initiateDeliveryTypeChange(type)`**

   - Entry point for delivery type changes
   - If cart is empty or same type → changes directly
   - Otherwise, checks for affected items
   - If no affected items → changes directly
   - If items affected → shows confirmation dialog

3. **`confirmDeliveryTypeChange()`**

   - Removes all affected items from cart
   - Updates delivery type
   - Closes dialog and resets state

4. **`cancelDeliveryTypeChange()`**
   - Closes dialog without making changes
   - Resets pending state

**Flow Diagram:**

```
User clicks delivery type
        ↓
initiateDeliveryTypeChange()
        ↓
Cart empty or same type?
  Yes → Change directly
  No → Check affected items
        ↓
    No affected items?
      Yes → Change directly
      No → Show dialog
           ↓
    User confirms?
      Yes → Remove items + Change type
      No → Cancel
```

## Usage Example

### Basic Integration

```typescript
import { useDeliveryTypeContext } from "@/contexts/delivery-type-context";
import { DeliveryTypeChangeDialog } from "@/components/delivery";

function DeliveryTypeSelector() {
  const {
    deliveryType,
    pendingDeliveryType,
    showChangeDialog,
    affectedItemsForChange,
    initiateDeliveryTypeChange,
    confirmDeliveryTypeChange,
    cancelDeliveryTypeChange,
  } = useDeliveryTypeContext();

  return (
    <>
      <div>
        <button onClick={() => initiateDeliveryTypeChange("pickup")}>
          Pickup
        </button>
        <button onClick={() => initiateDeliveryTypeChange("delivery")}>
          Delivery
        </button>
        <button onClick={() => initiateDeliveryTypeChange("dineIn")}>
          Dine In
        </button>
      </div>

      <DeliveryTypeChangeDialog
        open={showChangeDialog}
        onOpenChange={(open) => !open && cancelDeliveryTypeChange()}
        currentDeliveryType={deliveryType}
        newDeliveryType={pendingDeliveryType || deliveryType}
        affectedItems={affectedItemsForChange}
        onConfirm={confirmDeliveryTypeChange}
        onCancel={cancelDeliveryTypeChange}
      />
    </>
  );
}
```

### Integration in Existing Components

To update existing delivery type selectors (like the modal or header):

**Before:**

```typescript
onClick={() => setDeliveryType("pickup")}
```

**After:**

```typescript
onClick={() => initiateDeliveryTypeChange("pickup")}
```

The context will handle showing the dialog automatically when needed.

## Technical Details

### Dependencies

- **shadcn/ui components:**

  - `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
  - `Button`
  - `Alert`, `AlertDescription`
  - `lucide-react` icons: `AlertTriangle`

- **Hooks:**

  - `useCartItems` from cart store
  - `useCartValidation` for validation logic
  - `useState`, `useCallback`, `useMemo` from React

- **APIs:**
  - `getProductDetails` from `/lib/api/products`
  - `productDetailsCache` from `/lib/cache/product-details-cache`

### Performance Considerations

1. **Caching:** Product details are cached to avoid redundant API calls
2. **Async validation:** Affected items are checked asynchronously before showing dialog
3. **Memoization:** Context value uses `useMemo` to prevent unnecessary re-renders
4. **Selective updates:** Only affected items are processed during validation

### Accessibility

- **Keyboard navigation:** Full support for tab, enter, escape
- **Screen readers:**
  - Proper ARIA labels on all interactive elements
  - `aria-describedby` for dialog description
  - Role attributes on lists
- **Focus management:** Dialog traps focus when open
- **Semantic HTML:** Proper use of `<ul>`, `<li>`, headings

### Error Handling

- Product fetch failures are logged but don't block the flow
- Items without product details are treated as valid (fail-open approach)
- Empty cart scenarios are handled gracefully

## Testing Checklist

- [ ] Empty cart → Delivery type changes immediately
- [ ] Cart with compatible items → Changes immediately
- [ ] Cart with incompatible items → Shows dialog
- [ ] Dialog shows correct item count and names
- [ ] Confirm removes items and changes delivery type
- [ ] Cancel keeps cart and delivery type unchanged
- [ ] Dialog is keyboard accessible
- [ ] Screen reader announces dialog and content
- [ ] Multiple incompatible items are all listed
- [ ] Scrolling works for long item lists

## Future Enhancements

1. **Undo functionality:** Add toast with undo button after confirmation
2. **Item recommendations:** Suggest alternative items for new delivery type
3. **Batch updates:** Optimize for multiple rapid delivery type changes
4. **Analytics:** Track how often users encounter this dialog
5. **Smart suggestions:** Pre-filter menu based on delivery type

## API Reference

### DeliveryTypeChangeDialog Component

| Prop                  | Type                                      | Description                                   |
| --------------------- | ----------------------------------------- | --------------------------------------------- |
| `open`                | `boolean`                                 | Controls dialog visibility                    |
| `onOpenChange`        | `(open: boolean) => void`                 | Callback when visibility changes              |
| `currentDeliveryType` | `OrderDeliveryType`                       | Current selected delivery type                |
| `newDeliveryType`     | `OrderDeliveryType`                       | Delivery type user wants to switch to         |
| `affectedItems`       | `Array<{ id: string; name: string }>`     | Items that will be removed                    |
| `onConfirm`           | `() => void`                              | Called when user confirms change              |
| `onCancel`            | `() => void`                              | Called when user cancels                      |

### Context Methods

#### `initiateDeliveryTypeChange(type: OrderDeliveryType): void`

Initiates a delivery type change. Automatically handles validation and shows dialog if needed.

**Parameters:**

- `type`: The new delivery type to switch to

**Behavior:**

- If cart is empty → Changes immediately
- If no items affected → Changes immediately
- If items affected → Shows confirmation dialog

#### `confirmDeliveryTypeChange(): void`

Confirms the pending delivery type change. Removes affected items and updates delivery type.

#### `cancelDeliveryTypeChange(): void`

Cancels the pending delivery type change without making any modifications.

## Troubleshooting

### Dialog doesn't show

- Check if cart has items
- Verify items have `availableDeliveryTypes` in product details
- Check if product details are being fetched successfully

### Items not being removed

- Verify `removeItem` action in cart store works
- Check item IDs match between cart and affected items list

### Performance issues with large carts

- Ensure product details cache is working
- Consider pagination for affected items list
- Use React DevTools to check for unnecessary re-renders

## Notes

- The dialog uses **amber/orange** styling (not red/destructive) because it's informational, not an error
- Product details fetching is done with cache-first strategy for performance
- The implementation follows fail-open principle: unknown items are treated as valid
- All cart operations are synchronous after dialog confirmation
