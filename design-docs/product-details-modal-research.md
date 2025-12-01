# Food Delivery Product Details Modal - shadcn/ui Component Research

## Executive Summary

This document provides comprehensive research on shadcn/ui components optimized for building a premium food delivery product details modal (Zomato/Swiggy quality). The modal requires 6 core components with specific customizations for food delivery UX patterns.

**Stack Requirements:**
- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui (new-york style)

---

## Installation Commands

### All Components at Once
```bash
npx shadcn@latest add @shadcn/radio-group @shadcn/checkbox @shadcn/badge @shadcn/textarea @shadcn/card @shadcn/button @shadcn/label @shadcn/input
```

### Individual Installation (if needed)
```bash
npx shadcn@latest add @shadcn/radio-group
npx shadcn@latest add @shadcn/checkbox
npx shadcn@latest add @shadcn/badge
npx shadcn@latest add @shadcn/textarea
npx shadcn@latest add @shadcn/card
npx shadcn@latest add @shadcn/button
npx shadcn@latest add @shadcn/label
npx shadcn@latest add @shadcn/input
```

---

## 1. RadioGroup Component

### Purpose
For variant selection (size, crust type, bread type, etc.) with visual distinction and pricing display.

### Component Information
- **Type:** registry:ui
- **Dependencies:** @radix-ui/react-radio-group
- **Files:** 1 file
- **Registry:** @shadcn

### API & Props

The RadioGroup component wraps Radix UI's radio group with consistent styling:

```tsx
// Core Component
<RadioGroup
  value={string}
  onValueChange={(value: string) => void}
  defaultValue={string}
  disabled={boolean}
  className={string}
>
  <RadioGroupItem value={string} id={string} disabled={boolean} />
</RadioGroup>
```

**Key Props:**
- `value` - Currently selected value
- `onValueChange` - Callback when selection changes
- `defaultValue` - Initial selected value
- `disabled` - Disables all radio items
- `className` - Custom styling (Tailwind)

### Base Implementation Example

```tsx
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}
```

### Food Delivery Customization - Card-Style Selection

For Zomato/Swiggy style variant selection with prices:

```tsx
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

interface Variant {
  id: string
  label: string
  price: number
  description?: string
  isMostOrdered?: boolean
}

export function VariantSelector() {
  const [selectedSize, setSelectedSize] = useState("medium")

  const sizes: Variant[] = [
    {
      id: "small",
      label: "Small",
      price: 249,
      description: "6 inch",
      isMostOrdered: true
    },
    {
      id: "medium",
      label: "Medium",
      price: 349,
      description: "9 inch"
    },
    {
      id: "large",
      label: "Large",
      price: 499,
      description: "12 inch"
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Select Size</h3>
      <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
        {sizes.map((size) => (
          <Label
            key={size.id}
            htmlFor={`size-${size.id}`}
            className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5"
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value={size.id}
                id={`size-${size.id}`}
                className="mt-1"
              />
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{size.label}</span>
                  {size.isMostOrdered && (
                    <Badge variant="secondary" className="text-xs">
                      Most Ordered
                    </Badge>
                  )}
                </div>
                {size.description && (
                  <p className="text-muted-foreground text-sm">
                    {size.description}
                  </p>
                )}
              </div>
            </div>
            <span className="font-semibold">₹{size.price}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
```

### Styling Customization

The RadioGroupItem can be customized via className:

```tsx
// For larger selection buttons
<RadioGroupItem
  value="option1"
  id="option1"
  className="h-5 w-5"  // Increase size
/>

// For colored borders when selected
<Label className="has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50">
  {/* Content */}
</Label>
```

### Key Customization Points for Food Delivery

1. **Card-style layout** - Wrap in bordered container with hover states
2. **Price display** - Right-align price value
3. **Badge integration** - Add "Most Ordered", "Veg/Non-veg" badges
4. **Visual feedback** - Border color and background changes on selection
5. **Description** - Show item specifications (size, weight, etc.)

