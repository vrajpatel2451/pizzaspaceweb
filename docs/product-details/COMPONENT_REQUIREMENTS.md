# Product Details Feature - Component Requirements Analysis

## Executive Summary

This document provides a comprehensive analysis of shadcn/ui component requirements for implementing the Product Details feature in the food delivery app. The analysis identifies existing components that can be reused, components requiring customization, new components needed, and missing shadcn components to install.

**Project Context:**
- Path: `/Users/vrajpatel/Documents/personal/pizzaspace_web`
- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- UI Framework: shadcn/ui (@shadcn registry)

---

## 1. Component Usage Matrix

### 1.1 Existing Components - Ready to Use

| Component | File Path | Usage in Product Details | Notes |
|-----------|-----------|-------------------------|-------|
| Dialog | `components/ui/dialog.tsx` | Desktop product details modal | Complete with header, footer, overlay. Has `showCloseButton` prop |
| Drawer | `components/ui/drawer.tsx` | Mobile bottom sheet | Custom implementation with actions API, size variants |
| Accordion | `components/ui/accordion.tsx` | Collapsible product description | Radix-based, supports single/multiple expansion |
| RadioGroup | `components/ui/radio-group.tsx` | Variant selection (size, crust, etc.) | Radix-based, supports grid layout |
| Checkbox | `components/ui/checkbox.tsx` | Addon selection | Radix-based, supports checked/indeterminate states |
| Skeleton | `components/ui/skeleton.tsx` | Loading states | Simple pulse animation |
| Separator | `components/ui/separator.tsx` | Section dividers | Horizontal/vertical support |
| Badge | `components/ui/badge.tsx` | Veg/Non-veg indicators, tags | Custom variants: `veg`, `nonveg`, `spicy`, `new`, `popular` |
| Button | `components/ui/button.tsx` | Add to cart, close actions | Has `loading` prop, multiple variants/sizes |
| QuantityIncrementor | `components/composite/quantity-incrementor.tsx` | Addon quantity selection | Custom component with min/max support, 3 sizes |

**Total Reusable:** 10 components

### 1.2 Components to Install from shadcn

| Component | Registry | Purpose | Installation Command |
|-----------|----------|---------|---------------------|
| Label | @shadcn/label | Form labels for variants/addons | `npx shadcn@latest add label` |
| ScrollArea | @shadcn/scroll-area | Scrollable content in dialog/drawer | `npx shadcn@latest add scroll-area` |

**Total to Install:** 2 components

### 1.3 Components Requiring Customization

| Component | Customization Needed | Reason |
|-----------|---------------------|--------|
| Dialog | Sticky footer for price/CTA | Need custom layout for product pricing footer |
| Drawer | Sticky footer for mobile | Same as Dialog, mobile-specific layout |
| RadioGroup | Visual enhancement with price display | Show variant price alongside label |
| Checkbox | Visual enhancement with price display | Show addon price alongside label |

### 1.4 New Components/Patterns Needed

| Component | Type | Purpose | Complexity |
|-----------|------|---------|------------|
| ProductImageGallery | New Composite | Display product images with thumbnails | Medium |
| ProductTypeIndicator | New Composite | Visual veg/non-veg indicator with icon | Low |
| VariantGroupSelector | New Composite | Radio group wrapper with group label + description | Medium |
| AddonGroupSelector | New Composite | Checkbox group wrapper with multi-select logic | Medium |
| ProductDetailsFooter | New Composite | Sticky footer with dynamic price calculation | High |
| PriceBreakdown | New Composite | Show base + variant + addon price breakdown | Medium |

---

## 2. Detailed Component Analysis

### 2.1 Dialog (Desktop Container)

**Current Implementation:**
- File: `components/ui/dialog.tsx`
- Based on: `@radix-ui/react-dialog`
- Features: Overlay, close button, header, footer, animations

**Usage Pattern for Product Details:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-2xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle>{product.name}</DialogTitle>
    </DialogHeader>

    <ScrollArea className="flex-1">
      {/* Product image gallery */}
      {/* Product description accordion */}
      {/* Variant groups */}
      {/* Addon groups */}
    </ScrollArea>

    {/* Custom sticky footer - needs new pattern */}
    <div className="sticky bottom-0 border-t bg-background p-4">
      <PriceBreakdown />
      <Button>Add to Cart</Button>
    </div>
  </DialogContent>
</Dialog>
```

**Customization Required:**
- Override default `DialogContent` padding to allow full-width footer
- Add `max-h-[90vh]` constraint for viewport overflow
- Implement sticky footer pattern

**Accessibility Considerations:**
- Ensure keyboard navigation (Tab, Shift+Tab, Escape)
- Announce dialog opening with screen readers
- Trap focus within dialog

---

### 2.2 Drawer (Mobile Bottom Sheet)

**Current Implementation:**
- File: `components/ui/drawer.tsx`
- Custom implementation (not Radix-based)
- Features: Portal rendering, side variants, actions API, overlay

**Usage Pattern for Product Details:**
```tsx
<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  side="bottom"
  size="full"
  showCloseButton={true}
  title={product.name}
