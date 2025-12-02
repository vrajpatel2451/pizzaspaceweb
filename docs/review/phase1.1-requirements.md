# Order Review Feature - Requirements Document

## Feature Name
**Order Review System with Multi-Section Rating Interface**

## Executive Summary
The Order Review feature allows users to provide comprehensive feedback on completed orders. The system captures three distinct review types: overall order experience, delivery rider performance (conditional), and individual item ratings. The interface must be intuitive, accessible, and prevent duplicate reviews while displaying existing reviews inline with order details.

---

## Components Required

### Core UI Components (shadcn)

| Component | Registry | Purpose | Installation Command |
|-----------|----------|---------|---------------------|
| **dialog** | @shadcn | Main modal container for review form | `npx shadcn@latest add dialog` |
| **form** | @shadcn | Form state management with React Hook Form | `npx shadcn@latest add form` |
| **textarea** | @shadcn | Multi-line text input for review messages | `npx shadcn@latest add textarea` |
| **button** | @shadcn | Primary actions (submit, cancel, trigger) | `npx shadcn@latest add button` |
| **card** | @shadcn | Container for each review section | `npx shadcn@latest add card` |
| **label** | @shadcn | Form field labels | `npx shadcn@latest add label` |
| **separator** | @shadcn | Visual dividers between review sections | `npx shadcn@latest add separator` |
| **scroll-area** | @shadcn | Scrollable content for long item lists | `npx shadcn@latest add scroll-area` |
| **tabs** | @shadcn | Section navigation (Order → Rider → Items) | `npx shadcn@latest add tabs` |

### Existing Custom Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Rating** | `/components/composite/rating.tsx` | Interactive star rating (already exists) |
| **CustomImage** | `/components/ui/custom-image.tsx` | Image display with error handling |

---

## Component Hierarchy

```
OrderDetailsPage
└── OrderDetailsHeader
    └── [Review Trigger Button] ← NEW
        └── OrderReviewDialog ← NEW COMPONENT
            ├── DialogTrigger (hidden, controlled externally)
            ├── DialogContent
            │   ├── DialogHeader
            │   │   ├── DialogTitle: "Rate Your Order"
            │   │   └── DialogDescription: "Share your experience..."
            │   │
            │   ├── Tabs (Review Sections)
            │   │   ├── TabsList
            │   │   │   ├── TabsTrigger: "Order" (always shown)
            │   │   │   ├── TabsTrigger: "Delivery" (conditional: rider exists)
            │   │   │   └── TabsTrigger: "Items" (always shown)
            │   │   │
            │   │   ├── TabsContent: "Order"
            │   │   │   └── Card
            │   │   │       ├── CardHeader: "Overall Experience"
            │   │   │       └── CardContent
            │   │   │           ├── FormField: Rating (interactive)
            │   │   │           └── FormField: Textarea (message)
            │   │   │
            │   │   ├── TabsContent: "Delivery" (conditional)
            │   │   │   └── Card
            │   │   │       ├── CardHeader: "Delivery Rider"
            │   │   │       └── CardContent
            │   │   │           ├── RiderInfoDisplay (name, image)
            │   │   │           ├── FormField: Rating (interactive)
            │   │   │           └── FormField: Textarea (message)
            │   │   │
            │   │   └── TabsContent: "Items"
            │   │       └── ScrollArea
            │   │           └── [Array of Item Review Cards]
            │   │               └── Card (per item)
            │   │                   ├── ItemInfoDisplay (image, name, variant)
            │   │                   ├── FormField: Rating (interactive)
            │   │                   └── FormField: Textarea (message)
            │   │
            │   └── DialogFooter
            │       ├── Button: "Cancel" (variant: outline)
            │       └── Button: "Submit Review" (variant: default)
            │
            └── [Loading/Error States]

OrderInformation (Existing - Enhanced)
└── [Review Display Section] ← CONDITIONAL
    └── Card
        ├── CardHeader: "Your Review"
        └── CardContent
            ├── Rating (read-only)
            └── Text: overallMessage

DeliveryRiderDetails (Existing - Enhanced)
└── [Review Display Section] ← CONDITIONAL
    └── Card
        ├── CardHeader: "Rider Review"
        └── CardContent
            ├── Rating (read-only)
            └── Text: deliveryBoyMessage

OrderItemsList (Existing - Enhanced)
└── [Per Item Enhancement]
    └── [Review Display] ← CONDITIONAL PER ITEM
        ├── Rating (read-only)
        └── Text: itemMessage
```

