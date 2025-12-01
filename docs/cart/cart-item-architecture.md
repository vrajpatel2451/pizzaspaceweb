# Cart Item Card - Architecture Overview

## Component Hierarchy

```
CartPage
  └─ CartItemList
      └─ CartItemCard (multiple instances)
          ├─ useProductDetails(itemId) ← Fetches product data
          ├─ Product Image (CustomImage)
          ├─ Product Info
          │   ├─ Name
          │   ├─ Variant Badge
          │   └─ Addons List
          ├─ Price Display
          ├─ QuantityIncrementor
          ├─ Action Buttons
          │   ├─ Edit Button → EditCartItemModal
          │   └─ Delete Button → Dialog (confirmation)
          └─ States
              ├─ CartItemSkeleton (loading)
              └─ Error State (failed fetch)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Cart Page                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ cartItems: CartResponse[]                                 │ │
│  │   [{                                                      │ │
│  │     _id: "cart-123",                                      │ │
│  │     itemId: "product-456",  ← Product ID                 │ │
│  │     variantId: "variant-789",                             │ │
│  │     quantity: 2,                                          │ │
│  │     pricing: [{ id: "addon-001", quantity: 2 }]          │ │
│  │   }]                                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              CartItemList                                 │ │
│  │  Maps over cartItems → Renders CartItemCard for each     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                     CartItemCard (item)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ useProductDetails(item.itemId)                            │ │
│  │   ↓                                                       │ │
│  │ Fetches from API: /api/product/details/:itemId           │ │
│  │   ↓                                                       │ │
│  │ Returns ProductDetailsResponse:                          │ │
│  │   {                                                       │ │
│  │     product: { name, photoList, basePrice, ... },        │ │
│  │     variantList: [{ _id, label, price, ... }],           │ │
│  │     addonList: [{ _id, label, price, ... }],             │ │
│  │     ...                                                   │ │
│  │   }                                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Extract & Map Data (useMemo):                             │ │
│  │                                                           │ │
│  │ variantInfo = variantList.find(v => v._id === variantId) │ │
│  │   → { _id, label: "Large", price: 1200 }                 │ │
│  │                                                           │ │
│  │ addonInfo = pricing.map(p => {                            │ │
│  │   addon = addonList.find(a => a._id === p.id)           │ │
│  │   return { label, quantity: p.quantity, price }          │ │
│  │ })                                                        │ │
│  │   → [{ label: "Extra Cheese", quantity: 2, price: 150 }] │ │
│  │                                                           │ │
│  │ itemPrice = variantPrice + sum(addon.price × qty)        │ │
│  │   → 1200 + (150 × 2) = 1500                              │ │
│  │                                                           │ │
│  │ itemTotal = itemPrice × item.quantity                    │ │
│  │   → 1500 × 2 = 3000 pence = £30.00                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Render UI:                                                │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ [IMAGE] Margherita Pizza           £30.00         │  │ │
│  │  │         [Large]                     £15.00 each    │  │ │
│  │  │         Extra Cheese x2                            │  │ │
│  │  │                                                    │  │ │
│  │  │         [- 2 +]            [Edit] [Delete]        │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────────────────────────┐
│                    CartItemCard States                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LOADING (isLoading = true)                               │
│     ┌────────────────────────────────────────────────────┐   │
│     │ [SKELETON] [SKELETON SKELETON]    [SKELETON]      │   │
│     │            [SKELETON]                              │   │
│     │            [SKELETON SKELETON]                     │   │
│     │            [SKELETON]  [SKEL] [SKEL]              │   │
│     └────────────────────────────────────────────────────┘   │
│                                                              │
│  2. ERROR (productDetails = null, isLoading = false)         │
│     ┌────────────────────────────────────────────────────┐   │
│     │ ⚠ Failed to load product details                  │   │
│     └────────────────────────────────────────────────────┘   │
│     (Red border, destructive variant)                        │
│                                                              │
│  3. SUCCESS (productDetails loaded)                          │
│     ┌────────────────────────────────────────────────────┐   │
│     │ [IMAGE] Product Name              £XX.XX          │   │
│     │         [Variant]                  £X.XX each     │   │
│     │         Addon 1 xN, Addon 2 xM                    │   │
│     │         [- Q +]            [Edit] [Delete]        │   │
│     └────────────────────────────────────────────────────┘   │
│                                                              │
│  4. UPDATING (isUpdatingQuantity = true)                     │
│     - Quantity buttons disabled                              │
│     - Visual feedback during update                          │
│                                                              │
│  5. REMOVING (isRemoving = true)                             │
│     - All actions disabled                                   │
│     - Loading state on delete button                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Price Calculation Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  Price Calculation Logic                      │
└──────────────────────────────────────────────────────────────┘

Input: Cart Item
  └─ itemId: "product-456"
  └─ variantId: "variant-789"
  └─ pricing: [
       { id: "addon-001", quantity: 2 },
       { id: "addon-002", quantity: 1 }
     ]
  └─ quantity: 3

Step 1: Fetch Product Details
  └─ useProductDetails("product-456")
      └─ Returns: ProductDetailsResponse

Step 2: Get Variant Price
  └─ variantList.find(v => v._id === "variant-789")
      └─ variant.price = 1200 pence (£12.00)

Step 3: Calculate Addon Total
  └─ For each pricing item:
      ├─ addon-001: addonList.find(a => a._id === "addon-001")
      │   └─ price: 150 pence × quantity: 2 = 300 pence
      └─ addon-002: addonList.find(a => a._id === "addon-002")
          └─ price: 200 pence × quantity: 1 = 200 pence
  └─ Addon Total = 300 + 200 = 500 pence

Step 4: Calculate Item Price (per unit)
  └─ Item Price = Variant Price + Addon Total
      └─ 1200 + 500 = 1700 pence (£17.00)

Step 5: Calculate Total Price
  └─ Total Price = Item Price × Cart Quantity
      └─ 1700 × 3 = 5100 pence (£51.00)

Display:
  └─ £51.00 (total)
  └─ £17.00 each (if quantity > 1)
```

