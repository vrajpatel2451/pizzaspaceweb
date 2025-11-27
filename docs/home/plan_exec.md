# Pizza Space Home Page - Execution Plan

## Executive Summary

This document outlines the comprehensive execution plan for building the Pizza Space home page, a Next.js 16 application featuring a full-featured restaurant landing page with 10 distinct sections, dynamic API integration, and responsive design.

### Project Scope
- **Total Sections**: 12 (Header, Footer, + 10 Home Page Sections)
- **API Integrations**: 3 (Categories, Products, Stores)
- **Complexity Level**: Complex
- **Estimated Components**: 35-40 components
- **Target Completion**: Production-ready, accessible, performant

### Design System Summary
| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | `#F97316` (Orange) | CTAs, accents, links |
| Dark Background | `#1E293B` (Navy) | Header, footer, dark sections |
| Light Background | `#FEF3C7` (Cream) | Section backgrounds |
| Font Family | Montserrat | All text |

---

## Phase Breakdown

### Phase 1: Foundation & API Layer Setup

**Duration**: 1-2 hours
**Priority**: Critical Path
**Dependencies**: None

#### 1.1 API Infrastructure

**Agent**: `nextjs-component-architect`

**MCP Tools**:
- `next-devtools MCP`: Verify Next.js 16 setup, check server component compatibility
- `IDE MCP`: Get diagnostics during development

**Deliverables**:
1. Base API types in `types/api.ts`:
   ```
   - APIResponse<T>
   - PaginationMeta
   - PaginatedResponse<T>
   ```

2. Domain types in `types/`:
   ```
   - types/category.ts (CategoryResponse, CategoryQueryParams)
   - types/product.ts (ProductResponse, ProductQueryParams, ProductType, SpiceLevel, etc.)
   - types/store.ts (StoreResponse, StoreQueryParams)
   ```

3. Axios configuration in `lib/api/`:
   ```
   - lib/api/client.ts (axios instance with interceptors)
   - lib/api/categories.ts (getCategories)
   - lib/api/products.ts (getProducts)
   - lib/api/stores.ts (getStores)
   ```

4. Environment configuration:
   ```
   - .env.local (NEXT_PUBLIC_API_BASE_URL)
   - .env.example (template)
   ```

**Prompt for Agent**:
```
Set up the API infrastructure for Pizza Space:

1. Create base API types in types/api.ts:
   - APIResponse<T> with statusCode and data
   - PaginationMeta with currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage
   - PaginatedResponse<T> with data array and meta

2. Create domain types from spec/home/*.md files:
   - CategoryResponse and CategoryQueryParams
   - ProductResponse (with ProductType, SpiceLevel, Ingredient, DishSize, DishSizeUnit)
   - StoreResponse and StoreQueryParams

3. Create axios client in lib/api/client.ts:
   - Base URL from environment variable
   - Response interceptor returning APIResponse<T>
   - Error handling

4. Create API service functions:
   - lib/api/categories.ts: getCategories(params)
   - lib/api/products.ts: getProducts(params)
   - lib/api/stores.ts: getStores(params)

Use Next.js 16 patterns - these will be called from Server Components.
```

---

### Phase 2: Layout Components (Header & Footer)

**Duration**: 2-3 hours
**Priority**: Critical Path
**Dependencies**: Phase 1

#### 2.1 Header Component

**Agent**: `shadcn-implementation-builder`

**MCP Tools**:
- `shadcn MCP`: Research navigation patterns, drawer component
- `playwright MCP`: Test responsive behavior

**Reference Screenshots**:
- Desktop: `spec/home/images/web/header.png`
- Mobile: `spec/home/images/mobile/heade1.png`, `spec/home/images/mobile/header2.png`

**Component Structure**:
```
components/layout/
  header/
    index.tsx              # Main Header (Server Component wrapper)
    header-nav.tsx         # Navigation links (Client - for mobile toggle)
    header-icons.tsx       # Right side icons (Client - for interactions)
    mobile-menu.tsx        # Mobile drawer menu (Client)
    cart-badge.tsx         # Cart with badge (Client)
    logo.tsx               # Pizza Space logo (Server)
```

