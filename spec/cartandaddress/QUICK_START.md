# Cart Feature - Quick Start Guide

## 🚀 Getting Started

### 1. Navigate to Cart Page
```
http://localhost:3000/cart
```

### 2. Required Setup

#### Device ID (Session Management)
The cart uses a device ID stored in localStorage:
```javascript
// Automatically generated in page.tsx
localStorage.getItem('deviceId') || generates new one
```

#### Store ID
```javascript
// Set this when user selects a store
localStorage.setItem('selectedStoreId', 'store-123');
```

## 📦 Components Usage

### Using Cart Components in Other Pages

```typescript
import {
  CartItemList,
  QuantityControl,
  OrderSummary,
  EmptyCart,
  DeliveryTypeSelector,
  AddressSelector
} from "@/components/cart";
```

### Example: Mini Cart in Header
```tsx
import { CartItemList } from "@/components/cart";

function MiniCart({ items }) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <CartItemList
        items={items}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        itemDetailsMap={itemDetails}
      />
    </div>
  );
}
```

### Example: Checkout Page Summary
```tsx
import { OrderSummary } from "@/components/cart";

function CheckoutPage() {
  return (
    <OrderSummary
      summary={billingData}
      loading={isLoading}
      onCheckout={processPayment}
      checkoutDisabled={!isValid}
    />
  );
}
```

## 🔧 API Integration

### Fetching Cart Items
```typescript
import { getCart } from "@/lib/api/cart";

const response = await getCart(deviceId, storeId);
if (response.statusCode === 200) {
  setCartItems(response.data);
}
```

### Updating Quantity
```typescript
import { updateCart } from "@/lib/api/cart";

await updateCart(cartId, {
  quantity: newQuantity,
  variantId: item.variantId,
  sessionId: deviceId,
  pricing: item.pricing,
});
```

### Removing Items
```typescript
import { removeFromCart } from "@/lib/api/cart";

await removeFromCart(cartId, deviceId);
```

### Getting Summary
```typescript
import { getCartSummary } from "@/lib/api/cart";

const response = await getCartSummary({
  cartIds: cartItems.map(i => i._id),
  storeId,
  deliveryType: "delivery",
  addressId: selectedAddressId,
  discountIds: ["discount-123"], // optional
});
```

### Fetching Addresses
```typescript
import { getAddresses } from "@/lib/api/address";

const response = await getAddresses();
if (response.statusCode === 200) {
  setAddresses(response.data);
}
```

## 🎨 Styling & Customization

### Using with Custom Styles
```tsx
<CartItemList
  items={items}
  className="space-y-2"
  onQuantityChange={handleChange}
  onRemove={handleRemove}
/>
```

### Sticky Summary on Desktop
```tsx
<div className="lg:sticky lg:top-24">
  <OrderSummary
    summary={summary}
    onCheckout={handleCheckout}
  />
</div>
```

## 🧪 Testing the Cart

### 1. Test Empty State
- Navigate to /cart with no items
- Should see empty cart illustration
- Click "Browse Menu" should go to /menu

### 2. Test Cart Items
- Add items to cart from menu
- Navigate to /cart
- Should see all items listed
- Test quantity controls (+/-)
- Test remove button with confirmation

### 3. Test Delivery Types
- Switch between Dine In, Pickup, Delivery
- Delivery should show address selector
- Summary should update with delivery charges

### 4. Test Address Selection
- Select delivery type
- Should fetch addresses
- Select different addresses
- Summary should update

### 5. Test Summary Updates
- Change quantity -> summary updates
- Change delivery type -> summary updates
- Select address -> summary updates
- All changes should reflect in real-time

## 🔒 Protected Route

The cart page is under `app/(protected)/cart/` which means it requires authentication.