## Component Interaction Flow

```
User Action          Component               State Change           API Call
───────────         ──────────               ────────────           ────────

[Mount]          → CartItemCard
                    └─ useProductDetails   → isLoading = true    → GET /api/product/details/:id
                                           → productDetails = data
                                           → isLoading = false

[Click +]        → QuantityIncrementor
                    └─ onChange(3)         → isUpdating = true   → PUT /api/cart/:id
                                                                     { quantity: 3 }
                                           → item.quantity = 3
                                           → isUpdating = false

[Click Edit]     → Edit Button
                    └─ onClick()           → showEditModal = true
                                           → EditCartItemModal opens

[Edit Success]   → EditCartItemModal
                    └─ onSuccess()         → showEditModal = false
                                           → onEditSuccess()     → Refetch cart items

[Click Delete]   → Delete Button
                    └─ onClick()           → showRemoveDialog = true
                                           → Confirmation Dialog opens

[Confirm Delete] → Dialog
                    └─ onClick(Remove)     → isRemoving = true   → DELETE /api/cart/:id
                                           → showRemoveDialog = false
                                           → Item removed from cart
```

## Error Handling Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                     Error Scenarios                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. Product Details Fetch Failed                              │
│    ├─ Show: Error state with red border                     │
│    ├─ Log: console.error                                    │
│    └─ Recovery: Manual page refresh                         │
│                                                              │
│ 2. Quantity Update Failed                                    │
│    ├─ Show: Toast error message                             │
│    ├─ Log: console.error                                    │
│    └─ Recovery: Quantity reverts to previous value          │
│                                                              │
│ 3. Item Remove Failed                                        │
│    ├─ Show: Toast error message                             │
│    ├─ Log: console.error                                    │
│    ├─ Action: Dialog stays open                             │
│    └─ Recovery: User can retry                              │
│                                                              │
│ 4. Variant Not Found                                         │
│    ├─ Fallback: Use product base price                      │
│    ├─ Display: No variant badge shown                       │
│    └─ Log: Warning in console                               │
│                                                              │
│ 5. Addon Not Found                                           │
│    ├─ Skip: Filter out missing addons                       │
│    ├─ Display: Only show found addons                       │
│    └─ Log: Warning in console                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌──────────────────────────────────────────────────────────────┐
│                  Optimization Strategies                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 1. Memoization                                               │
│    └─ useMemo for:                                           │
│        ├─ variantInfo extraction                             │
│        ├─ addonInfo mapping                                  │
│        └─ itemPrice calculation                              │
│                                                              │
│ 2. Independent Loading                                       │
│    └─ Each card fetches its own data                        │
│    └─ Parallel requests for multiple items                  │
│    └─ No blocking between cards                             │
│                                                              │
│ 3. Skeleton Loading                                          │
│    └─ Immediate skeleton render                             │
│    └─ No layout shift when data loads                       │
│    └─ Perceived performance improvement                     │
│                                                              │
│ 4. Conditional Rendering                                     │
│    └─ Early returns for loading/error states                │
│    └─ Avoid unnecessary calculations                        │
│                                                              │
│ Future Optimizations:                                        │
│    ├─ Request deduplication (same product)                  │
│    ├─ Batch fetching (all products at once)                 │
│    ├─ Response caching (reduce API calls)                   │
│    └─ Prefetching (on cart page load)                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Type Safety

```typescript
// Cart Item (from API)
CartResponse {
  _id: string;
  itemId: string;           // Product ID
  variantId: string;        // Selected variant
  quantity: number;
  pricing: PricingIdsAndQuantity[];  // Selected addons
}

// Product Details (fetched)
ProductDetailsResponse {
  product: ProductResponse;
  variantList: VariantResponse[];
  addonList: AddonResponse[];
  variantGroupList: VariantGroupResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];
}

// Extracted Variant Info
VariantResponse | null {
  _id: string;
  label: string;
  price: number;
  groupId: string;
}

// Mapped Addon Info
Array<{
  label: string;
  quantity: number;
  price: number;
}>

// Calculated Prices
itemPrice: number;    // Per unit price in pence
itemTotal: number;    // Total price in pence
```

## Component Dependencies Graph

```
CartItemCard
├── External Dependencies
│   ├── react (useState, useMemo)
│   └── lucide-react (Edit2, Trash2)
│
├── UI Components
│   ├── CustomImage
│   ├── Badge
│   ├── Button
│   ├── Skeleton
│   ├── Dialog
│   └── QuantityIncrementor
│
├── Custom Components
│   └── EditCartItemModal
│
├── Hooks
│   └── useProductDetails
│
├── Utilities
│   └── cn (classnames)
│
└── Types
    ├── CartResponse
    ├── ProductDetailsResponse
    ├── VariantResponse
    └── AddonResponse
```
