# Order Review System - Code Templates

**Copy-paste ready templates for implementation**

---

## Table of Contents

1. [Complete Review Dialog Component](#complete-review-dialog-component)
2. [Review Form with Validation](#review-form-with-validation)
3. [Individual Section Components](#individual-section-components)
4. [Reusable Field Components](#reusable-field-components)
5. [Success/Error States](#successerror-states)

---

## Complete Review Dialog Component

**File:** `components/features/review/ReviewDialog.tsx`

```tsx
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"
import { Rating } from "@/components/composite/rating"
import { OverallReviewSection } from "./sections/OverallReviewSection"
import { RiderReviewSection } from "./sections/RiderReviewSection"
import { ItemsReviewSection } from "./sections/ItemsReviewSection"

// Define the validation schema
const reviewSchema = z.object({
  // Overall order review
  overallRating: z.number()
    .min(1, "Please select a rating")
    .max(5),
  overallReview: z.string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters allowed")
    .optional()
    .or(z.literal("")),

  // Delivery/Rider review
  riderRating: z.number()
    .min(1, "Please select a rating")
    .max(5)
    .optional(),
  riderReview: z.string()
    .min(10)
    .max(500)
    .optional()
    .or(z.literal("")),

  // Item reviews
  itemReviews: z.array(
    z.object({
      itemId: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string()
        .min(5)
        .max(300)
        .optional()
        .or(z.literal("")),
    })
  ).optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewDialogProps {
  orderId: string
  orderItems: Array<{ id: string; name: string; image: string }>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function ReviewDialog({
  orderId,
  orderItems,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
}: ReviewDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Use external state if provided, otherwise use internal
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setIsOpen = externalOnOpenChange || setInternalOpen

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 5,
      overallReview: "",
      riderRating: 5,
      riderReview: "",
      itemReviews: orderItems.map((item) => ({
        itemId: item.id,
        rating: 5,
        review: "",
      })),
    },
  })

  async function onSubmit(data: ReviewFormData) {
    try {
      setIsSubmitting(true)

      // Call API to submit review
      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      // Show success state
      setShowSuccess(true)
      toast.success("Review submitted successfully!")

      // Reset after delay
      setTimeout(() => {
        setShowSuccess(false)
        setIsOpen(false)
        form.reset()
        onSuccess?.()
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write Review</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Order #{orderId}</DialogTitle>
          <DialogDescription>
            Share your feedback to help us improve. Your review is valuable!
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2Icon className="h-4 w-4" />
              <AlertTitle>Thank You!</AlertTitle>
              <AlertDescription>
                Your review has been submitted successfully.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Tabs defaultValue="overall" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overall">Order</TabsTrigger>
                  <TabsTrigger value="rider">Delivery</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                </TabsList>

                <TabsContent value="overall" className="space-y-4">
                  <OverallReviewSection form={form} />
                </TabsContent>

                <TabsContent value="rider" className="space-y-4">
                  <RiderReviewSection form={form} />
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                  <ItemsReviewSection
                    form={form}
                    items={orderItems}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

---

## Review Form with Validation

**File:** `components/features/review/ReviewForm.tsx`

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Button } from "@/components/ui/button"
import { Rating } from "@/components/composite/rating"

const reviewFormSchema = z.object({
  rating: z.number()
    .min(1, "Please select a rating")
    .max(5),
  review: z.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

type ReviewFormData = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<ReviewFormData>
}

export function ReviewForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: ReviewFormProps) {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 5,
      review: "",
      ...defaultValues,
    },
  })

  const [charCount, setCharCount] = useState(0)
  const maxChars = 500

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating Field */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate This</FormLabel>
              <FormControl>
                <div className="mt-2">
                  <Rating
                    value={field.value}
                    onChange={field.onChange}
                    max={5}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Review Text Field */}
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Review ({charCount}/{maxChars})
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience... (optional)"
                  className="resize-none min-h-[100px]"
                  maxLength={maxChars}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    setCharCount(e.target.value.length)
                  }}
                />
              </FormControl>
              <FormDescription>
                Help other customers with your honest feedback.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  )
}
```

---

## Individual Section Components

### Overall Review Section

**File:** `components/features/review/sections/OverallReviewSection.tsx`

```tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from "@/components/composite/rating"
import { useState } from "react"

interface OverallReviewSectionProps {
  form: UseFormReturn<any>
}

export function OverallReviewSection({ form }: OverallReviewSectionProps) {
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500

  return (
    <div className="space-y-4">
      {/* Overall Rating */}
      <FormField
        control={form.control}
        name="overallRating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate Your Order</FormLabel>
            <FormControl>
              <div className="mt-2">
                <Rating
                  value={field.value}
                  onChange={field.onChange}
                  max={5}
                />
              </div>
            </FormControl>
            <FormDescription>
              How satisfied were you with your order?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Overall Review Text */}
      <FormField
        control={form.control}
        name="overallReview"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Your Review ({charCount}/{maxChars})
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="What did you like or dislike about the order? (optional)"
                className="resize-none min-h-[100px]"
                maxLength={maxChars}
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  setCharCount(e.target.value.length)
                }}
              />
            </FormControl>
            <FormDescription>
              Include details about quality, packaging, freshness, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
```

### Rider Review Section

**File:** `components/features/review/sections/RiderReviewSection.tsx`

```tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from "@/components/composite/rating"
import { useState } from "react"

interface RiderReviewSectionProps {
  form: UseFormReturn<any>
}

export function RiderReviewSection({ form }: RiderReviewSectionProps) {
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500

  return (
    <div className="space-y-4">
      {/* Rider Rating */}
      <FormField
        control={form.control}
        name="riderRating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate Your Delivery</FormLabel>
            <FormControl>
              <div className="mt-2">
                <Rating
                  value={field.value}
                  onChange={field.onChange}
                  max={5}
                />
              </div>
            </FormControl>
            <FormDescription>
              How was your delivery experience?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Rider Review Text */}
      <FormField
        control={form.control}
        name="riderReview"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Delivery Feedback ({charCount}/{maxChars})
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share your experience with the delivery rider... (optional)"
                className="resize-none min-h-[100px]"
                maxLength={maxChars}
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  setCharCount(e.target.value.length)
                }}
              />
            </FormControl>
            <FormDescription>
              Comment on punctuality, courtesy, condition of order, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
```

### Items Review Section

**File:** `components/features/review/sections/ItemsReviewSection.tsx`

```tsx
"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from "@/components/composite/rating"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface ItemsReviewSectionProps {
  form: UseFormReturn<any>
  items: Array<{ id: string; name: string; image: string }>
}

export function ItemsReviewSection({
  form,
  items,
}: ItemsReviewSectionProps) {
  const { fields } = useFieldArray({
    control: form.control,
    name: "itemReviews",
  })

  const [charCounts, setCharCounts] = useState<Record<string, number>>({})
  const maxChars = 300

  return (
    <ScrollArea className="h-96 w-full">
      <div className="space-y-4 p-4">
        {fields.map((field, index) => {
          const item = items[index]
          const charCount = charCounts[field.id] || 0

          return (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Item Rating */}
                <FormField
                  control={form.control}
                  name={`itemReviews.${index}.rating`}
                  render={({ field: ratingField }) => (
                    <FormItem>
                      <FormLabel>Rate This Item</FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <Rating
                            value={ratingField.value}
                            onChange={ratingField.onChange}
                            max={5}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Item Review Text */}
                <FormField
                  control={form.control}
                  name={`itemReviews.${index}.review`}
                  render={({ field: reviewField }) => (
                    <FormItem>
                      <FormLabel>
                        Item Review ({charCount}/{maxChars})
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What did you think? (optional)"
                          className="resize-none"
                          maxLength={maxChars}
                          {...reviewField}
                          onChange={(e) => {
                            reviewField.onChange(e)
                            setCharCounts({
                              ...charCounts,
                              [field.id]: e.target.value.length,
                            })
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}
```

---

## Reusable Field Components

### Rating Input Field

**File:** `components/features/review/items/RatingField.tsx`

```tsx
"use client"

import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormDescription } from "@/components/ui/form"
import { Rating } from "@/components/composite/rating"
import { UseFormReturn } from "react-hook-form"

interface RatingFieldProps {
  form: UseFormReturn<any>
  name: string
  label: string
  description?: string
  max?: number
}

export function RatingField({
  form,
  name,
  label,
  description,
  max = 5,
}: RatingFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="mt-2">
            <Rating
              value={field.value}
              onChange={field.onChange}
              max={max}
            />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

### Review Textarea Field

**File:** `components/features/review/items/ReviewTextarea.tsx`

```tsx
"use client"

import { useState } from "react"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormDescription } from "@/components/ui/form"
import { FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"

interface ReviewTextareaProps {
  form: UseFormReturn<any>
  name: string
  label: string
  placeholder?: string
  description?: string
  maxLength?: number
}

export function ReviewTextarea({
  form,
  name,
  label,
  placeholder,
  description,
  maxLength = 500,
}: ReviewTextareaProps) {
  const [charCount, setCharCount] = useState(0)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} ({charCount}/{maxLength})
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none min-h-[100px]"
              maxLength={maxLength}
              {...field}
              onChange={(e) => {
                field.onChange(e)
                setCharCount(e.target.value.length)
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

---

## Success/Error States

### Success State Component

**File:** `components/features/review/states/SuccessState.tsx`

```tsx
"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessStateProps {
  orderId: string
  onClose: () => void
}

export function SuccessState({ orderId, onClose }: SuccessStateProps) {
  return (
    <div className="space-y-4">
      <Alert>
        <CheckCircle2Icon className="h-4 w-4" />
        <AlertTitle>Thank You for Your Review!</AlertTitle>
        <AlertDescription>
          Your feedback has been submitted successfully and helps other
          customers make informed decisions.
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  )
}
```

### Error State Component

**File:** `components/features/review/states/ErrorState.tsx`

```tsx
"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Failed to Submit Review</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <Button onClick={onRetry} variant="outline" className="w-full">
        Try Again
      </Button>
    </div>
  )
}
```

---

## Usage Example

**File:** `app/orders/[orderId]/components/OrderDetails.tsx`

```tsx
"use client"

import { useState } from "react"
import { ReviewDialog } from "@/components/features/review/ReviewDialog"

export function OrderDetails({ order }: { order: Order }) {
  const [reviewOpen, setReviewOpen] = useState(false)

  return (
    <div>
      {/* Order content */}

      <ReviewDialog
        orderId={order.id}
        orderItems={order.items}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSuccess={() => {
          // Refresh order details, show notification, etc.
        }}
      />
    </div>
  )
}
```

---

**Template Version:** 1.0
**Last Updated:** December 2, 2025
