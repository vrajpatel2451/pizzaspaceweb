# Order Review System - Component Architecture
## Phase 1.3 Architecture Document

**Document Version:** 1.0
**Created:** December 2, 2025
**Status:** Architecture Design Complete
**Next Phase:** Implementation (Phase 2)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Component Tree Architecture](#component-tree-architecture)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Component Specifications](#component-specifications)
5. [State Management Architecture](#state-management-architecture)
6. [Data Flow & Integration](#data-flow--integration)
7. [File Structure](#file-structure)
8. [Implementation Plan](#implementation-plan)
9. [Integration Points](#integration-points)
10. [Technical Considerations](#technical-considerations)

---

## Executive Summary

This document defines the complete component architecture for the Order Review System in the pizzaspace_web Next.js application. The architecture follows a **composition-based approach** using React Hook Form for state management, Zod for validation, and shadcn/ui components for the UI foundation.

### Key Architectural Decisions

1. **Container-Presenter Pattern**: Separate business logic (containers) from presentation (UI components)
2. **Form State Management**: React Hook Form with Zod validation schemas
3. **Component Composition**: Small, focused components that compose into complex features
4. **Server/Client Boundary**: Client Components for interactivity, Server Components for data fetching
5. **Conditional Rendering**: Smart handling of rider reviews based on order state
6. **Reusable Rating Component**: Leverage existing `/components/composite/rating.tsx`

### Architecture Principles Applied

- **Single Responsibility**: Each component handles one concern
- **Open/Closed**: Components are open for extension, closed for modification
- **Interface Segregation**: Props interfaces are minimal and focused
- **Dependency Inversion**: Components depend on abstractions (types), not implementations

---

## Component Tree Architecture

### Visual Hierarchy

```
OrderDetailsPage (Server Component)
└── OrderDetailsHeader (Client Component - Enhanced)
    └── ReviewDialogTrigger (NEW)
        └── OrderReviewDialog (NEW - Client Component)
            ├── DialogTrigger (controlled externally)
            └── DialogContent
                ├── DialogHeader
                │   ├── DialogTitle
                │   └── DialogDescription
                │
                ├── OrderReviewForm (Container Component)
                │   └── Tabs
                │       ├── TabsList
                │       │   ├── TabsTrigger: "Order"
                │       │   ├── TabsTrigger: "Delivery" (conditional)
                │       │   └── TabsTrigger: "Items"
                │       │
                │       ├── TabsContent: "Order"
                │       │   └── OrderReviewSection
                │       │       ├── Card
                │       │       │   ├── CardHeader
                │       │       │   └── CardContent
                │       │       │       ├── FormField (Rating)
                │       │       │       │   └── Rating (interactive)
                │       │       │       └── FormField (Textarea)
                │       │       │           └── Textarea
                │       │
                │       ├── TabsContent: "Delivery" (conditional)
                │       │   └── RiderReviewSection
                │       │       ├── RiderInfoDisplay
                │       │       │   ├── Avatar
                │       │       │   └── Rider Details
                │       │       ├── Card
                │       │       │   └── CardContent
                │       │       │       ├── FormField (Rating)
                │       │       │       │   └── Rating (interactive)
                │       │       │       └── FormField (Textarea)
                │       │       │           └── Textarea
                │       │
                │       └── TabsContent: "Items"
                │           └── ItemsReviewSection
                │               └── ScrollArea
                │                   └── ItemReviewCards (array)
                │                       └── ItemReviewCard
                │                           ├── CustomImage
                │                           ├── ItemInfo
                │                           ├── FormField (Rating)
                │                           │   └── Rating (interactive)
                │                           └── FormField (Textarea)
                │                               └── Textarea
                │
                └── DialogFooter
                    ├── Button: "Cancel" (outline)
                    └── Button: "Submit Review" (primary, with loading)

OrderInformation (Enhanced)
└── ReviewDisplayCard (NEW - conditional)
    ├── Label: "Your Review"
    ├── Rating (read-only)
    └── Text: overallMessage

DeliveryRiderDetails (Enhanced)
└── ReviewDisplayCard (NEW - conditional)
    ├── Label: "Rider Review"
    ├── Rating (read-only)
    └── Text: deliveryBoyMessage

OrderItemsList (Enhanced)
└── OrderItemCard (Enhanced)
    └── ItemReviewBadge (NEW - conditional per item)
        ├── Rating (read-only, compact)
        └── Text: itemMessage (truncated)
```

---

## TypeScript Interfaces

### Core Form Types

```typescript
// Form data structure matching react-hook-form state
export interface ReviewFormData {
  // Order review
  orderRating: number;
  orderMessage: string;

  // Rider review (optional, depends on hasRider)
  riderRating?: number;
  riderMessage?: string;

  // Item reviews (dynamic array based on order items)
  items: ItemReviewFormData[];
}

export interface ItemReviewFormData {
  itemId: string;
  rating: number;
  message: string;
}
```

### Component Props Interfaces

```typescript
// ===== Container Components =====

export interface OrderReviewDialogProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface OrderReviewFormProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// ===== Section Components =====

export interface OrderReviewSectionProps {
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface RiderReviewSectionProps {
  rider: StaffResponse;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface ItemsReviewSectionProps {
  items: OrderItemResponse[];
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

// ===== Card Components =====

export interface ItemReviewCardProps {
  item: OrderItemResponse;
  index: number;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface RiderInfoDisplayProps {
  rider: StaffResponse;
  className?: string;
}

// ===== Display Components (Read-Only) =====

export interface ReviewDisplayCardProps {
  rating: number;
  message?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

export interface ItemReviewBadgeProps {
  rating: number;
  message?: string;
  className?: string;
}

export interface ReviewSummaryProps {
  review: OrderReviewWithItemsResponse;
  className?: string;
}

// ===== Hooks =====

export interface UseReviewFormOptions {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSuccess?: () => void;
}

export interface UseReviewFormReturn {
  form: UseFormReturn<ReviewFormData>;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  hasRider: boolean;
}
```

### Zod Validation Schemas

```typescript
import { z } from "zod";

// Rating validation (1-5 stars)
const ratingSchema = z
  .number()
  .min(1, "Please select a rating")
  .max(5, "Rating must be between 1 and 5");

// Message validation (optional, but with length constraints)
const messageSchema = z
  .string()
  .trim()
  .max(500, "Message cannot exceed 500 characters")
  .optional()
  .or(z.literal(""));

// Item review schema
const itemReviewSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  rating: ratingSchema,
  message: messageSchema,
});

// Main review form schema
export const reviewFormSchema = z.object({
  // Order review (always required)
  orderRating: ratingSchema,
  orderMessage: messageSchema,

  // Rider review (conditionally required)
  riderRating: z
    .number()
    .min(1, "Please rate the delivery rider")
    .max(5)
    .optional(),
  riderMessage: messageSchema,

  // Item reviews (array with minimum length)
  items: z
    .array(itemReviewSchema)
    .min(1, "At least one item must be reviewed"),
});

// Conditional validation function
export function createReviewFormSchema(hasRider: boolean) {
  const baseSchema = reviewFormSchema;

  if (hasRider) {
    return baseSchema.refine(
      (data) => {
        return (
          data.riderRating !== undefined &&
          data.riderRating >= 1 &&
          data.riderRating <= 5
        );
      },
      {
        message: "Please rate the delivery rider",
        path: ["riderRating"],
      }
    );
  }

  return baseSchema;
}

export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;
```

### API Payload Construction Types

```typescript
// Helper type for transforming form data to API payload
export interface PayloadConstructionContext {
  formData: ReviewFormData;
  order: OrderResponse;
  hasRider: boolean;
}

// Payload constructor function signature
export type ConstructPayloadFn = (
  context: PayloadConstructionContext
) => CreateOrderReviewData;
```

---

## Component Specifications

### 1. OrderReviewDialog (Container Component)

**Location:** `/components/order/review/review-dialog.tsx`

**Purpose:** Main container component that manages dialog state and orchestrates the review flow.

**Responsibility:**
- Dialog open/close state management
- Trigger rendering (button or external control)
- Success callback handling
- Error boundary for form submission

**Component Type:** Client Component (`"use client"`)

**Props:**
```typescript
interface OrderReviewDialogProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
```

**Key Features:**
- Portal rendering to avoid z-index issues
- Responsive sizing (mobile vs desktop)
- Escape key to close
- Click outside to close (with unsaved changes warning)
- Loading state overlay during submission

**State:**
```typescript
- dialogOpen: boolean
- submitSuccess: boolean
```

**Implementation Notes:**
```typescript
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { OrderReviewForm } from "./review-form";

export function OrderReviewDialog({
  order,
  existingReview,
  open,
  onOpenChange,
  onSuccess,
}: OrderReviewDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate Your Order</DialogTitle>
          <DialogDescription>
            Share your experience to help us improve our service
          </DialogDescription>
        </DialogHeader>

        <OrderReviewForm
          order={order}
          existingReview={existingReview}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

### 2. OrderReviewForm (Container Component)

**Location:** `/components/order/review/review-form.tsx`

**Purpose:** Form container with tabs, validation, and submission logic.

**Responsibility:**
- Form state management with react-hook-form
- Validation with Zod schema
- Tab navigation state
- Form submission orchestration
- Error handling and display

**Component Type:** Client Component (`"use client"`)

**Props:**
```typescript
interface OrderReviewFormProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}
```

**Key Features:**
- Uses `useReviewForm` custom hook for logic
- Tab-based navigation (Order → Rider → Items)
- Conditional rider tab rendering
- Real-time validation feedback
- Submit button loading state
- Form-level error display

**State Management:**
```typescript
- form: UseFormReturn<ReviewFormData> (from react-hook-form)
- currentTab: "order" | "rider" | "items"
- isSubmitting: boolean
- submitError: string | null
```

**Implementation Notes:**
```typescript
"use client";

import { useReviewForm } from "./hooks/use-review-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { OrderReviewSection } from "./sections/order-review-section";
import { RiderReviewSection } from "./sections/rider-review-section";
import { ItemsReviewSection } from "./sections/items-review-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function OrderReviewForm({
  order,
  existingReview,
  onSuccess,
  onCancel,
}: OrderReviewFormProps) {
  const { form, onSubmit, isSubmitting, submitError, hasRider } = useReviewForm({
    order,
    existingReview,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="order">Order</TabsTrigger>
            {hasRider && <TabsTrigger value="rider">Delivery</TabsTrigger>}
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-4">
            <OrderReviewSection
              control={form.control}
              errors={form.formState.errors}
            />
          </TabsContent>

          {hasRider && (
            <TabsContent value="rider" className="space-y-4">
              <RiderReviewSection
                rider={order.rider.info}
                control={form.control}
                errors={form.formState.errors}
              />
            </TabsContent>
          )}

          <TabsContent value="items" className="space-y-4">
            <ItemsReviewSection
              items={order.items}
              control={form.control}
              errors={form.formState.errors}
            />
          </TabsContent>
        </Tabs>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

### 3. OrderReviewSection (Presentational Component)

**Location:** `/components/order/review/sections/order-review-section.tsx`

**Purpose:** Order-level review input section.

**Responsibility:**
- Render rating input for overall order
- Render textarea for overall message
- Display validation errors

**Component Type:** Client Component

**Props:**
```typescript
interface OrderReviewSectionProps {
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}
```

**Key Features:**
- Uses FormField wrapper from shadcn/ui
- Integrates existing Rating component
- Character counter for textarea
- Visual error feedback

**Implementation Notes:**
```typescript
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderReviewSection({
  control,
  errors,
}: OrderReviewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Overall Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Field */}
        <FormField
          control={control}
          name="orderRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Your Order</FormLabel>
              <FormControl>
                <Rating
                  value={field.value || 0}
                  onChange={field.onChange}
                  interactive
                  size="lg"
                  showValue
                  precision="half"
                />
              </FormControl>
              <FormDescription>
                How would you rate your overall order experience?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={control}
          name="orderMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this order..."
                  className="resize-none min-h-[100px]"
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
```

---

### 4. RiderReviewSection (Presentational Component)

**Location:** `/components/order/review/sections/rider-review-section.tsx`

**Purpose:** Delivery rider review input section.

**Responsibility:**
- Display rider information
- Render rating input for rider performance
- Render textarea for rider feedback

**Component Type:** Client Component

**Props:**
```typescript
interface RiderReviewSectionProps {
  rider: StaffResponse;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}
```

**Key Features:**
- Rider info display at the top
- Same rating/textarea pattern as order section
- Conditional rendering (only shown if rider exists)

**Implementation Notes:**
```typescript
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiderInfoDisplay } from "../cards/rider-info-display";

export function RiderReviewSection({
  rider,
  control,
  errors,
}: RiderReviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* Rider Info Display */}
      <RiderInfoDisplay rider={rider} />

      {/* Review Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Field */}
          <FormField
            control={control}
            name="riderRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Delivery Service</FormLabel>
                <FormControl>
                  <Rating
                    value={field.value || 0}
                    onChange={field.onChange}
                    interactive
                    size="lg"
                    showValue
                    precision="half"
                  />
                </FormControl>
                <FormDescription>
                  How was your delivery experience?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={control}
            name="riderMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Feedback (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share feedback about the delivery service..."
                    className="resize-none min-h-[100px]"
                    maxLength={500}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 5. ItemsReviewSection (Presentational Component)

**Location:** `/components/order/review/sections/items-review-section.tsx`

**Purpose:** Container for all item reviews with scrolling.

**Responsibility:**
- Render scrollable list of items
- Map order items to ItemReviewCard components
- Handle empty state

**Component Type:** Client Component

**Props:**
```typescript
interface ItemsReviewSectionProps {
  items: OrderItemResponse[];
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}
```

**Key Features:**
- ScrollArea for long lists (max height: 400px)
- Item cards with images and info
- Individual rating/message per item

**Implementation Notes:**
```typescript
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemReviewCard } from "../cards/item-review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemsReviewSection({
  items,
  control,
  errors,
}: ItemsReviewSectionProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No items to review
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Rate Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <ItemReviewCard
                key={item.itemId}
                item={item}
                index={index}
                control={control}
                errors={errors}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

---

### 6. ItemReviewCard (Presentational Component)

**Location:** `/components/order/review/cards/item-review-card.tsx`

**Purpose:** Individual item review input with image and info.

**Responsibility:**
- Display item image, name, variants, addons
- Render rating input for specific item
- Render textarea for item-specific feedback

**Component Type:** Client Component

**Props:**
```typescript
interface ItemReviewCardProps {
  item: OrderItemResponse;
  index: number;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}
```

**Key Features:**
- Compact card layout
- Item context (image, name, variants)
- Focused rating/message fields
- Uses CustomImage component

**Implementation Notes:**
```typescript
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent } from "@/components/ui/card";
import { CustomImage } from "@/components/ui/custom-image";

export function ItemReviewCard({
  item,
  index,
  control,
  errors,
}: ItemReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Item Header */}
        <div className="flex gap-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <CustomImage
              src={item.image || "/placeholder-food.png"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
            {item.variants && item.variants.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">
                {item.variants.join(", ")}
              </p>
            )}
            {item.addons && item.addons.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">
                Addons: {item.addons.map(a => a.name).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Rating Field */}
        <FormField
          control={control}
          name={`items.${index}.rating`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Rate this item</FormLabel>
              <FormControl>
                <Rating
                  value={field.value || 0}
                  onChange={field.onChange}
                  interactive
                  size="default"
                  showValue
                  precision="half"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={control}
          name={`items.${index}.message`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Any specific feedback? (Optional)"
                  className="resize-none min-h-[60px] text-sm"
                  maxLength={300}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
```

---

### 7. RiderInfoDisplay (Presentational Component)

**Location:** `/components/order/review/cards/rider-info-display.tsx`

**Purpose:** Display rider information above rider review section.

**Responsibility:**
- Show rider name and email
- Consistent styling with existing rider details card

**Component Type:** Client Component

**Props:**
```typescript
interface RiderInfoDisplayProps {
  rider: StaffResponse;
  className?: string;
}
```

**Implementation Notes:**
```typescript
import { User, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RiderInfoDisplay({ rider, className }: RiderInfoDisplayProps) {
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          <p className="font-semibold text-sm">{rider.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-500" />
          <p className="text-xs text-muted-foreground">{rider.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### 8. ReviewDisplayCard (Display Component)

**Location:** `/components/order/review/display/review-display-card.tsx`

**Purpose:** Display existing reviews in order details sections (read-only).

**Responsibility:**
- Show rating (read-only stars)
- Show review message if present
- Optional title for context

**Component Type:** Client Component

**Props:**
```typescript
interface ReviewDisplayCardProps {
  rating: number;
  message?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}
```

**Key Features:**
- Read-only rating display
- Optional message rendering
- Compact mode for space-constrained areas

**Implementation Notes:**
```typescript
import { Rating } from "@/components/composite/rating";
import { cn } from "@/lib/utils";

export function ReviewDisplayCard({
  rating,
  message,
  title,
  className,
  compact = false,
}: ReviewDisplayCardProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      )}
      <Rating
        value={rating}
        size={compact ? "sm" : "default"}
        showValue
        interactive={false}
      />
      {message && (
        <p className={cn(
          "text-foreground",
          compact ? "text-xs" : "text-sm"
        )}>
          {message}
        </p>
      )}
    </div>
  );
}
```

---

### 9. ItemReviewBadge (Display Component)

**Location:** `/components/order/review/display/item-review-badge.tsx`

**Purpose:** Compact review display for individual items in order item cards.

**Responsibility:**
- Show compact rating badge
- Truncated message preview

**Component Type:** Client Component

**Props:**
```typescript
interface ItemReviewBadgeProps {
  rating: number;
  message?: string;
  className?: string;
}
```

**Implementation Notes:**
```typescript
import { Rating } from "@/components/composite/rating";
import { cn } from "@/lib/utils";

export function ItemReviewBadge({
  rating,
  message,
  className,
}: ItemReviewBadgeProps) {
  return (
    <div className={cn("mt-2 space-y-1", className)}>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Your rating:</span>
        <Rating value={rating} size="sm" showValue interactive={false} />
      </div>
      {message && (
        <p className="text-xs text-muted-foreground truncate" title={message}>
          {message}
        </p>
      )}
    </div>
  );
}
```

---

### 10. useReviewForm (Custom Hook)

**Location:** `/components/order/review/hooks/use-review-form.ts`

**Purpose:** Encapsulate form logic, validation, and submission.

**Responsibility:**
- Initialize react-hook-form with default values
- Handle form submission
- Construct API payload
- Error handling
- Success callback

**Hook Signature:**
```typescript
export function useReviewForm({
  order,
  existingReview,
  onSuccess,
}: UseReviewFormOptions): UseReviewFormReturn
```

**Implementation Notes:**
```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createReview } from "@/lib/api/orderReview";
import { createReviewFormSchema } from "../validation";
import type { ReviewFormData, UseReviewFormOptions, UseReviewFormReturn } from "../types";

export function useReviewForm({
  order,
  existingReview,
  onSuccess,
}: UseReviewFormOptions): UseReviewFormReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Determine if rider exists
  const hasRider = Boolean(order.rider?.info);

  // Create validation schema with conditional rider validation
  const schema = createReviewFormSchema(hasRider);

  // Initialize form with default values
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderRating: existingReview?.order.overallRatings || 0,
      orderMessage: existingReview?.order.overallMessage || "",
      riderRating: existingReview?.order.deliveryBoyRatings || (hasRider ? 0 : undefined),
      riderMessage: existingReview?.order.deliveryBoyMessage || "",
      items: order.items.map((item) => {
        const existingItemReview = existingReview?.items.find(
          (review) => review.itemId === item.itemId
        );
        return {
          itemId: item.itemId,
          rating: existingItemReview?.ratings || 0,
          message: existingItemReview?.message || "",
        };
      }),
    },
  });

  // Construct API payload from form data
  const constructPayload = (formData: ReviewFormData) => {
    const payload = {
      order: {
        orderId: order._id,
        overallRatings: formData.orderRating,
        overallMessage: formData.orderMessage || undefined,
        storeId: order.seller.info._id,
        staffId: order.rider?.info?._id,
        ...(hasRider && formData.riderRating && {
          deliveryBoyRatings: formData.riderRating,
          deliveryBoyMessage: formData.riderMessage || undefined,
        }),
      },
      items: formData.items.map((item) => ({
        orderId: order._id,
        itemId: item.itemId,
        ratings: item.rating,
        message: item.message || undefined,
        storeId: order.seller.info._id,
      })),
    };

    return payload;
  };

  // Handle form submission
  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = constructPayload(data);
      const response = await createReview(payload);

      if (response.statusCode !== 200) {
        throw new Error(response.errorMessage || "Failed to submit review");
      }

      // Success handling
      toast.success("Review submitted successfully!");
      router.refresh(); // Refresh to show new review
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    submitError,
    hasRider,
  };
}
```

---

## State Management Architecture

### Form State (React Hook Form)

```
FormState
├── orderRating: number
├── orderMessage: string
├── riderRating?: number (conditional)
├── riderMessage?: string
└── items: ItemReviewFormData[]
    ├── [0]
    │   ├── itemId: string
    │   ├── rating: number
    │   └── message: string
    ├── [1]
    └── ...
