# shadcn/ui Component Research - PizzaSpace Home Page Sprint 1

**Project:** PizzaSpace Web - Pizza Commerce Platform
**Sprint:** 1 - Home Page Redesign
**Research Date:** November 29, 2025
**Components Researched:** 9 Core UI Components

---

## Installation Commands

### Single Batch Installation
Install all required components at once with this command:

```bash
npx shadcn@latest add @shadcn/sheet @shadcn/command @shadcn/dropdown-menu @shadcn/switch @shadcn/navigation-menu @shadcn/badge @shadcn/button @shadcn/input @shadcn/card
```

### Individual Component Installation
If you prefer to install components one at a time:

```bash
npx shadcn@latest add @shadcn/sheet
npx shadcn@latest add @shadcn/command
npx shadcn@latest add @shadcn/dropdown-menu
npx shadcn@latest add @shadcn/switch
npx shadcn@latest add @shadcn/navigation-menu
npx shadcn@latest add @shadcn/badge
npx shadcn@latest add @shadcn/button
npx shadcn@latest add @shadcn/input
npx shadcn@latest add @shadcn/card
```

---

## Component Details & Usage

### 1. Sheet Component
**Category:** Mobile Navigation
**Dependencies:** `@radix-ui/react-dialog`

#### Overview
The Sheet component is a dialog-based drawer/sidebar that works perfectly for mobile navigation. It's built on Radix UI's Dialog primitive and supports both left/right and top/bottom positioning.

#### Import Statement
```typescript
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

#### Basic Usage Example
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Menu Icon */}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigate PizzaSpace</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <a href="/orders">Orders</a>
          <a href="/settings">Settings</a>
        </nav>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

#### Key Props
- `side`: "left" | "right" | "top" | "bottom" (default: "right")
- `open`: boolean - Controlled open state
- `onOpenChange`: (open: boolean) => void - Change handler
- `asChild`: boolean - Render as child component

#### Styling & Customization
```tsx
// Custom positioning and sizing
<SheetContent className="w-[400px] sm:w-[540px]">
  {/* Content */}
</SheetContent>

// Mobile-optimized
<SheetContent side="left" className="w-full sm:w-[350px]">
  {/* Full width on mobile, fixed on desktop */}
