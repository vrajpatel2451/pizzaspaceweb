# Cart Edit - Usage Examples

## Basic Usage in CartItemCard

The simplest way to enable cart item editing:

```tsx
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";

<ProductDetailsContainer
  productId={item.itemId}
  editMode="edit"
  cartItem={item}
  onEditSuccess={handleRefresh}
  trigger={
    <Button variant="ghost" size="icon">
      <Edit2 className="size-4" />
    </Button>
  }
/>
```

## Complete Example with Cart Page

```tsx
"use client";

import { useState } from "react";
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { useCart } from "@/lib/hooks/use-cart";
import { useDeviceId } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";

export function CartPage() {
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();
  const { items, refetch } = useCart(deviceId, selectedStore?._id || "");

  const handleEditSuccess = async () => {
    // Refetch cart to show updated items
    await refetch();
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          item={item}
          onQuantityChange={async (cartId, quantity) => {
            // Handle quantity change
          }}
          onRemove={async (cartId) => {
            // Handle remove
          }}
          onEditSuccess={handleEditSuccess}
        />
      ))}
    </div>
  );
}
```

## Advanced: Custom Edit Trigger

Create a custom trigger with your own styling:

```tsx
<ProductDetailsContainer
  productId={item.itemId}
  editMode="edit"
  cartItem={item}
  mode="eager"
  onEditSuccess={() => {
    console.log("Item updated!");
    refetchCart();
    toast.success("Cart updated successfully");
  }}
  trigger={
    <div className="group relative">
      <button className="rounded-lg border-2 border-dashed border-muted-foreground/20 px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5">
        <div className="flex items-center gap-2">
          <Settings className="size-4" />
          <span>Customize</span>
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  }
/>
```

## Example: Inline Edit in Order History

```tsx
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";

export function OrderHistoryItem({ orderItem }) {
  const handleReorder = async () => {
    // Reorder logic after customization
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <h3>{orderItem.name}</h3>
        <p className="text-sm text-muted-foreground">
          {orderItem.variant} • {orderItem.addons.join(", ")}
        </p>
      </div>

      <ProductDetailsContainer
        productId={orderItem.productId}
        editMode="add"  // Use 'add' mode for reordering
        cartItem={orderItem}  // Pre-fill with previous selections
        onAddToCart={handleReorder}
        trigger={
          <Button variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Reorder
          </Button>
        }
      />
    </div>
  );
}
```

## Example: Quick Edit (Quantity Only)

For a simplified edit that focuses on quantity:

```tsx
<ProductDetailsContainer
  productId={item.itemId}
  editMode="edit"
  cartItem={item}
  mode="eager"
  onEditSuccess={refetch}
  trigger={
    <Badge
      variant="secondary"
      className="cursor-pointer hover:bg-secondary/80"
    >
      {item.quantity}x
    </Badge>
  }
/>
```

## Testing the Edit Flow

### Manual Testing Steps

1. **Open Cart Page**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000/cart
   ```

2. **Click Edit on Any Item**
   - Modal should open with current selections
   - Variant should be pre-selected
   - Addons should be checked with correct quantities
   - Quantity should match cart item

3. **Modify Selections**
   - Change variant → price updates
   - Toggle addons → price updates
   - Change quantity → total updates
   - Button shows "Update cart - £X.XX"

4. **Save Changes**
   - Click "Update cart" button
   - Loading state shows "Updating..."
   - Success toast appears
   - Modal closes automatically
   - Cart refreshes with updated item

5. **Verify Update**
   - Cart item reflects new selections
   - Pricing is correct
   - Quantity updated

### Automated Testing

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";

describe("Cart Item Edit", () => {
  it("should open edit modal with pre-filled selections", async () => {
    const mockItem = {
      _id: "cart-1",
      itemId: "product-1",
      variantId: "variant-1",
      quantity: 2,
      pricing: [
        { id: "pricing-addon-1", quantity: 1 },
      ],
      // ... other fields
    };

    const { getByLabelText } = render(
      <CartItemCard
        item={mockItem}
        onQuantityChange={jest.fn()}
        onRemove={jest.fn()}
      />
    );

    // Click edit button
    fireEvent.click(getByLabelText("Edit item"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText("Update cart")).toBeInTheDocument();
    });

    // Verify pre-selections
    expect(screen.getByRole("radio", { checked: true })).toHaveValue("variant-1");
    expect(screen.getByRole("checkbox", { checked: true })).toBeInTheDocument();
  });

  it("should call onEditSuccess after successful update", async () => {
    const mockOnEditSuccess = jest.fn();

    const { getByLabelText, getByText } = render(
      <ProductDetailsContainer
        productId="product-1"
        editMode="edit"
        cartItem={mockItem}
        onEditSuccess={mockOnEditSuccess}
        trigger={<button aria-label="Edit">Edit</button>}
      />
    );

    fireEvent.click(getByLabelText("Edit"));

    await waitFor(() => {
      expect(screen.getByText("Update cart")).toBeInTheDocument();
    });

    fireEvent.click(getByText("Update cart"));

    await waitFor(() => {
      expect(mockOnEditSuccess).toHaveBeenCalled();
    });
  });
});
```

