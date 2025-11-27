# Header Component Tree Structure

## Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Header (Server)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Container (max-width, padding)                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Flex Row (justify-between, items-center, gap-4)        │  │  │
│  │  │                                                           │  │  │
│  │  │  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐ │  │  │
│  │  │  │     Logo     │  │   HeaderNav    │  │ Icons + Menu │ │  │  │
│  │  │  │  (Server)    │  │   (Client)     │  │   (Client)   │ │  │  │
│  │  │  └──────────────┘  └────────────────┘  └──────────────┘ │  │  │
│  │  │                                                           │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Header (index.tsx) - Server Component
```
Header
├── Logo (Server)
│   └── Link → "/"
│       ├── Pizza Icon (Lucide)
│       └── "Pizza Space" Text
│
├── HeaderNav (Client) [Hidden on mobile]
│   ├── Link → "/"           (Home)
│   ├── Link → "/about"      (About)
│   ├── Link → "/stores"     (Stores)
│   ├── Link → "/menu"       (Menu)
│   └── Link → "/contact"    (Contact Us)
│
└── Right Side Container
    ├── HeaderIcons (Client)
    │   ├── LocationButton → "/stores"    [Hidden on small mobile]
    │   ├── SearchButton                  [Opens modal]
    │   ├── CartBadge (Client)
    │   │   └── Link → "/cart"
    │   │       ├── ShoppingCart Icon
    │   │       └── Badge (if count > 0)
    │   └── UserButton → "/account"       [Hidden on mobile]
    │
    └── MobileMenu (Client) [Hidden on desktop]
        └── HamburgerButton
            └── Drawer (from ui/drawer)
                ├── Title: "Menu"
                ├── CloseButton
                ├── Navigation Links
                │   ├── Link → "/"
                │   ├── Link → "/about"
                │   ├── Link → "/stores"
                │   ├── Link → "/menu"
                │   └── Link → "/contact"
                ├── Separator
                └── Account Section
                    ├── Link → "/account/orders"
                    ├── Link → "/account/addresses"
                    ├── Link → "/account/profile"
                    ├── Link → "/account/coupons"
                    └── Link → "/auth/signout"
```

## Responsive Behavior

### Desktop (≥ 768px)
```
┌───────────────────────────────────────────────────────────────┐
│  [Logo] [Home] [About] [Stores] [Menu] [Contact]  [🗺️][🔍][🛒][👤]│
└───────────────────────────────────────────────────────────────┘
     └─Logo    └──────────HeaderNav──────────┘    └──Icons──┘
```

### Tablet (768px)
```
┌───────────────────────────────────────────────────────────────┐
│  [Logo]  [Home] [About] [Stores] [Menu] [Contact]  [🗺️][🔍][🛒][👤]│
└───────────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│  [Logo]              [🔍][🛒][☰]    │
└─────────────────────────────────────┘
```

When hamburger (☰) clicked:
```
┌─────────────────────────────────────┐
│  [Logo]              [🔍][🛒][☰]    │
└─────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Menu         [×]│
                    ├──────────────────┤
                    │  Home            │
                    │  About           │
                    │  Stores          │
                    │  Menu            │
                    │  Contact Us      │
                    ├──────────────────┤
                    │  ACCOUNT         │
                    ├──────────────────┤
                    │  Order History   │
                    │  Address Mgmt    │
                    │  Profile         │
                    │  Coupons         │
                    │  Sign Out        │
                    └──────────────────┘
```

## Component Types

### Server Components (No "use client")
- `index.tsx` - Main Header wrapper
- `logo.tsx` - Logo component

**Why Server?**
- Static content
- No interactivity
- Better performance
- Smaller client bundle

### Client Components ("use client")
- `header-nav.tsx` - Needs `usePathname` for active state
- `header-icons.tsx` - Click handlers for search
- `cart-badge.tsx` - Dynamic cart count
- `mobile-menu.tsx` - Drawer state management

**Why Client?**
- Interactive features
- React hooks (useState, usePathname)
- Event handlers
- Dynamic state

## State Management

### Local State (useState)
```
MobileMenu
└── isOpen: boolean          // Drawer open/closed

HeaderIcons
└── cartItemCount: number    // TODO: Move to context
```

### Next.js Router State (usePathname)
```
HeaderNav
└── pathname: string         // Active route highlighting

MobileMenu
└── pathname: string         // Active route highlighting
```

### Future Context (Planned)
```
CartContext (Global)
└── itemCount: number        // Shared cart state
    └── Used by CartBadge
        └── Used by HeaderIcons
```

## Data Flow

### Navigation Active State
```
Next.js Router (URL)
        ↓
usePathname() hook
        ↓
Compare with link href
        ↓
Apply active styles (orange)
```

