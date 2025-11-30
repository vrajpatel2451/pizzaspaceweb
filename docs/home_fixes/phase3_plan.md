# PizzaSpace Home Page Phase 3 Fixes - Execution Plan

## Executive Summary

This document outlines the comprehensive execution plan for Phase 3 fixes to the PizzaSpace home page. These fixes focus on API integration, removing duplicate/unused components, fixing styling issues, adding global store state, British localization, and SEO improvements.

### Project Overview

| Attribute | Details |
|-----------|---------|
| **Project** | PizzaSpace Home Page Phase 3 Fixes |
| **Framework** | Next.js 16 with App Router, React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Primary Color** | Orange (#F97316) |
| **Secondary Color** | Navy (#0e182b) |
| **Total Fix Sections** | 11 sections + global changes |
| **Estimated Complexity** | High |
| **Dark Mode** | Required (next-themes configured) |

### Fix Categories Summary

| Category | Sections Affected | Priority |
|----------|-------------------|----------|
| **Remove Components** | Make Your Order, Awards & Achievements | High |
| **API Integration & Remove Mock Data** | Header (search), Hero (products), Categories (all), Menu (tabs & items), Store (all) | Critical |
| **Styling Fixes** | Header (light mode), Menu (tab CSS), Store (dark mode), About (cards), Footer | High |
| **Complete Redesign** | Vision & Mission | Medium |
| **Localization** | All sections (British formats) | High |
| **SEO** | Meta tags, favicons, semantic HTML | Medium |
| **Global State** | Store selection, store-specific data | Critical |

---

## Section-by-Section Breakdown

---

## SECTION 1: Header Section Fixes

### Current State
- TopInfoBar with "Find a Store" link exists
- Separate store locator functionality not integrated into main header
- Light mode styling issues
- Search popup exists but not connected to APIs
- No global store state management

### Target State
- Single unified header (remove duplicate "Find a Store" element)
- Fixed light mode appearance
- Search popup integrated with categories and products APIs
- Store locator in header with nearby store selection
- Global store state maintained on server and client side

### Complexity: High

### Phases

#### Phase 1.1: Audit & Remove Duplicate Header Elements
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Audit the header components in /components/layout/header/:
1. Identify all duplicate or conflicting header elements
2. The TopInfoBar has "Find a Store" - evaluate if this duplicates main header functionality
3. Document which elements should be removed vs consolidated
4. Check for multiple header wrappers or navigation elements

Files to review:
- components/layout/header/index.tsx
- components/layout/header/top-info-bar.tsx
- components/layout/header/header-client.tsx
- components/layout/header/header-nav.tsx

Provide:
- List of duplicate elements to remove
- Consolidation strategy
- Component dependency map
```

**Expected Output:** Header audit report with removal recommendations
**Handoff:** Implementation of removals

#### Phase 1.2: Fix Light Mode Styling
**Agent:** `nextjs-design-system`
**MCP Tools:** `playwright`

```prompt
Fix light mode styling issues in the header:

Current Issues:
- Header may not look good in light mode
- Contrast issues possible
- Background/text color inconsistencies

Requirements:
1. Audit all header components for hardcoded dark colors
2. Replace with CSS variables that respect theme
3. Ensure proper contrast ratios in light mode
4. Test all interactive states (hover, focus, active)
5. Verify TopInfoBar, MainHeader, Navigation, Icons all work in light mode

Use Tailwind's dark: variants properly:
- bg-secondary should work in both modes
- text-secondary-foreground should have proper contrast
- All icons should be visible in both themes

Test with playwright at various viewport sizes in light mode.
```

**Expected Output:** Light mode fixes for all header components
**Handoff:** Search popup integration

#### Phase 1.3: Integrate Search with APIs
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`, `next-devtools`

```prompt
Integrate the search command popup with real APIs:

Current State:
- SearchCommand component exists in components/layout/header/search-command.tsx
- Categories API available: lib/api/categories.ts
- Products API available: lib/api/products.ts

Requirements:
1. On search popup open, fetch categories for quick navigation
2. Implement product search with debounced API calls
3. Show category pills/chips for filtering
4. Display search results with product cards
5. Handle loading and empty states
6. Implement "Popular Searches" using categories API (limit: 2-3)
7. Add keyboard navigation for results

API Integration:
- GET /categories?limit=5 for trending categories
- GET /product?search=query for product search
- Debounce search input (300ms)

Use existing Command component from shadcn.
Make search results clickable to navigate to products/categories.
```

**Expected Output:** Fully integrated search popup with API data
**Handoff:** Store locator implementation

#### Phase 1.4: Add Store Locator to Header
**Agent:** `nextjs-component-architect`, `shadcn-implementation-builder`
**MCP Tools:** `shadcn`, `next-devtools`

```prompt
Add store locator functionality to the main header:

Requirements:
1. Create StoreLocator component in header
2. On click, show dropdown/modal with nearby stores
3. Use existing stores API: lib/api/stores.ts
4. Allow user to select their preferred store
5. Show selected store name in header (condensed on mobile)
6. Store selection persists across sessions (localStorage + cookies)

API Integration:
- GET /store?isActive=true for store list
- Consider geolocation for sorting by distance (optional enhancement)

Component Structure:
- components/layout/header/store-locator.tsx (Client Component)
- Dialog/Dropdown for store selection
- Selected store badge in header

Mobile Behavior:
- Icon-only trigger on mobile
- Full modal for store selection
```

**Expected Output:** Store locator component integrated in header
**Handoff:** Global store state implementation

#### Phase 1.5: Implement Global Store State
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Implement global store state management:

Requirements:
1. Create store context/provider for client-side state
2. Store selected store ID in:
   - React Context (client-side)
   - Cookies (for server-side access)
   - localStorage (persistence)
3. Create utility functions to get store ID on server
4. All API calls should use store ID when relevant
5. Handle default store (first store or geo-nearest)

Implementation:
- lib/store-context.tsx - React context provider
- lib/store-utils.ts - Server-side utilities
- Wrap app in StoreProvider

Files to Create:
- lib/contexts/store-context.tsx
- lib/utils/store-cookies.ts

Usage Pattern:
- Client: useStore() hook
- Server: getStoreFromCookies(cookies)

Ensure store ID is available to:
- Header (display selected store)
- Hero section (store-specific products)
- Categories (store availability)
- Menu (store-specific items)
- Store section (highlight selected)
```

**Expected Output:** Global store state system
**Handoff:** Review

#### Phase 1.6: Header Review & Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review and test all header fixes:

Checklist:
- [ ] No duplicate header elements
- [ ] Light mode styling correct
- [ ] Search popup fetches categories and products
- [ ] Store locator shows nearby stores
- [ ] Store selection persists on reload
- [ ] Store ID accessible on server and client
- [ ] All components responsive
- [ ] Dark mode still works
- [ ] Accessibility maintained

Test Scenarios:
1. Switch to light mode - verify all elements visible
2. Open search - verify categories load
3. Type search query - verify products appear
4. Select store - verify persistence
5. Refresh page - verify store still selected
6. Check on mobile viewport

Create automated tests with Playwright.
```

**Expected Output:** Test report and any remaining fixes
**Success Criteria:**
- [ ] Single unified header
- [ ] Light mode fully functional
- [ ] Search integrated with APIs
- [ ] Store locator working
- [ ] Global store state implemented
- [ ] All tests passing

---

## SECTION 2: Hero Section Fixes

### Current State
- Static/mock hero content
- Two CTAs: "View Menu" and "Order Now" (redundant)
- No API integration for products
- No trending categories display

### Target State
- Use product API for hero products (already built)
- Use categories API for trending (limit 2-3)
- Use same API for popular searches
- Single CTA (remove duplicate)

### Complexity: Medium

### Phases

#### Phase 2.1: Remove Duplicate CTA
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Remove duplicate CTA from hero section:

Current State:
- Hero has both "View Menu" and "Order Now" buttons
- These mean the same thing

Requirements:
1. Review hero-content.tsx in components/home/hero-section/
2. Remove one CTA (recommend keeping "Order Now" as more action-oriented)
3. Or combine into single prominent CTA
4. Ensure remaining CTA links to /menu
5. Update mobile version as well

Consider:
- Which CTA has better conversion potential?
- Keep styling consistent with design system
- Maintain accessibility (proper button role, aria-label)
```

**Expected Output:** Hero with single CTA
**Handoff:** API integration

#### Phase 2.2: Integrate Product API
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Integrate product API into hero section:

Current State:
- Hero section in components/home/hero-section/
- Floating product cards may use mock data
- Product API exists in lib/api/products.ts

Requirements:
1. Fetch featured/hero products from API
2. Use in FloatingCards component
3. Show product images, names, prices
4. Consider store-specific products (use global store ID)
5. Handle API failures gracefully (fallback to static)

API Call:
- GET /product?limit=3&featured=true (or similar)
- Or use first 3 products from default category

Make hero section a Server Component for initial data.
Pass products to client FloatingCards component.
```

**Expected Output:** Hero with API-driven product cards
**Handoff:** Trending categories

#### Phase 2.3: Add Trending Categories
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Add trending categories display below hero search:

Requirements:
1. Below hero search bar, show "Trending:" label
2. Display 2-3 category pills/badges
3. Fetch from categories API with limit: 3
4. Make pills clickable to filter menu
5. Style as subtle chips (not too prominent)

API Call:
- GET /categories?limit=3

Implementation:
- Add to hero-content.tsx or create hero-trending.tsx
- Use Badge component for pills
- Link to /menu?category=slug

Example UI:
Trending: [Pizza] [Starters] [Desserts]
```

**Expected Output:** Trending categories in hero
**Handoff:** Popular searches

#### Phase 2.4: Add Popular Searches
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `shadcn`

```prompt
Add popular searches to hero or search component:

Requirements:
1. Display popular search suggestions
2. Use same categories API (limit 2-3)
3. Show in hero section or search popup
4. Make clickable to execute search

Implementation Options:
A) In Hero: Show as "Popular: Margherita, Pepperoni, Garlic Bread"
B) In Search Popup: Show as suggestions before typing

