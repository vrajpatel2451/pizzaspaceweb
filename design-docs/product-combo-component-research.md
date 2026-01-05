# Product Combo Feature - Component Research

**Date**: January 5, 2026
**Project**: PizzaSpace Web
**Feature**: Product Combo Selection UI
**Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

## Executive Summary

Research for the Product Combo feature identified all required shadcn/ui components. **Good news**: All base components are already installed in your project. No new installations needed. Custom components will be created to implement the specific combo selection UI pattern.

---

## Component Architecture

```
Product Combo Selection Flow
├── ComboGroupCard (custom)
│   ├── Card (shadcn - INSTALLED)
│   ├── CardHeader (shadcn - INSTALLED)
│   ├── CardTitle (shadcn - INSTALLED)
│   ├── CardDescription (shadcn - INSTALLED)
│   ├── CardAction (shadcn - INSTALLED) - for counter badge
│   ├── CardContent (shadcn - INSTALLED)
│   └── Badge (shadcn - INSTALLED) - selection counter
├── ComboProductItem (custom)
│   ├── Custom selection UI (NOT checkbox/radio)
│   ├── Button (shadcn - INSTALLED) - "Selected" and "Customize" buttons
│   └── Badge (shadcn - INSTALLED) - selection indicator
├── CustomizationDialog (custom)
│   ├── Dialog (shadcn - INSTALLED)
│   ├── DialogContent (shadcn - INSTALLED)
│   ├── DialogHeader (shadcn - INSTALLED)
│   ├── DialogTitle (shadcn - INSTALLED)
│   ├── DialogDescription (shadcn - INSTALLED)
│   ├── DialogFooter (shadcn - INSTALLED)
│   ├── Checkbox (shadcn - INSTALLED) - for addon selection
│   └── Button (shadcn - INSTALLED)
└── ValidationIndicator (custom)
    ├── Alert (shadcn - INSTALLED) - error states
    └── Badge (shadcn - INSTALLED) - validation status
```

---

## Installed Components - Current Status

All base components needed are **ALREADY INSTALLED** in your project:

### Location
`/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/`

### Component Inventory

| Component | Status | File | Key Props |
|-----------|--------|------|-----------|
| **Card** | INSTALLED | card.tsx | className, children |
| **CardHeader** | INSTALLED | card.tsx | className, children |
| **CardTitle** | INSTALLED | card.tsx | className, children |
| **CardDescription** | INSTALLED | card.tsx | className, children |
| **CardAction** | INSTALLED | card.tsx | className, children |
| **CardContent** | INSTALLED | card.tsx | className, children |
| **CardFooter** | INSTALLED | card.tsx | className, children |
| **Button** | INSTALLED | button.tsx | variant, size, loading, asChild, children |
| **Badge** | INSTALLED | badge.tsx | variant, size, className, children |
| **Dialog** | INSTALLED | dialog.tsx | open, onOpenChange, children |
| **DialogTrigger** | INSTALLED | dialog.tsx | asChild, children |
| **DialogContent** | INSTALLED | dialog.tsx | showCloseButton, className, children |
| **DialogHeader** | INSTALLED | dialog.tsx | className, children |
| **DialogTitle** | INSTALLED | dialog.tsx | className, children |
| **DialogDescription** | INSTALLED | dialog.tsx | className, children |
| **DialogFooter** | INSTALLED | dialog.tsx | className, children |
| **DialogClose** | INSTALLED | dialog.tsx | asChild, children |
| **Sheet** | INSTALLED | sheet.tsx | open, onOpenChange, children |
| **SheetTrigger** | INSTALLED | sheet.tsx | asChild, children |
| **SheetContent** | INSTALLED | sheet.tsx | side, className, children |
| **SheetHeader** | INSTALLED | sheet.tsx | className, children |
| **SheetTitle** | INSTALLED | sheet.tsx | className, children |
| **SheetDescription** | INSTALLED | sheet.tsx | className, children |
| **SheetFooter** | INSTALLED | sheet.tsx | className, children |
| **SheetClose** | INSTALLED | sheet.tsx | asChild, children |
| **Checkbox** | INSTALLED | checkbox.tsx | checked, onCheckedChange, disabled, children |
| **Alert** | INSTALLED | alert.tsx | variant, className, children |
| **Label** | INSTALLED | label.tsx | htmlFor, className, children |

