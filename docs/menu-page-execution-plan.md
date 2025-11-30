# Menu Page Execution Plan

## Feature Analysis Summary

| Attribute | Value |
|-----------|-------|
| **Feature Name** | Menu Page with Full Filtering & Pagination |
| **Complexity** | Complex (10+ components, server/client split, SEO-critical) |
| **Estimated Agents** | 12 |
| **Estimated Duration** | 4-6 Sprints |

### UI Elements Detected

- [x] Sidebar Navigation (Accordion with Categories/Subcategories)
- [x] Product Grid with Cards
- [x] Pagination Controls
- [x] Loading/Error/Empty States
- [x] Mobile Drawer/Sheet for Filters
- [x] URL State Management
- [x] SEO Metadata & JSON-LD

### Technical Requirements

- [x] Server Components for SEO (data fetching)
- [x] Client interactivity (accordion, pagination clicks)
- [x] URL searchParams state management
- [x] Responsive design (mobile drawer vs desktop sidebar)
- [x] Loading states with Suspense boundaries
- [x] Error boundaries with fallback UI

### Existing Assets to Leverage

| Asset | Location | Usage |
|-------|----------|-------|
| `ProductCard` | `/components/home/menu-section/product-card.tsx` | Reuse for product grid |
| `MenuSkeleton` | `/components/home/menu-section/menu-skeleton.tsx` | Loading states |
| `Accordion` | `/components/ui/accordion.tsx` | Category navigation |
| `CustomImage` | `/components/ui/custom-image.tsx` | All images |
| `getCategories()` | `/lib/api/categories.ts` | Fetch categories |
| `getSubCategories()` | `/lib/api/subcategories.ts` | Fetch subcategories |
| `getProducts()` | `/lib/api/products.ts` | Fetch products |
| JSON-LD Components | `/components/seo/json-ld.tsx` | SEO structured data |

---

## Phase Overview

```
Phase 1: Requirements & Research (Sprint 1)
    |
    v
Phase 2: Architecture & Design System (Sprint 1-2)
    |
    v
Phase 3: Core Component Implementation (Sprint 2-3)
    |
    v
Phase 4: Advanced Features & Animations (Sprint 3-4)
    |
    v
Phase 5: Optimization & Polish (Sprint 4-5)
    |
    v
Phase 6: Review & QA (Sprint 5-6)
```

---

## PHASE 1: Requirements & Research

### Sub-Phase 1.1: Component Requirements Analysis

**Agent**: `shadcn-requirements-analyzer`

**Purpose**: Break down the menu page feature into specific component requirements

**MCPs**:
- `mcp__shadcn__get_project_registries` - Check current registries
- `mcp__shadcn__list_items_in_registries` - List available components

<prompt>
Analyze the Menu Page feature requirements for a Next.js 16 pizza ordering application.

FEATURE REQUIREMENTS:
1. Sidebar with categories & subcategories in accordion (desktop)
2. Mobile drawer/sheet for filters
3. Product grid with loading, success, error, empty states
4. Pagination for products
5. Server-side API handling for SEO
6. URL params for state management (shareable links)
7. Filtering by: categoryId, subCategoryId, search, page

EXISTING APIs:
- getCategories(params) -> PaginatedResponse<CategoryResponse>
- getSubCategories(params) -> PaginatedResponse<SubCategoryResponse>
- getProducts(params) -> PaginatedResponse<ProductResponse>

EXISTING COMPONENTS TO REUSE:
- ProductCard from /components/home/menu-section/product-card.tsx
- Accordion from /components/ui/accordion.tsx
- CustomImage for all images

Create a detailed requirements.md with:
1. Component hierarchy diagram
2. Props interface for each component
3. State management strategy (URL params)
4. Server vs Client component decisions
5. Data flow patterns
6. Accessibility requirements per component
7. Mobile vs Desktop layout differences
</prompt>

**Expected Output**: `docs/menu-page/requirements.md`

**Handoff**: Requirements document feeds into architecture phase

---

### Sub-Phase 1.2: Shadcn Component Research

**Agent**: `shadcn-component-researcher`

**Purpose**: Research optimal shadcn components for the menu page

**MCPs**:
- `mcp__shadcn__search_items_in_registries` - Search for components
- `mcp__shadcn__view_items_in_registries` - View component details
- `mcp__shadcn__get_item_examples_from_registries` - Get usage examples

