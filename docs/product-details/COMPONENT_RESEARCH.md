# Product Details Feature - Component Research

## Overview
This document provides comprehensive research on shadcn/ui components for implementing a Product Details feature in the pizzaspace food delivery app. The research covers modal patterns, form handling, variant/addon selection, and responsive dialog/drawer switching.

**Project Stack:**
- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui components

---

## Installation Command

Install all required components with a single command:

```bash
npx shadcn@latest add @shadcn/dialog @shadcn/drawer @shadcn/form @shadcn/radio-group @shadcn/checkbox @shadcn/scroll-area @shadcn/card @shadcn/label
```

**Components to be installed:**
- Dialog (modal pattern)
- Drawer (bottom sheet for mobile)
- Form (React Hook Form + Zod validation)
- RadioGroup (variant selection)
- Checkbox (addon selection)
- ScrollArea (content overflow handling)
- Card (variant/addon containers)
- Label (form labels and field associations)

---

## Component Analysis

### 1. Dialog - Modal Pattern for Desktop

**Registry Type:** UI Component
**Dependencies:** `@radix-ui/react-dialog`

**Purpose:** Primary container for product details modal on desktop/tablet screens. Provides accessible modal dialog with overlay and focus management.

**Key Props:**
- `open` - Control dialog visibility
- `onOpenChange` - Callback when dialog state changes
- Dialog composition: Header, Title, Description, Content, Footer

