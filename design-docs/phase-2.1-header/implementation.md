# Header Component Implementation

## Overview

Complete header/navbar component for Pizza Space restaurant website with responsive design, mobile drawer menu, and interactive cart badge.

## Component Architecture

```
components/layout/header/
├── index.tsx              # Main Header component (Server Component)
├── logo.tsx               # Pizza Space logo with icon (Server Component)
├── header-nav.tsx         # Desktop navigation links (Client Component)
├── header-icons.tsx       # Action icons (location, search, cart, user)
├── cart-badge.tsx         # Shopping cart with item count badge
└── mobile-menu.tsx        # Mobile hamburger menu with drawer
```

## Installation

No additional dependencies required. The header uses existing UI components:

- `components/ui/drawer.tsx`
- `components/ui/button.tsx`
- `components/ui/icon-button.tsx`
- Lucide React icons (already installed)

## Usage

### Basic Implementation

Import and use the Header in your root layout:

```tsx
// app/layout.tsx
import { Header } from "@/components/layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### Component Features

#### 1. Logo Component (`logo.tsx`)
- Pizza icon in orange circular background
- "Pizza Space" text in brand orange
- Links to homepage
- Hover scale animation
- Fully accessible with aria-label

#### 2. Desktop Navigation (`header-nav.tsx`)
- Five main navigation links: Home, About, Stores, Menu, Contact Us
- Active page highlighting in orange
- Smooth color transitions on hover
- Hidden on mobile (md breakpoint)
- Uses Next.js `usePathname` for active state

#### 3. Header Icons (`header-icons.tsx`)
- **Location Pin**: Links to stores page (hidden on smallest mobile)
- **Search**: Opens search modal (placeholder for now)
- **Cart**: Shopping cart with badge (see CartBadge)
- **User**: Links to account page (hidden on mobile)
- All icons transition to orange on hover

#### 4. Cart Badge (`cart-badge.tsx`)
- Shopping cart icon with item count
- Orange circular badge for visibility
- Displays "99+" for counts over 99
- Accessible with aria-label including count
- Currently uses local state (ready for context integration)

#### 5. Mobile Menu (`mobile-menu.tsx`)
- Hamburger icon (visible only on mobile)
- Opens drawer from right side
- Contains:
  - All main navigation links
  - Separator line
  - Account section: Order History, Address Management, Profile, Coupons, Sign Out
- Active page highlighting
- Auto-closes on link click
- Fully accessible drawer with keyboard support

## Styling

### Color Scheme
- Background: `#1E293B` (slate-800)
- Primary Text: White
- Hover/Active: `#F97316` (orange-500)
- Hover Background: `slate-700/50`

### Responsive Breakpoints
- **Mobile** (< 768px): Logo + Icons + Hamburger Menu
- **Desktop** (≥ 768px): Logo + Desktop Nav + Icons

### Height
- Desktop: 64px (h-16)
- Mobile: 64px (h-16)

## Customization

### Adding Navigation Links

Edit `header-nav.tsx` or `mobile-menu.tsx`:

```tsx
const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // Add more links here
  { label: "Blog", href: "/blog" },
];
```

### Connecting Cart to Real Data

Update `header-icons.tsx` to use cart context:

```tsx
import { useCart } from "@/contexts/CartContext";

export function HeaderIcons() {
  const { itemCount } = useCart();

  return (
    // ... existing code
    <CartBadge itemCount={itemCount} />
  );
}
```

### Customizing Logo

Replace the Pizza icon in `logo.tsx`:

```tsx
// Option 1: Use different Lucide icon
import { Store } from "lucide-react";
<Store className="size-6 text-white" />

// Option 2: Use custom SVG
<svg className="size-6 text-white" viewBox="0 0 24 24">
  {/* Your custom SVG path */}
</svg>

// Option 3: Use Next.js Image
import Image from "next/image";
<Image src="/logo.png" alt="" width={24} height={24} />
```

### Implementing Search Modal

Update the search handler in `header-icons.tsx`:

```tsx
const handleSearchClick = () => {
  // Open your search modal/dialog
  setSearchOpen(true);
};
```

## Accessibility Features

- Proper semantic HTML (`<header>`, `<nav>`)
- ARIA labels on all icon buttons
- `aria-current="page"` for active navigation links
- `aria-live="polite"` on cart badge for screen readers
- Keyboard navigation support in drawer
- Focus management with ESC key to close drawer
- High contrast ratios for text visibility

## TypeScript Types

### NavLink Interface
```tsx
interface NavLink {
  label: string;
  href: string;
}
```

### CartBadge Props
```tsx
interface CartBadgeProps {
  itemCount?: number; // Defaults to 0
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript for mobile menu and interactive features
- Gracefully degrades to static layout without JavaScript

## Performance Considerations

- Main Header is a Server Component (no client JS until interaction)
- Client Components only where needed (nav, icons, mobile menu)
- Uses Next.js Link for client-side navigation
- Drawer uses React Portal for proper stacking context
- Body scroll lock when drawer is open

## Future Enhancements

1. **Cart Context Integration**
   - Connect to global cart state
   - Real-time cart updates
   - Add to cart animations

2. **Search Modal**
   - Full-text menu search
   - Recent searches
   - Search suggestions

3. **User Authentication**
   - Show user avatar when logged in
   - Display user name in mobile menu
   - Protected routes

4. **Notifications Badge**
   - Order status updates
   - Promotional alerts

5. **Sticky Scroll Behavior**
   - Hide header on scroll down
   - Show on scroll up
   - Smaller compact header on scroll

## Troubleshooting

### Issue: Navigation links not working
**Solution**: Ensure all route files exist in `app/` directory

### Issue: Drawer not opening
**Solution**: Check that "use client" directive is present in `mobile-menu.tsx`

### Issue: Cart badge not showing
**Solution**: Verify `itemCount` prop is being passed to CartBadge

### Issue: Icons appearing too large/small
**Solution**: Adjust icon size classes (currently `size-5` for most icons)

### Issue: Header not sticky
**Solution**: Ensure parent layout has proper scroll container

## Related Components

- `/components/ui/drawer.tsx` - Mobile menu drawer
- `/components/ui/icon-button.tsx` - Icon button styles
- `/components/ui/button.tsx` - Button component

## Code Quality

- Full TypeScript type safety
- ESLint compliant
- Follows Next.js 16 best practices
- Server/Client Component separation
- Proper React hooks usage
- Accessibility standards (WCAG AA)