Use categories as proxy for popular searches.
Could also use top products if product API supports sorting by popularity.
```

**Expected Output:** Popular searches implemented
**Handoff:** Review

#### Phase 2.5: Hero Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Review hero section fixes:

Checklist:
- [ ] Single CTA button only
- [ ] Product API integrated
- [ ] Floating cards show real products
- [ ] Trending categories displayed
- [ ] Popular searches available
- [ ] Responsive on all viewports
- [ ] Dark mode works
- [ ] Loading states handled
- [ ] Error states handled

Test Scenarios:
1. Page load - verify products load from API
2. Click trending category - navigates correctly
3. Mobile view - verify single CTA
4. API failure - graceful fallback
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Single CTA
- [ ] Real product data in hero
- [ ] Trending categories shown
- [ ] Popular searches functional

---

## SECTION 3: Remove Make Your Order Section

### Current State
- MakeOrderSection exists in components/home/make-order-section/
- Rendered in app/page.tsx
- Contains "Browse Menu" CTA

### Target State
- Section completely removed
- No trace in page or component directory

### Complexity: Low

### Phases

#### Phase 3.1: Remove Section
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Remove the Make Your Order section completely:

Steps:
1. Remove import from app/page.tsx:
   - Remove: import { MakeOrderSection } from "@/components/home/make-order-section";
   - Remove: <MakeOrderSection /> from JSX

2. Delete component directory:
   - Delete: components/home/make-order-section/index.tsx
   - Delete: components/home/make-order-section/ directory

3. Update any barrel exports if exist:
   - Check components/home/index.ts if it exists
   - Remove MakeOrderSection export

4. Verify no other imports reference this component

Ensure page still renders correctly after removal.
```

**Expected Output:** Section removed
**Success Criteria:**
- [ ] Component directory deleted
- [ ] Import removed from page.tsx
- [ ] Page renders without errors
- [ ] No broken references

---

## SECTION 4: Categories Section Fixes

### Current State
- Has filter chips/tags (should be removed)
- Shows "6 categories" count label
- Uses API with mock fallback
- Client-side rendering for carousel

