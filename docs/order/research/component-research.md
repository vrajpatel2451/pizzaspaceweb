# Order Management Component Research

**Project:** PizzaSpace Web (Next.js 16, React 19)
**Research Date:** December 2, 2025
**Style:** shadcn/ui New York
**Status:** Complete

---

## Executive Summary

This document provides comprehensive research on shadcn/ui and 21st.dev components for implementing a premium order management feature in the PizzaSpace delivery application. The research covers 5 core component categories needed for order tracking, filtering, display, status indication, and error handling.

**Key Findings:**
- All required components are available from the @shadcn registry
- 21st.dev offers enhanced animated versions for premium polish
- Single installation command covers all shadcn dependencies
- Custom implementations needed for order-specific timeline/stepper (not in @shadcn registry)
- Multiple animation libraries available for enhanced UX

---

## 1. Status Timeline/Stepper Components

### Category
Order Progress Visualization

### 1.1 shadcn/ui Progress Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-progress

#### Installation
```bash
npx shadcn@latest add @shadcn/progress
```

#### Component API
```typescript
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number // 0-100
}

<Progress value={progress} className="w-[60%]" />
```

#### Key Features
- Simple linear progress bar
- CSS-based animations
- Customizable width and color via Tailwind
- Accessible with ARIA attributes

#### Use Case
Basic progress indication for order completion percentage.

#### Example Usage
```tsx
"use client"
import React, { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export function OrderProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-full" />
}
```

---

### 1.2 Custom Order Tracking Timeline (21st.dev Alternative)

**Source:** 21st.dev Component Library
**Component Name:** Order Tracking
**Status:** Premium Alternative

#### Features
- Vertical timeline with connected steps
- Completed step checkmarks
- Pending step indicators
- Timestamps for each step
- Animated connection lines
- Status-based color coding

#### Implementation Code
```typescript
"use client"

import * as React from "react"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OrderTrackingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    name: string
    timestamp: string
    isCompleted: boolean
  }[]
}

const OrderTracking = React.forwardRef<HTMLDivElement, OrderTrackingProps>(
  ({ steps = [], className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full max-w-md", className)} {...props}>
        {steps.length > 0 ? (
          <div>
            {steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center">
                  {step.isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-primary/70" />
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-muted-foreground" />
                  )}
                  {index < steps.length - 1 && (
                    <div
                      className={cn("w-[1.5px] grow", {
                        "bg-primary/70": steps[index + 1].isCompleted,
                        "bg-muted-foreground": !steps[index + 1].isCompleted,
                      })}
                    />
                  )}
                </div>
                <div className="ml-3 pb-6">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/80">
            This order has no tracking information.
          </p>
        )}
      </div>
    )
  }
)
OrderTracking.displayName = "OrderTracking"

export { OrderTracking }
```

#### Example Usage
```tsx
import { OrderTracking } from "@/components/ui/order-tracking"

export function OrderTrackingDemo() {
  const demoSteps = [
    {
      name: "Confirmed",
      timestamp: "2024-03-20 14:23",
      isCompleted: true,
    },
    {
      name: "Preparing",
      timestamp: "2024-03-20 14:30",
      isCompleted: true,
    },
    {
      name: "On the Way",
      timestamp: "2024-03-21 09:45",
      isCompleted: false,
    },
    {
      name: "Delivered",
      timestamp: "Pending",
      isCompleted: false,
    },
  ]

  return <OrderTracking steps={demoSteps} />
}
```

#### Key Props
- `steps`: Array of step objects with name, timestamp, and completion status
- `className`: Additional Tailwind classes

#### Animation Features
- Smooth checkmark transitions
- Line color changes based on step completion
- Timestamp display below each step

#### Notes
- Lightweight, no animation library required
- Perfect for vertical order status display
- Easily customizable colors and sizing
- Accessible with semantic HTML

---

## 2. Filter Components

### Category
Order History Filtering

### 2.1 Select Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-select, cmdk (for search)

#### Installation
```bash
npx shadcn@latest add @shadcn/select
```

#### Component API
```typescript
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

#### Key Features
- Accessible dropdown using Radix UI
- Search/filter capability
- Grouping support
- Keyboard navigation
- Mobile-friendly

#### Use Case
Time range filter (All Time, Last 7 Days, Last 30 Days, etc.)

#### Example Usage for Order Filtering
```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TimeRangeFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Range</SelectLabel>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="last-7">Last 7 Days</SelectItem>
          <SelectItem value="last-30">Last 30 Days</SelectItem>
          <SelectItem value="last-90">Last 90 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