</SheetContent>
```

#### Dark Mode Support
The Sheet component automatically adapts to dark mode via Tailwind CSS. The overlay and content surfaces use semantic color tokens that respond to the `dark` class.

#### Accessibility Features
- Built on Radix UI Dialog (WAI-ARIA Dialog pattern)
- Focus automatically moves to Sheet when opened
- Escape key closes the Sheet
- Click outside closes the Sheet (configurable)
- Full keyboard navigation support
- Proper ARIA labels and roles

#### Animation & Transitions
- Smooth slide-in/out animations (default: 300ms)
- Customizable via Tailwind's animation utilities
- Hardware-accelerated transforms for performance

#### Use Case for PizzaSpace
Perfect for mobile navigation drawer showing menu categories, account access, and quick settings toggle.

---

### 2. Command Component
**Category:** Search/Command Palette
**Dependencies:** `cmdk`

#### Overview
The Command component creates a searchable, keyboard-accessible command palette. Built on `cmdk` library, it provides fast filtering and keyboard shortcuts display.

#### Import Statement
```typescript
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
```

#### Basic Usage Example
```tsx
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export default function PizzaSearchCommand() {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Search pizzas, sides, drinks..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Popular Items">
          <CommandItem>
            <Pizza />
            <span>Margherita</span>
          </CommandItem>
          <CommandItem>
            <Pizza />
            <span>Pepperoni</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Categories">
          <CommandItem>
            <Menu />
            <span>All Pizzas</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Drink />
            <span>Beverages</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

#### Command Dialog (Modal) Usage
```tsx
"use client"

import { useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function SearchDialog() {
  const [open, setOpen] = useState(false)

  // Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pizzas..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pizzas">
            {/* Items */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

#### Key Props
- `placeholder`: string - Input placeholder text
- `value`: string - Controlled input value
- `onValueChange`: (value: string) => void - Value change handler
- `disabled`: boolean - Disable command

#### Styling & Customization
```tsx
// Full-width search in hero
<Command className="w-full rounded-full shadow-lg">
  <CommandInput placeholder="Search 100+ pizzas..." />
</Command>

// Compact command palette
<Command className="rounded-lg border">
  <CommandInput className="text-sm" />
</Command>
```

#### Dark Mode Support
The Command component uses semantic color tokens that automatically adapt to dark mode via Tailwind's `dark:` variant.

#### Accessibility Features
- Full keyboard navigation (Arrow Up/Down, Enter to select)
- Escape key closes dialog
- Vim bindings support (h, j, k, l)
- ARIA live region for search results
- Screen reader friendly groups and items
- Disabled items properly announced

#### Animation & Transitions
- Smooth list filtering (no full re-renders on input)
- Optimized for fast keyboard navigation
- Dialog animation via Radix UI Dialog

#### Use Case for PizzaSpace
Perfect for Cmd+K search functionality in the header to search pizzas, categories, and orders. Can also be used as standalone search in hero section.

---

### 3. Dropdown Menu Component
**Category:** User Account / Navigation
**Dependencies:** `@radix-ui/react-dropdown-menu`

#### Overview
The DropdownMenu component provides a menu trigger with sub-menus, groups, and keyboard shortcuts. Built on Radix UI's DropdownMenu primitive.

#### Import Statement
```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
```

#### Basic Usage Example - User Account Menu
```tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

export default function UserAccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* User Avatar Icon */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Orders</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Addresses</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Add New</DropdownMenuItem>
                <DropdownMenuItem>Edit Default</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

#### Key Props
- `align`: "start" | "center" | "end" - Content alignment
- `side`: "top" | "right" | "bottom" | "left" - Side to open
- `sideOffset`: number - Distance from trigger

#### Styling & Customization
```tsx
// Wide menu for many items
<DropdownMenuContent className="w-80">

// Compact mobile menu
<DropdownMenuContent className="w-48 sm:w-56">

// Custom styling for destructive actions
<DropdownMenuItem className="text-red-600 dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-900">
  Delete Account
</DropdownMenuItem>
```

#### Dark Mode Support
Uses semantic color tokens. Destructive actions can use custom colors via className.

#### Accessibility Features
- Full keyboard navigation (Arrow keys, Tab)
- Escape closes menu
- Home/End key navigation
- Type-ahead for items
- Proper ARIA roles and attributes
- Focus management
- Screen reader friendly

#### Animation & Transitions
- Smooth fade and scale animations
- Customizable via CSS variables
- Hardware-accelerated

#### Use Case for PizzaSpace
Perfect for user account dropdown in header showing profile, orders, settings, and logout.

---

### 4. Switch Component
**Category:** Theme Toggle / Settings
**Dependencies:** `@radix-ui/react-switch`

#### Overview
The Switch component creates accessible toggle switches for binary choices. Built on Radix UI Switch primitive, it supports controlled and uncontrolled states.

#### Import Statement
```typescript
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
```

#### Basic Usage Example
```tsx
"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="theme-toggle">Dark Mode</Label>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={setIsDark}
      />
    </div>
  )
}
```

#### Controlled Usage
```tsx
"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked)
    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <Switch
      checked={isDark}
      onCheckedChange={toggleTheme}
      aria-label="Toggle dark mode"
    />
  )
}
```

#### Key Props
- `checked`: boolean - Controlled checked state
- `onCheckedChange`: (checked: boolean) => void - Change handler
- `disabled`: boolean - Disable the switch
- `id`: string - Associated with label

#### Styling & Customization
```tsx
// Larger switch for mobile
<Switch className="scale-125" />

// Custom colors via className
<Switch className="bg-blue-500 dark:bg-blue-600" />

// With label and description
<div className="flex items-center justify-between">
  <div>
    <Label>Notifications</Label>
    <p className="text-sm text-muted-foreground">Receive order updates</p>
  </div>
  <Switch />
</div>
```

#### Dark Mode Support
Automatically adapts colors to dark mode. Track color becomes muted in dark mode.

#### Accessibility Features
- Full keyboard support (Space/Enter to toggle)
- Proper ARIA attributes (aria-checked, aria-disabled)
- Works with Labels via htmlFor
- High contrast in both light and dark modes
- Announces state changes to screen readers

#### Animation & Transitions
- Smooth animated thumb movement (200ms)
- Color transition on toggle
- Hardware-accelerated

#### Use Case for PizzaSpace
Perfect for light/dark mode toggle in header or user settings. Also suitable for notification preferences or dietary restriction toggles.

---

### 5. Navigation Menu Component
**Category:** Desktop Navigation
**Dependencies:** `@radix-ui/react-navigation-menu`

#### Overview
The NavigationMenu component creates multi-level, keyboard-accessible navigation with hover previews. Built on Radix UI NavigationMenu primitive.

#### Import Statement
```typescript
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
```

#### Basic Usage Example
```tsx
"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function PizzaSpaceNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden transition-colors hover:bg-accent"
                    href="/"
                  >
                    <div className="mb-2 text-lg font-medium">PizzaSpace</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Fresh pizzas delivered hot to your door in 30 minutes.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/menu" title="All Pizzas">
                Browse our entire pizza menu
              </ListItem>
              <ListItem href="/specials" title="Today's Specials">
                Limited time offers and combos
              </ListItem>
              <ListItem href="/sides" title="Sides & Drinks">
                Wings, breadsticks, and beverages
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Orders</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem href="/my-orders" title="My Orders">
                View order history
              </ListItem>
              <ListItem href="/track" title="Track Order">
                Real-time delivery tracking
              </ListItem>
              <ListItem href="/reorder" title="Reorder">
                Quick reorder previous items
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/deals">Deals</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/contact">Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// Helper component for list items
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
```

#### Key Props
- `viewport`: boolean - Show viewport (for responsive)
- `orientation`: "horizontal" | "vertical" - Direction
- `delayDuration`: number - Hover delay in ms

#### Styling & Customization
```tsx
// Full-width menu
<NavigationMenu className="w-full">

// Hide on mobile, show on desktop
<NavigationMenu className="hidden md:flex">

// Custom grid layout for content
<NavigationMenuContent>
  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {/* Items */}
  </ul>
</NavigationMenuContent>
```

#### Dark Mode Support
Automatically adapts via semantic color tokens. Hover states use `hover:bg-accent`.

#### Accessibility Features
- Full keyboard navigation (Arrow keys, Tab)
- Automatic focus management
- Escape key closes menu
- Proper ARIA attributes
- Submenu indicator via arrow icon
- Voice control friendly

#### Animation & Transitions
- Smooth content slide and fade
- Customizable delay duration
- Hardware-accelerated

#### Use Case for PizzaSpace
Perfect for desktop navigation showing Menu, Orders, Deals, and Contact with dropdown previews of categories and features.

---

### 6. Badge Component
**Category:** Status & Count Indicators
**Dependencies:** `@radix-ui/react-slot`

#### Overview
The Badge component displays small status indicators, counts, or labels. Lightweight and purely presentational.

#### Import Statement
```typescript
import { Badge } from "@/components/ui/badge"
```

#### Basic Usage Examples
```tsx
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BadgeExamples() {
  return (
    <div className="flex flex-col gap-4">
      {/* Basic variants */}
      <div className="flex gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      {/* With icons */}
      <div className="flex gap-2">
        <Badge
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600"
        >
          <CheckIcon className="mr-1 size-3" />
          Verified
        </Badge>
        <Badge className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900">
          <AlertCircleIcon className="mr-1 size-3" />
          New
        </Badge>
      </div>

      {/* Count badges (circular) */}
      <div className="flex gap-2">
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          99
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="outline"
        >
          20+
        </Badge>
      </div>

      {/* PizzaSpace use cases */}
      <div className="flex gap-2">
        <Badge className="bg-blue-500 text-white">50+ Orders</Badge>
        <Badge className="bg-orange-500 text-white">30min Delivery</Badge>
        <Badge variant="outline">4.8 stars</Badge>
      </div>
    </div>
  )
}
```

#### Badge in Cart Icon
```tsx
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CartButton({ itemCount }: { itemCount: number }) {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  )
}
```

#### Key Props
- `variant`: "default" | "secondary" | "outline" | "destructive"
- `className`: string - Custom styling

#### Styling & Customization
```tsx
// Custom color variants
<Badge className="bg-purple-500 text-white dark:bg-purple-600">
  Premium
</Badge>

// Size variations
<Badge className="text-xs">Small</Badge>
<Badge>Regular</Badge>
<Badge className="text-lg">Large</Badge>

// Rounded pill style
<Badge className="rounded-full">Pill Badge</Badge>

// With icon
<Badge className="gap-1">
  <Icon className="size-3" />
  Label
</Badge>
```

#### Dark Mode Support
Automatically adapts. Use `dark:` variants for custom colors:
```tsx
<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
  Info
</Badge>
```

#### Accessibility Features
- Semantic HTML (span/div based)
- Clear, contrasting colors
- Readable text sizes
- Screen reader compatible

#### Animation & Transitions
- No animations by default (static indicator)
- Can add custom transitions via className

#### Use Cases for PizzaSpace
- Cart item count badge
- Order status badges ("Confirmed", "Preparing", "On the way")
- Stats badges ("50+ Orders", "30min Delivery", "4.8 stars")
- Dietary info badges ("Vegan", "Gluten-free")
- New item indicators
- Promotion tags ("Hot Deal", "Limited Time")

---

### 7. Button Component
**Category:** Call-to-Action & Interaction
**Dependencies:** `@radix-ui/react-slot`

#### Overview
The Button component is a versatile, accessible button with multiple variants, sizes, and states. Built with Radix UI primitives.

#### Import Statement
```typescript
import { Button } from "@/components/ui/button"
```

#### Basic Usage Examples
```tsx
import { ArrowUpIcon, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ButtonExamples() {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Default variants */}
      <Button>Order Now</Button>
      <Button variant="secondary">Learn More</Button>
      <Button variant="outline">View Menu</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="link">Skip</Button>

      {/* Destructive variant */}
      <Button variant="destructive">Remove from Cart</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button>Regular</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <ShoppingCart />
      </Button>

      {/* With icon and text */}
      <Button>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>

      {/* Loading state */}
      <Button disabled>
        <span className="animate-spin mr-2">⏳</span>
        Processing...
      </Button>

      {/* Full width (for mobile) */}
      <Button className="w-full">Checkout</Button>
    </div>
  )
}
```

#### CTA Button for Hero Section
```tsx
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button size="lg" className="gap-2">
        Order Now
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button size="lg" variant="outline">
        Browse Menu
      </Button>
    </div>
  )
}
```

#### Key Props
- `variant`: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean - Render as child element (for Next.js Link)
- `disabled`: boolean - Disabled state

#### Styling & Customization
```tsx
// As Next.js Link
<Button asChild>
  <Link href="/menu">Browse Menu</Link>
</Button>

// Full width
<Button className="w-full">Checkout</Button>

// Custom colors
<Button className="bg-orange-500 hover:bg-orange-600">
  Order Now
</Button>

// Rounded button
<Button className="rounded-full">Subscribe</Button>

// Icon button with tooltip
<Button variant="ghost" size="icon" title="Add to favorites">
  <Heart />
</Button>
```

#### Dark Mode Support
All variants automatically adapt to dark mode using semantic color tokens.

#### Accessibility Features
- Native button element for keyboard navigation
- Focus states with outline
- Disabled state properly announced
- Works with assistive technologies
- Clear contrast ratios
- Proper button role semantics

#### Animation & Transitions
- Smooth color transitions on hover
- Active state feedback
- Focus ring animation
- Disabled state fade

#### Use Cases for PizzaSpace
- Primary CTA buttons in hero section ("Order Now")
- Secondary actions ("Browse Menu", "View Details")
- Form submit buttons
- Add to cart buttons
- Quick action buttons
- Navigation buttons
- Icon buttons (cart, search, menu)

---

### 8. Input Component
**Category:** Form Input / Search
**Dependencies:** None (native)

#### Overview
The Input component is a styled HTML input element with support for various types and states.

#### Import Statement
```typescript
import { Input } from "@/components/ui/input"
```

#### Basic Usage Examples
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export default function InputExamples() {
  return (
    <div className="flex flex-col gap-6">
      {/* Basic input */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      {/* Search input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search pizzas..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Search in hero section */}
      <Input
        type="text"
        placeholder="Search 100+ pizzas, desserts, and beverages..."
        className="h-14 rounded-full shadow-lg"
      />

      {/* Different types */}
      <Input type="text" placeholder="Name" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Quantity" />
      <Input type="tel" placeholder="Phone" />
      <Input type="url" placeholder="Website" />

      {/* Disabled */}
      <Input placeholder="Disabled input" disabled />

      {/* With prefix/suffix via InputGroup */}
      <div className="relative">
        <span className="absolute left-3 top-3 text-muted-foreground">
          $
        </span>
        <Input type="number" placeholder="0.00" className="pl-7" />
      </div>
    </div>
  )
}
```

#### Hero Section Search Input
```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to search results
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search pizzas, sides, drinks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 rounded-full h-12"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      <Button type="submit" className="rounded-full">
        Search
      </Button>
    </form>
  )
}
```

#### Key Props
- `type`: string - HTML input type
- `placeholder`: string - Placeholder text
- `disabled`: boolean - Disabled state
- `readOnly`: boolean - Read-only state
- `value`: string - Controlled value
- `onChange`: (e) => void - Change handler

#### Styling & Customization
```tsx
// Large search input
<Input className="h-14 text-lg" placeholder="Search..." />

