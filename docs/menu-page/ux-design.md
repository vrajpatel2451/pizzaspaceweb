# Pizza Space Menu Page - Premium UX Design Document

## Overview

This document outlines the premium UX design specifications for the Pizza Space Menu Page, a core e-commerce interface that enables customers to browse, filter, and add products to their cart. The design prioritizes visual sophistication, intuitive navigation, and seamless micro-interactions while maintaining optimal performance.

---

## 1. Wireframe Descriptions

### 1.1 Desktop Layout (1024px+)

```
+------------------------------------------------------------------+
|                         HEADER (sticky)                           |
|  Logo    Navigation    Search Bar    Cart    Profile              |
+------------------------------------------------------------------+
|                                                                    |
|  +----------------+  +------------------------------------------+ |
|  |    SIDEBAR     |  |              PRODUCT GRID                | |
|  |   (280px)      |  |                                          | |
|  |   [sticky]     |  |  +----------+  +----------+  +----------+| |
|  |                |  |  | Product  |  | Product  |  | Product  || |
|  | [Categories]   |  |  |   Card   |  |   Card   |  |   Card   || |
|  | > Pizzas       |  |  +----------+  +----------+  +----------+| |
|  |   - Classic    |  |                                          | |
|  |   - Gourmet    |  |  +----------+  +----------+  +----------+| |
|  |   - Vegan      |  |  | Product  |  | Product  |  | Product  || |
|  | > Sides        |  |  |   Card   |  |   Card   |  |   Card   || |
|  | > Drinks       |  |  +----------+  +----------+  +----------+| |
|  | > Desserts     |  |                                          | |
|  |                |  |  +----------+  +----------+  +----------+| |
|  | [Active        |  |  | Product  |  | Product  |  | Product  || |
|  |  Filters]      |  |  |   Card   |  |   Card   |  |   Card   || |
|  |                |  |  +----------+  +----------+  +----------+| |
|  +----------------+  |                                          | |
|                      |  +--------------------------------------+| |
|                      |  |           PAGINATION                 || |
|                      |  |   < 1  2  3  ...  10  >              || |
|                      |  +--------------------------------------+| |
|                      +------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

**Desktop Sidebar Structure:**
- Fixed width: 280px
- Sticky positioning: `top: 80px` (below header)
- Maximum height: `calc(100vh - 100px)`
- Internal scroll for long category lists
- Visual separator: 1px border-right with subtle shadow

**Desktop Product Grid:**
- 3-column grid layout (`grid-cols-3`)
- Gap: 24px (`gap-6`)
- Minimum card width: 280px
- Responsive scaling based on viewport

### 1.2 Tablet Layout (768px - 1023px)

```
+--------------------------------------------------+
|                 HEADER (sticky)                   |
+--------------------------------------------------+
|                                                   |
|  [Filter Bar - Horizontal Scroll]                 |
|  | All | Pizzas | Sides | Drinks | Desserts |    |
|                                                   |
|  [Active Filters Chips]                           |
|  | Classic Pizza x | Under $20 x | Clear All |   |
|                                                   |
|  +---------------------+  +---------------------+ |
|  |    Product Card     |  |    Product Card     | |
|  +---------------------+  +---------------------+ |
|  +---------------------+  +---------------------+ |
|  |    Product Card     |  |    Product Card     | |
|  +---------------------+  +---------------------+ |
|                                                   |
|  +---------------------------------------------+ |
|  |              PAGINATION                      | |
|  +---------------------------------------------+ |
+--------------------------------------------------+
```

**Tablet Modifications:**
- Collapsible sidebar transforms to horizontal filter bar
- 2-column product grid (`grid-cols-2`)
- Tappable filter chips with horizontal scroll
- Larger touch targets (minimum 44px)

### 1.3 Mobile Layout (< 768px)

```
+--------------------------------+
|       HEADER (sticky)          |
+--------------------------------+
|                                |
| [Active Filters - Scrollable]  |
| | Pizzas | Classic x |         |
|                                |
| +----------------------------+ |
| |      Product Card          | |
| |      (Full Width)          | |
| +----------------------------+ |
| +----------------------------+ |
| |      Product Card          | |
| +----------------------------+ |
| +----------------------------+ |
| |      Product Card          | |
| +----------------------------+ |
|                                |
| +----------------------------+ |
| |       PAGINATION           | |
| +----------------------------+ |
|                                |
|            [FAB]               |
|           Filter               |
+--------------------------------+
```

**Mobile Specifications:**
- Single column layout (`grid-cols-1`)
- Floating Action Button (FAB) for filters
- Bottom sheet for filter panel
- Sticky active filters bar below header
- Pull-to-refresh gesture support

---

## 2. Interaction Specifications

### 2.1 Initial Load Experience

| State | Behavior | Duration |
|-------|----------|----------|
| Page Load | Show skeleton loaders for categories and products | - |
| Categories Load | Fade in sidebar with staggered category animation | 400ms |
| Products Load | Staggered grid animation (50ms delay per card) | 400ms base |
| First Paint | Display above-fold content first | < 1s target |

**Skeleton Loading Pattern:**
```
Sidebar Skeleton:
- 6 category placeholder bars (varying widths: 60%, 80%, 70%, 85%, 65%, 75%)
- Shimmer animation: left-to-right gradient sweep
- Duration: 1.5s infinite loop

