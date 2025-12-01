# Cart Item Card - Usage Example

## Basic Usage

### Simple Cart Item List
```tsx
import { CartItemList } from "@/components/cart";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/lib/hooks/use-cart";

function CartPage() {
  const deviceId = "device-123";
  const storeId = "store-456";

  // Fetch cart items
  const { data: cart, isLoading } = useCart(deviceId, storeId);
  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    const item = cart?.items.find((i) => i._id === cartId);
    if (!item) return;

    await updateCartItem(cartId, {
      quantity: newQuantity,
      variantId: item.variantId,
      sessionId: deviceId,
      pricing: item.pricing,
    });
  };

  const handleRemoveItem = async (cartId: string) => {
    await removeCartItem(cartId, deviceId);
  };

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <CartItemList
      items={cart?.items || []}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemoveItem}
    />
  );
}
```

## Individual Cart Item Card

### Using CartItemCard Directly
```tsx
import { CartItemCard } from "@/components/cart";
import { CartResponse } from "@/types";

function SingleCartItem({ item }: { item: CartResponse }) {
  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    // Update cart item quantity
    console.log(`Updating ${cartId} to quantity ${newQuantity}`);
  };

  const handleRemove = async (cartId: string) => {
    // Remove cart item
    console.log(`Removing ${cartId}`);
  };

  const handleEditSuccess = () => {
    // Refresh cart or perform other actions
    console.log("Item edited successfully");
  };

  return (
    <CartItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
      onEditSuccess={handleEditSuccess}
    />
  );
}
```

## Data Flow Example

### Cart Item Data
```typescript
const cartItem: CartResponse = {
  _id: "cart-item-123",
  itemId: "product-456",        // Product ID - used to fetch product details
  variantId: "variant-789",     // Selected variant
  quantity: 2,
  pricing: [
    { id: "addon-001", quantity: 2 },  // Extra Cheese x2
    { id: "addon-002", quantity: 1 },  // Pepperoni x1
  ],
  sessionId: "device-123",
  categoryId: "cat-001",
  storeId: "store-456",
  userId: "user-789",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Product Details Fetched (Automatically)
```typescript
// CartItemCard internally calls:
const { data: productDetails } = useProductDetails("product-456");

// Returns:
{
  product: {
    _id: "product-456",
    name: "Margherita Pizza",
    photoList: ["https://example.com/pizza.jpg"],
    basePrice: 1000,  // £10.00 in pence
    // ...
  },
  variantList: [
    {
      _id: "variant-789",
      label: "Large",
      price: 1200,  // £12.00 in pence
      groupId: "size-group",
    },
    {
      _id: "variant-790",
      label: "Medium",
      price: 1000,
      groupId: "size-group",
    },
  ],
  addonList: [
    {
      _id: "addon-001",
      label: "Extra Cheese",
      price: 150,  // £1.50 in pence
      groupId: "toppings-group",
    },
    {
      _id: "addon-002",
      label: "Pepperoni",
      price: 200,  // £2.00 in pence
      groupId: "toppings-group",
    },
  ],
  // ...
}
```

### Rendered Output
```
┌─────────────────────────────────────────┐
│ [IMAGE]  Margherita Pizza      £38.00  │
│          [Large]                        │
│          Extra Cheese x2                │
│          Pepperoni x1                   │
│                                         │
│          [- 2 +]        [Edit] [Delete] │
└─────────────────────────────────────────┘
```

### Price Breakdown
```
Variant: Large Pizza = £12.00
Addons:
  - Extra Cheese x2 = £1.50 × 2 = £3.00
  - Pepperoni x1 = £2.00 × 1 = £2.00
Item Price = £12.00 + £3.00 + £2.00 = £17.00
Quantity = 2
Total = £17.00 × 2 = £34.00
```

## Advanced Usage

### With Edit Success Callback
```tsx
function CartWithRefresh() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: cart, refetch } = useCart(deviceId, storeId);

  const handleEditSuccess = () => {
    // Refetch cart items after edit
    refetch();

    // Or force a re-render
    setRefreshKey(prev => prev + 1);
  };

  return (
    <CartItemList
      key={refreshKey}
      items={cart?.items || []}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemoveItem}
      onEditSuccess={handleEditSuccess}
    />
  );
}
```

### With Custom Styling
```tsx
<CartItemList
  items={cartItems}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemoveItem}
  className="space-y-6 p-4 bg-muted/50 rounded-xl"