### Best Practices

- Use with Label component for accessibility
- Provide visual feedback on hover and selection
- Group related options in sections
- Display prices consistently on the right
- Use badges for special attributes (most ordered, trending, etc.)

---

## 2. Checkbox Component

### Purpose
For addon/topping selection with optional quantity integration (e.g., "Add Extra Cheese").

### Component Information
- **Type:** registry:ui
- **Dependencies:** @radix-ui/react-checkbox
- **Files:** 1 file
- **Registry:** @shadcn

### API & Props

```tsx
<Checkbox
  checked={boolean | "indeterminate"}
  onCheckedChange={(checked: boolean) => void}
  disabled={boolean}
  id={string}
  className={string}
  aria-label={string}
/>
```

**Key Props:**
- `checked` - Controlled or uncontrolled state (boolean or "indeterminate")
- `onCheckedChange` - Callback when checkbox state changes
- `disabled` - Disables the checkbox
- `id` - For associating with labels
- `defaultChecked` - Initial state when uncontrolled

### Base Implementation Example

```tsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Food Delivery Customization - Addon Selection with Quantity

For addon selection with quantity counter:

```tsx
"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"

interface Addon {
  id: string
  name: string
  price: number
  description?: string
  maxQuantity?: number
}

export function AddonSelector() {
  const [addons, setAddons] = useState<Record<string, number>>({})

  const availableAddons: Addon[] = [
    {
      id: "extra-cheese",
      name: "Extra Cheese",
      price: 40,
      maxQuantity: 5
    },
    {
      id: "pepperoni",
      name: "Pepperoni",
      price: 60,
      description: "Italian seasoned meat",
      maxQuantity: 5
    },
    {
      id: "mushroom",
      name: "Mushrooms",
      price: 30,
      maxQuantity: 3
    },
  ]

  const handleAddonToggle = (addonId: string) => {
    setAddons((prev) => {
      if (prev[addonId]) {
        const { [addonId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [addonId]: 1 }
    })
  }

  const handleQuantityChange = (addonId: string, change: number) => {
    setAddons((prev) => {
      const currentQty = prev[addonId] || 0
      const newQty = Math.max(0, currentQty + change)
      if (newQty === 0) {
        const { [addonId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [addonId]: newQty }
    })
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Add Extras</h3>
      <div className="space-y-2">
        {availableAddons.map((addon) => (
          <div
            key={addon.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={addon.id}
                checked={addon.id in addons}
                onCheckedChange={() => handleAddonToggle(addon.id)}
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor={addon.id}
                  className="font-medium cursor-pointer"
                >
                  {addon.name}
                </Label>
                {addon.description && (
                  <p className="text-muted-foreground text-xs">
                    {addon.description}
                  </p>
                )}
              </div>
            </div>

            {addon.id in addons ? (
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm min-w-8">
                  ₹{addon.price * (addons[addon.id] || 1)}
                </span>
                <div className="flex items-center gap-1 rounded border bg-muted">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleQuantityChange(addon.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-xs font-medium">
                    {addons[addon.id]}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleQuantityChange(addon.id, 1)}
                    disabled={
                      addon.maxQuantity !== undefined &&
                      addons[addon.id] >= addon.maxQuantity
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <span className="font-medium text-sm">₹{addon.price}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### With Card-Style Layout

```tsx
<Label
  htmlFor={addon.id}
  className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50 cursor-pointer dark:has-[[aria-checked=true]]:border-orange-600 dark:has-[[aria-checked=true]]:bg-orange-950"
>
  <Checkbox
    id={addon.id}
    defaultChecked={false}
    className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 mt-1"
  />
  <div className="grid gap-1.5 font-normal">
    <p className="text-sm leading-none font-medium">
      {addon.name}
    </p>
    {addon.description && (
      <p className="text-muted-foreground text-xs">
        {addon.description}
      </p>
    )}
  </div>
</Label>
```

### Key Customization Points for Food Delivery

1. **With quantity counter** - Combine checkbox with button stepper
2. **Card-style layout** - Add borders and background colors
3. **Price display** - Show per-item and total addon price
4. **Description** - Display ingredient info or allergens
5. **Color coding** - Use orange/green for food categories
6. **Group management** - Group addons by category (Toppings, Sauces, etc.)

### Best Practices

- Use controlled state for tracking addon quantities
- Show pricing clearly next to each addon
- Use visual grouping for addon categories
- Disable checkboxes when max quantity reached
- Provide clear descriptions for allergens/ingredients
- Show total addon cost in real-time

---

## 3. Badge Component

### Purpose
For status indicators, special labels ("Most Ordered", "Veg/Non-veg", "Bestseller"), and requirement badges ("Required").

### Component Information
- **Type:** registry:ui
- **Dependencies:** @radix-ui/react-slot
- **Files:** 1 file
- **Registry:** @shadcn

### API & Props

```tsx
<Badge
  variant="default" | "secondary" | "destructive" | "outline"
  className={string}
  asChild={boolean}
>
  Content
</Badge>
```

**Variant Options:**
- `default` - Primary background (blue)
- `secondary` - Muted background
- `destructive` - Red/danger background
- `outline` - Transparent with border

### Base Implementation Example

```tsx
import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge className="bg-blue-500 text-white dark:bg-blue-600">
          Verified
        </Badge>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
      </div>
    </div>
  )
}
```

### Food Delivery Customization - Status Badges

```tsx
import { BadgeCheckIcon, TrendingUpIcon, UtensilsCrossedIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FoodDeliveryBadges() {
  return (
    <div className="space-y-4">
      {/* Best Seller / Most Ordered */}
      <Badge className="bg-orange-500 text-white hover:bg-orange-600">
        <TrendingUpIcon className="mr-1 h-3 w-3" />
        Most Ordered
      </Badge>

      {/* Veg/Non-veg indicator */}
      <div className="flex gap-2">
        <Badge variant="secondary" className="border-green-500 bg-green-50 text-green-700">
          <div className="h-2 w-2 rounded-sm bg-green-500 mr-2" />
          Veg
        </Badge>
        <Badge variant="secondary" className="border-red-500 bg-red-50 text-red-700">
          <div className="h-2 w-2 rounded-sm bg-red-500 mr-2" />
          Non-Veg
        </Badge>
      </div>

      {/* Required Field Indicator */}
      <Badge variant="destructive" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
        Required
      </Badge>

      {/* Bestseller */}
      <Badge className="bg-amber-500 text-white hover:bg-amber-600">
        <BadgeCheckIcon className="mr-1 h-3 w-3" />
        Bestseller
      </Badge>

      {/* Spice Level */}
      <Badge variant="outline" className="border-orange-300">
        🌶️ Spicy
      </Badge>

      {/* Delivery Time */}
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        30 mins
      </Badge>

      {/* Rating Badge */}
      <Badge className="bg-green-500 text-white hover:bg-green-600">
        4.5 ⭐
      </Badge>
    </div>
  )
}
```

### Inline Badge in Product Card

```tsx
<div className="relative">
  <div className="absolute top-2 right-2 flex gap-2 z-10">
    <Badge className="bg-orange-500 text-white">Most Ordered</Badge>
  </div>
  {/* Product image and details */}
</div>
```

### Key Customization Points for Food Delivery

1. **Color coding** - Orange for primary, Green for veg, Red for non-veg
2. **Icons** - Use Lucide icons (trending, checkmark, etc.)
3. **Veg indicator** - Green square for veg, red for non-veg
4. **Status labels** - Bestseller, New, Limited Time, etc.
5. **Allergen warnings** - Spicy, Contains nuts, Gluten-free, etc.
6. **Required indicators** - For mandatory options
7. **Time badges** - Delivery or prep time
8. **Circular badges** - For ratings or counts

### Best Practices

- Use consistent colors for same types (all veg=green, all non-veg=red)
- Combine icons with text for clarity
- Use sparingly to avoid visual clutter
- Place badges in consistent locations
- Use outline variant for secondary information
- Add hover states for interactive badges

---

## 4. Textarea Component

### Purpose
For cooking requests/special instructions with character limit and quick action chips.

### Component Information
- **Type:** registry:ui
- **Files:** 1 file
- **Registry:** @shadcn
- **No external dependencies** - Uses native HTML textarea

### API & Props

```tsx
<Textarea
  placeholder={string}
  value={string}
  onChange={(e) => void}
  disabled={boolean}
  readOnly={boolean}
  rows={number}
  className={string}
  aria-label={string}
/>
```

**Key Props:**
- `placeholder` - Placeholder text
- `value` / `onChange` - For controlled input
- `disabled` - Disables the textarea
- `rows` - Number of visible rows
- `maxLength` - Character limit
- `className` - Custom styling

### Base Implementation Example

```tsx
import { Textarea } from "@/components/ui/textarea"

export default function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />
}
```

### Food Delivery Customization - Cooking Request with Quick Actions

```tsx
"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const QUICK_REQUESTS = [
  "Extra spicy",
  "Less spicy",
  "No onions",
  "No garlic",
  "Extra cheese",
  "Well done",
  "Fresh ingredients",
  "Low salt",
]

export function CookingRequestInput() {
  const [request, setRequest] = useState("")
  const [selectedQuickRequests, setSelectedQuickRequests] = useState<string[]>([])

  const maxLength = 200
  const charCount = request.length

  const toggleQuickRequest = (text: string) => {
    setSelectedQuickRequests((prev) => {
      if (prev.includes(text)) {
        return prev.filter((r) => r !== text)
      }
      return [...prev, text]
    })

    // Add to textarea if not already present
    if (!request.includes(text)) {
      const newRequest = request ? `${request}, ${text}` : text
      setRequest(newRequest.slice(0, maxLength))
    }
  }

  const removeQuickRequest = (text: string) => {
    setSelectedQuickRequests((prev) => prev.filter((r) => r !== text))
    setRequest((prev) =>
      prev
        .split(", ")
        .filter((r) => r !== text)
        .join(", ")
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h3 className="font-semibold">Special Requests</h3>
        <p className="text-muted-foreground text-sm">
          Let the restaurant know if you have any special preferences
        </p>
      </div>

      {/* Quick action chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_REQUESTS.map((quickRequest) => (
          <Button
            key={quickRequest}
            variant={selectedQuickRequests.includes(quickRequest) ? "default" : "outline"}
            size="sm"
            className="rounded-full h-auto py-1 px-3 text-xs"
            onClick={() => toggleQuickRequest(quickRequest)}
          >
            {quickRequest}
          </Button>
        ))}
      </div>

      {/* Custom request textarea */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add any additional requests or preferences..."
          value={request}
          onChange={(e) => setRequest(e.target.value.slice(0, maxLength))}
          rows={4}
          className="resize-none"
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <p>Any allergies or special instructions?</p>
          <p>{charCount}/{maxLength}</p>
        </div>
      </div>

      {/* Selected requests display */}
      {selectedQuickRequests.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Selected ({selectedQuickRequests.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedQuickRequests.map((req) => (
              <div
                key={req}
                className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 text-xs"
              >
                <span>{req}</span>
                <button
                  onClick={() => removeQuickRequest(req)}
                  className="hover:text-foreground text-muted-foreground"
                  aria-label={`Remove ${req}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### With Character Count Only

```tsx
"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export function CookingRequestSimple() {
  const [request, setRequest] = useState("")
  const maxLength = 200

  return (
    <div className="space-y-2">
      <label className="font-semibold">Special Requests</label>
      <Textarea
        placeholder="Add any special instructions..."
        value={request}
        onChange={(e) => setRequest(e.target.value.slice(0, maxLength))}
        rows={4}
        className="resize-none"
      />
      <div className="text-xs text-muted-foreground text-right">
        {request.length}/{maxLength}
      </div>
    </div>
  )
}
```

### Key Customization Points for Food Delivery

1. **Quick action chips** - Pre-defined common requests
2. **Character counter** - Show limit and current count
3. **Placeholder text** - Guide users with helpful text
4. **Row height** - Default 4-5 rows for adequate space
5. **Disable resize** - Use resize-none for consistent layout
6. **Chip selection** - Show selected items separately
7. **Clear button** - Allow clearing all text
8. **Validation** - Show required indicator

### Best Practices

- Provide common quick requests as clickable chips
- Show character count with a reasonable limit (200-250)
- Use placeholder to explain what goes here
- Auto-populate from quick chips
- Allow manual input alongside quick chips
- Disable resize to prevent layout shifts
- Validate special characters
- Show helper text about allergies

---

## 5. Card Component

### Purpose
For grouping variant sections, addon sections, and overall modal structure.

### Component Information
- **Type:** registry:ui
- **Files:** 1 file
- **Registry:** @shadcn
- **No external dependencies** - Semantic HTML div wrapper

### API & Props

```tsx
<Card className={string}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Action</CardAction>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Sub-components:**
- `Card` - Container
- `CardHeader` - Top section with title and description
- `CardTitle` - Large title text
- `CardDescription` - Subtitle/description text
- `CardContent` - Main content area
- `CardFooter` - Bottom action area
- `CardAction` - Optional action in header (right-aligned)

### Base Implementation Example

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Form content */}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Food Delivery Customization - Product Modal Structure

```tsx
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Minus, Plus, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  image: string
  basePrice: number
  rating: number
  reviewCount: number
  isBestseller: boolean
  prepTime: number
  calories?: number
}

export function ProductDetailsModal() {
  const [quantity, setQuantity] = useState(1)

  const product: Product = {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
    image: "/pizza.jpg",
    basePrice: 299,
    rating: 4.5,
    reviewCount: 324,
    isBestseller: true,
    prepTime: 25,
    calories: 2100,
  }

  return (
    <Card className="w-full max-w-2xl">
      {/* Product Header */}
      <CardHeader className="space-y-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="h-48 w-48 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                {product.isBestseller && (
                  <Badge className="mt-2 bg-orange-500 text-white">
                    Bestseller
                  </Badge>
                )}
              </div>
            </div>

            <CardDescription className="text-base">
              {product.description}
            </CardDescription>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({product.reviewCount})
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {product.prepTime} mins
              </span>
            </div>

            {/* Price & Quantity */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-muted-foreground text-sm">Starting at</p>
                <p className="text-2xl font-bold">₹{product.basePrice}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border bg-muted">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Nested Cards for Sections */}
      <CardContent className="space-y-4">
        {/* Variants Section */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Size</CardTitle>
          </CardHeader>
          <CardContent>
            {/* RadioGroup for variants */}
          </CardContent>
        </Card>

        {/* Addons Section */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Extras</CardTitle>
            <CardDescription>Optional - Add toppings and sides</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Checkbox for addons */}
          </CardContent>
        </Card>

        {/* Special Requests Section */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Textarea for requests */}
          </CardContent>
        </Card>
      </CardContent>

      {/* Footer with CTA */}
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Add to Favourites
        </Button>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
          Add to Cart - ₹{product.basePrice * quantity}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Nested Card Pattern for Sections

```tsx
<Card>
  <CardHeader>
    <CardTitle>Select Size</CardTitle>
    <CardDescription>Required</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Options inside */}
  </CardContent>
</Card>
```

### Key Customization Points for Food Delivery

1. **Product header** - Image + basic info + rating
2. **Nested cards** - Separate cards for variants, addons, requests
3. **Price display** - Show base price prominently
4. **Quantity selector** - Pill-shaped counter in header
5. **Sections layout** - Vertical stack of card sections
6. **Footer actions** - Add to cart and favorite buttons
7. **Muted backgrounds** - Use bg-muted/20 for nested cards
8. **Spacing** - Consistent padding and gaps

### Best Practices

- Use main card for modal container
- Nest smaller cards for logical sections
- Group related fields in separate cards
- Use CardDescription for section details (Required/Optional)
- Keep footer buttons at the bottom
- Use consistent spacing between sections
- Make main CTA (Add to Cart) prominent

---

## 6. Button Component

### Purpose
For quantity stepper (pill-shaped counter), add-to-cart action, and various interactive elements.

### Component Information
- **Type:** registry:ui
- **Dependencies:** @radix-ui/react-slot
- **Files:** 1 file
- **Registry:** @shadcn

### API & Props

```tsx
<Button
  variant="default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size="default" | "sm" | "lg" | "icon"
  disabled={boolean}
  onClick={() => void}
  asChild={boolean}
  className={string}
>
  Content
</Button>
```

**Variants:**
- `default` - Primary action (blue background)
- `secondary` - Secondary action (muted background)
- `destructive` - Danger action (red background)
- `outline` - Bordered button (transparent)
- `ghost` - No background, text only
- `link` - Like a link but button semantics

**Sizes:**
- `default` - Standard height
- `sm` - Small, compact
- `lg` - Large, tall
- `icon` - Square, for icons

### Base Implementation Example

```tsx
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
```

### Pill-Shaped Quantity Counter

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

export function QuantityCounter() {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex items-center gap-2 rounded-full border bg-white dark:bg-slate-950 p-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 rounded-full p-0"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center text-sm font-semibold">
        {quantity}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 rounded-full p-0"
        onClick={() => setQuantity(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Add-to-Cart Button Group

```tsx
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function AddToCartGroup() {
  return (
    <div className="flex gap-2 w-full">
      {/* Add to Favorites */}
      <Button
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        aria-label="Add to favorites"
      >
        <Heart className="h-4 w-4" />
      </Button>

      {/* Add to Cart - Main CTA */}
      <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
        Add to Cart - ₹349
      </Button>
    </div>
  )
}
```

### Button Rounded Styles

```tsx
import { Button } from "@/components/ui/button"

export function RoundedButtons() {
  return (
    <div className="flex flex-col gap-2">
      {/* Fully rounded icon buttons */}
      <Button size="icon" className="rounded-full">
        <Plus />
      </Button>

      {/* Pill-shaped button */}
      <Button className="rounded-full px-6">
        View More
      </Button>

      {/* Rounded with text and icon */}
      <Button className="rounded-full gap-2">
        <Heart className="h-4 w-4" />
        Save for later
      </Button>
    </div>
  )
}
```

### Button Group Pattern

```tsx
import { Button } from "@/components/ui/button"
import { Archive, Trash } from "lucide-react"

export function ActionButtonGroup() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Archive className="h-4 w-4" />
        Save
      </Button>
      <Button variant="destructive" size="sm" className="gap-2">
        <Trash className="h-4 w-4" />
        Remove
      </Button>
    </div>
  )
}
```

### Key Customization Points for Food Delivery

1. **Quantity stepper** - Pill-shaped with min/max constraints
2. **Add to cart** - Primary CTA in orange
3. **Favorite button** - Icon button with heart
4. **Disabled state** - When out of stock
5. **Size indicator** - Show price update based on selection
6. **Loading state** - Show spinner during add
7. **Icons** - Use Lucide for consistency
8. **Rounded styling** - Use rounded-full for modern look

### Best Practices

- Use `rounded-full` for pill-shaped buttons
- Make main CTA (Add to Cart) visually prominent
- Use `size="icon"` for icon-only buttons
- Provide proper `aria-label` for icon buttons
- Show loading state during async operations
- Disable buttons when invalid selections made
- Use consistent spacing with flexbox
- Use orange/primary colors for food delivery CTAs

---

## Supporting Components

### Label Component

Essential for accessibility and pairing with form inputs.

```tsx
import { Label } from "@/components/ui/label"

export function LabelExample() {
  return (
    <div className="flex items-center gap-3">
      <input type="radio" id="option1" name="options" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
  )
}
```

### Input Component

For text inputs if needed in modal (search, quantity input).

```tsx
import { Input } from "@/components/ui/input"

export function InputExample() {
  return <Input type="text" placeholder="Enter quantity..." />
}
```

---

## Complete Product Modal Example

Here's a complete, production-ready example combining all components:

```tsx
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Minus, Plus, Star } from "lucide-react"

interface ProductDetailsModalProps {
  productId: string
}

export function ProductDetailsModal({
  productId,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("medium")
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({})
  const [cookingRequest, setCookingRequest] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data
  const product = {
    id: productId,
    name: "Spicy Pepperoni Pizza",
    description:
      "Loaded with fresh pepperoni, mozzarella cheese, and our special spicy marinara sauce",
    image: "/pizza.jpg",
    basePrice: 299,
    rating: 4.5,
    reviewCount: 324,
    isBestseller: true,
    prepTime: 25,
    isVeg: false,
  }

  const sizes = [
    { id: "small", label: "Small", price: 249, description: "6 inch", isMostOrdered: true },
    { id: "medium", label: "Medium", price: 299, description: "9 inch" },
    { id: "large", label: "Large", price: 399, description: "12 inch" },
  ]

  const addons = [
    { id: "extra-cheese", name: "Extra Cheese", price: 40 },
    { id: "pepperoni", name: "Pepperoni", price: 60 },
    { id: "mushroom", name: "Mushrooms", price: 30 },
    { id: "olives", name: "Black Olives", price: 35 },
  ]

  const selectedSizePrice = sizes.find((s) => s.id === selectedSize)?.price || product.basePrice
  const addonTotal = Object.entries(selectedAddons).reduce(
    (sum, [addonId, qty]) => {
      const addon = addons.find((a) => a.id === addonId)
      return sum + (addon?.price || 0) * qty
    },
    0
  )
  const totalPrice = (selectedSizePrice + addonTotal) * quantity

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) => {
      if (prev[addonId]) {
        const { [addonId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [addonId]: 1 }
    })
  }

  const handleAddonQuantityChange = (addonId: string, change: number) => {
    setSelectedAddons((prev) => {
      const currentQty = prev[addonId] || 0
      const newQty = Math.max(0, currentQty + change)
      if (newQty === 0) {
        const { [addonId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [addonId]: newQty }
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      {/* Header with Product Info */}
      <CardHeader className="space-y-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="h-48 w-48 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              {product.isBestseller && (
                <Badge className="mt-2 bg-orange-500 text-white">
                  Bestseller
                </Badge>
              )}
            </div>

            <CardDescription className="text-base">
              {product.description}
            </CardDescription>

            {/* Rating & Meta Info */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({product.reviewCount})
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {product.prepTime} mins
              </span>
              <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">
                <div className="h-2 w-2 rounded-sm bg-red-500 mr-2" />
                Non-Veg
              </Badge>
            </div>

            {/* Price & Quantity */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="text-muted-foreground text-sm">Starting at</p>
                <p className="text-2xl font-bold">₹{selectedSizePrice}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border bg-white dark:bg-slate-950 p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content - Size, Addons, Requests */}
      <CardContent className="space-y-4">
        {/* Size Selection */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Select Size</CardTitle>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                Required
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <Label
                    key={size.id}
                    htmlFor={`size-${size.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50"
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={size.id}
                        id={`size-${size.id}`}
                        className="mt-1"
                      />
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{size.label}</span>
                          {size.isMostOrdered && (
                            <Badge variant="secondary" className="text-xs">
                              Most Ordered
                            </Badge>
                          )}
                        </div>
                        {size.description && (
                          <p className="text-muted-foreground text-sm">
                            {size.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold">₹{size.price}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Addon Selection */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Extras</CardTitle>
            <CardDescription>Optional - Add toppings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={addon.id}
                      checked={addon.id in selectedAddons}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={addon.id}
                      className="font-medium cursor-pointer text-sm"
                    >
                      {addon.name}
                    </Label>
                  </div>

                  {addon.id in selectedAddons ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm min-w-12">
                        ₹{addon.price * (selectedAddons[addon.id] || 1)}
                      </span>
                      <div className="flex items-center gap-1 rounded border bg-muted">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleAddonQuantityChange(addon.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-medium">
                          {selectedAddons[addon.id]}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleAddonQuantityChange(addon.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span className="font-medium text-sm">₹{addon.price}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cooking Requests */}
        <Card className="border bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Special Requests</CardTitle>
            <CardDescription>
              Let the kitchen know if you have any preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g. Extra spicy, Less salt, No onions..."
              value={cookingRequest}
              onChange={(e) =>
                setCookingRequest(e.target.value.slice(0, 200))
              }
              rows={4}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right mt-2">
              {cookingRequest.length}/200
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* Footer with Actions */}
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className={isFavorite ? "bg-red-50" : ""}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
          Add to Cart - ₹{totalPrice}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## Implementation Checklist

- [ ] Install all components: `npx shadcn@latest add @shadcn/radio-group @shadcn/checkbox @shadcn/badge @shadcn/textarea @shadcn/card @shadcn/button @shadcn/label @shadcn/input`
- [ ] Create ProductDetailsModal component
- [ ] Implement RadioGroup for size selection
- [ ] Implement Checkbox + Button stepper for addons
- [ ] Add Badge components for status indicators
- [ ] Add Textarea with character count for requests
- [ ] Nest Card components for sections
- [ ] Style Button components (pill-shaped counter, orange CTA)
- [ ] Test responsive behavior
- [ ] Add accessibility labels and ARIA attributes
- [ ] Implement state management (Zustand/Context if needed)
- [ ] Add loading states for async operations
- [ ] Test with keyboard navigation
- [ ] Implement mobile responsiveness

---

## Responsive Considerations

- Modal should be full-width on mobile
- Image should stack above info on small screens
- Use flexbox with direction changes
- Buttons should be full-width on mobile
- Reduce spacing on smaller screens
- Consider modal height for mobile viewports

---

## Accessibility Notes

- All interactive elements have proper labels
- Use semantic HTML (Label, input associations)
- RadioGroupItem and Checkbox have proper IDs
- Button aria-labels for icon-only buttons
- Color not the only indicator (use badges with text)
- Proper heading hierarchy
- Form fields clearly marked as required
- Error states announced to screen readers

---

## Dependencies Summary

| Component | Dependency | Version |
|-----------|-----------|---------|
| RadioGroup | @radix-ui/react-radio-group | Latest |
| Checkbox | @radix-ui/react-checkbox | Latest |
| Badge | @radix-ui/react-slot | Latest |
| Button | @radix-ui/react-slot | Latest |
| Textarea | None (Native HTML) | N/A |
| Card | None (Semantic HTML) | N/A |
| Label | None (Native HTML) | N/A |

---

## File Locations

After installation, components will be available at:
- `/components/ui/radio-group.tsx`
- `/components/ui/checkbox.tsx`
- `/components/ui/badge.tsx`
- `/components/ui/textarea.tsx`
- `/components/ui/card.tsx`
- `/components/ui/button.tsx`
- `/components/ui/label.tsx`

---

## Next Steps

1. Install all components using the command above
2. Create a new file: `/app/components/product-details-modal.tsx`
3. Use the complete example provided above as a starting point
4. Customize colors, spacing, and typography to match your design system
5. Integrate with your product API/data management
6. Add form validation using react-hook-form or Zod
7. Connect to cart/checkout flow

---

## Additional Resources

- Shadcn/ui Documentation: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- Tailwind CSS: https://tailwindcss.com
- Next.js 16 Docs: https://nextjs.org
- React 19 Docs: https://react.dev