<prompt>
Research shadcn/ui components needed for the Menu Page feature.

REQUIRED COMPONENTS:
1. Accordion - for category/subcategory navigation
2. Sheet/Drawer - for mobile filter panel
3. Skeleton - for loading states
4. Pagination - for product pagination
5. Badge - for filter chips/tags
6. Button - various CTA buttons
7. Card - for empty/error states
8. Separator - visual dividers

For each component:
1. Search in @shadcn registry
2. Get full component code and documentation
3. Find usage examples (search for "{component}-demo")
4. Note any dependencies or peer components needed
5. Identify customization points for Pizza Space branding

Create research.md with:
- Component availability status
- Installation commands
- Code snippets and examples
- Customization recommendations
- Accessibility features included
</prompt>

**Expected Output**: `docs/menu-page/research.md`

**Handoff**: Component research informs implementation decisions

---

### Sub-Phase 1.3: Premium UX Design

**Agent**: `premium-ux-designer`

**Purpose**: Design premium UX flows and visual hierarchy

**MCPs**:
- `mcp__21st-dev__21st_magic_component_inspiration` - Get UI inspiration
- `mcp__ref__ref_search_documentation` - Reference design patterns

<prompt>
Design a premium UX for the Pizza Space Menu Page.

PAGE STRUCTURE:
- Desktop: Fixed sidebar (left) + Scrollable product grid (right)
- Mobile: Full-width grid with floating filter FAB or top filter bar

USER FLOWS:
1. Initial load: Show all products with category sidebar expanded
2. Category selection: Filter products, update URL, smooth transition
3. Subcategory selection: Further filter within category
4. Pagination: Load more products, maintain scroll position
5. Back/Forward navigation: Restore filter state from URL
6. Search from header: Filter results, highlight search term

DESIGN REQUIREMENTS:
1. Visual hierarchy: Categories prominent, products scannable
2. Micro-interactions: Accordion expand/collapse, hover states
3. Loading feedback: Skeleton loaders, progress indicators
4. Error handling: Friendly error messages with retry
5. Empty state: Engaging illustration with CTA

Provide:
1. Wireframes description for desktop & mobile
2. Interaction specifications
3. Animation recommendations
4. Color usage guidelines (using existing orange-500 primary)
5. Typography hierarchy
6. Mobile gesture considerations
</prompt>

**Expected Output**: `docs/menu-page/ux-design.md`

**Handoff**: UX specs guide implementation and animation phases

---

## PHASE 2: Architecture & Design System

### Sub-Phase 2.1: Component Architecture

**Agent**: `nextjs-component-architect`

**Purpose**: Define component hierarchy and Server/Client boundaries

**MCPs**:
- `mcp__next-devtools__nextjs_docs` - Reference Next.js 16 patterns
- `mcp__ref__ref_search_documentation` - Architecture patterns

<prompt>
Design the component architecture for the Menu Page in Next.js 16 with App Router.

CONSTRAINTS:
- Route: /app/menu/page.tsx
- URL params: ?category=X&subcategory=Y&search=Z&page=N
- Server-side data fetching for SEO
- Client interactivity for filtering

COMPONENT HIERARCHY:
```
/app/menu/
  page.tsx (Server Component - data fetching, metadata)
  layout.tsx (optional - shared layout)
  loading.tsx (Suspense fallback)
  error.tsx (Error boundary)

/components/menu/
  menu-page-client.tsx (Client - orchestrates UI)
  sidebar/
    category-sidebar.tsx (Server - fetches categories)
    category-accordion.tsx (Client - accordion behavior)
    subcategory-list.tsx (Client - subcategory items)
    mobile-filter-sheet.tsx (Client - mobile drawer)
  product-grid/
    product-grid-container.tsx (Server - fetches products)
    product-grid.tsx (Client - renders grid)
    product-pagination.tsx (Client - pagination controls)
  states/
    menu-loading.tsx (Loading skeleton)
    menu-error.tsx (Error state)
    menu-empty.tsx (Empty state)
```

Provide:
1. Detailed component tree with responsibilities
2. Props interfaces for each component
3. Server vs Client component decisions with reasoning
4. Data fetching strategy (parallel, sequential)
5. State management (URL params + local state)
6. Suspense boundary placements
7. Error boundary strategy
</prompt>

**Expected Output**: `docs/menu-page/architecture.md`

