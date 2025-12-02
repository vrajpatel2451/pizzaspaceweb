# Order Status Variants & Configuration

**Purpose:** Reference guide for implementing consistent status displays across the order management feature.

---

## Badge Variant Mapping

All statuses use shadcn/ui Badge component with appropriate variants:

```typescript
import { Badge } from "@/components/ui/badge"

type OrderStatus =
  | "initiated"
  | "payment_confirmed"
  | "payment_error"
  | "cancelled"
  | "preparing"
  | "ready_to_pickup"
  | "on_the_way"
  | "delivered"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const statusVariantMap: Record<OrderStatus, BadgeVariant> = {
  initiated: "outline",           // Gray outline
  payment_confirmed: "default",   // Green primary
  payment_error: "destructive",   // Red error
  cancelled: "outline",           // Gray outline
  preparing: "secondary",         // Yellow secondary
  ready_to_pickup: "default",     // Blue primary
  on_the_way: "secondary",        // Orange secondary
  delivered: "default",           // Green primary
}
```

---

## Color Configuration

### Detailed Color Mapping

```typescript
const statusColorConfig = {
  initiated: {
    badge: {
      variant: "outline",
      className: "text-gray-700 border-gray-300",
    },
    bg: {
      light: "bg-gray-50",
      medium: "bg-gray-100",
      dark: "bg-gray-200",
    },
    text: "text-gray-700",
    icon: "text-gray-600",
    description: "Order received, awaiting confirmation",
  },

  payment_confirmed: {
    badge: {
      variant: "default",
      className: "bg-green-600 text-white",
    },
    bg: {
      light: "bg-green-50",
      medium: "bg-green-100",
      dark: "bg-green-200",
    },
    text: "text-green-700",
    icon: "text-green-600",
    description: "Payment verified, preparing order",
  },

  payment_error: {
    badge: {
      variant: "destructive",
      className: "bg-red-600 text-white",
    },
    bg: {
      light: "bg-red-50",
      medium: "bg-red-100",
      dark: "bg-red-200",
    },
    text: "text-red-700",
    icon: "text-red-600",
    description: "Payment failed, please retry",
  },

  cancelled: {
    badge: {
      variant: "outline",
      className: "text-slate-600 border-slate-300",
    },
    bg: {
      light: "bg-slate-50",
      medium: "bg-slate-100",
      dark: "bg-slate-200",
    },
    text: "text-slate-600",
    icon: "text-slate-500",
    description: "Order has been cancelled",
  },

  preparing: {
    badge: {
      variant: "secondary",
      className: "bg-yellow-600 text-white",
    },
    bg: {
      light: "bg-yellow-50",
      medium: "bg-yellow-100",
      dark: "bg-yellow-200",
    },
    text: "text-yellow-700",
    icon: "text-yellow-600",
    description: "Your pizza is being prepared",
  },

  ready_to_pickup: {
    badge: {
      variant: "default",
      className: "bg-blue-600 text-white",
    },
    bg: {
      light: "bg-blue-50",
      medium: "bg-blue-100",
      dark: "bg-blue-200",
    },
    text: "text-blue-700",
    icon: "text-blue-600",
    description: "Ready for pickup or dispatch",
  },

  on_the_way: {
    badge: {
      variant: "secondary",
      className: "bg-orange-600 text-white",
    },
    bg: {
      light: "bg-orange-50",
      medium: "bg-orange-100",
      dark: "bg-orange-200",
    },
    text: "text-orange-700",
    icon: "text-orange-600",
    description: "Your order is on the way",
  },

  delivered: {
    badge: {
      variant: "default",
      className: "bg-emerald-600 text-white",
    },
    bg: {
      light: "bg-emerald-50",
      medium: "bg-emerald-100",
      dark: "bg-emerald-200",
    },
    text: "text-emerald-700",
    icon: "text-emerald-600",
    description: "Order has been delivered",
  },
}
```

---

## Icon Mapping

Using Lucide React icons (already in project):

```typescript
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChefHat,
  Package,
  Truck,
  Home,
} from "lucide-react"

const statusIconMap = {
  initiated: Clock,           // Waiting for confirmation
  payment_confirmed: CheckCircle,  // Payment accepted
  payment_error: AlertCircle,      // Payment issue
  cancelled: XCircle,         // Order cancelled
  preparing: ChefHat,        // Being prepared
  ready_to_pickup: Package,   // Ready
  on_the_way: Truck,         // In transit
  delivered: Home,           // Delivered
}
```

---

## Display Label Mapping

```typescript
const statusLabelMap: Record<OrderStatus, string> = {
  initiated: "Order Initiated",
  payment_confirmed: "Payment Confirmed",
  payment_error: "Payment Failed",
  cancelled: "Cancelled",
  preparing: "Preparing",
  ready_to_pickup: "Ready for Pickup",
  on_the_way: "On the Way",
  delivered: "Delivered",
}
```

---

## Component Implementation Example