```

### UI State

```typescript
// Dialog State
const [dialogOpen, setDialogOpen] = useState(false);

// Form Submission State (in useReviewForm hook)
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);

// Tab Navigation State (in OrderReviewForm)
const [currentTab, setCurrentTab] = useState<"order" | "rider" | "items">("order");
```

### Conditional State Logic

```typescript
// Determine if rider review section should be shown
const hasRider = Boolean(order.rider?.info);

// Conditionally add rider validation
const schema = createReviewFormSchema(hasRider);

// Conditionally render rider tab
{hasRider && (
  <TabsTrigger value="rider">Delivery</TabsTrigger>
)}
```

---

## Data Flow & Integration

### 1. Page Load Flow

```
OrderDetailsPage (Server)
    ↓
    ├─ Fetch order: getOrderDetails(orderId)
    └─ Fetch review: getOrderReview(orderId)
    ↓
    ┌─────────────────────────────────────┐
    │ Review Data Check                   │
    ├─────────────────────────────────────┤
    │ statusCode === 200 && data exists   │
    │   → existingReview = data           │
    │   → showReviewButton = false        │
    │   → Display reviews inline          │
    │                                     │
    │ statusCode === 404 || data === null │
    │   → existingReview = null           │
    │   → showReviewButton = true         │
    │   → Enable review creation          │
    └─────────────────────────────────────┘
    ↓