>
  {/* Same content as Dialog */}
  {/* Drawer already has built-in footer support via actions prop */}
</Drawer>
```

**Customization Required:**
- Use existing `actions` API for footer buttons
- May need to extend `actions` to support custom price display
- Consider adding `snapPoints` for partial height on mobile

**Mobile-Specific Considerations:**
- Touch gesture support for dismissal (swipe down)
- Bottom safe area insets for iOS
- Prevent body scroll when drawer is open (already implemented)

---

### 2.3 Accordion (Product Description)

**Current Implementation:**
- File: `components/ui/accordion.tsx`
- Based on: `@radix-ui/react-accordion`
- Features: Single/multiple expansion, animations

**Usage Pattern:**
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="description">
    <AccordionTrigger>Product Description</AccordionTrigger>
    <AccordionContent>
      <p>{product.description}</p>

      {/* Nutritional info if available */}
      {product.protein && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <NutritionalBadge label="Protein" value={product.protein} unit="g" />
          <NutritionalBadge label="Carbs" value={product.carbs} unit="g" />
          {/* ... more nutrition data */}
        </div>
      )}

      {/* Allergen info */}
      {product.allergicInfo?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Allergen Information</h4>
          <div className="flex flex-wrap gap-2">
            {product.allergicInfo.map(allergen => (
              <Badge key={allergen} variant="outline">{allergen}</Badge>
            ))}
          </div>
        </div>
      )}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**No Customization Required** - Use as-is

---

### 2.4 RadioGroup (Variant Selection)

**Current Implementation:**
- File: `components/ui/radio-group.tsx`
- Based on: `@radix-ui/react-radio-group`
- Features: Grid layout support, keyboard navigation

**Data Structure from API:**
```typescript
interface VariantGroupResponse {
  _id: string;
  label: string;           // e.g., "Size"
  description: string;     // e.g., "Choose your pizza size"
  itemId: string;
  isPrimary: boolean;
}

interface VariantResponse {
  _id: string;
  label: string;           // e.g., "Medium"
  price: number;           // Additional price (can be 0)
  groupId: string;
  isPrimary: boolean;      // Default selection
}
```

**Enhanced Usage Pattern:**
```tsx
<VariantGroupSelector
  group={variantGroup}
  variants={variants}
  selectedVariantId={selectedVariantId}
  onVariantChange={handleVariantChange}
/>