### Target State
- Remove filter chips, keep only image grid
- Remove count label
- Use only real API data (no mock fallback display)
- Mobile: 2-item grid with smaller fonts
- Server-side component for SEO
- Full API integration with proper error handling

### Complexity: Medium

### Phases

#### Phase 4.1: API Integration & Remove Mock Data
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Integrate Categories API and remove all mock data:

Files to modify:
- components/home/categories-section/index.tsx
- components/home/categories-section/categories-content.tsx
- lib/api/categories.ts

Current State:
- Categories API exists in lib/api/categories.ts
- Component may have mock data fallback

Requirements:
1. Ensure CategoriesSection fetches from real API:
   - GET /categories (from lib/api/categories.ts)
   - Use getCategories() function
2. Remove ALL mock/hardcoded category data
3. Remove any MOCK_CATEGORIES arrays
4. Handle API errors gracefully:
   - Show error message to user (not mock data)
   - Log errors for debugging
   - Consider retry mechanism
5. Add loading skeleton while fetching
6. Use global store ID if categories are store-specific

API Integration Pattern:
async function CategoriesSection() {
  const categories = await getCategories({ limit: 10 });

  if (!categories || categories.length === 0) {
    return <CategoriesEmptyState />;
  }

  return <CategoriesContent categories={categories} />;
}

Remove:
- Any mock data imports
- Fallback to mock data on API error
- Hardcoded category arrays
```

**Expected Output:** Categories using real API only
**Handoff:** UI cleanup

#### Phase 4.2: Remove Chips and Count Label
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Clean up categories section UI:

Files to modify:
- components/home/categories-section/index.tsx
- components/home/categories-section/categories-content.tsx
- components/home/categories-section/filter-tags.tsx (may delete)
- components/home/categories-section/categories-pills.tsx (may delete)

Requirements:
1. Remove filter chips/tags component
2. Remove "6 categories" or any count label
3. Keep only the image grid/carousel
4. Clean up unused imports
5. Delete filter-tags.tsx and categories-pills.tsx if no longer needed

Keep:
- Section header (badge + title + description)
- Category image cards
- Navigation arrows for carousel
```

**Expected Output:** Cleaned categories section
**Handoff:** Mobile optimization

#### Phase 4.2: Mobile Grid Optimization
**Agent:** `nextjs-responsive-design`
**MCP Tools:** `playwright`

```prompt
Optimize categories section for mobile:

Requirements:
1. Mobile: 2-item grid layout (instead of carousel or single item)
2. Smaller font sizes on mobile cards
3. Reduced padding for compact display
4. Maintain touch-friendly tap targets

Implementation:
- Use grid-cols-2 on mobile
- Reduce card title font: text-xs on mobile, text-sm on tablet
- Adjust image sizes proportionally
- Consider aspect-square images for consistent grid

Breakpoints:
- Mobile (<640px): 2-column grid
- Tablet (640-1023px): 3-4 column grid or carousel
- Desktop (1024px+): Carousel with 5+ visible

Test with Playwright at 320px, 375px, 414px viewports.
```

**Expected Output:** Mobile-optimized categories
**Handoff:** Server-side conversion

#### Phase 4.3: Convert to Server-Side Component
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Convert categories section to server-side for SEO:

Current State:
- CategoriesSection fetches data server-side
- CategoriesContent may be client component for carousel

Requirements:
1. Keep main section as Server Component
2. Ensure category data is in initial HTML for SEO
3. If carousel needed, pass data as props to client component
4. Remove mock data fallback from display (can keep for dev only)
5. Handle API errors gracefully (show message, not mock data)

Pattern:
async function CategoriesSection() {
  const categories = await getCategories({ limit: 10 });
  return (
    <section>
      {/* Server-rendered content for SEO */}
      <CategoriesGrid categories={categories} />
    </section>
  );
}

Consider:
- Static generation with revalidation
- Error boundary for API failures
- Skeleton during loading (client-side navigation)
```

**Expected Output:** SEO-optimized categories section
**Handoff:** Review

#### Phase 4.4: Categories Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review categories section fixes:

Checklist:
- [ ] No filter chips visible
- [ ] No count label visible
- [ ] Real API data only (no mock in production)
- [ ] Mobile: 2-column grid
- [ ] Mobile: Smaller fonts
- [ ] Server-side rendered
- [ ] SEO: Category names in HTML
- [ ] Dark mode works
- [ ] Responsive across viewports

Test:
1. View page source - verify categories in HTML
2. Mobile viewport - verify 2-column grid
3. API failure - verify graceful handling
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Real API integrated (no mock data)
- [ ] Chips removed
- [ ] Count label removed
- [ ] Mobile 2-column grid
- [ ] Server-side for SEO
- [ ] Error handling works
- [ ] Loading states present
- [ ] Empty state handles no data

---

## SECTION 5: Menu Section Fixes

### Current State
- Uses API with mock fallback
- Tab bar for categories
- Selected tab CSS has positioning issues
- Shows "6 out of 6 dishes" count

### Target State
- Use only real API data
- Fix selected tab CSS positioning
- Server-side for SEO
- Remove dish count display
- No mock data
- Full API integration for categories tabbar and menu items

### Complexity: Medium

### Phases

#### Phase 5.1: API Integration & Remove Mock Data
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Integrate Menu APIs and remove all mock data:

Files to modify:
- components/home/menu-section/index.tsx
- components/home/menu-section/menu-content.tsx
- components/home/menu-section/menu-tabs.tsx
- components/home/menu-section/product-grid.tsx
- lib/api/products.ts
- lib/api/categories.ts

Current State:
- Products API exists in lib/api/products.ts
- Categories API exists in lib/api/categories.ts
- Component may have mock data fallback

Requirements:
1. Tab Bar Categories:
   - Fetch categories from API: getCategories()
   - Display as tabs for filtering
   - No hardcoded tab labels

2. Menu Items/Products:
   - Fetch products from API: getProducts({ categoryId, limit })
   - Filter by selected category tab
   - Use global store ID for store-specific products

3. Remove ALL mock data:
   - Remove MOCK_PRODUCTS arrays
   - Remove MOCK_CATEGORIES arrays
   - Remove any hardcoded product data
   - Remove fallback to mock on API error

4. Error Handling:
   - Show user-friendly error message
   - Empty state for no products
   - Loading skeletons during fetch

5. Pagination/Load More:
   - Use API pagination
   - No mock data for additional items

API Integration Pattern:
async function MenuSection() {
  const [categories, products] = await Promise.all([
    getCategories({ limit: 10 }),
    getProducts({ limit: 8 })
  ]);

  return (
    <MenuContent
      initialCategories={categories}
      initialProducts={products}
    />
  );
}

Remove:
- All mock data imports
- Fallback to mock data
- Hardcoded product arrays
```