Product Grid Skeleton:
- Aspect ratio 1:1 image placeholder
- 3 text line placeholders below
- Staggered shimmer with 100ms delay between cards
```

### 2.2 Category Selection Flow

```
User Action          System Response              Visual Feedback
-----------          ---------------              ---------------
Hover Category   ->  Background highlight         bg-accent transition 150ms
Click Category   ->  URL Update                   Instant
                 ->  Accordion Expand             200ms ease-out
                 ->  Subcategories Reveal         Staggered 50ms each
                 ->  Product Grid Filter          Fade transition 300ms
                 ->  Scroll to Top (optional)     Smooth 400ms
```

**Active Category Indicator:**
- Left border accent: 3px solid orange-500
- Background: accent color with 10% opacity
- Text weight: semibold (600)
- Icon rotation: ChevronDown rotates 180deg when expanded

### 2.3 Subcategory Selection Flow

```
User Action           System Response              Visual Feedback
-----------           ---------------              ---------------
Hover Subcategory ->  Text color change            color transition 150ms
Click Subcategory ->  URL Update (?subcategory=X)  Instant
                  ->  Active indicator show        Dot + bold text
                  ->  Product grid re-filter       Crossfade 250ms
                  ->  Parent accordion stays open  Maintained state
```

**Subcategory Active State:**
- Prefix indicator: Small orange dot (6px)
- Text: orange-500 color
- Font weight: medium (500)
- Background: orange-50 (light) / orange-950 (dark) with 50% opacity

### 2.4 Pagination Interaction

```
User Action         System Response              Visual Feedback
-----------         ---------------              ---------------
Hover Page #    ->  Scale up + shadow            scale(1.05) + shadow-md
Click Page #    ->  URL Update (?page=N)         Instant
                ->  Loading state                 Grid opacity 50%, spinner
                ->  Products fetch                API call
                ->  Grid update                   Fade in new products 300ms
                ->  Scroll behavior               Smooth scroll to grid top
```

**Pagination Visual States:**
| State | Appearance |
|-------|------------|
| Default | Border, transparent bg, muted text |
| Hover | Border-primary, accent bg, primary text |
| Active | Solid primary bg, white text, no scale on hover |
| Disabled | Opacity 50%, cursor not-allowed |

### 2.5 Back/Forward Navigation

```
Browser Action        System Response              Visual Feedback
-----------           ---------------              ---------------
Back Button       ->  Read URL params              Instant
                  ->  Restore sidebar state        Expand correct accordion
                  ->  Restore filter selection     Highlight active items
                  ->  Fetch products               Show loading state
                  ->  Update grid                  Crossfade transition

Forward Button    ->  Same as back button          Same behavior
```

**URL State Preservation:**
- All filter states encoded in URL searchParams
- Format: `/menu?category=pizzas&subcategory=classic&page=2&search=margherita`
- Enables deep linking and shareable filtered views

### 2.6 Search Integration

```
User Action          System Response              Visual Feedback
-----------          ---------------              ---------------
Type in Header   ->  Debounced search (300ms)     Typing indicator
Enter/Submit     ->  Navigate to /menu?search=X   Redirect
                 ->  Clear category filters       Reset sidebar state
                 ->  Show search results          Grid with matches
                 ->  Highlight search term        Bold matching text
