# PizzaSpace Home Page Complete Redesign - Execution Plan

## Executive Summary

This document outlines a comprehensive multi-phase execution plan for redesigning the PizzaSpace home page. The redesign draws inspiration from four premium food commerce designs and aims to elevate the current functional design into a modern, premium e-commerce experience.

### Project Overview

| Attribute | Details |
|-----------|---------|
| **Project** | PizzaSpace Home Page Redesign |
| **Framework** | Next.js 16 with App Router, React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Primary Color** | Orange (#F97316) |
| **Secondary Color** | Navy (#0e182b) |
| **Total Sections** | 12 (11 redesigns + 1 new section) |
| **Estimated Complexity** | High |
| **Dark Mode** | Required (next-themes configured) |

### Design Inspirations Analysis

**Design 1 (design.jpg) - Orange/Yellow Theme:**
- Floating product cards with badges
- Search bar prominent in hero
- Stats badges ("50+ Orders", "30min Delivery")
- Chef image with awards counter
- Promo section with discount codes

**Design 2 (pizzad.jpg) - Green/Cream Elegant:**
- Split hero with person + pizza imagery
- Dual CTA buttons pattern
- Delivery service info cards
- Category filter tabs with icons
- Product cards with weights
- Map integration for delivery zones
- Restaurant reservation form
- Emoji feedback selector

**Design 3 (pizzadesign.jpg) - Red/Cream Theme:**
- Hero carousel with category badges
- Horizontal category scroll
- About section with quality badges
- Countdown timer promo banner
- Master chefs section
- Contact form with image gallery

**Design 4 (pd.png) - Warm Minimalist:**
- Dynamic hero with stats counters
- Horizontal menu with prices
- Chef profiles
- Clean testimonials layout

---

## Section-by-Section Breakdown

---

## SECTION 1: Header & Navigation

### Current State
- Sticky header with slate-800 background
- Logo, nav links, icons (cart, user)
- Basic mobile hamburger menu
- No theme toggle
- No search functionality

### Target State (Inspired by Design 1 & 2)
- Transparent header on hero, solid on scroll
- Theme toggle (light/dark)
- Integrated search with command palette
- Enhanced mobile drawer with categories
- Delivery info bar (hours, phone)
- User account dropdown

### Complexity: Medium

### Phases

#### Phase 1.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`, `puppeteer`

```prompt
Research premium food commerce header patterns. Focus on:
1. Transparent-to-solid scroll behavior
2. Search integration patterns (command palette vs inline)
3. Mobile navigation drawer designs
4. Theme toggle placement and animation
5. Top info bar patterns (delivery hours, phone)

Provide:
- UX flow for header state transitions
- Mobile vs desktop interaction differences
- Animation timing recommendations
- Accessibility considerations for navigation
```

**Expected Output:** Header UX specifications document
**Handoff:** Requirements for component analysis

#### Phase 1.2: Component Analysis
**Agent:** `shadcn-requirements-analyzer`
**MCP Tools:** `shadcn`

```prompt
Analyze header redesign requirements and map to shadcn components:

Required Features:
- Transparent/solid scroll transition
- Command palette search (Cmd+K)
- Theme toggle switch
- Mobile navigation drawer
- User account dropdown
- Cart badge with count
- Top info bar

Create requirements.md with:
- Component hierarchy
- shadcn components needed (Sheet, Command, DropdownMenu, Switch)
- State management needs
- Event handlers required
```

**Expected Output:** Component requirements document
**Handoff:** Component list for research

#### Phase 1.3: Component Research
**Agent:** `shadcn-component-researcher`
**MCP Tools:** `shadcn`

```prompt
Research shadcn components for header:
1. Sheet - for mobile navigation drawer
2. Command - for search command palette
3. DropdownMenu - for user account
4. Switch - for theme toggle
5. NavigationMenu - for desktop nav

Get installation commands and usage examples for each.
Research animation patterns for scroll-based header transitions.
```

**Expected Output:** Component documentation and examples
**Handoff:** Architecture planning

#### Phase 1.4: Architecture Planning
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Design header component architecture:

Components:
- Header (Server Component wrapper)
- HeaderClient (Client - scroll behavior)
- TopInfoBar (Server - static info)
- Logo (Server)
- DesktopNav (Server)
- MobileDrawer (Client - Sheet)
- SearchCommand (Client - Command palette)
- ThemeToggle (Client - Switch)
- UserDropdown (Client - DropdownMenu)
- CartBadge (Client - real-time count)

Define:
- Server vs Client boundaries
- Props interfaces
- State management (scroll position, open states)
- Event handlers
```

**Expected Output:** Component architecture document
**Handoff:** Implementation

#### Phase 1.5: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`, `21st-dev`

```prompt
Implement redesigned header with:

1. TopInfoBar: Delivery hours, phone, social links
2. MainHeader with scroll behavior:
   - Transparent on hero (text-white)
   - Solid bg-background on scroll
   - Smooth transition animation
3. SearchCommand with Cmd+K shortcut
4. ThemeToggle with sun/moon icons
5. MobileDrawer with full navigation + categories
6. UserDropdown with account links

Use CSS variables for theming.
Implement useScrollPosition hook.
```

**Expected Output:** Implemented header components
**Handoff:** Mobile optimization

#### Phase 1.6: Mobile Optimization
**Agent:** `nextjs-responsive-design`
**MCP Tools:** `playwright`

```prompt
Optimize header for mobile:
1. Collapse nav to hamburger at md breakpoint
2. Mobile drawer with:
   - Search input at top
   - Category quick links
   - Full navigation
   - Theme toggle
   - Cart link with badge
3. Touch-friendly tap targets (min 44px)
4. Info bar hidden on mobile or condensed
5. Sticky behavior on mobile

Test with viewport sizes: 320px, 375px, 414px, 768px
```

**Expected Output:** Mobile-optimized header
**Handoff:** Animation polish

#### Phase 1.7: Animation & Polish
**Agent:** `nextjs-animation-specialist`
**MCP Tools:** `21st-dev`

```prompt
Add header micro-interactions:
1. Scroll transition: opacity + backdrop-blur + shadow
2. Search command: scale + fade entrance
3. Mobile drawer: slide from right with overlay
4. Theme toggle: rotate sun/moon with color shift
5. Dropdown: scale + fade with stagger
6. Cart badge: bounce on count change

Use Framer Motion or CSS transitions.
Respect prefers-reduced-motion.
```

**Expected Output:** Animated header components
**Handoff:** Accessibility audit

#### Phase 1.8: Accessibility Audit
**Agent:** `nextjs-accessibility-expert`
**MCP Tools:** `playwright`

```prompt
Audit header accessibility:
1. Skip to main content link
2. Keyboard navigation (Tab, Escape, Arrow keys)
3. ARIA labels for all interactive elements
4. Focus trap in mobile drawer
5. Screen reader announcements for:
   - Theme change
   - Search results
   - Cart count updates
6. Color contrast in both themes
7. Focus visible styles

Provide WCAG 2.1 AA compliance checklist.
```

**Expected Output:** Accessibility audit report
**Handoff:** Review

#### Phase 1.9: Review & Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review header implementation:
1. Code quality and patterns
2. Performance (no layout shift)
3. Bundle size impact
4. Cross-browser testing
5. Dark mode completeness
6. Mobile usability testing

Create test cases for:
- Scroll behavior
- Search functionality
- Theme persistence
- Mobile drawer
```

**Expected Output:** Review report with fixes
**Success Criteria:**
- [ ] Smooth scroll transition
- [ ] Search works with Cmd+K
- [ ] Theme persists on reload
- [ ] Mobile drawer accessible
- [ ] All ARIA labels present
- [ ] Dark mode complete

---

## SECTION 2: Hero Section

### Current State
- Embla carousel with gradient overlay
- Centered text content
- Single CTA button
- Slide indicators at bottom
- Play/pause control

### Target State (Inspired by Design 1 & 2)
- Dynamic split layout with:
  - Left: Headline, description, search bar, badges
  - Right: Hero image with floating product cards
- Stats badges ("50+ Orders", "30min Delivery")
- Dual CTA buttons ("Order Now" + "View Menu")
- Animated floating elements
- Background shapes/patterns

### Complexity: High

### Phases

#### Phase 2.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`, `puppeteer`

```prompt
Design premium hero section with:
1. Split layout (content left, imagery right)
2. Floating product card overlays
3. Animated badge elements
4. Search bar integration
5. Stats counters with icons
6. Background decorative shapes

Provide:
- Visual hierarchy recommendations
- Animation choreography for entrance
- Mobile layout adaptation (stacked)
- Conversion optimization suggestions
```

**Expected Output:** Hero UX specifications
**Handoff:** Requirements analysis

#### Phase 2.2: Component Analysis
**Agent:** `shadcn-requirements-analyzer`
**MCP Tools:** `shadcn`

```prompt
Analyze hero section requirements:

Elements needed:
- HeroSection container
- HeroContent (headline, description)
- HeroSearch (search input + button)
- HeroBadges (stats badges)
- HeroCTA (dual buttons)
- HeroImage (main image)
- FloatingCards (product preview cards)
- BackgroundShapes (decorative elements)

Map to components:
- Input, Button from shadcn
- Badge for stats
- Card for floating products
```

**Expected Output:** Component requirements
**Handoff:** Research

#### Phase 2.3: Component Research
**Agent:** `shadcn-component-researcher`
**MCP Tools:** `shadcn`, `21st-dev`

```prompt
Research components for hero:
1. Input - for search field
2. Button - primary and secondary variants
3. Badge - for stats display
4. Card - for floating product cards

Research from 21st.dev:
- Hero section patterns
- Floating card animations
- Background shape components
```

**Expected Output:** Component examples
**Handoff:** Architecture

#### Phase 2.4: Architecture Planning
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Design hero architecture:

Server Components:
- HeroSection (wrapper)
- HeroContent (static content)
- HeroImage (optimized Image)

Client Components:
- HeroSearch (search with state)
- FloatingCards (animated)
- BackgroundShapes (animated)
- HeroStats (animated counters)

Define:
- Image optimization strategy
- Animation trigger points
- Search form handling
- Responsive breakpoints
```

**Expected Output:** Architecture document
**Handoff:** Implementation

#### Phase 2.5: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`, `21st-dev`

```prompt
Build hero section:

1. Split grid layout (lg:grid-cols-2)
2. Left side:
   - Badge: "Pizza Space Restaurant"
   - H1: "Freshness in every bite."
   - Description paragraph
   - Search bar with location icon
   - Stats row: Orders, Delivery Time, Rating
   - Dual CTAs: "Order Now" (primary) + "View Menu" (outline)

3. Right side:
   - Main hero image (optimized)
   - Floating product card (top-right)
   - Floating delivery badge (bottom)
   - Decorative orange circle shapes

Use CSS Grid and absolute positioning.
Implement with dark mode support.
```

**Expected Output:** Hero components
**Handoff:** Mobile optimization

#### Phase 2.6: Mobile Optimization
**Agent:** `nextjs-responsive-design`
**MCP Tools:** `playwright`

```prompt
Optimize hero for mobile:
1. Stack layout (image on top, content below)
2. Reduce image height on mobile
3. Hide some floating elements on small screens
4. Simplify stats to icons only
5. Full-width search bar
6. Stack CTA buttons vertically
7. Adjust typography scale

Breakpoints:
- Mobile: < 640px (stacked, simplified)
- Tablet: 640-1024px (adjusted grid)
- Desktop: > 1024px (full layout)
```

**Expected Output:** Responsive hero
**Handoff:** Animation

#### Phase 2.7: Animation & Polish
**Agent:** `nextjs-animation-specialist`
**MCP Tools:** `21st-dev`

```prompt
Add hero animations:
1. Content entrance: staggered fade-up
2. Floating cards: gentle float animation
3. Background shapes: slow rotation/pulse
4. Stats counters: count-up animation
5. Search bar: subtle pulse on focus
6. CTA hover: scale + shadow

Choreography:
- Badge fades in first
- Title types or fades in
- Description follows
- Search + stats appear together
- CTAs slide up last
- Floating elements animate continuously

Use Intersection Observer for trigger.
```

**Expected Output:** Animated hero
**Handoff:** Accessibility

#### Phase 2.8: Accessibility Audit
**Agent:** `nextjs-accessibility-expert`
**MCP Tools:** `playwright`

```prompt
Audit hero accessibility:
1. Semantic HTML (main, h1, form)
2. Search form labels
3. Image alt text
4. Button labels for CTAs
5. Decorative images marked aria-hidden
6. Animation respects reduced motion
7. Color contrast on overlaid text
8. Focus order logical

Test with screen reader.
```

**Expected Output:** Accessibility report
**Handoff:** Review

#### Phase 2.9: Review & Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review hero section:
1. LCP optimization (hero image)
2. CLS prevention
3. Code splitting effectiveness
4. Dark mode completeness
5. Cross-browser rendering
6. Mobile usability

Performance budget:
- Hero image < 200KB
- LCP < 2.5s
- No layout shift
```

**Expected Output:** Review report
**Success Criteria:**
- [ ] LCP < 2.5s
- [ ] No CLS
- [ ] Search functional
- [ ] Animations smooth (60fps)
- [ ] Mobile layout correct
- [ ] Dark mode complete

---

## SECTION 3: Delivery Service Info (NEW SECTION)

### Current State
- Does not exist

### Target State (Inspired by Design 2)
- Three info cards in a row:
  1. Delivery Hours (09:00 - 23:00)
  2. Delivery Time (40-90 min)
  3. Free Delivery (orders over $50)
- Icons for each card
- Subtle background

### Complexity: Low

### Phases

#### Phase 3.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design delivery info section:
1. Three-card horizontal layout
2. Icon + title + value format
3. Subtle differentiation from hero
4. Trust-building purpose

Provide card content:
- Working hours with clock icon
- Delivery time range with truck icon
- Free delivery threshold with gift icon
```

**Expected Output:** Design specs
**Handoff:** Implementation

#### Phase 3.2: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build delivery info section:

1. Section with subtle background (amber-50)
2. Three-column grid
3. Each card:
   - Icon in orange circle
   - Title (muted text)
   - Value (bold, larger)
4. Responsive: stack on mobile

Components:
- Card from shadcn (subtle variant)
- Lucide icons: Clock, Truck, Gift
```

**Expected Output:** DeliveryInfoSection component
**Handoff:** Mobile + A11y

#### Phase 3.3: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile: Stack cards vertically, reduce padding
Accessibility:
- Semantic list markup
- Icon labels for screen readers
- Sufficient color contrast
```

**Expected Output:** Optimized section
**Success Criteria:**
- [ ] Cards stack on mobile
- [ ] Icons have labels
- [ ] Dark mode support

---

## SECTION 4: Categories Section

### Current State
- Horizontal Embla carousel
- Category cards with circular images
- Basic hover effect
- "Popular Categories" header

### Target State (Inspired by Design 2 & 3)
- Interactive tab/pill selector
- Category icons with labels
- Active state highlighting
- Filter functionality (connect to menu)
- Horizontal scroll with arrows

### Complexity: Medium

### Phases

#### Phase 4.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design category selector:
1. Pill-style horizontal tabs
2. Icon + text per category
3. Active state with background color
4. Filter icons (vegetarian, spicy, etc.)
5. Smooth scroll with arrow buttons

Reference Design 2 category tabs:
Pizza, Main Dishes, Side Dish, Salads, Desserts, Drinks
```

**Expected Output:** Category UX specs
**Handoff:** Requirements

#### Phase 4.2: Component Analysis
**Agent:** `shadcn-requirements-analyzer`
**MCP Tools:** `shadcn`

```prompt
Map categories to components:
- Tabs or custom pill buttons
- ScrollArea for horizontal scroll
- Button for arrow controls
- Badge for item counts

State management:
- Active category
- Scroll position
- Filter tags
```

**Expected Output:** Requirements
**Handoff:** Implementation

#### Phase 4.3: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build categories section:

1. Section header with badge + title
2. Scrollable pill container:
   - Each pill: icon + category name
   - Active state: bg-primary text-white
   - Inactive: bg-muted hover:bg-muted/80
3. Arrow buttons at edges (hidden when at end)
4. Connect to menu section filtering

Use useRef for scroll container.
Implement smooth scroll behavior.
```

**Expected Output:** CategoriesSection component
**Handoff:** Animation

#### Phase 4.4: Animation & Polish
**Agent:** `nextjs-animation-specialist`

```prompt
Add category animations:
1. Active pill: scale + color transition
2. Scroll: smooth with easing
3. Arrow fade in/out based on scroll position
4. Category icon: subtle bounce on select
```

**Expected Output:** Animated categories
**Handoff:** Mobile + A11y

#### Phase 4.5: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Touch-friendly swipe scroll
- Larger tap targets
- Hide arrows, rely on swipe

Accessibility:
- role="tablist" for pills
- aria-selected for active
- Keyboard navigation (arrows)
```

**Expected Output:** Final categories section
**Success Criteria:**
- [ ] Smooth horizontal scroll
- [ ] Active state visible
- [ ] Keyboard navigable
- [ ] Touch swipe works
- [ ] Dark mode complete

---

## SECTION 5: Menu Section

### Current State
- Tab-based category filtering
- Product grid with circular images
- Basic product cards
- Load more functionality
- API integration with fallback

### Target State (Inspired by Design 2)
- Enhanced product cards:
  - Square/rounded images
  - Weight/size info
  - Quick add button
  - Rating display
- Filter tabs synced with categories
- "Go to Menu" CTA
- Improved grid layout

### Complexity: High

### Phases

#### Phase 5.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design premium product cards:
1. Card layout: image, name, description, weight, price, CTA
2. Quick add button with cart icon
3. Rating stars display
4. Hover state with shadow lift
5. Tag badges (vegetarian, spicy, new)

Reference Design 2 pizza cards:
- Weight display (500g, 45cm)
- Price with currency
- Order button
```

**Expected Output:** Product card specs
**Handoff:** Requirements

#### Phase 5.2: Component Analysis
**Agent:** `shadcn-requirements-analyzer`
**MCP Tools:** `shadcn`

```prompt
Map menu section to components:
- Card for product container
- Badge for tags
- Button for add to cart
- Tabs for category filter
- Custom Rating component

State:
- Selected category
- Products array
- Loading state
- Cart operations
```

**Expected Output:** Requirements
**Handoff:** Architecture

#### Phase 5.3: Architecture Planning
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Menu section architecture:

Server Components:
- MenuSection (data fetching)

Client Components:
- MenuContent (filtering, state)
- MenuTabs (category selection)
- ProductGrid (virtualized list)
- ProductCard (individual items)
- AddToCartButton (with optimistic UI)

Data flow:
- Initial products from server
- Client-side filtering by category
- Cart actions via server actions
```

**Expected Output:** Architecture
**Handoff:** Implementation

#### Phase 5.4: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build menu section:

1. Section header: "Our Special Menu"
2. Category tabs (synced with Section 4)
3. Product grid (responsive columns):
   - 1 col mobile
   - 2 cols tablet
   - 4 cols desktop
4. ProductCard:
   - Image (aspect-square, rounded-lg)
   - Name (font-semibold)
   - Weight badge
   - Description (line-clamp-2)
   - Price (text-primary font-bold)
   - Add button (icon + text)
5. "View Full Menu" CTA button

Keep server component for initial data.
```

**Expected Output:** Menu components
**Handoff:** Animation

#### Phase 5.5: Animation & Polish
**Agent:** `nextjs-animation-specialist`

```prompt
Menu animations:
1. Card hover: translateY(-4px) + shadow
2. Add button: scale on click
3. Tab switch: content fade transition
4. Grid items: stagger fade-in on load
5. Quick add: cart icon flies to header
```

**Expected Output:** Animated menu
**Handoff:** Mobile + A11y

#### Phase 5.6: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Horizontal scroll for tabs
- 2-column grid minimum
- Larger touch targets for add button

Accessibility:
- Product cards as article elements
- Add button with aria-label
- Price announced properly
- Tab panel associations
```

**Expected Output:** Final menu section
**Success Criteria:**
- [ ] Products display correctly
- [ ] Filtering works
- [ ] Add to cart functional
- [ ] Responsive grid
- [ ] Keyboard accessible
- [ ] Dark mode complete

---

## SECTION 6: Promo/Offer Section (NEW SECTION)

### Current State
- Does not exist

### Target State (Inspired by Design 1 & 3)
- Eye-catching banner with:
  - Promotional text
  - Discount code input/display
  - Countdown timer (optional)
  - Food imagery
- CTA to apply discount

### Complexity: Medium

### Phases

#### Phase 6.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design promo section:
1. Full-width banner with gradient background
2. Left: promo text + discount code
3. Right: food image or illustration
4. Optional countdown timer
5. CTA button

Reference Design 1: "Limited offer By Using This Promo Code 20% Discount"
Reference Design 3: "Save Up To 50% Off" with countdown
```

**Expected Output:** Promo specs
**Handoff:** Implementation

#### Phase 6.2: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build promo section:

1. Section with gradient bg (primary to primary-dark)
2. Grid layout (text left, image right)
3. Content:
   - "Limited Time Offer" badge
   - "Save 20% on Your First Order"
   - Promo code display with copy button
   - "Order Now" CTA
4. Optional: Countdown timer component
5. Background food image with overlay

Dark mode: adjust gradient colors
```

**Expected Output:** PromoSection component
**Handoff:** Animation

#### Phase 6.3: Animation & Countdown
**Agent:** `nextjs-animation-specialist`

```prompt
Promo animations:
1. Countdown timer: flip animation for numbers
2. Promo code: shimmer effect
3. Copy button: checkmark confirmation
4. Section entrance: slide up on scroll

Countdown logic:
- Set end date
- Calculate days, hours, minutes, seconds
- Update every second
- Show "Offer Expired" when done
```

**Expected Output:** Animated promo
**Handoff:** Mobile + A11y

#### Phase 6.4: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Stack layout vertically
- Center text
- Hide or reduce image

Accessibility:
- Promo code in accessible format
- Copy button announces success
- Countdown has aria-live
```

**Expected Output:** Final promo section
**Success Criteria:**
- [ ] Promo code copyable
- [ ] Countdown works (if used)
- [ ] Responsive layout
- [ ] Dark mode gradient
- [ ] Screen reader friendly

---

## SECTION 7: About Section

### Current State
- Two-column layout
- Image on left, content on right
- Highlight cards (experience, customers, chefs)
- Basic styling

### Target State (Inspired by Design 1 & 3)
- Chef/team imagery
- Stats counters (animated)
- Quality badges (Best Quality, Qualified Chef)
- Awards indicator
- Bullet points with checkmarks
- "Learn More" CTA

### Complexity: Medium

### Phases

#### Phase 7.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design about section:
1. Image of chef or team
2. "About Us" badge
3. Compelling headline
4. Paragraph with mission
5. Bullet points with icons:
   - Fresh ingredients
   - Qualified chefs
   - Fast delivery
6. Stats counters: Years, Awards, Customers
7. "Learn More" button

Reference Design 1 About section with chef image and 35+ awards badge
```

**Expected Output:** About specs
**Handoff:** Implementation

#### Phase 7.2: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build about section:

1. Two-column grid (image left, content right)
2. Image:
   - Chef photo with decorative background shape
   - Floating awards badge
3. Content:
   - "About Us" badge
   - H2: "The best way to find yourself is to lose in the service of others"
   - Description paragraph
   - Feature list with check icons
   - Animated stats row
   - "Learn More" button
```

**Expected Output:** AboutSection component
**Handoff:** Animation

#### Phase 7.3: Animation & Counters
**Agent:** `nextjs-animation-specialist`

```prompt
About animations:
1. Image: parallax or subtle float
2. Content: stagger fade-in on scroll
3. Stats: count-up animation (0 to value)
4. Checkmarks: sequential appear
5. Awards badge: gentle pulse

Use react-countup or custom hook for counters.
Trigger on intersection.
```

**Expected Output:** Animated about
**Handoff:** Mobile + A11y

#### Phase 7.4: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Stack image above content
- Reduce image size
- Horizontal scroll for stats on very small screens

Accessibility:
- Proper heading hierarchy
- List semantics for features
- Counter values announced at end
```

**Expected Output:** Final about section
**Success Criteria:**
- [ ] Image optimized
- [ ] Counters animate
- [ ] Responsive layout
- [ ] Dark mode complete
- [ ] Screen reader friendly

---

## SECTION 8: Awards Section

### Current State
- Four-column grid of award cards
- Trophy icon
- Title and source

### Target State
- Maintain similar structure
- Add animation on scroll
- Improve visual design
- Optional: Logo images for awards

### Complexity: Low

### Phases

#### Phase 8.1: Implementation Enhancement
**Agent:** `shadcn-implementation-builder`

```prompt
Enhance awards section:
1. Keep grid layout
2. Update card design:
   - Larger icon or award image
   - Subtle gradient background
   - Hover lift effect
3. Add count badge if applicable
4. Improve typography
```

**Expected Output:** Enhanced AwardsSection
**Handoff:** Animation + A11y

#### Phase 8.2: Animation & Accessibility
**Agent:** `nextjs-animation-specialist`, `nextjs-accessibility-expert`

```prompt
Animation:
- Stagger fade-in on scroll
- Hover: scale + shadow

Accessibility:
- Proper list semantics
- Award descriptions for screen readers
```

**Expected Output:** Final awards section
**Success Criteria:**
- [ ] Animations work
- [ ] Dark mode complete
- [ ] Accessible

---

## SECTION 9: Mission & Vision Section

### Current State
- Two-column grid
- Mission and Vision cards
- Icon + title + description

### Target State
- Combine with or replace About section content
- OR enhance with better visual design
- Add subtle background pattern

### Complexity: Low

### Phases

#### Phase 9.1: Design Decision
**Agent:** `premium-ux-designer`

```prompt
Evaluate mission/vision section:
1. Keep separate or merge with About?
2. If keep: enhance card design
3. Add decorative elements
4. Consider parallax background

Recommendation needed.
```

**Expected Output:** Design decision
**Handoff:** Implementation if keeping

#### Phase 9.2: Implementation (if keeping)
**Agent:** `shadcn-implementation-builder`

```prompt
Enhance mission/vision:
1. Improved card design
2. Icon in colored circle
3. Better typography hierarchy
4. Subtle hover effect
5. Background pattern or gradient
```

**Expected Output:** Enhanced section
**Success Criteria:**
- [ ] Visual improvement
- [ ] Dark mode complete

---

## SECTION 10: Testimonials Section

### Current State
- Embla carousel
- Quote + author name/role
- Dot indicators
- Basic card design

### Target State (Inspired by Design 2 & 3)
- Customer photos
- Star ratings
- Larger quote display
- Happy Customers count
- Emoji rating selector (optional)
- Navigation arrows

### Complexity: Medium

### Phases

#### Phase 10.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design testimonials section:
1. Carousel with customer photos
2. Star rating display
3. Quote with decorative marks
4. Customer name and role
5. Navigation arrows + dots
6. "Happy Customers" counter badge

Reference Design 2: emoji feedback selector + customer count with rating
Reference Design 3: arrow navigation + quote format
```

**Expected Output:** Testimonials specs
**Handoff:** Implementation

#### Phase 10.2: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build testimonials section:

1. Section header with badge + title
2. Happy Customers counter (10,000+ with 4.9 rating)
3. Carousel:
   - Customer photo (rounded)
   - Star rating
   - Quote text
   - Name and role
4. Navigation:
   - Prev/Next arrows
   - Dot indicators
5. Auto-play with pause on hover
```

**Expected Output:** TestimonialsSection
**Handoff:** Animation

#### Phase 10.3: Animation & Polish
**Agent:** `nextjs-animation-specialist`

```prompt
Testimonial animations:
1. Carousel slide: fade + slight translateX
2. Stars: sequential fill on view
3. Quote marks: subtle float
4. Counter: count-up animation
5. Arrow hover: scale
```

**Expected Output:** Animated testimonials
**Handoff:** Mobile + A11y

#### Phase 10.4: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Single testimonial visible
- Swipe navigation
- Smaller photos

Accessibility:
- role="group" for carousel
- aria-live for slide changes
- Keyboard navigation
- Pause control
```

**Expected Output:** Final testimonials
**Success Criteria:**
- [ ] Carousel smooth
- [ ] Ratings display
- [ ] Keyboard navigable
- [ ] Mobile swipe works
- [ ] Dark mode complete

---

## SECTION 11: Store Locator / Reservation Section

### Current State
- Grid of store cards
- Address, phone, hours
- Basic styling

### Target State (Inspired by Design 2)
- Map integration (optional)
- Store list with selection
- Reservation form:
  - Restaurant selector
  - Date picker
  - Time picker
  - Guests count
- "Book Now" CTA

### Complexity: High

### Phases

#### Phase 11.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design store/reservation section:
1. Split layout: map/image left, content right
2. Store list or dropdown
3. Reservation form fields:
   - Restaurant
   - Date
   - Time
   - Number of guests
4. "Book Now" button
5. OR simple store cards with "Get Directions" CTA

Reference Design 2 restaurant reservation form
```

**Expected Output:** Store section specs
**Handoff:** Implementation

#### Phase 11.2: Component Research
**Agent:** `shadcn-component-researcher`
**MCP Tools:** `shadcn`

```prompt
Research form components:
1. Select - for restaurant/guests
2. Calendar + DatePicker - for date
3. Input - for time
4. Button - submit
5. Card - for store display
```

**Expected Output:** Component docs
**Handoff:** Implementation

#### Phase 11.3: Implementation
**Agent:** `shadcn-implementation-builder`, `nextjs-forms-expert`
**MCP Tools:** `shadcn`

```prompt
Build store/reservation section:

1. Section with decorative background
2. Left side: restaurant image or map placeholder
3. Right side:
   - "We invite you to visit our restaurant"
   - Reservation form:
     - Restaurant Select
     - Date Picker
     - Time Select
     - Guests Select
   - "Book Now" button
4. OR store cards grid with simplified view

Use react-hook-form for form handling.
Add validation.
```

**Expected Output:** StoreSection with form
**Handoff:** Mobile + A11y

#### Phase 11.4: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Stack layout
- Full-width form fields
- Native date/time pickers on mobile

Accessibility:
- Form labels
- Error messages
- Required field indicators
- Calendar keyboard navigation
```

**Expected Output:** Final store section
**Success Criteria:**
- [ ] Form validates
- [ ] Date picker works
- [ ] Responsive layout
- [ ] Keyboard accessible
- [ ] Dark mode complete

---

## SECTION 12: Contact Section

### Current State
- Three contact cards (phone, email, address)
- CTA to full contact page

### Target State (Inspired by Design 3)
- Contact form inline
- Map or image
- Contact info cards
- Social links

### Complexity: Medium

### Phases

#### Phase 12.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design contact section:
1. Split layout: image/map left, form right
2. Contact form:
   - Name
   - Email
   - Phone (optional)
   - Message
   - Submit button
3. Contact info below or beside
4. Social media links

Reference Design 3 contact form layout
```

**Expected Output:** Contact specs
**Handoff:** Implementation

#### Phase 12.2: Implementation
**Agent:** `nextjs-forms-expert`
**MCP Tools:** `shadcn`

```prompt
Build contact section:

1. Section with subtle background
2. Grid layout (image + form)
3. Contact form:
   - Input: Name
   - Input: Email
   - Input: Phone
   - Textarea: Message
   - Button: Submit
4. Server action for form submission
5. Toast notification on success/error
6. Contact cards below form

Use react-hook-form + zod for validation.
```

**Expected Output:** ContactSection with form
**Handoff:** Mobile + A11y

#### Phase 12.3: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Stack layout
- Full-width inputs

Accessibility:
- All inputs labeled
- Error messages associated
- Form submission announced
- Required fields marked
```

**Expected Output:** Final contact section
**Success Criteria:**
- [ ] Form submits
- [ ] Validation works
- [ ] Toast shows
- [ ] Responsive
- [ ] Accessible

---

## SECTION 13: Footer

### Current State
- Four-column grid
- Logo + contact info
- Quick links
- Legal links
- Social links
- Copyright bar

### Target State (Inspired by Design 1 & 2)
- Enhanced multi-column layout
- Newsletter signup form
- Opening hours
- Payment methods icons
- App download links (optional)
- Improved styling

### Complexity: Medium

### Phases

#### Phase 13.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`

```prompt
Design footer:
1. Multi-column layout (5+ columns on desktop)
2. Columns:
   - Logo + description + social
   - Quick Links
   - Services/Categories
   - Legal/Support
   - Newsletter signup
3. Opening hours display
4. Payment method icons
5. App store badges (optional)
6. Copyright bar with additional links

Reference Design 2 comprehensive footer
```

**Expected Output:** Footer specs
**Handoff:** Implementation

#### Phase 13.2: Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Build footer:

1. Main footer with bg-secondary
2. Grid layout:
   - Col 1: Logo, description, social icons
   - Col 2: Quick Links list
   - Col 3: Categories list
   - Col 4: Support list
   - Col 5: Newsletter (email input + subscribe button)
3. Bottom section:
   - Opening hours
   - Payment icons (Visa, MC, PayPal)
4. Copyright bar

Use Input + Button for newsletter.
Icons for social/payment.
```

**Expected Output:** Footer component
**Handoff:** Mobile + A11y

#### Phase 13.3: Mobile & Accessibility
**Agent:** `nextjs-responsive-design`, `nextjs-accessibility-expert`

```prompt
Mobile:
- Stack columns vertically
- Accordion for link sections
- Full-width newsletter form

Accessibility:
- Navigation landmarks
- Link lists properly marked
- Newsletter form labeled
- Social icons labeled
```

**Expected Output:** Final footer
**Success Criteria:**
- [ ] Newsletter works
- [ ] Links functional
- [ ] Responsive stacking
- [ ] Dark mode complete
- [ ] Accessible

---

## Dependencies & Execution Order

### Phase Dependencies Graph

```
Header ─────────────────────────────────────────────────────────┐
                                                                │
Hero ──────────────────┬───────────────────────────────────────┐│
                       │                                        ││
Delivery Info ─────────┤                                        ││
                       │                                        ││
Categories ────────────┼── Menu (sync filtering) ──────────────┐││
                       │                                       │││
Promo ─────────────────┤                                       │││
                       │                                       │││
About ─────────────────┤                                       │││
                       │                                       │││
Awards ────────────────┤                                       │││
                       │                                       │││
Mission/Vision ────────┤                                       │││
                       │                                       │││
Testimonials ──────────┤                                       │││
                       │                                       │││
Store/Reservation ─────┤                                       │││
                       │                                       │││
Contact ───────────────┤                                       │││
                       │                                       │││
Footer ────────────────┴───────────────────────────────────────┴┴┴─► Complete
```

### Recommended Execution Order

**Sprint 1: Foundation (Week 1)**
1. Header & Navigation (critical path)
2. Hero Section (above the fold)
3. Delivery Info (quick win)

**Sprint 2: Core Content (Week 2)**
4. Categories Section
5. Menu Section (depends on categories)
6. Promo Section (quick win)

**Sprint 3: Trust & Social Proof (Week 3)**
7. About Section
8. Awards Section
9. Testimonials Section

**Sprint 4: Conversion & Footer (Week 4)**
10. Store/Reservation Section
11. Contact Section
12. Footer
13. Mission/Vision (optional - may merge with About)

### Parallel Opportunities

These can run in parallel:
- Delivery Info + Hero (no dependencies)
- About + Awards + Mission/Vision (independent)
- Promo + Testimonials (independent)
- Contact + Footer (both are endpoints)

---

## MCP Tools Summary

| Tool | Usage |
|------|-------|
| `21st-dev` | UI component inspiration, building components |
| `shadcn` | Component installation, examples, docs |
| `playwright` | Testing, screenshots, mobile verification |
| `puppeteer` | Design research, visual testing |
| `next-devtools` | Runtime debugging, error checking |

### Tool Usage by Phase

| Phase | Primary Tools |
|-------|---------------|
| Design Research | `21st-dev`, `puppeteer` |
| Component Analysis | `shadcn` |
| Architecture | `next-devtools` |
| Implementation | `shadcn`, `21st-dev` |
| Mobile Optimization | `playwright` |
| Animation | `21st-dev` |
| Accessibility | `playwright` |
| Review | `playwright`, `next-devtools` |

---

## Agent Summary

| Agent | Sections Used |
|-------|---------------|
| `premium-ux-designer` | All sections (Phase 1) |
| `shadcn-requirements-analyzer` | Header, Hero, Categories, Menu |
| `shadcn-component-researcher` | Header, Hero, Store, Footer |
| `nextjs-component-architect` | Header, Hero, Menu |
| `shadcn-implementation-builder` | All sections |
| `nextjs-forms-expert` | Store/Reservation, Contact, Footer |
| `nextjs-animation-specialist` | All sections |
| `nextjs-responsive-design` | All sections |
| `nextjs-accessibility-expert` | All sections |
| `nextjs-ui-reviewer` | Header, Hero, Menu (critical sections) |

---

## Success Metrics

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Total bundle < 200KB (gzipped)

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast passing

### Mobile
- [ ] All sections responsive
- [ ] Touch targets 44px minimum
- [ ] No horizontal scroll
- [ ] Fast load on 3G

### Dark Mode
- [ ] All sections support dark mode
- [ ] Colors use CSS variables
- [ ] No hardcoded colors
- [ ] Theme persists

### Code Quality
- [ ] TypeScript strict mode passing
- [ ] ESLint passing
- [ ] Components properly typed
- [ ] Server/Client boundaries correct

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API failures | Mock data fallbacks (already implemented) |
| Image performance | Next/Image optimization, lazy loading |
| Animation performance | requestAnimationFrame, GPU acceleration |
| Dark mode gaps | CSS variable audit before launch |
| Accessibility issues | Early and continuous testing |

---

## Quick Start

To begin implementation, invoke the first agent:

```
Agent: premium-ux-designer
Section: Header & Navigation
Phase: 1.1 Design Research
```

Then proceed through each phase sequentially, using the handoff points to pass context between agents.

---

## Appendix: Component File Structure

```
components/
├── home/
│   ├── hero-section/
│   │   ├── index.tsx (Server)
│   │   ├── hero-content.tsx (Server)
│   │   ├── hero-search.tsx (Client)
│   │   ├── hero-stats.tsx (Client)
│   │   ├── hero-image.tsx (Server)
│   │   ├── floating-cards.tsx (Client)
│   │   └── background-shapes.tsx (Client)
│   ├── delivery-info-section/
│   │   └── index.tsx (Server)
│   ├── categories-section/
│   │   ├── index.tsx (Server)
│   │   ├── categories-pills.tsx (Client)
│   │   └── category-pill.tsx (Client)
│   ├── menu-section/
│   │   ├── index.tsx (Server)
│   │   ├── menu-content.tsx (Client)
│   │   ├── menu-tabs.tsx (Client)
│   │   ├── product-grid.tsx (Client)
│   │   └── product-card.tsx (Client)
│   ├── promo-section/
│   │   ├── index.tsx (Server)
│   │   └── countdown-timer.tsx (Client)
│   ├── about-section/
│   │   ├── index.tsx (Server)
│   │   ├── about-image.tsx (Server)
│   │   ├── about-content.tsx (Server)
│   │   └── stats-counter.tsx (Client)
│   ├── awards-section/
│   │   ├── index.tsx (Server)
│   │   └── award-card.tsx (Server)
│   ├── testimonials-section/
│   │   ├── index.tsx (Server)
│   │   ├── testimonials-carousel.tsx (Client)
│   │   └── testimonial-card.tsx (Client)
│   ├── store-section/
│   │   ├── index.tsx (Server)
│   │   ├── reservation-form.tsx (Client)
│   │   └── store-card.tsx (Server)
│   ├── contact-section/
│   │   ├── index.tsx (Server)
│   │   ├── contact-form.tsx (Client)
│   │   └── contact-card.tsx (Server)
│   └── mission-vision-section/
│       └── index.tsx (Server)
├── layout/
│   ├── header/
│   │   ├── index.tsx (Server)
│   │   ├── header-client.tsx (Client)
│   │   ├── top-info-bar.tsx (Server)
│   │   ├── logo.tsx (Server)
│   │   ├── desktop-nav.tsx (Server)
│   │   ├── mobile-drawer.tsx (Client)
│   │   ├── search-command.tsx (Client)
│   │   ├── theme-toggle.tsx (Client)
│   │   ├── user-dropdown.tsx (Client)
│   │   └── cart-badge.tsx (Client)
│   └── footer/
│       ├── index.tsx (Server)
│       ├── footer-brand.tsx (Server)
│       ├── footer-links.tsx (Server)
│       ├── footer-newsletter.tsx (Client)
│       ├── footer-social.tsx (Server)
│       └── footer-copyright.tsx (Server)
```

---

*Document generated for PizzaSpace Home Page Redesign Project*
*Version: 1.0*
*Date: November 2024*