Pass props to components
```

### 2. Review Creation Flow

```
User clicks "Write Review" button
    ↓
OrderDetailsHeader opens dialog
    ↓
OrderReviewDialog renders
    ↓
OrderReviewForm initializes
    ↓
useReviewForm hook
    ├─ Creates form with default values
    ├─ Sets up validation schema
    └─ Prepares submission handler
    ↓
User interacts with form
    ├─ Rate order (required)
    ├─ Write message (optional)
    ├─ Rate rider (conditional)
    ├─ Rate items (required for all)
    └─ Write item messages (optional)
    ↓
User clicks "Submit Review"
    ↓
Form validation (Zod)
    ├─ Valid → Continue
    └─ Invalid → Show errors, stay on form
    ↓
constructPayload(formData)
    ↓
createReview(payload) API call
    ↓
    ┌───────────────────────────────┐
    │ API Response                  │
    ├───────────────────────────────┤
    │ Success (200)                 │
    │   → Close dialog              │
    │   → router.refresh()          │
    │   → Toast success             │
    │   → onSuccess callback        │
    │                               │
    │ Error (4xx/5xx)               │
    │   → Keep dialog open          │
    │   → Display error message     │
    │   → Enable retry              │
    └───────────────────────────────┘
```

### 3. Payload Construction Flow

```typescript
FormData (ReviewFormData)
    ↓
