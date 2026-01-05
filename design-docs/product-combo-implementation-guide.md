# Product Combo Feature - Implementation Guide

**Date**: January 5, 2026
**Status**: Ready for Development
**Type**: UI Component Integration Guide

---

## Quick Start Checklist

- [x] All required components are installed
- [x] Component APIs documented
- [x] Custom component patterns provided
- [x] Responsive strategy defined
- [x] Accessibility requirements documented
- [ ] Create `components/combo/` directory
- [ ] Implement custom components
- [ ] Add state management
- [ ] Test responsive behavior
- [ ] Add animations (optional)

---

## Visual Design Pattern

### Desktop View (md and up)

```
┌─────────────────────────────────────────────────────────────┐
│ Choose Your First Pizza                             [0/1]   │
│ Select your first 9 inch pizza                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Margherita Pizza (Veg) ..................... [Selected 1]   │
│ Classic tomato and mozzarella             [Customize]      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Pepperoni Pizza (Non-Veg) .................... [+ Add]     │
│ Pepperoni and mozzarella                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Veggie Supreme (Veg) ......................... [+ Add]     │
│ Mixed vegetables and mozzarella                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (sm and down)

```
┌─────────────────────────────────────┐
│ Choose Your First Pizza    [0/1]   │
│ Select your first 9 inch pizza      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Margherita Pizza     [Selected 1]  │
│ Tomato & mozzarella  [Customize]   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Pepperoni Pizza       [+ Add]      │
│ Pepperoni & mozzarella             │
└─────────────────────────────────────┘
```

---

## Component Composition Examples

### Example 1: Full Combo Selection UI

```tsx
import { useState } from "react"
import ComboGroupCard from "@/components/combo/combo-group-card"
import ComboValidationAlert from "@/components/combo/combo-validation-alert"

interface SelectedItem {
  productId: string
  quantity: number
  selectedAddons: string[]
}

interface ComboState {
  [groupId: string]: SelectedItem[]
}

export default function ComboSelection() {
  const [selections, setSelections] = useState<ComboState>({})
  const [validationErrors, setValidationErrors] = useState<Array<{
    groupId: string
    message: string
    required: number
    current: number
  }>>([])

  const comboGroups = [
    {
      id: "group-1",
      label: "Choose Your First Pizza",
      description: "Select your first 9 inch pizza",
      required: 1,
      items: [
        {
          id: "pizza-1",
          name: "Margherita Pizza",
          description: "Classic tomato and mozzarella",
          vegetarian: true,
          price: 8.99,
        },
        {
          id: "pizza-2",
          name: "Pepperoni Pizza",
          description: "Pepperoni and mozzarella",
          vegetarian: false,
          price: 9.99,
        },
      ],
    },
    {
      id: "group-2",
      label: "Choose Your Second Pizza",
      description: "Select your second 9 inch pizza",
      required: 1,
      items: [
        {
          id: "pizza-3",
          name: "Veggie Supreme",
          description: "Mixed vegetables and mozzarella",
          vegetarian: true,
          price: 9.99,
        },
      ],
    },
  ]

  const handleItemSelect = (groupId: string, itemId: string, quantity: number) => {
    setSelections(prev => ({
      ...prev,
      [groupId]: [
        {
          productId: itemId,
          quantity,
          selectedAddons: [],
        },
      ],
    }))
    validateSelections()
  }

  const handleCustomize = (groupId: string, itemId: string) => {
    // Open customization dialog/sheet
    console.log(`Customize ${itemId} in group ${groupId}`)
  }

  const validateSelections = () => {
    const errors = comboGroups
      .map(group => {
        const selectedCount = selections[group.id]?.length || 0
        if (selectedCount < group.required) {
          return {
            groupId: group.id,
            message: `${group.label}: Select ${group.required - selectedCount} more`,
            required: group.required,
            current: selectedCount,
          }
        }
        return null
      })
      .filter(Boolean) as any[]

    setValidationErrors(errors)
    return errors.length === 0
  }

  return (
    <div className="space-y-4">
      <ComboValidationAlert errors={validationErrors} />

      {comboGroups.map(group => (
        <ComboGroupCard
          key={group.id}
          id={group.id}
          label={group.label}
          description={group.description}
          required={group.required}
          items={group.items}
          selectedCount={selections[group.id]?.length || 0}
          onItemSelect={(itemId, qty) => handleItemSelect(group.id, itemId, qty)}
          onCustomize={(itemId) => handleCustomize(group.id, itemId)}
        />
      ))}

      <button
        onClick={() => {
          if (validateSelections()) {
            console.log("All items selected, proceed to checkout")
          }
        }}
        className="w-full"
      >
        Continue to Checkout
      </button>
    </div>
  )
}
```

---

## Component Implementation Templates

### Template 1: ComboGroupCard

**File**: `components/combo/combo-group-card.tsx`

```tsx
"use client"

