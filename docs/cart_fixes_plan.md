# Cart & Address Fixes Implementation Plan

**Created:** 2025-12-02
**Status:** Ready for Implementation
**Estimated Total Effort:** 5-7 days

---

## Executive Summary

This document outlines a comprehensive plan to fix all cart and address-related issues identified in `spec/cart_fixes.md`. The fixes are organized into 4 phases based on dependencies, with specific agent assignments and testing requirements for each task.

---

## Phase 1: Critical Infrastructure & Header Fixes (Day 1)

These fixes have no dependencies and unlock other work.

### 1.1.1 Remove Cart Dropdown - Direct Navigation to Cart Page

**Priority:** High
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/layout/header/index.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/layout/header/header-client.tsx`

**Current State:**
- `MiniCartDropdown` component exists at `components/layout/header/mini-cart-dropdown.tsx`
- Uses Popover to show cart preview on click

**Implementation:**
1. Remove `MiniCartDropdown` import and usage from header
2. Use `CartBadge` component directly with `asButton={false}` (already has Link to `/cart`)
3. Delete or deprecate `mini-cart-dropdown.tsx` file

**Testing:**
- [ ] Click cart icon navigates directly to `/cart` page
- [ ] No dropdown appears on hover or click
- [ ] Cart badge count still updates correctly

---

### 1.2.2 Fix Cart Badge Not Updating on Add/Update

**Priority:** High
**Agent:** `nextjs-forms-expert`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/hooks/use-cart.ts`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/store/cart-store.ts`

**Current State:**
- `useAddToCart` calls `addItem` which should update store
- `useCartCount` selector exists and should react to changes
- Issue: Cart not being refetched after add, or store hydration issue

**Implementation:**
1. Verify `addItem` properly triggers re-render via Zustand
2. Ensure `useCartCount` uses proper shallow comparison
3. Add console logs to debug state flow
4. Consider adding a `forceRefresh` mechanism after cart mutations
5. Ensure `setHydrated(true)` is called properly on mount

**Testing:**
- [ ] Add item to cart - badge count increments immediately
- [ ] Update item quantity - badge count reflects change
- [ ] Remove item - badge count decrements
- [ ] Page refresh maintains correct count

---

### 1.2.1 Fix storeId "default-store" in Summary API

**Priority:** High
**Agent:** `nextjs-forms-expert`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`

**Current State:**
```typescript
const [storeId] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedStoreId") || "default-store";
  }
  return "default-store";
});
```

**Implementation:**
1. Import and use `useStore` hook from `@/lib/contexts/store-context`
2. Get `selectedStore._id` from context instead of localStorage directly
3. Show error state if no store selected
4. Prevent summary API call if storeId is missing

```typescript
const { selectedStore } = useStore();
const storeId = selectedStore?._id;

// Guard against missing store
if (!storeId) {
  return <NoStoreSelectedState />;
}
```

**Testing:**
- [ ] Summary API receives actual store ID (not "default-store")
- [ ] Error state shown when no store selected
- [ ] Selecting store updates summary

---

### 1.2.3 Show Toast When Store Not Selected

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-container.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/menu-section/quick-add-button.tsx`

**Current State:**
- `ProductDetailsContainer` already shows toast: `toast.error("Please select a store first")`
- Need to verify `quick-add-button` has same behavior

**Implementation:**
1. Audit all add-to-cart entry points
2. Ensure consistent toast message across all
3. Add visual indication that store selection is required
4. Consider: redirect to store selector or show modal

**Testing:**
- [ ] Click add to cart without store - shows toast "Please select a store first"
- [ ] Quick add button without store - shows same toast
- [ ] No API call made when store not selected

---

## Phase 2: Cart UI Redesign (Days 2-3)

### 1.3.1 Cart Page Header - Match Menu Section Style

**Priority:** High
**Agent:** `premium-ux-designer` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`

**Reference Component:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/menu-section/index.tsx`

**Current State:**
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
  <p className="text-muted-foreground">...</p>
</div>
```

**Implementation:**
1. Create `CartSectionHeader` component matching `SectionHeader` pattern:
   - Badge: "Your Cart" or "Shopping Cart"
   - Headline with decorative underline
   - Subheadline with item count
   - Decorative elements (dots, lines)
2. Apply same background decorative blobs as menu section
3. Ensure responsive typography

**Design Pattern from Menu Section:**
```tsx
<SectionBadge>Your Cart</SectionBadge>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  Review Your <span className="text-orange-500 relative">Order</span>
</h2>
<p className="text-slate-600 dark:text-slate-400">...</p>
```

**Testing:**
- [ ] Header matches menu section visual style
- [ ] Badge, headline, decorative elements present
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode compatible

---

### 1.2.1 Cart Item Card - Fetch & Display Product Details

**Priority:** High
**Agent:** `nextjs-component-architect` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-list.tsx`

**Current State:**
- Card receives `itemDetails` as prop with mock data
- Page creates mock `itemDetailsMap` from cart items
- No actual product fetch happening

**Implementation:**
1. Create `useCartItemDetails` hook to fetch product details by ID
2. In `CartItemCard`, use `useProductDetails` hook with `item.itemId`
3. Display fetched data:
   - Product photo (from `product.photoList[0]`)
   - Product name
   - Selected variant (from `variantList` matching `item.variantId`)
   - Selected addons (from `item.pricing` + `addonList`)
   - Quantity counter (use existing `QuantityIncrementor`)
   - Delete button
   - Edit pen button
4. Add loading shimmer while fetching

**Data Mapping:**
```typescript
// From cart item
item.itemId -> fetch product details
item.variantId -> find in variantList
item.pricing -> map addon IDs to addonList

// Display
- Photo: productDetails.product.photoList[0]
- Name: productDetails.product.name
- Variant: variantList.find(v => v._id === item.variantId).label
- Addons: item.pricing.filter(p => p.type === 'addon').map(...)
```

**Testing:**
- [ ] Product image loads correctly
- [ ] Product name displayed
- [ ] Selected variant shown
- [ ] Selected addons with quantities shown
- [ ] Loading shimmer during fetch
- [ ] Error state if fetch fails

---

### 1.3.9 Use QuantityIncrementor in Cart Item Card

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`

