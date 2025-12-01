# Ready-to-Use Code Snippets

Complete, copy-paste ready code for implementing accordion and carousel components in the product details modal.

---

## 1. Product Image Carousel Component

**File:** `/components/product-details/sections/product-image-carousel.tsx`

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CustomImage } from "@/components/ui/custom-image"
import type { CarouselApi } from "embla-carousel-react"

interface ProductImage {
  url: string
  alt?: string
}

interface ProductImageCarouselProps {
  images: ProductImage[]
  productName: string
  onImageChange?: (index: number) => void
}

export function ProductImageCarousel({
  images,
  productName,
  onImageChange,
}: ProductImageCarouselProps) {
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      const index = api.selectedIndex()
      setCurrent(index)
      onImageChange?.(index)
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api, onImageChange])

  // Single image - no carousel needed
  if (images.length <= 1) {
    return (
      <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
        <CustomImage
          src={images[0]?.url || ""}
          alt={images[0]?.alt || productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    )
  }

  // Multiple images - show carousel
  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={`carousel-item-${index}`} className="basis-full">
              <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                <CustomImage
                  src={image.url}
                  alt={image.alt || `${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 backdrop-blur-sm z-10 rounded-full h-10 w-10"
          aria-label="Previous image"
        />
        <CarouselNext
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 backdrop-blur-sm z-10 rounded-full h-10 w-10"
          aria-label="Next image"
        />

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 dark:bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm z-10">
          {images.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => {
                api?.scrollTo(index)
              }}
              className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === current
                  ? "bg-white w-2 h-2"
                  : "bg-white/50 w-1.5 h-1.5 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === current ? "true" : "false"}
            />
          ))}
        </div>
      </Carousel>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/50 dark:bg-white/20 text-white px-2.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm z-10">
        {current + 1} / {images.length}
      </div>
    </div>
  )
}
```

---

## 2. Product Description Section Component

**File:** `/components/product-details/sections/product-description-section.tsx`

```tsx
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductDetails {
  ingredients?: string
  allergens?: string
  calories?: string | number
  prepTime?: string
  servingSize?: string
  description?: string
}

interface ProductDescriptionSectionProps {
  productName: string
  price: string
  description: string
  details?: ProductDetails
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export function ProductDescriptionSection({
  productName,
  price,
  description,
  details,
  isExpanded = true,
  onExpandedChange,
}: ProductDescriptionSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      value={isExpanded ? "item-1" : ""}
      onValueChange={(value) => onExpandedChange?.(value === "item-1")}
      className="w-full"
    >
      <AccordionItem value="item-1" className="border-b border-neutral-200 dark:border-neutral-800">
        <AccordionTrigger className="flex items-center justify-between px-4 py-4 hover:no-underline">
          <div className="flex flex-1 items-center justify-between gap-4 text-left">
            <h2 className="font-semibold text-base text-neutral-900 dark:text-white">
              {productName}
            </h2>
            <span className="ml-auto font-semibold text-base text-orange-600 dark:text-orange-500 whitespace-nowrap">
              {price}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pt-0 pb-4">
          <div className="flex flex-col gap-4">
            {/* Main Description */}
            {description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {description}
              </p>
            )}

            {/* Details Grid */}
            {details && Object.keys(details).length > 0 && (
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                {/* Prep Time & Serving Size Row */}
                <div className="grid grid-cols-2 gap-4">
                  {details.prepTime && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-medium">
                        Prep Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {details.prepTime}
                      </p>
                    </div>
                  )}
                  {details.calories && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-medium">
                        Calories
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {typeof details.calories === "number"
                          ? `${details.calories} kcal`
                          : details.calories}
                      </p>
                    </div>
                  )}
                </div>

                {/* Serving Size */}
                {details.servingSize && (
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-medium">
                      Serving Size
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {details.servingSize}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {details.ingredients && (
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-medium">
                      Ingredients
                    </p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {details.ingredients}
                    </p>
                  </div>
                )}

                {/* Allergens */}
                {details.allergens && (
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide font-medium">
                      Allergens
                    </p>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-500">
                      {details.allergens}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

---

## 3. Combined Product Details Section

**File:** `/components/product-details/sections/product-details-header.tsx`

This component combines both the image carousel and description:

```tsx
"use client"

import * as React from "react"
import { ProductImageCarousel } from "./product-image-carousel"
import { ProductDescriptionSection } from "./product-description-section"

interface ProductImage {
  url: string
  alt?: string
}

interface ProductDetails {
  ingredients?: string
  allergens?: string
  calories?: string | number
  prepTime?: string
  servingSize?: string
  description?: string
}

interface ProductDetailsHeaderProps {
  productId: string
  productName: string
  price: string
  description: string
  images: ProductImage[]
  details?: ProductDetails
}

export function ProductDetailsHeader({
  productId,
  productName,
  price,
  description,
  images,
  details,
}: ProductDetailsHeaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  return (
    <div className="space-y-4">
      {/* Image Carousel */}
      <ProductImageCarousel
        images={images}
        productName={productName}
        onImageChange={setCurrentImageIndex}
      />

      {/* Description Section */}
      <ProductDescriptionSection
        productName={productName}
        price={price}
        description={description}
        details={details}
        isExpanded={true}
      />
    </div>
  )
}
```

---

## 4. Full Product Details Modal Integration

**Usage in your modal:**

```tsx
"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProductDetailsHeader } from "@/components/product-details/sections/product-details-header"
import { VariantGroupCard } from "@/components/product-details/cards/variant-group-card"
import { AddonGroupCard } from "@/components/product-details/cards/addon-group-card"
import { StickyActionBar } from "@/components/product-details/sections/sticky-action-bar"

interface Product {
  _id: string
  name: string
  description: string
  price: number // in pence
  images: Array<{ url: string; alt?: string }>
  details?: {
    ingredients?: string
    allergens?: string
    calories?: number
    prepTime?: string
    servingSize?: string
  }
  variants?: Array<{
    _id: string
    label: string
    name: string
    items: Array<{
      _id: string
      label: string
      price?: number
    }>
  }>
  addons?: Array<{
    _id: string
    label: string
    items: Array<{
      _id: string
      label: string
      price: number
      popularity?: "most-ordered" | "trending"
    }>
  }>
}

interface ProductDetailsModalProps {
  isOpen: boolean
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, selectedVariants: Record<string, string>, selectedAddons: Record<string, number[]>) => void
}

export function ProductDetailsModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number[]>>({})

  if (!product) return null

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`
  }

  const handleAddToCart = async () => {
    onAddToCart(product, selectedVariants, selectedAddons)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto p-0">
        <div className="flex flex-col">
          {/* Header with image and description */}
          <div className="p-4 space-y-4 border-b">
            <ProductDetailsHeader
              productId={product._id}
              productName={product.name}
              price={formatPrice(product.price)}
              description={product.description}
              images={product.images}
              details={product.details}
            />
          </div>

          {/* Variants and Addons */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {product.variants?.map((variantGroup) => (
              <VariantGroupCard
                key={variantGroup._id}
                group={{
                  _id: variantGroup._id,
                  label: variantGroup.label,
                  isPrimary: variantGroup._id === "size", // or your logic
                }}
                variants={variantGroup.items}
                selectedVariantId={selectedVariants[variantGroup._id]}
                onSelect={(id) =>
                  setSelectedVariants((prev) => ({
                    ...prev,
                    [variantGroup._id]: id,
                  }))
                }
                getVariantPrice={(id) => {
                  const variant = variantGroup.items.find((v) => v._id === id)
                  return variant?.price || 0
                }}
              />
            ))}

            {product.addons?.map((addonGroup) => (
              <AddonGroupCard
                key={addonGroup._id}
                group={{
                  _id: addonGroup._id,
                  label: addonGroup.label,
                }}
                addons={addonGroup.items}
                selectedAddonIds={selectedAddons[addonGroup._id] || []}
                onSelect={(ids) =>
                  setSelectedAddons((prev) => ({
                    ...prev,
                    [addonGroup._id]: ids,
                  }))
                }
                getAddonPrice={(id) => {
                  const addon = addonGroup.items.find((a) => a._id === id)
                  return addon?.price || 0
                }}
              />
            ))}
          </div>

          {/* Sticky Action Bar */}
          <div className="border-t sticky bottom-0 bg-white dark:bg-neutral-950">
            <StickyActionBar
              quantity={quantity}
              onQuantityChange={setQuantity}
              totalPrice={product.price * quantity}
              isValid={true}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 5. TypeScript Interfaces

**File:** `/types/product-details.ts`

```typescript
// Product Details Types
export interface ProductImage {
  url: string
  alt?: string
}

export interface ProductDetails {
  ingredients?: string
  allergens?: string
  calories?: string | number
  prepTime?: string
  servingSize?: string
  description?: string
}

export interface ProductVariant {
  _id: string
  label: string
  price?: number
  mostOrdered?: boolean
  popularity?: "most-ordered" | "trending" | "top-rated"
}

export interface ProductVariantGroup {
  _id: string
  label: string
  name: string
  isPrimary?: boolean
  isRequired?: boolean
  items: ProductVariant[]
}

export interface ProductAddon {
  _id: string
  label: string
  price: number
  popularity?: "most-ordered" | "trending"
}

export interface ProductAddonGroup {
  _id: string
  label: string
  minSelected?: number
  maxSelected?: number
  items: ProductAddon[]
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number // Always in pence
  images: ProductImage[]
  details?: ProductDetails
  variants?: ProductVariantGroup[]
  addons?: ProductAddonGroup[]
  ratings?: {
    average: number
    count: number
  }
  popularity?: {
    mostOrdered?: boolean
    trending?: boolean
    topRated?: boolean
  }
}
```

---

## 6. Demo Page Example

**File:** `/app/demo/product-details-modal/page.tsx`

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductDetailsModal } from "@/components/product-details/modals/product-details-modal"

const DEMO_PRODUCT = {
  _id: "pizza-margherita-001",
  name: "Margherita Pizza",
  description:
    "Classic Italian pizza with fresh tomatoes, mozzarella cheese, and basil. A timeless favorite that captures the essence of Italian cooking.",
  price: 1299, // £12.99
  images: [
    {
      url: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=500&fit=crop",
      alt: "Margherita Pizza Top View",
    },
    {
      url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop",
      alt: "Pizza Slice",
    },
    {
      url: "https://images.unsplash.com/photo-1595521624265-c0c2ae87d1b6?w=500&h=500&fit=crop",
      alt: "Fresh Pizza Oven",
    },
  ],
  details: {
    ingredients:
      "Tomato sauce, fresh mozzarella, basil, olive oil, salt, pepper",
    allergens: "Gluten, Dairy, Sesame",
    calories: 2100,
    prepTime: "12-15 mins",
    servingSize: "4 slices",
  },
  variants: [
    {
      _id: "size",
      label: "Choose Size",
      name: "Size",
      isPrimary: true,
      isRequired: true,
      items: [
        { _id: "small", label: "Small (7\")", price: 0 },
        { _id: "medium", label: "Medium (10\")", price: 299, mostOrdered: true },
        { _id: "large", label: "Large (12\")", price: 599 },
      ],
    },
    {
      _id: "crust",
      label: "Choose Crust",
      name: "Crust Type",
      isPrimary: false,
      isRequired: false,
      items: [
        { _id: "thin", label: "Thin Crust", price: 0 },
        { _id: "thick", label: "Thick Crust", price: 99 },
        { _id: "stuffed", label: "Stuffed Crust", price: 199 },
      ],
    },
  ],
  addons: [
    {
      _id: "toppings",
      label: "Add Extra Toppings",
      minSelected: 0,
      maxSelected: 5,
      items: [
        { _id: "pepperoni", label: "Pepperoni", price: 99, popularity: "most-ordered" },
        { _id: "mushroom", label: "Mushrooms", price: 79 },
        { _id: "pepper", label: "Bell Peppers", price: 79 },
        { _id: "onion", label: "Red Onion", price: 49 },
      ],
    },
    {
      _id: "drinks",
      label: "Add Drinks",
      items: [
        { _id: "coke", label: "Coca Cola (250ml)", price: 99 },
        { _id: "sprite", label: "Sprite (250ml)", price: 99 },
        { _id: "water", label: "Bottled Water", price: 49 },
      ],
    },
  ],
}

export default function ProductDetailsModalDemo() {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCart = (product: any, variants: any, addons: any) => {
    console.log("Added to cart:", {
      product: product.name,
      selectedVariants: variants,
      selectedAddons: addons,
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Product Details Modal Demo</h1>

        <Button onClick={() => setIsOpen(true)} className="w-full">
          Open Product Details
        </Button>

        <ProductDetailsModal
          isOpen={isOpen}
          product={DEMO_PRODUCT}
          onClose={() => setIsOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  )
}
```

---

## Usage Tips

### Accordion Tips

1. **Control expansion programmatically:**
   ```tsx
   const [expanded, setExpanded] = useState(true)
   <Accordion value={expanded ? "item-1" : ""} onValueChange={(v) => setExpanded(v === "item-1")} />
   ```

2. **Customize styling:**
   ```tsx
   <AccordionTrigger className="custom-class">Content</AccordionTrigger>
   ```

3. **Disable animations (if needed):**
   Edit tailwind config to remove animate-accordion-* animations

### Carousel Tips

1. **Get current index:**
   ```tsx
   const [current, setCurrent] = useState(0)
   api?.on("select", () => setCurrent(api.selectedIndex()))
   ```

2. **Programmatic navigation:**
   ```tsx
   api?.scrollTo(2)      // Go to slide 2
   api?.scrollNext()     // Go to next
   api?.scrollPrev()     // Go to previous
   ```

3. **Disable loop if needed:**
   ```tsx
   opts={{ loop: false }}
   ```

---

**Ready to implement!** Copy these snippets into your project and customize as needed.