**Expected Output:** Menu using real APIs only
**Handoff:** CSS fixes

#### Phase 5.2: Fix Tab CSS Positioning
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `playwright`

```prompt
Fix the selected tab positioning issue in menu section:

File: components/home/menu-section/menu-tabs.tsx

Current Issue:
- Selected tab position is "weird" (per spec)
- CSS issue with active state indicator

Requirements:
1. Inspect current tab implementation
2. Fix positioning of selected/active tab indicator
3. Ensure smooth transition between tabs
4. Maintain proper alignment on all viewport sizes
5. Test horizontal scroll behavior on mobile

Common fixes:
- Use proper flexbox/grid alignment
- Ensure indicator uses correct transform origin
- Check for conflicting position: absolute/relative
- Verify z-index stacking

Use Playwright to capture before/after screenshots.
```

**Expected Output:** Fixed tab CSS
**Handoff:** Remove count

#### Phase 5.2: Remove Dish Count Display
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Remove the dish count display from menu section:

Files to modify:
- components/home/menu-section/menu-content.tsx
- components/home/menu-section/index.tsx

Current:
- Shows something like "6 out of 6 dishes" or "Showing 6 dishes"

Requirements:
1. Find and remove count display
2. May be in header or below tabs
3. Remove related state/logic if unused
4. Clean up any pagination count text

Keep:
- "Load More" button (if paginated)
- Category tabs
- Product grid
```

**Expected Output:** Menu without dish count
**Handoff:** Server-side conversion

#### Phase 5.3: Convert to Server-Side for SEO
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Convert menu section to server-side rendering for SEO:

Current State:
- MenuSection fetches initial data server-side
- MenuContent handles client-side filtering/pagination

Requirements:
1. Ensure initial products are server-rendered in HTML
2. Keep filtering as client-side enhancement
3. Use real API data only (remove mock fallback in production)
4. Products should be indexable by search engines
5. Handle "Load More" client-side

Pattern:
- Server: Fetch initial products, render in HTML
- Client: Handle tab switching, load more
- Hydrate client component with server data

Consider environment check for mock data:
if (process.env.NODE_ENV === 'development' && apiError) {
  // Use mock in dev only
}
```

**Expected Output:** SEO-optimized menu section
**Handoff:** Review

#### Phase 5.4: Menu Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review menu section fixes:

Checklist:
- [ ] Tab CSS positioning fixed
- [ ] No dish count displayed
- [ ] Real API data only
- [ ] Server-side rendered for SEO
- [ ] Products in HTML source
- [ ] Tab switching works
- [ ] Load More works
- [ ] Responsive design intact
- [ ] Dark mode works

Test Scenarios:
1. Inspect HTML source - verify products present
2. Click tabs - verify smooth switching
3. Check tab indicator position
4. Mobile viewport - verify horizontal scroll
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Real API integrated for categories tabbar
- [ ] Real API integrated for menu items
- [ ] No mock data anywhere
- [ ] Tab CSS fixed
- [ ] Count removed
- [ ] Server-side SEO
- [ ] Error handling works
- [ ] Loading states present
- [ ] Category filtering works with API

---

## SECTION 6: Store Section Fixes

### Current State
- Input field inconsistencies in reservation form
- Uses API with mock fallback
- Dark mode not applied to this section
- Mix of server/client components

### Target State
- Consistent input fields
- Use real store API
- Dark mode fully working
- Server-side component with client-side form
- Full API integration with no mock data

### Complexity: Medium

### Phases

#### Phase 6.1: API Integration & Remove Mock Data
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Integrate Store API and remove all mock data:

Files to modify:
- components/home/stores-section/index.tsx
- components/home/stores-section/stores-content.tsx
- components/home/stores-section/stores-grid.tsx
- components/home/stores-section/store-card.tsx
- lib/api/stores.ts

Current State:
- Stores API exists in lib/api/stores.ts
- Component may have mock data fallback

Requirements:
1. Fetch stores from real API:
   - GET /store?isActive=true
   - Use getStores() function from lib/api/stores.ts

2. Display store information:
   - Store name, address, phone
   - Opening hours
   - Location/distance (if available)

3. Remove ALL mock data:
   - Remove MOCK_STORES arrays
   - Remove any hardcoded store data
   - Remove fallback to mock on API error

4. Error Handling:
   - Show error message if API fails
   - Empty state for no stores
   - Loading skeleton during fetch

5. Integration with Global Store State:
   - Highlight currently selected store
   - Allow selection from store cards
   - Update global store context on selection

API Integration Pattern:
async function StoresSection() {
  const stores = await getStores({ isActive: true });

  if (!stores || stores.length === 0) {
    return <StoresEmptyState />;
  }

  return (
    <section>
      <StoresGrid stores={stores} />
      <ReservationForm stores={stores} />
    </section>
  );
}

Remove:
- All mock store data
- Fallback to mock arrays
- Hardcoded store information
```

**Expected Output:** Stores using real API only
**Handoff:** Form fixes

#### Phase 6.2: Fix Input Field Consistency
**Agent:** `nextjs-forms-expert`
**MCP Tools:** `shadcn`

```prompt
Fix input field inconsistencies in store reservation form:

File: components/home/stores-section/reservation-form.tsx

Current Issues:
- Input fields may have inconsistent styling
- Different heights, borders, or focus states

Requirements:
1. Audit all form inputs in reservation form
2. Ensure all use same shadcn Input component
3. Consistent sizing: h-10 or h-12 for all inputs
4. Same border radius and border color
5. Consistent focus ring styling
6. Same label styling and positioning
7. Proper spacing between fields

