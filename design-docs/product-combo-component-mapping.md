# Product Combo - Component Mapping & Quick Reference

**Quick Lookup Table for Implementation**

---

## Component Installation Status

| Component | Status | Path | Import |
|-----------|--------|------|--------|
| Card | ✅ INSTALLED | `/components/ui/card.tsx` | `import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"` |
| Badge | ✅ INSTALLED | `/components/ui/badge.tsx` | `import { Badge } from "@/components/ui/badge"` |
| Button | ✅ INSTALLED | `/components/ui/button.tsx` | `import { Button } from "@/components/ui/button"` |
| Dialog | ✅ INSTALLED | `/components/ui/dialog.tsx` | `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"` |
| Sheet | ✅ INSTALLED | `/components/ui/sheet.tsx` | `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"` |
| Checkbox | ✅ INSTALLED | `/components/ui/checkbox.tsx` | `import { Checkbox } from "@/components/ui/checkbox"` |
| Label | ✅ INSTALLED | `/components/ui/label.tsx` | `import { Label } from "@/components/ui/label"` |
| Alert | ✅ INSTALLED | `/components/ui/alert.tsx` | `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"` |

---

## UI Element to Component Mapping

### Group Container Header

**UI Element**: "Choose Your First Pizza [0/1]"

**Components**:
```
Card (container)
├── CardHeader
│   ├── CardTitle (text: "Choose Your First Pizza")
│   ├── CardDescription (text: "Select your first 9 inch pizza")
│   └── CardAction
│       └── Badge (text: "[0/1]", variant: "secondary")
```

**Usage Code**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

<Card>
  <CardHeader>
    <CardTitle>Choose Your First Pizza</CardTitle>
    <CardDescription>Select your first 9 inch pizza</CardDescription>
    <CardAction>
      <Badge variant="secondary">[0/1]</Badge>
    </CardAction>
  </CardHeader>
</Card>
```

---

### Product Item - Unselected State

**UI Element**: "Pepperoni Pizza .......................... [+ Add]"

**Components**:
```
div (flex container)
├── div (product info)
│   ├── h4 (product name)
│   ├── Badge (vegetarian indicator - optional)
│   └── p (description)
└── div (action area)
    └── Button (variant: "outline", text: "+ Add")
```

**Usage Code**:
```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

<div className="flex items-center justify-between rounded-lg border p-4">
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <h4 className="font-medium">Pepperoni Pizza</h4>
      <Badge variant="nonveg" size="sm">Non-Veg</Badge>
    </div>
    <p className="text-sm text-muted-foreground">Pepperoni and mozzarella</p>
  </div>
  <Button variant="outline" size="sm">+ Add</Button>
</div>
```

---

### Product Item - Selected State

**UI Element**: "Margherita Pizza ............. [Selected 1] [Customize]"

**Components**:
```
div (flex container)
├── div (product info)
│   ├── h4 (product name)
│   ├── Badge (vegetarian indicator)
│   └── p (description)
└── div (action area)
    ├── Badge (text: "Selected 1", variant: "success")
    └── Button (text: "Customize", variant: "ghost")
```

**Usage Code**:
```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

<div className="flex items-center justify-between rounded-lg border p-4">
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <h4 className="font-medium">Margherita Pizza</h4>
      <Badge variant="veg" size="sm">Veg</Badge>
    </div>
    <p className="text-sm text-muted-foreground">Classic tomato and mozzarella</p>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant="success">Selected 1</Badge>
    <Button variant="ghost" size="sm">Customize</Button>
  </div>