**Current State:**
- Uses custom `QuantityControl` component
- `QuantityIncrementor` exists at `components/composite/quantity-incrementor.tsx`

**Implementation:**
1. Replace `QuantityControl` with `QuantityIncrementor`
2. Map props correctly:
   - `quantity` -> `value`
   - `onQuantityChange` -> `onChange`
   - Add `size="sm"` for compact display
3. Delete `QuantityControl` if not used elsewhere

```tsx
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";

<QuantityIncrementor
  value={item.quantity}
  onChange={handleQuantityChange}
  min={1}
  max={99}
  size="sm"
/>
```

**Testing:**
- [ ] Quantity increments/decrements correctly
- [ ] API call triggered on change
- [ ] Loading state during update
- [ ] Min/max limits enforced

---

### 1.3.6 Use ProductDetailsContainer for Edit Cart

**Priority:** High
**Agent:** `nextjs-component-architect`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/edit-cart-item-modal.tsx` (deprecate)

**Current State:**
- Custom `EditCartItemModal` exists with duplicate logic
- `ProductDetailsContainer` already has all needed functionality

**Implementation:**
1. Extend `ProductDetailsContainer` to support "edit mode":
   - Add `mode: 'add' | 'edit'` prop
   - Add `cartItem?: CartResponse` prop for edit mode
   - Pre-populate selections from cart item
   - Change button text to "Update Cart" in edit mode
   - Call update API instead of add API
2. In `CartItemCard`, use `ProductDetailsContainer` with edit mode:
   ```tsx
   <ProductDetailsContainer
     productId={item.itemId}
     mode="edit"
     cartItem={item}
     trigger={<Button><Edit2 /></Button>}
     onEditSuccess={onEditSuccess}
   />
   ```
3. Deprecate/delete `EditCartItemModal`

**Testing:**
- [ ] Edit button opens ProductDetails dialog/bottomsheet
- [ ] Current selections pre-populated
- [ ] Update changes the cart item (not adds new)
- [ ] Toast on success/error
- [ ] Dialog closes on success

---

### 1.3.4 Delivery Type Selector UI Improvement

**Priority:** Medium
**Agent:** `premium-ux-designer` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/delivery-type-selector.tsx`

**Reference Screenshot:** `spec/cartandaddress/deliveryfeesummary.png`

**Current State:**
- Basic tabs implementation
- Lacks visual polish and clear selection state

**Implementation:**
1. Redesign to match reference screenshot style:
   - Card-based selection (not tabs)
   - Clear active state with primary color border
   - Icons prominently displayed
   - Description text below label
2. Add visual feedback on selection
3. Consider radio-button style with custom cards:
   ```tsx
   <div className="grid grid-cols-3 gap-4">
     {deliveryTypes.map(type => (
       <button
         className={cn(
           "p-4 rounded-xl border-2 transition-all",
           value === type.value
             ? "border-primary bg-primary/5"
             : "border-input hover:border-primary/50"
         )}
       >
         <type.icon className="size-8 mb-2" />
         <span className="font-semibold">{type.label}</span>
         <span className="text-xs text-muted-foreground">{type.description}</span>
       </button>
     ))}
   </div>
   ```

**Testing:**
- [ ] All three options visually distinct
- [ ] Selected state clearly visible
- [ ] Mobile responsive (stack vertically)
- [ ] Keyboard accessible

---

### 1.3.5 Order Summary UI Redesign

**Priority:** High
**Agent:** `premium-ux-designer` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/order-summary.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/summary-line-item.tsx`

**Reference Screenshots:**
- `spec/cartandaddress/ordersummarymain.png`
- `spec/cartandaddress/deliveryfeesummary.png`
- `spec/cartandaddress/taxsummary.png`

**Key Elements from Screenshots:**
1. **Main Summary:**
   - Item total
   - Packing charges
   - Delivery fee (with info icon -> modal)
   - Platform Fee (with strikethrough original)
   - Handling Charges (with strikethrough original)
   - Tax (with info icon -> modal)
   - "You saved X on this order" banner
   - Grand Total (prominent, orange color)
   - Payment Method section (Online/Cash on Delivery)
   - Place Order button with total

2. **Delivery Fee Modal:**
   - Title: "Delivery Partner Fee"
   - Base delivery charges breakdown

3. **Tax Modal:**
   - Title: "Tax Breakdown"
   - Tax breakdown for your order
   - Tax on item total
   - Tax on packing charges
   - Tax on delivery charges
   - Tax on Platform Fee
   - Tax on Handling Charges
   - Total Tax

**Implementation:**
1. Restructure `OrderSummary` layout:
   ```tsx
   <Card>
     <CardHeader>Order Summary</CardHeader>
     <CardContent>
       {/* Line items */}
       <SummaryLineItem label="Item total" value={summary.itemTotal} />
       <SummaryLineItem label="Packing charges" value={summary.packingCharges} />
       <SummaryLineItem
         label="Delivery fee"
         value={summary.deliveryCharges}
         infoIcon
         onInfoClick={() => setShowDeliveryModal(true)}
       />
       {/* Extra charges with strikethrough */}
       {Object.entries(summary.extraCharges).map(([key, [original, final]]) => (
         <SummaryLineItem
           key={key}
           label={formatLabel(key)}
           value={final}
           originalValue={original}
           showStrikethrough
         />
       ))}
       <SummaryLineItem
         label="Tax"
         value={summary.tax.total}
         infoIcon
         onInfoClick={() => setShowTaxModal(true)}
       />

       {/* Savings banner */}
       {totalSavings > 0 && (
         <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center">
           You saved {formatCurrency(totalSavings)} on this order
         </div>
       )}

       <Separator />

       {/* Grand Total */}
       <div className="flex justify-between items-center">
         <span className="font-bold text-lg">Grand Total</span>
         <span className="font-bold text-2xl text-primary">
           {formatCurrency(summary.total)}
         </span>
       </div>

       {/* Payment Method */}
       <PaymentMethodSelector />

       {/* Place Order Button */}
       <Button className="w-full" size="lg">
         Place Order - {formatCurrency(summary.total)}
       </Button>
     </CardContent>
   </Card>
   ```

2. Create `DeliveryFeeModal` component
3. Create `TaxBreakdownModal` component
4. Add `PaymentMethodSelector` component

**Testing:**
- [ ] All line items display correctly
- [ ] Strikethrough shows on discounted items
- [ ] Info icons open respective modals
- [ ] Savings banner shows when applicable
- [ ] Grand total prominent in primary color
- [ ] Payment method selection works
- [ ] Place order button shows total

---

### 1.3.10 Empty State for Cart Summary Errors

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/order-summary.tsx`