---

## Component Details & Implementation Guide

### 1. Card Components

**Files**: `/components/ui/card.tsx`

**Purpose**: Container for combo groups with structured layout

**Available Components**:
```typescript
- Card                  // Main container
- CardHeader           // Top section with title/description
- CardTitle            // Group label (e.g., "Choose Your First Pizza")
- CardDescription      // Instruction text
- CardAction           // Right-aligned counter badge
- CardContent          // Main product list area
- CardFooter           // Optional actions at bottom
```

**Key Features**:
- Rounded corners (rounded-xl)
- Border and shadow styling
- Built-in gap and padding system
- Responsive grid layout in CardHeader
- Auto-handles column layout when CardAction is present

**Current Styling**:
```typescript
// From card.tsx
Card: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
CardHeader: "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]"
CardTitle: "leading-none font-semibold"
CardDescription: "text-muted-foreground text-sm"
CardAction: "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
CardContent: "px-6"
```

**Usage Example for Combo Group**:
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ComboGroupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your First Pizza</CardTitle>
        <CardDescription>Select your first 9 inch pizza</CardDescription>
        <CardAction>
          <Badge variant="secondary">[0/1]</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Combo product items here */}
      </CardContent>
    </Card>
  )
}
```

---

### 2. Badge Component

**File**: `/components/ui/badge.tsx`

**Purpose**: Selection counters and status indicators

**Available Variants**:
```typescript
"default"           // Primary color
"secondary"         // Secondary color
"destructive"       // Error state
"outline"           // Outline style
"success"           // Green badge
"warning"           // Amber badge
"info"              // Blue badge
"outline-primary"   // Primary outline
"muted"             // Muted state
"new"               // Emerald (new items)
"popular"           // Orange (popular items)
"spicy"             // Red (spicy indicator)
"veg"               // Green (vegetarian)
"nonveg"            // Red (non-vegetarian)
"offer"             // Purple (special offers)
```

**Available Sizes**:
```typescript
"sm"        // text-[10px]
"default"   // text-xs
"lg"        // text-sm
```

**Perfect for Combo UI**:
- Selection counter: `<Badge variant="secondary">[0/1]</Badge>`
- Product type indicator: `<Badge variant="veg">Veg</Badge>`
- Dietary badge: `<Badge variant="nonveg">Non-Veg</Badge>`

**Usage Example**:
```tsx
import { Badge } from "@/components/ui/badge"

// Selection counter in card header
<Badge variant="secondary">[0/1]</Badge>

// Product type indicator
<Badge variant="veg">Vegetarian</Badge>
<Badge variant="nonveg">Non-Veg</Badge>

// Selection status
<Badge variant="success">Selected</Badge>
<Badge variant="outline">Add</Badge>
```

---

### 3. Dialog Component

**File**: `/components/ui/dialog.tsx`

**Purpose**: Modal for addon customization

**Available Components**:
```typescript
Dialog              // Root component
DialogTrigger       // Opens dialog
DialogContent       // Modal container
DialogHeader        // Title/description area
DialogTitle         // Modal title
DialogDescription   // Modal description
DialogFooter        // Action buttons area
DialogClose         // Close button
DialogPortal        // Portal container
DialogOverlay       // Backdrop overlay
```

**Key Features**:
- Built-in close button (XIcon top-right)
- Customizable showCloseButton prop
- Smooth animations (fade-in/zoom-in)
- Responsive sizing (max-w-[calc(100%-2rem)], sm:max-w-lg)
- Overlay backdrop (bg-black/50)
- Focus trap and keyboard navigation

**Dialog Properties**:
```typescript
// From dialog.tsx
DialogContent: "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg"
DialogOverlay: "fixed inset-0 z-50 bg-black/50"
DialogTitle: "text-lg leading-none font-semibold"
DialogDescription: "text-muted-foreground text-sm"
```

**Usage Example for Addon Customization**:
```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CustomizationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Customize</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Margherita Pizza</DialogTitle>
          <DialogDescription>
            Select additional toppings or options
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Addon checkboxes */}
          <div className="flex items-center gap-2">
            <Checkbox id="addon-1" />
            <Label htmlFor="addon-1">Extra Cheese</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="addon-2" />
            <Label htmlFor="addon-2">Extra Vegetables</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

### 4. Sheet Component

