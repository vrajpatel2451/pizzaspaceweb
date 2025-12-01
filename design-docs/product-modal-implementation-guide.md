# Product Details Modal - Implementation Guide

Step-by-step guide to implement the product details modal in your Next.js 16 application.

---

## Phase 1: Setup & Installation

### Step 1: Install Components

```bash
cd /Users/vrajpatel/Documents/personal/pizzaspace_web

npx shadcn@latest add @shadcn/radio-group @shadcn/checkbox @shadcn/badge @shadcn/textarea @shadcn/card @shadcn/button @shadcn/label @shadcn/input
```

Verify installation by checking:
- `/components/ui/radio-group.tsx`
- `/components/ui/checkbox.tsx`
- `/components/ui/badge.tsx`
- `/components/ui/textarea.tsx`
- `/components/ui/card.tsx`
- `/components/ui/button.tsx`

### Step 2: Verify Tailwind CSS Setup

Your project uses Tailwind CSS 4 with custom colors. Ensure `tailwind.config.ts` includes:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Orange for food delivery primary
        orange: {
          500: "#ff6b35",
          600: "#ff5220",
        }
      }
    }
  }
}
```

### Step 3: Create Component Directory

```bash
mkdir -p /Users/vrajpatel/Documents/personal/pizzaspace_web/app/components/modals
mkdir -p /Users/vrajpatel/Documents/personal/pizzaspace_web/lib/hooks
```

---

## Phase 2: Core Component Implementation

### Step 1: Create Types File

Create `/app/types/product.ts`:

```typescript
export interface ProductSize {
  id: string
  label: string
  price: number
  description?: string
  isMostOrdered?: boolean
}

export interface ProductAddon {
  id: string
  name: string
  price: number
  description?: string
  maxQuantity?: number
  category?: "toppings" | "sauces" | "sides"
}

export interface ProductData {
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
  availableSizes: ProductSize[]
  availableAddons: ProductAddon[]
}

export interface ModalState {
  quantity: number
  selectedSize: string
  selectedAddons: Record<string, number>
  cookingRequest: string
  isFavorite: boolean
}
```

### Step 2: Create Custom Hook for Modal State

Create `/lib/hooks/useProductModal.ts`:

```typescript
"use client"

import { useState } from "react"
import type { ModalState } from "@/app/types/product"

const initialState: ModalState = {
  quantity: 1,
  selectedSize: "",
  selectedAddons: {},
  cookingRequest: "",
  isFavorite: false,
}

export function useProductModal() {
  const [state, setState] = useState<ModalState>(initialState)

  const setQuantity = (quantity: number) => {
    setState((prev) => ({ ...prev, quantity }))
  }

  const setSelectedSize = (size: string) => {
    setState((prev) => ({ ...prev, selectedSize: size }))
  }

  const toggleAddon = (addonId: string) => {
    setState((prev) => {
      const addons = { ...prev.selectedAddons }
      if (addons[addonId]) {
        delete addons[addonId]
      } else {
        addons[addonId] = 1
      }
      return { ...prev, selectedAddons: addons }
    })
  }

  const setAddonQuantity = (addonId: string, quantity: number) => {
    setState((prev) => {
      const addons = { ...prev.selectedAddons }
      if (quantity <= 0) {
        delete addons[addonId]
      } else {
        addons[addonId] = quantity
      }
      return { ...prev, selectedAddons: addons }
    })
  }

  const setCookingRequest = (request: string) => {
    setState((prev) => ({
      ...prev,
      cookingRequest: request.slice(0, 200),
    }))
  }

  const setIsFavorite = (isFavorite: boolean) => {
    setState((prev) => ({ ...prev, isFavorite }))
  }

  const reset = () => {
    setState(initialState)
  }

  return {
    state,
    setQuantity,
    setSelectedSize,
    toggleAddon,
    setAddonQuantity,
    setCookingRequest,
    setIsFavorite,
    reset,
  }
}
```

### Step 3: Create Price Calculator Hook

Create `/lib/hooks/usePriceCalculator.ts`:

```typescript
import { useMemo } from "react"
import type { ProductAddon, ProductSize } from "@/app/types/product"