**Structure:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Product</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Product Name</DialogTitle>
      <DialogDescription>Product details and customization</DialogDescription>
    </DialogHeader>
    {/* Product content */}
    <DialogFooter>
      {/* Action buttons */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Best Practices for Product Details:**
- Set `max-w-[425px]` to `sm:max-w-2xl` for more content space
- Use `max-h-[90vh] overflow-y-auto` to handle long product descriptions
- Place sticky footer with "Add to Cart" button in DialogFooter
- Use DialogClose with asChild for custom cancel buttons
- Nest ScrollArea inside DialogContent for better scroll handling

**Accessibility:**
- Automatic focus management with Radix Dialog
- Proper ARIA roles and attributes
- Keyboard navigation (Esc to close)
- Focus trap within modal

---

### 2. Drawer - Bottom Sheet for Mobile

**Registry Type:** UI Component
**Dependencies:** `vaul`, `@radix-ui/react-dialog`

**Purpose:** Responsive bottom sheet for mobile screens. Seamlessly switches from Dialog on desktop to Drawer on mobile.

**Key Props:**
- `open` - Control drawer visibility
- `onOpenChange` - Callback when drawer state changes
- `direction` - "right" (default) | "left" | "top" | "bottom"

**Structure:**
```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Product</Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>Product Name</DrawerTitle>
        <DrawerDescription>Customize your order</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {/* Product content */}
      </div>
      <DrawerFooter>
        <Button>Add to Cart</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>
```

**Responsive Dialog/Drawer Switching Pattern:**

To automatically switch between Dialog and Drawer based on screen size:

```tsx
'use client'

import { useMediaQuery } from '@/hooks/use-media-query' // Custom hook
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

export function ProductDetailsModal({ open, onOpenChange }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <ProductContent />
          <DialogFooter>
            <Button>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Product Details</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ProductContent />
          </div>
          <DrawerFooter>
            <Button>Add to Cart</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

**Mobile-Specific Considerations:**
- Drawer constrains to `max-w-sm` for better UX
- Avoid scroll issues by wrapping content in `<div className="p-4 pb-0">`
- Use DrawerClose for proper mobile back gesture support
- Title and description in DrawerHeader for consistent layout

---

### 3. RadioGroup - Variant Selection

**Registry Type:** UI Component
**Dependencies:** `@radix-ui/react-radio-group`

**Purpose:** Select a single variant (size, flavor, crust type, etc.) from multiple options. Perfect for mutually exclusive choices.

**Basic Example:**
```tsx
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function VariantSelector() {
  return (
    <RadioGroup defaultValue="medium">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="small" id="size-small" />
        <Label htmlFor="size-small">Small (10")</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="medium" id="size-medium" />
        <Label htmlFor="size-medium">Medium (12")</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="large" id="size-large" />
        <Label htmlFor="size-large">Large (14")</Label>
      </div>
    </RadioGroup>
  )
}
```

**With Price Display Pattern (Field Choice Card):**

The `field-choice-card` example shows a more advanced pattern with descriptions:

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export function VariantSelectorWithPrice() {
  return (
    <RadioGroup defaultValue="small" className="space-y-3">
      <Label htmlFor="small" className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="small" id="small" className="mt-1" />
        <div className="flex-1">
          <p className="font-medium">Small (10")</p>
          <p className="text-sm text-muted-foreground">Serves 1-2 people</p>
        </div>
        <span className="font-semibold">$8.99</span>
      </Label>

      <Label htmlFor="medium" className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="medium" id="medium" className="mt-1" />
        <div className="flex-1">
          <p className="font-medium">Medium (12")</p>
          <p className="text-sm text-muted-foreground">Serves 2-3 people</p>
        </div>
        <span className="font-semibold">$11.99</span>
      </Label>

      <Label htmlFor="large" className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent">
        <RadioGroupItem value="large" id="large" className="mt-1" />
        <div className="flex-1">
          <p className="font-medium">Large (14")</p>
          <p className="text-sm text-muted-foreground">Serves 3-4 people</p>
        </div>
        <span className="font-semibold">$14.99</span>
      </Label>
    </RadioGroup>
  )
}
```

**With React Hook Form Integration:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const schema = z.object({
  size: z.enum(['small', 'medium', 'large'], {
    required_error: 'Please select a size',
  }),
})

export function VariantFormField() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Select Size</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col">
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="small" />
                  </FormControl>
                  <FormLabel className="font-normal">Small (10") - $8.99</FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="medium" />
                  </FormControl>
                  <FormLabel className="font-normal">Medium (12") - $11.99</FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="large" />
                  </FormControl>
                  <FormLabel className="font-normal">Large (14") - $14.99</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

**Key Props:**
- `value` - Currently selected value
- `onValueChange` - Callback when selection changes
- `defaultValue` - Initial selected value
- `disabled` - Disable entire group

**Best Practices for Product Variants:**
- Group related variants (e.g., all sizes together)
- Display price alongside each option
- Use descriptive labels ("Medium (12")" instead of just "Medium")
- Include serving size or quantity information
- Use card-based layout with hover states for better UX
- Only allow one selection per variant type (RadioGroup enforces this)

---

### 4. Checkbox - Addon/Extra Selection

**Registry Type:** UI Component
**Dependencies:** `@radix-ui/react-checkbox`

**Purpose:** Select multiple add-ons (toppings, extra cheese, sides, etc.) from a list. Unlike RadioGroup, multiple selections are allowed.

**Basic Example:**
```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function AddonSelector() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Checkbox id="extra-cheese" />
        <Label htmlFor="extra-cheese">Extra Cheese (+$1.50)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="bacon" />
        <Label htmlFor="bacon">Bacon (+$2.00)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="pepperoni" />
        <Label htmlFor="pepperoni">Pepperoni (+$1.75)</Label>
      </div>
    </div>
  )
}
```

**With Descriptions and Pricing:**

Enhanced pattern with more information:

```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function AddonSelectorEnhanced() {
  return (
    <div className="space-y-3">
      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 cursor-pointer">
        <Checkbox id="extra-cheese" className="mt-1" />
        <div className="flex-1">
          <p className="text-sm font-medium">Extra Cheese</p>
          <p className="text-xs text-muted-foreground">Mozzarella blend</p>
        </div>
        <span className="text-sm font-medium">+$1.50</span>
      </Label>

      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 cursor-pointer">
        <Checkbox id="bacon" className="mt-1" />
        <div className="flex-1">
          <p className="text-sm font-medium">Crispy Bacon</p>
          <p className="text-xs text-muted-foreground">Premium quality</p>
        </div>
        <span className="text-sm font-medium">+$2.00</span>
      </Label>
    </div>
  )
}
```

**With React Hook Form Integration (Multiple Selection):**

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const addonOptions = [
  { id: 'extra-cheese', label: 'Extra Cheese', price: 1.5 },
  { id: 'bacon', label: 'Bacon', price: 2.0 },
  { id: 'pepperoni', label: 'Pepperoni', price: 1.75 },
]

const schema = z.object({
  addons: z.array(z.string()).min(0),
})

export function AddonFormField() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      addons: [],
    },
  })

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Add-ons</h3>
      {addonOptions.map((addon) => (
        <Controller
          key={addon.id}
          name="addons"
          control={form.control}
          render={({ field }) => (
            <Label className="flex items-center gap-3">
              <Checkbox
                checked={field.value.includes(addon.id)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...field.value, addon.id]
                    : field.value.filter((id) => id !== addon.id)
                  field.onChange(newValue)
                }}
              />
              <span className="text-sm font-medium">{addon.label}</span>
              <span className="text-sm text-muted-foreground">+${addon.price.toFixed(2)}</span>
            </Label>
          )}
        />
      ))}
    </div>
  )
}
```

**Key Props:**
- `checked` - Current checkbox state (true/false/indeterminate)
- `onCheckedChange` - Callback when state changes
- `defaultChecked` - Initial state
- `disabled` - Disable the checkbox
- `id` - Associate with Label

**Styling States:**
- Checked state uses blue styling by default
- Can customize with `data-[state=checked]:` classes
- Disabled state shows visual feedback

**Best Practices for Add-ons:**
- Show price next to each option
- Allow multiple selections (Checkbox, not RadioGroup)
- Group add-ons by category if many options
- Limit to reasonable number (5-10 max per category)
- Show total price increase dynamically
- Use indeterminate state if needed for parent category checkbox

---

### 5. Form - Complete Form Management

**Registry Type:** UI Component
**Dependencies:** `react-hook-form`, `@hookform/resolvers`, `zod`, `@radix-ui/react-label`, `@radix-ui/react-slot`

**Purpose:** Provides wrapper components and utilities for form validation using React Hook Form + Zod.

**Complete Product Details Form Example:**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const ProductSchema = z.object({
  size: z.enum(['small', 'medium', 'large'], {
    required_error: 'Please select a size',
  }),
  crust: z.enum(['thin', 'regular', 'stuffed'], {
    required_error: 'Please select a crust type',
  }),
  addons: z.array(z.string()),
  specialInstructions: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
})

export function ProductDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      size: 'medium',
      crust: 'regular',
      addons: [],
      quantity: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    setIsSubmitting(true)
    try {
      // Calculate total price based on selections
      const totalPrice = calculatePrice(values)

      // Submit to API
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'pizza-001',
          ...values,
          totalPrice,
        }),
      })

      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Size Selection */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Size</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="small" />
                    </FormControl>
                    <FormLabel className="font-normal">Small (10") - $8.99</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="medium" />
                    </FormControl>
                    <FormLabel className="font-normal">Medium (12") - $11.99</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="large" />
                    </FormControl>
                    <FormLabel className="font-normal">Large (14") - $14.99</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Crust Selection */}
        <FormField
          control={form.control}
          name="crust"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Crust Type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="thin" />
                    </FormControl>
                    <FormLabel className="font-normal">Thin Crust</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="regular" />
                    </FormControl>
                    <FormLabel className="font-normal">Regular Crust</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value="stuffed" />
                    </FormControl>
                    <FormLabel className="font-normal">Stuffed Crust (+$1.00)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add-ons Selection */}
        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Add-ons</FormLabel>
              <div className="space-y-2">
                {['extra-cheese', 'bacon', 'pepperoni'].map((addon) => (
                  <FormItem key={addon} className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value.includes(addon)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, addon]
                            : field.value.filter((id) => id !== addon)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">
                      {addon === 'extra-cheese' && 'Extra Cheese (+$1.50)'}
                      {addon === 'bacon' && 'Bacon (+$2.00)'}
                      {addon === 'pepperoni' && 'Pepperoni (+$1.75)'}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Instructions */}
        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Input placeholder="e.g., No onions, extra sauce..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Adding to cart...' : 'Add to Cart'}
        </Button>
      </form>
    </Form>
  )
}
```

