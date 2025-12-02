# Order Review System - Quick Reference Guide

**Last Updated:** 2025-12-02
**Status:** ✅ Production Ready

---

## Component Structure

```
components/order/review/
├── index.ts                          # Public exports
├── types.ts                          # TypeScript interfaces
├── validation.ts                     # Zod schemas
├── review-dialog.tsx                 # Main dialog container
├── review-form.tsx                   # Form with tabs
├── hooks/
│   └── use-review-form.ts           # Form state hook
├── sections/
│   ├── order-review-section.tsx     # Order rating & message
│   ├── rider-review-section.tsx     # Rider rating & message
│   └── items-review-section.tsx     # Items list with ratings
├── cards/
│   ├── item-review-card.tsx         # Individual item review
│   └── rider-info-display.tsx       # Rider info display
├── display/
│   ├── review-display-card.tsx      # Review display component
│   └── item-review-badge.tsx        # Item review badge
└── animations/
    └── confetti.tsx                  # Success celebration
```

---

## Usage Examples

### Basic Usage

```typescript
import { ReviewDialog } from "@/components/order/review";

function OrderDetailsPage() {
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setReviewOpen(true)}>
        Leave Review
      </Button>

      <ReviewDialog
        order={orderData}
        existingReview={reviewData}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSuccess={() => {
          console.log("Review submitted!");
          // Refresh data, show toast, etc.
        }}
      />
    </>
  );
}
```

### Display Existing Review

```typescript
import { ReviewDisplayCard } from "@/components/order/review";

function OrderSummary({ review }) {
  return (
    <ReviewDisplayCard
      rating={review.overallRatings}
      message={review.overallMessage}
      title="Your Review"
    />
  );
}
```

### Display Item Review Badge

```typescript
import { ItemReviewBadge } from "@/components/order/review";

function OrderItem({ item, itemReview }) {
  return (
    <div>
      <h3>{item.name}</h3>
      {itemReview && (
        <ItemReviewBadge
          rating={itemReview.ratings}
          message={itemReview.message}
        />
      )}
    </div>
  );
}
```

---

## Type Reference

### Main Types

```typescript
// Form data structure
interface ReviewFormData {
  orderRating: number;              // 1-5, required
  orderMessage?: string;            // Optional, max 500 chars
  riderRating?: number;             // 1-5, required if rider exists
  riderMessage?: string;            // Optional, max 500 chars
  items: ItemReviewFormData[];      // Array of item reviews
}

// Item review structure
interface ItemReviewFormData {
  itemId: string;                   // Required
  rating: number;                   // 1-5, required
  message?: string;                 // Optional, max 300 chars
}
```

### Component Props

```typescript
// Dialog props
interface OrderReviewDialogProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Form props (internal)
interface OrderReviewFormProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}
```

---

## Validation Rules

### Order Review
- ✅ Rating: Required, 1-5 stars
- ✅ Message: Optional, max 500 characters

### Rider Review
- ✅ Rating: Required if rider exists, 1-5 stars
- ✅ Message: Optional, max 500 characters

### Item Reviews
- ✅ Rating: Required for each item, 1-5 stars
- ✅ Message: Optional for each item, max 300 characters

### Validation Schema

```typescript
import { createReviewFormSchema } from "@/components/order/review";

// Create schema with rider validation
const schema = createReviewFormSchema(hasRider);

// Use with React Hook Form
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
});
```

---

## API Payload Format

### Request Structure

```typescript
{
  order: {
    orderId: string;
    overallRatings: number;
    overallMessage?: string;
    storeId: string;
    staffId?: string;
    deliveryBoyRatings?: number;      // If rider exists
    deliveryBoyMessage?: string;      // If rider exists
  },
  items: [
    {
      orderId: string;
      itemId: string;
      ratings: number;
      message?: string;
      storeId: string;
    }
  ]
}
```

### Response Structure

```typescript
{
  statusCode: 200,
  data: {
    order: {
      _id: string;
      overallRatings: number;
      overallMessage?: string;
      deliveryBoyRatings?: number;
      deliveryBoyMessage?: string;
      // ... other fields
    },
    items: [
      {
        _id: string;
        itemId: string;
        ratings: number;
        message?: string;
        // ... other fields
      }
    ]
  }
}
```

---

## Custom Hook Usage

### useReviewForm Hook

```typescript
import { useReviewForm } from "@/components/order/review";

function MyCustomForm() {
  const {
    form,           // React Hook Form instance
    onSubmit,       // Submission handler
    isSubmitting,   // Loading state
    submitError,    // Error message
    hasRider        // Whether order has rider
  } = useReviewForm({
    order,
    existingReview,
    onSuccess: () => console.log("Success!")
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

---

## Styling & Theming

### Design Tokens Used

```typescript
// Colors
"primary"              // Primary brand color
"muted-foreground"     // Secondary text
"destructive"          // Error states
"border"               // Border colors

// Spacing (responsive)
"space-y-3 sm:space-y-4"   // Vertical spacing
"gap-2 sm:gap-3"           // Flex/grid gaps
"px-4 sm:px-6"             // Horizontal padding
"py-3 sm:py-4"             // Vertical padding

// Sizes (responsive)
"text-xs sm:text-sm"       // Font sizes
"w-4 h-4 sm:w-5 sm:h-5"    // Icon sizes
"min-h-[44px] sm:min-h-[40px]"  // Touch targets
```

### Custom Styling

```typescript
// Override TextArea styling
<TextArea
  className="min-h-[80px] bg-muted/50"
  {...field}
/>

// Override Card styling
<Card className="border-primary/20 shadow-lg">
  {/* Content */}
</Card>
```

---

## Accessibility Features

### ARIA Attributes

```typescript
// Screen reader announcements
role="status"
aria-live="polite"
aria-label="Review submitted successfully"