**Handoff**: Architecture guides all implementation sub-phases

---

### Sub-Phase 2.2: Design System Integration

**Agent**: `nextjs-design-system`

**Purpose**: Ensure consistency with existing design tokens

**MCPs**:
- `mcp__shadcn__get_project_registries` - Check current setup

<prompt>
Review and extend the design system for Menu Page components.

EXISTING TOKENS (from globals.css / tailwind):
- Primary: orange-500
- Background: white / slate-900 (dark)
- Text: slate-900 / white (dark)
- Border: slate-100 / slate-800 (dark)
- Font: Montserrat (--font-montserrat)

NEW COMPONENTS NEEDING TOKENS:
1. Category Sidebar
   - Active category indicator
   - Hover state
   - Selected subcategory

2. Pagination
   - Active page
   - Disabled state
   - Hover state

3. Filter Chips
   - Active filter
   - Remove button

4. Empty/Error States
   - Illustration colors
   - CTA button variants

Provide:
1. CSS custom properties additions (if needed)
2. Tailwind class patterns for each component
3. Dark mode considerations
4. Consistent spacing scale usage
5. Animation timing tokens
</prompt>

**Expected Output**: `docs/menu-page/design-tokens.md`

**Handoff**: Design tokens used in implementation phase

---

## PHASE 3: Core Component Implementation

### Sub-Phase 3.1: Page Structure & SEO

**Agent**: `shadcn-implementation-builder`

**Purpose**: Implement the main page structure with SEO metadata

**MCPs**:
- `mcp__shadcn__get_add_command_for_items` - Install components
- `mcp__next-devtools__nextjs_docs` - Metadata API reference

<prompt>
Implement the Menu Page structure for Next.js 16 with strong SEO.

FILES TO CREATE:
1. /app/menu/page.tsx - Main server component
2. /app/menu/layout.tsx - Optional layout with metadata
3. /app/menu/loading.tsx - Suspense fallback
4. /app/menu/error.tsx - Error boundary

SEO REQUIREMENTS:
- Dynamic metadata based on selected category/subcategory
- JSON-LD structured data (MenuSection, ItemList)
- Canonical URLs with filter params
- Open Graph tags

IMPLEMENTATION:
```typescript
// page.tsx
interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: MenuPageProps): Promise<Metadata> {
  // Dynamic metadata based on filters
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  // Fetch data server-side
  // Render with Suspense boundaries
}
```

Include:
1. Full page.tsx implementation
2. Metadata generation with dynamic titles
3. JSON-LD for menu/products (ItemList schema)
4. Proper Suspense boundaries
5. Error boundary with retry functionality
</prompt>

**Expected Output**:
- `/app/menu/page.tsx`
- `/app/menu/layout.tsx`
- `/app/menu/loading.tsx`
- `/app/menu/error.tsx`
- `/components/seo/menu-json-ld.tsx`

**Handoff**: Page structure ready for component integration

---

### Sub-Phase 3.2: Sidebar Implementation

**Agent**: `shadcn-implementation-builder`

**Purpose**: Build the category/subcategory sidebar

**MCPs**:
- `mcp__shadcn__view_items_in_registries` - Accordion component
- `mcp__21st-dev__21st_magic_component_builder` - Custom sidebar

<prompt>
Implement the Category Sidebar for the Menu Page.

REQUIREMENTS:
1. Accordion-based category list
2. Subcategories nested under each category
3. Active state highlighting (from URL params)
4. Click updates URL (not internal state)
5. Server-side category fetch for SEO
6. Client-side interactivity for accordion

COMPONENTS TO BUILD:
1. /components/menu/sidebar/category-sidebar.tsx (Server)
   - Fetches categories with getCategories({ all: true })
   - Passes to client accordion

2. /components/menu/sidebar/category-accordion.tsx (Client)
   - Uses shadcn Accordion
   - Maps categories to AccordionItems
   - Handles URL updates on selection

3. /components/menu/sidebar/subcategory-list.tsx (Client)
   - Fetches subcategories per category (or all at once)
   - Renders as clickable list items
   - Highlights active subcategory

STYLING:
- Match existing design (slate-900 text, orange-500 active)
- Smooth expand/collapse animations
- Sticky positioning on desktop
- Proper focus states for accessibility

Include:
1. All component files
2. TypeScript interfaces
3. URL update logic using next/navigation
4. Loading skeleton for subcategories
5. Accessibility (ARIA labels, keyboard nav)
</prompt>