**File**: `/components/ui/sheet.tsx`

**Purpose**: Mobile-friendly alternative to dialog for customization on smaller screens

**Available Components**:
```typescript
Sheet              // Root component
SheetTrigger       // Opens sheet
SheetContent       // Sheet container
SheetHeader        // Title/description area
SheetTitle         // Sheet title
SheetDescription   // Sheet description
SheetFooter        // Action buttons area
SheetClose         // Close button
SheetPortal        // Portal container
SheetOverlay       // Backdrop overlay
```

**Side Options**:
```typescript
"top"      // Slides down from top
"right"    // Slides in from right (default)
"bottom"   // Slides up from bottom
"left"     // Slides in from left
```

**Key Features**:
- Slide-in animations based on side
- Full height (inset-y-0) for left/right
- Built-in close button
- Responsive width (w-3/4, sm:max-w-sm)
- Smooth transitions (duration-300/500)

**Sheet Properties**:
```typescript
// From sheet.tsx
SheetContent (right): "fixed z-50 flex flex-col gap-4 shadow-lg inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
SheetOverlay: "fixed inset-0 z-50 bg-black/50"
SheetTitle: "text-foreground font-semibold"
SheetDescription: "text-muted-foreground text-sm"
```

**Usage Example for Mobile Customization**:
```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MobileCustomizationSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Customize
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Customize Margherita Pizza</SheetTitle>
          <SheetDescription>
            Select additional toppings or options
          </SheetDescription>
        </SheetHeader>
        {/* Addon selection content */}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

---

### 5. Button Component

**File**: `/components/ui/button.tsx`

**Purpose**: Interactive actions for selection and customization

**Available Variants**:
```typescript
"default"       // Primary color (bg-primary)
"destructive"   // Error/deletion (bg-destructive)
"outline"       // Border outline style
"secondary"     // Secondary color (bg-secondary)
"ghost"         // Transparent with hover effect
"link"          // Text link style (underline-offset-4)
```

**Available Sizes**:
```typescript
"default"       // h-9 px-4 py-2
"sm"            // h-8 px-3
"lg"            // h-10 px-6
"icon"          // size-9 (square)
"icon-sm"       // size-8 (square)
"icon-lg"       // size-10 (square)
```

**Special Props**:
```typescript
loading?: boolean       // Shows spinner when true
asChild?: boolean       // Use Slot to render as another component
disabled?: boolean      // Disabled state
```

**Perfect for Combo UI**:
```tsx
import { Button } from "@/components/ui/button"

// Selection indicator button
<Button variant="secondary" size="sm">
  Selected 1
</Button>

// Add button for unselected items
<Button variant="outline" size="sm">
  + Add
</Button>

// Customize button
<Button variant="ghost" size="sm">
  Customize
</Button>

// Dialog trigger
<Button variant="outline" asChild>
  <DialogTrigger>Open Customization</DialogTrigger>
</Button>
```

---

### 6. Checkbox Component

**File**: `/components/ui/checkbox.tsx`

**Purpose**: Addon selection in customization modal/sheet

**Available Props**:
```typescript
checked?: boolean
onCheckedChange?: (checked: boolean) => void
disabled?: boolean
id?: string
defaultChecked?: boolean
```

**Usage Example for Addon Selection**:
```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function AddonList() {
  const [addons, setAddons] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-3">
      {addons_data.map((addon) => (
        <div key={addon.id} className="flex items-center gap-2">
          <Checkbox
            id={`addon-${addon.id}`}
            checked={addons[addon.id] || false}
            onCheckedChange={(checked) =>
              setAddons(prev => ({
                ...prev,
                [addon.id]: checked
              }))
            }
          />
          <Label htmlFor={`addon-${addon.id}`}>
            {addon.name}
            {addon.price && ` (+$${addon.price})`}
          </Label>
        </div>
      ))}
    </div>
  )
}
```

---

### 7. Label Component

**File**: `/components/ui/label.tsx`

**Purpose**: Form labels and text associations

**Key Features**:
- Accessibility-first (htmlFor binding)
- Inherits text styling from parent
- Smooth transition effects
- Focus indicator support

**Usage Example**:
```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="addon-1">Extra Cheese</Label>
<Label htmlFor="addon-2">Extra Vegetables</Label>
```

---

### 8. Alert Component

**File**: `/components/ui/alert.tsx`

**Purpose**: Validation error messages and warnings

**Available Variants**:
```typescript
"default"       // Default alert style
"destructive"   // Error state (red)
```

**Usage Example for Validation**:
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ValidationAlert({ errors }) {
  if (!errors.length) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {errors.map(err => (
          <div key={err.id}>{err.message}</div>
        ))}
      </AlertDescription>
    </Alert>
  )
}
```