No Results       ->  Show empty state             Friendly illustration
```

---

## 3. Animation Recommendations

### 3.1 Core Animation Library

**Recommended: Framer Motion** (already in use)

```typescript
// Animation configuration constants
const ANIMATION_CONFIG = {
  // Timing
  fast: 0.15,      // 150ms - micro-interactions
  base: 0.2,       // 200ms - standard transitions
  slow: 0.3,       // 300ms - page transitions
  slower: 0.5,     // 500ms - complex animations

  // Easings
  easeOut: [0, 0, 0.2, 1],        // Decelerate
  easeIn: [0.4, 0, 1, 1],         // Accelerate
  easeInOut: [0.4, 0, 0.2, 1],    // Standard
  spring: { type: "spring", stiffness: 300, damping: 30 },
};
```

### 3.2 Specific Animation Implementations

#### Accordion Expand/Collapse
```typescript
// Already handled by Radix Accordion
// Enhancement: Add height animation
const accordionContent = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};
```

#### Product Grid Stagger
```typescript
const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,  // 50ms between each card
      delayChildren: 0.1      // Start after 100ms
    }
  }
};

const gridItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};
```

#### Page Transition (Filter Change)
```typescript
const pageTransition = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};
```

#### Mobile Sheet Slide
```typescript
const mobileSheet = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  },
  exit: {
    y: "100%",
    transition: { duration: 0.2, ease: "easeIn" }
  }
};
```

#### Filter Chip Animation
```typescript
const chipAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.15 }
  }
};
```

#### Loading Spinner
```typescript
const spinnerRotation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};
```

### 3.3 Hover Micro-interactions

| Element | Hover Effect | Duration |
|---------|--------------|----------|
| Product Card | `translateY(-8px)` + `shadow-xl` | 500ms |
| Category Item | `bg-accent` + `color change` | 150ms |
| Subcategory Item | `color: orange-500` | 150ms |
| Pagination Button | `scale(1.05)` + `shadow-md` | 150ms |
| Filter Chip | `bg change` + subtle `scale(1.02)` | 150ms |
| Quick Add Button | `scale(1.1)` + `bg-orange-600` | 150ms |

### 3.4 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```typescript
// In React components
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const animationProps = prefersReducedMotion
  ? {}
  : { initial, animate, exit };
```

---

## 4. Color Usage Guidelines

### 4.1 Primary Color Palette

| Purpose | Light Mode | Dark Mode | CSS Variable |
|---------|------------|-----------|--------------|
| Primary Action | `#F97316` (orange-500) | `#FB923C` (orange-400) | `--color-primary` |
| Primary Hover | `#EA580C` (orange-600) | `#F97316` (orange-500) | `--color-primary-hover` |
| Primary Light | `#FFEDD5` (orange-100) | `#431407` (orange-950) | `--color-primary-light` |
| Secondary | `#0e182b` (navy-900) | `#1e3a5f` (navy-700) | `--color-secondary` |

### 4.2 Semantic Color Usage

| Element | Color | Reasoning |
|---------|-------|-----------|
| Active Category | `orange-500` | Primary brand, high visibility |
| Selected Subcategory | `orange-500` text + `orange-50` bg | Consistent with active state |
| Pagination Active | `orange-500` solid bg | Clear current page indicator |
| Filter Chip Active | `orange-500` bg | Obvious selection state |
| Hover States | `accent` bg (10% orange) | Subtle feedback without distraction |
| Error States | `#EF4444` (red-500) | Universal error color |
| Success Feedback | `#22C55E` (green-500) | Universal success color |

### 4.3 Background Hierarchy

```
Desktop Layout:
- Page Background: --color-background (#FFFFFF / #0e182b)
- Sidebar Background: --color-background-secondary (#F9FAFB / #1a2744)
- Card Background: --color-background-card (#FFFFFF / #1a2744)
- Overlay Background: rgba(0, 0, 0, 0.5 / 0.7)
```

### 4.4 Border and Divider Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Sidebar Border | `#E5E7EB` (slate-200) | `#374151` (slate-700) |
| Card Border | `#F1F5F9` (slate-100) | `#334155` (slate-800) |
| Divider | `#E5E7EB` | `#374151` |
| Active Border | `#F97316` | `#FB923C` |

### 4.5 Text Color Hierarchy

| Level | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Primary | `#111827` (slate-900) | `#F9FAFB` (slate-50) | Headings, important text |
| Secondary | `#374151` (slate-700) | `#E5E7EB` (slate-200) | Body text |
| Muted | `#6B7280` (slate-500) | `#9CA3AF` (slate-400) | Captions, hints |
| Subtle | `#9CA3AF` (slate-400) | `#6B7280` (slate-500) | Disabled, placeholders |

---

## 5. Typography Hierarchy

### 5.1 Font Family