**Form Component Hierarchy:**
- `Form` - Wrapper using FormProvider from react-hook-form
- `FormField` - Field controller binding
- `FormItem` - Container for label + control + message
- `FormLabel` - Associated label
- `FormControl` - Wraps actual input component
- `FormMessage` - Shows validation errors

**Validation Best Practices:**
- Use Zod for schema validation
- Provide helpful error messages
- Validate on blur for better UX
- Show inline errors next to fields
- Disable submit button during submission
- Provide loading state feedback

---

### 6. ScrollArea - Content Overflow Handling

**Registry Type:** UI Component
**Dependencies:** `@radix-ui/react-scroll-area`

**Purpose:** Provides custom scrollbar styling for product details content. Useful for long descriptions, reviews, or addon lists.

**Basic Example:**
```tsx
import { ScrollArea } from '@/components/ui/scroll-area'

export function ProductDescription() {
  return (
    <ScrollArea className="h-64 w-full rounded-md border p-4">
      <div>
        <h3 className="text-sm font-medium mb-4">Product Description</h3>
        <p className="text-sm text-muted-foreground">
          {/* Long product description */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
        </p>
      </div>
    </ScrollArea>
  )
}
```

**Vertical Scrolling Pattern (for product descriptions/reviews):**

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function ProductReviews() {
  const reviews = [
    { id: 1, author: 'John', rating: 5, text: 'Amazing pizza!' },
    { id: 2, author: 'Jane', rating: 4, text: 'Good quality...' },
    // More reviews...
  ]

  return (
    <ScrollArea className="h-80 w-full rounded-md border">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-4">Customer Reviews</h4>
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="py-2">
              <p className="text-sm font-medium">{review.author}</p>
              <p className="text-xs text-muted-foreground">Rating: {review.rating}/5</p>
              <p className="text-sm mt-1">{review.text}</p>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

**Horizontal Scrolling Pattern (for variants or related products):**

```tsx
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function RelatedProducts() {
  const products = [
    { id: 1, name: 'Classic Pizza', image: '...' },
    { id: 2, name: 'Deluxe Pizza', image: '...' },
    // More products...
  ]

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-40">
            <img src={product.image} alt={product.name} className="h-32 w-40 rounded-md object-cover" />
            <p className="text-sm mt-2">{product.name}</p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

**Key Props:**
- `className` - Set height with `h-[number]` or `h-screen`
- `children` - Content to scroll
- ScrollBar orientation: "vertical" (default) or "horizontal"

**Best Practices:**
- Always set a fixed height for vertical scrolling
- Use Separator to divide list items visually
- Include ScrollBar for horizontal scrolling to show scrollbar track
- Constrain width for horizontal scrolling with `whitespace-nowrap`
- Use in modals to prevent body scroll
- Consider native scrolling for mobile (remove ScrollArea)

---

### 7. Card - Variant/Addon Container

**Registry Type:** UI Component
**Dependencies:** None

**Purpose:** Visual container for product information, variants, or addon groups.

**Basic Structure:**
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Margherita Pizza</CardTitle>
        <CardDescription>Fresh mozzarella and basil</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Delicious Italian pizza made with fresh ingredients.</p>
      </CardContent>
    </Card>
  )
}
```

**Using Card for Variant Display:**

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function VariantCardsLayout() {
  const variants = [
    { id: 'small', name: 'Small', price: 8.99, description: 'Serves 1-2' },
    { id: 'medium', name: 'Medium', price: 11.99, description: 'Serves 2-3' },
    { id: 'large', name: 'Large', price: 14.99, description: 'Serves 3-4' },
  ]

  return (
    <RadioGroup defaultValue="medium">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {variants.map((variant) => (
          <label key={variant.id}>
            <Card className="cursor-pointer border-2 has-[[aria-checked=true]]:border-blue-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{variant.name}</p>
                    <p className="text-xs text-muted-foreground">{variant.description}</p>
                  </div>
                  <RadioGroupItem value={variant.id} />
                </div>
                <p className="text-lg font-semibold">${variant.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          </label>
        ))}
      </div>
    </RadioGroup>
  )
}
```

**Card Components:**
- `Card` - Container with border and background
- `CardHeader` - Top section, usually for title/description
- `CardTitle` - Main heading
- `CardDescription` - Subtitle or additional info
- `CardContent` - Main content area
- `CardFooter` - Bottom section, usually for actions

**Styling:**
- Default padding: header/footer 24px, content varies
- Border and subtle shadow by default
- Use `has-[[aria-checked=true]]` CSS selector for active states
- Works well with Tailwind grid layouts

---

### 8. Label - Form Field Labels

**Registry Type:** UI Component
**Dependencies:** `@radix-ui/react-label`

**Purpose:** Accessible form labels properly associated with form inputs via `htmlFor` attribute.

**Basic Usage:**
```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function FormField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="your@email.com" />
    </div>
  )
}
```

**With Checkbox:**
```tsx
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function CheckboxField() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="font-normal">I agree to the terms</Label>
    </div>
  )
}
```

**With RadioGroup:**
```tsx
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function RadioField() {
  return (
    <RadioGroup>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1" className="font-normal">Option 1</Label>
      </div>
    </RadioGroup>
  )
}
```

**Key Props:**
- `htmlFor` - Must match input `id` for accessibility
- `className` - Add `font-normal` when label follows input (not inside FormLabel)

**Accessibility:**
- Always associate with form control via `htmlFor`
- Use semantic HTML (not just `<span>`)
- Increases click target area for inputs

---

## Recommended Architecture for Product Details

### Component Hierarchy

```
ProductDetailsModal (handles open/close state)
├── Dialog/Drawer (responsive pattern)
├── ProductDetailsForm
│   ├── ProductImage
│   ├── ProductHeader (name, rating, price)
│   ├── ScrollArea (for description if long)
│   │   └── ProductDescription
│   ├── Form (React Hook Form)
│   │   ├── SizeSelector (RadioGroup)
│   │   ├── CrustSelector (RadioGroup)
│   │   ├── AddonSelector (Checkbox group)
│   │   ├── SpecialInstructions (Input)
│   │   └── QuantitySelector (Input number)
│   └── Sticky Footer
│       ├── PriceDisplay
│       └── AddToCartButton
```

### State Management Pattern

```tsx
// Product state
const [open, setOpen] = useState(false)
const [productId, setProductId] = useState(null)