import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ComboProductItem from "./combo-product-item"

export interface ComboProduct {
  id: string
  name: string
  description?: string
  price?: number
  vegetarian?: boolean
}

export interface ComboGroupCardProps {
  id: string
  label: string
  description: string
  required: number
  items: ComboProduct[]
  selectedCount: number
  onItemSelect: (itemId: string, quantity: number) => void
  onCustomize: (itemId: string) => void
}

export default function ComboGroupCard({
  id,
  label,
  description,
  required,
  items,
  selectedCount,
  onItemSelect,
  onCustomize,
}: ComboGroupCardProps) {
  const isComplete = selectedCount >= required

  return (
    <Card className={isComplete ? "border-green-500" : ""}>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Badge
            variant={isComplete ? "success" : "secondary"}
            className="font-mono"
          >
            [{selectedCount}/{required}]
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <ComboProductItem
            key={item.id}
            product={item}
            isSelected={false}
            selectedCount={0}
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

### Template 2: ComboProductItem

**File**: `components/combo/combo-product-item.tsx`

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface ComboProductItemProps {
  product: {
    id: string
    name: string
    description?: string
    price?: number
    vegetarian?: boolean
  }
  isSelected: boolean
  selectedCount: number
  onSelect: (quantity: number) => void
  onCustomize: () => void
}

export default function ComboProductItem({
  product,
  isSelected,
  selectedCount,
  onSelect,
  onCustomize,
}: ComboProductItemProps) {
  return (
    <div
      className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:border-primary hover:bg-accent cursor-pointer"
      onClick={() => !isSelected && onSelect(1)}
    >
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate text-sm sm:text-base">
            {product.name}
          </h4>
          {product.vegetarian && (
            <Badge variant="veg" size="sm">
              Veg
            </Badge>
          )}
          {!product.vegetarian && (
            <Badge variant="nonveg" size="sm">
              Non-Veg
            </Badge>
          )}
        </div>
        {product.description && (
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {product.description}
          </p>
        )}
      </div>

      {/* Spacer */}
      <div className="mx-2 hidden sm:block flex-shrink-0 h-1 flex-1 border-b border-dashed border-muted"></div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {isSelected ? (
          <>
            <Badge variant="success" size="sm" className="whitespace-nowrap">
              Selected {selectedCount}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onCustomize()
              }}
              className="text-xs sm:text-sm"
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
            className="text-xs sm:text-sm whitespace-nowrap"
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

### Template 3: CustomizationDialog

**File**: `components/combo/customization-dialog.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface Addon {
  id: string
  name: string
  price?: number
  optional?: boolean
}

export interface CustomizationDialogProps {
  productId: string
  productName: string
  availableAddons: Addon[]
  selectedAddonIds?: string[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (selectedAddonIds: string[]) => void
}

export default function CustomizationDialog({
  productId,
  productName,
  availableAddons,
  selectedAddonIds = [],
  isOpen,
  onOpenChange,
  onSave,
}: CustomizationDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedAddonIds)

  useEffect(() => {
    setSelected(selectedAddonIds)
  }, [selectedAddonIds, isOpen])

  const handleSave = () => {
    onSave(selected)
    onOpenChange(false)
  }

  const totalPrice = availableAddons
    .filter(a => selected.includes(a.id))
    .reduce((sum, a) => sum + (a.price || 0), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize {productName}</DialogTitle>
          <DialogDescription>
            Add toppings, sauces, and extras (optional)
          </DialogDescription>
        </DialogHeader>

        {/* Addon List */}
        <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
          {availableAddons.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No customization options available
            </p>
          ) : (
            availableAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-start gap-3 p-2 rounded hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={`addon-${addon.id}`}
                  checked={selected.includes(addon.id)}
                  onCheckedChange={(checked) => {
                    setSelected(prev =>
                      checked
                        ? [...prev, addon.id]
                        : prev.filter(id => id !== addon.id)
                    )
                  }}
                  className="mt-1"
                />
                <Label
                  htmlFor={`addon-${addon.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{addon.name}</span>
                    {addon.price ? (
                      <Badge variant="secondary" size="sm">
                        +${addon.price.toFixed(2)}
                      </Badge>
                    ) : (
                      <Badge variant="muted" size="sm">
                        Free
                      </Badge>
                    )}
                  </div>
                </Label>
              </div>
            ))
          )}
        </div>

        {/* Total Price */}
        {totalPrice > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Additional cost:</span>
              <span className="font-semibold">+${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

### Template 4: CustomizationSheet (Mobile)

**File**: `components/combo/customization-sheet.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface Addon {
  id: string
  name: string
  price?: number
  optional?: boolean
}

export interface CustomizationSheetProps {
  productId: string
  productName: string
  availableAddons: Addon[]
  selectedAddonIds?: string[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (selectedAddonIds: string[]) => void
}

export default function CustomizationSheet({
  productId,
  productName,
  availableAddons,
  selectedAddonIds = [],
  isOpen,
  onOpenChange,
  onSave,
}: CustomizationSheetProps) {
  const [selected, setSelected] = useState<string[]>(selectedAddonIds)

  useEffect(() => {
    setSelected(selectedAddonIds)
  }, [selectedAddonIds, isOpen])

  const handleSave = () => {
    onSave(selected)
    onOpenChange(false)
  }

  const totalPrice = availableAddons
    .filter(a => selected.includes(a.id))
    .reduce((sum, a) => sum + (a.price || 0), 0)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-lg"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Customize {productName}</SheetTitle>
          <SheetDescription>
            Add toppings, sauces, and extras (optional)
          </SheetDescription>
        </SheetHeader>

        {/* Addon List */}
        <div className="space-y-3 py-4 max-h-[50vh] overflow-y-auto">
          {availableAddons.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No customization options available
            </p>
          ) : (
            availableAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-start gap-3 p-2 rounded hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={`addon-sheet-${addon.id}`}
                  checked={selected.includes(addon.id)}
                  onCheckedChange={(checked) => {
                    setSelected(prev =>
                      checked
                        ? [...prev, addon.id]
                        : prev.filter(id => id !== addon.id)
                    )
                  }}
                  className="mt-1"
                />
                <Label
                  htmlFor={`addon-sheet-${addon.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{addon.name}</span>
                    {addon.price ? (
                      <Badge variant="secondary" size="sm">
                        +${addon.price.toFixed(2)}
                      </Badge>
                    ) : (
                      <Badge variant="muted" size="sm">
                        Free
                      </Badge>
                    )}
                  </div>
                </Label>
              </div>
            ))
          )}
        </div>

        {/* Total Price */}
        {totalPrice > 0 && (
          <div className="border-t pt-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Additional cost:</span>
              <span className="font-semibold">+${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <SheetFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
          >
            Save ({selected.length})
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

---

### Template 5: ComboValidationAlert

**File**: `components/combo/combo-validation-alert.tsx`

```tsx
"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export interface ValidationError {
  groupId: string
  message: string
  required: number
  current: number
}

export interface ComboValidationAlertProps {
  errors: ValidationError[]
}

export default function ComboValidationAlert({
  errors,
}: ComboValidationAlertProps) {
  if (errors.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          All required items selected. Ready to proceed!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          {errors.map((error) => (
            <div key={error.groupId} className="flex items-center justify-between">
              <span>{error.message}</span>
              <span className="text-xs opacity-70">
                ({error.current}/{error.required})
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
```

---

## State Management Pattern

### Recommended Structure

```typescript
// types/combo.ts
export interface ComboProduct {
  id: string
  name: string
  description?: string
  price: number
  vegetarian: boolean
  imageUrl?: string
}

export interface ComboAddon {
  id: string
  name: string
  price: number
  optional: boolean
}

export interface ComboGroup {
  id: string
  label: string
  description: string
  required: number
  products: ComboProduct[]
  customizable: boolean
}

export interface SelectedComboItem {
  groupId: string
  productId: string
  quantity: number
  selectedAddons: string[]
  customizationDetails?: Record<string, any>
}

export interface ComboState {
  selectedItems: SelectedComboItem[]
  validationErrors: Array<{
    groupId: string
    message: string
    required: number
    current: number
  }>
  isValid: boolean
}
```

### React Context Hook Example

```typescript
// hooks/useComboSelection.ts
import { useState, useCallback } from "react"
import { ComboState, SelectedComboItem } from "@/types/combo"

export function useComboSelection(groups: ComboGroup[]) {
  const [state, setState] = useState<ComboState>({
    selectedItems: [],
    validationErrors: [],
    isValid: false,
  })

  const selectItem = useCallback(
    (groupId: string, productId: string, addons: string[] = []) => {
      setState(prev => {
        // Remove existing selection from this group
        const filtered = prev.selectedItems.filter(item => item.groupId !== groupId)

        // Add new selection
        const updated = [
          ...filtered,
          {
            groupId,
            productId,
            quantity: 1,
            selectedAddons: addons,
          },
        ]

        return {
          ...prev,
          selectedItems: updated,
        }
      })

      validateSelections()
    },
    [groups]
  )

  const validateSelections = useCallback(() => {
    const errors = groups
      .map(group => {
        const selectedCount = state.selectedItems.filter(
          item => item.groupId === group.id
        ).length

        if (selectedCount < group.required) {
          return {
            groupId: group.id,
            message: `${group.label}: Select ${group.required - selectedCount} more`,
            required: group.required,
            current: selectedCount,
          }
        }

        return null
      })
      .filter(Boolean)

    setState(prev => ({
      ...prev,
      validationErrors: errors as any,
      isValid: errors.length === 0,
    }))

    return errors.length === 0
  }, [groups, state.selectedItems])

  return {
    state,
    selectItem,
    validateSelections,
  }
}
```

---

## Responsive Design Implementation

### Breakpoints & Behavior

```typescript
// Tailwind breakpoints mapping
// sm:  640px  - Mobile
// md:  768px  - Tablet
// lg:  1024px - Desktop
// xl:  1280px - Large Desktop

// Product item layout adjustments
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
  {/* Mobile: stacked */}
  {/* Tablet+: horizontal */}
</div>

// Button sizes
<Button size="sm" className="text-xs sm:text-sm">
  {/* Smaller on mobile, regular on tablet+ */}
</Button>

// Dialog/Sheet strategy
// md+: Dialog component (centered modal)
// sm: Sheet component (bottom drawer)

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

// Usage in component
function ComboDialog({ isOpen, onOpenChange, ...props }) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return isMobile ? (
    <CustomizationSheet isOpen={isOpen} onOpenChange={onOpenChange} {...props} />
  ) : (
    <CustomizationDialog isOpen={isOpen} onOpenChange={onOpenChange} {...props} />
  )
}
```

---

## Form Integration Example

```tsx
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const comboSchema = z.object({
  comboId: z.string(),
  selectedItems: z.array(
    z.object({
      groupId: z.string(),
      productId: z.string(),
      quantity: z.number().min(1),
      selectedAddons: z.array(z.string()),
    })
  ),
})

type ComboFormData = z.infer<typeof comboSchema>

export function ComboForm() {
  const form = useForm<ComboFormData>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      comboId: "combo-123",
      selectedItems: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "selectedItems",
  })

  async function onSubmit(data: ComboFormData) {
    try {
      // Validate all groups are complete
      const response = await fetch("/api/combo/validate", {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Proceed to checkout
        router.push("/checkout")
      }
    } catch (error) {
      console.error("Submission error:", error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Combo groups */}
      <button type="submit">Continue to Checkout</button>
    </form>
  )
}
```

---

## Animation Enhancement (Optional)

```tsx
import { motion, AnimatePresence } from "framer-motion"

export function ComboProductItem(props) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <motion.div
      layout
      transition={{ duration: 0.2 }}
      className="..."
    >
      <AnimatePresence mode="wait">
        {isSelected ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Badge variant="success">Selected</Badge>
            <Button>Customize</Button>
          </motion.div>
        ) : (
          <motion.div
            key="unselected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button>+ Add</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

---

## Common Implementation Issues & Solutions

### Issue 1: Selection State Not Updating

**Problem**: Clicking "Select" button doesn't update the component

**Solution**:
```tsx
// Ensure state is updated before component re-renders
const handleSelect = useCallback((itemId: string) => {
  setSelections(prev => ({
    ...prev,
    [groupId]: [{ productId: itemId, quantity: 1, selectedAddons: [] }],
  }))
}, [groupId])

// Pass to child component
<ComboProductItem
  isSelected={selections[groupId]?.[0]?.productId === itemId}
  onSelect={() => handleSelect(itemId)}
/>
```

### Issue 2: Dialog Not Opening/Closing

**Problem**: Dialog stays open or doesn't open

**Solution**:
```tsx
const [isDialogOpen, setIsDialogOpen] = useState(false)

// Ensure controlled component
<CustomizationDialog
  isOpen={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  onSave={(addons) => {
    updateAddons(addons)
    setIsDialogOpen(false) // Explicit close
  }}
/>
```

### Issue 3: Validation Not Triggering

**Problem**: Validation alert doesn't appear when items are missing

**Solution**:
```tsx
// Call validation after every selection change
const handleItemSelect = useCallback((itemId: string) => {
  setSelections(prev => ({...}))
  // Validate immediately after state update
  setTimeout(() => validateSelections(), 0)
}, [])
```

### Issue 4: Mobile Responsiveness Issues

**Problem**: Dialog shows instead of Sheet on mobile

**Solution**:
```tsx
// Use useMediaQuery hook or responsive component wrapper
const isMobile = useMediaQuery("(max-width: 768px)")

return isMobile ? <CustomizationSheet /> : <CustomizationDialog />
```

---

## Testing Checklist

### Unit Tests
- [ ] ComboGroupCard renders with correct props
- [ ] Badge displays correct selection count
- [ ] ComboProductItem toggles between selected/unselected states
- [ ] Dialog/Sheet opens and closes properly
- [ ] Addon selection updates state correctly

### Integration Tests
- [ ] Full combo selection flow works end-to-end
- [ ] Validation correctly identifies incomplete groups
- [ ] Form submission includes selected items
- [ ] Mobile/desktop responsive behavior works

### Manual Testing
- [ ] Desktop: Dialog opens for customization
- [ ] Mobile (< 768px): Sheet opens instead
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces selections correctly
- [ ] All interactions work on touch devices

---

## Performance Optimization Tips

```tsx
// Memoize expensive components
const ComboProductItem = React.memo(function ComboProductItem(props) {
  return /* component JSX */
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.product.id === nextProps.product.id &&
         prevProps.isSelected === nextProps.isSelected
})

// Use useCallback for handlers
const handleItemSelect = useCallback((itemId, quantity) => {
  // Handler logic
}, [dependencies])

// Lazy load customization dialog
const CustomizationDialog = dynamic(() => import('./customization-dialog'), {
  loading: () => <div>Loading...</div>,
})
```

---

## Deployment Checklist

- [ ] All TypeScript types are correct
- [ ] Components are properly exported
- [ ] No console errors or warnings
- [ ] Accessibility testing passed
- [ ] Mobile responsiveness verified
- [ ] Form validation working
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Analytics events tracked
- [ ] Performance metrics acceptable

---

**Document Version**: 1.0
**Last Updated**: January 5, 2026
**Next Review**: Before component implementation