```typescript
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: OrderStatus
  showLabel?: boolean
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function OrderStatusBadge({
  status,
  showLabel = true,
  showIcon = true,
  size = "md",
}: OrderStatusBadgeProps) {
  const config = statusColorConfig[status]
  const IconComponent = statusIconMap[status]
  const label = statusLabelMap[status]

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <Badge variant={config.badge.variant} className={sizeClasses[size]}>
      <div className="flex items-center gap-2">
        {showIcon && <IconComponent className="h-4 w-4" />}
        {showLabel && label}
      </div>
    </Badge>
  )
}
```

---

## Timeline Step Configuration

For the custom OrderTracking component:

```typescript
interface TimelineStep {
  id: string
  name: string
  status: OrderStatus
  timestamp: string // ISO string or formatted string
  isCompleted: boolean
  isActive?: boolean
}

const orderTimelineSteps: TimelineStep[] = [
  {
    id: "1",
    name: "Order Confirmed",
    status: "payment_confirmed",
    timestamp: new Date().toISOString(),
    isCompleted: true,
    isActive: false,
  },
  {
    id: "2",
    name: "Preparing",
    status: "preparing",
    timestamp: new Date().toISOString(),
    isCompleted: true,
    isActive: true,
  },
  {
    id: "3",
    name: "On the Way",
    status: "on_the_way",
    timestamp: "Pending",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "4",
    name: "Delivered",
    status: "delivered",
    timestamp: "Pending",
    isCompleted: false,
    isActive: false,
  },
]
```

---

## Status Flow Diagram

```
initiated
    ↓
payment_confirmed (or payment_error → retry)
    ↓
preparing
    ↓
ready_to_pickup
    ↓
on_the_way
    ↓
delivered

Alternative:
Any status → cancelled
```

---

## CSS Classes by Status

For background highlighting in cards/sections:

```typescript
const statusBgClasses: Record<OrderStatus, string> = {
  initiated: "bg-gray-50 border-gray-200",
  payment_confirmed: "bg-green-50 border-green-200",
  payment_error: "bg-red-50 border-red-200",
  cancelled: "bg-slate-50 border-slate-200",
  preparing: "bg-yellow-50 border-yellow-200",
  ready_to_pickup: "bg-blue-50 border-blue-200",
  on_the_way: "bg-orange-50 border-orange-200",
  delivered: "bg-emerald-50 border-emerald-200",
}

// Usage in card
<div className={cn("p-4 rounded-lg", statusBgClasses[status])}>
  {/* Card content */}
</div>
```

---

## Dark Mode Support

All colors use Tailwind's automatic dark mode variants:

```typescript
// Automatically handles light/dark via Tailwind
<div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
  {/* Content */}
</div>
```

---

## Animation States

For status transitions:

```typescript
const animationConfig = {
  initiated: {
    animation: "none",
    description: "Static state",
  },
  payment_confirmed: {
    animation: "animate-in fade-in duration-300",
    description: "Fade in smoothly",
  },
  payment_error: {
    animation: "animate-pulse",
    description: "Pulse to draw attention",
  },
  preparing: {
    animation: "animate-pulse",
    description: "Pulse indicator for active work",
  },
  ready_to_pickup: {
    animation: "animate-in scale-in-95 duration-300",
    description: "Scale in for attention",
  },
  on_the_way: {
    animation: "animate-in slide-in-from-left duration-500",
    description: "Slide in from left (directional)",
  },
  delivered: {
    animation: "animate-in bounce-in duration-500",
    description: "Bounce in for celebration",
  },
}
```

---

## Tailwind Color Palette Reference

```
Gray:     gray-50, gray-100, gray-200, gray-700
Green:    green-50, green-100, green-200, green-600, green-700
Red:      red-50, red-100, red-200, red-600, red-700
Yellow:   yellow-50, yellow-100, yellow-200, yellow-600, yellow-700
Blue:     blue-50, blue-100, blue-200, blue-600, blue-700
Orange:   orange-50, orange-100, orange-200, orange-600, orange-700
Emerald:  emerald-50, emerald-100, emerald-200, emerald-600, emerald-700
Slate:    slate-50, slate-100, slate-200, slate-600
```

---

## Usage Examples

### In Order Card
```tsx
<OrderCard order={order}>
  <div className="flex items-center justify-between">
    <h3>{order.storeName}</h3>
    <OrderStatusBadge status={order.status} />
  </div>
</OrderCard>
```

### In Timeline
```tsx
<OrderTracking
  steps={order.timeline.map(step => ({
    name: statusLabelMap[step.status],
    timestamp: step.timestamp,
    isCompleted: step.isCompleted,
  }))}
/>
```

### In Filter
```tsx
<ToggleGroup type="multiple">
  {Object.entries(statusLabelMap).map(([key, label]) => (
    <ToggleGroupItem key={key} value={key}>
      {label}
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```

---

## Accessibility Notes

1. **Color Alone:** Never rely on color alone to convey status
2. **Icons + Text:** Always pair colors with icons and labels
3. **Contrast:** All combinations meet WCAG AA standards
4. **Semantic HTML:** Use badge variant system correctly
5. **Screen Readers:** Ensure status labels are announced

---

**Version:** 1.0
**Last Updated:** December 2, 2025
**Related Files:** component-research.md, SUMMARY.md