// Form accessibility
aria-invalid={!!error}
aria-describedby={errorId}
aria-busy={isSubmitting}

// Hidden labels
<FormLabel className="sr-only">
  Feedback for {item.name}
</FormLabel>
```

### Keyboard Navigation

- Tab: Navigate between fields
- Enter: Submit form
- Esc: Close dialog
- Space: Toggle buttons/checkboxes

### Reduced Motion Support

```typescript
// Respects prefers-reduced-motion
...(typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    { duration: 0 })
```

---

## Performance Tips

### 1. Form Performance
- ✅ Uses React Hook Form (uncontrolled)
- ✅ No unnecessary re-renders
- ✅ Efficient validation

### 2. Bundle Size
- ✅ Components are well-split
- ✅ Lazy load dialog if needed:

```typescript
const ReviewDialog = dynamic(
  () => import("@/components/order/review").then(m => m.ReviewDialog),
  { ssr: false }
);
```

### 3. Animation Performance
- ✅ Uses GPU-accelerated properties
- ✅ Respects reduced motion
- ✅ Optimized with framer-motion

---

## Common Patterns

### 1. Conditional Rider Section

```typescript
// Hook automatically handles rider detection
const { hasRider } = useReviewForm({...});

// Tabs automatically adjust
const tabs = [
  { value: "order", label: "Order" },
  ...(hasRider ? [{ value: "rider", label: "Delivery" }] : []),
  { value: "items", label: "Items" },
];
```

### 2. Pre-filling Existing Review

```typescript
// Automatically pre-fills if existingReview provided
<ReviewDialog
  order={order}
  existingReview={existingReview}  // Can be null
  open={open}
  onOpenChange={setOpen}
/>
```

### 3. Success Callback

```typescript
<ReviewDialog
  {...props}
  onSuccess={() => {
    // Refresh data
    router.refresh();

    // Show toast
    toast.success("Review submitted!");

    // Close dialog (automatic)
    // Analytics
    trackEvent("review_submitted");
  }}
/>
```

---

## Troubleshooting

### Issue: Form not submitting

**Check:**
1. All required fields filled
2. Rider rating if rider exists
3. At least one item rated
4. Network connectivity

### Issue: TypeScript errors

**Check:**
1. Import from correct path
2. Use type imports: `import type { ... }`
3. Check prop types match interface

### Issue: Styling not applied

**Check:**
1. Tailwind classes are valid
2. Custom className not overriding
3. CSS specificity issues

---

## Testing

### Manual Testing Checklist

- [ ] Open dialog
- [ ] Fill order rating
- [ ] Fill order message
- [ ] Fill rider rating (if exists)
- [ ] Fill rider message (if exists)
- [ ] Fill item ratings
- [ ] Fill item messages
- [ ] Submit form
- [ ] See success animation
- [ ] Dialog closes after success
- [ ] Data persists on refresh

### Unit Test Examples

```typescript
describe("ReviewDialog", () => {
  it("renders correctly", () => {
    render(<ReviewDialog {...props} />);
    expect(screen.getByText("Rate Your Order")).toBeInTheDocument();
  });

  it("shows rider section when rider exists", () => {
    const orderWithRider = { ...order, rider: { info: {...} } };
    render(<ReviewDialog order={orderWithRider} {...props} />);
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<ReviewDialog {...props} />);
    const submitButton = screen.getByText("Submit Review");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please select a rating")).toBeInTheDocument();
    });
  });
});
```

---

## Migration Guide

### From Old Review System

If migrating from an old review implementation:

1. **Replace old component:**
   ```typescript
   // Old
   import { OldReviewForm } from "./old-path";

   // New
   import { ReviewDialog } from "@/components/order/review";
   ```

2. **Update props:**
   ```typescript
   // Old
   <OldReviewForm
     orderId={orderId}
     onSubmit={handleSubmit}
   />

   // New
   <ReviewDialog
     order={orderData}
     existingReview={reviewData}
     open={open}
     onOpenChange={setOpen}
     onSuccess={handleSuccess}
   />
   ```

3. **Update API calls:**
   ```typescript
   // Old
   await submitReview({ orderId, rating, message });

   // New (handled by component)
   // Just provide onSuccess callback
   ```

---

## Best Practices

### 1. Always provide onSuccess callback
```typescript
<ReviewDialog
  {...props}
  onSuccess={() => {
    router.refresh();  // Update UI
    // Other side effects
  }}
/>
```

### 2. Handle errors gracefully
```typescript
// Component handles errors internally
// Shows toast and error message
// You can add custom error handling via onSuccess
```

### 3. Pre-fill when editing
```typescript
// Always provide existingReview when editing
<ReviewDialog
  order={order}
  existingReview={existingReview || null}
  {...props}
/>
```

### 4. Use proper TypeScript
```typescript
// Use type imports for interfaces
import type { ReviewFormData } from "@/components/order/review";

// Use proper prop types
const props: OrderReviewDialogProps = {...};
```

---

## Resources

### Documentation
- [Full Code Review Report](./CODE_REVIEW_REPORT.md)
- [Changes Summary](./CHANGES_SUMMARY.md)
- [Original Specification](../../spec/review_spec.md)

### Related Components
- `/components/ui/dialog` - Dialog component
- `/components/ui/form` - Form components
- `/components/ui/textarea` - TextArea component
- `/components/composite/rating` - Rating component

### API Documentation
- `/lib/api/orderReview.ts` - Review API functions
- `/types/orderReview.ts` - Review type definitions

---

## Support

For issues or questions:
1. Check this guide first
2. Review the code review report
3. Check TypeScript errors
4. Test with example data

---

**Last Updated:** 2025-12-02
**Version:** 1.0.0
**Status:** ✅ Production Ready