```css
--font-sans: var(--font-montserrat), system-ui, -apple-system, sans-serif;
```

### 5.2 Type Scale for Menu Page

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Page Title | `text-3xl` (1.875rem) | Bold (700) | 1.25 | -0.01em |
| Section Header | `text-xl` (1.25rem) | Semibold (600) | 1.375 | 0 |
| Category Title | `text-base` (1rem) | Semibold (600) | 1.5 | 0 |
| Subcategory Item | `text-sm` (0.875rem) | Medium (500) | 1.5 | 0 |
| Product Name | `text-lg` (1.125rem) | Bold (700) | 1.25 | 0 |
| Product Description | `text-sm` (0.875rem) | Normal (400) | 1.5 | 0 |
| Product Price | `text-xl` (1.25rem) | Bold (700) | 1 | 0 |
| Badge Text | `text-xs` (0.75rem) | Semibold (600) | 1 | 0 |
| Pagination | `text-sm` (0.875rem) | Medium (500) | 1 | 0 |
| Filter Chip | `text-sm` (0.875rem) | Medium (500) | 1 | 0 |
| Empty State Title | `text-xl` (1.25rem) | Semibold (600) | 1.375 | 0 |
| Empty State Body | `text-base` (1rem) | Normal (400) | 1.5 | 0 |

### 5.3 Responsive Typography Adjustments

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page Title | `text-2xl` | `text-3xl` | `text-3xl` |
| Product Name | `text-base` | `text-lg` | `text-lg` |
| Product Price | `text-lg` | `text-xl` | `text-xl` |

### 5.4 Text Truncation Rules

```css
/* Product Name - Single line ellipsis */
.product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Product Description - 2-line clamp */
.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Category Title - No truncation, wrap allowed */
.category-title {
  word-wrap: break-word;
}
```

---

## 6. Mobile Gesture Considerations

### 6.1 Touch Target Sizes

| Element | Minimum Size | Recommended Size |
|---------|--------------|------------------|
| Category Item | 44px height | 48px height |
| Subcategory Item | 44px height | 44px height |
| Pagination Button | 44x44px | 48x48px |
| Filter Chip | 32px height | 36px height |
| FAB (Filter Button) | 56x56px | 56x56px |
| Quick Add Button | 44x44px | 48x48px |
| Clear Filter (X) | 24x24px + 10px padding | 44x44px tap area |

### 6.2 Gesture Support

| Gesture | Element | Action | Feedback |
|---------|---------|--------|----------|
| Tap | Product Card | Navigate to detail | Ripple effect |
| Long Press | Product Card | Quick preview modal | Haptic + scale down |
| Swipe Left | Filter Chip | Remove filter | Slide out + haptic |
| Swipe Right | Filter Bar | Scroll categories | Momentum scroll |
| Pull Down | Product Grid | Refresh products | Pull indicator + haptic |
| Drag Down | Mobile Sheet | Dismiss filter panel | Follow finger + snap |

### 6.3 Mobile Sheet Behavior

```typescript
const mobileSheetConfig = {
  // Snap points
  snapPoints: [0.5, 0.9],  // 50% and 90% of viewport height
  defaultSnap: 0.5,

  // Drag behavior
  dragElastic: 0.1,
  dragConstraints: { top: 0, bottom: 0 },
  dragThreshold: 50,  // px to trigger dismiss

  // Visual
  borderRadius: "24px 24px 0 0",
  backdropBlur: "8px",
  backdropOpacity: 0.5,

  // Animation
  springConfig: { damping: 30, stiffness: 300 }
};
```

### 6.4 Scroll Behavior

```typescript
const scrollConfig = {
  // Sidebar scroll (desktop)
  sidebarScroll: {
    overscrollBehavior: "contain",
    scrollbarWidth: "thin",
    scrollPadding: "16px"
  },

  // Product grid scroll
  gridScroll: {
    scrollBehavior: "smooth",
    scrollMarginTop: "100px",  // Account for sticky header
    overscrollBehavior: "auto"
  },

  // Filter chips horizontal scroll
  chipScroll: {
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollPadding: "0 16px",
    webkitOverflowScrolling: "touch"
  }
};
```

### 6.5 FAB (Floating Action Button) Positioning

```css
.filter-fab {
  position: fixed;
  bottom: 24px;  /* Account for safe area */
  right: 16px;
  z-index: 1030;  /* var(--z-fixed) */

  /* iOS safe area support */
  bottom: calc(24px + env(safe-area-inset-bottom));
}

/* Hide FAB when keyboard is open */
@media (max-height: 500px) {
  .filter-fab {
    display: none;
  }
}
```

