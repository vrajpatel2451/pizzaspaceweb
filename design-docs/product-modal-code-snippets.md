# Food Delivery Product Modal - Ready-to-Use Code Snippets

Quick reference for common patterns in the product details modal.

## 1. Size Selector with Badges

```tsx
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

const sizes = [
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

<RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
  <div className="space-y-2">
    {sizes.map((size) => (
      <Label
        key={size.id}
        htmlFor={`size-${size.id}`}
        className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50 dark:has-[[aria-checked=true]]:border-orange-600 dark:has-[[aria-checked=true]]:bg-orange-950"
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
```

## 2. Addon Selector with Quantity

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"

const addons = [
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
]

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
      <div className="grid gap-1">
        <Label
          htmlFor={addon.id}
          className="font-medium cursor-pointer text-sm"
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
            disabled={
              addon.maxQuantity !== undefined &&
              selectedAddons[addon.id] >= addon.maxQuantity
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
```

## 3. Quantity Counter (Pill-Shaped)

```tsx
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

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
```

## 4. Special Requests Textarea with Quick Chips

```tsx
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
]

<div className="space-y-3">
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
    <p>{request.length}/{maxLength}</p>
  </div>

  {selectedQuickRequests.length > 0 && (
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
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
```

## 5. Status Badges Collection

```tsx
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, BadgeCheckIcon } from "lucide-react"

{/* Best Seller */}
<Badge className="bg-orange-500 text-white hover:bg-orange-600">
  <TrendingUpIcon className="mr-1 h-3 w-3" />
  Most Ordered
</Badge>

{/* Veg Indicator */}
<Badge variant="secondary" className="border-green-500 bg-green-50 text-green-700">
  <div className="h-2 w-2 rounded-sm bg-green-500 mr-2" />
  Veg
</Badge>

{/* Non-Veg Indicator */}
<Badge variant="secondary" className="border-red-500 bg-red-50 text-red-700">
  <div className="h-2 w-2 rounded-sm bg-red-500 mr-2" />
  Non-Veg
</Badge>

{/* Required Field */}
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
```

## 6. Rating & Meta Info Display

```tsx
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"

<div className="flex items-center gap-4 flex-wrap">
  {/* Rating */}
  <div className="flex items-center gap-1">
    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    <span className="font-semibold">{product.rating}</span>
    <span className="text-muted-foreground text-sm">
      ({product.reviewCount})
    </span>
  </div>

  {/* Prep Time */}
  <span className="text-muted-foreground text-sm flex items-center gap-1">
    <Clock className="h-4 w-4" />
    {product.prepTime} mins
  </span>

  {/* Veg/Non-Veg Category */}
  <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">
    <div className="h-2 w-2 rounded-sm bg-red-500 mr-2" />
    Non-Veg
  </Badge>
</div>
```

## 7. Nested Card Layout for Sections

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

{/* Size Section Card */}
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
    {/* RadioGroup here */}
  </CardContent>
</Card>

{/* Addon Section Card */}
<Card className="border bg-muted/20">
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Add Extras</CardTitle>
    <CardDescription>Optional - Add toppings</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Checkboxes here */}
  </CardContent>
</Card>

{/* Requests Section Card */}
<Card className="border bg-muted/20">
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Special Requests</CardTitle>
    <CardDescription>
      Let the kitchen know if you have any preferences
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Textarea here */}
  </CardContent>
</Card>
```

## 8. Add to Cart Footer

```tsx
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

<div className="gap-2 flex">
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
</div>
```

## 9. Price Calculator Logic

```tsx
// Size price
const selectedSizePrice = sizes.find(
  (s) => s.id === selectedSize
)?.price || product.basePrice

// Addon total
const addonTotal = Object.entries(selectedAddons).reduce(
  (sum, [addonId, qty]) => {
    const addon = addons.find((a) => a.id === addonId)
    return sum + (addon?.price || 0) * qty
  },
  0
)

// Final total
const totalPrice = (selectedSizePrice + addonTotal) * quantity
```

## 10. Addon Toggle & Quantity Handlers

```tsx
// Toggle addon on/off
const handleAddonToggle = (addonId: string) => {
  setSelectedAddons((prev) => {
    if (prev[addonId]) {
      const { [addonId]: _, ...rest } = prev
      return rest
    }
    return { ...prev, [addonId]: 1 }
  })
}

// Change addon quantity
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
```

## 11. Product Data Interfaces

```tsx
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
  isVeg: boolean
}

interface Size {
  id: string
  label: string
  price: number
  description?: string
  isMostOrdered?: boolean
}

interface Addon {
  id: string
  name: string
  price: number
  description?: string
  maxQuantity?: number
}

interface ModalState {
  quantity: number
  selectedSize: string
  selectedAddons: Record<string, number>
  cookingRequest: string
  isFavorite: boolean
}
```

## 12. Mobile Responsive Layout

```tsx
// For mobile-first design
<div className="w-full max-w-2xl">
  {/* Header - Stack on mobile */}
  <div className="flex flex-col lg:flex-row gap-4">
    {/* Image - Full width on mobile */}
    <div className="h-48 w-full lg:h-48 lg:w-48 rounded-lg">
      <img src={product.image} alt="" className="h-full w-full object-cover" />
    </div>

    {/* Info - Full width on mobile */}
    <div className="flex-1 space-y-3">
      {/* Content */}
    </div>
  </div>

  {/* Content sections */}
  <div className="space-y-4 px-4 lg:px-0">
    {/* Cards */}
  </div>

  {/* Footer - Full width buttons on mobile */}
  <div className="gap-2 flex flex-col lg:flex-row">
    <Button variant="outline" className="w-full lg:w-auto">
      Save
    </Button>
    <Button className="w-full">
      Add to Cart
    </Button>
  </div>
</div>
```

## 13. Required Field Marker

```tsx
// Wrap size selection with required indicator
<div className="flex items-center justify-between">
  <CardTitle className="text-base">Select Size</CardTitle>
  <Badge
    variant="outline"
    className="bg-red-100 text-red-700 border-red-300"
  >
    Required
  </Badge>
</div>
```

## 14. Category Separator

```tsx
// If grouping addons by category
<div className="space-y-4">
  {/* Toppings Group */}
  <div>
    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
      Toppings
    </h4>
    {/* Addon checkboxes for toppings */}
  </div>

  {/* Sauces Group */}
  <div>
    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
      Sauces
    </h4>
    {/* Addon checkboxes for sauces */}
  </div>

  {/* Sides Group */}
  <div>
    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
      Sides
    </h4>
    {/* Addon checkboxes for sides */}
  </div>
</div>
```

## 15. Empty State (Out of Stock)

```tsx
<Card className="border bg-muted/20 opacity-50">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-base">Select Size</CardTitle>
      <Badge variant="destructive">Out of Stock</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground text-sm">
      This item is currently unavailable
    </p>
  </CardContent>
</Card>

<Button disabled className="w-full">
  Add to Cart - Currently Unavailable
</Button>
```

---

## Quick Copy-Paste Commands

Install all components:
```bash
npx shadcn@latest add @shadcn/radio-group @shadcn/checkbox @shadcn/badge @shadcn/textarea @shadcn/card @shadcn/button @shadcn/label @shadcn/input
```

---

## Common Tailwind Classes Used

| Purpose | Classes |
|---------|---------|
| Pill-shaped button | `rounded-full` |
| Orange primary | `bg-orange-500 hover:bg-orange-600` |
| Muted background | `bg-muted/20` |
| Green veg indicator | `border-green-500 bg-green-50 text-green-700` |
| Red non-veg indicator | `border-red-500 bg-red-50 text-red-700` |
| Selected state | `has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50` |
| Flex spacing | `flex items-center gap-2` |
| Grid gap | `grid gap-1` |
| Border styling | `border p-4 rounded-lg` |
| Hover feedback | `hover:bg-accent` |