// Rounded input
<Input className="rounded-full" placeholder="Search..." />

// With custom border color
<Input className="border-blue-200 focus:border-blue-500" />

// Input with error state
<Input className="border-red-500 focus:border-red-500" />

// Mobile optimized
<Input
  className="h-12 text-base"
  placeholder="Type to search..."
/>
```

#### Dark Mode Support
Automatically adapts via Tailwind CSS semantic colors. Border and text colors adjust for dark mode.

#### Accessibility Features
- Full keyboard support (Tab, arrow keys for number inputs)
- Works with associated Labels via htmlFor
- Proper input role
- Focus states clearly visible
- Screen reader announcements
- Error message association

#### Animation & Transitions
- Smooth focus border color change
- Smooth background color transition
- No excessive animations

#### Use Cases for PizzaSpace
- Hero section search input
- Email/password fields in login/signup
- Address input for delivery
- Special instructions textarea
- Filter inputs (price range, dietary preferences)
- Quantity inputs in cart

---

### 9. Card Component
**Category:** Content Container / Layout
**Dependencies:** None (semantic HTML)

#### Overview
The Card component is a flexible container for grouping content. It includes sub-components for header, footer, title, and description.

#### Import Statement
```typescript
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

#### Basic Usage Examples
```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Product card
export function ProductCard({
  name,
  description,
  price,
  image,
}: ProductProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

// Info card
export function InfoCard({
  icon: Icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <Card className="flex items-start gap-4 p-6">
      <div className="mt-1">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  )
}

// Login card
export function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
```