Use shadcn components:
- Input from @/components/ui/input
- Select from @/components/ui/select
- Button from @/components/ui/button

Ensure react-hook-form integration is consistent.
```

**Expected Output:** Consistent form inputs
**Handoff:** Dark mode fix

#### Phase 6.2: Fix Dark Mode
**Agent:** `nextjs-design-system`
**MCP Tools:** `playwright`

```prompt
Fix dark mode for store section:

File: components/home/stores-section/index.tsx and children

Current Issue:
- Dark mode is not getting applied to this section
- May have hardcoded light colors

Requirements:
1. Audit all store section components for hardcoded colors
2. Replace with CSS variables or Tailwind dark: variants
3. Section background should change in dark mode
4. Card backgrounds should change
5. Text colors should have proper contrast
6. Form inputs should respect theme
7. Button states should work in both themes

Components to check:
- stores-section/index.tsx
- stores-section/stores-grid.tsx
- stores-section/store-card.tsx
- stores-section/reservation-form.tsx

Current section has: bg-slate-50 (light only)
Change to: bg-slate-50 dark:bg-slate-900

Test with Playwright in dark mode.
```

**Expected Output:** Dark mode working for store section
**Handoff:** Server/client split

#### Phase 6.3: Optimize Server/Client Component Split
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Optimize store section for server-side rendering:

Current:
- StoresSection is server component
- StoresContent fetches data
- ReservationForm is client component

Requirements:
1. Keep store list server-rendered for SEO
2. Form remains client-side (interactivity)
3. Remove mock data fallback in production
4. Store cards should be in initial HTML
5. Use global store state for selected store

Pattern:
- Server: Fetch stores, render StoresGrid
- Client: ReservationForm with useStore() hook

Consider:
- Store selection from global context
- Pre-populate form with selected store
```

**Expected Output:** Optimized component architecture
**Handoff:** Review

#### Phase 6.4: Store Section Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Review store section fixes:

Checklist:
- [ ] All input fields consistent
- [ ] Dark mode fully working
- [ ] Server-side store list
- [ ] Client-side form
- [ ] Real API data
- [ ] Form validation working
- [ ] Responsive design intact

Test Scenarios:
1. Toggle dark mode - verify all elements change
2. Submit form - verify validation
3. View HTML source - verify stores present
4. Mobile viewport - verify layout
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Real API integrated for stores
- [ ] No mock data anywhere
- [ ] Input consistency
- [ ] Dark mode working
- [ ] Server/client split optimized
- [ ] Store selection integrates with global state
- [ ] Error handling works
- [ ] Loading states present

---

## SECTION 7: Remove Awards and Achievements Section

### Current State
- AwardsSection exists in components/home/awards-section/
- Rendered in app/page.tsx

### Target State
- Section completely removed

### Complexity: Low

### Phases

#### Phase 7.1: Remove Section
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Remove the Awards and Achievements section:

Steps:
1. Remove from app/page.tsx:
   - Remove dynamic import: const AwardsSection = dynamic(...)
   - Remove: <AwardsSection /> from JSX

2. Delete component directory:
   - Delete: components/home/awards-section/index.tsx
   - Delete: components/home/awards-section/award-card.tsx
   - Delete: components/home/awards-section/ directory

3. Clean up any exports

Verify page renders correctly after removal.
```

**Expected Output:** Section removed
**Success Criteria:**
- [ ] Component directory deleted
- [ ] Import removed from page.tsx
- [ ] Page renders without errors

---

## SECTION 8: About Us Section Fixes

### Current State
- About section with stat cards/counters
- Cards may have clipped content (counts and text)
- Uses floating ingredient decorations

### Target State
- Fixed card display where counts and content are not clipped

### Complexity: Low

### Phases

#### Phase 8.1: Fix Card Clipping Issues
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `playwright`

```prompt
Fix About section cards where content is clipped:

Files to check:
- components/home/about-section/index.tsx
- components/home/about-section/about-content.tsx
- components/home/about-section/highlight-card.tsx
- components/home/about-section/stats-counter.tsx

Current Issue:
- Stat cards have counts and content getting clipped
- Overflow issues or fixed height cutting off text

Requirements:
1. Identify which cards have clipping
2. Remove fixed heights causing clipping
3. Use min-height instead of height if needed
4. Ensure text can wrap properly
5. Add overflow-visible or remove overflow-hidden
6. Test with different content lengths
7. Verify on mobile viewports

Common fixes:
- Remove h-[fixed] classes
- Add min-h-[value] instead
- Remove overflow-hidden from card container
- Ensure flex/grid doesn't constrain height
```

**Expected Output:** Cards without clipping
**Handoff:** Review

#### Phase 8.2: About Section Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Review About section fixes:

Checklist:
- [ ] No content clipping in cards
- [ ] Counts fully visible
- [ ] Description text not cut off
- [ ] Responsive on all viewports
- [ ] Dark mode works
- [ ] Animations still smooth

Test at various viewports and content lengths.
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Cards display complete content
- [ ] No overflow/clipping issues

---

## SECTION 9: Vision & Mission Section Redesign

### Current State
- Simple two-column layout
- No dark/light mode support (only light)
- Basic, non-exciting UI
- Uses amber-50 background

### Target State
- Complete redesign with modern, engaging UI
- Full dark/light mode support
- Premium visual design matching site aesthetic

### Complexity: High

### Phases

#### Phase 9.1: Design Research
**Agent:** `premium-ux-designer`
**MCP Tools:** `21st-dev`, `puppeteer`

```prompt
Research and design a premium Vision & Mission section:

Current Issues:
- Too plain and simple
- No dark mode support
- Not visually exciting
- Doesn't match premium site aesthetic

Requirements:
1. Modern, engaging design
2. Full dark/light mode support
3. Potential ideas:
   - Split screen with imagery
   - Animated icons/illustrations
   - Gradient backgrounds
   - Card-based layout with depth
   - Timeline or steps visualization
   - Parallax or scroll-triggered effects
4. Should feel premium and on-brand