// Derived from form values
const [selectedSize, setSelectedSize] = useState('medium')
const [selectedAddons, setSelectedAddons] = useState([])
const [quantity, setQuantity] = useState(1)

// Calculate dynamic price
const basePrice = getPriceForSize(selectedSize)
const addonPrice = selectedAddons.reduce((sum, addon) => sum + getPriceForAddon(addon), 0)
const totalPrice = (basePrice + addonPrice) * quantity
```

### Responsive Behavior

| Screen Size | Container | Pattern |
|------------|-----------|---------|
| < 640px | Mobile | Drawer (bottom sheet) |
| 640px - 1024px | Tablet | Dialog (center modal) |
| > 1024px | Desktop | Dialog (center modal) |

---

## Key Implementation Patterns

### 1. Sticky Footer with Add to Cart Button

```tsx
<Dialog>
  <DialogContent className="flex flex-col max-h-[90vh]">
    <DialogHeader>
      {/* Product info */}
    </DialogHeader>

    <ScrollArea className="flex-1">
      <div className="p-4">
        {/* Form content */}
      </div>
    </ScrollArea>

    <DialogFooter className="sticky bottom-0 border-t bg-background p-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-sm text-muted-foreground">Total:</p>
          <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <Button size="lg" className="flex-1 ml-4">
          Add to Cart
        </Button>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 2. Dynamic Price Calculation