**Current State:**
```tsx
if (!summary) {
  return null;  // Just hides the component
}
```

**Implementation:**
```tsx
if (!summary) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Unable to load summary</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {error || "Please try again later"}
        </p>
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Testing:**
- [ ] Error state shown when summary is null
- [ ] Error message displayed
- [ ] Retry button triggers refetch
- [ ] Proper loading state during retry

---

### 1.3.11 Loading Shimmers for Product Details Dialog

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-dialog.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-bottomsheet.tsx`

**Current State:**
- Shows `Loader2` spinner during loading

**Implementation:**
1. Create `ProductDetailsLoadingSkeleton` component:
   ```tsx
   function ProductDetailsLoadingSkeleton() {
     return (
       <div className="space-y-4 p-4">
         {/* Image skeleton */}
         <Skeleton className="w-full h-48 rounded-lg" />

         {/* Title and badge */}
         <div className="space-y-2">
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-4 w-1/4" />
         </div>

         {/* Description */}
         <div className="space-y-2">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
         </div>

         {/* Variant options */}
         <div className="space-y-3">
           <Skeleton className="h-5 w-1/3" />
           <div className="flex gap-2">
             <Skeleton className="h-10 w-24 rounded-lg" />
             <Skeleton className="h-10 w-24 rounded-lg" />
             <Skeleton className="h-10 w-24 rounded-lg" />
           </div>
         </div>

         {/* Addon options */}
         <div className="space-y-3">
           <Skeleton className="h-5 w-1/3" />
           <Skeleton className="h-12 w-full rounded-lg" />
           <Skeleton className="h-12 w-full rounded-lg" />
         </div>

         {/* Footer */}
         <div className="flex justify-between items-center pt-4">
           <Skeleton className="h-8 w-24" />
           <Skeleton className="h-10 w-32 rounded-lg" />
         </div>
       </div>
     );
   }
   ```

2. Replace spinner with skeleton in dialog/bottomsheet loading state

**Testing:**
- [ ] Shimmer skeleton shown during loading
- [ ] Layout matches actual content structure
- [ ] Smooth transition to actual content
- [ ] Works in both dialog and bottomsheet

---

### 1.3.8 Fix Mobile View

**Priority:** High
**Agent:** `nextjs-responsive-design`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/order-summary.tsx`

**Implementation:**
1. Audit all cart components for mobile breakpoints
2. Fix grid layouts:
   ```tsx
   // Cart page layout
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
   ```
3. Stack cart item card elements vertically on mobile:
   ```tsx
   <div className="flex flex-col sm:flex-row gap-4">
   ```
4. Order summary: full width on mobile, sticky on desktop only
5. Ensure touch targets are 44px minimum
6. Test all interactive elements

**Testing:**
- [ ] 320px viewport - all content visible
- [ ] 375px viewport - proper spacing
- [ ] 768px viewport - tablet layout
- [ ] Touch targets accessible
- [ ] No horizontal scroll

---

## Phase 3: Discount & Address Integration (Days 3-4)

### 1.3.2 Apply Discount - Full Implementation

**Priority:** High
**Agent:** `nextjs-forms-expert` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`
- Create: `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/discount-section.tsx`

**Existing Components:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/discount/discount-input.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/discount/discount-modal.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/discount/applied-discounts.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/discount.ts`

**Implementation:**
1. Create `DiscountSection` component:
   ```tsx
   function DiscountSection() {
     const { selectedDiscountIds, addDiscount, removeDiscount } = useCartStore();
     const [showModal, setShowModal] = useState(false);
     const [inputCode, setInputCode] = useState('');
     const [isApplying, setIsApplying] = useState(false);

     const handleApplyCode = async () => {
       setIsApplying(true);
       try {
         // Validate code via API
         const response = await validateDiscountCode(inputCode);
         if (response.statusCode === 200 && response.data) {
           addDiscount(response.data._id);
           toast.success('Discount applied!');
           setInputCode('');
         } else {
           toast.error(response.errorMessage || 'Invalid discount code');
         }
       } catch (error) {
         toast.error('Failed to apply discount');
       } finally {
         setIsApplying(false);
       }
     };

     return (
       <div className="rounded-lg border bg-card p-6">
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
             <Tag className="size-5 text-primary" />
             <h3 className="font-semibold">Discounts & Offers</h3>
           </div>
           <Button variant="link" onClick={() => setShowModal(true)}>
             View All
           </Button>
         </div>

         {/* Input */}
         <div className="flex gap-2 mb-4">
           <Input
             placeholder="Enter discount code"
             value={inputCode}
             onChange={(e) => setInputCode(e.target.value)}
           />
           <Button onClick={handleApplyCode} loading={isApplying}>
             Apply
           </Button>
         </div>

         {/* Applied Discounts */}
         <AppliedDiscounts
           discountIds={selectedDiscountIds}
           onRemove={removeDiscount}
         />

         {/* Available Discounts Modal */}
         <DiscountModal
           open={showModal}
           onOpenChange={setShowModal}
           onSelect={(id) => {
             addDiscount(id);
             setShowModal(false);
           }}
         />
       </div>
     );
   }
   ```

2. Add `validateDiscountCode` API function
3. Wire up to cart summary (already reacts to `selectedDiscountIds`)

**Testing:**
- [ ] Enter valid code - discount applied, toast shown
- [ ] Enter invalid code - error toast shown
- [ ] View All opens discount modal
- [ ] Select discount from modal - applied
- [ ] Remove discount - removed, summary updates
- [ ] Summary reflects discount amounts

---

### 1.3.3 Fix "Add Address" Navigation

**Priority:** High
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`

**Current State:**
```tsx
const handleAddNewAddress = () => {
  router.push("/profile?tab=addresses&action=add");
};
```

**Implementation:**
```tsx
const handleAddNewAddress = () => {
  router.push("/addresses?action=add");
};
```