**Expected Output**:
- `/components/menu/sidebar/category-sidebar.tsx`
- `/components/menu/sidebar/category-accordion.tsx`
- `/components/menu/sidebar/subcategory-list.tsx`
- `/components/menu/sidebar/sidebar-skeleton.tsx`

**Handoff**: Sidebar ready for integration with product grid

---

### Sub-Phase 3.3: Product Grid Implementation

**Agent**: `shadcn-implementation-builder`

**Purpose**: Build the product grid with existing ProductCard

**MCPs**:
- `mcp__shadcn__search_items_in_registries` - Grid patterns
- `mcp__21st-dev__21st_magic_component_builder` - Grid layouts

<prompt>
Implement the Product Grid for the Menu Page.

REQUIREMENTS:
1. Reuse existing ProductCard component
2. Responsive grid (1 col mobile, 2 tablet, 3 desktop)
3. Server-side product fetch based on URL params
4. Pagination support
5. Loading/Error/Empty states

COMPONENTS TO BUILD:
1. /components/menu/product-grid/product-grid-container.tsx (Server)
   - Fetches products with getProducts({ categoryId, subCategoryId, search, page, limit: 12 })
   - Passes data to client grid

2. /components/menu/product-grid/product-grid.tsx (Client)
   - Renders ProductCard components
   - Handles grid layout responsive classes

3. /components/menu/product-grid/product-pagination.tsx (Client)
   - Page numbers with ellipsis for large sets
   - Previous/Next buttons
   - Updates URL on page change

4. /components/menu/states/menu-empty.tsx
   - Friendly illustration
   - Message based on context (no results vs no products)
   - CTA to clear filters

5. /components/menu/states/menu-error.tsx
   - Error message
   - Retry button

IMPLEMENTATION DETAILS:
- Use existing MenuSkeleton pattern for loading
- Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
- Pagination shows max 5 page numbers with ellipsis
- Empty state uses pizza-themed illustration

Include:
1. All component files with full implementation
2. Proper TypeScript types
3. URL param updates for pagination
4. Scroll-to-top on page change option
5. Accessible pagination (aria-current, aria-label)
</prompt>

**Expected Output**:
- `/components/menu/product-grid/product-grid-container.tsx`
- `/components/menu/product-grid/product-grid.tsx`
- `/components/menu/product-grid/product-pagination.tsx`
- `/components/menu/states/menu-empty.tsx`
- `/components/menu/states/menu-error.tsx`
- `/components/menu/states/menu-loading.tsx`

**Handoff**: Product grid ready for mobile integration

---

### Sub-Phase 3.4: Mobile Filter Implementation

**Agent**: `shadcn-implementation-builder`

**Purpose**: Build mobile-specific filter UI

**MCPs**:
- `mcp__shadcn__view_items_in_registries` - Sheet/Drawer component
- `mcp__shadcn__get_add_command_for_items` - Install Sheet

<prompt>
Implement the Mobile Filter Sheet for the Menu Page.

REQUIREMENTS:
1. Sheet/Drawer component for mobile filters
2. Contains same accordion as desktop sidebar
3. Filter FAB or top bar to trigger sheet
4. Active filter count badge
5. Apply/Clear buttons
6. Smooth open/close animations

COMPONENTS TO BUILD:
1. /components/menu/sidebar/mobile-filter-sheet.tsx (Client)
   - Uses shadcn Sheet component
   - Contains CategoryAccordion inside
   - Footer with Apply/Clear buttons

2. /components/menu/sidebar/filter-trigger.tsx (Client)
   - FAB button (fixed position on mobile)
   - Shows active filter count
   - Hidden on desktop (lg:hidden)

3. /components/menu/sidebar/active-filters.tsx (Client)
   - Horizontal scrollable chips
   - Shows current category, subcategory, search
   - Click to remove individual filters

LAYOUT STRATEGY:
- Desktop: sidebar visible (hidden sheet)
- Mobile: hidden sidebar, show filter FAB
- Breakpoint: lg (1024px)

STYLING:
- Sheet from bottom on mobile
- Max height 80vh
- Rounded top corners
- Backdrop blur

Include:
1. All component files
2. Sheet trigger and content
3. Active filter display
4. Clear all filters functionality
5. Close on filter apply
</prompt>

