# Cart Components - Usage Examples

## Complete Component Reference with Examples

### 1. QuantityControl

**Basic Usage**
```tsx
import { QuantityControl } from "@/components/cart";

function ProductCard() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = async (newQuantity: number) => {
    setQuantity(newQuantity);
    await updateProductQuantity(newQuantity);
  };

  return (
    <QuantityControl
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
    />
  );
}
```

**With Custom Min/Max**
```tsx
<QuantityControl
  quantity={5}
  onQuantityChange={handleChange}
  min={2}
  max={50}
  className="border-2 border-primary"
/>
```

**Disabled State**
```tsx
<QuantityControl
  quantity={1}
  onQuantityChange={handleChange}
  disabled={outOfStock}
/>
```

---

### 2. CartItemCard

**Basic Usage**
```tsx
import { CartItemCard } from "@/components/cart";

function CartView() {
  const cartItem = {
    _id: "cart-123",
    itemId: "product-456",
    quantity: 2,
    variantId: "variant-789",
    // ... other cart fields
  };

  const itemDetails = {
    name: "Margherita Pizza",
    image: "uploads/pizzas/margherita.jpg",
    variantName: "Large",
    price: 12.99,
  };

  return (
    <CartItemCard
      item={cartItem}
      itemDetails={itemDetails}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
      onEdit={handleEdit}
    />
  );
}
```

**Without Edit Button**
```tsx
<CartItemCard
  item={cartItem}
  itemDetails={itemDetails}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemove}
  // No onEdit prop = no edit button
/>
```

**Custom Styling**
```tsx
<CartItemCard
  item={cartItem}
  itemDetails={itemDetails}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemove}
  className="bg-accent/20 border-2 border-primary"
/>
```

---

### 3. CartItemList

**Complete Example**
```tsx
import { CartItemList } from "@/components/cart";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const itemDetailsMap = {
    "product-1": {
      name: "Pepperoni Pizza",
      image: "uploads/pizzas/pepperoni.jpg",
      variantName: "Medium",
      price: 14.99,
    },
    "product-2": {
      name: "Garlic Bread",
      image: "uploads/sides/garlic-bread.jpg",
      price: 4.99,
    },
  };

  return (
    <CartItemList
      items={cartItems}
      itemDetailsMap={itemDetailsMap}
      loading={loading}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
      onEdit={handleEdit}
    />
  );
}
```

**With Custom Container Styling**
```tsx
<CartItemList
  items={cartItems}
  itemDetailsMap={itemDetailsMap}
  onQuantityChange={handleQuantityChange}
  onRemove={handleRemove}
  className="space-y-2 max-h-96 overflow-y-auto"
/>
```

---

### 4. DeliveryTypeSelector

**Basic Usage**
```tsx
import { DeliveryTypeSelector } from "@/components/cart";
import { OrderDeliveryType } from "@/types";

function CheckoutForm() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("pickup");

  return (
    <DeliveryTypeSelector
      value={deliveryType}
      onChange={setDeliveryType}
    />
  );
}
```

**With Side Effects**
```tsx
function OrderOptions() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("pickup");

  const handleDeliveryTypeChange = (type: OrderDeliveryType) => {
    setDeliveryType(type);

    // Clear address if not delivery
    if (type !== "delivery") {
      setSelectedAddress(null);
    }

    // Fetch delivery charges
    if (type === "delivery") {
      fetchDeliveryCharges();
    }

    // Analytics
    trackEvent("delivery_type_changed", { type });
  };

  return (
    <DeliveryTypeSelector
      value={deliveryType}
      onChange={handleDeliveryTypeChange}
    />
  );
}
```

**Disabled During Checkout**
```tsx
<DeliveryTypeSelector
  value={deliveryType}
  onChange={setDeliveryType}
  disabled={isProcessingOrder}
  className="opacity-50"
/>
```

---

### 5. AddressSelector

**Complete Example**
```tsx
import { AddressSelector } from "@/components/cart";

function DeliveryAddressForm() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const response = await getAddresses();
    if (response.statusCode === 200) {
      setAddresses(response.data);

      // Auto-select default
      const defaultAddr = response.data.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      }
    }
    setLoading(false);
  };

  const handleAddNewAddress = () => {
    router.push("/profile?tab=addresses&action=add");
  };

  return (
    <AddressSelector
      addresses={addresses}
      selectedAddressId={selectedAddressId}
      onAddressSelect={setSelectedAddressId}
      onAddNewAddress={handleAddNewAddress}
      loading={loading}
    />
  );
}
```