// Implementation of VariantGroupSelector:
function VariantGroupSelector({ group, variants, selectedVariantId, onVariantChange }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold">{group.label}</Label>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </div>

      <RadioGroup value={selectedVariantId} onValueChange={onVariantChange}>
        {variants.map(variant => (
          <div key={variant._id} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent">
            <div className="flex items-center gap-3">
              <RadioGroupItem value={variant._id} id={`variant-${variant._id}`} />
              <Label htmlFor={`variant-${variant._id}`} className="cursor-pointer">
                {variant.label}
              </Label>
            </div>
            {variant.price > 0 && (
              <span className="text-sm font-medium">+{formatPrice(variant.price)}</span>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
```

**Customization Required:**
- Create wrapper component `VariantGroupSelector`
- Add price display logic
- Add visual selection states (border highlight)

---

### 2.5 Checkbox (Addon Selection)

**Current Implementation:**
- File: `components/ui/checkbox.tsx`
- Based on: `@radix-ui/react-checkbox`
- Features: Checked/indeterminate states, validation support

**Data Structure from API:**
```typescript
interface AddonGroupResponse {
  _id: string;
  label: string;           // e.g., "Extra Toppings"
  description: string;     // e.g., "Add your favorite toppings"
  allowMulti: boolean;     // If true, show quantity incrementor
  min: number;             // Minimum required selections
  max: number;             // Maximum allowed selections
}

interface AddonResponse {
  _id: string;
  label: string;           // e.g., "Extra Cheese"
  price: number;           // Addon price
  groupId: string;
}
```

**Enhanced Usage Pattern:**
```tsx
<AddonGroupSelector
  group={addonGroup}
  addons={addons}
  selectedAddons={selectedAddons}
  onAddonChange={handleAddonChange}
  onQuantityChange={handleQuantityChange}
/>

// Implementation of AddonGroupSelector:
function AddonGroupSelector({ group, addons, selectedAddons, onAddonChange, onQuantityChange }) {
  const selectedCount = selectedAddons.length;
  const isMinMet = selectedCount >= group.min;
  const isMaxReached = selectedCount >= group.max;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{group.label}</Label>
          {group.min > 0 && (
            <Badge variant={isMinMet ? "success" : "outline"}>
              {selectedCount}/{group.min} required
            </Badge>
          )}
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
        {group.max > 0 && (
          <p className="text-xs text-muted-foreground">Select up to {group.max} items</p>
        )}
      </div>

      <div className="space-y-2">
        {addons.map(addon => {
          const isSelected = selectedAddons.some(a => a.id === addon._id);
          const quantity = selectedAddons.find(a => a.id === addon._id)?.quantity || 1;

          return (
            <div key={addon._id} className="flex items-center justify-between border rounded-lg p-3">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  id={`addon-${addon._id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => onAddonChange(addon._id, checked)}
                  disabled={!isSelected && isMaxReached}
                />
                <Label htmlFor={`addon-${addon._id}`} className="cursor-pointer flex-1">
                  {addon.label}
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">+{formatPrice(addon.price)}</span>

                {/* Show quantity incrementor if allowMulti is true and addon is selected */}
                {group.allowMulti && isSelected && (
                  <QuantityIncrementor
                    value={quantity}
                    onChange={(qty) => onQuantityChange(addon._id, qty)}
                    min={1}
                    max={10}
                    size="sm"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Customization Required:**
- Create wrapper component `AddonGroupSelector`
- Implement min/max validation logic
- Integrate QuantityIncrementor for `allowMulti` groups
- Add visual feedback for validation states

---

### 2.6 Label (Form Labels)

**Status:** MISSING - Need to install

**Installation:**
```bash
npx shadcn@latest add label
```

**Usage Pattern:**
```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="variant-medium">Medium (12")</Label>
```

**Purpose:**
- Accessible labels for RadioGroup items
- Labels for Checkbox items
- Group labels for variant/addon sections

**shadcn Implementation Reference:**
```tsx
// Based on @radix-ui/react-label
// Provides proper for/id association for accessibility
```

---

### 2.7 ScrollArea (Scrollable Content)

**Status:** MISSING - Need to install

**Installation:**
```bash
npx shadcn@latest add scroll-area
```

**Usage Pattern:**
```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

<DialogContent className="sm:max-w-2xl max-h-[90vh] p-0">
  <DialogHeader className="p-6 pb-0">
    <DialogTitle>{product.name}</DialogTitle>
  </DialogHeader>

  <ScrollArea className="max-h-[calc(90vh-200px)]">
    <div className="p-6 space-y-6">
      {/* Product content */}
    </div>
  </ScrollArea>

  {/* Sticky footer outside ScrollArea */}
</DialogContent>
```

**Purpose:**
- Smooth scrolling within Dialog
- Custom scrollbar styling
- Hide scrollbar on mobile for cleaner look

**shadcn Implementation Reference:**
```tsx
// Based on @radix-ui/react-scroll-area
// Provides cross-browser custom scrollbars
```

---

### 2.8 Skeleton (Loading States)

**Current Implementation:**
- File: `components/ui/skeleton.tsx`
- Simple pulse animation

**Usage Pattern:**
```tsx
// Product details loading skeleton
function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Image gallery skeleton */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Thumbnails */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-16 rounded" />
        ))}
      </div>

      {/* Title & description */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Variant groups */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**No Customization Required** - Use as-is

---

### 2.9 Separator (Section Dividers)

**Current Implementation:**
- File: `components/ui/separator.tsx`
- Based on: `@radix-ui/react-separator`

**Usage Pattern:**
```tsx
<div className="space-y-6">
  <ProductImageGallery />

  <Separator />

  <Accordion>
    {/* Description */}
  </Accordion>

  <Separator />

  <VariantGroupSelector />

  <Separator />

  <AddonGroupSelector />
</div>
```

**No Customization Required** - Use as-is

---

### 2.10 Badge (Indicators & Tags)

**Current Implementation:**
- File: `components/ui/badge.tsx`
- Custom variants: `veg`, `nonveg`, `spicy`, `new`, `popular`, `offer`

**Usage Pattern:**
```tsx
// Product type indicator
<Badge variant={product.type === 'veg' ? 'veg' : 'nonveg'}>
  {product.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
</Badge>

// Spice level
{product.spiceLevel?.includes('2_chilli') && (
  <Badge variant="spicy">🌶️🌶️ Spicy</Badge>
)}

// Tags
{product.tags?.includes('new') && (
  <Badge variant="new">New</Badge>
)}

// Allergen warnings
{product.allergicInfo?.map(allergen => (
  <Badge key={allergen} variant="outline">{allergen}</Badge>
))}
```

**Possible Enhancement:**
- Add `icon` prop to Badge for cleaner icon integration
- Add `dot` variant for compact indicators

---

### 2.11 Button (Actions)

**Current Implementation:**
- File: `components/ui/button.tsx`
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon variants
- Has `loading` prop

**Usage Pattern:**
```tsx
// Add to cart button
<Button
  className="w-full"
  size="lg"
  onClick={handleAddToCart}
  loading={isAddingToCart}
>
  Add to Cart - {formatPrice(totalPrice)}
</Button>

// Close button
<Button variant="outline" onClick={onClose}>
  Cancel
</Button>
```

**No Customization Required** - Use as-is

---

### 2.12 QuantityIncrementor (Addon Quantities)

**Current Implementation:**
- File: `components/composite/quantity-incrementor.tsx`
- Sizes: sm, default, lg
- Features: min/max constraints, keyboard input, disabled state

**Usage Pattern:**
```tsx
// For addons with allowMulti=true
<QuantityIncrementor
  value={addonQuantity}
  onChange={handleQuantityChange}
  min={1}
  max={10}
  size="sm"
  className="ml-auto"
/>
```

**No Customization Required** - Perfect for this use case

---

## 3. New Components Specifications

### 3.1 ProductImageGallery

**Purpose:** Display product images with thumbnail navigation

**Props:**
```typescript
interface ProductImageGalleryProps {
  images: string[];              // Array of image URLs
  productName: string;           // For alt text
  className?: string;
}
```

**Features:**
- Main image display (aspect-square)
- Thumbnail navigation below
- Click thumbnail to change main image
- Keyboard navigation (Arrow keys)
- Touch swipe support on mobile
- Image zoom on hover (desktop only)
- Loading states with Skeleton

**Dependencies:**
- CustomImage component (already exists)
- Framer Motion for animations
- Tailwind CSS for styling

**Complexity:** Medium

---

### 3.2 ProductTypeIndicator

**Purpose:** Visual indicator for veg/non-veg/vegan with icon

**Props:**
```typescript
interface ProductTypeIndicatorProps {
  type: 'veg' | 'non_veg' | 'vegan';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}
```

**Visual Design:**
- Veg: Green square border with green dot inside
- Non-veg: Red square border with red dot inside
- Vegan: Green square border with "V" text

**Component Structure:**
```tsx
<div className="inline-flex items-center gap-2">
  <div className={cn(
    "border-2 flex items-center justify-center",
    type === 'veg' && "border-green-600",
    type === 'non_veg' && "border-red-600",
    // size variants
  )}>
    {type === 'vegan' ? (
      <span className="text-green-600 font-bold">V</span>
    ) : (
      <div className={cn(
        "rounded-full",
        type === 'veg' && "bg-green-600",
        type === 'non_veg' && "bg-red-600"
      )} />
    )}
  </div>
  {showLabel && <span>{formatTypeLabel(type)}</span>}
</div>
```

**Complexity:** Low

---

### 3.3 VariantGroupSelector

**Purpose:** Wrapper for RadioGroup with group metadata

**Specifications:** See section 2.4 above

**Dependencies:**
- RadioGroup (existing)
- RadioGroupItem (existing)
- Label (to install)
- formatPrice utility

**Complexity:** Medium

---

### 3.4 AddonGroupSelector

**Purpose:** Wrapper for Checkbox group with validation and quantity support

**Specifications:** See section 2.5 above

**Dependencies:**
- Checkbox (existing)
- Label (to install)
- Badge (existing)
- QuantityIncrementor (existing)
- formatPrice utility

**State Management:**
```typescript
interface SelectedAddon {
  id: string;
  quantity: number;
  price: number;
}

const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

// Validation
const isValid = selectedAddons.length >= addonGroup.min;
const canAddMore = addonGroup.max === 0 || selectedAddons.length < addonGroup.max;
```

**Complexity:** Medium

---

### 3.5 ProductDetailsFooter

**Purpose:** Sticky footer with dynamic price calculation and CTA

**Props:**
```typescript
interface ProductDetailsFooterProps {
  basePrice: number;
  selectedVariants: SelectedVariant[];
  selectedAddons: SelectedAddon[];
  onAddToCart: () => void;
  isAddingToCart: boolean;
  className?: string;
}
```

**Features:**
- Sticky positioning (stays at bottom)
- Dynamic price calculation
- Expandable price breakdown
- Add to cart button with loading state
- Quantity selector for final product

**Layout:**
```tsx
<div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 shadow-lg">
  {/* Expandable price breakdown */}
  <Accordion type="single" collapsible>
    <AccordionItem value="price-breakdown">
      <AccordionTrigger className="py-2">
        <div className="flex justify-between w-full pr-4">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <PriceBreakdown
          basePrice={basePrice}
          variants={selectedVariants}
          addons={selectedAddons}
        />
      </AccordionContent>
    </AccordionItem>
  </Accordion>

  {/* Quantity and Add to Cart */}
  <div className="flex items-center gap-3 mt-3">
    <QuantityIncrementor
      value={quantity}
      onChange={setQuantity}
      min={1}
      max={10}
    />
    <Button
      className="flex-1"
      size="lg"
      onClick={onAddToCart}
      loading={isAddingToCart}
    >
      Add to Cart
    </Button>
  </div>
</div>
```

**Complexity:** High

---

### 3.6 PriceBreakdown

**Purpose:** Display itemized price breakdown

**Props:**
```typescript
interface PriceBreakdownProps {
  basePrice: number;
  variants: SelectedVariant[];
  addons: SelectedAddon[];
  packagingCharges?: number;
  className?: string;
}
```

**Layout:**
```tsx
<div className="space-y-2 text-sm">
  <div className="flex justify-between">
    <span className="text-muted-foreground">Base Price</span>
    <span>{formatPrice(basePrice)}</span>
  </div>

  {variants.map(variant => (
    <div key={variant.id} className="flex justify-between">
      <span className="text-muted-foreground">{variant.label}</span>
      <span>+{formatPrice(variant.price)}</span>
    </div>
  ))}

  {addons.map(addon => (
    <div key={addon.id} className="flex justify-between">
      <span className="text-muted-foreground">
        {addon.label} {addon.quantity > 1 && `(x${addon.quantity})`}
      </span>
      <span>+{formatPrice(addon.price * addon.quantity)}</span>
    </div>
  ))}

  {packagingCharges > 0 && (
    <div className="flex justify-between">
      <span className="text-muted-foreground">Packaging Charges</span>
      <span>+{formatPrice(packagingCharges)}</span>
    </div>
  )}

  <Separator className="my-2" />

  <div className="flex justify-between font-semibold text-base">
    <span>Total</span>
    <span className="text-primary">{formatPrice(total)}</span>
  </div>
</div>
```

**Complexity:** Medium

---

## 4. Installation Commands

### Install Missing shadcn Components

```bash
# Install Label component
npx shadcn@latest add label

# Install ScrollArea component
npx shadcn@latest add scroll-area
```

**Verification After Installation:**
```bash
# Verify Label component exists
ls -la components/ui/label.tsx

# Verify ScrollArea component exists
ls -la components/ui/scroll-area.tsx
```

---

## 5. Component Hierarchy & Data Flow

### 5.1 Desktop Flow (Dialog)

```
Dialog (container)
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle (product.name)
    │   └── ProductTypeIndicator (product.type)
    │
    ├── ScrollArea (scrollable content)
    │   └── div (content wrapper)
    │       ├── ProductImageGallery (product.photoList)
    │       │
    │       ├── Separator
    │       │
    │       ├── Accordion (description)
    │       │   └── AccordionItem
    │       │       ├── AccordionTrigger
    │       │       └── AccordionContent
    │       │           ├── product.description
    │       │           ├── Nutritional info (if available)
    │       │           └── Allergen info (product.allergicInfo)
    │       │
    │       ├── Separator
    │       │
    │       ├── VariantGroupSelector[] (for each variantGroup)
    │       │   └── RadioGroup
    │       │       └── RadioGroupItem[] (for each variant)
    │       │           ├── RadioGroupItem
    │       │           ├── Label
    │       │           └── Price (if variant.price > 0)
    │       │
    │       ├── Separator
    │       │
    │       └── AddonGroupSelector[] (for each addonGroup)
    │           ├── Label (group.label)
    │           ├── Badge (validation state)
    │           └── Checkbox[] (for each addon)
    │               ├── Checkbox
    │               ├── Label
    │               ├── Price
    │               └── QuantityIncrementor (if allowMulti)
    │
    └── ProductDetailsFooter (sticky)
        ├── Accordion (price breakdown)
        │   └── PriceBreakdown
        ├── QuantityIncrementor (final quantity)
        └── Button (Add to Cart)
```

### 5.2 Mobile Flow (Drawer)

```
Drawer (container)
├── Drawer Header
│   ├── product.name
│   └── ProductTypeIndicator
│
├── Drawer Body (scrollable)
│   └── [Same content as Desktop ScrollArea]
│
└── Drawer Footer (sticky, uses actions API)
    └── ProductDetailsFooter (adapted for Drawer)
```

### 5.3 State Management Flow

```
ProductDetailsContainer (parent component)
│
├── Product Data (from API)
│   ├── product: ProductResponse
│   ├── variantGroupList: VariantGroupResponse[]
│   ├── variantList: VariantResponse[]
│   ├── addonGroupList: AddonGroupResponse[]
│   ├── addonList: AddonResponse[]
│   └── pricing: VariantPricingResponse[]
│
├── Selection State
│   ├── selectedVariants: Map<groupId, variantId>
│   ├── selectedAddons: SelectedAddon[]
│   └── quantity: number
│
├── Computed State
│   ├── totalPrice = calculateTotalPrice(
│   │     basePrice,
│   │     selectedVariants,
│   │     selectedAddons,
│   │     quantity,
│   │     pricing
│   │   )
│   └── isValid = validateSelections(
│         variantGroups,
│         addonGroups,
│         selectedVariants,
│         selectedAddons
│       )
│
└── Actions
    ├── handleVariantChange(groupId, variantId)
    ├── handleAddonToggle(addonId, checked)
    ├── handleAddonQuantityChange(addonId, quantity)
    ├── handleQuantityChange(quantity)
    └── handleAddToCart()
```

---

## 6. Responsive Strategy

### 6.1 Breakpoint Strategy

```typescript
// Use shadcn's responsive variants

// Desktop (sm: 640px and up)
- Dialog for product details
- Hover effects on images
- Side-by-side layout for variants/addons

// Mobile (< 640px)
- Drawer (bottom sheet) for product details
- Touch-optimized interactions
- Stacked layout for all sections
- Larger touch targets (min 44x44px)
```

### 6.2 Component Switching

```tsx
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';

export function ProductDetails({ product, isOpen, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* Desktop content */}
      </Dialog>
    );
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="bottom" size="full">
      {/* Mobile content */}
    </Drawer>
  );
}
```

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | All interactive elements must be keyboard accessible (Tab, Arrow keys, Enter, Space, Escape) |
| Focus Management | Trap focus within Dialog/Drawer, return focus to trigger on close |
| Screen Reader Support | Proper ARIA labels, roles, and live regions for dynamic content |
| Color Contrast | Minimum 4.5:1 for text, 3:1 for UI components |
| Touch Targets | Minimum 44x44px for mobile touch targets |
| Form Validation | Clear error messages with aria-invalid and aria-describedby |

### 7.2 Component-Specific Accessibility

**Dialog:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to DialogTitle
- `aria-describedby` for description (if present)
- Escape key to close
- Focus trap within dialog

**Drawer:**
- Same as Dialog
- Swipe gesture alternative for close (mobile)

**RadioGroup:**
- `role="radiogroup"`
- `aria-labelledby` for group label
- Arrow key navigation between options
- Space/Enter to select

**Checkbox:**
- `role="checkbox"`
- `aria-checked` state
- `aria-describedby` for descriptions
- Space to toggle

**Price Changes:**
- Use `aria-live="polite"` for total price updates
- Announce price changes to screen readers

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| Code Splitting | Lazy load ProductDetails component | Reduce initial bundle size |
| Image Optimization | Use CustomImage with proper sizes | Faster image loading |
| Memoization | Memoize price calculations | Prevent unnecessary re-renders |
| Debouncing | Debounce quantity changes | Reduce state updates |
| Virtual Scrolling | Consider for long addon lists | Improve scroll performance |

### 8.2 Loading States

```tsx
// Skeleton for product details loading
<ProductDetailsSkeleton />

// Suspense boundary
<Suspense fallback={<ProductDetailsSkeleton />}>
  <ProductDetails productId={productId} />
</Suspense>

// Button loading state
<Button loading={isAddingToCart}>
  Add to Cart
</Button>
```

---

## 9. Testing Strategy

### 9.1 Component Testing

```typescript
// VariantGroupSelector.test.tsx
describe('VariantGroupSelector', () => {
  it('should render all variants', () => {});
  it('should select default variant (isPrimary)', () => {});
  it('should call onVariantChange when selection changes', () => {});
  it('should display variant prices correctly', () => {});
  it('should be keyboard navigable', () => {});
});

// AddonGroupSelector.test.tsx
describe('AddonGroupSelector', () => {
  it('should enforce min selection requirement', () => {});
  it('should enforce max selection limit', () => {});
  it('should show quantity incrementor when allowMulti=true', () => {});
  it('should calculate addon total correctly', () => {});
  it('should disable checkboxes when max is reached', () => {});
});

// PriceBreakdown.test.tsx
describe('PriceBreakdown', () => {
  it('should calculate total price correctly', () => {});
  it('should display all price components', () => {});
  it('should format prices correctly', () => {});
});
```

### 9.2 Integration Testing

```typescript
// ProductDetails.integration.test.tsx
describe('ProductDetails Integration', () => {
  it('should load product data and display correctly', () => {});
  it('should update price when variants change', () => {});
  it('should update price when addons change', () => {});
  it('should validate required addon groups', () => {});
  it('should add product to cart with correct configuration', () => {});
  it('should handle API errors gracefully', () => {});
});
```

### 9.3 E2E Testing (Playwright)

```typescript
// product-details.spec.ts
test('Product Details Flow', async ({ page }) => {
  // Click product card
  await page.click('[data-testid="product-card-123"]');

  // Verify dialog opens
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Select variant
  await page.click('[data-testid="variant-medium"]');

  // Select addons
  await page.click('[data-testid="addon-extra-cheese"]');

  // Verify price updates
  await expect(page.locator('[data-testid="total-price"]')).toContainText('$15.99');

  // Add to cart
  await page.click('[data-testid="add-to-cart-button"]');

  // Verify success
  await expect(page.locator('[data-testid="toast"]')).toContainText('Added to cart');
});
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1)

1. Install missing components
   - [ ] `npx shadcn@latest add label`
   - [ ] `npx shadcn@latest add scroll-area`

2. Create base composite components
   - [ ] ProductTypeIndicator
   - [ ] ProductImageGallery
   - [ ] PriceBreakdown

3. Set up data fetching
   - [ ] API integration for ProductDetailsResponse
   - [ ] Loading states
   - [ ] Error handling

### Phase 2: Core Features (Week 2)

4. Build variant selection
   - [ ] VariantGroupSelector component
   - [ ] Selection state management
   - [ ] Price calculation integration

5. Build addon selection
   - [ ] AddonGroupSelector component
   - [ ] Min/max validation
   - [ ] Quantity integration for allowMulti

6. Build footer
   - [ ] ProductDetailsFooter component
   - [ ] Sticky positioning
   - [ ] Add to cart integration

### Phase 3: Polish (Week 3)

7. Responsive implementation
   - [ ] Desktop Dialog layout
   - [ ] Mobile Drawer layout
   - [ ] Component switching logic

8. Accessibility
   - [ ] Keyboard navigation
   - [ ] Screen reader testing
   - [ ] ARIA attributes

9. Testing
   - [ ] Unit tests for all components
   - [ ] Integration tests
   - [ ] E2E tests

### Phase 4: Optimization (Week 4)

10. Performance
    - [ ] Code splitting
    - [ ] Memoization
    - [ ] Image optimization

11. Error handling
    - [ ] Form validation
    - [ ] API error states
    - [ ] User feedback (toasts)

12. Documentation
    - [ ] Storybook stories
    - [ ] Usage examples
    - [ ] API documentation

---

## 11. Code Examples & Patterns

### 11.1 Price Calculation Logic

```typescript
interface PricingConfig {
  basePrice: number;
  selectedVariants: Map<string, string>; // groupId -> variantId
  selectedAddons: SelectedAddon[];
  quantity: number;
  pricing: VariantPricingResponse[];
}

function calculateTotalPrice(config: PricingConfig): number {
  let total = config.basePrice;

  // Add variant prices
  for (const [groupId, variantId] of config.selectedVariants) {
    const variantPrice = config.pricing.find(
      p => p.type === 'variant' && p.variantId === variantId
    );
    if (variantPrice) {
      total += variantPrice.price;
    }
  }

  // Add addon prices (considering quantity)
  for (const addon of config.selectedAddons) {
    const addonPrice = config.pricing.find(
      p => p.type === 'addon' && p.addonId === addon.id
    );
    if (addonPrice) {
      total += addonPrice.price * addon.quantity;
    }
  }

  // Multiply by product quantity
  return total * config.quantity;
}
```

### 11.2 Validation Logic

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateSelections(
  variantGroups: VariantGroupResponse[],
  addonGroups: AddonGroupResponse[],
  selectedVariants: Map<string, string>,
  selectedAddons: SelectedAddon[]
): ValidationResult {
  const errors: string[] = [];

  // Validate variant groups (all must have selection if isPrimary)
  for (const group of variantGroups) {
    if (group.isPrimary && !selectedVariants.has(group._id)) {
      errors.push(`Please select a ${group.label}`);
    }
  }

  // Validate addon groups (min/max)
  for (const group of addonGroups) {
    const groupAddons = selectedAddons.filter(
      a => {
        const addon = addonGroups.find(ag => ag._id === a.id);
        return addon?.groupId === group._id;
      }
    );

    if (groupAddons.length < group.min) {
      errors.push(`Please select at least ${group.min} ${group.label}`);
    }

    if (group.max > 0 && groupAddons.length > group.max) {
      errors.push(`You can select maximum ${group.max} ${group.label}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 11.3 State Management Pattern

```typescript
'use client';

import { useState, useMemo } from 'react';

export function useProductDetails(productData: ProductDetailsResponse) {
  // Selection state
  const [selectedVariants, setSelectedVariants] = useState<Map<string, string>>(
    () => {
      // Initialize with primary variants
      const map = new Map();
      productData.variantList
        .filter(v => v.isPrimary)
        .forEach(v => map.set(v.groupId, v._id));
      return map;
    }
  );

  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Computed values
  const totalPrice = useMemo(() => {
    return calculateTotalPrice({
      basePrice: productData.product.basePrice,
      selectedVariants,
      selectedAddons,
      quantity,
      pricing: productData.pricing
    });
  }, [selectedVariants, selectedAddons, quantity, productData]);

  const validation = useMemo(() => {
    return validateSelections(
      productData.variantGroupList,
      productData.addonGroupList,
      selectedVariants,
      selectedAddons
    );
  }, [selectedVariants, selectedAddons, productData]);

  // Actions
  const handleVariantChange = (groupId: string, variantId: string) => {
    setSelectedVariants(prev => new Map(prev).set(groupId, variantId));
  };

  const handleAddonToggle = (addonId: string, checked: boolean) => {
    setSelectedAddons(prev => {
      if (checked) {
        return [...prev, { id: addonId, quantity: 1 }];
      } else {
        return prev.filter(a => a.id !== addonId);
      }
    });
  };

  const handleAddonQuantityChange = (addonId: string, quantity: number) => {
    setSelectedAddons(prev =>
      prev.map(a => a.id === addonId ? { ...a, quantity } : a)
    );
  };

  return {
    selectedVariants,
    selectedAddons,
    quantity,
    totalPrice,
    validation,
    handleVariantChange,
    handleAddonToggle,
    handleAddonQuantityChange,
    setQuantity
  };
}
```

---

## 12. Summary & Next Steps

### Component Inventory Summary

| Status | Count | Components |
|--------|-------|------------|
| ✅ Ready to Use | 10 | Dialog, Drawer, Accordion, RadioGroup, Checkbox, Skeleton, Separator, Badge, Button, QuantityIncrementor |
| 📦 To Install | 2 | Label, ScrollArea |
| 🔧 Need Customization | 4 | Dialog (sticky footer), Drawer (sticky footer), RadioGroup (price display), Checkbox (price display) |
| 🆕 New Components | 6 | ProductImageGallery, ProductTypeIndicator, VariantGroupSelector, AddonGroupSelector, ProductDetailsFooter, PriceBreakdown |

### Next Steps

1. **Immediate Actions:**
   ```bash
   npx shadcn@latest add label
   npx shadcn@latest add scroll-area
   ```

2. **Create Component Directory Structure:**
   ```
   components/
   ├── product-details/
   │   ├── product-image-gallery.tsx
   │   ├── product-type-indicator.tsx
   │   ├── variant-group-selector.tsx
   │   ├── addon-group-selector.tsx
   │   ├── product-details-footer.tsx
   │   ├── price-breakdown.tsx
   │   ├── product-details-dialog.tsx (Desktop)
   │   ├── product-details-drawer.tsx (Mobile)
   │   └── index.tsx (Main export)
   ```

3. **Development Order:**
   - Start with low complexity (ProductTypeIndicator)
   - Build up to medium complexity (Image Gallery, Selectors)
   - Finish with high complexity (Footer with pricing)
   - Integrate everything in container components

4. **Testing Strategy:**
   - Unit test each component in isolation
   - Integration test the full product details flow
   - E2E test add to cart functionality

### Success Metrics

- All variants and addons selectable
- Price calculation accurate (matches API pricing)
- Responsive on all devices (mobile, tablet, desktop)
- WCAG 2.1 AA compliant
- Load time < 2s for product details
- Zero accessibility violations in Lighthouse audit

---

## Appendix A: shadcn Examples Reference

### Dialog Pattern
```tsx
// From @shadcn/dialog-demo
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### RadioGroup Pattern
```tsx
// From @shadcn/radio-group-demo
<RadioGroup defaultValue="comfortable">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">Comfortable</Label>
  </div>
</RadioGroup>
```

### Checkbox Pattern
```tsx
// From @shadcn/checkbox-demo
<div className="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

---

## Appendix B: API Response Examples

### ProductDetailsResponse
```json
{
  "product": {
    "_id": "prod_123",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza with fresh mozzarella and basil",
    "type": "veg",
    "photoList": [
      "https://example.com/pizza1.jpg",
      "https://example.com/pizza2.jpg"
    ],
    "basePrice": 8.99,
    "packagingCharges": 0.50,
    "tags": ["popular", "classic"],
    "spiceLevel": ["0_chilli"],
    "protein": 12,
    "carbs": 35,
    "fats": 10,
    "allergicInfo": ["Dairy", "Gluten"]
  },
  "variantGroupList": [
    {
      "_id": "vg_1",
      "label": "Size",
      "description": "Choose your pizza size",
      "isPrimary": true
    },
    {
      "_id": "vg_2",
      "label": "Crust",
      "description": "Select your preferred crust type",
      "isPrimary": false
    }
  ],
  "variantList": [
    {
      "_id": "v_1",
      "label": "Small (8\")",
      "price": 0,
      "groupId": "vg_1",
      "isPrimary": false
    },
    {
      "_id": "v_2",
      "label": "Medium (12\")",
      "price": 0,
      "groupId": "vg_1",
      "isPrimary": true
    },
    {
      "_id": "v_3",
      "label": "Large (16\")",
      "price": 4.00,
      "groupId": "vg_1",
      "isPrimary": false
    },
    {
      "_id": "v_4",
      "label": "Thin Crust",
      "price": 0,
      "groupId": "vg_2",
      "isPrimary": true
    },
    {
      "_id": "v_5",
      "label": "Thick Crust",
      "price": 1.50,
      "groupId": "vg_2",
      "isPrimary": false
    }
  ],
  "addonGroupList": [
    {
      "_id": "ag_1",
      "label": "Extra Toppings",
      "description": "Add your favorite toppings",
      "allowMulti": true,
      "min": 0,
      "max": 5
    },
    {
      "_id": "ag_2",
      "label": "Dipping Sauce",
      "description": "Choose a dipping sauce",
      "allowMulti": false,
      "min": 0,
      "max": 1
    }
  ],
  "addonList": [
    {
      "_id": "a_1",
      "label": "Extra Cheese",
      "price": 1.50,
      "groupId": "ag_1"
    },
    {
      "_id": "a_2",
      "label": "Mushrooms",
      "price": 1.00,
      "groupId": "ag_1"
    },
    {
      "_id": "a_3",
      "label": "Marinara Sauce",
      "price": 0.50,
      "groupId": "ag_2"
    }
  ],
  "pricing": [
    {
      "_id": "p_1",
      "type": "variant",
      "variantId": "v_1",
      "price": 0,
      "isVisible": true
    },
    {
      "_id": "p_2",
      "type": "variant",
      "variantId": "v_3",
      "price": 4.00,
      "isVisible": true
    },
    {
      "_id": "p_3",
      "type": "addon",
      "addonId": "a_1",
      "price": 1.50,
      "isVisible": true
    }
  ]
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Author:** Claude Code (shadcn Requirements Analyzer)
**Project:** PizzaSpace Web - Product Details Feature