constructPayload()
    ↓
    ├─ Extract order info
    │  ├─ orderId: order._id
    │  ├─ overallRatings: formData.orderRating
    │  ├─ overallMessage: formData.orderMessage || undefined
    │  ├─ storeId: order.seller.info._id
    │  ├─ staffId: order.rider?.info?._id
    │  └─ Conditional rider ratings
    │
    └─ Map items
       ├─ [0]
       │  ├─ orderId: order._id
       │  ├─ itemId: formData.items[0].itemId
       │  ├─ ratings: formData.items[0].rating
       │  ├─ message: formData.items[0].message || undefined
       │  └─ storeId: order.seller.info._id
       └─ ...
    ↓
CreateOrderReviewData (API payload)
```

### 4. Review Display Flow

```
OrderDetailsPage receives existingReview
    ↓
    ├─ OrderInformation component
    │  └─ {existingReview && (
    │       <ReviewDisplayCard
    │         rating={existingReview.order.overallRatings}
    │         message={existingReview.order.overallMessage}
    │         title="Your Review"
    │       />
    │     )}
    │
    ├─ DeliveryRiderDetails component
    │  └─ {existingReview?.order.deliveryBoyRatings && (
    │       <ReviewDisplayCard
    │         rating={existingReview.order.deliveryBoyRatings}
    │         message={existingReview.order.deliveryBoyMessage}
    │         title="Rider Review"
    │       />
    │     )}
    │
    └─ OrderItemsList → OrderItemCard (enhanced)
       └─ {getItemReview(item.itemId) && (
            <ItemReviewBadge
              rating={itemReview.ratings}
              message={itemReview.message}
            />
          )}