Or better - show address modal directly:
```tsx
const [showAddAddressModal, setShowAddAddressModal] = useState(false);

const handleAddNewAddress = () => {
  setShowAddAddressModal(true);
};

// In JSX
<AddAddressModal
  open={showAddAddressModal}
  onOpenChange={setShowAddAddressModal}
  onSuccess={() => {
    fetchAddresses();
    setShowAddAddressModal(false);
  }}
/>
```

**Testing:**
- [ ] Click "Add New Address" opens address form
- [ ] Can add address without leaving cart
- [ ] New address appears in selector
- [ ] Can select newly added address

---

### 2.1.1 Address Page Header - Match Menu Section Style

**Priority:** Medium
**Agent:** `premium-ux-designer` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/addresses/page.tsx`

**Implementation:**
- Same pattern as cart header (1.3.1)
- Badge: "My Addresses"
- Headline: "Manage Your Addresses"
- Decorative elements

**Testing:**
- [ ] Header matches design system
- [ ] Responsive on all viewports

---

### 2.1.2 Address Form with Google Maps & Places Autocomplete

**Priority:** High
**Agent:** `nextjs-forms-expert` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-form.tsx`
- Create: `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/google-places-input.tsx`
- Create: `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-map.tsx`

**Reference Screenshots:**
- `spec/cartandaddress/add_address.png`
- `spec/cartandaddress/add_address_2.png`
- `spec/cartandaddress/add_address_3.png`

**Key Features from Screenshots:**
1. Google Places Autocomplete search input
2. Interactive map showing delivery location
3. Pin marker that can be dragged
4. Auto-fill form fields from selected place:
   - Street Address (required)
   - Flat/Unit (optional)
   - Town/Area (auto-filled)
   - City (auto-filled)
   - County (auto-filled)
   - Postcode (auto-filled)
   - Latitude/Longitude (hidden, required)
5. Address Type toggle (Home/Work/Other)
6. "Default" toggle
7. "For Me" toggle

**Implementation:**
1. Install `@react-google-maps/api` or use Google Maps Platform directly
2. Create `GooglePlacesInput`:
   ```tsx
   function GooglePlacesInput({ onSelect }) {
     // Initialize Google Places Autocomplete
     // On select, extract address components
     // Call onSelect with structured data
   }
   ```

3. Create `AddressMap`:
   ```tsx
   function AddressMap({ lat, lng, onPositionChange }) {
     // Show map centered on lat/lng
     // Draggable marker
     // On drag end, reverse geocode and update address
   }
   ```

4. Restructure form:
   ```tsx
   <Dialog>
     <DialogHeader className="bg-primary text-white">
       Add New Address
     </DialogHeader>
     <DialogContent>
       {/* Step 1: Location Selection */}
       <div className="space-y-4">
         <Label>Select Delivery Location</Label>
         <GooglePlacesInput onSelect={handlePlaceSelect} />
         <Button variant="outline" onClick={useCurrentLocation}>
           Use my current location
         </Button>
       </div>

       {/* Map */}
       <AddressMap
         lat={watchLat}
         lng={watchLng}
         onPositionChange={handlePositionChange}
       />
       <p className="text-sm text-muted-foreground">
         Drag the map to position the pin at your exact delivery location
       </p>

       {/* Auto-filled form fields */}
       <div className="grid grid-cols-2 gap-4">
         <Input label="Street Address *" {...register('line1')} />
         <Input label="Flat/Unit (Optional)" {...register('line2')} />
         <Input label="Town/Area * (Auto-filled)" {...register('area')} />
         <Input label="City * (Auto-filled)" {...register('city')} />
         <Input label="County * (Auto-filled)" {...register('county')} />
         <Input label="Postcode * (Auto-filled)" {...register('zip')} />
       </div>

       {/* Address Type */}
       <ToggleGroup value={addressType} onValueChange={setAddressType}>
         <ToggleGroupItem value="home">Home</ToggleGroupItem>
         <ToggleGroupItem value="work">Work</ToggleGroupItem>
         <ToggleGroupItem value="other">Other</ToggleGroupItem>
       </ToggleGroup>

       {/* Toggles */}
       <div className="flex gap-4">
         <Toggle label="Default" checked={isDefault} onChange={setIsDefault} />
         <Toggle label="For Me" checked={isForMe} onChange={setIsForMe} />
       </div>

       {/* Actions */}
       <DialogFooter>
         <Button onClick={handleSave}>Save Address</Button>
         <Button variant="outline" onClick={onCancel}>Cancel</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
   ```

5. Add Google Maps API key to environment variables
6. Create wrapper component to load Google Maps script

**Testing:**
- [ ] Search input shows autocomplete suggestions
- [ ] Selecting suggestion fills form fields
- [ ] Map displays with marker at location
- [ ] Dragging marker updates address fields
- [ ] Lat/lng captured correctly
- [ ] Use my location works
- [ ] Form validates before submit

---

### 2.1.3 "For Me" / "For Other" Toggle

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-form.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/schemas/address-schema.ts`

**Implementation:**
1. Add `isForMe` field to schema
2. Add toggle to form:
   ```tsx
   <div className="flex items-center gap-4">
     <Switch
       checked={isForMe}
       onCheckedChange={setIsForMe}
     />
     <Label>For Me</Label>
   </div>

   {!isForMe && (
     <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
       <h4 className="font-medium">Recipient Details</h4>
       <Input label="Recipient Name *" {...register('recipientName')} />
       <Input label="Recipient Phone *" {...register('recipientPhone')} />
     </div>
   )}
   ```

3. When `isForMe` is true, use logged-in user's name/phone
4. When `isForMe` is false, require recipient details

**Testing:**
- [ ] Toggle defaults to "For Me"
- [ ] Toggling shows/hides recipient fields
- [ ] "For Me" uses user's profile data
- [ ] "For Other" requires manual entry

---

### 2.1.4 Remove Radio Buttons if Using Toggle Group

**Priority:** Low
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-form.tsx`

**Current State:**
- Uses `RadioGroup` with `RadioGroupItem`s inside styled labels