```tsx
function calculatePrice(values: ProductFormValues): number {
  const sizePrice = {
    small: 8.99,
    medium: 11.99,
    large: 14.99,
  }[values.size]

  const crustPrice = values.crust === 'stuffed' ? 1.0 : 0

  const addonPrice = values.addons.reduce((sum, addonId) => {
    const prices = {
      'extra-cheese': 1.5,
      'bacon': 2.0,
      'pepperoni': 1.75,
    }
    return sum + (prices[addonId] || 0)
  }, 0)

  return (sizePrice + crustPrice + addonPrice) * values.quantity
}
```

### 3. Validation Rules

```tsx
const ProductSchema = z.object({
  size: z.enum(['small', 'medium', 'large'], {
    errorMap: () => ({ message: 'Please select a size' }),
  }),
  crust: z.enum(['thin', 'regular', 'stuffed'], {
    errorMap: () => ({ message: 'Please select a crust type' }),
  }),
  addons: z.array(z.string()).default([]),
  specialInstructions: z.string().max(500, 'Instructions must be 500 characters or less').optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Maximum 99 items'),
})
```

---

## Mobile-Specific Considerations

### ScrollArea on Mobile

Don't use ScrollArea on mobile Drawer content. Let the drawer handle scrolling naturally:

```tsx
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        {/* Content auto-scrolls */}
      </DrawerHeader>
      <div className="p-4 pb-0 overflow-y-auto">
        {/* Product content - drawer handles scroll */}
      </div>
      <DrawerFooter className="sticky bottom-0">
        {/* Buttons */}
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>
```