---

### 2.2 Toggle Group Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-toggle-group

#### Installation
```bash
npx shadcn@latest add @shadcn/toggle-group
```

#### Component API
```typescript
<ToggleGroup variant="outline" type="multiple">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>
```

#### Key Features
- Multi-select toggle buttons
- Single-select variant support
- Icon or text-based toggles
- Outline and solid variants
- Keyboard accessible

#### Use Case
Status filter multi-select (initiated, confirmed, preparing, on_the_way, delivered, cancelled)

#### Example Usage for Status Filter
```tsx
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { CheckCircle, Clock, Truck, Home, AlertCircle } from "lucide-react"

export function StatusFilter() {
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="initiated" aria-label="Initiated">
        <Clock className="h-4 w-4 mr-2" />
        Initiated
      </ToggleGroupItem>
      <ToggleGroupItem value="payment_confirmed" aria-label="Confirmed">
        <CheckCircle className="h-4 w-4 mr-2" />
        Confirmed
      </ToggleGroupItem>
      <ToggleGroupItem value="preparing" aria-label="Preparing">
        <AlertCircle className="h-4 w-4 mr-2" />
        Preparing
      </ToggleGroupItem>
      <ToggleGroupItem value="on_the_way" aria-label="On the Way">
        <Truck className="h-4 w-4 mr-2" />
        On the Way
      </ToggleGroupItem>
      <ToggleGroupItem value="delivered" aria-label="Delivered">
        <Home className="h-4 w-4 mr-2" />
        Delivered
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
```

---

### 2.3 Enhanced Filter Component (21st.dev Premium)

**Source:** 21st.dev Component Library
**Component Name:** Advanced Filters
**Status:** Premium Alternative with Animation

#### Features
- Complex multi-filter system
- Animated height changes
- Filter condition operators
- Date range filtering
- Multi-value selection
- Responsive design
- Smooth state transitions

#### Use Case
Advanced filtering with operators (is, is not, before, after, includes, etc.)

#### Key Capabilities
- Status filters
- Date filters (created, updated, due dates)
- Custom operator selection
- Visual icon indicators
- Filter pill display with removal
- Smooth animations

#### Installation Notes
For the premium animated filter component, you would implement using framer-motion for smooth height animations and state management.

---

### 2.4 Animated Selector Chips (21st.dev Premium)

**Source:** 21st.dev Component Library
**Component Name:** Selector Chips / Cuisine Selector Chips

#### Features
- Animated chip selection with spring physics
- Multi-select with visual feedback
- Smooth scale and color transitions
- Checkmark animation on selection
- Background color morphing
- Mobile-friendly

#### Example Use Case
Status chip multi-selector for quick filtering.

---

## 3. Card Grid Layouts

### Category
Order History Display

### 3.1 Card Component (Base)

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** None (utility styles only)

#### Installation
```bash
npx shadcn@latest add @shadcn/card
```

#### Component API
```typescript
<Card>
  <CardHeader>
    <CardTitle>Order #12345</CardTitle>
    <CardDescription>Placed on Dec 2, 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Order details here</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

#### Key Features
- Semantic card structure
- Flexible component composition
- Border and shadow styling
- Responsive padding
- Base for complex layouts

#### Example Order Card Implementation
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

export function OrderCard({ order }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Order #{order.id}</CardTitle>
          <CardDescription>{order.date}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Review Order</DropdownMenuItem>
            <DropdownMenuItem>Report Issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Store: {order.store}</p>
          <p className="text-sm font-medium">Amount: ${order.total}</p>
          <Badge variant="secondary">{order.status}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {orders.map((order) => (
    <OrderCard key={order.id} order={order} />
  ))}
</div>
```

---

### 3.2 Animated Card Component (21st.dev Premium)

**Source:** 21st.dev Component Library
**Component Name:** Animated Card
**Status:** Premium with Visual Effects

#### Features
- Layered visual composition
- Grid pattern backgrounds
- Animated gradient overlays
- Hover state animations
- Smooth transitions on interaction
- Built with framer-motion

#### Advanced Implementation
Perfect for showcasing premium order information with rich visual feedback.

---

## 4. Badge / Status Indicators

### Category
Order Status Display

### 4.1 Badge Component (Base)

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-slot