## Troubleshooting

### Issue: Selections Not Pre-populated

**Cause:** Product details not loaded or data structure mismatch.

**Solution:**
```tsx
// Use mode="eager" to load immediately
<ProductDetailsContainer
  mode="eager"  // Add this
  editMode="edit"
  cartItem={item}
  // ...
/>
```

### Issue: Wrong Addons Selected

**Cause:** Using pricing ID instead of addon ID.

**Check:** Ensure cart response has correct structure:
```typescript
{
  pricing: [
    { id: "pricing-id-123", quantity: 1 }  // This is pricing ID
  ]
}
```

**Solution:** The component automatically maps pricing ID → addon ID. Verify your pricing data has `addonId` field.

### Issue: Update API Not Called

**Cause:** `editMode` not set or `cartItem` missing.

**Solution:**
```tsx
// Both are required
editMode="edit"  // Must be "edit"
cartItem={item}  // Must be CartResponse object
```

### Issue: Modal Doesn't Close After Update

**Cause:** Update API returned error or `onEditSuccess` not triggering refetch.

**Solution:**
```tsx
onEditSuccess={async () => {
  await refetch();  // Ensure refetch completes
}}
```

## Performance Tips

### 1. Use Eager Mode for Edit
```tsx
mode="eager"  // Loads data immediately, better for edit
```

### 2. Memoize Callbacks
```tsx
const handleEditSuccess = useCallback(async () => {
  await refetch();
}, [refetch]);

<ProductDetailsContainer
  onEditSuccess={handleEditSuccess}
  // ...
/>
```

### 3. Optimistic Updates
```tsx
const handleEditSuccess = async () => {
  // Update UI optimistically
  updateLocalState(newData);

  // Then refetch for consistency
  await refetch();
};
```

## Accessibility

The edit flow is fully accessible:

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA labels
- ✅ Touch targets (44px minimum)

### Screen Reader Experience

1. "Edit item button"
2. Dialog opens: "Product Details dialog. Customize your product..."
3. "Variant group: Size. Required."
4. "Small, radio button, checked"
5. "Addon group: Toppings. Select up to 3."
6. "Extra Cheese, checkbox, checked"
7. "Update cart - £12.99, button"

## Migration from EditCartItemModal

### Before (Old Approach)
```tsx
import { EditCartItemModal } from "./edit-cart-item-modal";

<EditCartItemModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  item={item}
  onSuccess={() => {
    setShowEditModal(false);
    onEditSuccess?.();
  }}
/>
```

### After (New Approach)
```tsx
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";

<ProductDetailsContainer
  productId={item.itemId}
  editMode="edit"
  cartItem={item}
  onEditSuccess={onEditSuccess}
  trigger={<Button>Edit</Button>}
/>
```

**Benefits:**
- No modal state management needed
- Automatic modal open/close
- Consistent with add-to-cart UX
- Less code

## Next Steps

1. Delete `EditCartItemModal` component (no longer needed)
2. Update any other edit flows to use `ProductDetailsContainer`
3. Add tests for edit functionality
4. Consider adding "Duplicate" mode for quick reordering