---

## Data Flow Patterns

### 1. Component Initialization Flow

```
User Opens Order Details Page
    ↓
OrderDetailsPage fetches order data via getOrderDetails(orderId)
    ↓
Parallel API Call: getOrderReview(orderId)
    ↓
┌─────────────────────────────────────────┐
│ API Response Check                       │
├─────────────────────────────────────────┤
│ statusCode === 200 && data exists       │
│   → Review exists                        │
│   → Display reviews inline              │
│   → Hide "Write Review" button          │
│                                          │
│ statusCode === 404 || data === null     │
│   → No review exists                     │
│   → Show "Write Review" button          │
│   → Enable review creation              │
└─────────────────────────────────────────┘
```

### 2. Review Creation Flow

```
User clicks "Write Review" button
    ↓
Open Dialog with Tabs (Order → Rider → Items)
    ↓
Initialize form with default values:
  - All ratings: 0
  - All messages: ""
  - Rider section: conditional on order.rider.info existence
    ↓
User interacts with Rating components
  - Click star → onChange fires
  - Update form state via react-hook-form
    ↓
User types in Textarea fields
  - onChange updates form state
    ↓
User navigates tabs (validation per-tab optional)
    ↓
User clicks "Submit Review"
    ↓
Validate form:
  - Order rating: Required (1-5)
  - Order message: Optional
  - Rider rating: Required IF rider exists (1-5)
  - Rider message: Optional
  - Item ratings: Required for ALL items (1-5)
  - Item messages: Optional per item
    ↓
Construct CreateOrderReviewData payload:
  {
    order: {
      orderId: string,
      overallRatings: number (1-5),
      overallMessage?: string,
      deliveryBoyRatings?: number (1-5),
      deliveryBoyMessage?: string,
      storeId: string,
      staffId?: string
    },
    items: [
      {
        orderId: string,
        itemId: string,
        ratings: number (1-5),
        message?: string,
        storeId: string
      },
      ...
    ]
  }
    ↓
Call API: createReview(payload)
    ↓
┌─────────────────────────────────────────┐
│ API Response Handling                    │
├─────────────────────────────────────────┤
│ Success (statusCode === 200)            │
│   → Close dialog                         │
│   → Refetch order details page          │
│   → Display success toast               │
│   → Reviews now visible inline          │
│                                          │
│ Error (statusCode !== 200)              │
│   → Keep dialog open                     │
│   → Display error message               │
│   → Allow user retry                     │
└─────────────────────────────────────────┘
```

### 3. Review Display Flow (Existing Reviews)

```
Order Details Page renders
    ↓
Check reviewData from getOrderReview()
    ↓
If reviewData exists:
    ↓
OrderInformation section
  → Display reviewData.order.overallRatings
  → Display reviewData.order.overallMessage (if exists)
    ↓
DeliveryRiderDetails section (if rider exists)
  → Display reviewData.order.deliveryBoyRatings (if exists)
  → Display reviewData.order.deliveryBoyMessage (if exists)
    ↓
OrderItemsList items
  → For each item in order.items:
      → Find matching review in reviewData.items by itemId
      → Display item.ratings
      → Display item.message (if exists)
```

---

## State Management

### Form State (React Hook Form)

```typescript
type ReviewFormData = {
  // Order Review
  orderRating: number; // 1-5, required
  orderMessage: string; // optional

  // Rider Review (conditional)
  riderRating?: number; // 1-5, required if rider exists
  riderMessage?: string; // optional

  // Item Reviews (dynamic array)
  items: Array<{
    itemId: string;
    rating: number; // 1-5, required
    message: string; // optional
  }>;
};
```

### UI State

```typescript
type ReviewUIState = {
  dialogOpen: boolean;
  currentTab: 'order' | 'rider' | 'items';
  isSubmitting: boolean;
  submitError: string | null;
};
```

### Validation Rules

```typescript
const validationSchema = {
  orderRating: z.number().min(1, "Please rate your order").max(5),
  orderMessage: z.string().optional(),

  // Conditional validation
  riderRating: z.number().min(1).max(5).optional().refine(
    (val) => hasRider ? val !== undefined : true,
    "Please rate the delivery rider"
  ),
  riderMessage: z.string().optional(),

  items: z.array(z.object({
    itemId: z.string(),
    rating: z.number().min(1, "Please rate this item").max(5),
    message: z.string().optional()
  })).min(1)
};
```