#### Installation
```bash
npx shadcn@latest add @shadcn/badge
```

#### Component API
```typescript
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Default Variants
- `default`: Primary color background
- `secondary`: Secondary background
- `destructive`: Red/error background
- `outline`: Border-only variant

#### Order Status Badge Mapping
```typescript
const statusBadgeConfig = {
  initiated: { variant: "outline", color: "gray" },
  payment_confirmed: { variant: "default", color: "green" },
  payment_error: { variant: "destructive", color: "red" },
  cancelled: { variant: "outline", color: "gray" },
  preparing: { variant: "secondary", color: "yellow" },
  ready_to_pickup: { variant: "default", color: "blue" },
  on_the_way: { variant: "secondary", color: "orange" },
  delivered: { variant: "default", color: "green" },
}
```

#### Example Order Status Badge
```tsx
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Truck, Home } from "lucide-react"

const statusConfig = {
  initiated: {
    label: "Order Initiated",
    icon: Clock,
    variant: "outline",
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    icon: CheckCircle,
    variant: "default",
  },
  payment_error: {
    label: "Payment Failed",
    icon: AlertCircle,
    variant: "destructive",
  },
  preparing: {
    label: "Preparing",
    icon: AlertCircle,
    variant: "secondary",
  },
  on_the_way: {
    label: "On the Way",
    icon: Truck,
    variant: "secondary",
  },
  delivered: {
    label: "Delivered",
    icon: Home,
    variant: "default",
  },
}

export function OrderStatusBadge({ status }) {
  const config = statusConfig[status]
  const IconComponent = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
```

---

### 4.2 Animated Status Badge (21st.dev Premium)

**Source:** 21st.dev Component Library
**Component Name:** Animated Status Badge

#### Features
- Running state with spinner animation
- Completion state with checkmark
- Smooth state transitions
- Color-coded backgrounds
- Auto-reset capability
- Reusable across components

#### Implementation
```typescript
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check } from "lucide-react"

interface AnimatedStatusBadgeProps {
  trigger: boolean
  onAnimationComplete?: () => void
  className?: string
}