**Expected Output**:
- `/components/menu/sidebar/mobile-filter-sheet.tsx`
- `/components/menu/sidebar/filter-trigger.tsx`
- `/components/menu/sidebar/active-filters.tsx`

**Handoff**: Mobile filters ready for responsive integration

---

## PHASE 4: Advanced Features & Animations

### Sub-Phase 4.1: Animation Implementation

**Agent**: `nextjs-animation-specialist`

**Purpose**: Add micro-interactions and transitions

**MCPs**:
- `mcp__21st-dev__21st_magic_component_inspiration` - Animation examples
- `mcp__ref__ref_search_documentation` - Framer Motion patterns

<prompt>
Implement animations for the Menu Page components.

ANIMATION REQUIREMENTS:
1. Accordion expand/collapse (already in shadcn, enhance if needed)
2. Product grid stagger animation on filter change
3. Pagination transition (fade out old, fade in new)
4. Mobile sheet slide-up with spring physics
5. Filter chip add/remove animations
6. Empty state illustration animation
7. Loading skeleton shimmer (already exists, verify)

SPECIFIC IMPLEMENTATIONS:
1. Product Grid Transitions
   - Use AnimatePresence for grid changes
   - Stagger children on initial load
   - Fade + scale on filter change

2. Page Transitions
   - Smooth transition when pagination changes
   - Maintain scroll position or scroll-to-top

3. Sidebar Animations
   - Subtle hover states on category items
   - Active indicator slide animation

4. Mobile Sheet
   - Spring-based slide up
   - Backdrop fade
   - Drag to dismiss gesture

PERFORMANCE:
- Use will-change sparingly
- Prefer transform/opacity animations
- Respect prefers-reduced-motion

Include:
1. Animation wrapper components
2. Framer Motion variants
3. CSS transitions where appropriate
4. Reduced motion fallbacks
5. Performance optimizations
</prompt>

**Expected Output**:
- Animation updates to existing components
- `/components/menu/animations/` utility components if needed
- Updated component files with motion variants

**Handoff**: Animated components ready for optimization

---

### Sub-Phase 4.2: Responsive Design Polish

**Agent**: `nextjs-responsive-design`

**Purpose**: Ensure flawless responsive behavior

**MCPs**:
- `mcp__playwright__playwright_screenshot` - Visual testing
- `mcp__playwright__playwright_navigate` - Browser testing

<prompt>
Polish responsive design for the Menu Page across all breakpoints.

BREAKPOINTS:
- xs: 0-639px (mobile phones)
- sm: 640-767px (large phones)
- md: 768-1023px (tablets)
- lg: 1024-1279px (small laptops)
- xl: 1280px+ (desktops)

RESPONSIVE REQUIREMENTS:
1. Mobile (xs-md):
   - Full-width product grid (1 col xs, 2 cols sm-md)
   - Hidden sidebar, show filter FAB
   - Compact product cards
   - Bottom sheet for filters

2. Tablet (md-lg):
   - 2-column grid
   - Collapsible sidebar or persistent
   - Standard product cards

3. Desktop (lg+):
   - 3-column grid
   - Persistent sidebar (sticky)
   - Full product cards
   - Hover states active

SPECIFIC CHECKS:
1. Sidebar width transitions smoothly
2. Grid gap adjusts per breakpoint
3. Product card padding/font scales
4. Pagination fits on all screens
5. Filter chips scroll horizontally on mobile
6. Touch targets minimum 44px

Include:
1. Responsive class adjustments
2. Viewport-specific layout changes
3. Touch-friendly modifications
4. Landscape orientation handling
5. Safe area insets (notch devices)
</prompt>

**Expected Output**:
- Responsive class updates to all components
- Media query additions if needed
- Mobile-specific style adjustments

**Handoff**: Responsive components ready for accessibility

---

## PHASE 5: Optimization & Polish

### Sub-Phase 5.1: Accessibility Audit

**Agent**: `nextjs-accessibility-expert`

**Purpose**: Ensure WCAG 2.1 AA compliance

**MCPs**:
- `mcp__playwright__playwright_evaluate` - A11y testing
- `mcp__ref__ref_search_documentation` - WCAG guidelines

<prompt>
Conduct accessibility audit for the Menu Page.

WCAG 2.1 AA REQUIREMENTS:
1. Perceivable
   - All images have alt text (ProductCard already has this)
   - Color contrast minimum 4.5:1
   - Text resizable to 200%