---

## UI State Machine

### States

```
┌─────────────────────────────────────────────────────────────┐
│ IDLE                                                         │
│ - Dialog closed                                              │
│ - User on order details page                                │
│                                                              │
│ Transitions:                                                 │
│   → REVIEW_EXISTS: If getOrderReview returns data           │
│   → NO_REVIEW: If getOrderReview returns 404/null           │
└─────────────────────────────────────────────────────────────┘
                    ↓                           ↓
    ┌───────────────────────────┐   ┌────────────────────────┐
    │ REVIEW_EXISTS              │   │ NO_REVIEW              │
    │ - Hide "Write Review"      │   │ - Show "Write Review"  │
    │ - Display reviews inline   │   │ - Enable button        │
    │                            │   │                        │
    │ Transitions:               │   │ Transitions:           │
    │   → None (terminal state)  │   │   → CREATING (click)   │
    └───────────────────────────┘   └────────────────────────┘
                                                ↓
                            ┌──────────────────────────────┐
                            │ CREATING                      │
                            │ - Dialog open                 │
                            │ - Form initialized            │
                            │ - Default tab: "order"        │
                            │                               │
                            │ Transitions:                  │
                            │   → VALIDATING (submit click) │
                            │   → NO_REVIEW (cancel/close)  │
                            └──────────────────────────────┘
                                        ↓
                            ┌──────────────────────────────┐
                            │ VALIDATING                    │
                            │ - Client-side validation      │
                            │ - Form in review mode         │
                            │                               │
                            │ Transitions:                  │
                            │   → CREATING (invalid)        │
                            │   → SUBMITTING (valid)        │
                            └──────────────────────────────┘
                                        ↓
                            ┌──────────────────────────────┐
                            │ SUBMITTING                    │
                            │ - API call in progress        │
                            │ - Form disabled               │
                            │ - Loading spinner visible     │
                            │                               │
                            │ Transitions:                  │
                            │   → ERROR (API error)         │
                            │   → SUCCESS (API success)     │
                            └──────────────────────────────┘
                        ↓                           ↓
        ┌─────────────────────────┐   ┌────────────────────────┐
        │ ERROR                    │   │ SUCCESS                │
        │ - Dialog open            │   │ - Dialog closes        │
        │ - Error message shown    │   │ - Page refetches       │
        │ - Form re-enabled        │   │ - Toast notification   │
        │                          │   │                        │
        │ Transitions:             │   │ Transitions:           │
        │   → SUBMITTING (retry)   │   │   → REVIEW_EXISTS      │
        │   → NO_REVIEW (cancel)   │   └────────────────────────┘
        └─────────────────────────┘
```

---

## Implementation Notes

### 1. Conditional Rendering Logic

```typescript
// Rider review section visibility
const hasRider = order?.rider?.info !== undefined;

// Show/hide rider tab
{hasRider && (
  <TabsTrigger value="rider">Delivery</TabsTrigger>
)}

// Review button visibility
const canReview = !reviewData && order.status === 'delivered';
```

### 2. Form Initialization

```typescript
const defaultValues = {
  orderRating: 0,
  orderMessage: "",
  ...(hasRider && {
    riderRating: 0,
    riderMessage: ""
  }),
  items: order.items.map(item => ({
    itemId: item._id,
    rating: 0,
    message: ""
  }))
};
```

### 3. API Payload Construction

```typescript
const constructPayload = (formData: ReviewFormData): CreateOrderReviewData => ({
  order: {
    orderId: order._id,
    overallRatings: formData.orderRating,
    overallMessage: formData.orderMessage || undefined,
    ...(hasRider && formData.riderRating && {
      deliveryBoyRatings: formData.riderRating,
      deliveryBoyMessage: formData.riderMessage || undefined
    }),
    storeId: order.seller.info._id,
    staffId: order.rider?.info?._id
  },
  items: formData.items.map(item => ({
    orderId: order._id,
    itemId: item.itemId,
    ratings: item.rating,
    message: item.message || undefined,
    storeId: order.seller.info._id
  }))
});
```

### 4. Existing Review Display

```typescript
// In OrderInformation component
{reviewData?.order && (
  <div className="mt-4 space-y-2">
    <Label>Your Review</Label>
    <Rating value={reviewData.order.overallRatings} size="sm" />
    {reviewData.order.overallMessage && (
      <p className="text-sm text-muted-foreground">
        {reviewData.order.overallMessage}
      </p>
    )}
  </div>
)}
```

