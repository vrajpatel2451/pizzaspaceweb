# Order Review System - Component Quick Reference

**Quick lookup guide for implementation**

---

## Installation

```bash
# One-line installation
npx shadcn@latest add @shadcn/dialog @shadcn/form @shadcn/textarea @shadcn/input @shadcn/tabs @shadcn/button @shadcn/scroll-area @shadcn/card @shadcn/badge @shadcn/alert @shadcn/label
```

---

## Basic Usage Examples

### 1. Simple Review Dialog

```tsx
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function SimpleReviewDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Write Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Order</DialogTitle>
          <DialogDescription>
            Tell us about your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts..."
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

### 2. Form with Validation

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const schema = z.object({
  review: z.string()
    .min(10, "At least 10 characters")
    .max(500, "Maximum 500 characters"),
})

export function ReviewFormWithValidation() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { review: "" },
  })

  function onSubmit(data) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your feedback..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Help other customers with your honest review
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

---

### 3. Tabbed Review Sections

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TabbedReview() {
  return (
    <Tabs defaultValue="overall" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overall">Order</TabsTrigger>
        <TabsTrigger value="rider">Delivery</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
      </TabsList>

      <TabsContent value="overall">
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Overall review form */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rider">
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Rider review form */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items">
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Items</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Items review form */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

---

### 4. Alert Feedback Messages

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"

// Success Alert
<Alert>
  <CheckCircle2Icon className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your review has been submitted successfully.
  </AlertDescription>
</Alert>

// Error Alert
<Alert variant="destructive">
  <AlertCircleIcon className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to submit review. Please try again.
  </AlertDescription>
</Alert>
```

---

### 5. ScrollArea for Long Lists

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

export function ItemReviewsList({ items }) {
  return (
    <ScrollArea className="h-72 w-full border rounded-md">
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="pb-4 border-b last:border-0">
            <h4 className="font-medium">{item.name}</h4>
            {/* Item review form */}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

---

### 6. Rating Input Pattern

```tsx
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { Rating } from "@/components/composite/rating"

export function RatingFormField({
  name,
  label,
  description,
}: {
  name: string
  label: string
  description?: string
}) {
  const form = useFormContext()

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
              max={5}
            />
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </FormItem>
      )}
    />
  )
}
```

---

## Common Patterns

### Pattern: Dialog + Form + Tabs

```tsx
interface ReviewDialogProps {
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewDialog({
  orderId,
  open,
  onOpenChange,
}: ReviewDialogProps) {
  const form = useForm({ /* ... */ })

  async function onSubmit(data) {
    // Submit to API
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Order #{orderId}</DialogTitle>
          <DialogDescription>
            Share your feedback with us
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="overall">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overall">Order</TabsTrigger>
                <TabsTrigger value="rider">Delivery</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
              </TabsList>

              <TabsContent value="overall" className="space-y-4">
                {/* Overall review fields */}
              </TabsContent>

              <TabsContent value="rider" className="space-y-4">
                {/* Rider review fields */}
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                {/* Items review fields */}
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Styling Tips

### Dialog Width Classes
```tsx
// Small
className="sm:max-w-[350px]"

// Medium (recommended for reviews)
className="sm:max-w-[500px]"

// Large
className="sm:max-w-[600px]"
```

### Form Spacing
```tsx
<form className="space-y-6">
  {/* Each field gets 24px bottom margin */}
</form>
```

### Button Groups
```tsx
<div className="flex gap-2 justify-end">
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Submit</Button>
</div>
```

---

## Validation Messages

### Character Count Feedback
```tsx
const [charCount, setCharCount] = useState(0)
const maxChars = 500

<FormField
  control={form.control}
  name="review"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Review ({charCount}/{maxChars})</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          onChange={(e) => {
            field.onChange(e)
            setCharCount(e.target.value.length)
          }}
          maxLength={maxChars}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

### Rating Validation
```tsx
const schema = z.object({
  rating: z.number()
    .min(1, "Please select a rating")
    .max(5),
})
```

---

## State Management

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(false)

<Button disabled={isLoading} type="submit">
  {isLoading ? "Submitting..." : "Submit"}
</Button>
```

### Success/Error States
```tsx
const [showSuccess, setShowSuccess] = useState(false)
const [error, setError] = useState<string | null>(null)

return (
  <>
    {showSuccess && <Alert>Success message</Alert>}
    {error && <Alert variant="destructive">{error}</Alert>}
    {/* Form content */}
  </>
)
```

---

## Accessibility Checklist

- [ ] All form fields have associated labels
- [ ] Error messages linked to fields with aria-invalid
- [ ] Dialog has proper ARIA attributes
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus management in dialog
- [ ] Color not only indicator (use text + icon for success/error)
- [ ] Textarea has maxlength attribute
- [ ] Required fields marked visually and in label

---

## Key Props Reference

### Dialog
- `open` - Control open state
- `onOpenChange` - Open state callback

### Form
- `control` - From useForm
- `name` - Field name
- `render` - Field render function

### Textarea
- `placeholder` - Input placeholder
- `maxLength` - Max characters
- `className` - Additional classes
- `disabled` - Disable input

### Tabs
- `defaultValue` - Initial tab
- `value` - Controlled value
- `onValueChange` - Tab change callback

### Button
- `variant` - 'default', 'outline', 'destructive', 'ghost'
- `size` - 'default', 'sm', 'lg', 'icon'
- `disabled` - Disable button
- `type` - 'button', 'submit', 'reset'

---

## Troubleshooting

### Form not submitting
- Ensure all required fields pass validation
- Check that form.handleSubmit(onSubmit) is bound correctly
- Verify Button has type="submit"

### Dialog not closing after submit
- Call onOpenChange(false) in submit handler
- Ensure promise resolves before closing

### Tabs losing data
- Use Form state (form.watch()) instead of local state
- Or lift state to parent component

### ScrollArea not showing scrollbar
- Ensure container has explicit height
- Content must exceed container height

---

## Testing Helpers

```tsx
// Test form submission
const { getByRole, getByDisplayValue } = render(<ReviewDialog />)
fireEvent.change(getByDisplayValue(/your review/i), {
  target: { value: "Great experience!" }
})
fireEvent.click(getByRole("button", { name: /submit/i }))

// Test tab switching
fireEvent.click(getByRole("tab", { name: /delivery/i }))

// Test validation
fireEvent.click(getByRole("button", { name: /submit/i }))
expect(getByText(/at least 10 characters/i)).toBeInTheDocument()
```

---

## Related Files in Project

- Rating Component: `/components/composite/rating.tsx`
- Form Types: `/types/index.ts`
- API Endpoint: `/lib/api/orderReview.ts`
- Review Types: `/types/orderReview.ts`

---

**Quick Reference Version:** 1.0
**Last Updated:** December 2, 2025