2. Operable
   - Keyboard navigation (Tab, Enter, Escape)
   - Focus indicators visible
   - Skip links to main content
   - No keyboard traps

3. Understandable
   - Consistent navigation
   - Clear error messages
   - Form labels (for search)

4. Robust
   - Valid HTML
   - ARIA used correctly
   - Screen reader compatible

SPECIFIC CHECKS:
1. Accordion
   - aria-expanded state
   - aria-controls linking
   - Keyboard: Space/Enter to toggle

2. Pagination
   - aria-current="page" on active
   - aria-label for page numbers
   - Disable focus on disabled buttons

3. Product Grid
   - List semantics (ul/li or grid role)
   - Card as article element
   - Landmark regions

4. Mobile Sheet
   - Focus trap when open
   - Escape to close
   - aria-modal="true"

5. Filter Chips
   - Clear button has accessible name
   - Remove announces to screen reader

Include:
1. ARIA attribute additions
2. Keyboard handler implementations
3. Focus management code
4. Screen reader announcements (aria-live)
5. Skip link component
</prompt>

**Expected Output**:
- Accessibility updates to all components
- `/components/menu/skip-link.tsx`
- ARIA and role additions

**Handoff**: Accessible components ready for performance

---

### Sub-Phase 5.2: Performance Optimization

**Agent**: `nextjs-performance-optimizer`

**Purpose**: Optimize Core Web Vitals

**MCPs**:
- `mcp__next-devtools__nextjs_index` - Dev server diagnostics
- `mcp__next-devtools__nextjs_call` - Runtime checks
- `mcp__playwright__playwright_evaluate` - Performance metrics

<prompt>
Optimize Menu Page performance for Core Web Vitals.

METRICS TARGETS:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

OPTIMIZATION AREAS:
1. Images
   - ProductCard images: proper sizes attribute
   - Priority loading for above-fold products
   - Placeholder/blur for lazy images

2. JavaScript
   - Minimize client-side JS
   - Dynamic imports for heavy components
   - Debounce search/filter handlers

3. Data Fetching
   - Parallel fetches (categories + products)
   - Proper caching headers
   - Streaming with Suspense

4. Layout Stability
   - Skeleton matches content dimensions
   - Fixed sidebar width
   - Reserved space for pagination

5. Code Splitting
   - Mobile sheet only loads on mobile
   - Animation code conditional

IMPLEMENTATION:
1. Add priority to first 4-6 product images
2. Implement intersection observer for lazy cards
3. Add sizes attribute based on grid columns
4. Use React.memo for ProductCard
5. Virtualize long product lists (if > 50 items)

Include:
1. Image optimization updates
2. Code splitting implementation
3. Memoization strategies
4. Bundle analysis recommendations
5. Caching strategies for API routes
</prompt>

**Expected Output**:
- Performance optimizations in components
- Lazy loading implementations
- Bundle optimization suggestions

**Handoff**: Optimized components ready for final review

---

## PHASE 6: Review & QA

### Sub-Phase 6.1: Code Review

**Agent**: `nextjs-ui-reviewer`

**Purpose**: Final code quality review

**MCPs**:
- `mcp__playwright__playwright_navigate` - Test navigation
- `mcp__playwright__playwright_screenshot` - Visual snapshots
- `mcp__next-devtools__nextjs_call` - Error checking

<prompt>
Conduct final code review for the Menu Page implementation.

REVIEW CHECKLIST:
1. Code Quality
   - TypeScript strict mode compliance
   - No any types
   - Proper error handling
   - Consistent naming conventions

2. Component Patterns
   - Server/Client boundary correctness
   - Props interface documentation
   - Proper use of composition
   - No prop drilling (use context if needed)

3. Styling
   - Consistent with design system
   - Dark mode support
   - No hardcoded colors/spacing
   - Responsive classes organized

4. Accessibility
   - All interactive elements accessible
   - Proper heading hierarchy
   - ARIA attributes correct
   - Keyboard navigation works

5. Performance
   - No unnecessary re-renders
   - Proper memoization
   - Images optimized
   - No layout shifts

6. SEO
   - Metadata complete
   - JSON-LD valid
   - Semantic HTML
   - URLs shareable

7. Error Handling
   - API errors handled gracefully
   - Loading states implemented
   - Empty states friendly
   - No console errors