### Middleware Check
Make sure your middleware redirects unauthenticated users:
```typescript
// middleware.ts
if (!token && pathname.startsWith('/cart')) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

## 📱 Mobile Responsive

### Breakpoints Used
- **Mobile**: Stacked layout
- **Desktop (lg)**: Two-column layout with sticky summary

### Testing Mobile
```bash
# Use Chrome DevTools
# Toggle device toolbar
# Test at: 375px, 768px, 1024px, 1440px
```

## 🐛 Common Issues & Solutions

### Issue: Cart items not loading
**Solution:** Check deviceId and storeId in localStorage
```javascript
console.log('deviceId:', localStorage.getItem('deviceId'));
console.log('storeId:', localStorage.getItem('selectedStoreId'));
```

### Issue: Summary not updating
**Solution:** Check that all dependencies are passed to useEffect
```typescript
useEffect(() => {
  fetchSummary();
}, [cartItems, deliveryType, selectedAddressId, fetchSummary]);
```

### Issue: Address selector not showing
**Solution:** Make sure deliveryType is "delivery"
```typescript
{deliveryType === "delivery" && <AddressSelector ... />}
```

### Issue: Checkout button always disabled
**Solution:** Check conditions
```typescript
checkoutDisabled={
  deliveryType === "delivery" && !selectedAddressId
}
```

## 🚦 State Management Flow

```
1. Page Load
   ↓
2. Fetch Cart Items (deviceId + storeId)
   ↓
3. If items exist → Fetch Summary
   ↓
4. User Changes (quantity, delivery, address)
   ↓
5. Update Cart API → Fetch Cart → Fetch Summary
   ↓
6. UI Updates with new data
```

## 📋 TODO: Replace Placeholders

### 1. Item Details
Currently using mock data. Replace with real API:
```typescript
// Replace this in page.tsx
const itemDetailsMap = cartItems.reduce((acc, item) => {
  acc[item.itemId] = {
    name: `Product ${item.itemId}`, // ← Fetch from products API
    image: "", // ← Get product image
    variantName: item.variantId ? `Variant ${item.variantId}` : undefined,
    price: 12.99, // ← Get from pricing API
  };
  return acc;
}, {});
```

### 2. Discount Section
Implement discount code application:
```typescript
const [discountCode, setDiscountCode] = useState("");
const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);

const handleApplyDiscount = async () => {
  // Call discount validation API
  // Add to appliedDiscounts
  // Refresh summary with discountIds
};
```

### 3. Global State
Replace localStorage with proper state management:
```typescript
// Use Zustand or Redux
import { useStore } from "@/store";

const { deviceId, storeId } = useStore();
```

### 4. Edit Product
Implement product customization modal:
```typescript
const handleEditItem = (cartId: string) => {
  // Open product modal with current cart item data
  // Allow user to modify toppings, variants, etc.
  // Update cart on save
};
```

## 📊 Performance Optimization

### 1. Memoization
```typescript
const itemDetailsMap = useMemo(() => {
  return cartItems.reduce((acc, item) => {
    // ... calculation
  }, {});
}, [cartItems]);
```

### 2. Debounce Summary Calls
```typescript
import { debounce } from "lodash";

const debouncedFetchSummary = useMemo(
  () => debounce(fetchSummary, 500),
  [fetchSummary]
);
```

### 3. Optimistic Updates
```typescript
const handleQuantityChange = async (cartId, newQuantity) => {
  // Update UI immediately
  setCartItems(items =>
    items.map(i => i._id === cartId ? {...i, quantity: newQuantity} : i)
  );

  // Then sync with server
  await updateCart(cartId, { quantity: newQuantity });
};
```

## 🎯 Next Steps

1. ✅ Components created
2. ✅ Cart page implemented
3. ✅ API integration done
4. ⏳ Replace item details with real data
5. ⏳ Implement discount feature
6. ⏳ Add product edit modal
7. ⏳ Build checkout flow
8. ⏳ Add analytics tracking
9. ⏳ Write unit tests
10. ⏳ Conduct user testing

## 📚 Related Documentation

- Main Spec: `/spec/cart_spec.md`
- Implementation Details: `/spec/cartandaddress/SPRINT_2_IMPLEMENTATION.md`
- API Types: `/types/cart.ts`
- API Functions: `/lib/api/cart.ts`
- Address Types: `/types/address.ts`
- Address API: `/lib/api/address.ts`

## 🆘 Need Help?

Check the implementation details document for:
- Full component props documentation
- API response types
- State management flow
- Design guidelines
- Testing checklist