#### Floating Product Card for Hero
```tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function FloatingProductCard() {
  return (
    <Card className="w-72 animate-float shadow-xl">
      <CardHeader className="pb-3">
        <div className="relative mb-4">
          <img
            src="/margherita.jpg"
            alt="Margherita Pizza"
            className="w-full h-40 object-cover rounded-lg"
          />
          <Badge className="absolute top-3 right-3 bg-orange-500">
            Popular
          </Badge>
        </div>
        <CardTitle>Margherita</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Fresh mozzarella, basil, and tomato on our signature crust
        </p>
        <p className="text-xl font-bold mt-2">$12.99</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Quick Add</Button>
      </CardFooter>
    </Card>
  )
}
```

#### Service/Delivery Info Card
```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, Truck, Star } from "lucide-react"

export function DeliveryInfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Delivery Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">30 min</div>
          <p className="text-xs text-muted-foreground">
            Average delivery time
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Free Delivery
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$20+</div>
          <p className="text-xs text-muted-foreground">
            On orders over $20
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rating
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.8</div>
          <p className="text-xs text-muted-foreground">
            1000+ customer reviews
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Key Props
- `className`: string - Custom styling

#### Styling & Customization
```tsx
// Hover effect
<Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">

// Compact card
<Card className="p-3">

// Full width card
<Card className="w-full">