</div>
```

---

### Customization Modal - Desktop

**UI Element**: Modal with addon checkboxes and Save/Cancel buttons

**Components**:
```
Dialog
├── DialogContent
│   ├── DialogHeader
│   │   ├── DialogTitle (text: "Customize Pizza Name")
│   │   └── DialogDescription
│   ├── div (addon list)
│   │   └── (repeated for each addon)
│   │       ├── Checkbox
│   │       └── Label (with Badge for price)
│   └── DialogFooter
│       ├── Button (variant: "outline", text: "Cancel")
│       └── Button (text: "Save Changes")
```

**Usage Code**:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Customize Margherita Pizza</DialogTitle>
      <DialogDescription>Select additional toppings</DialogDescription>
    </DialogHeader>

    <div className="space-y-3">
      {addons.map(addon => (
        <div key={addon.id} className="flex items-center gap-3">
          <Checkbox id={`addon-${addon.id}`} />
          <Label htmlFor={`addon-${addon.id}`}>
            <div className="flex items-center justify-between">
              <span>{addon.name}</span>
              <Badge variant="secondary" size="sm">+${addon.price}</Badge>
            </div>
          </Label>
        </div>
      ))}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={handleSave}>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Customization Modal - Mobile (Sheet)

**UI Element**: Bottom drawer with addon checkboxes and Save/Cancel buttons

**Components**:
```
Sheet
├── SheetContent (side: "bottom")
│   ├── SheetHeader
│   │   ├── SheetTitle (text: "Customize Pizza Name")
│   │   └── SheetDescription
│   ├── div (addon list)
│   │   └── (repeated for each addon)
│   │       ├── Checkbox
│   │       └── Label (with Badge for price)
│   └── SheetFooter
│       ├── Button (variant: "outline", text: "Cancel", className: "flex-1")
│       └── Button (text: "Save Changes", className: "flex-1")
```

**Usage Code**:
```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="bottom" className="rounded-t-lg">
    <SheetHeader>
      <SheetTitle>Customize Margherita Pizza</SheetTitle>
      <SheetDescription>Select additional toppings</SheetDescription>
    </SheetHeader>

    <div className="space-y-3">
      {addons.map(addon => (
        <div key={addon.id} className="flex items-center gap-3">
          <Checkbox id={`addon-${addon.id}`} />
          <Label htmlFor={`addon-${addon.id}`}>
            <div className="flex items-center justify-between">
              <span>{addon.name}</span>
              <Badge variant="secondary" size="sm">+${addon.price}</Badge>
            </div>
          </Label>
        </div>
      ))}
    </div>

    <SheetFooter className="flex gap-2">
      <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

### Validation Alert - Error State

**UI Element**: Red alert banner showing incomplete selections

**Components**:
```
Alert (variant: "destructive")
├── AlertIcon
└── AlertDescription
    └── div (multiple error messages)
        ├── span (error text)
        └── span (selection count)
```

**Usage Code**:
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    <div className="space-y-1">
      {errors.map(error => (
        <div key={error.groupId} className="flex items-center justify-between">
          <span>{error.message}</span>
          <span className="text-xs opacity-70">({error.current}/{error.required})</span>
        </div>
      ))}
    </div>
  </AlertDescription>
</Alert>
```

---

### Validation Alert - Success State

**UI Element**: Green success banner

**Components**:
```
Alert (className: "border-green-200 bg-green-50")
├── CheckCircle (className: "text-green-600")
└── AlertDescription (className: "text-green-800")
```

**Usage Code**:
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

<Alert className="border-green-200 bg-green-50">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertDescription className="text-green-800">
    All required items selected. Ready to proceed!
  </AlertDescription>
</Alert>
```

---

## Badge Variants for Combo Use Cases

| Use Case | Variant | Example |
|----------|---------|---------|
| Selection Counter | `secondary` | `[0/1]` |
| Selected Status | `success` | `Selected 1` |
| Vegetarian Indicator | `veg` | `Veg` |
| Non-Vegetarian | `nonveg` | `Non-Veg` |
| Addon Price | `secondary` | `+$2.50` |
| Optional Badge | `outline` | `Optional` |
| New Item | `new` | `New` |
| Popular Item | `popular` | `Popular` |
| Spicy Item | `spicy` | `Spicy` |

---

## Button Variants for Combo Use Cases

| Use Case | Variant | Size | Example |
|----------|---------|------|---------|
| Add Item | `outline` | `sm` | `+ Add` |
| Customize | `ghost` | `sm` | `Customize` |
| Dialog Cancel | `outline` | `default` | `Cancel` |
| Dialog Save | `default` | `default` | `Save Changes` |
| Submit Order | `default` | `lg` | `Continue to Checkout` |
| Sheet Close | `outline` | `default` | `Close` |

---

## Color Palette Reference

### From badge.tsx Variants

```typescript
// Primary
"default":           "border-transparent bg-primary text-primary-foreground"

// Secondary
"secondary":         "border-transparent bg-secondary text-secondary-foreground"

// Status Colors
"success":           "border-transparent bg-green-500 text-white"
"destructive":       "border-transparent bg-destructive text-white"
"warning":           "border-transparent bg-amber-500 text-white"
"info":              "border-transparent bg-blue-500 text-white"

// Food Types
"veg":               "border-transparent bg-green-600 text-white"      // Vegetarian
"nonveg":            "border-transparent bg-red-600 text-white"        // Non-Vegetarian
"offer":             "border-transparent bg-purple-500 text-white"     // Special Offer
"popular":           "border-transparent bg-orange-500 text-white"     // Popular
"spicy":             "border-transparent bg-red-500 text-white"        // Spicy

// Muted
"muted":             "border-transparent bg-muted text-muted-foreground"
"outline":           "text-foreground"
```

---

## Responsive Design Classes

### For Product Item Layout