```

---

## File Structure

```
/components/order/review/
├── index.ts                             # Barrel exports
├── review-dialog.tsx                    # Main dialog container
├── review-form.tsx                      # Form with tabs
├── sections/
│   ├── order-review-section.tsx         # Order rating section
│   ├── rider-review-section.tsx         # Rider rating section
│   └── items-review-section.tsx         # Items list section
├── cards/
│   ├── item-review-card.tsx             # Individual item card
│   └── rider-info-display.tsx           # Rider info display
├── display/
│   ├── review-display-card.tsx          # Read-only review display
│   ├── item-review-badge.tsx            # Compact item review badge
│   └── review-summary.tsx               # Optional: full review summary
├── hooks/
│   └── use-review-form.ts               # Form logic hook
├── validation.ts                        # Zod schemas
└── types.ts                             # Component prop interfaces

/components/order/details/
├── order-details-header.tsx             # Enhanced with review button
├── order-information.tsx                # Enhanced with review display
├── delivery-rider-details.tsx           # Enhanced with review display
└── ...

/components/order/shared/
├── order-item-card.tsx                  # Enhanced with review badge
└── ...

/lib/api/
└── orderReview.ts                       # Already exists

/types/
└── orderReview.ts                       # Already exists

/app/(protected)/order/[orderId]/
└── page.tsx                             # Enhanced with review fetch
```

### Barrel Export Pattern

```typescript
// /components/order/review/index.ts
export { OrderReviewDialog } from "./review-dialog";
export { OrderReviewForm } from "./review-form";
export { ReviewDisplayCard } from "./display/review-display-card";
export { ItemReviewBadge } from "./display/item-review-badge";
export { useReviewForm } from "./hooks/use-review-form";