**Features**:
- Dark navbar (#1E293B background)
- Logo with pizza icon + "Pizza Space" text (orange)
- Navigation: Home, About, Stores, Menu, Contact Us
- Right icons: Location, Search, Cart (with badge), User
- Mobile: Hamburger menu with drawer
- Mobile drawer includes: Navigation + Account section (Order History, Address Management, Profile, Coupons, Sign Out)

**Prompt for Agent**:
```
Build the Pizza Space header component based on screenshots:
- Desktop: spec/home/images/web/header.png
- Mobile: spec/home/images/mobile/heade1.png, spec/home/images/mobile/header2.png

Requirements:
1. Dark navy background (#1E293B)
2. Logo: Pizza icon (orange circle with white pizza slice) + "Pizza Space" in orange
3. Desktop nav: Home, About, Stores, Menu, Contact Us (white text)
4. Right icons: Location pin, Search, Cart with orange badge showing count, User icon
5. Mobile: Condensed to Logo + icons + hamburger menu
6. Mobile drawer: Full navigation + Account section with Order History, Address Management, Profile, Coupons, Sign Out

Use existing components: Button, IconButton, Drawer from components/ui
Create as Server Component with Client sub-components where needed for interactivity.
Implement sticky header behavior.
```

#### 2.2 Footer Component

**Agent**: `shadcn-implementation-builder`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/footer.png`
- Mobile: `spec/home/images/mobile/footer.png`

**Component Structure**:
```
components/layout/
  footer/
    index.tsx              # Main Footer (Server Component)
    footer-links.tsx       # Link columns
    footer-social.tsx      # Social media icons
    footer-copyright.tsx   # Copyright bar
```

**Features**:
- Dark background matching header
- 4-column layout (Desktop): Logo/Contact, Quick Links, Legal, Follow Us
- Logo with address, phone, email
- Quick Links: Home, About, Stores, Menu, Contact Us
- Legal: Privacy Policy, Return Policy, Delivery Terms, Terms & Conditions
- Social: Facebook, Twitter, Instagram, YouTube
- Copyright bar at bottom

**Prompt for Agent**:
```
Build the Pizza Space footer component based on screenshots:
- Desktop: spec/home/images/web/footer.png
- Mobile: spec/home/images/mobile/footer.png

Requirements:
1. Dark navy background (#1E293B) matching header
2. 4-column grid on desktop, stacked on mobile:
   - Column 1: Logo + address (123 Pizza Street, Food City, FC 12345) + Phone + Email
   - Column 2: Quick Links (Home, About, Stores, Menu, Contact Us)
   - Column 3: Legal (Privacy Policy, Return Policy, Delivery Terms, Terms & Conditions)
   - Column 4: Follow Us with social icons + "Stay updated..." text
3. Social icons: Facebook, Twitter, Instagram, YouTube
4. Copyright bar: "(c) 2025 Pizza Space. All rights reserved. Powered by Pizza Space"
5. All links in gray, hover to white
6. "Pizza Space" in orange in copyright

Build as Server Component. Use Lucide icons for social media.
```

#### 2.3 Main Layout Integration

**Agent**: `nextjs-component-architect`

**Deliverables**:
- Update `app/layout.tsx` with Header and Footer
- Create `components/layout/index.ts` barrel export

---

### Phase 3: Hero & CTA Sections (Sections 1-2)

**Duration**: 2-3 hours
**Priority**: High
**Dependencies**: Phase 2

#### 3.1 Hero Slider (Section 1)

**Agent**: `nextjs-animation-specialist`

**MCP Tools**:
- `shadcn MCP`: Research carousel components from registries
- `playwright MCP`: Test slider interactions and transitions

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec1.png`
- Mobile: `spec/home/images/mobile/sec1.png`

**Component Structure**:
```
components/home/
  hero-slider/
    index.tsx              # Slider container (Client)
    hero-slide.tsx         # Individual slide
    slider-controls.tsx    # Prev/Next buttons
    slider-dots.tsx        # Dot indicators
```

**Features**:
- Full-width slider with background images
- Dark overlay on images for text readability
- Centered content: Title, description, CTA button
- Navigation arrows (circular white buttons)
- Auto-play with pause on hover
- Smooth slide transitions

**Prompt for Agent**:
```
Build the Pizza Space hero slider based on screenshots:
- Desktop: spec/home/images/web/sec1.png
- Mobile: spec/home/images/mobile/sec1.png

Requirements:
1. Full-width slider with background images
2. Dark semi-transparent overlay for text contrast
3. Centered content on each slide:
   - Large title (e.g., "New Margherita Supreme", "Free Delivery Weekend")
   - Subtitle/description
   - CTA button: "Order Now" / "Order Online" (white bg, orange text on mobile)
4. Circular prev/next navigation arrows
5. Auto-play every 5 seconds, pause on hover
6. Smooth crossfade or slide transitions
7. Touch/swipe support for mobile
8. Responsive: full viewport height on mobile, ~400px on desktop

Consider using embla-carousel or building custom with Framer Motion.
This is a Client Component due to interactivity.
```

#### 3.2 Make Order Section (Section 2)

**Agent**: `shadcn-implementation-builder`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec2.png`
- Mobile: `spec/home/images/mobile/sec2.png`

**Component Structure**:
```
components/home/
  make-order-section/
    index.tsx              # Section container (Server)
```

**Features**:
- Light cream background (#FEF3C7)
- Centered content
- Title: "Make Your Order"
- Description text
- CTA: "Browse Menu" button (orange with pizza icon and arrow)

**Prompt for Agent**:
```
Build the Make Order section based on screenshots:
- Desktop: spec/home/images/web/sec2.png
- Mobile: spec/home/images/mobile/sec2.png

Requirements:
1. Light cream background (#FEF3C7 or similar)
2. Centered layout with max-width container
3. Title: "Make Your Order" (dark navy, bold)
4. Description: "Choose from our delicious menu and get your favorite pizza delivered hot and fresh to your doorstep."
5. CTA button: Orange background, white text, "Browse Menu" with pizza icon and arrow
6. Generous padding (py-16 or more)

Build as Server Component. Use existing Button component with custom styling.
Link to /menu page.
```

---

### Phase 4: Categories & Menu Sections (Sections 3-4) - API Integration

**Duration**: 3-4 hours
**Priority**: High
**Dependencies**: Phase 1 (API), Phase 3

#### 4.1 Categories Section (Section 3)

**Agent**: `nextjs-component-architect` + `nextjs-performance-optimizer`

**MCP Tools**:
- `next-devtools MCP`: Verify Server Component data fetching
- `shadcn MCP`: Research carousel components

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec3.png`
- Mobile: `spec/home/images/mobile/sec3.png`

**API**: `GET /categories`

**Component Structure**:
```
components/home/
  categories-section/
    index.tsx              # Section with Suspense (Server)
    categories-carousel.tsx # Carousel (Client)
    category-card.tsx      # Individual category (Server)
    categories-skeleton.tsx # Loading state
```

**Features**:
- Light cream background
- Orange badge: "Popular Categories"
- Title: "Choose Your Favorite"
- Description text
- Horizontal carousel of circular category images
- Category name below each image (uppercase)
- Navigation arrows on sides
- Server-side data fetching with Suspense

**Prompt for Agent**:
```
Build the Categories section with API integration based on screenshots:
- Desktop: spec/home/images/web/sec3.png
- Mobile: spec/home/images/mobile/sec3.png

Requirements:
1. Light cream background (#FEF3C7)
2. Section header:
   - Orange badge: "Popular Categories"
   - Title: "Choose Your Favorite"
   - Description about premium ingredients and authentic recipes
3. Horizontal carousel of categories:
   - Circular images with light shadow
   - Category name below (uppercase, e.g., "PIZZA", "STARTERS", "FRIES")
   - Circular prev/next buttons on sides
4. API Integration:
   - Fetch from GET /categories using lib/api/categories.ts
   - Use Server Component for data fetching
   - Wrap carousel in Suspense with skeleton loader
5. Consider making this a "server lazy component" pattern:
   - Server Component fetches data
   - Passes to Client carousel component
6. Show 5 items on desktop, 1-2 on mobile with swipe

Use Skeleton component for loading state.
```

#### 4.2 Menu Section (Section 4)

**Agent**: `nextjs-component-architect` + `shadcn-implementation-builder`

**MCP Tools**:
- `next-devtools MCP`: Verify Server Actions for "Load More"
- `shadcn MCP`: Research tabs component patterns

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec4.png`
- Mobile: `spec/home/images/mobile/sec4.png`

**API**: `GET /product`

**Component Structure**:
```
components/home/
  menu-section/
    index.tsx              # Section container (Server)
    menu-tabs.tsx          # Category tabs filter (Client)
    product-grid.tsx       # Product grid with load more (Client)
    product-card.tsx       # Individual product card
    menu-skeleton.tsx      # Loading state
```

**Features**:
- White background
- Title: "OUR SPECIAL MENU" (uppercase, centered)
- Horizontal tabs: ALL, PIZZA, STARTERS, FRIES, Desserts, Beverages
- Active tab: Orange pill background
- 4-column product grid (desktop), 1 column (mobile)
- Product card: Circular image, name, description, price (orange)
- "Load More" button (orange)
- Client-side filtering and pagination

**Prompt for Agent**:
```
Build the Menu section with API integration based on screenshots:
- Desktop: spec/home/images/web/sec4.png
- Mobile: spec/home/images/mobile/sec4.png

Requirements:
1. White/light background
2. Title: "OUR SPECIAL MENU" (uppercase, centered, navy)
3. Category filter tabs:
   - ALL (active by default), PIZZA, STARTERS, FRIES, Desserts, Beverages
   - Active tab: Orange pill background, white text
   - Inactive: Navy text, rounded border
   - Scrollable on mobile
4. Product grid:
   - 4 columns desktop, 2 tablet, 1 mobile
   - Product card:
     - Circular product image (dark background)
     - Product name (bold)
     - Description (truncated, gray)
     - Price in orange (e.g., "$12")
5. "Load More" button (orange, centered)
6. API Integration:
   - Initial fetch: GET /product?limit=8
   - Filter by category: ?categoryId=xxx
   - Load more: increment page
7. Pattern:
   - Server Component fetches initial data + categories
   - Client Component handles filtering/pagination
   - Use existing Tabs component from ui

Use Skeleton for loading states. Handle empty states gracefully.
```

---

### Phase 5: Stores Section (Section 5) - API Integration

**Duration**: 2 hours
**Priority**: High
**Dependencies**: Phase 1 (API)

#### 5.1 Nearest Store Section

**Agent**: `nextjs-component-architect` + `shadcn-implementation-builder`

**MCP Tools**:
- `next-devtools MCP`: Verify geolocation integration patterns

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec5.png`
- Mobile: `spec/home/images/mobile/sec5.png`

**API**: `GET /store`

**Component Structure**:
```
components/home/
  stores-section/
    index.tsx              # Section container (Server)
    stores-grid.tsx        # Store cards grid (Client - for geolocation)
    store-card.tsx         # Individual store card
    stores-skeleton.tsx    # Loading state
```

**Features**:
- Light blue-gray background with subtle pattern
- Orange badge: "Our Locations"
- Title: "Find Your Nearest Store"
- Description text
- 3-column card grid
- Store card:
  - Store icon (orange circle)
  - Store name + "Nearby" badge (orange)
  - Address with location icon
  - Phone with phone icon
  - Hours with clock icon
  - "Get Directions" CTA (orange button)

**Prompt for Agent**:
```
Build the Nearest Store section with API integration based on screenshots:
- Desktop: spec/home/images/web/sec5.png
- Mobile: spec/home/images/mobile/sec5.png

Requirements:
1. Light background with subtle grid pattern
2. Section header:
   - Orange badge: "Our Locations"
   - Title: "Find Your Nearest Store"
   - Description about convenient locations
3. 3-column grid (desktop), 1 column (mobile)
4. Store card (white, rounded, shadow):
   - Header: Store icon (orange bg) + Store name + "Nearby" badge
   - Address with map pin icon
   - Phone number with phone icon
   - Hours with clock icon (e.g., "10AM - 11PM")
   - "Get Directions" button (full width, orange)
5. API Integration:
   - Fetch from GET /store?isActive=true
   - Server Component for initial data
   - Consider geolocation for sorting by distance (optional enhancement)
6. "Get Directions" opens Google Maps with store coordinates

Use existing Badge component for "Nearby" badge.
Use Lucide icons: MapPin, Phone, Clock, Store/Building.
```

---

### Phase 6: Static Content Sections (Sections 6-8)

**Duration**: 2-3 hours
**Priority**: Medium
**Dependencies**: Phase 2 (Layout)

#### 6.1 Awards Section (Section 6)

**Agent**: `shadcn-implementation-builder`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec6.png`
- Mobile: `spec/home/images/mobile/sec6.png`

**Component Structure**:
```
components/home/
  awards-section/
    index.tsx              # Section container (Server)
    award-card.tsx         # Individual award card
```

**Features**:
- Light cream background
- Orange badge: "Recognition"
- Title: "Awards & Achievements"
- 4-column grid of award cards
- Award card: Trophy icon (orange), title, source

**Awards Data** (static):
1. Best Pizza 2023 - Food & Wine Magazine
2. Customer Choice - Local Business Awards
3. Quality Excellence - Restaurant Association
4. 5-Star Rating - Food Delivery Apps

**Prompt for Agent**:
```
Build the Awards section based on screenshots:
- Desktop: spec/home/images/web/sec6.png
- Mobile: spec/home/images/mobile/sec6.png

Requirements:
1. Light cream background (#FEF3C7)
2. Section header:
   - Orange badge: "Recognition"
   - Title: "Awards & Achievements"
3. 4-column grid (desktop), 2 columns (tablet), 1 column (mobile)
4. Award card (white, rounded, shadow):
   - Trophy icon in orange circle at top
   - Award title (bold, centered)
   - Source/organization (gray, centered)
5. Static data:
   - Best Pizza 2023 / Food & Wine Magazine
   - Customer Choice / Local Business Awards
   - Quality Excellence / Restaurant Association
   - 5-Star Rating / Food Delivery Apps

Build as Server Component. Use Lucide Trophy icon.
```

#### 6.2 About Section (Section 7)

**Agent**: `shadcn-implementation-builder` + `nextjs-responsive-design`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec7.png`
- Mobile: `spec/home/images/mobile/sec7.png`

**Component Structure**:
```
components/home/
  about-section/
    index.tsx              # Section container (Server)
    about-image.tsx        # Left side image
    about-content.tsx      # Right side content
    highlight-card.tsx     # Feature highlights
```

**Features**:
- White background
- Two-column layout
- Left: Pizza logo image on dark background with "25+" years badge
- Right:
  - Orange badge: "About Pizza Space"
  - Title: "Crafting Perfect Pizzas Since 1998"
  - Description paragraphs
  - Two highlight cards: Master Chefs, Premium Quality

**Prompt for Agent**:
```
Build the About section based on screenshots:
- Desktop: spec/home/images/web/sec7.png
- Mobile: spec/home/images/mobile/sec7.png

Requirements:
1. White background
2. Two-column layout (image left, content right), stack on mobile
3. Left column:
   - Dark rounded container with pizza logo image
   - "25+ Years Serving" badge overlapping bottom-right (orange bg)
4. Right column:
   - Orange badge: "About Pizza Space"
   - Title: "Crafting Perfect Pizzas Since 1998"
   - Two paragraphs about Italian heritage, quality ingredients, etc.
   - Two highlight cards side by side:
     - Master Chefs (chef hat icon) - "Trained in authentic Italian techniques"
     - Premium Quality (medal icon) - "Only the finest ingredients used"
5. Responsive: Stack columns on mobile, full-width image

Build as Server Component. Use Next.js Image for optimization.
```

#### 6.3 Mission & Vision Section (Section 8)

**Agent**: `shadcn-implementation-builder`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec8.png`
- Mobile: `spec/home/images/mobile/sec8.png`

**Component Structure**:
```
components/home/
  mission-vision-section/
    index.tsx              # Section container (Server)
    mission-card.tsx       # Reusable card component
```

**Features**:
- Light cream background
- Two-column layout (equal width)
- Mission: Target icon, title, description
- Vision: Eye icon, title, description

**Prompt for Agent**:
```
Build the Mission & Vision section based on screenshots:
- Desktop: spec/home/images/web/sec8.png
- Mobile: spec/home/images/mobile/sec8.png

Requirements:
1. Light cream background (#FEF3C7)
2. Two equal columns (stack on mobile)
3. Each column:
   - Circular icon container (light orange bg, orange icon)
   - Title: "Our Mission" / "Our Vision" (bold, centered)
   - Description paragraph (gray, centered)
4. Mission: Target/crosshair icon
   - "To bring authentic Italian flavors to every table, creating memorable dining experiences..."
5. Vision: Eye icon
   - "To become the most beloved pizza destination, known for our unwavering commitment to quality..."
6. Generous spacing between columns

Build as Server Component. Use Lucide icons: Target, Eye.
```

---

### Phase 7: Testimonials & Contact Sections (Sections 9-10)

**Duration**: 2-3 hours
**Priority**: Medium
**Dependencies**: Phase 2 (Layout)

#### 7.1 Testimonials Carousel (Section 9)

**Agent**: `nextjs-animation-specialist`

**MCP Tools**:
- `shadcn MCP`: Research testimonial carousel patterns
- `playwright MCP`: Test carousel interactions

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec9.png`
- Mobile: `spec/home/images/mobile/sec9.png`

**Component Structure**:
```
components/home/
  testimonials-section/
    index.tsx              # Section container (Server wrapper)
    testimonials-carousel.tsx # Carousel (Client)
    testimonial-card.tsx   # Individual testimonial
    carousel-dots.tsx      # Dot indicators
```

**Features**:
- Light cream background
- Orange badge: "Customer Reviews"
- Title: "What Our Customers Say"
- Carousel with single testimonial visible
- Testimonial card:
  - Large quote icon (orange)
  - 5-star rating (yellow/orange stars)
  - Quote text (italic)
  - Customer name (bold)
  - Location (gray)
- Dot indicators below
- Auto-play with pause on hover

**Testimonials Data** (static):
```
[
  { quote: "Fresh ingredients, perfect cooking, and excellent customer service. What more could you ask for?", name: "Lisa Brown", location: "Midtown", rating: 5 },
  { quote: "Best pizza in town! The crust is always perfect.", name: "John Smith", location: "Downtown", rating: 5 },
  { quote: "Quick delivery and amazing taste. Highly recommend!", name: "Sarah Johnson", location: "Westside", rating: 5 }
]
```

**Prompt for Agent**:
```
Build the Testimonials carousel based on screenshots:
- Desktop: spec/home/images/web/sec9.png
- Mobile: spec/home/images/mobile/sec9.png

Requirements:
1. Light cream background (#FEF3C7)
2. Section header:
   - Orange badge: "Customer Reviews"
   - Title: "What Our Customers Say"
3. Carousel showing one testimonial at a time:
   - White card with shadow
   - Large quote icon (orange) at top
   - 5 orange/yellow stars
   - Quote text in italics
   - Customer name (bold)
   - Location (gray)
4. Dot indicators below (5-6 dots)
5. Auto-play every 6 seconds, pause on hover
6. Smooth fade/slide transitions
7. Touch/swipe support

Use existing Rating component for stars. Build carousel as Client Component.
Consider using embla-carousel for smooth animations.
```

#### 7.2 Contact Section (Section 10)

**Agent**: `shadcn-implementation-builder`

**Reference Screenshots**:
- Desktop: `spec/home/images/web/sec10.png`
- Mobile: `spec/home/images/mobile/sec10.png`

**Component Structure**:
```
components/home/
  contact-section/
    index.tsx              # Section container (Server)
    contact-card.tsx       # Individual contact method card
```

**Features**:
- Light gray-blue background with subtle pattern
- Orange badge: "Get In Touch"
- Title: "Contact Us"
- Description text
- 3-column grid of contact cards
- Contact card: Icon (in circle), title, info, subtitle
- "View Full Contact Page" CTA

**Prompt for Agent**:
```
Build the Contact section based on screenshots:
- Desktop: spec/home/images/web/sec10.png
- Mobile: spec/home/images/mobile/sec10.png

Requirements:
1. Light background with subtle pattern
2. Section header:
   - Orange badge: "Get In Touch"
   - Title: "Contact Us"
   - Description: "Have questions or want to make a reservation? We'd love to hear from you."
3. 3-column grid (stack on mobile), centered:
   - Call Us: Phone icon, "+1 234 567 8900", "Mon-Sun: 10AM - 11PM"
   - Email Us: Mail icon, "info@pizzaspace.com", "We'll respond within 24hrs"
   - Visit Us: MapPin icon, "123 Pizza Street", "Food City, FC 12345"
4. Each card: Light orange circle with orange icon, centered content
5. "View Full Contact Page" button (orange) at bottom
6. Link to /contact page

Build as Server Component. Use Lucide icons: Phone, Mail, MapPin.
```

---

### Phase 8: Responsive Design & Polish

**Duration**: 2-3 hours
**Priority**: High
**Dependencies**: Phases 3-7

#### 8.1 Responsive Audit

**Agent**: `nextjs-responsive-design`

**MCP Tools**:
- `playwright MCP`: Test across viewports (320px, 768px, 1024px, 1440px)
- `next-devtools MCP`: Check for hydration issues

**Deliverables**:
1. Audit all sections for mobile responsiveness
2. Fix any overflow issues
3. Verify touch targets (min 44px)
4. Test carousels/sliders on touch devices
5. Verify header drawer functionality
6. Check text readability at all sizes

**Breakpoints to Test**:
- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px - 1279px
- Large: 1280px+

**Prompt for Agent**:
```
Perform responsive design audit on Pizza Space home page:

1. Test all 12 components at breakpoints: 320px, 640px, 768px, 1024px, 1280px
2. Verify:
   - No horizontal overflow
   - Text is readable (min 14px on mobile)
   - Touch targets are 44px minimum
   - Images scale properly
   - Grids collapse correctly (4 -> 2 -> 1 columns)
   - Carousels work with touch/swipe
   - Mobile menu drawer functions correctly
3. Fix any issues found
4. Ensure consistent spacing (use Tailwind spacing scale)
5. Test header sticky behavior
6. Verify footer stacks correctly on mobile

Use Playwright MCP to capture screenshots at each breakpoint.
```

---

### Phase 9: Accessibility Compliance

**Duration**: 2 hours
**Priority**: Critical
**Dependencies**: Phase 8

#### 9.1 Accessibility Audit & Fixes

**Agent**: `nextjs-accessibility-expert`

**MCP Tools**:
- `playwright MCP`: Run automated a11y tests
- `IDE MCP`: Check for a11y warnings

**Deliverables**:
1. WCAG 2.1 AA compliance audit
2. Keyboard navigation verification
3. Screen reader testing
4. Color contrast verification
5. Focus indicator styling
6. ARIA labels and roles

**Checklist**:
- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast ratios meet AA standards (4.5:1 for text)
- [ ] Carousels are accessible (pause, prev/next with keyboard)
- [ ] Forms have proper labels
- [ ] Skip to main content link
- [ ] Semantic HTML (header, main, footer, nav, section)
- [ ] ARIA labels on icon-only buttons
- [ ] Reduced motion support for animations

**Prompt for Agent**:
```
Perform accessibility audit on Pizza Space home page:

1. Run automated a11y tests using Playwright
2. Verify WCAG 2.1 AA compliance:
   - Color contrast (4.5:1 for normal text, 3:1 for large text)
   - Focus indicators on all interactive elements
   - Alt text on all images
   - Proper heading hierarchy (h1 -> h2 -> h3)
3. Keyboard navigation:
   - Tab through entire page
   - Verify carousel navigation with keyboard
   - Test mobile menu with keyboard
   - Ensure modal/drawer trap focus
4. Screen reader:
   - Add aria-labels to icon buttons
   - Add aria-live regions for dynamic content
   - Verify slider announcements
5. Motion:
   - Add prefers-reduced-motion media queries
   - Disable auto-play carousels for reduced motion
6. Add skip-to-content link in header

Fix all issues found. Document any known limitations.
```

---

### Phase 10: Performance Optimization

**Duration**: 1-2 hours
**Priority**: High
**Dependencies**: Phase 9

#### 10.1 Performance Audit & Optimization

**Agent**: `nextjs-performance-optimizer`

**MCP Tools**:
- `next-devtools MCP`: Check bundle sizes, build diagnostics
- `playwright MCP`: Measure Core Web Vitals

**Deliverables**:
1. Image optimization audit
2. Bundle size analysis
3. Lazy loading implementation
4. Font optimization verification
5. Core Web Vitals targets

**Optimizations**:
- [ ] All images use next/image with proper sizing
- [ ] Hero images are priority loaded
- [ ] Below-fold images are lazy loaded
- [ ] API responses are cached where appropriate
- [ ] Carousel libraries are dynamically imported
- [ ] Fonts are preloaded (Montserrat)
- [ ] Unused CSS is purged
- [ ] Components code-split appropriately

**Targets**:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Bundle size: < 150KB initial JS

**Prompt for Agent**:
```
Perform performance optimization on Pizza Space home page:

1. Image optimization:
   - Verify all images use next/image
   - Set priority on hero/above-fold images
   - Add proper width/height or fill
   - Use blur placeholder for large images
2. Bundle analysis:
   - Check carousel library bundle size
   - Dynamic import heavy components
   - Verify tree-shaking is working
3. Data fetching:
   - Verify Server Components are used for API calls
   - Add appropriate cache headers
   - Consider React cache() for deduplication
4. Lazy loading:
   - Lazy load below-fold sections
   - Use Suspense boundaries appropriately
5. Font optimization:
   - Verify Montserrat is loaded via next/font
   - Check font-display: swap is set
6. Measure Core Web Vitals:
   - Run Lighthouse audit
   - Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

Document performance baseline and improvements.
```

---

### Phase 11: Final Review & QA

**Duration**: 1-2 hours
**Priority**: Critical
**Dependencies**: All previous phases

#### 11.1 Code Review

**Agent**: `nextjs-ui-reviewer`

**MCP Tools**:
- `shadcn MCP`: Run audit checklist
- `IDE MCP`: Get final diagnostics
- `playwright MCP`: Run E2E tests

**Deliverables**:
1. Code quality review
2. TypeScript error check
3. ESLint compliance
4. Component consistency check
5. Documentation review

**Prompt for Agent**:
```
Perform final code review on Pizza Space home page:

1. Code Quality:
   - No TypeScript errors
   - ESLint passes (npm run lint)
   - Consistent naming conventions
   - Proper file organization
2. Component Review:
   - Server vs Client Components used appropriately
   - Props are properly typed
   - No prop drilling (use composition)
   - Consistent styling approach
3. Best Practices:
   - No console.logs in production code
   - Error boundaries in place
   - Loading states for all async operations
   - Empty states handled
4. Documentation:
   - Component props documented
   - API types documented
   - README updated if needed
5. Testing:
   - Run build to verify no errors
   - Test in production mode
   - Verify all links work

Use shadcn audit checklist for final verification.
```

#### 11.2 E2E Testing

**Agent**: `nextjs-ui-reviewer`

**MCP Tools**:
- `playwright MCP`: Create and run E2E tests

**Test Scenarios**:
1. Page loads successfully
2. Header navigation works
3. Mobile menu opens/closes
4. Hero slider advances
5. Categories carousel scrolls
6. Menu tabs filter products
7. Load more loads additional products
8. Store cards display correctly
9. Testimonials carousel works
10. All CTAs link correctly

---

## Component Architecture

### Directory Structure

```
pizzaspace_web/
  app/
    layout.tsx              # Root layout with Header/Footer
    page.tsx                # Home page composing all sections
    globals.css             # Global styles
  components/
    layout/
      header/
        index.tsx
        header-nav.tsx
        header-icons.tsx
        mobile-menu.tsx
        cart-badge.tsx
        logo.tsx
      footer/
        index.tsx
        footer-links.tsx
        footer-social.tsx
        footer-copyright.tsx
      index.ts              # Barrel exports
    home/
      hero-slider/
        index.tsx
        hero-slide.tsx
        slider-controls.tsx
      make-order-section/
        index.tsx
      categories-section/
        index.tsx
        categories-carousel.tsx
        category-card.tsx
        categories-skeleton.tsx
      menu-section/
        index.tsx
        menu-tabs.tsx
        product-grid.tsx
        product-card.tsx
        menu-skeleton.tsx
      stores-section/
        index.tsx
        stores-grid.tsx
        store-card.tsx
        stores-skeleton.tsx
      awards-section/
        index.tsx
        award-card.tsx
      about-section/
        index.tsx
        about-image.tsx
        about-content.tsx
        highlight-card.tsx
      mission-vision-section/
        index.tsx
        mission-card.tsx
      testimonials-section/
        index.tsx
        testimonials-carousel.tsx
        testimonial-card.tsx
      contact-section/
        index.tsx
        contact-card.tsx
      index.ts              # Barrel exports
    ui/                     # Existing shadcn components
    composite/              # Existing composite components
  lib/
    api/
      client.ts             # Axios instance
      categories.ts         # Category API
      products.ts           # Product API
      stores.ts             # Store API
      index.ts              # Barrel exports
    utils.ts                # Existing utils
    formatters.ts           # Existing formatters
  types/
    api.ts                  # Base API types
    category.ts             # Category types
    product.ts              # Product types
    store.ts                # Store types
    index.ts                # Barrel exports
```

### Server vs Client Component Mapping

| Component | Type | Reason |
|-----------|------|--------|
| Header (wrapper) | Server | Static shell |
| HeaderNav | Client | Mobile toggle state |
| MobileMenu | Client | Drawer interactions |
| CartBadge | Client | Cart state |
| Footer | Server | Static content |
| HeroSlider | Client | Carousel interactions |
| MakeOrderSection | Server | Static content |
| CategoriesSection | Server | Data fetching |
| CategoriesCarousel | Client | Carousel interactions |
| MenuSection | Server | Initial data fetch |
| MenuTabs | Client | Filter state |
| ProductGrid | Client | Pagination state |
| StoresSection | Server | Data fetching |
| StoresGrid | Client | Geolocation (optional) |
| AwardsSection | Server | Static content |
| AboutSection | Server | Static content |
| MissionVisionSection | Server | Static content |
| TestimonialsSection (wrapper) | Server | Static shell |
| TestimonialsCarousel | Client | Carousel interactions |
| ContactSection | Server | Static content |

---

## API Integration Strategy

### Environment Configuration

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.pizzaspace.co.uk/api/v1
```

### Axios Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios';
import { APIResponse } from '@/types/api';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data as APIResponse<unknown>,
  (error) => Promise.reject(error)
);

export default apiClient;
```

### Data Fetching Pattern

```typescript
// Server Component pattern
async function CategoriesSection() {
  const response = await getCategories({ limit: 10 });
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesCarousel categories={response.data.data} />
    </Suspense>
  );
}
```

### Caching Strategy

| Endpoint | Cache Strategy | Revalidation |
|----------|----------------|--------------|
| GET /categories | Cache | 1 hour |
| GET /product | Cache | 30 minutes |
| GET /store | Cache | 1 hour |

---

## Testing Strategy

### Playwright MCP Test Plan

#### Visual Regression Tests
```typescript
// Capture screenshots at key breakpoints
test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-desktop.png');

  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

#### Interaction Tests
```typescript
// Hero slider
test('hero slider advances automatically', async ({ page }) => {
  await page.goto('/');
  const firstSlide = page.locator('.hero-slide').first();
  await expect(firstSlide).toBeVisible();
  await page.waitForTimeout(5500); // Wait for auto-advance
  await expect(firstSlide).not.toBeVisible();
});

// Menu tabs
test('menu tabs filter products', async ({ page }) => {
  await page.goto('/');
  await page.click('text=PIZZA');
  const products = page.locator('.product-card');
  // Verify filtered results
});

// Mobile menu
test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.click('[aria-label="Open menu"]');
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await page.click('[aria-label="Close menu"]');
  await expect(page.locator('.mobile-menu')).not.toBeVisible();
});
```

#### Accessibility Tests
```typescript
test('page passes accessibility audit', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## Verification Checklist

### Pre-Launch Checklist

#### Functionality
- [ ] All 10 home page sections render correctly
- [ ] Header navigation works on desktop
- [ ] Mobile menu opens/closes correctly
- [ ] Hero slider auto-advances and responds to controls
- [ ] Categories carousel scrolls
- [ ] Menu tabs filter products correctly
- [ ] Load more button fetches additional products
- [ ] Store cards display API data
- [ ] Testimonials carousel works
- [ ] All CTA buttons link to correct pages
- [ ] Footer links work

#### Responsive Design
- [ ] Mobile (320px - 639px) layout correct
- [ ] Tablet (640px - 1023px) layout correct
- [ ] Desktop (1024px+) layout correct
- [ ] No horizontal overflow at any viewport
- [ ] Touch interactions work on mobile

#### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] All images have alt text
- [ ] Carousels can be paused

#### Performance
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized with next/image
- [ ] No layout shift during load

#### Code Quality
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No console errors in browser
- [ ] Build succeeds (npm run build)

### shadcn Audit Checklist
Use the `mcp__shadcn__get_audit_checklist` tool after implementation to verify:
- Component installation correct
- Dependencies properly installed
- Tailwind configuration correct
- Path aliases working
- Theme variables configured

---

## Parallel Execution Opportunities

The following phases can be executed in parallel:

### Parallel Group 1 (After Phase 2)
- Phase 3.1 (Hero Slider) - No API dependency
- Phase 3.2 (Make Order) - No API dependency
- Phase 6.1 (Awards) - Static content
- Phase 6.2 (About) - Static content
- Phase 6.3 (Mission/Vision) - Static content

### Parallel Group 2 (After Phase 1)
- Phase 4.1 (Categories) - Uses Categories API
- Phase 4.2 (Menu) - Uses Products API
- Phase 5.1 (Stores) - Uses Stores API

### Parallel Group 3 (After Phase 2)
- Phase 7.1 (Testimonials) - Static data
- Phase 7.2 (Contact) - Static content

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API unavailable during development | Create mock data in `lib/mocks/` |
| Carousel library too heavy | Evaluate bundle size, consider lighter alternatives |
| Mobile performance issues | Test early on real devices, optimize images |
| Accessibility issues discovered late | Run a11y tests throughout development |
| Design inconsistencies | Reference screenshots frequently, create design tokens early |

---

## Quick Start

To begin implementation, invoke the first agent:

```
Agent: nextjs-component-architect
Phase: 1.1 - API Infrastructure

Prompt: Set up the API infrastructure for Pizza Space including base types, domain types, axios client, and API service functions as specified in Phase 1.1 of the execution plan.
```

After Phase 1 is complete, Phases 2.1 and 2.2 (Header/Footer) can begin, followed by parallel execution of static sections while API-dependent sections are developed.

---

## Document Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-27 | Initial execution plan created |