---

## Custom Components to Build

### 1. ComboGroupCard Component

**Location**: `components/combo/combo-group-card.tsx`

**Responsibilities**:
- Display group label and instruction text
- Show selection counter
- Render list of product items
- Handle group-level state

**Props Interface**:
```typescript
interface ComboGroupCardProps {
  id: string
  label: string                    // "Choose Your First Pizza"
  description: string              // "Select your first 9 inch pizza"
  required: number                 // 1 (quantity required)
  items: ComboProduct[]            // Product items in this group
  selectedCount: number            // Current selection count
  onItemSelect: (itemId: string, quantity: number) => void
  onCustomize: (itemId: string) => void
}
```

**Implementation Pattern**:
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ComboProductItem from "./combo-product-item"

export default function ComboGroupCard({
  label,
  description,
  required,
  items,
  selectedCount,
  onItemSelect,
  onCustomize,
}: ComboGroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            [{selectedCount}/{required}]
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <ComboProductItem
            key={item.id}
            product={item}
            onSelect={(qty) => onItemSelect(item.id, qty)}
            onCustomize={() => onCustomize(item.id)}
          />
        ))}
      </CardContent>
    </Card>
  )
}
```

---

### 2. ComboProductItem Component

**Location**: `components/combo/combo-product-item.tsx`

**Responsibilities**:
- Display product name and description
- Show custom selection UI (NOT checkbox/radio)
- Display selection status
- Provide customize button

**Props Interface**:
```typescript
interface ComboProductItemProps {
  product: {
    id: string
    name: string
    description?: string
    price?: number
    imageUrl?: string
    vegetarian?: boolean
  }
  isSelected: boolean
  selectedCount: number
  onSelect: (quantity: number) => void
  onCustomize: () => void
}
```

**UI Pattern (NO checkbox/radio)**:
```
┌─────────────────────────────────────────────────┐
│ Margherita Pizza ...................... [Selected 1] │
│ Classic tomato and mozzarella       [Customize] │
└─────────────────────────────────────────────────┘

OR (for unselected items)

┌─────────────────────────────────────────────────┐
│ Pepperoni Pizza .......................... [+ Add] │
│ Pepperoni and mozzarella                        │
└─────────────────────────────────────────────────┘
```

**Implementation Pattern**:
```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ComboProductItem({
  product,
  isSelected,
  selectedCount,
  onSelect,
  onCustomize,
}: ComboProductItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent cursor-pointer"
         onClick={() => !isSelected && onSelect(1)}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate">{product.name}</h4>
          {product.vegetarian && (
            <Badge variant="veg" size="sm">Veg</Badge>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-muted-foreground truncate">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {isSelected ? (
          <>
            <Badge variant="success">Selected {selectedCount}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onCustomize()
              }}
            >
              Customize
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(1)
            }}
          >
            + Add
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

### 3. CustomizationDialog/Sheet Component

**Location**: `components/combo/customization-dialog.tsx` and `components/combo/customization-sheet.tsx`

**Responsibilities**:
- Display addon selection options
- Handle addon selection state
- Provide save/cancel actions
- Show addon pricing

**Props Interface**:
```typescript
interface CustomizationDialogProps {
  productId: string
  productName: string
  currentAddons: Addon[]
  availableAddons: Addon[]
  onSave: (selectedAddons: Addon[]) => void
  onCancel: () => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface Addon {
  id: string
  name: string
  price?: number
  optional?: boolean
  maxQuantity?: number
}
```