// Usage
import { OrderReviewDialog, ReviewDisplayCard } from "@/components/order/review";
```

---

## Implementation Plan

### Phase 1: Foundation (Day 1)

**Goal:** Set up basic structure and install dependencies

**Tasks:**
1. Install shadcn components
   ```bash
   npx shadcn@latest add dialog form textarea tabs button card scroll-area label separator
   ```

2. Create directory structure
   ```bash
   mkdir -p components/order/review/{sections,cards,display,hooks}
   ```

3. Create type definitions
   - `types.ts` with all interfaces
   - `validation.ts` with Zod schemas

4. Create barrel exports
   - `index.ts` for clean imports

**Deliverables:**
- Project structure ready
- Dependencies installed
- Type definitions complete

---

### Phase 2: Core Components (Day 2-3)

**Goal:** Build the main review form components

**Tasks:**
1. **OrderReviewDialog**
   - Dialog wrapper
   - Open/close logic
   - Props interface

2. **OrderReviewForm**
   - Tab structure
   - Form provider setup
   - Submit/cancel handlers

3. **OrderReviewSection**
   - Rating field with existing Rating component
   - Textarea field
   - Validation messages

4. **useReviewForm Hook**
   - Form initialization
   - Default values logic
   - Payload construction

**Deliverables:**
- Basic order review working
- Form validation functional
- Submit logic complete (stub API)

---

### Phase 3: Extended Sections (Day 4)

**Goal:** Add rider and items review sections

**Tasks:**
1. **RiderReviewSection**
   - Conditional rendering logic
   - Rider info display
   - Rating/textarea fields

2. **ItemsReviewSection**
   - ScrollArea implementation
   - Item list mapping

3. **ItemReviewCard**
   - Item display with CustomImage
   - Per-item rating/textarea
   - Field array integration

4. **RiderInfoDisplay**
   - Rider details card

**Deliverables:**
- All three sections complete
- Items scrollable
- Rider section conditional

---

### Phase 4: Display Components (Day 5)

**Goal:** Build read-only review display components

**Tasks:**
1. **ReviewDisplayCard**
   - Read-only rating
   - Message display
   - Compact mode

2. **ItemReviewBadge**
   - Compact item review
   - Truncated message

3. **Enhance existing components**
   - OrderInformation
   - DeliveryRiderDetails
   - OrderItemCard

**Deliverables:**
- Display components ready
- Integration points identified
- Styling consistent

---

### Phase 5: Integration (Day 6)

**Goal:** Integrate review system into order details page

**Tasks:**
1. **Update OrderDetailsPage**
   - Add `getOrderReview()` call
   - Pass review data to components
   - Handle loading/error states

2. **Enhance OrderDetailsHeader**
   - Add "Write Review" button
   - Conditional rendering based on review existence
   - Dialog trigger logic

3. **Update existing components**
   - OrderInformation with review display
   - DeliveryRiderDetails with review display
   - OrderItemCard with review badge

4. **Test full flow**
   - Create review
   - Display review
   - Validation errors
   - API error handling

**Deliverables:**
- Full integration complete
- Review creation working
- Review display working

---

### Phase 6: Polish & Testing (Day 7)

**Goal:** Refinement, accessibility, and testing

**Tasks:**
1. **Loading states**
   - Skeleton loaders
   - Submit button loading
   - Dialog loading overlay

2. **Error handling**
   - Form validation errors
   - API error display
   - Network error handling

3. **Accessibility audit**
   - Keyboard navigation
   - Screen reader labels
   - Focus management
   - ARIA attributes

4. **Testing**
   - Edge cases (no items, no rider)
   - Long messages (character limit)
   - Rapid clicking (debounce)
   - Mobile responsive

**Deliverables:**
- Production-ready code
- Accessibility compliant
- Edge cases handled
- Documentation complete

---

## Integration Points

### 1. OrderDetailsPage Enhancement

**Location:** `/app/(protected)/order/[orderId]/page.tsx`

**Changes Required:**

```typescript
import { getOrderDetails } from "@/lib/api/order";
import { getOrderReview } from "@/lib/api/orderReview"; // NEW
// ... other imports

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params;

  // Parallel data fetching
  const [orderResponse, reviewResponse] = await Promise.all([
    getOrderDetails(orderId),
    getOrderReview(orderId), // NEW
  ]);

  if (!orderResponse.data || orderResponse.statusCode !== 200) {
    notFound();
  }

  const order = orderResponse.data;

  // Handle review data (404 is expected if no review exists)
  const existingReview = reviewResponse.statusCode === 200 ? reviewResponse.data : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ... existing page header ... */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Order Details Header with Review Button */}
        <OrderDetailsHeader
          order={order}
          existingReview={existingReview} // NEW
          className="mb-6"
        />

        {/* ... rest of page ... */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsList
              items={order.items}
              existingReview={existingReview} // NEW
              title={`Order Items (${order.items.length})`}
              showRefundInfo
            />
            {/* ... */}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <OrderInformation
              status={order.status}
              paymentMethod={order.payment.method}
              paymentRefId={order.payment.refId}
              existingReview={existingReview} // NEW
            />

            <StoreDetails store={order.seller.info} />

            {order.rider?.info && (
              <DeliveryRiderDetails
                rider={order.rider.info}
                existingReview={existingReview} // NEW
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 2. OrderDetailsHeader Enhancement

**Location:** `/components/order/details/order-details-header.tsx`

**Changes Required:**

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { OrderReviewDialog } from "@/components/order/review";
import type { OrderResponse, OrderReviewWithItemsResponse } from "@/types";

interface OrderDetailsHeaderProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null; // NEW
  className?: string;
}

export function OrderDetailsHeader({
  order,
  existingReview,
  className,
}: OrderDetailsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Show review button only if:
  // 1. No existing review
  // 2. Order is delivered
  const canReview = !existingReview && order.status === "delivered";

  return (
    <div className={className}>
      {/* ... existing back button and actions ... */}

      <div className="flex items-center justify-between">
        {/* ... existing content ... */}

        <div className="flex gap-2">
          {/* ... existing buttons ... */}

          {/* NEW: Review Button */}
          {canReview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Star className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          )}
        </div>
      </div>

      {/* NEW: Review Dialog */}
      <OrderReviewDialog
        order={order}
        existingReview={existingReview}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
```

---

### 3. OrderInformation Enhancement

**Location:** `/components/order/details/order-information.tsx`

**Changes Required:**

```typescript
import { ReviewDisplayCard } from "@/components/order/review"; // NEW
import type { OrderReviewWithItemsResponse } from "@/types"; // NEW

interface OrderInformationProps {
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentRefId: string;
  existingReview?: OrderReviewWithItemsResponse | null; // NEW
  className?: string;
}

export function OrderInformation({
  status,
  paymentMethod,
  paymentRefId,
  existingReview, // NEW
  className,
}: OrderInformationProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-orange-500" />
          <span>Order Information</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ... existing status and payment fields ... */}

        {/* NEW: Order Review Display */}
        {existingReview?.order && (
          <div className="space-y-2 pt-4 border-t">
            <ReviewDisplayCard
              rating={existingReview.order.overallRatings}
              message={existingReview.order.overallMessage}
              title="Your Review"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 4. DeliveryRiderDetails Enhancement

**Location:** `/components/order/details/delivery-rider-details.tsx`

**Changes Required:**

```typescript
import { ReviewDisplayCard } from "@/components/order/review"; // NEW
import type { OrderReviewWithItemsResponse } from "@/types"; // NEW

interface DeliveryRiderDetailsProps {
  rider: StaffResponse;
  existingReview?: OrderReviewWithItemsResponse | null; // NEW
  defaultOpen?: boolean;
  className?: string;
}

export function DeliveryRiderDetails({
  rider,
  existingReview, // NEW
  defaultOpen = true,
  className,
}: DeliveryRiderDetailsProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <Collapsible defaultOpen={defaultOpen}>
        <CardHeader className="pb-3">
          {/* ... existing header ... */}
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* ... existing rider info ... */}

            {/* NEW: Rider Review Display */}
            {existingReview?.order.deliveryBoyRatings && (
              <div className="pt-4 border-t">
                <ReviewDisplayCard
                  rating={existingReview.order.deliveryBoyRatings}
                  message={existingReview.order.deliveryBoyMessage}
                  title="Rider Review"
                  compact
                />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
```

---

### 5. OrderItemsList Enhancement

**Location:** `/components/order/shared/order-items-list.tsx`

**Changes Required:**

```typescript
import type { OrderReviewWithItemsResponse } from "@/types"; // NEW

interface OrderItemsListProps {
  items: OrderItemResponse[];
  existingReview?: OrderReviewWithItemsResponse | null; // NEW
  title?: string;
  showRefundInfo?: boolean;
  className?: string;
}

export function OrderItemsList({
  items,
  existingReview, // NEW
  title = "Order Items",
  showRefundInfo = false,
  className,
}: OrderItemsListProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <OrderItemCard
            key={item.itemId}
            item={item}
            existingReview={existingReview} // NEW: Pass review data
            showRefundInfo={showRefundInfo}
          />
        ))}
      </CardContent>
    </Card>
  );
}
```

---

### 6. OrderItemCard Enhancement

**Location:** `/components/order/shared/order-item-card.tsx`

**Changes Required:**

```typescript
import { ItemReviewBadge } from "@/components/order/review"; // NEW
import type { OrderReviewWithItemsResponse } from "@/types"; // NEW

interface OrderItemCardProps {
  item: OrderItemResponse;
  existingReview?: OrderReviewWithItemsResponse | null; // NEW
  showRefundInfo?: boolean;
  className?: string;
}

export function OrderItemCard({
  item,
  existingReview, // NEW
  showRefundInfo = false,
  className,
}: OrderItemCardProps) {
  // NEW: Find item review
  const itemReview = existingReview?.items.find(
    (review) => review.itemId === item.itemId
  );

  return (
    <div className={cn("flex gap-4", className)}>
      {/* ... existing item card content ... */}

      <div className="flex-1 min-w-0 space-y-2">
        {/* ... existing item info ... */}

        {/* NEW: Item Review Badge */}
        {itemReview && (
          <ItemReviewBadge
            rating={itemReview.ratings}
            message={itemReview.message}
          />
        )}
      </div>
    </div>
  );
}
```

---

## Technical Considerations

### 1. Server vs Client Components

**Server Components:**
- `OrderDetailsPage` - Fetches order and review data

**Client Components:**
- `OrderReviewDialog` - Dialog state management
- `OrderReviewForm` - Form state management
- `OrderDetailsHeader` - Button click handlers
- All review sections - Form field interactivity

### 2. Performance Optimizations

**Lazy Loading:**
```typescript
// Load dialog only when opened
const [dialogOpen, setDialogOpen] = useState(false);

{dialogOpen && (
  <OrderReviewDialog
    order={order}
    existingReview={existingReview}
    open={dialogOpen}
    onOpenChange={setDialogOpen}
  />
)}
```

**Form Optimization:**
- Use uncontrolled components where possible
- Debounce textarea validation (not implemented in base, but can add)
- Memoize expensive computations with `useMemo`

**Image Optimization:**
- Use `CustomImage` component (Next.js Image with error handling)
- Lazy load images in ScrollArea

### 3. Error Handling Strategy

**Client-Side Validation:**
- Real-time with Zod schema
- Field-level error messages
- Form-level error summary

**API Error Handling:**
```typescript
try {
  const response = await createReview(payload);
  if (response.statusCode !== 200) {
    throw new Error(response.errorMessage || "Failed to submit review");
  }
  // Success handling
} catch (error) {
  setSubmitError(error.message);
  toast.error("Failed to submit review");
}
```

**Error Display:**
- Form errors: `<FormMessage />` below fields
- API errors: Alert component at bottom of form
- Toast notifications for success/failure

### 4. Accessibility Compliance

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter to submit form
- Escape to close dialog
- Arrow keys for star ratings (built into Rating component)

**Screen Reader Support:**
```typescript
// Dialog announces title when opened
<DialogTitle>Rate Your Order</DialogTitle>

// Rating component has proper ARIA
<Rating
  value={value}
  onChange={onChange}
  interactive
  // Internally sets role="radiogroup" and aria-label
/>

// Form fields have associated labels
<FormLabel htmlFor="orderMessage">Your Review</FormLabel>
<FormControl>
  <Textarea id="orderMessage" {...field} />
</FormControl>
```

**Visual Accessibility:**
- Focus indicators on all interactive elements (shadcn default)
- Sufficient color contrast (checked with existing theme)
- Error states indicated by both color AND icon/text

### 5. Mobile Responsiveness

**Dialog Sizing:**
```typescript
<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
```

**Touch Targets:**
- All buttons minimum 44x44px (shadcn default)
- Star ratings have adequate spacing for touch

**ScrollArea:**
- Works with touch gestures
- Visual scroll indicators

### 6. Form State Persistence

**Option 1: Local Storage (Future Enhancement)**
```typescript
// Save draft to localStorage on form change
useEffect(() => {
  const draft = form.getValues();
  localStorage.setItem(`review-draft-${order._id}`, JSON.stringify(draft));
}, [form.watch()]);

// Restore draft on mount
useEffect(() => {
  const draft = localStorage.getItem(`review-draft-${order._id}`);
  if (draft) {
    form.reset(JSON.parse(draft));
  }
}, []);
```

**Option 2: Warn on Close (Implemented)**
```typescript
// In OrderReviewDialog
const handleOpenChange = (open: boolean) => {
  if (!open && form.formState.isDirty) {
    const confirmed = confirm("You have unsaved changes. Are you sure you want to close?");
    if (!confirmed) return;
  }
  onOpenChange(open);
};
```

### 7. Conditional Validation

**Rider Rating Requirement:**
```typescript
export function createReviewFormSchema(hasRider: boolean) {
  const baseSchema = reviewFormSchema;

  if (hasRider) {
    return baseSchema.refine(
      (data) => {
        return data.riderRating !== undefined &&
               data.riderRating >= 1 &&
               data.riderRating <= 5;
      },
      {
        message: "Please rate the delivery rider",
        path: ["riderRating"],
      }
    );
  }

  return baseSchema;
}
```

### 8. API Rate Limiting

**Debounce Submit Button:**
```typescript
const [lastSubmitTime, setLastSubmitTime] = useState(0);

const onSubmit = async (data: ReviewFormData) => {
  const now = Date.now();
  if (now - lastSubmitTime < 2000) {
    toast.error("Please wait before submitting again");
    return;
  }
  setLastSubmitTime(now);

  // ... rest of submit logic
};
```

### 9. Testing Strategy

**Unit Tests:**
- `useReviewForm` hook logic
- Payload construction function
- Validation schemas

**Integration Tests:**
- Form submission flow
- Error handling
- Success flow

**E2E Tests:**
- Full review creation flow
- Review display after submission
- Conditional rider section
- Mobile responsive behavior

---

## Summary

This architecture provides a **scalable, maintainable, and accessible** Order Review System that follows Next.js 16 and React 19 best practices. The component structure is modular, with clear separation of concerns between containers, presenters, and display components.

### Key Strengths

1. **Composition-based**: Small, focused components that compose into complex features
2. **Type-safe**: Full TypeScript coverage with strict interfaces
3. **Accessible**: WCAG 2.1 AA compliant keyboard navigation and screen reader support
4. **Performant**: Client components only where needed, lazy loading, and optimized rendering
5. **Maintainable**: Clear file structure, barrel exports, and comprehensive documentation

### Next Steps

1. Follow the implementation plan (Phases 1-6)
2. Install shadcn components
3. Create directory structure
4. Build components incrementally
5. Integrate into order details page
6. Test thoroughly
7. Deploy to production

---

**Document Status:** ✅ Complete and Ready for Implementation
**Estimated Implementation Time:** 7 days
**Complexity Level:** Medium-High
**Dependencies:** shadcn/ui, react-hook-form, zod, existing Rating component