### 6.6 Safe Area Handling

```css
/* Bottom sheet safe area */
.mobile-sheet-content {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

/* Header safe area (notch devices) */
.sticky-header {
  padding-top: env(safe-area-inset-top, 0);
}

/* Filter bar safe area */
.filter-bar {
  padding-left: env(safe-area-inset-left, 16px);
  padding-right: env(safe-area-inset-right, 16px);
}
```

---

## 7. Loading, Error, and Empty States

### 7.1 Loading States

**Skeleton Loader Specifications:**
```typescript
const skeletonConfig = {
  // Colors
  baseColor: "var(--color-background-tertiary)",
  highlightColor: "var(--color-background-secondary)",

  // Animation
  duration: 1.5,
  direction: "left-to-right",

  // Border radius
  textRadius: "4px",
  imageRadius: "12px",
  chipRadius: "9999px"
};
```

**Loading Indicator Placement:**
| Scenario | Indicator Type | Location |
|----------|----------------|----------|
| Initial Load | Full page skeleton | Replace content |
| Pagination | Inline spinner | Center of grid |
| Filter Change | Grid overlay + spinner | Over existing content |
| Infinite Scroll | Bottom spinner | Below last card |

### 7.2 Error State Design

```
+------------------------------------------+
|                                          |
|          [Error Illustration]            |
|               (Pizza slice               |
|                with X mark)              |
|                                          |
|     "Oops! Something went wrong"         |
|                                          |
|   "We couldn't load the menu items.      |
|    Please try again."                    |
|                                          |
|         [  Try Again  ]                  |
|                                          |
|       Need help? Contact support         |
|                                          |
+------------------------------------------+
```

**Error State Specifications:**
- Illustration: Custom pizza-themed SVG (64x64px mobile, 96x96px desktop)
- Title: `text-xl`, `font-semibold`, `text-foreground`
- Description: `text-sm`, `text-muted-foreground`
- CTA Button: Primary variant, full width on mobile
- Help link: Text link, `text-sm`, `text-primary`

### 7.3 Empty State Design

**Scenario: No Products Match Filters**
```
+------------------------------------------+
|                                          |
|          [Empty Illustration]            |
|              (Empty plate                |
|               with fork)                 |
|                                          |
|      "No pizzas found"                   |
|                                          |
|   "Try adjusting your filters or         |
|    browse all our delicious options"     |
|                                          |
|   [  Clear Filters  ]  [ View All ]     |
|                                          |
+------------------------------------------+
```

**Scenario: No Products in Category**
```
+------------------------------------------+
|                                          |
|          [Coming Soon Illustration]      |
|               (Chef with                 |
|                rolling pin)              |
|                                          |
|      "Coming Soon!"                      |
|                                          |
|   "We're cooking up something special    |
|    for this category. Check back soon!"  |
|                                          |
|         [  Explore Menu  ]               |
|                                          |
+------------------------------------------+
```

**Scenario: Search No Results**
```
+------------------------------------------+
|                                          |
|          [Search Illustration]           |
|           (Magnifying glass              |
|            over pizza box)               |
|                                          |
|  "No results for '[search term]'"        |
|                                          |
|   "Try different keywords or check       |
|    out our popular items below"          |
|                                          |
|         [  Clear Search  ]               |
|                                          |
|   --- Popular Items ---                  |
|   [ProductCard] [ProductCard]            |
|                                          |
+------------------------------------------+
```

---

## 8. Accessibility Requirements

### 8.1 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next interactive element |
| `Shift + Tab` | Move focus to previous element |
| `Enter` / `Space` | Activate focused element |
| `Arrow Down/Up` | Navigate within accordion items |
| `Escape` | Close mobile sheet / Clear search |
| `Home` / `End` | Jump to first/last pagination |

### 8.2 Screen Reader Announcements

```typescript
const announcements = {
  filterApplied: (filter: string) =>
    `Filter applied: ${filter}. Showing filtered results.`,

  filterRemoved: (filter: string) =>
    `Filter removed: ${filter}. Results updated.`,

  pageChanged: (page: number, total: number) =>
    `Page ${page} of ${total}. Products updated.`,

  productsLoaded: (count: number) =>
    `${count} products loaded.`,

  noResults: () =>
    `No products found. Try adjusting your filters.`,

  errorOccurred: () =>
    `Error loading products. Please try again.`
};
```