**Implementation Pattern (Desktop - Dialog)**:
```tsx
import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function CustomizationDialog({
  productId,
  productName,
  availableAddons,
  onSave,
  isOpen,
  onOpenChange,
}: CustomizationDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize {productName}</DialogTitle>
          <DialogDescription>
            Select additional toppings and options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {availableAddons.map((addon) => (
            <div key={addon.id} className="flex items-center gap-3">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={(checked) => {
                  setSelectedAddons(prev =>
                    checked
                      ? [...prev, addon.id]
                      : prev.filter(id => id !== addon.id)
                  )
                }}
              />
              <Label htmlFor={`addon-${addon.id}`} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span>{addon.name}</span>
                  {addon.price && (
                    <Badge variant="secondary" size="sm">
                      +${addon.price}
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              const addons = availableAddons.filter(a =>
                selectedAddons.includes(a.id)
              )
              onSave(addons)
              onOpenChange(false)
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Implementation Pattern (Mobile - Sheet)**:
```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

export default function CustomizationSheet({
  productId,
  productName,
  availableAddons,
  onSave,
  isOpen,
  onOpenChange,
}: CustomizationDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Customize {productName}</SheetTitle>
          <SheetDescription>
            Select additional toppings and options
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto">
          {availableAddons.map((addon) => (
            <div key={addon.id} className="flex items-center gap-3">
              <Checkbox
                id={`addon-sheet-${addon.id}`}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={(checked) => {
                  setSelectedAddons(prev =>
                    checked
                      ? [...prev, addon.id]
                      : prev.filter(id => id !== addon.id)
                  )
                }}
              />
              <Label htmlFor={`addon-sheet-${addon.id}`} className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{addon.name}</span>
                  {addon.price && (
                    <Badge variant="secondary" size="sm">
                      +${addon.price}
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
          <Button
            className="w-full"
            onClick={() => {
              const addons = availableAddons.filter(a =>
                selectedAddons.includes(a.id)
              )
              onSave(addons)
              onOpenChange(false)
            }}
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

---

### 4. ComboValidationAlert Component

**Location**: `components/combo/combo-validation-alert.tsx`

**Responsibilities**:
- Display validation errors for unfulfilled requirements
- Show missing quantity information
- Auto-dismiss after successful validation

**Props Interface**:
```typescript
interface ComboValidationAlertProps {
  groups: ComboGroup[]
  errors: {
    groupId: string
    message: string
    required: number
    current: number
  }[]
}
```

**Implementation Pattern**:
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ComboValidationAlert({ errors }: ComboValidationAlertProps) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          {errors.map((error) => (
            <div key={error.groupId}>
              {error.message} ({error.current}/{error.required} selected)
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
```

---

## Installation Commands

**Good News**: No installations needed! All base components are already installed.

However, if you need to reinstall or add future components, use these commands:

```bash
# If ever needed to add/reinstall components
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add checkbox
npx shadcn@latest add label
npx shadcn@latest add alert

# Or in one command
npx shadcn@latest add card badge button dialog sheet checkbox label alert
```

---

## Styling & Customization

### Tailwind Classes Reference

**Combo-specific utility classes**:
```css
/* Item selection container */
flex items-center justify-between rounded-lg border p-4
transition-colors hover:bg-accent cursor-pointer

/* Product name row with badges */
flex items-center gap-2 text-sm font-medium

/* Action buttons area */
flex items-center gap-2 ml-4 shrink-0

/* Addon list in modal */
space-y-3 py-4 max-h-[60vh] overflow-y-auto

/* Counter badge in header */
inline-flex gap-1 items-center text-sm font-medium
```

### Dark Mode Support

All installed components have built-in dark mode support via CSS variables:
- Text colors automatically adjust via `text-foreground` and `text-muted-foreground`
- Backgrounds use `bg-background` and `bg-card`
- Borders use `border` with proper contrast in dark mode

---

## Key Design Decisions

### 1. NO Checkbox/Radio for Selection

The design deliberately avoids checkbox/radio inputs for combo item selection. Instead:
- Items are clickable cards with visual selection state
- Selection is confirmed by button click ("Selected" or "+ Add")
- This creates a cleaner, more intuitive UX for food ordering

### 2. Dialog vs Sheet Strategy

- **Desktop (md+)**: Use Dialog for modal customization
- **Mobile (sm)**: Use Sheet with `side="bottom"` for drawer-style modal
- Both share identical functionality, just different interactions

### 3. Badge Variants for Status

- Selection counter: `<Badge variant="secondary">[0/1]</Badge>`
- Selected state: `<Badge variant="success">Selected 1</Badge>`
- Add action: Text button (not badge) to avoid confusion

### 4. Card-based Container

Using Card components for grouping provides:
- Visual hierarchy through borders and shadows
- Built-in padding and spacing system
- Accessible structure with CardHeader/CardContent separation
- Natural scrolling area for product lists

---

## Accessibility Considerations

### ARIA & Semantic HTML

```typescript
// Proper label associations
<Checkbox id="addon-1" />
<Label htmlFor="addon-1">Extra Cheese</Label>

// Dialog accessibility
<Dialog open={isOpen} onOpenChange={setOpen}>
  <DialogTitle>Customize Pizza</DialogTitle>
  <DialogDescription>Select toppings</DialogDescription>
  {/* Focus trap handled by Radix Dialog */}
</Dialog>

// Sheet accessibility
<Sheet open={isOpen} onOpenChange={setOpen}>
  <SheetTitle>Customize Pizza</SheetTitle>
  {/* Focus trap handled by Radix Dialog */}
</Sheet>
```

### Focus Management

- Dialog and Sheet handle focus trapping automatically (Radix UI)
- All interactive elements are keyboard accessible
- Return focus to trigger button on close

### Screen Reader Support

- Label elements properly associated with inputs
- Dialog/Sheet announce title and description
- Selection state conveyed through Badge text
- Error messages in Alert with `aria-live` support

---

## Component Dependency Graph

```
ComboGroupCard
├── Card (shadcn)
├── CardHeader (shadcn)
├── CardTitle (shadcn)
├── CardDescription (shadcn)
├── CardAction (shadcn)
├── Badge (shadcn)
└── ComboProductItem (custom)
    ├── Button (shadcn)
    ├── Badge (shadcn)
    └── CustomizationDialog (custom)
        ├── Dialog (shadcn)
        ├── Checkbox (shadcn)
        ├── Label (shadcn)
        ├── Button (shadcn)
        └── Badge (shadcn)

ComboValidationAlert
├── Alert (shadcn)
└── Badge (shadcn)
```

---

## Testing Strategy

### Component Testing Checklist

- **Card Rendering**: Verify layout with long product names
- **Selection State**: Toggle between selected/unselected
- **Counter Updates**: Verify badge counts correctly
- **Dialog/Sheet**: Test open/close, addon selection, save
- **Validation**: Display errors for incomplete groups
- **Responsive**: Desktop dialog, mobile sheet behavior
- **Keyboard Nav**: Tab through items, open dialog with Enter
- **Accessibility**: Test with screen readers

---

## File Structure Reference

```
components/
├── ui/                           (Already installed)
│   ├── card.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── checkbox.tsx
│   ├── label.tsx
│   └── alert.tsx
│
└── combo/                        (To be created)
    ├── combo-group-card.tsx
    ├── combo-product-item.tsx
    ├── customization-dialog.tsx
    ├── customization-sheet.tsx
    ├── combo-validation-alert.tsx
    └── types.ts                  (Shared interfaces)
```

---

## Next Steps

1. Create `components/combo/` directory
2. Create custom components using patterns above
3. Implement state management (React Context or Zustand)
4. Add form integration with existing form system
5. Test responsive behavior (desktop/mobile)
6. Add animations for selection state transitions

---

## Reference Links

- **Card Component**: `/components/ui/card.tsx`
- **Badge Component**: `/components/ui/badge.tsx`
- **Button Component**: `/components/ui/button.tsx`
- **Dialog Component**: `/components/ui/dialog.tsx`
- **Sheet Component**: `/components/ui/sheet.tsx`
- **Checkbox Component**: `/components/ui/checkbox.tsx`
- **Label Component**: `/components/ui/label.tsx`
- **Alert Component**: `/components/ui/alert.tsx`

---

## Component Props Summary Table

| Component | Key Props | Type | Default |
|-----------|-----------|------|---------|
| Card | className | string | - |
| Badge | variant, size | enum | "default", "default" |
| Button | variant, size, loading, disabled | mixed | "default", "default", false, false |
| Dialog | open, onOpenChange | boolean, function | - |
| Sheet | open, onOpenChange, side | mixed | -, -, "right" |
| Checkbox | checked, onCheckedChange, disabled | mixed | - |
| Label | htmlFor | string | - |
| Alert | variant | enum | "default" |

---

**Document Version**: 1.0
**Last Updated**: January 5, 2026
**Status**: Ready for Implementation