export function AnimatedStatusBadge({
  trigger,
  onAnimationComplete,
  className = "",
}: AnimatedStatusBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true)
      setIsCompleted(false)
      setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          setIsCompleted(true)
          setTimeout(() => {
            setIsCompleted(false)
            onAnimationComplete?.()
          }, 3000)
        }, 300)
      }, 3000)
    }
  }, [trigger])

  return (
    <>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className={`bg-yellow-100 text-yellow-600 text-xs font-medium px-2.5 py-0.5 rounded flex items-center space-x-1 ${className}`}
            initial={{ y: 40, opacity: 1 }}
            animate={{ y: -32, opacity: 1 }}
            exit={{ y: [- 37, 40], opacity: [1, 1, 0] }}
          >
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            <span>Running</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            className={`bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded flex items-center space-x-1 ${className}`}
            initial={{ y: 40, opacity: 1 }}
            animate={{ y: -32, opacity: 1 }}
            exit={{ y: [-37, 40], opacity: [1, 1, 0] }}
          >
            <Check className="h-3 w-3 mr-1" />
            <span>Completed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## 5. Collapsible / Accordion Components

### Category
Order Detail Sections

### 5.1 Accordion Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-accordion

#### Installation
```bash
npx shadcn@latest add @shadcn/accordion
```

#### Component API
```typescript
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Product Information</AccordionTrigger>
    <AccordionContent>
      Content here
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Key Features
- Single or multiple open items
- Smooth height animations
- Keyboard accessible
- Semantic HTML structure
- Customizable styling

#### Example Order Details Accordion
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function OrderDetailsAccordion({ order }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="store-details">
        <AccordionTrigger>Store Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="font-medium">{order.storeName}</p>
            <p className="text-sm text-muted-foreground">{order.storeAddress}</p>
            <p className="text-sm text-muted-foreground">
              Phone: {order.storePhone}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rider-details">
        <AccordionTrigger>Rider Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="font-medium">{order.riderName}</p>
            <p className="text-sm text-muted-foreground">
              Phone: {order.riderPhone}
            </p>
            <p className="text-sm text-muted-foreground">
              Vehicle: {order.riderVehicle}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="order-items">
        <AccordionTrigger>Order Items</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">${item.price}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

---

### 5.2 Collapsible Component (Alternative)

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-collapsible

#### Installation
```bash
npx shadcn@latest add @shadcn/collapsible
```

#### Use Case
Simpler, binary open/close for individual sections.

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2">
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}
```

---

## 6. Alert / Banner Components

### Category
Success and Error Notifications

### 6.1 Alert Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** None (styles only)

#### Installation
```bash
npx shadcn@latest add @shadcn/alert
```

#### Component API
```typescript
<Alert>
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description text</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

#### Variants
- `default`: Standard blue/primary
- `destructive`: Red/error state

#### Example Order Result Alerts
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function OrderSuccessAlert() {
  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Order Confirmed!</AlertTitle>
      <AlertDescription>
        Your order has been placed successfully. You'll receive updates as we prepare your pizza.
      </AlertDescription>
    </Alert>
  )
}

export function OrderErrorAlert({ error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Order Failed</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
```

---

### 6.2 Sonner Toast Component (Alternative)

**Registry:** @shadcn/ui
**Type:** Toast/Notification System
**Status:** Modern alternative to alerts

#### Installation
```bash
npx shadcn@latest add @shadcn/sonner
```

#### Features
- Toast notifications
- Auto-dismiss
- Stacking support
- Action buttons
- Success/error/loading states

#### Example Usage
```tsx
import { Toaster, toast } from "sonner"

export function OrderNotifications() {
  return (
    <>
      <Toaster />
      <button
        onClick={() =>
          toast.success("Order placed successfully!", {
            description: "Your pizza will be ready in 30 minutes.",
          })
        }
      >
        Place Order
      </button>
    </>
  )
}
```

---

## 7. Dropdown Menu Components

### Category
Order Actions and Context Menus

### 7.1 Dropdown Menu Component

**Registry:** @shadcn/ui
**Type:** UI Component
**Dependencies:** @radix-ui/react-dropdown-menu

#### Installation
```bash
npx shadcn@latest add @shadcn/dropdown-menu
```

#### Component API
```typescript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>View Details</DropdownMenuItem>
    <DropdownMenuItem>Cancel Order</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Key Features
- Radix UI based
- Accessible keyboard navigation
- Submenu support
- Checkboxes and radio items
- Keyboard shortcuts display

#### Example Order Card Dropdown
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

export function OrderCardActions({ orderId }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleViewDetails(orderId)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleReview(orderId)}>
          Review Order
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleReportIssue(orderId)}
          className="text-destructive"
        >
          Report Problem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 8. Animation Primitives

### Available Animation Libraries

#### 8.1 Framer Motion
Used by many 21st.dev components for smooth transitions.

```bash
npm install framer-motion
```

Capabilities:
- Spring animations
- Gesture controls
- Shared layout animations
- Exit animations
- Variant system

#### 8.2 Motion React
Modern alternative with better TypeScript support.

```bash
npm install motion/react
```

#### 8.3 Tailwind CSS Animations
Built-in animations via Tailwind.

Available animations:
- `animate-spin`: Spinner rotation
- `animate-bounce`: Bouncing effect
- `animate-pulse`: Pulsing opacity
- `animate-ping`: Ping effect

---

## 9. Installation Commands

### Single Installation for All Components

```bash
npx shadcn@latest add @shadcn/progress @shadcn/toggle-group @shadcn/badge @shadcn/accordion @shadcn/alert @shadcn/collapsible @shadcn/select @shadcn/dropdown-menu @shadcn/card
```

### Individual Installations
If you prefer to install components one at a time:

```bash
# Core UI Components
npx shadcn@latest add @shadcn/progress
npx shadcn@latest add @shadcn/toggle-group
npx shadcn@latest add @shadcn/badge
npx shadcn@latest add @shadcn/accordion
npx shadcn@latest add @shadcn/alert
npx shadcn@latest add @shadcn/collapsible
npx shadcn@latest add @shadcn/select
npx shadcn@latest add @shadcn/dropdown-menu
npx shadcn@latest add @shadcn/card

# Optional: Animation Components
npx shadcn@latest add @shadcn/sonner
```

### Animation Library Installation

```bash
npm install framer-motion
# or
npm install motion/react
```

---

## 10. Component Summary Table

| Component | Registry | Type | Key Use Case | Dependencies |
|-----------|----------|------|--------------|--------------|
| Progress | @shadcn | UI | Order completion % | @radix-ui/react-progress |
| Select | @shadcn | UI | Time range filter | @radix-ui/react-select |
| Toggle Group | @shadcn | UI | Status multi-select | @radix-ui/react-toggle-group |
| Badge | @shadcn | UI | Status badges | @radix-ui/react-slot |
| Accordion | @shadcn | UI | Order details sections | @radix-ui/react-accordion |
| Alert | @shadcn | UI | Success/error messages | None |
| Collapsible | @shadcn | UI | Expandable sections | @radix-ui/react-collapsible |
| Dropdown Menu | @shadcn | UI | Order actions | @radix-ui/react-dropdown-menu |
| Card | @shadcn | UI | Grid layout base | None |
| Order Tracking | 21st.dev | Custom | Timeline visualization | lucide-react |
| Advanced Filters | 21st.dev | Premium | Complex filtering | framer-motion |
| Animated Badge | 21st.dev | Premium | Status indicators | framer-motion |

---

## 11. Implementation Best Practices

### Color Scheme for Order Statuses
Based on pizza delivery context:

```typescript
const orderStatusColors = {
  initiated: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    badge: "bg-gray-200 text-gray-800",
  },
  payment_confirmed: {
    bg: "bg-green-100",
    text: "text-green-700",
    badge: "bg-green-200 text-green-800",
  },
  payment_error: {
    bg: "bg-red-100",
    text: "text-red-700",
    badge: "bg-red-200 text-red-800",
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    badge: "bg-gray-200 text-gray-800",
  },
  preparing: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    badge: "bg-yellow-200 text-yellow-800",
  },
  ready_to_pickup: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-200 text-blue-800",
  },
  on_the_way: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    badge: "bg-orange-200 text-orange-800",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    badge: "bg-green-200 text-green-800",
  },
}
```

### Responsive Grid Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Order cards */}
</div>
```