**In a Modal**
```tsx
function AddressSelectionModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Delivery Address</DialogTitle>
        </DialogHeader>
        <AddressSelector
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onAddressSelect={(id) => {
            setSelectedAddressId(id);
            onClose();
          }}
          onAddNewAddress={() => {
            onClose();
            router.push("/addresses/new");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

### 6. OrderSummary

**Complete Example**
```tsx
import { OrderSummary } from "@/components/cart";

function CartSidebar() {
  const [summary, setSummary] = useState<CustomerBillingOnCart | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (!summary) return;

    // Validate cart
    if (deliveryType === "delivery" && !selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Navigate to checkout
    router.push("/checkout");
  };

  return (
    <div className="lg:sticky lg:top-24">
      <OrderSummary
        summary={summary}
        loading={loading}
        onCheckout={handleCheckout}
        checkoutDisabled={cartItems.length === 0}
      />
    </div>
  );
}
```

**In Checkout Page**
```tsx
function CheckoutPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment form */}
      <div className="lg:col-span-2">
        <PaymentForm />
      </div>

      {/* Order Summary */}
      <div>
        <OrderSummary
          summary={orderSummary}
          loading={isCalculating}
          onCheckout={processPayment}
          checkoutDisabled={!isFormValid}
          className="border-2 border-primary"
        />
      </div>
    </div>
  );
}
```

**With Custom Checkout Button**
```tsx
function CustomCheckout() {
  return (
    <OrderSummary
      summary={summary}
      loading={loading}
      onCheckout={() => {
        // Custom checkout logic
        validateCart();
        applyLoyaltyPoints();
        processOrder();
      }}
      checkoutDisabled={
        !isAddressValid ||
        !isPaymentMethodSelected ||
        isProcessing
      }
    />
  );
}
```

---

### 7. EmptyCart

**Basic Usage**
```tsx
import { EmptyCart } from "@/components/cart";
import { useRouter } from "next/navigation";

function CartView() {
  const router = useRouter();
  const cartItems = [];

  if (cartItems.length === 0) {
    return (
      <EmptyCart onBrowseMenu={() => router.push("/menu")} />
    );
  }

  return <CartItemList items={cartItems} />;
}
```

**With Analytics**
```tsx
<EmptyCart
  onBrowseMenu={() => {
    trackEvent("empty_cart_browse_menu_clicked");
    router.push("/menu?utm_source=empty_cart");
  }}