```tsx
// Mobile first approach
<div className="flex flex-col gap-2">           {/* Mobile: stacked */}
  <div>Product name and description</div>
  <div>Action buttons</div>
</div>

// Or for horizontal on larger screens
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
  <div>Product info</div>
  <div>Action buttons</div>
</div>

// Button sizes by screen
<Button size="sm" className="text-xs sm:text-sm">
  {/* Smaller text on mobile, normal on tablet+ */}
</Button>

// Badge sizes by screen
<Badge size="sm" className="text-[10px] sm:text-xs">
  {/* Smaller on mobile */}
</Badge>
```

### Dialog vs Sheet by Screen Size

```tsx
import { useMediaQuery } from "@/hooks/use-media-query"

function CustomizationModal(props) {
  const isMobile = useMediaQuery("(max-width: 768px)")  // md breakpoint

  if (isMobile) {
    return <CustomizationSheet {...props} side="bottom" />
  }

  return <CustomizationDialog {...props} />
}
```

---

## Common Props Reference

### Card Props
```typescript
className?: string          // Additional classes
children?: React.ReactNode  // Card sections
```

### Badge Props
```typescript
variant?: "default" | "secondary" | "destructive" | "outline" | "veg" | "nonveg" | ...
size?: "sm" | "default" | "lg"
className?: string
children?: React.ReactNode
```

### Button Props
```typescript
variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
loading?: boolean
disabled?: boolean
onClick?: () => void
children?: React.ReactNode
```

### Dialog Props
```typescript
open?: boolean
onOpenChange?: (open: boolean) => void
children?: React.ReactNode
showCloseButton?: boolean    // DialogContent prop
```

### Sheet Props
```typescript
open?: boolean
onOpenChange?: (open: boolean) => void
side?: "top" | "right" | "bottom" | "left"
children?: React.ReactNode
```

### Checkbox Props
```typescript
checked?: boolean
onCheckedChange?: (checked: boolean) => void
disabled?: boolean
id?: string
```

### Label Props
```typescript
htmlFor?: string
className?: string
children?: React.ReactNode
```

---

## Import All Components at Once

```typescript
// All combo-related imports in one place
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
```

---

## Custom Component File Structure

```
components/
└── combo/
    ├── combo-group-card.tsx              // Main group container
    ├── combo-product-item.tsx            // Individual product row
    ├── customization-dialog.tsx          // Desktop modal
    ├── customization-sheet.tsx           // Mobile drawer
    ├── combo-validation-alert.tsx        // Error/success alert
    ├── types.ts                          // TypeScript interfaces
    └── index.ts                          // Barrel export
```

### Barrel Export Example (index.ts)

```typescript
export { default as ComboGroupCard } from "./combo-group-card"
export { default as ComboProductItem } from "./combo-product-item"
export { default as CustomizationDialog } from "./customization-dialog"
export { default as CustomizationSheet } from "./customization-sheet"
export { default as ComboValidationAlert } from "./combo-validation-alert"

export type * from "./types"
```

### Usage After Barrel Export

```typescript
import {
  ComboGroupCard,
  ComboProductItem,
  CustomizationDialog,
} from "@/components/combo"
```

---

## Copy-Paste Ready Code Blocks

### Combo Group Container
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

export default function ComboGroupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your First Pizza</CardTitle>
        <CardDescription>Select your first 9 inch pizza</CardDescription>
        <CardAction>
          <Badge variant="secondary">[0/1]</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Product items go here */}
      </CardContent>
    </Card>
  )
}
```

### Product Item Template
```tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ComboProductItem() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Margherita Pizza</h4>
          <Badge variant="veg" size="sm">Veg</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Classic tomato and mozzarella</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="success">Selected 1</Badge>
        <Button variant="ghost" size="sm">Customize</Button>
      </div>
    </div>
  )
}
```

### Dialog Template
```tsx
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CustomizationDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Pizza</DialogTitle>
          <DialogDescription>Select toppings</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="addon-1" />
            <Label htmlFor="addon-1">Extra Cheese</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Quick TypeScript Interface Templates

```typescript
// Combo item data
interface ComboProduct {
  id: string
  name: string
  description?: string
  price: number
  vegetarian: boolean
}

// Combo group data
interface ComboGroup {
  id: string
  label: string
  description: string
  required: number
  products: ComboProduct[]
}

// Selected item in form
interface SelectedComboItem {
  groupId: string
  productId: string
  selectedAddons: string[]
}

// Validation error
interface ValidationError {
  groupId: string
  message: string
  required: number
  current: number
}
```

---

**Document Version**: 1.0
**Last Updated**: January 5, 2026
**Purpose**: Quick Reference for Component Mapping & Implementation