### Cart Badge Count
```
CartContext (Future)
        ↓
useCart() hook
        ↓
HeaderIcons component
        ↓
CartBadge component
        ↓
Display badge if count > 0
```

### Mobile Menu Toggle
```
User clicks hamburger
        ↓
setIsOpen(true)
        ↓
Drawer opens (right side)
        ↓
User clicks link/overlay/X
        ↓
setIsOpen(false)
        ↓
Drawer closes
```

## Import Dependencies

### From Project
```
@/components/ui/button       → Not directly used (via IconButton)
@/components/ui/icon-button  → Used in HeaderIcons, MobileMenu
@/components/ui/drawer       → Used in MobileMenu
@/lib/utils                  → cn() for className merging
```

### From Next.js
```
next/link                    → All navigation links
next/navigation              → usePathname for active state
```

### From Lucide React
```
lucide-react
├── Pizza         → Logo icon
├── MapPin        → Location icon
├── Search        → Search icon
├── ShoppingCart  → Cart icon
├── User          → User icon
└── Menu          → Hamburger icon
```

### From React
```
react
├── useState      → Local state management
└── usePathname   → Route detection (via next/navigation)
```

## Performance Optimizations

### Server vs Client Split
- Only interactive parts are Client Components
- Reduces JavaScript bundle size
- Faster initial page load

### Static Logo
- Server Component
- No hydration needed
- Renders directly on server

### Lazy Drawer Content
- Drawer content only renders when opened
- Saves initial render cost
- Uses `shouldRenderContent` state

### Efficient Navigation
- Next.js Link for client-side transitions
- Prefetches on hover
- Instant navigation feel

## Accessibility Tree

```
<header role="banner">
  <div>
    <Link aria-label="Pizza Space Home">
      Logo
    </Link>

    <nav aria-label="Main navigation">
      <Link aria-current="page">Home</Link>
      <Link>About</Link>
      <!-- etc -->
    </nav>

    <div>
      <IconButton aria-label="Find nearby stores">
        <MapPin />
      </IconButton>

      <IconButton aria-label="Search menu">
        <Search />
      </IconButton>

      <Link>
        <IconButton aria-label="Shopping cart with 3 items">
          <ShoppingCart />
          <span aria-live="polite">3</span>
        </IconButton>
      </Link>

      <IconButton aria-label="Open navigation menu">
        <Menu />
      </IconButton>
    </div>
  </div>

  <Drawer
    role="dialog"
    aria-modal="true"
    aria-labelledby="drawer-title"
  >
    <h2 id="drawer-title">Menu</h2>
    <nav aria-label="Mobile navigation">
      <!-- Links -->
    </nav>
  </Drawer>
</header>
```

## File Dependencies Graph

```
index.tsx (Main Entry)
├── Imports logo.tsx
├── Imports header-nav.tsx
├── Imports header-icons.tsx
│   └── Imports cart-badge.tsx
└── Imports mobile-menu.tsx

Each file also imports:
├── Next.js (Link, usePathname)
├── Lucide React (icons)
├── UI Components (IconButton, Drawer)
└── Utils (cn)
```

## Bundle Size Estimate

```
Component               Size    Type
─────────────────────────────────────
logo.tsx                ~1 KB   Server
header-nav.tsx          ~2 KB   Client
header-icons.tsx        ~2 KB   Client
cart-badge.tsx          ~1 KB   Client
mobile-menu.tsx         ~3 KB   Client
index.tsx               ~1 KB   Server
─────────────────────────────────────
Total Client JS         ~8 KB   Minified + Gzipped
Total Server            ~2 KB   No client cost
```

## Testing Points Per Component

### Logo (5 tests)
- Renders correctly
- Links to homepage
- Hover animation works
- Icon displays
- Text displays

### HeaderNav (6 tests)
- All links render
- Active state highlights
- Hover states work
- Hidden on mobile
- Visible on desktop
- usePathname works

### HeaderIcons (8 tests)
- All 4 icons render
- Location links correctly
- Search triggers handler
- Cart links correctly
- User links correctly
- Responsive visibility
- Hover states
- Cart badge integration

### CartBadge (7 tests)
- Badge shows when count > 0
- Badge hides when count = 0
- Correct count displays
- "99+" for large numbers
- Aria-label includes count
- Links to cart page
- Badge styled correctly

### MobileMenu (12 tests)
- Hamburger renders on mobile
- Hidden on desktop
- Drawer opens on click
- All nav links render
- Account section renders
- Links close drawer
- Overlay closes drawer
- X button closes drawer
- ESC key closes drawer
- Active state highlights
- Smooth animations
- Body scroll locks

### Header (5 tests)
- Full layout renders
- Sticky positioning
- Responsive container
- All child components
- Proper z-index

## Total Testing Surface
**43 individual test cases** across 6 components