RUN CHECKS:
1. npm run lint - No ESLint errors
2. npm run build - No build errors
3. Browser test - All interactions work
4. Lighthouse audit - Scores acceptable

Provide:
1. Issues found with severity
2. Recommended fixes
3. Code snippets for fixes
4. Final approval or blocking issues
</prompt>

**Expected Output**:
- `docs/menu-page/review-report.md`
- Code fixes for any issues found

**Handoff**: Feature complete and ready for deployment

---

### Sub-Phase 6.2: Visual QA with Playwright

**Agent**: `nextjs-ui-reviewer`

**Purpose**: Visual testing across browsers/viewports

**MCPs**:
- `mcp__playwright__playwright_navigate` - Navigate to pages
- `mcp__playwright__playwright_screenshot` - Capture screenshots
- `mcp__playwright__playwright_click` - Test interactions
- `mcp__playwright__playwright_get_visible_text` - Verify content

<prompt>
Perform visual QA for Menu Page using Playwright.

TEST SCENARIOS:
1. Initial Load
   - Navigate to /menu
   - Screenshot desktop viewport
   - Screenshot mobile viewport
   - Verify all categories load
   - Verify products display

2. Category Selection
   - Click on a category
   - Verify URL updates
   - Verify products filter
   - Screenshot filtered state

3. Subcategory Selection
   - Expand category accordion
   - Click subcategory
   - Verify further filtering
   - Screenshot state

4. Pagination
   - Navigate to page 2
   - Verify URL and content
   - Test previous/next buttons
   - Screenshot pagination states

5. Mobile Flow
   - Set mobile viewport
   - Open filter sheet
   - Select filters
   - Verify results
   - Screenshot each step

6. Error States
   - Test with invalid params
   - Screenshot error state

7. Empty State
   - Filter to no results
   - Screenshot empty state

VIEWPORTS:
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1280x720 (Laptop)
- Wide: 1920x1080 (Desktop)

Output screenshots to /docs/menu-page/screenshots/
</prompt>

**Expected Output**:
- `/docs/menu-page/screenshots/` with all test images
- QA report with pass/fail for each scenario

**Handoff**: Feature complete with visual documentation

---

## Sprint Organization

### Sprint 1: Foundation (Estimated: 2-3 days)

**Parallel Execution Group A:**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 1.1 Requirements | `shadcn-requirements-analyzer` | None |
| 1.2 Research | `shadcn-component-researcher` | None |
| 1.3 UX Design | `premium-ux-designer` | None |

**Sequential (after Group A):**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 2.1 Architecture | `nextjs-component-architect` | 1.1, 1.2, 1.3 |
| 2.2 Design System | `nextjs-design-system` | 2.1 |

---

### Sprint 2: Core Implementation (Estimated: 3-4 days)

**Sequential Execution:**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 3.1 Page Structure | `shadcn-implementation-builder` | 2.1, 2.2 |
| 3.2 Sidebar | `shadcn-implementation-builder` | 3.1 |
| 3.3 Product Grid | `shadcn-implementation-builder` | 3.1 |
| 3.4 Mobile Filters | `shadcn-implementation-builder` | 3.2 |

**Note**: 3.2 and 3.3 can run in parallel after 3.1

---

### Sprint 3: Enhancement (Estimated: 2-3 days)

**Parallel Execution:**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 4.1 Animations | `nextjs-animation-specialist` | 3.x complete |
| 4.2 Responsive | `nextjs-responsive-design` | 3.x complete |

---

### Sprint 4: Optimization (Estimated: 2 days)

**Sequential Execution:**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 5.1 Accessibility | `nextjs-accessibility-expert` | 4.x complete |
| 5.2 Performance | `nextjs-performance-optimizer` | 5.1 |

---

### Sprint 5: Review (Estimated: 1-2 days)

**Sequential Execution:**
| Sub-Phase | Agent | Dependencies |
|-----------|-------|--------------|
| 6.1 Code Review | `nextjs-ui-reviewer` | 5.x complete |
| 6.2 Visual QA | `nextjs-ui-reviewer` | 6.1 |

---

## Execution Commands

### Trigger Individual Phases