// Card with custom background
<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">

// Floating animation
<Card className="animate-bounce">
```

#### Dark Mode Support
Automatically adapts via Tailwind CSS. Background is `bg-card` which updates for dark mode. Border uses `border` which is semantic.

#### Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy
- Clear text contrast
- Screen reader friendly
- No color-only information

#### Animation & Transitions
- Smooth shadow transitions on hover
- Optional animations via className
- No required animations

#### Use Cases for PizzaSpace
- Product cards in menu grid (pizza, sides, drinks)
- Floating demo cards in hero section
- Order status cards
- Service info cards (delivery time, ratings, free shipping)
- Testimonial cards
- Feature cards
- Account/profile card
- Checkout cart summary card

---

## Theming & Dark Mode Considerations

All components use shadcn/ui's semantic color system:

### Color Token Mapping
- `bg-background` - Main background
- `text-foreground` - Main text
- `bg-card` - Card backgrounds
- `border-border` - Border colors
- `bg-muted` - Muted backgrounds
- `text-muted-foreground` - Muted text
- `bg-primary` - Primary action color
- `text-primary-foreground` - Primary text
- `bg-secondary` - Secondary action
- `bg-destructive` - Danger/error states
- `bg-accent` - Accent color for hover states

### Dark Mode Implementation
```tsx
// In your layout or app root
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="pizza-space-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Custom Theme Colors for PizzaSpace
Update your `globals.css` to customize colors:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;

    /* Pizza brand orange */
    --primary: 24 100% 50%;
    --primary-foreground: 0 0% 100%;

    /* Secondary accent */
    --secondary: 220 91% 54%;
    --secondary-foreground: 0 0% 100%;

    /* Other colors... */
  }

  .dark {
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --primary: 24 100% 60%;
    /* etc... */
  }
}
```

---

## Accessibility Features Summary

### WCAG 2.1 Compliance
All shadcn/ui components are built with accessibility in mind:

- **Keyboard Navigation:** All interactive components support Tab, Enter, Arrow keys, Escape
- **Screen Reader Support:** Proper ARIA roles, labels, and descriptions
- **Focus Management:** Clear focus indicators and logical focus order
- **Color Contrast:** All text meets WCAG AA standards (4.5:1 minimum)
- **Form Labels:** All inputs work with associated label elements
- **Error Handling:** Clear error states and messages
- **Motion:** Respects prefers-reduced-motion for users with vestibular disorders

### Testing Keyboard Navigation
```bash
# Tab through all interactive elements
# Ensure focus is always visible
# Test keyboard shortcuts (Cmd+K for search, etc.)
```

---

## Animation & Transition Capabilities

### Built-in Animations
- **Button hover:** 200ms smooth color transition
- **Sheet slide:** 300ms smooth slide-in/out
- **Command filtering:** Instant (optimized for speed)
- **Switch toggle:** 200ms smooth thumb animation
- **Navigation hover:** 200ms smooth appearance
- **Card shadow:** 200ms smooth shadow transition

### Custom Animation Examples
```css
/* In globals.css or tailwind config */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Fadeup on scroll */
@keyframes fadeup {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Performance Considerations
- All animations use CSS transforms and opacity (GPU-accelerated)
- Avoid animating width/height (use max-width or scale instead)
- Use `will-change` sparingly for performance
- Test on mobile devices for smooth 60fps performance

---

## Integration Notes for PizzaSpace

### Next.js 16 App Router Setup
Since your project uses Next.js 16 with React 19:

1. **Install all components:**
```bash
npx shadcn@latest add @shadcn/sheet @shadcn/command @shadcn/dropdown-menu @shadcn/switch @shadcn/navigation-menu @shadcn/badge @shadcn/button @shadcn/input @shadcn/card
```

2. **Create a header component** (`app/components/header.tsx`):
```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { NavigationMenu, /* ... */ } from "@/components/ui/navigation-menu"

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between h-16 px-6">
        <Link href="/" className="font-bold text-xl">
          PizzaSpace
        </Link>
        <NavigationMenu>
          {/* Navigation items */}
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <Input placeholder="Search..." className="w-48" />
          <Button variant="ghost" size="icon">
            <ShoppingCart />
            {cartCount > 0 && (
              <Badge variant="destructive">{cartCount}</Badge>
            )}
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center justify-between h-16 px-4">
        <Link href="/" className="font-bold text-lg">
          PizzaSpace
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ShoppingCart />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Mobile menu items */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = (checked: boolean) => {
    setIsDark(checked)
    if (checked) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <Button variant="ghost" size="icon">
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Menu items */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

3. **Create a hero section** (`app/components/hero.tsx`):
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh Pizza Delivered Fast
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Hot pizzas delivered to your door in 30 minutes or less
            </p>
            {/* Search input */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search pizzas..."
                className="rounded-full h-12"
              />
            </div>
            {/* CTA buttons */}
            <div className="flex gap-4">
              <Button size="lg">Order Now</Button>
              <Button size="lg" variant="outline">
                Browse Menu
              </Button>
            </div>
            {/* Stats badges */}
            <div className="flex gap-4 mt-8">
              <Badge className="bg-blue-500">50+ Orders</Badge>
              <Badge className="bg-orange-500">30min Delivery</Badge>
              <Badge variant="outline">4.8 stars</Badge>
            </div>
          </div>

          {/* Right - floating cards */}
          <div className="hidden md:flex relative h-96">
            {/* Floating product cards */}
          </div>
        </div>
      </div>
    </section>
  )
}
```

4. **Service info section** (`app/components/delivery-info.tsx`):
```tsx
import { Clock, Truck, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeliveryInfo() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Why Choose PizzaSpace?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Fast Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Average delivery in 30 minutes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Free Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                On orders over $20
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                4.8 stars from 1000+ reviews
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
```

### File Structure
```
app/
├── components/
│   ├── header.tsx
│   ├── hero.tsx
│   ├── delivery-info.tsx
│   └── ...
├── ui/
│   ├── sheet.tsx
│   ├── command.tsx
│   ├── dropdown-menu.tsx
│   ├── switch.tsx
│   ├── navigation-menu.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
└── page.tsx
```

### Performance Tips
1. **Lazy load components:** Use React's `lazy()` and `Suspense` for non-critical components
2. **Image optimization:** Use Next.js `Image` component for hero images
3. **Bundle size:** Components are tree-shakeable, install only what you need
4. **Hydration:** Use `"use client"` only for interactive components
5. **CSS optimization:** Tailwind CSS with `content` configured properly

---

## Browser Support

All shadcn/ui components support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

---

## Troubleshooting

### Common Issues

**1. Component not rendering?**
- Ensure `"use client"` is at top if using interactive features
- Check import paths match your project structure
- Verify Tailwind CSS is configured correctly

**2. Dark mode not working?**
- Add `suppressHydrationWarning` to `<html>` tag
- Install theme provider (usually done by CLI)
- Check `tailwind.config.ts` has `darkMode: "class"`

**3. Missing dependencies?**
- Run shadcn add command again
- Check `package.json` for required peer dependencies
- Clear `node_modules` and reinstall if needed

**4. Styling issues?**
- Ensure Tailwind CSS 4 is installed (your project has it)
- Check CSS import order in `globals.css`
- Verify `@tailwindcss/postcss` version compatibility

---

## Additional Resources

- **shadcn/ui Documentation:** https://ui.shadcn.com
- **Radix UI Primitives:** https://www.radix-ui.com
- **Tailwind CSS Docs:** https://tailwindcss.com
- **Next.js Documentation:** https://nextjs.org/docs
- **cmdk Library:** https://cmdk.paco.me

---

## Summary Table

| Component | Best For | Mobile | Desktop | Key Dependency |
|-----------|----------|--------|---------|-----------------|
| **Sheet** | Mobile navigation | ✓ | Optional | @radix-ui/react-dialog |
| **Command** | Search/Cmd+K palette | ✓ | ✓ | cmdk |
| **DropdownMenu** | User account menu | ✓ | ✓ | @radix-ui/react-dropdown-menu |
| **Switch** | Theme toggle | ✓ | ✓ | @radix-ui/react-switch |
| **NavigationMenu** | Desktop nav | Optional | ✓ | @radix-ui/react-navigation-menu |
| **Badge** | Status/count badges | ✓ | ✓ | None |
| **Button** | CTAs & interactions | ✓ | ✓ | @radix-ui/react-slot |
| **Input** | Form inputs/search | ✓ | ✓ | None |
| **Card** | Content containers | ✓ | ✓ | None |

---

**Research completed:** November 29, 2025
**Components analyzed:** 9
**Installation command ready:** Yes
**Documentation scope:** Complete implementation guide for Sprint 1