Research from 21st.dev:
- Mission statement section patterns
- Vision section designs
- Company values layouts

Provide:
- 2-3 design concepts
- Recommended approach
- Component hierarchy
- Animation suggestions
```

**Expected Output:** Design concepts for Vision & Mission
**Handoff:** Implementation

#### Phase 9.2: Component Architecture
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Plan component architecture for redesigned Vision & Mission:

Based on design research, create architecture for:
1. New section structure
2. Dark/light mode implementation
3. Animation triggers
4. Responsive behavior

Component Structure:
- components/home/vision-mission-section/
  - index.tsx (Server wrapper)
  - vision-card.tsx
  - mission-card.tsx
  - decorative-elements.tsx (optional)

Ensure:
- Proper use of CSS variables for theming
- Server Component where possible
- Client Component only for animations
```

**Expected Output:** Component architecture document
**Handoff:** Implementation

#### Phase 9.3: Implementation
**Agent:** `shadcn-implementation-builder`, `nextjs-animation-specialist`
**MCP Tools:** `shadcn`, `21st-dev`

```prompt
Implement redesigned Vision & Mission section:

Requirements:
1. Premium visual design
2. Full dark mode support using Tailwind dark: variants
3. Subtle animations (entrance, hover)
4. Responsive layout (stack on mobile)
5. Proper semantic HTML
6. Accessibility maintained

Implementation:
1. Update section background:
   - Light: gradient or textured background
   - Dark: dark gradient or solid navy

2. Card design:
   - Glassmorphism or elevated cards
   - Icon with background shape
   - Title with gradient text
   - Description with proper line height

3. Animations:
   - Entrance: fade-up on scroll
   - Icon: subtle pulse or float
   - Card hover: lift with shadow

4. Decorative elements:
   - Background shapes
   - Subtle patterns
   - Gradient orbs

Use framer-motion for animations.
Reference premium-ux-designer output.
```

**Expected Output:** Redesigned Vision & Mission section
**Handoff:** Review

#### Phase 9.4: Vision & Mission Review
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Review redesigned Vision & Mission section:

Checklist:
- [ ] Premium visual design achieved
- [ ] Dark mode fully working
- [ ] Light mode fully working
- [ ] Animations smooth (60fps)
- [ ] Reduced motion respected
- [ ] Responsive design
- [ ] Accessibility maintained
- [ ] Performance acceptable

Compare before/after with screenshots.
```

**Expected Output:** Test report
**Success Criteria:**
- [ ] Complete redesign
- [ ] Dark/light mode working
- [ ] Modern, exciting UI
- [ ] Performance maintained

---

## SECTION 10: Footer Fixes

### Current State
- Has Play Store and App Store buttons
- Multi-column layout
- Newsletter signup

### Target State
- Remove app store buttons (no app exists)
- Keep rest of footer intact

### Complexity: Low

### Phases

#### Phase 10.1: Remove App Store Buttons
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** None

```prompt
Remove Play Store and App Store buttons from footer:

Files to check:
- components/layout/footer/index.tsx
- components/layout/footer/footer-brand.tsx
- components/layout/footer/footer-bottom.tsx
- components/layout/footer/newsletter-section.tsx

Requirements:
1. Find app store/play store buttons or badges
2. Remove them completely
3. Adjust layout to fill space or maintain balance
4. May be in footer-brand or newsletter section

Note: Spec says there is no app, so these buttons should not exist.

Clean up any related images or SVGs.
```

**Expected Output:** Footer without app store buttons
**Success Criteria:**
- [ ] No Play Store button
- [ ] No App Store button
- [ ] Layout balanced
- [ ] No broken UI

---

## SECTION 11: Overall Home Screen Improvements

### Current State
- May have USD or mixed currency
- May use US date/phone formats
- Missing comprehensive SEO setup

### Target State
- All money in British Pounds (GBP)
- British formats for dates, addresses, phones
- Date/time pickers in British format (London timezone)
- Full SEO: meta tags, favicons, semantic HTML

### Complexity: High

### Phases

#### Phase 11.1: Currency Localization
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Ensure all currency displays British Pounds (GBP):

Current State:
- lib/formatters.ts has formatPrice function using GBP
- Need to audit all price displays

Requirements:
1. Audit all components displaying prices
2. Ensure all use formatPrice helper from lib/formatters.ts
3. Update any hardcoded $ to £
4. Update any Intl.NumberFormat calls to use GBP
5. Check product cards, menu items, hero section

Files to audit:
- components/home/menu-section/product-card.tsx
- components/home/hero-section/floating-cards.tsx
- Any other price displays

Ensure formatPrice is imported from @/lib/formatters everywhere.
```

**Expected Output:** All prices in GBP
**Handoff:** British formats

#### Phase 11.2: British Format Implementation
**Agent:** `nextjs-component-architect`
**MCP Tools:** None

```prompt
Implement British formats throughout the site:

1. Date Formats:
   - Already have formatDate in lib/formatters.ts using en-GB
   - Audit all date displays to use this helper
   - Format: DD/MM/YYYY

2. Time Formats:
   - 24-hour format for UK
   - Already have formatTime using en-GB
   - Audit time displays

3. Address Format:
   - UK format: Street, City, Postcode
   - No state/zip like US
   - Postcodes: XX## #XX pattern

4. Phone Format:
   - UK format: +44 20 XXXX XXXX or 020 XXXX XXXX
   - Audit phone displays and inputs
   - Update validation patterns

5. Date/Time Pickers:
   - Check reservation form date picker
   - Ensure uses en-GB locale
   - Timezone: Europe/London

Files to check/update:
- components/home/stores-section/reservation-form.tsx (date/time pickers)
- components/layout/header/top-info-bar.tsx (phone)
- components/layout/footer/* (address, phone)
- components/home/contact-section/* (address, phone)

Create validation utilities:
- lib/validators/phone.ts (UK phone validation)
- lib/validators/postcode.ts (UK postcode validation)
```

**Expected Output:** All British formats implemented
**Handoff:** SEO implementation

#### Phase 11.3: SEO Implementation
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Implement comprehensive SEO for the home page:

Requirements:

1. Meta Tags (app/layout.tsx or app/page.tsx):
   - title: "Pizza Space | Authentic Italian Pizza in London"
   - description: "Order delicious handcrafted pizzas..."
   - keywords: pizza, delivery, London, Italian, restaurant
   - og:title, og:description, og:image
   - twitter:card, twitter:title, twitter:description

2. Favicon Setup:
   - favicon.ico in /app or /public
   - apple-touch-icon.png
   - favicon-16x16.png, favicon-32x32.png
   - manifest.json with site info

3. Structured Data (JSON-LD):
   - Restaurant schema
   - LocalBusiness schema
   - Menu schema for products
   - Add in layout or page

4. Semantic HTML:
   - Proper heading hierarchy (h1 > h2 > h3)
   - Only one h1 per page
   - Landmark roles (main, nav, footer)
   - Alt text on all images

5. Open Graph:
   - og:type: restaurant
   - og:locale: en_GB

Implementation:
- Use Next.js metadata API
- Create generateMetadata function if dynamic

Files to create/update:
- app/layout.tsx (global metadata)
- app/page.tsx (page-specific metadata)
- public/favicon.ico and variants
- public/site.webmanifest
- components/seo/json-ld.tsx
```

**Expected Output:** Full SEO implementation
**Handoff:** Review

#### Phase 11.4: Localization & SEO Review
**Agent:** `nextjs-ui-reviewer`, `nextjs-accessibility-expert`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Review all localization and SEO implementations:

Localization Checklist:
- [ ] All prices show £ (GBP)
- [ ] Dates in DD/MM/YYYY format
- [ ] Times in 24-hour format
- [ ] Phone numbers in UK format
- [ ] Addresses in UK format
- [ ] Date pickers use en-GB locale
- [ ] Phone validation for UK numbers
- [ ] Postcode validation

SEO Checklist:
- [ ] Meta title present and descriptive
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Twitter card tags present
- [ ] Favicon visible in browser tab
- [ ] JSON-LD structured data present
- [ ] Proper heading hierarchy
- [ ] All images have alt text
- [ ] Semantic HTML used

Test:
1. View page source - check meta tags
2. Use browser devtools - check favicon
3. Validate with Google Rich Results Test
4. Check Open Graph with social preview tools
```

**Expected Output:** Final test report
**Success Criteria:**
- [ ] GBP everywhere
- [ ] British formats everywhere
- [ ] Full SEO implemented
- [ ] All validation passes

---

## Dependencies & Execution Order

### Phase Dependencies Graph

```
Header Fixes ───────────────────────────────────────────────────┐
├─ 1.1 Audit (no deps)                                          │
├─ 1.2 Light Mode Fix (no deps)                                 │
├─ 1.3 Search API (needs APIs)                                  │
├─ 1.4 Store Locator (needs APIs)                               │
└─ 1.5 Global Store State ←─────────────────────────────────────│──┐
                                                                │  │
Hero Fixes ─────────────────────────────────────────────────────│  │
├─ 2.1 Remove CTA (no deps)                                     │  │
├─ 2.2 Product API (needs global store state) ←─────────────────┼──┘
├─ 2.3 Trending Categories (needs APIs)                         │
└─ 2.4 Popular Searches (needs APIs)                            │
                                                                │
Remove Make Order (no deps) ────────────────────────────────────│
                                                                │
Categories Fixes ───────────────────────────────────────────────│
├─ 4.1 Remove Chips (no deps)                                   │
├─ 4.2 Mobile Grid (no deps)                                    │
└─ 4.3 Server-Side (needs 4.1, 4.2)                             │
                                                                │
Menu Fixes ─────────────────────────────────────────────────────│
├─ 5.1 Tab CSS Fix (no deps)                                    │
├─ 5.2 Remove Count (no deps)                                   │
└─ 5.3 Server-Side (needs 5.1, 5.2)                             │
                                                                │
Store Fixes ────────────────────────────────────────────────────│
├─ 6.1 Input Consistency (no deps)                              │
├─ 6.2 Dark Mode Fix (no deps)                                  │
└─ 6.3 Server/Client Split (needs 6.1, 6.2, global store) ←─────┘

Remove Awards (no deps) ────────────────────────────────────────

About Fixes (no deps) ──────────────────────────────────────────

Vision & Mission Redesign ──────────────────────────────────────
├─ 9.1 Design Research (no deps)
├─ 9.2 Architecture (needs 9.1)
└─ 9.3 Implementation (needs 9.2)

Footer Fixes (no deps) ─────────────────────────────────────────

Overall Improvements ───────────────────────────────────────────
├─ 11.1 Currency (no deps, should be early)
├─ 11.2 British Formats (needs 11.1)
└─ 11.3 SEO (can be parallel)
```

### Recommended Execution Order

**Sprint 1: Foundation & Removals (Day 1)**
1. Section 3: Remove Make Your Order (quick win)
2. Section 7: Remove Awards (quick win)
3. Section 10: Footer fixes (quick win)
4. Section 1.1-1.2: Header audit & light mode fix
5. Section 11.1: Currency localization

**Sprint 2: API Integration & Global State (Day 2)**
6. Section 1.3-1.5: Header search, store locator, global state
7. Section 2.1-2.4: Hero fixes
8. Section 11.2: British formats

**Sprint 3: Section Optimizations (Day 3)**
9. Section 4: Categories fixes
10. Section 5: Menu fixes
11. Section 6: Store section fixes
12. Section 8: About section fixes

**Sprint 4: Redesign & Polish (Day 4)**
13. Section 9: Vision & Mission redesign
14. Section 11.3: SEO implementation
15. All review phases

### Parallel Execution Opportunities

**Can run in parallel:**
- Section 3 (Remove Make Order) + Section 7 (Remove Awards) + Section 10 (Footer)
- Section 1.1 (Header Audit) + Section 1.2 (Light Mode) + Section 11.1 (Currency)
- Section 4.1-4.2 (Categories) + Section 5.1-5.2 (Menu) + Section 6.1-6.2 (Store) + Section 8 (About)
- Section 9.1 (Design Research) can start while other sections complete