### Touch-Friendly Spacing

On mobile, increase spacing for touch targets:

```tsx
<div className="flex items-center gap-4 md:gap-3">  {/* Larger gap on mobile */}
  <Checkbox id="addon" />
  <Label htmlFor="addon" className="text-base md:text-sm">  {/* Larger text on mobile */}
    Extra Cheese (+$1.50)
  </Label>
</div>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  {/* Variant cards stack on mobile, 2 cols on tablet, 3 on desktop */}
</div>
```

---

## Performance Optimization

### Lazy Loading Product Details

```tsx
const ProductDetailsForm = lazy(() => import('./ProductDetailsForm'))

export function ProductModal() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetailsForm />
    </Suspense>
  )
}
```

### Memoization for Expensive Renders

```tsx
const VariantSelector = memo(({ variants, onChange }) => (
  // Component content
))

const AddonList = memo(({ addons, selectedAddons, onChange }) => (
  // Component content
))
```

---

## Accessibility Features

### ARIA Attributes

- Dialog automatically provides `role="dialog"` and focus management
- RadioGroup and Checkbox use Radix UI primitives with full a11y support
- Labels properly associated with form controls via `htmlFor`

### Keyboard Navigation

- Tab through all form fields
- Enter to submit form
- Escape to close modal
- Arrow keys to navigate RadioGroup options

### Screen Reader Support

- Semantic HTML structure
- Proper heading hierarchy
- Form errors announced
- Dynamic price updates can be wrapped in `aria-live` region for announcements

---

## Additional Components Worth Considering

| Component | Use Case | Notes |
|-----------|----------|-------|
| **Tabs** | Group variants by category | Alternative to accordion for flat structure |
| **Separator** | Divide sections visually | Used in examples above |
| **Badge** | Show special tags ("NEW", "HOT", "POPULAR") | For product highlights |
| **Skeleton** | Loading state | Show while product details load |
| **Toast/Sonner** | Feedback messages | Success/error when adding to cart |
| **Popover** | Tooltip info | Help text for options |
| **Select** | Large addon list | Alternative to checkbox list if >10 options |
| **Combobox** | Searchable add-ons | For restaurants with many toppings |

---

## Testing Considerations

### Form Validation Testing

```tsx
describe('ProductDetailsForm', () => {
  it('should require size selection', async () => {
    const { getByText } = render(<ProductDetailsForm />)
    const submitButton = getByText('Add to Cart')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(getByText('Please select a size')).toBeInTheDocument()
    })
  })

  it('should calculate correct price with addons', () => {
    const { getByLabelText } = render(<ProductDetailsForm />)

    fireEvent.click(getByLabelText('Extra Cheese (+$1.50)'))

    expect(getByText('$13.49')).toBeInTheDocument() // 11.99 + 1.50
  })
})
```

### Responsive Testing

- Test Dialog on desktop (1024px+)
- Test Drawer on mobile (< 640px)
- Verify touch targets are min 44x44px on mobile

---

## Summary

The shadcn/ui component library provides excellent building blocks for a product details feature:

1. **Dialog/Drawer** - Handle responsive modal presentation
2. **Form + RadioGroup + Checkbox** - Manage product customization and validation
3. **ScrollArea** - Handle long content gracefully
4. **Card** - Structure variant/addon display
5. **Label** - Ensure accessible forms

The recommended pattern combines these components into a sticky footer modal with real-time price calculation and comprehensive form validation using React Hook Form and Zod.

Installation of all components can be done with the single command above, and the patterns provided can be adapted to fit your specific product types and customization options.