### 5. Rating Component Integration

```typescript
// Interactive mode for form
<FormField
  control={form.control}
  name="orderRating"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Rate Your Order</FormLabel>
      <FormControl>
        <Rating
          value={field.value}
          onChange={field.onChange}
          interactive
          size="lg"
          showValue
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Display mode for existing reviews
<Rating
  value={reviewData.order.overallRatings}
  size="default"
  interactive={false}
  showValue
/>
```

---

## Accessibility Requirements (WCAG 2.1 AA Compliance)

### Keyboard Navigation

- [ ] **Tab Order**: All interactive elements (ratings, textareas, buttons) must be keyboard accessible in logical order
- [ ] **Enter Key**: Dialog opens with Enter on trigger button
- [ ] **Escape Key**: Dialog closes with Escape key
- [ ] **Arrow Keys**: Star ratings navigable with Left/Right arrow keys
- [ ] **Tab Navigation**: Tabs navigable with Left/Right arrows (Radix UI default)
- [ ] **Focus Trap**: Focus remains within dialog when open

### Screen Reader Support

- [ ] **Dialog Announcements**:
  - Dialog title announced when opened
  - Current tab announced on change
- [ ] **Rating Labels**:
  - `aria-label="Rate order: {value} out of 5 stars"`
  - Interactive mode: `role="radiogroup"`
  - Display mode: `role="img"`
- [ ] **Form Fields**:
  - All fields have associated `<label>` elements
  - Error messages linked with `aria-describedby`
  - Required fields marked with `aria-required="true"`
- [ ] **Live Regions**:
  - Form errors announced with `aria-live="polite"`
  - Success toast announced with `aria-live="assertive"`
- [ ] **Item List**: Each item review section has descriptive heading

### Visual Accessibility

- [ ] **Focus Indicators**:
  - Visible focus ring on all interactive elements (2px solid primary color)
  - Minimum 3:1 contrast ratio for focus indicators