export function usePriceCalculator(
  basePrice: number,
  selectedSize: string,
  selectedAddons: Record<string, number>,
  quantity: number,
  sizes: ProductSize[],
  addons: ProductAddon[]
) {
  return useMemo(() => {
    // Get size price
    const sizePrice =
      sizes.find((s) => s.id === selectedSize)?.price ?? basePrice

    // Calculate addon total
    const addonTotal = Object.entries(selectedAddons).reduce(
      (sum, [addonId, qty]) => {
        const addon = addons.find((a) => a.id === addonId)
        return sum + (addon?.price ?? 0) * qty
      },
      0
    )

    // Calculate totals
    const pricePerItem = sizePrice + addonTotal
    const totalPrice = pricePerItem * quantity

    return {
      sizePrice,
      addonTotal,
      pricePerItem,
      totalPrice,
    }
  }, [basePrice, selectedSize, selectedAddons, quantity, sizes, addons])
}
```

### Step 4: Create SizeSelector Sub-Component

Create `/app/components/modals/size-selector.tsx`:

```tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProductSize } from "@/app/types/product"

interface SizeSelectorProps {
  sizes: ProductSize[]
  selectedSize: string
  onSelectSize: (size: string) => void
  isRequired?: boolean
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  isRequired = true,
}: SizeSelectorProps) {
  return (
    <Card className="border bg-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Select Size</CardTitle>
          {isRequired && (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-700 border-red-300"
            >
              Required
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedSize} onValueChange={onSelectSize}>
          <div className="space-y-2">
            {sizes.map((size) => (
              <Label
                key={size.id}
                htmlFor={`size-${size.id}`}
                className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50 dark:has-[[aria-checked=true]]:border-orange-600 dark:has-[[aria-checked=true]]:bg-orange-950 transition-colors"
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
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-100 text-orange-700 border-orange-200"
                        >
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
  )
}
```

### Step 5: Create AddonSelector Sub-Component

Create `/app/components/modals/addon-selector.tsx`:

```tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import type { ProductAddon } from "@/app/types/product"

interface AddonSelectorProps {
  addons: ProductAddon[]
  selectedAddons: Record<string, number>
  onToggleAddon: (addonId: string) => void
  onChangeQuantity: (addonId: string, quantity: number) => void
}

export function AddonSelector({
  addons,
  selectedAddons,
  onToggleAddon,
  onChangeQuantity,
}: AddonSelectorProps) {
  // Group addons by category if available
  const groupedAddons = addons.reduce(
    (acc, addon) => {
      const category = addon.category || "other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(addon)
      return acc
    },
    {} as Record<string, ProductAddon[]>
  )

  return (
    <Card className="border bg-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add Extras</CardTitle>
        <CardDescription>Optional - Add toppings and sides</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedAddons).map(([category, categoryAddons]) => (
            <div key={category}>
              {category !== "other" && (
                <h4 className="font-semibold text-sm text-muted-foreground mb-2 capitalize">
                  {category}
                </h4>
              )}
              <div className="space-y-2">
                {categoryAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={addon.id}
                        checked={addon.id in selectedAddons}
                        onCheckedChange={() => onToggleAddon(addon.id)}
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
                            onClick={() =>
                              onChangeQuantity(
                                addon.id,
                                Math.max(0, (selectedAddons[addon.id] || 1) - 1)
                              )
                            }
                            aria-label="Decrease quantity"
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
                            onClick={() =>
                              onChangeQuantity(
                                addon.id,
                                (selectedAddons[addon.id] || 1) + 1
                              )
                            }
                            disabled={
                              addon.maxQuantity !== undefined &&
                              selectedAddons[addon.id] >= addon.maxQuantity
                            }
                            aria-label="Increase quantity"
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Step 6: Create SpecialRequests Sub-Component

Create `/app/components/modals/special-requests.tsx`:

```tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { X } from "lucide-react"

const QUICK_REQUESTS = [
  "Extra spicy",
  "Less spicy",
  "No onions",
  "No garlic",
  "Extra cheese",
  "Well done",
]

interface SpecialRequestsProps {
  request: string
  onChangeRequest: (request: string) => void
}

export function SpecialRequests({
  request,
  onChangeRequest,
}: SpecialRequestsProps) {
  const maxLength = 200

  return (
    <Card className="border bg-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Special Requests</CardTitle>
        <CardDescription>
          Let the restaurant know if you have any special preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick action chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_REQUESTS.map((quickRequest) => (
            <Button
              key={quickRequest}
              variant={request.includes(quickRequest) ? "default" : "outline"}
              size="sm"
              className="rounded-full h-auto py-1 px-3 text-xs"
              onClick={() => {
                if (!request.includes(quickRequest)) {
                  const newRequest = request
                    ? `${request}, ${quickRequest}`
                    : quickRequest
                  onChangeRequest(newRequest.slice(0, maxLength))
                }
              }}
            >
              {quickRequest}
            </Button>
          ))}
        </div>

        {/* Custom request textarea */}
        <Textarea
          placeholder="Add any additional requests or preferences..."
          value={request}
          onChange={(e) => onChangeRequest(e.target.value.slice(0, maxLength))}
          rows={4}
          className="resize-none"
          maxLength={maxLength}
          aria-label="Special requests"
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <p>Any allergies or special instructions?</p>
          <p>
            {request.length}/{maxLength}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Step 7: Create Main ProductDetailsModal Component

Create `/app/components/modals/product-details-modal.tsx`:

```tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart, Minus, Plus, Star } from "lucide-react"
import { useProductModal } from "@/lib/hooks/useProductModal"
import { usePriceCalculator } from "@/lib/hooks/usePriceCalculator"
import type { ProductData } from "@/app/types/product"
import { SizeSelector } from "./size-selector"
import { AddonSelector } from "./addon-selector"
import { SpecialRequests } from "./special-requests"

interface ProductDetailsModalProps {
  product: ProductData
  onAddToCart?: (
    productId: string,
    options: ReturnType<typeof useProductModal>["state"]
  ) => Promise<void>
  onClose?: () => void
}

export function ProductDetailsModal({
  product,
  onAddToCart,
  onClose,
}: ProductDetailsModalProps) {
  const modal = useProductModal()
  const prices = usePriceCalculator(
    product.basePrice,
    modal.state.selectedSize,
    modal.state.selectedAddons,
    modal.state.quantity,
    product.availableSizes,
    product.availableAddons
  )

  // Initialize selected size if not already set
  if (!modal.state.selectedSize && product.availableSizes.length > 0) {
    modal.setSelectedSize(product.availableSizes[0].id)
  }

  const handleAddToCart = async () => {
    if (!modal.state.selectedSize) {
      alert("Please select a size")
      return
    }

    if (onAddToCart) {
      await onAddToCart(product.id, modal.state)
    }

    modal.reset()
    onClose?.()
  }

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      {/* Header with Product Info */}
      <CardHeader className="space-y-4 border-b">
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
                <Badge className="mt-2 bg-orange-500 text-white hover:bg-orange-600">
                  Bestseller
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Rating & Meta Info */}
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
              <span className="text-muted-foreground">
                {product.prepTime} mins
              </span>
              <Badge
                variant="secondary"
                className={`${
                  product.isVeg
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-sm ${
                    product.isVeg ? "bg-green-500" : "bg-red-500"
                  } mr-2`}
                />
                {product.isVeg ? "Veg" : "Non-Veg"}
              </Badge>
            </div>

            {/* Price & Quantity */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="text-muted-foreground text-xs">Starting at</p>
                <p className="text-2xl font-bold">₹{prices.sizePrice}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border bg-white dark:bg-slate-950 p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() =>
                    modal.setQuantity(
                      Math.max(1, modal.state.quantity - 1)
                    )
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">
                  {modal.state.quantity}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 rounded-full p-0"
                  onClick={() =>
                    modal.setQuantity(modal.state.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Content - Size, Addons, Requests */}
      <CardContent className="space-y-4 py-6">
        {/* Size Selection */}
        {product.availableSizes.length > 0 && (
          <SizeSelector
            sizes={product.availableSizes}
            selectedSize={modal.state.selectedSize}
            onSelectSize={modal.setSelectedSize}
          />
        )}

        {/* Addon Selection */}
        {product.availableAddons.length > 0 && (
          <AddonSelector
            addons={product.availableAddons}
            selectedAddons={modal.state.selectedAddons}
            onToggleAddon={modal.toggleAddon}
            onChangeQuantity={modal.setAddonQuantity}
          />
        )}

        {/* Cooking Requests */}
        <SpecialRequests
          request={modal.state.cookingRequest}
          onChangeRequest={modal.setCookingRequest}
        />
      </CardContent>

      {/* Footer with Actions */}
      <CardFooter className="gap-2 border-t bg-muted/50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => modal.setIsFavorite(!modal.state.isFavorite)}
          className={
            modal.state.isFavorite ? "bg-red-50" : ""
          }
          aria-label={
            modal.state.isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            className={`h-4 w-4 ${
              modal.state.isFavorite
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
        </Button>
        <Button
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          onClick={handleAddToCart}
        >
          Add to Cart - ₹{prices.totalPrice}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## Phase 3: Integration

### Step 1: Create a Demo Page

Create `/app/demo/product-modal/page.tsx`:

```tsx
"use client"

import { ProductDetailsModal } from "@/app/components/modals/product-details-modal"
import type { ProductData } from "@/app/types/product"

// Mock product data
const mockProduct: ProductData = {
  id: "1",
  name: "Spicy Pepperoni Pizza",
  description:
    "Loaded with fresh pepperoni, mozzarella cheese, and our special spicy marinara sauce. Perfect for pepperoni lovers.",
  image:
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=500&fit=crop",
  basePrice: 299,
  rating: 4.5,
  reviewCount: 324,
  isBestseller: true,
  prepTime: 25,
  isVeg: false,
  availableSizes: [
    {
      id: "small",
      label: "Small",
      price: 249,
      description: "6 inch",
      isMostOrdered: true,
    },
    {
      id: "medium",
      label: "Medium",
      price: 299,
      description: "9 inch",
    },
    {
      id: "large",
      label: "Large",
      price: 399,
      description: "12 inch",
    },
  ],
  availableAddons: [
    {
      id: "extra-cheese",
      name: "Extra Cheese",
      price: 40,
      category: "toppings",
    },
    {
      id: "pepperoni",
      name: "Pepperoni",
      price: 60,
      description: "Italian seasoned meat",
      category: "toppings",
    },
    {
      id: "mushroom",
      name: "Mushrooms",
      price: 30,
      category: "toppings",
    },
    {
      id: "olives",
      name: "Black Olives",
      price: 35,
      category: "toppings",
    },
  ],
}

export default function ProductModalDemo() {
  const handleAddToCart = async (productId: string, options: any) => {
    console.log("Adding to cart:", {
      productId,
      options,
    })
    // Integrate with your cart API
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <ProductDetailsModal
        product={mockProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
```

### Step 2: Test the Modal

```bash
cd /Users/vrajpatel/Documents/personal/pizzaspace_web
npm run dev
```

Navigate to `http://localhost:3000/demo/product-modal` to see the modal in action.

---

## Phase 4: API Integration

### Step 1: Create API Hook

Create `/lib/hooks/useAddToCart.ts`:

```typescript
"use client"

import { useState } from "react"
import type { ModalState } from "@/app/types/product"

export function useAddToCart() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCart = async (productId: string, options: ModalState) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: options.quantity,
          selectedSize: options.selectedSize,
          selectedAddons: options.selectedAddons,
          cookingRequest: options.cookingRequest,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      return await response.json()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    addToCart,
    isLoading,
    error,
  }
}
```

### Step 2: Create API Route

Create `/app/api/cart/add/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.selectedSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // TODO: Add item to user's cart in database
    // This depends on your cart/database implementation

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cartItem: {
        productId: body.productId,
        quantity: body.quantity,
        selectedSize: body.selectedSize,
        selectedAddons: body.selectedAddons,
        cookingRequest: body.cookingRequest,
      },
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    )
  }
}
```

---

## Phase 5: Testing Checklist

### Visual Testing
- [ ] Modal displays correctly on desktop (1920px)
- [ ] Modal displays correctly on tablet (768px)
- [ ] Modal displays correctly on mobile (375px)
- [ ] Images load and scale properly
- [ ] All badges render with correct colors
- [ ] Orange color (#ff6b35) used for primary CTAs

### Functionality Testing
- [ ] Size selection works and updates price
- [ ] Addon selection works (toggle on/off)
- [ ] Addon quantity can be increased/decreased
- [ ] Price calculation is accurate
- [ ] Quantity counter works (1-99 range)
- [ ] Textarea accepts up to 200 characters
- [ ] Quick request chips add text to textarea
- [ ] Favorite button toggles state
- [ ] Add to Cart button submits correct data

### Accessibility Testing
- [ ] All form inputs have labels
- [ ] Radio buttons are keyboard navigable
- [ ] Checkboxes are keyboard navigable
- [ ] Color not the only indicator of state
- [ ] ARIA labels present on icon buttons
- [ ] Form validation errors announced
- [ ] Modal can be closed with Escape key (if dialog)

### Browser Testing
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

---

## Performance Optimization

### Code Splitting
```tsx
import dynamic from "next/dynamic"

const ProductDetailsModal = dynamic(
  () => import("@/app/components/modals/product-details-modal").then((mod) => mod.ProductDetailsModal),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
)
```

### Image Optimization
Use CustomImage from your project:

```tsx
import { CustomImage } from "@/components/ui/custom-image"

<CustomImage
  src={product.image}
  alt={product.name}
  width={192}
  height={192}
  className="h-48 w-48 rounded-lg object-cover"
/>
```

---

## Styling Customization

### Colors for Food Delivery Theme

```css
/* Add to your global.css */
@layer components {
  .btn-orange-primary {
    @apply bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors;
  }

  .badge-veg {
    @apply border-green-500 bg-green-50 text-green-700;
  }

  .badge-nonveg {
    @apply border-red-500 bg-red-50 text-red-700;
  }

  .card-section {
    @apply border bg-muted/20 rounded-lg;
  }

  .radio-option {
    @apply rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[aria-checked=true]]:border-orange-500 has-[[aria-checked=true]]:bg-orange-50 transition-colors;
  }
}
```

---

## Troubleshooting

### Issue: Components not found after installation

**Solution:** Verify components are installed in `/components/ui/`:
```bash
ls -la /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/
```

### Issue: Tailwind classes not applying

**Solution:** Ensure your `tailwind.config.ts` includes the component paths:
```typescript
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
]
```

### Issue: Price not calculating correctly

**Solution:** Check that addon IDs in selectedAddons match addon array IDs exactly.

### Issue: Z-index issues with modal

**Solution:** Ensure modal is wrapped in appropriate dialog/portal component with proper z-index.

---

## File Structure Summary

```
/app
  /components
    /modals
      - product-details-modal.tsx      (Main component)
      - size-selector.tsx              (Sub-component)
      - addon-selector.tsx             (Sub-component)
      - special-requests.tsx           (Sub-component)
  /types
    - product.ts                        (Type definitions)
  /api
    /cart
      /add
        - route.ts                      (Add to cart API)
  /demo
    /product-modal
      - page.tsx                        (Demo page)

/components
  /ui
    - radio-group.tsx                  (shadcn installed)
    - checkbox.tsx                     (shadcn installed)
    - badge.tsx                        (shadcn installed)
    - textarea.tsx                     (shadcn installed)
    - card.tsx                         (shadcn installed)
    - button.tsx                       (shadcn installed)
    - label.tsx                        (shadcn installed)

/lib
  /hooks
    - useProductModal.ts               (State management)
    - usePriceCalculator.ts            (Price logic)
    - useAddToCart.ts                  (API integration)
```

---

## Next Steps

1. Complete all installation steps in Phase 1
2. Implement all sub-components in Phase 2
3. Test with demo page in Phase 3
4. Integrate with your cart API in Phase 4
5. Run through testing checklist in Phase 5
6. Deploy to production