**Must be sequential:**
- Global Store State (1.5) must complete before Store-dependent features (2.2, 6.3)
- Design Research (9.1) -> Architecture (9.2) -> Implementation (9.3)
- Currency (11.1) -> British Formats (11.2)

---

## MCP Tools Summary

| Tool | Usage |
|------|-------|
| `21st-dev` | UI component inspiration, Vision & Mission redesign |
| `shadcn` | Component research, form components |
| `playwright` | Testing, screenshots, responsive verification, dark mode testing |
| `next-devtools` | Server component verification, error checking |

### Tool Usage by Phase

| Phase | Primary Tools |
|-------|---------------|
| Design Research | `21st-dev`, `puppeteer` |
| Component Architecture | `next-devtools` |
| Implementation | `shadcn`, `21st-dev` |
| Styling Fixes | `playwright` |
| Form Work | `shadcn` |
| Testing | `playwright`, `next-devtools` |
| Accessibility | `playwright` |

---

## Agent Summary

| Agent | Sections Used |
|-------|---------------|
| `premium-ux-designer` | Vision & Mission (9.1) |
| `shadcn-requirements-analyzer` | None (existing components) |
| `shadcn-component-researcher` | Header Search (1.3) |
| `nextjs-component-architect` | Header (1.1, 1.4, 1.5), Hero (2.2), Categories (4.3), Menu (5.3), Store (6.3), Vision (9.2), Overall (11.1, 11.2, 11.3) |
| `shadcn-implementation-builder` | Header (1.3, 1.4), Hero (2.1, 2.3, 2.4), Remove Sections (3.1, 7.1), Categories (4.1), Menu (5.1, 5.2), Footer (10.1), About (8.1), Vision (9.3) |
| `nextjs-forms-expert` | Store (6.1) |
| `nextjs-animation-specialist` | Vision (9.3) |
| `nextjs-responsive-design` | Categories (4.2) |
| `nextjs-design-system` | Header Light Mode (1.2), Store Dark Mode (6.2) |
| `nextjs-accessibility-expert` | Overall Review (11.4) |
| `nextjs-ui-reviewer` | All review phases |

---

## Success Metrics

### Functional Completeness
- [ ] Header unified (no duplicates)
- [ ] Search integrated with APIs
- [ ] Store locator functional
- [ ] Global store state working
- [ ] Hero with single CTA
- [ ] Hero with API products
- [ ] Make Your Order section removed
- [ ] Awards section removed
- [ ] Categories simplified
- [ ] Menu tab CSS fixed
- [ ] Store section dark mode
- [ ] About cards not clipped
- [ ] Vision & Mission redesigned
- [ ] Footer cleaned up

### API Integration (No Mock Data)
- [ ] Categories section uses real API
- [ ] Menu section uses real categories API for tabs
- [ ] Menu section uses real products API for items
- [ ] Store section uses real stores API
- [ ] Hero section uses real products API
- [ ] All mock data removed from production
- [ ] Proper error handling for API failures
- [ ] Loading states for all API calls
- [ ] Empty states for no data scenarios

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Server-side rendering for SEO sections

### Accessibility
- [ ] WCAG 2.1 AA compliance maintained
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast passing in both themes

### Dark Mode
- [ ] All sections support dark mode
- [ ] Store section specifically fixed
- [ ] Vision & Mission fully themed

### SEO
- [ ] Meta tags present
- [ ] Open Graph tags present
- [ ] Favicon configured
- [ ] Semantic HTML throughout
- [ ] JSON-LD structured data

### Localization
- [ ] All prices in GBP
- [ ] British date formats
- [ ] British phone formats
- [ ] UK timezone for pickers

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API failures during testing | Keep mock data for development only, show error UI in production |
| Mock data accidentally in production | Use environment checks, remove mock imports in production build |
| Store state race conditions | Implement proper loading states |
| SEO regression | Test with Lighthouse before/after |
| Dark mode inconsistencies | Comprehensive visual testing |
| Breaking existing functionality | Run full test suite after each phase |
| Vision redesign scope creep | Time-box design phase, limit to 2 concepts |
| API rate limiting | Implement caching and ISR for static data |
| Empty data scenarios | Design and implement proper empty states |

---

## Quick Start

To begin implementation, start with the quick wins:

```
Sprint 1 - Start:

1. Agent: shadcn-implementation-builder
   Section: 3 - Remove Make Your Order
   Phase: 3.1

2. Agent: shadcn-implementation-builder
   Section: 7 - Remove Awards
   Phase: 7.1

3. Agent: shadcn-implementation-builder
   Section: 10 - Footer (Remove App Store)
   Phase: 10.1
```

These can all be done in parallel as they have no dependencies.

Then proceed to Header fixes (Section 1) and Currency localization (Section 11.1).

---

## Appendix: Component File Changes Summary

### Files to Delete
```
components/home/make-order-section/index.tsx
components/home/make-order-section/ (directory)
components/home/awards-section/index.tsx
components/home/awards-section/award-card.tsx
components/home/awards-section/ (directory)
components/home/categories-section/filter-tags.tsx (if exists)
components/home/categories-section/categories-pills.tsx (if not needed)
```

### Files to Create
```
lib/contexts/store-context.tsx
lib/utils/store-cookies.ts
lib/validators/phone.ts
lib/validators/postcode.ts
components/layout/header/store-locator.tsx
components/seo/json-ld.tsx
public/favicon.ico
public/apple-touch-icon.png
public/site.webmanifest
```

### Files to Modify (Major Changes)
```
app/page.tsx (remove sections)
app/layout.tsx (add SEO metadata)
components/layout/header/* (search, store locator, light mode)
components/home/hero-section/* (single CTA, APIs)
components/home/categories-section/* (remove chips, mobile grid, SSR)
components/home/menu-section/* (tab CSS, remove count, SSR)
components/home/stores-section/* (inputs, dark mode)
components/home/about-section/* (card clipping)
components/home/mission-vision-section/* (complete redesign)
components/layout/footer/* (remove app store buttons)
lib/formatters.ts (ensure British formats used everywhere)
```

---

*Document generated for PizzaSpace Home Page Phase 3 Fixes*
*Version: 1.0*
*Date: November 2024*