- [ ] **Color Contrast**:
  - Text: Minimum 4.5:1 contrast ratio
  - Large text (18pt+): Minimum 3:1 contrast ratio
  - Star ratings: Yellow stars (#FACC15) have sufficient contrast against backgrounds
- [ ] **Text Sizing**:
  - Minimum 16px font size for body text
  - Support text zoom up to 200%
- [ ] **Error States**:
  - Errors indicated by both color AND icon/text
  - Not solely reliant on color

### Touch/Mobile Accessibility

- [ ] **Touch Targets**: Minimum 44x44px for all interactive elements
- [ ] **Star Ratings**:
  - Touch-friendly spacing between stars
  - Half-star rating via touch position detection
- [ ] **Scrollable Content**:
  - Item list scrollable with touch gestures
  - Scroll indicators visible
- [ ] **Dialog Sizing**: Responsive, doesn't overflow on small screens

### Semantic HTML

- [ ] **Heading Hierarchy**:
  - Dialog title: `<h2>`
  - Section titles: `<h3>`
  - Subsection titles: `<h4>`
- [ ] **Form Structure**:
  - Use `<form>` element
  - Proper `<fieldset>` for related fields
  - `<legend>` for fieldset descriptions
- [ ] **Lists**: Item reviews in semantic `<ul>` or `<ol>` structure

---

## Validation Rules

### Client-Side Validation

```typescript
const validationRules = {
  orderRating: {
    required: "Please rate your overall order experience",
    min: { value: 1, message: "Rating must be at least 1 star" },
    max: { value: 5, message: "Rating cannot exceed 5 stars" }
  },

  orderMessage: {
    maxLength: { value: 500, message: "Message cannot exceed 500 characters" }
  },

  riderRating: {
    // Conditional: only required if rider exists
    validate: (value) => {
      if (!hasRider) return true;
      if (!value || value < 1) return "Please rate the delivery rider";
      return true;
    }
  },

  riderMessage: {
    maxLength: { value: 500, message: "Message cannot exceed 500 characters" }
  },

  items: {
    validate: (items) => {
      const allRated = items.every(item => item.rating >= 1 && item.rating <= 5);
      if (!allRated) return "Please rate all items";
      return true;
    }
  },

  "items.*.rating": {
    required: "Please rate this item",
    min: { value: 1, message: "Rating must be at least 1 star" },
    max: { value: 5, message: "Rating cannot exceed 5 stars" }
  },

  "items.*.message": {
    maxLength: { value: 500, message: "Message cannot exceed 500 characters" }
  }
};
```

### Real-Time Validation

- **On Blur**: Validate individual fields when user leaves input
- **On Submit**: Validate entire form before API call
- **Visual Feedback**:
  - Invalid fields: Red border + error message below
  - Valid fields: Green checkmark (optional)
  - Pristine fields: Default styling

### Error Display Pattern

```typescript
// Field-level errors
<FormField>
  <FormControl>
    <Textarea {...field} />
  </FormControl>
  <FormMessage /> {/* Shows field-specific error */}
</FormField>

// Form-level errors (API errors)
{submitError && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Submission Failed</AlertTitle>
    <AlertDescription>{submitError}</AlertDescription>
  </Alert>
)}
```

---

## Performance Considerations

### 1. Dialog Lazy Loading
```typescript
// Load dialog content only when opened
const [dialogOpen, setDialogOpen] = useState(false);

{dialogOpen && (
  <OrderReviewDialog
    order={order}
    onClose={() => setDialogOpen(false)}
  />
)}
```

### 2. Form Optimization
- Use `react-hook-form` with uncontrolled components
- Avoid unnecessary re-renders with `useCallback` for handlers
- Debounce textarea validation (300ms)

### 3. API Optimization
- Parallel fetch: `getOrderDetails()` and `getOrderReview()`
- Cache review data to prevent refetch on navigation
- Optimistic UI update on successful submission

### 4. Image Optimization
- Use `CustomImage` component for item images
- Lazy load item images in scroll area
- Low-quality placeholder while loading

---

## Error Handling Strategies

### API Error Scenarios

| Scenario | Status Code | User Feedback | Action |
|----------|-------------|---------------|--------|
| **Duplicate Review** | 409 | "You've already reviewed this order" | Close dialog, display inline reviews |
| **Invalid Data** | 400 | "Please check your input and try again" | Keep dialog open, highlight errors |
| **Unauthorized** | 401 | "Please log in to submit review" | Redirect to login |
| **Order Not Found** | 404 | "Order not found" | Redirect to order history |
| **Server Error** | 500 | "Something went wrong. Please try again" | Keep dialog open, enable retry |
| **Network Error** | - | "Network error. Check your connection" | Keep dialog open, enable retry |

### Client-Side Error Handling

```typescript
const handleSubmit = async (data: ReviewFormData) => {
  try {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = constructPayload(data);
    const response = await createReview(payload);

    if (response.statusCode !== 200) {
      throw new Error(response.errorMessage || "Failed to submit review");
    }

    // Success
    toast.success("Review submitted successfully!");
    setDialogOpen(false);
    router.refresh(); // Refetch order details

  } catch (error) {
    setSubmitError(error.message);
    // Keep dialog open for retry
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Testing Checklist

### Functional Testing

- [ ] Dialog opens when "Write Review" clicked
- [ ] Dialog closes on Cancel/Escape/Outside click
- [ ] All tabs accessible and functional
- [ ] Rider tab hidden when no rider assigned
- [ ] Star ratings update on click/hover
- [ ] Half-star precision works correctly
- [ ] Textarea character count displayed
- [ ] Form validation triggers correctly
- [ ] API payload constructed correctly
- [ ] Success flow: dialog closes, page refreshes, reviews visible
- [ ] Error flow: dialog stays open, error message shown
- [ ] Existing reviews display correctly in order details
- [ ] "Write Review" button hidden when review exists

### Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Screen reader announces all elements correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets minimum 44x44px
- [ ] Form errors announced to screen readers
- [ ] Dialog traps focus correctly
- [ ] Semantic HTML validated

### Edge Cases

- [ ] Order with no items (shouldn't happen, but handle gracefully)
- [ ] Order with 1 item vs 20 items (scroll behavior)
- [ ] Very long review messages (500 char limit enforced)
- [ ] Rapid clicking submit button (debounce/disable)
- [ ] Network timeout during submission
- [ ] User navigates away during submission
- [ ] Rider assigned mid-order (dynamic rider tab)
- [ ] Multiple users reviewing same order (race condition)

### Browser/Device Testing

- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)
- [ ] Responsive: 320px, 375px, 768px, 1024px, 1920px

---

## Design Guidelines Integration

### Spacing & Layout

- Dialog max-width: `600px` (comfortable reading width)
- Section padding: `p-6` (24px)
- Element spacing: `space-y-4` (16px between sections)
- Card padding: `p-4` (16px internal)

### Typography

- Dialog title: `text-xl font-semibold`
- Section headers: `text-lg font-medium`
- Body text: `text-sm` (14px minimum)
- Helper text: `text-xs text-muted-foreground`

### Colors (Tailwind CSS)

- Primary action: `bg-primary text-primary-foreground`
- Secondary action: `variant="outline"`
- Destructive: `variant="destructive"` (for cancel if needed)
- Star ratings: `text-yellow-400` (filled), `text-gray-300` (empty)
- Error text: `text-destructive`
- Success text: `text-green-600`

### Animations

- Dialog enter: `animate-in fade-in-0 zoom-in-95` (Radix UI default)
- Dialog exit: `animate-out fade-out-0 zoom-out-95`
- Tab transition: `transition-all duration-200`
- Star hover: `transition-transform hover:scale-110`

---

## Installation Commands Summary

```bash
# Install all required shadcn components
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add tabs

# Optional: Install if needed for toast notifications
npx shadcn@latest add toast

# Optional: Install if alert component needed for errors
npx shadcn@latest add alert
```

---

## File Structure

```
/components/order/review/
├── order-review-dialog.tsx          # Main dialog component
├── order-review-section.tsx         # Order rating section
├── rider-review-section.tsx         # Rider rating section (conditional)
├── items-review-section.tsx         # Items rating section with scroll
└── review-display.tsx               # Reusable review display component

/lib/hooks/
└── use-order-review.ts              # Custom hook for review logic

/types/
└── orderReview.ts                   # Already exists (types defined)

/lib/api/
└── orderReview.ts                   # Already exists (API functions defined)

/app/(protected)/order/[orderId]/
└── page.tsx                         # Integration point (enhance existing)
```

---

## Next Steps (Implementation Phases)

### Phase 1: Foundation
1. Install shadcn components
2. Create basic dialog structure
3. Implement order review section
4. Add form validation

### Phase 2: Extended Features
1. Add rider review section (conditional logic)
2. Implement items review section with scroll
3. Add tab navigation
4. Integrate with existing Rating component

### Phase 3: Integration
1. Fetch review data on page load
2. Display existing reviews inline
3. Conditional button visibility
4. API integration for submission

### Phase 4: Polish
1. Add loading states
2. Implement error handling
3. Add success notifications
4. Accessibility audit

### Phase 5: Testing
1. Unit tests for form logic
2. Integration tests for API calls
3. E2E tests for user flows
4. Accessibility testing with WAVE/axe

---

## API Integration Reference

### Endpoints

```typescript
// Create review
POST /review/review-order
Body: CreateOrderReviewData
Response: APIResponse<OrderReviewWithItemsResponse>

// Get review
GET /review/get-review/:orderId
Response: APIResponse<OrderReviewWithItemsResponse>
```

### Type Definitions (Already Defined)

```typescript
// Located in /types/orderReview.ts
export type OrderReviewResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  staffId?: string;
  overallRatings: number;
  overallMessage?: string;
  deliveryBoyRatings?: number;
  deliveryBoyMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemReviewResponse = {
  _id: string;
  orderId: string;
  itemId: string;
  userId: string;
  storeId: string;
  ratings: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateOrderReviewData {
  order: {
    orderId: string;
    overallRatings: number;
    overallMessage?: string;
    deliveryBoyRatings?: number;
    deliveryBoyMessage?: string;
    storeId: string;
    staffId?: string;
  };
  items: Array<{
    orderId: string;
    itemId: string;
    ratings: number;
    message?: string;
    storeId: string;
  }>;
}

export type OrderReviewWithItemsResponse = {
  order: OrderReviewResponse;
  items: OrderItemReviewResponse[];
};
```

---

## Conclusion

This requirements document provides a comprehensive blueprint for implementing the Order Review feature. The component hierarchy leverages shadcn's accessible, composable UI primitives while integrating with the existing codebase architecture. The data flow is clearly defined, conditional logic is documented, and accessibility is prioritized throughout.

Key architectural decisions:
- **Dialog-based UI** for focused review experience
- **Tab-based navigation** for clear section separation
- **Conditional rendering** for rider reviews
- **Inline review display** in existing order details sections
- **Reusable Rating component** for consistency
- **React Hook Form** for robust form management
- **WCAG 2.1 AA compliance** for accessibility

The implementation can proceed in phases, with each phase building on the previous foundation while maintaining code quality and user experience standards.