**Implementation:**
- Replace with `ToggleGroup`:
  ```tsx
  import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

  <ToggleGroup
    type="single"
    value={addressType}
    onValueChange={(value) => setValue('type', value)}
  >
    <ToggleGroupItem value="home" className="flex items-center gap-2">
      <Home className="size-4" />
      Home
    </ToggleGroupItem>
    <ToggleGroupItem value="work" className="flex items-center gap-2">
      <Briefcase className="size-4" />
      Work
    </ToggleGroupItem>
    <ToggleGroupItem value="other" className="flex items-center gap-2">
      <MapPin className="size-4" />
      Other
    </ToggleGroupItem>
  </ToggleGroup>
  ```

**Testing:**
- [ ] Only one option selectable at a time
- [ ] Visual selection state clear
- [ ] No radio buttons visible

---

### 2.1.5 Reduce Address Card Padding

**Priority:** Low
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-card.tsx`

**Current State:**
```tsx
<CardContent className="p-4 space-y-3">
```

**Implementation:**
```tsx
<CardContent className="p-3 space-y-2">
```

Also reduce internal spacing between elements.

**Testing:**
- [ ] Cards look more compact
- [ ] Content still readable
- [ ] Touch targets still accessible

---

### 2.1.6 & 1.3.7 Add Toasts for All Operations

**Priority:** Medium
**Agent:** `shadcn-implementation-builder`
**Files to Audit & Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/hooks/use-cart.ts` (already has toasts)
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/add-address-modal.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/edit-address-modal.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/delete-address-dialog.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/edit-cart-item-modal.tsx`

**Checklist of Toasts Needed:**
- [x] Add to cart success - exists in `useAddToCart`
- [x] Add to cart error - exists in `useAddToCart`
- [x] Update cart success - exists in `useUpdateCartItem`
- [x] Update cart error - exists in `useUpdateCartItem`
- [x] Remove from cart success - exists in `useRemoveCartItem`
- [x] Remove from cart error - exists in `useRemoveCartItem`
- [x] Add address success - exists in `AddAddressModal`
- [x] Add address error - exists in `AddAddressModal`
- [ ] Edit address success - verify in `EditAddressModal`
- [ ] Edit address error - verify in `EditAddressModal`
- [ ] Delete address success - verify in `DeleteAddressDialog`
- [ ] Delete address error - verify in `DeleteAddressDialog`
- [ ] Dialog close after operation - verify all modals
- [ ] Discount applied - add
- [ ] Discount error - add
- [ ] Discount removed - add

**Testing:**
- [ ] Every operation shows appropriate toast
- [ ] Error toasts are red/destructive
- [ ] Success toasts are green/positive
- [ ] Toasts auto-dismiss

---

### 2.1.7 Use Shimmer Instead of Loader for Addresses

**Priority:** Low
**Agent:** `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/addresses/page.tsx`

**Current State:**
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
```

**Implementation:**
```tsx
function AddressCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" /> {/* Badge */}
          <Skeleton className="h-4 w-20" /> {/* Default indicator */}
        </div>
        <Skeleton className="h-5 w-32" /> {/* Name */}
        <Skeleton className="h-4 w-full" /> {/* Address line 1 */}
        <Skeleton className="h-4 w-3/4" /> {/* Address line 2 */}
        <Skeleton className="h-4 w-24" /> {/* Phone */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" /> {/* Edit */}
          <Skeleton className="h-8 flex-1" /> {/* Delete */}
          <Skeleton className="h-8 flex-1" /> {/* Set Default */}
        </div>
      </CardContent>
    </Card>
  );
}

// In page
if (isLoading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <AddressCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

**Testing:**
- [ ] Skeleton cards shown during load
- [ ] Layout matches actual cards
- [ ] Smooth transition to content

---

### 2.2.1 Require lat/lng Before API Calls

**Priority:** High
**Agent:** `nextjs-forms-expert`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/schemas/address-schema.ts`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/address/address-form.tsx`

**Implementation:**
1. Update schema to require lat/lng:
   ```typescript
   export const addressSchema = z.object({
     // ... other fields
     lat: z.number({ required_error: "Location is required" }),
     long: z.number({ required_error: "Location is required" }),
   });
   ```

2. Add validation error display:
   ```tsx
   {(errors.lat || errors.long) && (
     <Alert variant="destructive">
       <AlertDescription>
         Please select a location on the map or use "Use My Location"
       </AlertDescription>
     </Alert>
   )}
   ```

3. Disable submit until lat/lng are set

**Testing:**
- [ ] Cannot submit without lat/lng
- [ ] Error message shown if missing
- [ ] Setting location enables submit

---

### 2.2.2 Use Update Instead of Patch for Set Default

**Priority:** Medium
**Agent:** `nextjs-forms-expert`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/addresses/page.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/address.ts`

**Current State:**
```tsx
const handleSetDefault = async (address: AddressResponse) => {
  const response = await patchAddress(address._id, { isDefault: true });
  // ...
};
```

**Implementation:**
```tsx
const handleSetDefault = async (address: AddressResponse) => {
  const response = await updateAddress(address._id, {
    ...address,
    isDefault: true,
  });
  // ...
};
```

Or create dedicated endpoint if available:
```typescript
export async function setDefaultAddress(id: string): Promise<APIResponse<AddressResponse>> {
  const response = await apiClient.put(`/customer/address/set-default/${id}`);
  return response.data;
}
```

**Testing:**
- [ ] Set default makes correct API call
- [ ] Previous default is unset
- [ ] UI updates correctly

---

## Phase 4: Product Details Dialog Fixes (Day 4-5)

### 1.2.4 Fix Product Details Dialog API Calls & UI

