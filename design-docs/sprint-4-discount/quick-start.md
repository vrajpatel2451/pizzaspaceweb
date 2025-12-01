# Discount Features - Quick Start Guide

## Installation

No additional dependencies required. All components use existing project dependencies.

## Basic Usage

### 1. Import the Discount Section

```tsx
import { DiscountSection } from "@/components/cart/discount-section";
```

### 2. Fetch Available Discounts

```tsx
import { getDiscounts } from "@/lib/api/discount";

const response = await getDiscounts({
  cartIds: ["cart-1", "cart-2"],
  storeId: "store-123",
});

const discounts = response.data;
```

### 3. Add to Cart Page

```tsx
<DiscountSection
  availableDiscounts={allDiscounts}
  appliedDiscounts={appliedDiscounts}
  totalSavings={25.50}
  onApplyCode={async (code) => {
    // Validate and apply code
    return { success: true, message: "Applied successfully" };
  }}
  onApplyDiscount={async (id) => {
    // Apply discount by ID
  }}
  onRemoveDiscount={async (id) => {
    // Remove discount by ID
  }}
/>
```

## Individual Components

### Discount Card

```tsx
import { DiscountCard } from "@/components/discount";

<DiscountCard
  discount={discountData}
  isApplied={false}
  onApply={(id) => console.log("Apply:", id)}
/>
```

### Discount Input

```tsx
import { DiscountInput } from "@/components/discount";

<DiscountInput
  value={code}
  onChange={setCode}
  onApply={handleApply}
  error={error}
/>
```

### Applied Discounts

```tsx
import { AppliedDiscounts } from "@/components/discount";

<AppliedDiscounts
  discounts={applied}
  totalSavings={25.50}
  onRemove={(id) => console.log("Remove:", id)}
/>
```

### Discount Modal

```tsx
import { DiscountModal } from "@/components/discount";

<DiscountModal
  open={showModal}
  onOpenChange={setShowModal}
  discounts={allDiscounts}
  appliedDiscountIds={["id1"]}
  onApply={handleApply}
/>
```

## Component Files

All components are located in:
- `/components/discount/` - Individual discount components
- `/components/cart/discount-section.tsx` - Main integration component

## API Types

The components use these TypeScript types from `/types/discount.ts`:

```typescript
interface DiscountResponse {
  _id: string;
  name: string;
  description: string;
  couponCode: string;
  hideFromSuggestion: boolean;
  discountAmount: number;
  discountAmountType: "fix" | "percentage";
  maximumAmount: number;
  conditionType: "allProducts" | "selectedCategories" | "selectedProducts";
  referenceIds: string[];
  storeId: string;
  startTime: Date;
  endTime: Date;
  isNeverEnding: boolean;
  customerType: "allCustomers" | "newCustomers";
  customerIds: string[];
  discountType: "normal" | "packaging" | "deliveryCharges" | "extraCharges";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Styling

All components use Tailwind CSS and are fully responsive. They adapt to:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

Dark mode is automatically supported via Tailwind's dark mode classes.

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader friendly
- Focus visible indicators
- High contrast mode support

## Error Handling

All components handle errors gracefully with:
- Toast notifications (via Sonner)
- Inline error messages
- Loading states
- Disabled states when appropriate

## Animation Features

- Success confetti on discount application
- Smooth expand/collapse transitions
- Enter/exit animations for discount chips
- Hover effects on interactive elements

## Next Steps

1. Integrate `DiscountSection` into your cart page
2. Connect to your discount API endpoints
3. Test on different screen sizes
4. Verify accessibility with screen readers
5. Test error scenarios

## Support

For detailed documentation, see:
- `/design-docs/sprint-4-discount/implementation.md`

## File Sizes

- discount-section.tsx: 7.6 KB
- discount-card.tsx: 8.1 KB
- discount-modal.tsx: 5.6 KB
- applied-discounts.tsx: 3.7 KB
- discount-validity.tsx: 2.9 KB
- discount-input.tsx: 2.5 KB
- discount-amount.tsx: 1.2 KB
- discount-type-badge.tsx: 1.3 KB
- empty-discounts.tsx: 1.0 KB

Total: ~34 KB of component code