```bash
# Phase 1: Requirements & Research
claude "Execute Sub-Phase 1.1: Run shadcn-requirements-analyzer for Menu Page"
claude "Execute Sub-Phase 1.2: Run shadcn-component-researcher for Menu Page"
claude "Execute Sub-Phase 1.3: Run premium-ux-designer for Menu Page"

# Phase 2: Architecture
claude "Execute Sub-Phase 2.1: Run nextjs-component-architect for Menu Page"
claude "Execute Sub-Phase 2.2: Run nextjs-design-system for Menu Page"

# Phase 3: Implementation
claude "Execute Sub-Phase 3.1: Run shadcn-implementation-builder for Menu Page structure"
claude "Execute Sub-Phase 3.2: Run shadcn-implementation-builder for Menu Sidebar"
claude "Execute Sub-Phase 3.3: Run shadcn-implementation-builder for Product Grid"
claude "Execute Sub-Phase 3.4: Run shadcn-implementation-builder for Mobile Filters"

# Phase 4: Enhancement
claude "Execute Sub-Phase 4.1: Run nextjs-animation-specialist for Menu Page"
claude "Execute Sub-Phase 4.2: Run nextjs-responsive-design for Menu Page"

# Phase 5: Optimization
claude "Execute Sub-Phase 5.1: Run nextjs-accessibility-expert for Menu Page"
claude "Execute Sub-Phase 5.2: Run nextjs-performance-optimizer for Menu Page"

# Phase 6: Review
claude "Execute Sub-Phase 6.1: Run nextjs-ui-reviewer for Menu Page"
claude "Execute Sub-Phase 6.2: Run visual QA with Playwright for Menu Page"
```

### Bulk Sprint Triggers

```bash
# Sprint 1: Foundation
claude "Execute Sprint 1 for Menu Page: Requirements, Research, UX Design, Architecture"

# Sprint 2: Core Implementation
claude "Execute Sprint 2 for Menu Page: Page Structure, Sidebar, Product Grid, Mobile Filters"

# Sprint 3: Enhancement
claude "Execute Sprint 3 for Menu Page: Animations and Responsive Design"

# Sprint 4: Optimization
claude "Execute Sprint 4 for Menu Page: Accessibility and Performance"

# Sprint 5: Review
claude "Execute Sprint 5 for Menu Page: Code Review and Visual QA"
```

### Full Feature Trigger

```bash
# Complete feature implementation
claude "Implement complete Menu Page feature following execution plan at docs/menu-page-execution-plan.md"
```

---

## File Structure Summary

```
/app/menu/
  page.tsx
  layout.tsx
  loading.tsx
  error.tsx

/components/menu/
  menu-page-client.tsx
  skip-link.tsx
  sidebar/
    category-sidebar.tsx
    category-accordion.tsx
    subcategory-list.tsx
    mobile-filter-sheet.tsx
    filter-trigger.tsx
    active-filters.tsx
    sidebar-skeleton.tsx
  product-grid/
    product-grid-container.tsx
    product-grid.tsx
    product-pagination.tsx
  states/
    menu-loading.tsx
    menu-error.tsx
    menu-empty.tsx

/components/seo/
  menu-json-ld.tsx

/docs/menu-page/
  requirements.md
  research.md
  ux-design.md
  architecture.md
  design-tokens.md
  review-report.md
  screenshots/
```

---

## Success Criteria

| Criteria | Target | Measurement |
|----------|--------|-------------|
| Build Success | 0 errors | `npm run build` |
| Lint Success | 0 errors | `npm run lint` |
| Lighthouse Performance | > 90 | Chrome DevTools |
| Lighthouse Accessibility | 100 | Chrome DevTools |
| Lighthouse SEO | 100 | Chrome DevTools |
| Mobile Responsiveness | Pass | Manual + Playwright |
| All States Working | Pass | Manual + Playwright |
| URL Shareability | Pass | Manual testing |
| Dark Mode | Pass | Theme toggle test |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API latency | Implement optimistic UI, skeleton loaders |
| Large product lists | Implement virtualization if > 50 items |
| Complex filter combinations | Test all combinations, handle edge cases |
| Mobile performance | Lazy load sheet, minimize animations |
| SEO indexing | Verify with Google Search Console, test structured data |

---

## Notes

1. **Existing ProductCard**: Reuse without modification unless bugs found
2. **CustomImage**: Always use instead of next/image directly
3. **URL State**: All filters must be in URL for shareability and SEO
4. **Server Components**: Maximize for SEO, minimize client JS
5. **Accessibility**: Test with screen reader before approval
6. **Dark Mode**: Test all components in both themes
