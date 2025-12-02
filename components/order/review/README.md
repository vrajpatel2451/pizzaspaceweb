# Order Review System - Types, Validation & Hooks

This directory contains the TypeScript types, Zod validation schemas, and custom hooks for the Order Review system.

## Files Created

### 1. `/components/order/review/types.ts`
**Purpose:** Component prop interfaces and form data types

**Key Exports:**
- `ReviewFormData` - Main form state interface
- `ItemReviewFormData` - Individual item review data
- `OrderReviewDialogProps` - Dialog component props
- `OrderReviewFormProps` - Form component props
- `OrderReviewSectionProps` - Order review section props
- `RiderReviewSectionProps` - Rider review section props
- `ItemsReviewSectionProps` - Items review section props
- `ItemReviewCardProps` - Item card props
- `RiderInfoDisplayProps` - Rider info display props
- `ReviewDisplayCardProps` - Read-only review display props
- `ItemReviewBadgeProps` - Compact item review badge props
- `ReviewSummaryProps` - Full review summary props
- `UseReviewFormOptions` - Hook configuration options
- `UseReviewFormReturn` - Hook return type
- `PayloadConstructionContext` - API payload construction context

**Usage:**
```typescript
import type {
  ReviewFormData,
  OrderReviewSectionProps,
  UseReviewFormReturn
} from "@/components/order/review/types";
```

### 2. `/components/order/review/validation.ts`
**Purpose:** Zod validation schemas for form validation

**Key Exports:**
- `itemReviewSchema` - Validates individual item reviews
- `orderReviewSchema` - Validates order-level review
- `riderReviewSchema` - Validates rider review
- `reviewFormSchema` - Complete form validation schema
- `createReviewFormSchema(hasRider: boolean)` - Conditional validation based on rider presence

**Schema Rules:**
- **Rating:** Required, 1-5 stars
- **Message:** Optional, max 500 characters
- **Items:** Array with at least 1 item, each item requires rating
- **Rider Rating:** Conditionally required (only if `hasRider === true`)

**Usage:**
```typescript
import { createReviewFormSchema } from "@/components/order/review/validation";

const hasRider = Boolean(order.rider?.info);
const schema = createReviewFormSchema(hasRider);

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});
```

### 3. `/components/order/review/hooks/use-review-form.ts`
**Purpose:** Custom hook for form state management and submission

**Hook Signature:**
```typescript
function useReviewForm(options: UseReviewFormOptions): UseReviewFormReturn
```

**Parameters:**
- `order: OrderResponse` - The order being reviewed
- `existingReview: OrderReviewWithItemsResponse | null` - Existing review data (if any)
- `onSuccess?: () => void` - Callback on successful submission

**Returns:**
- `form: UseFormReturn<ReviewFormData>` - React Hook Form instance
- `onSubmit: (data: ReviewFormData) => Promise<void>` - Form submission handler
- `isSubmitting: boolean` - Loading state
- `submitError: string | null` - Error message (if any)
- `hasRider: boolean` - Whether order has a delivery rider

**Features:**
- Automatic default values from existing review
- Conditional rider validation
- API payload construction
- Toast notifications
- Router refresh on success
- Comprehensive error handling

**Usage:**
```typescript
import { useReviewForm } from "@/components/order/review/hooks/use-review-form";

function OrderReviewForm({ order, existingReview, onSuccess, onCancel }) {
  const { form, onSubmit, isSubmitting, submitError, hasRider } = useReviewForm({
    order,
    existingReview,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

## Integration with API

The hook integrates with the existing API layer:

**API Endpoints Used:**
- `createReview(payload: CreateOrderReviewData)` from `@/lib/api/orderReview`

**API Types Used:**
- `CreateOrderReviewData` from `@/types/orderReview`
- `OrderReviewWithItemsResponse` from `@/types/orderReview`

**Payload Construction:**
```typescript
const payload: CreateOrderReviewData = {
  order: {
    orderId: string,
    overallRatings: number,
    overallMessage?: string,
    deliveryBoyRatings?: number,
    deliveryBoyMessage?: string,
    storeId: string,
    staffId?: string,
  },
  items: Array<{
    orderId: string,
    itemId: string,
    ratings: number,
    message?: string,
    storeId: string,
  }>
};
```

## Validation Rules

### Order Review
- **Rating:** Required (1-5)
- **Message:** Optional (max 500 chars)

### Rider Review
- **Rating:** Conditionally required (only if rider exists)
- **Message:** Optional (max 500 chars)

### Item Reviews
- **Rating:** Required for each item (1-5)
- **Message:** Optional per item (max 500 chars)
- **Minimum:** At least 1 item must be reviewed

## Type Safety

All components are fully typed with TypeScript strict mode:
- No `any` types
- Comprehensive interfaces
- Proper type inference from Zod schemas
- Full IntelliSense support

## Error Handling

The hook provides robust error handling:
1. **Validation Errors:** Caught by Zod schema, displayed per-field
2. **API Errors:** Caught in try-catch, stored in `submitError` state
3. **Network Errors:** Handled gracefully with error messages
4. **Toast Notifications:** Success/error feedback to user

## Next Steps

To complete the implementation:
1. Create UI components that use these types
2. Implement form sections using the validation schemas
3. Build display components for read-only review views
4. Integrate into order details page

## Dependencies

- `react-hook-form` ^7.67.0
- `@hookform/resolvers`
- `zod`
- `sonner` (toast notifications)
- `next/navigation` (router)

## Related Documentation

- [Phase 1.3 Architecture Document](/Users/vrajpatel/Documents/personal/pizzaspace_web/docs/review/phase1.3-architecture.md)
- [API Documentation](/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/orderReview.ts)
- [Type Definitions](/Users/vrajpatel/Documents/personal/pizzaspace_web/types/orderReview.ts)