### Accessibility
- Use semantic HTML (card headers, sections)
- Provide ARIA labels for interactive elements
- Ensure keyboard navigation works
- Use color + icon for status indication
- Test with screen readers

---

## 12. Animation Strategy

### Recommended Animation Library
**Framer Motion** is recommended because:
- Used in multiple 21st.dev components
- Excellent spring physics
- Great TypeScript support
- Small bundle size
- Comprehensive documentation

### Animation Patterns for Order Management
1. **Status transitions**: Smooth color/scale changes
2. **Timeline steps**: Staggered animations
3. **Card hover states**: Subtle lift/shadow
4. **Filter updates**: Height/opacity transitions
5. **Badge indicators**: Pulse for active states

---

## 13. Integration Notes

### Next.js 16 Compatibility
All components are fully compatible with:
- App Router
- React 19
- Server Components (with "use client" directive where needed)
- TypeScript strict mode

### Performance Considerations
- Badge components are lightweight (no animation)
- Accordion/Collapsible use CSS transitions (performant)
- Select dropdown uses virtualization for large lists
- Order tracking timeline uses minimal DOM nodes
- Consider lazy loading of 21st.dev animated components

### Bundle Size Impact
- Core shadcn components: ~5-10KB (minified)
- Radix UI dependencies: ~20-30KB
- Framer Motion: ~40KB
- Total estimated: ~70-80KB for all components

---

## 14. Files to Create / Modify

### New Custom Components to Create
1. `/components/ui/order-tracking.tsx` - Timeline component
2. `/components/features/order/order-card.tsx` - Card wrapper
3. `/components/features/order/status-badge.tsx` - Status display
4. `/components/features/order/order-filters.tsx` - Filter UI
5. `/components/features/order/order-timeline.tsx` - Full timeline section

### Installation Command
Run this in project root:
```bash
npx shadcn@latest add @shadcn/progress @shadcn/toggle-group @shadcn/badge @shadcn/accordion @shadcn/alert @shadcn/collapsible @shadcn/select @shadcn/dropdown-menu @shadcn/card
```

---

## 15. Next Steps

1. Install all shadcn components using the command above
2. Create custom components using examples provided
3. Implement order state management (context/store)
4. Add framer-motion for enhanced animations
5. Test responsive behavior (mobile, tablet, desktop)
6. Implement accessibility testing
7. Add order data integration with API

---

## References

- **shadcn/ui Docs:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Framer Motion:** https://www.framer.com/motion
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev

---

**Document Version:** 1.0
**Last Updated:** December 2, 2025
**Status:** Research Complete - Ready for Implementation