### 8.3 ARIA Attributes

```html
<!-- Category Accordion -->
<button
  aria-expanded="true/false"
  aria-controls="subcategory-list-{id}"
  aria-label="Category: Pizzas, {count} items"
>

<!-- Subcategory List -->
<ul
  id="subcategory-list-{id}"
  role="list"
  aria-label="Subcategories for Pizzas"
>

<!-- Product Grid -->
<section
  role="region"
  aria-label="Product grid"
  aria-live="polite"
  aria-busy="true/false"
>

<!-- Pagination -->
<nav aria-label="Product pagination">
  <button aria-label="Go to page 1" aria-current="page">
  <button aria-label="Go to page 2">
  <button aria-label="Go to previous page" aria-disabled="true">
  <button aria-label="Go to next page">
</nav>

<!-- Mobile Filter Sheet -->
<div
  role="dialog"
  aria-modal="true"
  aria-label="Filter options"
>

<!-- Active Filters -->
<div role="status" aria-live="polite">
  Currently filtering by: Classic Pizza, Under $20
</div>
```

### 8.4 Focus Management

```typescript
const focusManagement = {
  // After filter change
  onFilterChange: () => {
    // Move focus to product grid
    document.getElementById('product-grid')?.focus();
  },

  // After pagination
  onPageChange: () => {
    // Scroll to top and focus first product
    document.getElementById('product-grid')?.scrollIntoView();
    document.querySelector('[data-product-card]')?.focus();
  },

  // Mobile sheet open
  onSheetOpen: () => {
    // Focus first interactive element in sheet
    document.querySelector('[data-sheet-close]')?.focus();
  },

  // Mobile sheet close
  onSheetClose: (triggerElement: HTMLElement) => {
    // Return focus to trigger
    triggerElement.focus();
  }
};
```

---

## 9. Performance Considerations

### 9.1 Critical Rendering Path

| Priority | Element | Strategy |
|----------|---------|----------|
| High | Page shell + Header | Server-rendered |
| High | First 6 product cards | Server-rendered with priority images |
| Medium | Sidebar categories | Server-rendered |
| Medium | Remaining products | Lazy loaded below fold |
| Low | Animations | Progressive enhancement |
| Low | Analytics | Deferred loading |

### 9.2 Image Optimization

```typescript
const imageStrategy = {
  // Product card images
  productCard: {
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    quality: 80,
    priority: false,  // true for first 6 cards
    placeholder: "blur",
    loading: "lazy"
  },

  // Empty state illustrations
  illustration: {
    width: 200,
    height: 200,
    loading: "lazy"
  }
};
```

### 9.3 Bundle Optimization

```typescript
// Dynamic imports for non-critical components
const MobileFilterSheet = dynamic(
  () => import('@/components/menu/sidebar/mobile-filter-sheet'),
  {
    ssr: false,
    loading: () => null
  }
);

// Conditional animation library loading
const MotionDiv = prefersReducedMotion
  ? 'div'
  : motion.div;
```

---

## 10. Component Checklist

### Required Components

- [ ] `MenuPage` - Main server component
- [ ] `MenuPageClient` - Client orchestrator
- [ ] `CategorySidebar` - Server component for categories
- [ ] `CategoryAccordion` - Client accordion behavior
- [ ] `SubcategoryList` - Client subcategory items
- [ ] `MobileFilterSheet` - Bottom sheet filter panel
- [ ] `FilterTrigger` - FAB button for mobile
- [ ] `ActiveFilters` - Horizontal scrollable chips
- [ ] `ProductGridContainer` - Server product fetching
- [ ] `ProductGrid` - Client grid rendering
- [ ] `ProductPagination` - Page navigation
- [ ] `MenuLoading` - Skeleton loading state
- [ ] `MenuError` - Error boundary fallback
- [ ] `MenuEmpty` - Empty state with CTA
- [ ] `SkipLink` - Accessibility skip navigation

### Design Assets Needed

- [ ] Empty state illustration (no results)
- [ ] Empty state illustration (coming soon)
- [ ] Error state illustration
- [ ] Loading spinner animation
- [ ] Category icons (optional)

---

## 11. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to Interactive | < 3s | Lighthouse |
| First Contentful Paint | < 1.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Filter Response Time | < 200ms | User perception |
| Accessibility Score | 100 | Lighthouse |
| Mobile Usability | Pass all checks | Google Mobile Test |

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: Premium UX Designer Agent*