**Priority:** High
**Agent:** `nextjs-forms-expert` -> `shadcn-implementation-builder`
**Files to Modify:**
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-container.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-dialog.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/sections/product-details-footer.tsx`

**Issues Reported:**
1. API calls not happening
2. UI misbehaves after API call
3. Shows empty dialog instead of loading button
4. Animated button looks weird

**Implementation:**
1. Debug and fix API call flow:
   ```typescript
   // Add logging to track state
   console.log('ProductDetailsContainer state:', {
     isOpen,
     data,
     isLoading,
     isAddingToCart,
     error
   });
   ```

2. Fix loading states:
   ```tsx
   // In footer
   <Button
     onClick={handleAddToCart}
     disabled={isLoading || isAddingToCart}
     className="w-full"
   >
     {isAddingToCart ? (
       <>
         <Loader2 className="size-4 animate-spin mr-2" />
         Adding to Cart...
       </>
     ) : (
       <>
         Add to Cart - {formatCurrency(totalPrice)}
       </>
     )}
   </Button>
   ```

3. Remove animated button component if causing issues
4. Add proper error handling and recovery
5. Ensure dialog doesn't close during loading

**Testing:**
- [ ] Open dialog - data loads
- [ ] Select options - price updates
- [ ] Click add to cart - loading state shown
- [ ] Success - dialog closes, toast shown
- [ ] Error - dialog stays open, error toast

---

## Testing Checklist Summary

### Cart Features
- [ ] Cart icon click goes directly to cart page (no dropdown)
- [ ] Cart badge updates on add/update/remove
- [ ] Store ID passed correctly to APIs
- [ ] Toast shown when no store selected
- [ ] Cart page header matches design system
- [ ] Cart items show full product details (image, name, variants, addons)
- [ ] QuantityIncrementor used in cart items
- [ ] Edit cart uses ProductDetailsContainer
- [ ] Delivery type selector looks polished
- [ ] Order summary matches reference screenshots
- [ ] Tax/delivery fee modals work
- [ ] Discount code can be applied
- [ ] Discount modal shows available discounts
- [ ] Empty/error states handled gracefully
- [ ] Loading shimmers throughout
- [ ] Mobile view works properly

### Address Features
- [ ] Address page header matches design system
- [ ] Google Maps integration works
- [ ] Places autocomplete populates fields
- [ ] Map marker draggable
- [ ] Lat/lng captured and required
- [ ] For Me / For Other toggle works
- [ ] Address type uses toggle group (no radio buttons)
- [ ] Card padding reduced
- [ ] All operations show toasts
- [ ] Loading shimmer instead of spinner
- [ ] Set default uses correct API

---

## Agent Assignment Summary

| Phase | Task | Primary Agent | Secondary Agent |
|-------|------|---------------|-----------------|
| 1 | Remove cart dropdown | `shadcn-implementation-builder` | - |
| 1 | Fix cart badge | `nextjs-forms-expert` | - |
| 1 | Fix storeId | `nextjs-forms-expert` | - |
| 1 | Store not selected toast | `shadcn-implementation-builder` | - |
| 2 | Cart header | `premium-ux-designer` | `shadcn-implementation-builder` |
| 2 | Cart item details | `nextjs-component-architect` | `shadcn-implementation-builder` |
| 2 | QuantityIncrementor | `shadcn-implementation-builder` | - |
| 2 | ProductDetails edit mode | `nextjs-component-architect` | - |
| 2 | Delivery type UI | `premium-ux-designer` | `shadcn-implementation-builder` |
| 2 | Order summary | `premium-ux-designer` | `shadcn-implementation-builder` |
| 2 | Empty/error states | `shadcn-implementation-builder` | - |
| 2 | Loading shimmers | `shadcn-implementation-builder` | - |
| 2 | Mobile view | `nextjs-responsive-design` | - |
| 3 | Discount integration | `nextjs-forms-expert` | `shadcn-implementation-builder` |
| 3 | Address navigation | `shadcn-implementation-builder` | - |
| 3 | Address header | `premium-ux-designer` | `shadcn-implementation-builder` |
| 3 | Google Maps form | `nextjs-forms-expert` | `shadcn-implementation-builder` |
| 3 | For Me toggle | `shadcn-implementation-builder` | - |
| 3 | Toggle group | `shadcn-implementation-builder` | - |
| 3 | Card padding | `shadcn-implementation-builder` | - |
| 3 | Toast audit | `shadcn-implementation-builder` | - |
| 3 | Address shimmer | `shadcn-implementation-builder` | - |
| 3 | lat/lng validation | `nextjs-forms-expert` | - |
| 3 | Update vs patch | `nextjs-forms-expert` | - |
| 4 | Product dialog fixes | `nextjs-forms-expert` | `shadcn-implementation-builder` |

---

## Parallel Execution Opportunities

**Can run in parallel within Phase 1:**
- 1.1.1 (Remove dropdown) + 1.2.2 (Badge fix) + 1.2.1 (storeId fix) + 1.2.3 (Toast)

**Can run in parallel within Phase 2:**
- 1.3.1 (Header) + 1.3.4 (Delivery UI) - both UX design tasks
- 1.3.9 (QuantityIncrementor) + 1.3.10 (Empty state) + 1.3.11 (Shimmers)

**Can run in parallel within Phase 3:**
- 2.1.1 (Address header) + 2.1.5 (Card padding) + 2.1.6/1.3.7 (Toasts) + 2.1.7 (Shimmer)

**Dependencies:**
- 1.2.1 (Cart item details) must complete before 1.3.6 (Edit mode)
- 2.1.2 (Google Maps) must complete before 2.2.1 (lat/lng validation)
- 1.3.5 (Order summary) should complete before 1.3.2 (Discount) for integration

---

## Phase 5: Testing & Verification (Final Phase)

**Agent:** `nextjs-ui-reviewer` for each section

This phase ensures every point from the original spec is properly tested and verified before marking complete.

---

### Cart UI Testing (1.1.x)

#### 1.1.1 - Cart Navigation (No Dropdown)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Direct navigation | Click cart icon in header | Navigates to `/cart` page | [ ] |
| No dropdown | Hover/click cart icon | No popover/dropdown appears | [ ] |
| Badge visible | View header with items in cart | Badge shows correct count | [ ] |

---

### Cart UI Testing (1.2.x & 1.3.x)

#### 1.2.1 - Cart Item Card Product Details
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Product image | View cart item | Product photo displayed | [ ] |
| Product name | View cart item | Correct product name shown | [ ] |
| Selected variant | Add item with variant, view cart | Variant label displayed (e.g., "Small", "Medium") | [ ] |
| Selected addons | Add item with addons, view cart | Addon names and quantities shown | [ ] |
| Quantity counter | View cart item | QuantityIncrementor component visible | [ ] |
| Delete button | View cart item | Trash/delete icon visible | [ ] |
| Edit button | View cart item | Pencil/edit icon visible | [ ] |
| Loading state | Open cart page | Shimmer skeleton during load | [ ] |

#### 1.3.1 - Cart Screen Header Design
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Badge present | View cart page | Section badge "Your Cart" visible | [ ] |
| Headline style | View cart page | Large heading with decorative underline | [ ] |
| Subheadline | View cart page | Item count description visible | [ ] |
| Decorative elements | View cart page | Dots/lines matching menu section | [ ] |
| Dark mode | Toggle dark mode | Header adapts correctly | [ ] |
| Mobile responsive | View on 375px | Header scales appropriately | [ ] |

#### 1.3.2 - Apply Discount Feature
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Input visible | View discount section | Text input with "Enter code" placeholder | [ ] |
| Apply button | View discount section | "Apply" button next to input | [ ] |
| Valid code | Enter valid code, click Apply | Toast: "Discount applied!", summary updates | [ ] |
| Invalid code | Enter invalid code, click Apply | Toast: "Invalid discount code" (red) | [ ] |
| View all link | Click "View All" | Discount modal opens | [ ] |
| Select from modal | Click discount in modal | Discount applied, modal closes | [ ] |
| Remove discount | Click X on applied discount | Discount removed, summary updates | [ ] |
| API integration | Apply discount | Network tab shows API call | [ ] |

#### 1.3.3 - Add Address Navigation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Button click | Select Delivery, click "Add New Address" | Address modal opens (not profile redirect) | [ ] |
| Add address | Fill form, save | New address in selector | [ ] |
| Stay on cart | Complete address add | Still on cart page | [ ] |

#### 1.3.4 - Delivery Type Selector UI
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Card-based UI | View selector | 3 card options (not tabs) | [ ] |
| Icons visible | View selector | Dine In, Takeaway, Delivery icons | [ ] |
| Selection state | Click option | Clear border/background highlight | [ ] |
| Description text | View selector | Short description under each label | [ ] |
| Mobile layout | View on 375px | Cards stack vertically or fit | [ ] |
| Keyboard access | Tab through | Can select with keyboard | [ ] |

#### 1.3.5 - Order Summary UI (Reference Screenshots)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Item total | View summary | "Item total" with amount | [ ] |
| Packing charges | View summary | "Packing charges" line | [ ] |
| Delivery fee | View summary | "Delivery fee" with info icon | [ ] |
| Delivery modal | Click delivery info icon | Shows "Delivery Partner Fee" breakdown | [ ] |
| Platform fee | View summary | Shows original strikethrough + discounted | [ ] |
| Handling charges | View summary | Shows original strikethrough + discounted | [ ] |
| Tax line | View summary | "Tax" with info icon | [ ] |
| Tax modal | Click tax info icon | Shows full tax breakdown | [ ] |
| Savings banner | With discounts applied | Green "You saved £X" banner | [ ] |
| Grand total | View summary | Large, orange/primary colored total | [ ] |
| Payment method | View summary | Online Payment / Cash on Delivery radio | [ ] |
| Place order btn | View summary | Button shows "Place Order - £XX.XX" | [ ] |

#### 1.3.6 - Edit Cart Uses ProductDetailsContainer
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Edit click | Click edit pen on cart item | ProductDetails dialog/bottomsheet opens | [ ] |
| Pre-populated | Edit opens | Current selections pre-filled | [ ] |
| Update text | View footer | Button says "Update Cart" (not Add) | [ ] |
| API call | Click Update | PUT/update API called (not POST/add) | [ ] |
| Toast success | Complete update | "Cart updated" toast shown | [ ] |
| Dialog closes | Complete update | Modal closes automatically | [ ] |

#### 1.3.7 - Toasts/Snackbars for Cart Operations
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add to cart | Add item from menu | Success toast shown | [ ] |
| Add error | Force API error | Error toast (red) shown | [ ] |
| Update cart | Change quantity | Success toast shown | [ ] |
| Update error | Force API error | Error toast shown | [ ] |
| Remove item | Delete item from cart | Success toast shown | [ ] |
| Remove error | Force API error | Error toast shown | [ ] |
| Dialog close | Close edit dialog | No orphan loading states | [ ] |

#### 1.3.8 - Mobile View
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| 320px viewport | Resize to 320px | All content visible, no overflow | [ ] |
| 375px viewport | Resize to 375px | Proper spacing, readable text | [ ] |
| 768px viewport | Resize to 768px | Tablet layout works | [ ] |
| Touch targets | Tap buttons on mobile | 44px minimum tap area | [ ] |
| No horizontal scroll | Scroll page | No horizontal scrollbar | [ ] |
| Summary position | View on mobile | Summary below items (not side) | [ ] |

#### 1.3.9 - QuantityIncrementor Component
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Component used | Inspect cart item | Uses QuantityIncrementor (not custom) | [ ] |
| Increment | Click + button | Quantity increases, API called | [ ] |
| Decrement | Click - button | Quantity decreases, API called | [ ] |
| Min limit | Decrease to 1 | Cannot go below 1 | [ ] |
| Loading state | Change quantity | Shows loading during API | [ ] |

#### 1.3.10 - Cart Summary Empty/Error State
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Null summary | Force summary null | Error card with icon shown | [ ] |
| Error message | Force API error | Descriptive error text | [ ] |
| Retry button | View error state | "Try Again" button present | [ ] |
| Retry works | Click retry | Refetches summary | [ ] |

#### 1.3.11 - Loading Shimmers
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Dialog shimmer | Open product details | Skeleton layout during load | [ ] |
| Bottomsheet shimmer | Open on mobile | Skeleton layout during load | [ ] |
| Layout match | View shimmer | Matches actual content structure | [ ] |
| Smooth transition | Wait for load | Clean transition to content | [ ] |

---

### Cart Logic & API Testing (1.2.x)

#### 1.2.1 - StoreId "default-store" Fix
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Correct storeId | Check network tab | Summary API uses actual store ID | [ ] |
| No store selected | Clear store selection | Error state shown (not API with default) | [ ] |
| Store change | Select different store | Summary refreshes with new store | [ ] |

#### 1.2.2 - Cart Badge Updates
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add item | Add to cart from menu | Badge increments immediately | [ ] |
| Update quantity | Increase quantity | Badge reflects total items | [ ] |
| Remove item | Delete from cart | Badge decrements | [ ] |
| Page refresh | Reload page | Badge shows correct count | [ ] |

#### 1.2.3 - Store Not Selected Toast
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| No store + add | Try add to cart without store | Toast: "Please select a store first" | [ ] |
| Quick add | Use quick add without store | Same toast shown | [ ] |
| No API call | Check network | No add-to-cart API triggered | [ ] |

#### 1.2.4 - Product Details Dialog API/UI
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Dialog opens | Click product | Dialog opens, loading shown | [ ] |
| Data loads | Wait for load | Product details appear | [ ] |
| Selections work | Select variant/addon | Price updates correctly | [ ] |
| Add to cart | Click add button | Loading state on button | [ ] |
| Success flow | Complete add | Dialog closes, toast shown | [ ] |
| Error handling | Force API error | Dialog stays open, error toast | [ ] |
| No empty state | During any flow | Never shows empty dialog | [ ] |

---

### Address UI Testing (2.1.x)

#### 2.1.1 - Address Screen Header Design
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Badge present | View address page | Section badge visible | [ ] |
| Headline style | View address page | Matches cart/menu header style | [ ] |
| Decorative elements | View address page | Consistent with design system | [ ] |
| Responsive | View on mobile | Header scales correctly | [ ] |

#### 2.1.2 - Google Maps & Places Autocomplete
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Search input | Open add address | Places autocomplete input visible | [ ] |
| Suggestions | Type address | Dropdown with suggestions | [ ] |
| Select suggestion | Click suggestion | Form fields auto-populated | [ ] |
| Map displayed | View form | Interactive Google Map shown | [ ] |
| Pin marker | View map | Marker at selected location | [ ] |
| Drag marker | Drag pin on map | Address fields update | [ ] |
| Use my location | Click button | Gets current GPS location | [ ] |
| Fields populated | Select place | Street, City, County, Postcode filled | [ ] |
| Lat/lng captured | Submit form | Coordinates sent to API | [ ] |

#### 2.1.3 - "For Me" / "For Other" Toggle
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Toggle visible | Open add address | "For Me" toggle present | [ ] |
| Default state | Open form | "For Me" is ON by default | [ ] |
| For Me ON | Toggle ON | No recipient fields shown | [ ] |
| For Other | Toggle OFF | Recipient name/phone fields appear | [ ] |
| Validation | Submit with For Other | Requires recipient details | [ ] |
| API data | Save For Me address | Uses logged-in user data | [ ] |
| API data | Save For Other address | Uses entered recipient data | [ ] |

#### 2.1.4 - Toggle Group (No Radio Buttons)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Toggle group | View address type | Home/Work/Other as toggle buttons | [ ] |
| No radios | Inspect UI | No radio button circles visible | [ ] |
| Single select | Click options | Only one selected at a time | [ ] |
| Visual state | Click option | Clear selection highlight | [ ] |

#### 2.1.5 - Address Card Padding
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Compact cards | View address list | Reduced padding, denser layout | [ ] |
| Readable | View cards | Content still clearly readable | [ ] |
| Touch targets | Tap buttons | Still accessible (44px min) | [ ] |

#### 2.1.6 - Address Toasts
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Add success | Save new address | Success toast shown | [ ] |
| Add error | Force API error | Error toast shown | [ ] |
| Edit success | Update address | Success toast shown | [ ] |
| Edit error | Force API error | Error toast shown | [ ] |
| Delete success | Delete address | Success toast shown | [ ] |
| Delete error | Force API error | Error toast shown | [ ] |
| Set default | Set as default | Success toast shown | [ ] |

#### 2.1.7 - Shimmer Loading (Not Spinner)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Initial load | Navigate to addresses | Skeleton cards shown (not spinner) | [ ] |
| Card layout | View shimmer | Matches actual card structure | [ ] |
| Multiple cards | View loading | Shows 3 skeleton cards | [ ] |

---

### Address Logic & API Testing (2.2.x)

#### 2.2.1 - Lat/Lng Required
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| No location | Try save without map selection | Validation error shown | [ ] |
| Error message | Submit without coords | "Please select a location" message | [ ] |
| Button disabled | No coords set | Save button disabled | [ ] |
| With location | Select on map, save | API call includes lat/lng | [ ] |

#### 2.2.2 - Update Instead of Patch
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Set default | Click set default | Network shows PUT (not PATCH) | [ ] |
| Full payload | Check request | Sends complete address object | [ ] |
| Works correctly | Set default | Previous default unset, new set | [ ] |

---

## Testing Execution Plan

### Pre-Testing Setup
1. [ ] Clear all caches and localStorage
2. [ ] Reset test user account
3. [ ] Ensure dev server running on localhost:3000
4. [ ] Open browser dev tools (Network, Console tabs)
5. [ ] Prepare test discount codes (valid and invalid)

### Testing Order
1. **Cart Logic (1.2.x)** - Test API/state fixes first
2. **Cart UI (1.3.x)** - Test visual components
3. **Cart Navigation (1.1.x)** - Test header behavior
4. **Address Logic (2.2.x)** - Test API fixes
5. **Address UI (2.1.x)** - Test visual components

### Sign-Off Checklist
| Section | Tested By | Date | Pass/Fail |
|---------|-----------|------|-----------|
| Cart Logic 1.2.x | | | |
| Cart UI 1.3.x | | | |
| Cart Nav 1.1.x | | | |
| Address Logic 2.2.x | | | |
| Address UI 2.1.x | | | |

---

## Notes

1. **Existing Components to Reuse:**
   - `QuantityIncrementor` at `components/composite/quantity-incrementor.tsx`
   - `ProductDetailsContainer` at `components/product-details/product-details-container.tsx`
   - All discount components at `components/discount/`
   - Section header pattern from `components/home/menu-section/index.tsx`

2. **Environment Variables Needed:**
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for Maps integration

3. **Dependencies to Install:**
   - `@react-google-maps/api` or similar for Google Maps

4. **Files to Delete After Migration:**
   - `components/cart/quantity-control.tsx` (if only used in cart)
   - `components/cart/edit-cart-item-modal.tsx` (replaced by ProductDetailsContainer edit mode)
   - `components/layout/header/mini-cart-dropdown.tsx` (no longer needed)