/>
```

**In a Modal**
```tsx
function MiniCartDrawer() {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        {cartItems.length === 0 ? (
          <EmptyCart
            onBrowseMenu={() => {
              setIsOpen(false);
              router.push("/menu");
            }}
            className="py-8"
          />
        ) : (
          <CartItemList items={cartItems} />
        )}
      </DrawerContent>
    </Drawer>
  );
}
```

---

## Advanced Patterns

### Pattern 1: Mini Cart with Summary

```tsx
function MiniCartDropdown() {
  return (
    <div className="w-96 max-h-[600px] flex flex-col">
      {/* Scrollable Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <CartItemList
          items={cartItems}
          itemDetailsMap={itemDetailsMap}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
          className="space-y-2"
        />
      </div>

      {/* Fixed Summary at Bottom */}
      <div className="border-t p-4 bg-background">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={() => router.push("/cart")}
          className="w-full"
        >
          View Full Cart
        </Button>
      </div>
    </div>
  );
}
```

### Pattern 2: Progressive Checkout Flow

```tsx
function ProgressiveCheckout() {
  const [step, setStep] = useState(1);

  return (
    <div>
      {/* Step 1: Review Cart */}
      {step === 1 && (
        <div>
          <CartItemList
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
          <Button onClick={() => setStep(2)}>
            Continue to Delivery
          </Button>
        </div>
      )}

      {/* Step 2: Delivery Options */}
      {step === 2 && (
        <div>
          <DeliveryTypeSelector
            value={deliveryType}
            onChange={setDeliveryType}
          />
          {deliveryType === "delivery" && (
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
              onAddNewAddress={handleAddNewAddress}
            />
          )}
          <Button onClick={() => setStep(3)}>
            Continue to Payment
          </Button>
        </div>
      )}

      {/* Step 3: Payment & Summary */}
      {step === 3 && (
        <div className="grid grid-cols-2 gap-8">
          <PaymentForm />
          <OrderSummary
            summary={summary}
            onCheckout={processOrder}
          />
        </div>
      )}
    </div>
  );
}
```

### Pattern 3: Real-time Cart Updates

```tsx
function RealtimeCart() {
  const [cartItems, setCartItems] = useState<CartResponse[]>([]);
  const [summary, setSummary] = useState<CustomerBillingOnCart | null>(null);

  // Debounced summary fetch
  const debouncedFetchSummary = useMemo(
    () => debounce(fetchSummary, 500),
    []
  );

  // Auto-fetch summary on cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      debouncedFetchSummary();
    }

    return () => debouncedFetchSummary.cancel();
  }, [cartItems, deliveryType, selectedAddressId]);

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    // Optimistic update
    setCartItems(items =>
      items.map(i =>
        i._id === cartId ? { ...i, quantity: newQuantity } : i
      )
    );

    try {
      // Sync with server
      await updateCart(cartId, { quantity: newQuantity });

      // Refresh from server
      await fetchCart();
    } catch (error) {
      // Revert on error
      toast.error("Failed to update quantity");
      await fetchCart();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <CartItemList
          items={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />
      </div>
      <div>
        <OrderSummary
          summary={summary}
          loading={isFetchingSummary}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
```

### Pattern 4: Multi-step Address Flow

```tsx
function DeliveryStep() {
  const [showAddressForm, setShowAddressForm] = useState(false);

  return (
    <div>
      <DeliveryTypeSelector
        value={deliveryType}
        onChange={setDeliveryType}
      />

      {deliveryType === "delivery" && (
        <>
          {showAddressForm ? (
            <AddressForm
              onSave={async (address) => {
                await saveAddress(address);
                await fetchAddresses();
                setShowAddressForm(false);
              }}
              onCancel={() => setShowAddressForm(false)}
            />
          ) : (
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
              onAddNewAddress={() => setShowAddressForm(true)}
            />
          )}
        </>
      )}
    </div>
  );
}
```

---

## Integration Examples

### With React Query

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";

function CartPageWithReactQuery() {
  // Fetch cart
  const { data: cartItems, refetch } = useQuery({
    queryKey: ["cart", deviceId, storeId],
    queryFn: () => getCart(deviceId, storeId),
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartId, quantity }: any) =>
      updateCart(cartId, { quantity }),
    onSuccess: () => {
      refetch();
      toast.success("Quantity updated");
    },
  });

  return (
    <CartItemList
      items={cartItems?.data || []}
      onQuantityChange={(cartId, quantity) =>
        updateQuantityMutation.mutate({ cartId, quantity })
      }
      onRemove={handleRemove}
    />
  );
}
```

### With Zustand

```tsx
import { useCartStore } from "@/store/cart";

function CartPageWithZustand() {
  const {
    items,
    deliveryType,
    selectedAddressId,
    updateQuantity,
    removeItem,
    setDeliveryType,
    setSelectedAddress,
  } = useCartStore();

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <CartItemList
          items={items}
          onQuantityChange={updateQuantity}
          onRemove={removeItem}
        />

        <DeliveryTypeSelector
          value={deliveryType}
          onChange={setDeliveryType}
        />

        {deliveryType === "delivery" && (
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={setSelectedAddress}
            onAddNewAddress={() => router.push("/addresses/new")}
          />
        )}
      </div>

      <OrderSummary
        summary={summary}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
```

---

## Styling Customization

### Custom Color Themes

```tsx
// Primary brand color
<QuantityControl
  quantity={qty}
  onQuantityChange={handleChange}
  className="border-brand-500 [&_button]:text-brand-600"
/>

// Dark mode specific
<CartItemCard
  item={item}
  onQuantityChange={handleChange}
  onRemove={handleRemove}
  className="dark:border-gray-700 dark:bg-gray-800"
/>
```

### Size Variants

```tsx
// Compact cart for mobile
<CartItemList
  items={items}
  onQuantityChange={handleChange}
  onRemove={handleRemove}
  className="space-y-2 [&_>_*]:p-2 [&_img]:h-16 [&_img]:w-16"
/>

// Large cart for desktop
<CartItemList
  items={items}
  onQuantityChange={handleChange}
  onRemove={handleRemove}
  className="space-y-4 [&_>_*]:p-6 [&_img]:h-32 [&_img]:w-32"
/>
```

---

## Testing Examples

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItemCard } from "@/components/cart";

describe("CartItemCard", () => {
  it("calls onQuantityChange when quantity is increased", async () => {
    const mockOnQuantityChange = jest.fn();

    render(
      <CartItemCard
        item={mockCartItem}
        itemDetails={mockItemDetails}
        onQuantityChange={mockOnQuantityChange}
        onRemove={jest.fn()}
      />
    );

    const plusButton = screen.getByLabelText("Increase quantity");
    fireEvent.click(plusButton);

    expect(mockOnQuantityChange).toHaveBeenCalledWith(
      mockCartItem._id,
      mockCartItem.quantity + 1
    );
  });
});
```
