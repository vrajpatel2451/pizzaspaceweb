# Order Review System - Component Research & Design Patterns
## Phase 1.2 Research Document

**Research Date:** December 2, 2025
**Focus:** UI Components, Form Patterns, and Design Inspiration for Order Review Feature
**Status:** Complete Research Phase

---

## Table of Contents

1. [Core Components Research](#core-components-research)
2. [Form Patterns & Validation](#form-patterns--validation)
3. [Dialog/Modal Patterns](#dialogmodal-patterns)
4. [Review UI Inspiration](#review-ui-inspiration)
5. [Implementation Patterns](#implementation-patterns)
6. [Installation Commands](#installation-commands)
7. [Recommended Architecture](#recommended-architecture)

---

## Core Components Research

### 1. Dialog Component

**Registry:** @shadcn/dialog
**Dependencies:** @radix-ui/react-dialog
**Status:** Stable & Production-Ready

**Key Features:**
- Modal overlay with backdrop blur
- Accessibility built-in (focus management, keyboard navigation)
- Responsive positioning
- Smooth animations (fade-in/zoom-in)
- Portal rendering to avoid z-index stacking issues

**Component Structure:**
```
Dialog (root)
├── DialogTrigger (button to open)
├── DialogContent (modal container)
│   ├── DialogHeader
│   │   ├── DialogTitle
│   │   └── DialogDescription
│   ├── DialogBody (scrollable content)
│   └── DialogFooter (action buttons)
└── DialogClose (close button, can be inline)
```

**Use Cases for Order Review:**
- Primary container for the entire review form
- Can be non-scrollable header/footer with scrollable content area
- Supports tabs within the dialog for multi-step reviews

---

### 2. Form Component

**Registry:** @shadcn/form
**Dependencies:** react-hook-form, zod, @hookform/resolvers, @radix-ui/react-label, @radix-ui/react-slot
**Status:** Stable & Production-Ready

**Key Features:**
- React Hook Form integration
- Zod schema validation
- FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
- Automatic error state management
- Field-level validation with visual feedback

**Form Structure Example:**
```tsx
const formSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10).max(500),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { rating: 0, reviewText: "" }
})
```

**Best Practices:**
- Use FormField with Controller for controlled inputs
- Combine with Zod for schema validation
- Provide FormDescription for helpful hints
- Display FormMessage for validation errors

---

### 3. Textarea Component

**Registry:** @shadcn/textarea
**Status:** Stable & Production-Ready

**Key Features:**
- Resizable (controlled via CSS)
- Full validation support
- Character counting capability
- Accessibility compliant

**Integration Pattern:**
```tsx
<FormField
  control={form.control}
  name="reviewText"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Review</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Share your experience..."
          className="resize-none"
          {...field}
        />
      </FormControl>
      <FormDescription>
        Minimum 10, maximum 500 characters
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### 4. Tabs Component

**Registry:** @shadcn/tabs
**Dependencies:** @radix-ui/react-tabs
**Status:** Stable & Production-Ready

**Key Features:**
- Multi-section content organization
- Keyboard navigation (arrow keys)
- Perfect for tabbed review sections
- Visual indicator of active tab

**Structure for Multi-Section Reviews:**
```tsx
<Tabs defaultValue="order" className="w-full">
  <TabsList>
    <TabsTrigger value="order">Order</TabsTrigger>
    <TabsTrigger value="rider">Delivery Rider</TabsTrigger>
    <TabsTrigger value="items">Items</TabsTrigger>
  </TabsList>

  <TabsContent value="order">
    {/* Order review form */}
  </TabsContent>
  <TabsContent value="rider">
    {/* Rider review form */}
  </TabsContent>
  <TabsContent value="items">
    {/* Items review form */}
  </TabsContent>
</Tabs>
```

---

### 5. Button Component

**Registry:** @shadcn/button
**Dependencies:** @radix-ui/react-slot
**Status:** Stable & Production-Ready

**Key Variants:**
- `default` - Primary action (submit)
- `outline` - Secondary action (cancel)
- `destructive` - Danger action
- `ghost` - Minimal style
- `loading` - Loading state support

**Usage in Review Dialog:**
```tsx
<DialogFooter>
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Submit Review</Button>
</DialogFooter>
```

---

### 6. ScrollArea Component

**Registry:** @shadcn/scroll-area
**Dependencies:** @radix-ui/react-scroll-area
**Status:** Stable & Production-Ready

**Key Features:**
- Custom scrollbar styling
- Smooth scrolling experience
- Works in both vertical and horizontal directions
- Perfect for scrollable list of items being reviewed

**Use Case - Items List:**
```tsx
<ScrollArea className="h-64 w-full border rounded-md">
  <div className="p-4">
    {orderItems.map(item => (
      <div key={item.id} className="mb-4">
        {/* Item review section */}
      </div>
    ))}
  </div>
</ScrollArea>
```

---

### 7. Card Component

**Registry:** @shadcn/card
**Status:** Stable & Production-Ready

**Components:**
- Card (container)
- CardHeader (title area)
- CardTitle
- CardDescription
- CardContent (main content)
- CardFooter (action area)

**Use Cases:**
- Individual item review cards within scrollable list
- Read-only review display cards
- Success state presentation

---

### 8. Badge Component

**Registry:** @shadcn/badge
**Dependencies:** @radix-ui/react-slot
**Status:** Stable & Production-Ready

**Key Variants:**
- `default` - Primary badge
- `secondary` - Secondary badge
- `destructive` - Red/error badge
- `outline` - Bordered badge

**Use Cases for Reviews:**
- Rating badges (★★★★☆)
- Status badges ("Verified", "Pending")
- Category labels

---

### 9. Alert Component

**Registry:** @shadcn/alert
**Status:** Stable & Production-Ready

**Key Variants:**
- `default` - Info alerts
- `destructive` - Error alerts

**Use Cases:**
- Success message after review submission
- Error messages during form submission
- Important notices

**Example:**
```tsx
<Alert>
  <CheckCircle2Icon />
  <AlertTitle>Review Submitted</AlertTitle>
  <AlertDescription>
    Thank you! Your review helps other customers.
  </AlertDescription>
</Alert>
```

---

### 10. Label Component

**Registry:** @shadcn/label
**Dependencies:** @radix-ui/react-label
**Status:** Stable & Production-Ready

**Used By:** FormLabel (within Form component)
**Features:** Accessibility compliant, associated with form controls via htmlFor

---

## Form Patterns & Validation

### Pattern 1: Simple Textarea Form with React Hook Form

**Example:** Basic review text input with validation

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters." })
    .max(160, { message: "Bio must not be longer than 160 characters." }),
})

export default function ReviewForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Review submitted!")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share what you liked or improvements needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Review</Button>
      </form>
    </Form>
  )
}
```

### Pattern 2: Complex Form with Multiple Field Types

**Example:** Complete review form with ratings, selections, and text

This pattern combines:
- Radio Groups (for ratings)
- Select dropdowns
- Checkboxes (for multi-select items)
- Textareas (for comments)
- Switches (for toggles)
- Full validation on all fields

**Key Implementation Details:**
- Use `Controller` from react-hook-form for complex inputs
- Validate arrays with `.array().min()` and `.max()`
- Use `refine()` for custom validation logic
- Display errors with `FieldError` component
- Use `FieldSeparator` to organize groups

---

## Dialog/Modal Patterns

### Pattern 1: Dialog with Inline Form

**Best For:** Simple reviews within a dialog

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ReviewDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Write Review</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Order</DialogTitle>
            <DialogDescription>
              Share your experience with this order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" type="number" min="1" max="5" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="review">Review</Label>
              <Input id="review" placeholder="Your review..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
```

### Pattern 2: Responsive Modal (Dialog + Drawer)

**Best For:** Mobile-friendly reviews (dialog on desktop, drawer on mobile)

Key Features:
- Automatically switches between Dialog and Drawer based on screen size
- Uses `useMediaQuery` hook to detect breakpoint
- Same API for both implementations
- Optional FormFooter with loading state

---

## Review UI Inspiration

### 1. Rating Group Component

**Source:** 21st.dev
**Use Case:** Interactive star rating selector

**Key Pattern:**
- 5-star rating system
- Half-star support
- Hover effects with scaling
- Label display ("Poor", "Fair", "Good", "Very Good", "Excellent")
- Smooth transitions

**Implementation Approach:**
- Use existing Rating component at `components/composite/rating.tsx`
- Alternatively integrate @ark-ui/react-rating-group
- Visual feedback with color changes (yellow for selected)

---

### 2. Product Review Component

**Source:** 21st.dev
**Use Case:** Complete review capture form

**Structure:**
```
Product Card
├── Product Image / Icon
├── Product Name & Description
├── Rating Input (with labels)
├── Review Textarea
└── Submit Button
```

**Key Features:**
- Visual product context
- Clear rating labels
- Placeholder text guidance
- Focused UX (minimal fields)

---

### 3. User Feedback Block

**Source:** 21st.dev
**Use Case:** Multi-type feedback system

**Components:**
- Tabs for different feedback types (Star, Emoji, Thumbs Up/Down)
- Dynamic form based on selected type
- Textarea for additional comments
- Success state message
- Form reset after submission

**Adaptability:**
- Could be adapted for multi-section reviews
- Shows pattern for switching between different input types
- Demonstrates state management with submitted states

---

## Implementation Patterns

### Pattern 1: Dialog + Tabs + Form (Recommended for Order Review)

**Structure:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Review Order #{orderId}</DialogTitle>
      <DialogDescription>
        Share your feedback to help us improve
      </DialogDescription>
    </DialogHeader>

    <Tabs defaultValue="overall">
      <TabsList>
        <TabsTrigger value="overall">Order</TabsTrigger>
        <TabsTrigger value="rider">Delivery</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
      </TabsList>

      <TabsContent value="overall">
        {/* Order review form */}
      </TabsContent>
      <TabsContent value="rider">
        {/* Rider review form */}
      </TabsContent>
      <TabsContent value="items">
        {/* Items review list with individual ratings */}
      </TabsContent>
    </Tabs>

    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Submit Review</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Advantages:**
- Clean separation of concerns
- Logical flow (order → delivery → items)
- Efficient use of space
- Tab navigation is intuitive

---

### Pattern 2: Dialog + ScrollArea + Form (For Item-by-Item Reviews)

**Structure:**
```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rate Items</DialogTitle>
    </DialogHeader>

    <ScrollArea className="h-72 w-full">
      <div className="p-4 space-y-4">
        {orderItems.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Image src={item.image} alt={item.name} />
                <div className="flex-1">
                  <h4>{item.name}</h4>
                  {/* Rating input for item */}
                  {/* Review textarea for item */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>

    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Submit All Reviews</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Advantages:**
- Handles long lists gracefully
- Item context preserved
- Individual review capture
- Scalable to many items

---

### Pattern 3: Dialog + Stepper (For Sequential Reviews)

**Structure:**
- Step 1: Overall order rating
- Step 2: Delivery rating
- Step 3: Individual item ratings
- Step 4: Review summary

**Advantages:**
- Clear progress indication
- Guided flow
- Can show summary before final submit
- Easier to handle large forms

---

## Installation Commands

### Install All Review Components (One Command)

```bash
npx shadcn@latest add @shadcn/dialog @shadcn/form @shadcn/textarea @shadcn/input @shadcn/tabs @shadcn/button @shadcn/scroll-area @shadcn/card @shadcn/badge @shadcn/alert @shadcn/label
```

### Install Individual Components (As Needed)

```bash
# Core dialog and form
npx shadcn@latest add @shadcn/dialog
npx shadcn@latest add @shadcn/form

# Input components
npx shadcn@latest add @shadcn/textarea
npx shadcn@latest add @shadcn/input

# Layout & organization
npx shadcn@latest add @shadcn/tabs
npx shadcn@latest add @shadcn/scroll-area
npx shadcn@latest add @shadcn/card

# Actions & feedback
npx shadcn@latest add @shadcn/button
npx shadcn@latest add @shadcn/alert
npx shadcn@latest add @shadcn/badge

# Form labels
npx shadcn@latest add @shadcn/label
```

### Peer Dependencies (Already in Project)

These should already be installed:
- react-hook-form
- zod
- @hookform/resolvers
- @radix-ui/react-* (various)
- class-variance-authority
- lucide-react
- sonner (for toast notifications)

---

## Recommended Architecture

### Component Structure

```
components/
├── features/
│   └── review/
│       ├── ReviewDialog.tsx (main container)
│       ├── ReviewForm.tsx (form logic)
│       ├── ReviewTabs.tsx (tab organization)
│       ├── sections/
│       │   ├── OverallReviewSection.tsx
│       │   ├── RiderReviewSection.tsx
│       │   └── ItemsReviewSection.tsx
│       ├── items/
│       │   ├── RatingInput.tsx (reusable rating control)
│       │   └── ReviewTextarea.tsx (reusable textarea)
│       └── feedback/
│           ├── SuccessAlert.tsx
│           └── ErrorAlert.tsx
```

### Key Component Interfaces

**ReviewDialog**
- Props: `open`, `onOpenChange`, `orderId`
- Purpose: Container for entire review flow

**ReviewForm**
- Props: `orderId`, `onSubmit`
- State: Form validation, submission state
- Purpose: Form logic and submission

**RatingInput**
- Props: `value`, `onChange`, `label`, `max=5`
- Purpose: Reusable star rating component
- Note: Can wrap existing Rating component

**ReviewTextarea**
- Props: `value`, `onChange`, `placeholder`, `maxLength`
- Purpose: Review text input with character count
- Features: Validation feedback, character counter

---

## Validation Schema Example

```typescript
const reviewSchema = z.object({
  orderId: z.string(),

  // Overall order review
  overallRating: z.number().min(1).max(5),
  overallReview: z.string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters allowed")
    .optional(),

  // Rider/delivery review
  riderRating: z.number().min(1).max(5).optional(),
  riderReview: z.string()
    .min(10)
    .max(500)
    .optional(),

  // Item reviews
  itemReviews: z.array(
    z.object({
      itemId: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string()
        .min(5)
        .max(300)
        .optional(),
    })
  ).optional(),

  // Optional details
  wouldRecommend: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>
```

---

## Integration with Existing Rating Component

Your project already has `components/composite/rating.tsx`. The research shows:

1. **Option A: Use Existing Rating Component**
   - Wrap it in FormField from @shadcn/form
   - Integrate with react-hook-form
   - Customize styling as needed

2. **Option B: Create Rating Input Wrapper**
   ```tsx
   export function RatingInput(props: RatingInputProps) {
     return (
       <div className="space-y-2">
         <Label>{props.label}</Label>
         <YourExistingRatingComponent {...props} />
         <FormDescription>{props.description}</FormDescription>
       </div>
     )
   }
   ```

3. **Option C: Extend Rating Component**
   - Add form integration directly to existing component
   - Support aria-invalid for accessibility
   - Add description slot

---

## Success Criteria Checklist

- [ ] Dialog opens/closes smoothly
- [ ] Form validation works on all fields
- [ ] Rating inputs integrate seamlessly
- [ ] Textarea character limits enforce properly
- [ ] Multiple sections (tabs) switch without data loss
- [ ] Submit button shows loading state
- [ ] Success/error alerts display appropriately
- [ ] Mobile responsive (consider drawer for mobile)
- [ ] Keyboard navigation works (tabs, enter to submit)
- [ ] Accessibility compliant (labels, ARIA attributes)
- [ ] Previous review data loads (if editing)
- [ ] ScrollArea works for long item lists

---

## Next Steps (Phase 1.3)

1. **Create ReviewDialog component** using Dialog + Tabs pattern
2. **Implement ReviewForm** with zod + react-hook-form
3. **Create section components** for overall, rider, and items reviews
4. **Integrate Rating component** with form validation
5. **Add success/error states** with alerts
6. **Test form validation** and submission
7. **Mobile testing** with responsive modal pattern
8. **Accessibility audit** for keyboard navigation and screen readers

---

## Component Dependencies Summary

| Component | Registry | Required | Purpose |
|-----------|----------|----------|---------|
| Dialog | @shadcn/dialog | Yes | Modal container |
| Form | @shadcn/form | Yes | Form management |
| Textarea | @shadcn/textarea | Yes | Review text input |
| Input | @shadcn/input | Optional | Text inputs |
| Tabs | @shadcn/tabs | Yes | Section organization |
| Button | @shadcn/button | Yes | Actions |
| ScrollArea | @shadcn/scroll-area | Optional | Long item lists |
| Card | @shadcn/card | Optional | Item cards |
| Badge | @shadcn/badge | Optional | Status/rating display |
| Alert | @shadcn/alert | Yes | Feedback messages |
| Label | @shadcn/label | Yes | Form labels |
| Rating | @composite | Yes | Star ratings |

---

## References

### Documentation
- shadcn/ui: https://ui.shadcn.com
- React Hook Form: https://react-hook-form.com
- Zod Validation: https://zod.dev
- Radix UI Dialog: https://www.radix-ui.com/docs/primitives/components/dialog
- Radix UI Tabs: https://www.radix-ui.com/docs/primitives/components/tabs

### 21st.dev Patterns
- Rating Group (basic and product review variations)
- User Feedback Block (multi-type feedback)
- Dialog with Form pattern
- Responsive Modal (Dialog + Drawer)

---

**Document Version:** 1.0
**Last Updated:** December 2, 2025
**Status:** Ready for Implementation Phase