/>

{/* Or style individual cards */}
{cartItems.map((item) => (
  <CartItemCard
    key={item._id}
    item={item}
    onQuantityChange={handleQuantityChange}
    onRemove={handleRemoveItem}
    className="border-2 border-primary/20 shadow-lg"
  />
))}
```

### Loading State
The component handles loading internally:

```tsx
// No need to show external loading state
<CartItemList items={cartItems} {...props} />

// Each card shows its own skeleton while fetching product details
// Multiple cards with different products will load independently
```

### Error Handling
```tsx
function CartWithErrorHandling() {
  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    try {
      await updateCartItem(cartId, { quantity: newQuantity, ... });
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Quantity update error:", error);
    }
  };

  const handleRemove = async (cartId: string) => {
    try {
      await removeCartItem(cartId, deviceId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error("Remove error:", error);
    }
  };

  return (
    <CartItemList
      items={cartItems}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
    />
  );
}
```

## Empty State Handling

```tsx
function CartPage() {
  const { data: cart, isLoading } = useCart(deviceId, storeId);

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyCart
        onBrowseMenu={() => router.push("/menu")}
      />
    );
  }

  return (
    <div>
      <h1>Your Cart ({cart.items.length} items)</h1>
      <CartItemList
        items={cart.items}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemoveItem}
      />
    </div>
  );
}
```

## Integration with Cart Summary

```tsx
function CartWithSummary() {
  const { data: cart } = useCart(deviceId, storeId);
  const { summary, refetch: refetchSummary } = useCartSummary({
    storeId,
    deliveryType: "pickup",
  });

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    await updateCartItem(cartId, { quantity: newQuantity, ... });
    // Summary auto-refreshes via useCartSummary hook
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <CartItemList
          items={cart?.items || []}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveItem}
        />
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary
          summary={summary}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
```

## Performance Tips

1. **Memoize Handlers**: Wrap handlers in `useCallback` to prevent unnecessary re-renders
   ```tsx
   const handleQuantityChange = useCallback(async (cartId: string, newQuantity: number) => {
     await updateCartItem(cartId, { quantity: newQuantity, ... });
   }, [updateCartItem]);
   ```

2. **Batch Operations**: If updating multiple items, batch the requests
   ```tsx
   const handleBulkUpdate = async (updates: Array<{cartId: string, quantity: number}>) => {
     await Promise.all(
       updates.map(({ cartId, quantity }) =>
         handleQuantityChange(cartId, quantity)
       )
     );
   };
   ```

3. **Optimistic Updates**: Show changes immediately, revert on error
   ```tsx
   const [optimisticItems, setOptimisticItems] = useState(cartItems);

   const handleQuantityChange = async (cartId: string, newQuantity: number) => {
     // Update UI immediately
     setOptimisticItems(prev =>
       prev.map(item =>
         item._id === cartId ? { ...item, quantity: newQuantity } : item
       )
     );

     try {
       await updateCartItem(cartId, { quantity: newQuantity, ... });
     } catch (error) {
       // Revert on error
       setOptimisticItems(cartItems);
       toast.error("Update failed");
     }
   };
   ```

## Common Patterns

### Cart Item with Quantity Limits
```tsx
const MAX_QUANTITY = 10;

const handleQuantityChange = async (cartId: string, newQuantity: number) => {
  if (newQuantity > MAX_QUANTITY) {
    toast.error(`Maximum ${MAX_QUANTITY} items allowed`);
    return;
  }

  await updateCartItem(cartId, { quantity: newQuantity, ... });
};
```

### Cart Item with Stock Validation
```tsx
const handleQuantityChange = async (cartId: string, newQuantity: number) => {
  const item = cartItems.find(i => i._id === cartId);
  const product = await fetchProductDetails(item.itemId);

  if (newQuantity > product.stockQuantity) {
    toast.error(`Only ${product.stockQuantity} in stock`);
    return;
  }

  await updateCartItem(cartId, { quantity: newQuantity, ... });
};
```

### Cart Item with Confirmation
```tsx
const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

const handleRemove = async (cartId: string) => {
  setConfirmRemove(cartId);
};

const confirmRemoveAction = async () => {
  if (confirmRemove) {
    await removeCartItem(confirmRemove, deviceId);
    setConfirmRemove(null);
  }
};

// The CartItemCard already includes a confirmation dialog
// This is just an example of additional confirmation logic
```
