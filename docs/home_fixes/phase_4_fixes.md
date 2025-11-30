# PizzaSpace Home Page Phase 4 Fixes - Execution Plan

## Executive Summary

This document outlines the comprehensive execution plan for Phase 4 fixes to the PizzaSpace home page. These fixes focus on resolving persistent UI issues, API integration bugs, and visual polish problems that were identified after Phase 3.

### Project Overview

| Attribute | Details |
|-----------|---------|
| **Project** | PizzaSpace Home Page Phase 4 Fixes |
| **Framework** | Next.js 16 with App Router, React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Primary Color** | Orange (#F97316) |
| **Secondary Color** | Navy (#0e182b) |
| **Total Fix Sections** | 5 critical issues |
| **Estimated Complexity** | Medium-High |
| **Dark Mode** | Required (next-themes configured) |
| **Testing Focus** | Comprehensive - Zero tolerance for errors |

### Fix Categories Summary

| # | Issue | Category | Priority | Complexity |
|---|-------|----------|----------|------------|
| 1 | Header light mode issues + duplicate headers | UI/Styling | Critical | High |
| 2 | Hero section floating cards/buttons clutter | UI/Layout | High | Medium |
| 3 | Hero section product API not used for cards | API Integration | High | Medium |
| 4 | API handling errors for categories, products, stores | API/Error Handling | Critical | High |
| 5 | About us section number cards styling | UI/Styling | Medium | Low |

---

## Pre-Execution Testing Setup

### Test Environment Configuration

Before starting any fixes, set up comprehensive testing infrastructure:

**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`, `puppeteer`

```prompt
Set up comprehensive testing infrastructure for Phase 4 fixes:

1. Playwright Test Setup:
   - Configure browser contexts for light/dark mode
   - Set up viewport tests (320px, 375px, 768px, 1024px, 1440px)
   - Create screenshot comparison baseline

2. Build Verification:
   - Run `npm run build` and capture any errors
   - Run `npm run lint` and fix any issues
   - Verify TypeScript compilation with `npx tsc --noEmit`

3. API Mocking Setup:
   - Create MSW (Mock Service Worker) handlers for categories, products, stores
   - Test API failure scenarios
   - Test empty response scenarios

4. Visual Regression Setup:
   - Capture baseline screenshots of all sections
   - Configure Percy or similar for visual diff

Test Commands to Run:
```bash
npm run build 2>&1 | tee build-baseline.log
npm run lint 2>&1 | tee lint-baseline.log
npx tsc --noEmit 2>&1 | tee tsc-baseline.log
```
```

**Expected Output:** Testing infrastructure ready, baseline captured
**Success Gate:** All pre-checks must pass before proceeding

---

## SECTION 1: Header Fixes - Light Mode & Duplicate Headers

### Current Issues
1. Light mode styling is not good - poor contrast/visibility
2. Two different header implementations exist
3. Inconsistent styling between light and dark modes

### Target State
- Single unified header implementation
- Excellent contrast and visibility in light mode
- Consistent styling across both themes
- No duplicate header components or wrappers

### Complexity: High

### Phases

#### Phase 1.1: Header Audit & Duplicate Removal
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`, `playwright`

```prompt
Audit and consolidate header components:

Files to review:
- components/layout/header/index.tsx
- components/layout/header/header-client.tsx
- components/layout/header/top-info-bar.tsx
- components/layout/header/header-nav.tsx
- app/layout.tsx (header usage)
- app/page.tsx (any header references)

Tasks:
1. Identify ALL header-related components
2. Document which headers are being rendered where
3. Identify duplicate functionality (e.g., multiple "Find Store" elements)
4. Identify the primary header that should be kept
5. Document components to remove/consolidate

Create a component dependency tree:
- What renders what
- What can be removed
- What needs consolidation

Output: Header audit report with specific files to modify/delete
```

**Expected Output:** Complete header audit with removal plan
**Handoff:** Implementation of consolidation

#### Phase 1.2: Header Consolidation Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Implement header consolidation based on audit:

Requirements:
1. Remove all duplicate header elements identified in audit
2. Keep single, unified header structure:
   - TopInfoBar (optional, can hide on mobile)
   - MainHeader with: Logo, Nav, Search, Theme Toggle, Cart, User
3. Ensure single source of truth for header state
4. Remove any redundant wrapper components
5. Clean up unused imports and exports

Implementation Steps:
1. Backup current header files
2. Consolidate into single clean header structure
3. Update app/layout.tsx to use single header
4. Remove deprecated header files
5. Update any imports elsewhere

Files to modify:
- components/layout/header/index.tsx (primary)
- components/layout/header/header-client.tsx (if needed)
- app/layout.tsx

Files to potentially delete:
- Any duplicate header files identified in audit
```

**Expected Output:** Single unified header implementation
**Handoff:** Light mode styling

#### Phase 1.3: Light Mode Styling Fix
**Agent:** `nextjs-design-system`
**MCP Tools:** `playwright`, `puppeteer`

```prompt
Fix light mode styling for the consolidated header:

Current Problems:
- Poor contrast in light mode
- Some elements may be invisible or hard to see
- Background/text color mismatches

Requirements:
1. Audit all header CSS classes for hardcoded dark colors
2. Ensure proper use of Tailwind theme classes:
   - Replace bg-slate-800 with bg-background or bg-card
   - Replace text-white with text-foreground
   - Use proper dark: variants for dark mode specific styles

3. Specific Elements to Fix:
   - TopInfoBar: ensure visible in light mode
   - Logo: visible in both modes
   - Navigation links: proper contrast
   - Icons (cart, user, menu): visible in both modes
   - Search button/icon: visible
   - Theme toggle: proper styling

4. Background Colors:
   - Light mode: white/slate-50 backgrounds
   - Dark mode: slate-900/slate-800 backgrounds
   - Proper transitions between modes

5. Text Colors:
   - Light mode: dark text (slate-900/slate-700)
   - Dark mode: light text (white/slate-100)

Test with Playwright:
- Screenshot in light mode at all viewports
- Screenshot in dark mode at all viewports
- Compare contrast ratios

Tailwind Classes Pattern:
- bg-white dark:bg-slate-900
- text-slate-900 dark:text-white
- border-slate-200 dark:border-slate-700
```

**Expected Output:** Header with correct light mode styling
**Handoff:** Testing

#### Phase 1.4: Header Testing & Verification
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`, `puppeteer`

```prompt
Comprehensive header testing:

Visual Tests (Playwright Screenshots):
1. Light mode - Desktop (1440px)
2. Light mode - Tablet (768px)
3. Light mode - Mobile (375px)
4. Dark mode - Desktop (1440px)
5. Dark mode - Tablet (768px)
6. Dark mode - Mobile (375px)

Functional Tests:
1. Theme toggle switches correctly
2. Mobile menu opens/closes
3. Search popup opens (Cmd+K)
4. All navigation links work
5. Cart badge displays correctly
6. No layout shift on theme change

Build Verification:
```bash
npm run build 2>&1 | grep -i "error\|warning"
npm run lint -- --quiet
npx tsc --noEmit
```

Console Error Check:
- No React hydration errors
- No console.error outputs
- No 404 for assets

Accessibility Check:
- Focus states visible in both modes
- Keyboard navigation works
- ARIA labels present

Create test report with:
- Pass/Fail for each test
- Screenshots attached
- Any remaining issues documented
```

**Expected Output:** Comprehensive test report for header
**Success Criteria:**
- [ ] Single unified header (no duplicates)
- [ ] Light mode fully visible and usable
- [ ] Dark mode still works perfectly
- [ ] No build errors
- [ ] No console errors
- [ ] All viewports tested
- [ ] Accessibility passing

---

## SECTION 2: Hero Section - Floating Cards & Buttons Declutter

### Current Issues
1. Floating cards and buttons clash visually
2. Layout feels cluttered, lacks breathing room
3. Visual hierarchy unclear

### Target State
- Clean, spacious hero layout
- Clear visual hierarchy
- Breathing room between elements
- No visual clashing between cards and CTAs

### Complexity: Medium

### Phases

#### Phase 2.1: Hero Layout Analysis
**Agent:** `premium-ux-designer`
**MCP Tools:** `playwright`, `puppeteer`

```prompt
Analyze current hero section layout issues:

Current Problems:
- Floating cards overlapping or too close to CTAs
- Buttons competing for visual attention
- Insufficient spacing/margins

Analysis Required:
1. Take screenshots of current hero at all viewports
2. Identify specific clash points:
   - Where do cards overlap buttons?
   - What spacing is too tight?
   - What elements compete visually?

3. Document current:
   - Floating card positions (top, right, size)
   - CTA button positions
   - Spacing values (padding, margins, gaps)
   - Z-index stacking

4. Provide recommendations:
   - New positioning for floating cards
   - Spacing adjustments needed
   - Visual hierarchy improvements
   - Mobile-specific changes

Output: Detailed layout analysis with specific CSS changes needed
```

**Expected Output:** Layout analysis with fix recommendations
**Handoff:** Implementation

#### Phase 2.2: Hero Spacing & Layout Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Implement hero section spacing and decluttering fixes:

Files to modify:
- components/home/hero-section/index.tsx
- components/home/hero-section/hero-content.tsx
- components/home/hero-section/floating-cards.tsx
- components/home/hero-section/hero-cta.tsx (if exists)

Specific Fixes:

1. Floating Cards Repositioning:
   - Move floating cards further from CTAs
   - Ensure cards don't overlap main content on any viewport
   - Consider hiding some cards on mobile for cleaner look
   - Add proper z-index hierarchy

2. CTA Button Spacing:
   - Increase gap between buttons (gap-4 -> gap-6)
   - Add more margin above/below button group
   - Ensure buttons don't touch other elements

3. Overall Breathing Room:
   - Increase section padding: py-16 -> py-20 or py-24
   - Add gap between content columns
   - Ensure minimum spacing from edges

4. Visual Hierarchy:
   - CTAs should be most prominent (not compete with cards)
   - Floating cards should feel secondary/decorative
   - Reduce card opacity or size if needed

5. Mobile Specific:
   - Consider hiding 1-2 floating cards on mobile
   - Stack CTAs vertically with proper spacing
   - Ensure touch targets are accessible

CSS Patterns to Apply:
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Content gap: gap-8 lg:gap-12
- Section padding: py-16 md:py-20 lg:py-24
- Button gap: gap-4 sm:gap-6
```

**Expected Output:** Hero with improved spacing and layout
**Handoff:** Animation adjustment

#### Phase 2.3: Hero Animation & Polish
**Agent:** `nextjs-animation-specialist`
**MCP Tools:** `playwright`

```prompt
Adjust hero animations to support new layout:

Requirements:
1. Floating cards:
   - Subtle, slower animation (don't distract from CTAs)
   - Reduced movement range
   - Consider opacity pulsing instead of position animation

2. CTA buttons:
   - Micro-hover animations (scale, shadow)
   - No competing motion with floating cards

3. Stagger order:
   - Content appears first
   - CTAs appear second
   - Floating cards fade in last (supporting role)

4. Performance:
   - Use CSS transforms (GPU accelerated)
   - Respect prefers-reduced-motion
   - No jank or stutter

Files to check:
- components/home/hero-section/floating-cards.tsx
- Any animation configurations
```

**Expected Output:** Polished hero animations
**Handoff:** Testing

#### Phase 2.4: Hero Section Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Test hero section fixes:

Visual Tests (Screenshots at each viewport):
1. Desktop 1440px - verify no overlap
2. Desktop 1024px - verify no overlap
3. Tablet 768px - verify layout stacks properly
4. Mobile 375px - verify clean mobile layout
5. Mobile 320px - verify minimum viable layout

Spacing Verification:
- Measure gaps between elements
- Verify breathing room exists
- Check no overlapping at any viewport

Animation Tests:
- Verify animations are subtle
- Verify no visual competition
- Check reduced motion is respected

Functional Tests:
- CTAs are clickable (not blocked by cards)
- All content is visible
- No horizontal scroll

Build Check:
```bash
npm run build 2>&1 | grep -i "error"
```

Create comparison: Before vs After screenshots
```

**Expected Output:** Hero section test report
**Success Criteria:**
- [ ] No visual clutter
- [ ] Clear breathing room between elements
- [ ] CTAs are prominent and accessible
- [ ] Floating cards don't overlap CTAs
- [ ] Works on all viewports
- [ ] Animations are subtle
- [ ] No build errors

---

## SECTION 3: Hero Section - Product API Integration for Cards

### Current Issues
1. Hero floating cards not using product API data
2. Cards may show static/mock content
3. Real products not displayed

### Target State
- Floating cards fetch and display real products from API
- Proper error handling for API failures
- Graceful fallback (hide cards rather than show mock)

### Complexity: Medium

### Phases

#### Phase 3.1: Current Implementation Audit
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Audit current hero floating cards implementation:

Files to review:
- components/home/hero-section/index.tsx
- components/home/hero-section/floating-cards.tsx
- lib/api/products.ts

Determine:
1. How is FloatingCards component currently getting data?
   - Props from parent?
   - Own API call?
   - Hardcoded mock data?

2. What data does each card need?
   - Product name
   - Product image
   - Product price
   - Product ID (for linking)

3. Current data flow:
   - Is HeroSection a Server Component?
   - Is FloatingCards a Client Component?
   - Where should the API call happen?

4. API structure:
   - What does getProducts() return?
   - What parameters are needed (limit, featured)?
   - Is there a "featured" or "hero" filter?

Output: Data flow diagram and recommended integration approach
```

**Expected Output:** Implementation audit with recommended approach
**Handoff:** API integration

#### Phase 3.2: Product API Integration for Hero Cards
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Integrate product API into hero floating cards:

Implementation Approach:
1. HeroSection (Server Component) should:
   - Fetch featured products: await getProducts({ limit: 3, featured: true })
   - Pass products as props to FloatingCards
   - Handle API errors gracefully

2. FloatingCards (Client Component) should:
   - Receive products as props
   - Display product data (name, image, price)
   - Link to product details page
   - Show nothing (or placeholder) if no products

Files to modify:
- components/home/hero-section/index.tsx
- components/home/hero-section/floating-cards.tsx

Implementation:

```tsx
// index.tsx (Server Component)
import { getProducts } from "@/lib/api/products";

export default async function HeroSection() {
  let heroProducts = [];

  try {
    heroProducts = await getProducts({ limit: 3 });
  } catch (error) {
    console.error("Failed to fetch hero products:", error);
    // Continue with empty array - cards won't show
  }

  return (
    <section>
      <HeroContent />
      {heroProducts.length > 0 && (
        <FloatingCards products={heroProducts} />
      )}
    </section>
  );
}
```

```tsx
// floating-cards.tsx (Client Component)
"use client";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface FloatingCardsProps {
  products: Product[];
}

export function FloatingCards({ products }: FloatingCardsProps) {
  if (products.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {products.slice(0, 3).map((product, index) => (
        <FloatingCard key={product.id} product={product} position={index} />
      ))}
    </div>
  );
}
```

Error Handling:
- If API fails: Log error, don't show cards (graceful degradation)
- If no products: Don't show cards section at all
- Never show mock/hardcoded products in production
```

**Expected Output:** Hero cards using real product API
**Handoff:** Testing

#### Phase 3.3: Hero Product Cards Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Test hero product API integration:

API Integration Tests:
1. With API working:
   - Cards show real products
   - Product names display correctly
   - Product images load
   - Prices are formatted correctly (GBP)

2. With API failure:
   - No console errors displayed to user
   - Cards section hidden gracefully
   - Rest of hero works normally

3. With empty response:
   - Cards section hidden
   - No layout shift

Build Verification:
```bash
npm run build 2>&1 | grep -i "error"
npx tsc --noEmit
```

Network Verification:
- Check Network tab for API call
- Verify correct endpoint is called
- Verify response structure

Console Check:
- No unhandled promise rejections
- No hydration errors
- Proper error logging (dev only)
```

**Expected Output:** Product API integration test report
**Success Criteria:**
- [ ] Floating cards show real product data
- [ ] Product images load from API
- [ ] Prices formatted in GBP
- [ ] API failure handled gracefully
- [ ] No mock data in production
- [ ] No console errors
- [ ] Build passes

---

## SECTION 4: API Error Handling - Categories, Products, Stores

### ROOT CAUSE IDENTIFIED

**The core issue:** `apiClient.get<T>()` returns `AxiosResponse<T>`, but the API functions are typed as if they return `T` directly.

**Current incorrect pattern:**
```typescript
// WRONG - missing AxiosResponse wrapper in generic type
const response = await apiClient.get<
  APIResponse<PaginatedResponse<CategoryResponse>>
>(url);
return response.data;
```

**Correct pattern:**
```typescript
// CORRECT - includes AxiosResponse wrapper
import { AxiosResponse } from "axios";

const response: AxiosResponse<APIResponse<PaginatedResponse<CategoryResponse>>> =
  await apiClient.get<APIResponse<PaginatedResponse<CategoryResponse>>>(url);
return response.data;
```

### Current Issues
1. Getting errors on API handling for categories
2. Getting errors on API handling for products
3. Getting errors on API handling for stores
4. Inconsistent error handling across sections
5. **ROOT CAUSE:** AxiosResponse<T> wrapper not properly typed

### Target State
- Correct AxiosResponse<T> typing in all API functions
- Robust error handling for all API calls
- User-friendly error states
- Proper loading states
- Graceful degradation when APIs fail
- No console errors visible to users

### Complexity: High

### Phases

#### Phase 4.0: AxiosResponse Type Fix (ROOT CAUSE FIX)
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`
**Priority:** CRITICAL - Must be done FIRST

```prompt
Fix AxiosResponse typing in all API files:

The apiClient returns AxiosResponse<T>, so all API functions need proper typing.

---

FILE 1: lib/api/categories.ts

BEFORE (incorrect):
```typescript
import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  CategoryResponse,
  CategoryQueryParams,
} from "@/types";

export async function getCategories(
  params?: CategoryQueryParams
): Promise<APIResponse<PaginatedResponse<CategoryResponse>>> {
  // ...
  const response = await apiClient.get<
    APIResponse<PaginatedResponse<CategoryResponse>>
  >(url);
  return response.data;
}
```

AFTER (correct):
```typescript
import { AxiosResponse } from "axios";
import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  CategoryResponse,
  CategoryQueryParams,
} from "@/types";

export async function getCategories(
  params?: CategoryQueryParams
): Promise<APIResponse<PaginatedResponse<CategoryResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.storeId) queryParams.append("storeId", params.storeId);
  if (params?.all !== undefined)
    queryParams.append("all", params.all.toString());
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);

  const queryString = queryParams.toString();
  const url = `/category${queryString ? `?${queryString}` : ""}`;

  try {
    const response: AxiosResponse<APIResponse<PaginatedResponse<CategoryResponse>>> =
      await apiClient.get<APIResponse<PaginatedResponse<CategoryResponse>>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // Return empty response structure on error
    return {
      statusCode: 500,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}
```

---

FILE 2: lib/api/products.ts

BEFORE (incorrect):
```typescript
const response = await apiClient.get<
  APIResponse<PaginatedResponse<ProductResponse>>
>(url);
return response.data;
```

AFTER (correct):
```typescript
import { AxiosResponse } from "axios";
import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  ProductResponse,
  ProductQueryParams,
} from "@/types";

export async function getProducts(
  params?: ProductQueryParams
): Promise<APIResponse<PaginatedResponse<ProductResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.storeId) queryParams.append("storeId", params.storeId);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.subCategoryId)
    queryParams.append("subCategoryId", params.subCategoryId);
  if (params?.all !== undefined)
    queryParams.append("all", params.all.toString());
  if (params?.ids && params.ids.length > 0) {
    params.ids.forEach((id) => queryParams.append("ids[]", id));
  }

  const queryString = queryParams.toString();
  const url = `/product${queryString ? `?${queryString}` : ""}`;

  try {
    const response: AxiosResponse<APIResponse<PaginatedResponse<ProductResponse>>> =
      await apiClient.get<APIResponse<PaginatedResponse<ProductResponse>>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      statusCode: 500,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}
```

---

FILE 3: lib/api/stores.ts

BEFORE (incorrect):
```typescript
const response = await apiClient.get<
  APIResponse<PaginatedResponse<StoreResponse>>
>(url);
return response.data;
```

AFTER (correct):
```typescript
import { AxiosResponse } from "axios";
import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  StoreResponse,
  StoreQueryParams,
} from "@/types";

export async function getStores(
  params?: StoreQueryParams
): Promise<APIResponse<PaginatedResponse<StoreResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.lat !== undefined)
    queryParams.append("lat", params.lat.toString());
  if (params?.long !== undefined)
    queryParams.append("long", params.long.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const queryString = queryParams.toString();
  const url = `/store${queryString ? `?${queryString}` : ""}`;

  try {
    const response: AxiosResponse<APIResponse<PaginatedResponse<StoreResponse>>> =
      await apiClient.get<APIResponse<PaginatedResponse<StoreResponse>>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return {
      statusCode: 500,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}
```

---

VERIFICATION STEPS:
1. After making changes, run: `npx tsc --noEmit`
2. Verify no TypeScript errors
3. Run: `npm run build`
4. Verify build succeeds
5. Test in browser - verify no console errors

KEY CHANGES SUMMARY:
1. Import AxiosResponse from "axios"
2. Explicitly type the response variable: `const response: AxiosResponse<APIResponse<...>>`
3. Wrap API calls in try/catch
4. Return proper error response structure on failure
```

**Expected Output:** All API files with correct AxiosResponse typing
**Success Gate:** `npx tsc --noEmit` passes with 0 errors
**Handoff:** Component-level error handling

---

#### Phase 4.1: API Error Audit
**Agent:** `nextjs-component-architect`
**MCP Tools:** `next-devtools`

```prompt
Audit all API integrations and identify error sources:

Files to review:
- lib/api/categories.ts
- lib/api/products.ts
- lib/api/stores.ts
- components/home/categories-section/index.tsx
- components/home/menu-section/index.tsx
- components/home/stores-section/index.tsx
- Any other files using these APIs

For each API integration, document:
1. What errors are currently occurring?
   - Network errors?
   - Type mismatches?
   - Null/undefined handling?
   - Response parsing errors?

2. Current error handling:
   - Is try/catch used?
   - What happens on failure?
   - Are errors logged properly?

3. Current loading states:
   - Are Suspense boundaries used?
   - Are loading skeletons shown?
   - Is there loading state management?

4. Current empty states:
   - What shows when data is empty?
   - Is there a proper empty state component?

Run in development and capture:
```bash
npm run dev
# Open browser console
# Check for any errors
# Document all errors found
```

Output: Complete error audit with specific issues and line numbers
```

**Expected Output:** API error audit report
**Handoff:** Error handling implementation

#### Phase 4.2: Categories API Error Handling Fix
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Fix categories API error handling:

Files to modify:
- lib/api/categories.ts
- components/home/categories-section/index.tsx
- components/home/categories-section/categories-content.tsx

Implementation:

1. API Layer (lib/api/categories.ts):
```tsx
export async function getCategories(options?: { limit?: number }) {
  try {
    const response = await fetch(`${API_URL}/categories?limit=${options?.limit || 10}`);

    if (!response.ok) {
      throw new Error(`Categories API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.categories || data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return []; // Return empty array, not null
  }
}
```

2. Component Layer (index.tsx):
```tsx
export default async function CategoriesSection() {
  const categories = await getCategories({ limit: 10 });

  if (!categories || categories.length === 0) {
    return null; // Don't render section if no categories
  }

  return (
    <section>
      <CategoriesContent categories={categories} />
    </section>
  );
}
```

3. Add Loading State with Suspense:
```tsx
// In app/page.tsx
import { Suspense } from "react";
import { CategoriesSkeleton } from "@/components/home/categories-section/skeleton";

<Suspense fallback={<CategoriesSkeleton />}>
  <CategoriesSection />
</Suspense>
```

4. Create Skeleton Component:
```tsx
// components/home/categories-section/skeleton.tsx
export function CategoriesSkeleton() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
```
```

**Expected Output:** Categories with proper error handling
**Handoff:** Products API fix

#### Phase 4.3: Products API Error Handling Fix
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Fix products API error handling:

Files to modify:
- lib/api/products.ts
- components/home/menu-section/index.tsx
- components/home/menu-section/menu-content.tsx

Implementation:

1. API Layer (lib/api/products.ts):
```tsx
export async function getProducts(options?: {
  limit?: number;
  categoryId?: string;
  search?: string;
}) {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.categoryId) params.set("categoryId", options.categoryId);
    if (options?.search) params.set("search", options.search);

    const response = await fetch(`${API_URL}/product?${params}`);

    if (!response.ok) {
      throw new Error(`Products API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.products || data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return empty array, not null
  }
}
```

2. Component Layer (index.tsx):
```tsx
export default async function MenuSection() {
  const [categories, products] = await Promise.all([
    getCategories({ limit: 10 }),
    getProducts({ limit: 8 })
  ]);

  // Only hide if BOTH are empty
  if (categories.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <section>
      <MenuContent
        initialCategories={categories}
        initialProducts={products}
      />
    </section>
  );
}
```

3. Client Component Error Handling (menu-content.tsx):
```tsx
"use client";

export function MenuContent({ initialCategories, initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = async (categoryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const newProducts = await getProducts({ categoryId, limit: 8 });
      setProducts(newProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      // Keep existing products visible
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      <ProductGrid products={products} />
    </>
  );
}
```
```

**Expected Output:** Products with proper error handling
**Handoff:** Stores API fix

#### Phase 4.4: Stores API Error Handling Fix
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Fix stores API error handling:

Files to modify:
- lib/api/stores.ts
- components/home/stores-section/index.tsx
- components/home/stores-section/stores-content.tsx

Implementation:

1. API Layer (lib/api/stores.ts):
```tsx
export async function getStores(options?: { isActive?: boolean }) {
  try {
    const params = new URLSearchParams();
    if (options?.isActive !== undefined) {
      params.set("isActive", options.isActive.toString());
    }

    const response = await fetch(`${API_URL}/store?${params}`);

    if (!response.ok) {
      throw new Error(`Stores API error: ${response.status}`);
    }

    const data = await response.json();
    return data?.stores || data || [];
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return []; // Return empty array, not null
  }
}
```

2. Component Layer (index.tsx):
```tsx
export default async function StoresSection() {
  const stores = await getStores({ isActive: true });

  if (!stores || stores.length === 0) {
    // Show a message instead of hiding entirely
    return (
      <section className="py-16">
        <div className="container text-center">
          <h2>Our Stores</h2>
          <p className="text-muted-foreground">Store information coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <StoresContent stores={stores} />
    </section>
  );
}
```

3. Add proper TypeScript types:
```tsx
interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  isActive: boolean;
}

// Ensure all components use proper types
```
```

**Expected Output:** Stores with proper error handling
**Handoff:** Comprehensive testing

#### Phase 4.5: API Integration Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`, `next-devtools`

```prompt
Comprehensive API integration testing:

Build Verification (CRITICAL):
```bash
npm run build 2>&1 | tee build-output.log
# Verify: "Build completed successfully" or similar
# Count errors: grep -c "error" build-output.log

npm run lint 2>&1 | tee lint-output.log
npx tsc --noEmit 2>&1 | tee tsc-output.log
```

API Success Scenarios (with working API):
1. Categories Section:
   - Categories load correctly
   - Category images display
   - No console errors

2. Menu Section:
   - Products load correctly
   - Category tabs work
   - Product images display
   - Prices formatted correctly

3. Stores Section:
   - Stores load correctly
   - Store info displays
   - No console errors

API Failure Scenarios (simulate with network block):
1. All sections degrade gracefully
2. No unhandled errors in console
3. User sees appropriate empty states
4. Page doesn't crash

Loading State Tests:
1. Suspense fallbacks display
2. Skeletons animate
3. No layout shift when content loads

Console Error Audit:
- Open devtools console
- Refresh page multiple times
- Document ANY errors or warnings
- All must be resolved

Network Tab Audit:
- Verify API endpoints called
- Verify response status codes
- Verify no 404s or 500s for expected resources
```

**Expected Output:** Comprehensive API test report
**Success Criteria:**
- [ ] Build completes with 0 errors
- [ ] Lint passes with 0 errors
- [ ] TypeScript compiles with 0 errors
- [ ] Categories API works with proper error handling
- [ ] Products API works with proper error handling
- [ ] Stores API works with proper error handling
- [ ] All loading states work
- [ ] All empty states work
- [ ] No console errors
- [ ] Graceful degradation on API failure

---

## SECTION 5: About Us Section - Number Cards Styling

### Current Issues
1. Number/stat cards don't look good
2. Font sizes may be too large
3. Names/labels may be too long

### Target State
- Visually appealing stat cards
- Appropriate font sizes
- Concise, readable labels
- Professional appearance

### Complexity: Low

### Phases

#### Phase 5.1: About Cards Analysis
**Agent:** `premium-ux-designer`
**MCP Tools:** `playwright`, `puppeteer`

```prompt
Analyze About section stat cards:

Current Issues:
- Cards don't look good (per spec)
- Font size may be issue
- Names/labels may be too long

Take screenshots and analyze:
1. Current card layout
2. Current font sizes
3. Current label text
4. Card dimensions
5. Spacing between cards

Provide recommendations:
1. Ideal font size for numbers (counters)
2. Ideal font size for labels
3. Shorter alternative labels if needed:
   - "Years of Experience" -> "Years"
   - "Happy Customers" -> "Customers"
   - "Expert Chefs" -> "Chefs"
   - "Menu Items" -> "Dishes"

4. Card styling improvements:
   - Padding adjustments
   - Border/shadow changes
   - Icon sizing
```

**Expected Output:** Card improvement recommendations
**Handoff:** Implementation

#### Phase 5.2: About Cards Implementation
**Agent:** `shadcn-implementation-builder`
**MCP Tools:** `next-devtools`

```prompt
Implement About section stat card improvements:

Files to modify:
- components/home/about-section/index.tsx
- components/home/about-section/highlight-card.tsx
- components/home/about-section/stats-counter.tsx

Changes:

1. Reduce Font Sizes:
```tsx
// Before
<span className="text-4xl font-bold">{count}+</span>
<span className="text-lg">{label}</span>

// After
<span className="text-2xl md:text-3xl font-bold">{count}+</span>
<span className="text-sm md:text-base">{label}</span>
```

2. Shorter Labels:
```tsx
const STAT_LABELS = {
  experience: "Years",
  customers: "Customers",
  chefs: "Chefs",
  dishes: "Dishes"
};
```

3. Card Styling Improvements:
```tsx
<div className={cn(
  "flex flex-col items-center p-4 md:p-6",
  "bg-card rounded-xl",
  "border border-border/50",
  "shadow-sm hover:shadow-md transition-shadow"
)}>
  <Icon className="w-8 h-8 text-primary mb-2" />
  <span className="text-2xl md:text-3xl font-bold text-foreground">
    {count}+
  </span>
  <span className="text-sm text-muted-foreground mt-1">
    {label}
  </span>
</div>
```

4. Responsive Grid:
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
  {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
</div>
```

5. Dark Mode Support:
- Ensure all colors use CSS variables
- Test in both modes
```

**Expected Output:** Improved About section cards
**Handoff:** Testing

#### Phase 5.3: About Cards Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Test About section card improvements:

Visual Tests:
1. Desktop 1440px - screenshot
2. Tablet 768px - screenshot
3. Mobile 375px - screenshot
4. Dark mode - all viewports

Verification:
- Font sizes are readable but not overwhelming
- Labels fit within cards
- Cards have proper spacing
- Visual hierarchy is clear
- Counter animation works
- Dark mode styling correct

Build Check:
```bash
npm run build 2>&1 | grep -i "error"
```

Comparison:
- Before vs After screenshots
- Document improvements made
```

**Expected Output:** About cards test report
**Success Criteria:**
- [ ] Font sizes appropriate
- [ ] Labels readable and concise
- [ ] Cards look professional
- [ ] Works on all viewports
- [ ] Dark mode correct
- [ ] No build errors

---

## Final Integration Testing

### Phase FINAL.1: Full Page Build & Lint
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `next-devtools`, `playwright`

```prompt
Final comprehensive testing of all Phase 4 fixes:

Build Verification (ZERO TOLERANCE):
```bash
# Full build
npm run build 2>&1 | tee final-build.log
BUILD_STATUS=$?

# Lint
npm run lint 2>&1 | tee final-lint.log
LINT_STATUS=$?

# TypeScript
npx tsc --noEmit 2>&1 | tee final-tsc.log
TSC_STATUS=$?

# Report
echo "Build: $BUILD_STATUS (0=pass)"
echo "Lint: $LINT_STATUS (0=pass)"
echo "TSC: $TSC_STATUS (0=pass)"
```

ALL MUST BE 0 (ZERO) ERRORS.

Full Page Visual Regression:
1. Light mode - Desktop - Full page screenshot
2. Light mode - Mobile - Full page screenshot
3. Dark mode - Desktop - Full page screenshot
4. Dark mode - Mobile - Full page screenshot

Console Audit:
1. Open browser DevTools
2. Clear console
3. Hard refresh page (Cmd+Shift+R)
4. Check console - MUST BE EMPTY (no errors/warnings)
5. Switch themes - check for errors
6. Navigate to different sections

Performance Check:
- Run Lighthouse audit
- LCP < 2.5s
- CLS < 0.1
- No major performance regressions
```

**Expected Output:** Final comprehensive test report
**MUST PASS ALL CRITERIA**

### Phase FINAL.2: Cross-Browser Testing
**Agent:** `nextjs-ui-reviewer`
**MCP Tools:** `playwright`

```prompt
Cross-browser testing:

Browsers to test:
1. Chrome (Playwright default)
2. Firefox (if available)
3. Safari (if available)

For each browser:
1. Load home page
2. Verify all sections render
3. Test theme toggle
4. Test responsive behavior
5. Check console for errors

Document any browser-specific issues.
```

**Expected Output:** Cross-browser test report

### Phase FINAL.3: Accessibility Final Check
**Agent:** `nextjs-accessibility-expert`
**MCP Tools:** `playwright`

```prompt
Final accessibility audit:

Automated Checks:
- Run axe-core audit
- Check all heading hierarchy
- Verify all images have alt text
- Check color contrast in light mode
- Check color contrast in dark mode

Manual Checks:
- Keyboard navigation through page
- Screen reader navigation
- Focus visible on all elements
- ARIA labels on interactive elements

Output: Accessibility compliance report
```

**Expected Output:** Accessibility report
**Success Criteria:**
- [ ] No critical accessibility issues
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA

---

## Dependencies & Execution Order

### Phase Dependencies Graph

```
PRE-TESTING SETUP (Must complete first)
         │
         ▼
┌────────────────────────────────────────────────────────┐
│                   PARALLEL EXECUTION                    │
├────────────────┬────────────────┬──────────────────────┤
│   SECTION 1    │   SECTION 2    │     SECTION 5        │
│    Header      │     Hero       │    About Cards       │
│   (1.1-1.4)    │   (2.1-2.4)    │    (5.1-5.3)        │
│                │                │                      │
│ Light Mode +   │ Declutter +    │ Font Size +          │
│ Consolidate    │ Spacing        │ Label Fixes          │
└───────┬────────┴───────┬────────┴──────────┬───────────┘
        │                │                    │
        ▼                ▼                    │
┌───────────────────────────────────┐        │
│          SECTION 3                │        │
│    Hero Product API               │        │
│    (3.1-3.3)                      │        │
│                                   │        │
│    Depends on Hero layout being   │        │
│    finalized in Section 2         │        │
└─────────────────┬─────────────────┘        │
                  │                           │
                  ▼                           │
┌─────────────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│                    SECTION 4                            │
│              API Error Handling                         │
│                  (4.1-4.5)                              │
│                                                         │
│    Categories, Products, Stores - ALL APIs             │
│    (Can start in parallel with above if independent)   │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│                  FINAL TESTING                          │
│              (FINAL.1 - FINAL.3)                        │
│                                                         │
│    Build verification, cross-browser, accessibility    │
│    ALL MUST PASS - ZERO ERRORS                         │
└────────────────────────────────────────────────────────┘
```

### Recommended Execution Order

**Sprint 0: API ROOT CAUSE FIX (CRITICAL - DO FIRST) (30 mins)**
0. **SECTION 4.0: AxiosResponse Type Fix** - This fixes ALL API errors
   - Fix lib/api/categories.ts (add AxiosResponse import, add try/catch)
   - Fix lib/api/products.ts (add AxiosResponse import, add try/catch)
   - Fix lib/api/stores.ts (add AxiosResponse import, add try/catch)
   - Verify with `npx tsc --noEmit` - MUST PASS
   - Verify with `npm run build` - MUST PASS

**Sprint 1: Foundation & Quick Wins (2-3 hours)**
1. PRE-TESTING: Set up testing infrastructure
2. SECTION 5: About Cards (quick, isolated fix)
3. SECTION 1.1-1.2: Header audit and consolidation

**Sprint 2: Header & Hero (3-4 hours)**
4. SECTION 1.3-1.4: Header light mode fix & testing
5. SECTION 2.1-2.4: Hero declutter & spacing
6. SECTION 3.1-3.3: Hero product API integration

**Sprint 3: API Component Integration (1-2 hours)**
7. SECTION 4.1-4.4: Verify API integration in components
8. SECTION 4.5: API integration testing

**Sprint 4: Final Testing (1-2 hours)**
9. FINAL.1: Full build & lint verification
10. FINAL.2: Cross-browser testing
11. FINAL.3: Accessibility check

### Parallel Execution Opportunities

**Can run in parallel:**
- Section 1 (Header) + Section 5 (About Cards)
- Section 2 (Hero Layout) + Section 5 (About Cards)
- Section 4.2, 4.3, 4.4 (Individual API fixes) - after audit complete

**Must be sequential:**
- Section 2 (Hero Layout) BEFORE Section 3 (Hero Product API)
- All sections BEFORE Final Testing
- Section 4.1 (Audit) BEFORE 4.2-4.4 (Fixes)

---

## MCP Tools Summary

| Tool | Usage |
|------|-------|
| `playwright` | Screenshots, visual testing, responsive testing, cross-browser |
| `puppeteer` | Design analysis, visual comparison |
| `next-devtools` | Build verification, runtime debugging, error checking |
| `shadcn` | Component implementation, UI building |
| `21st-dev` | UI inspiration, component patterns |

### Tool Usage by Phase

| Phase | Primary Tools |
|-------|---------------|
| Pre-Testing | `playwright`, `next-devtools` |
| Header Audit | `next-devtools`, `playwright` |
| Header Styling | `playwright`, `puppeteer` |
| Hero Layout | `playwright`, `puppeteer` |
| Hero API | `next-devtools` |
| API Fixes | `next-devtools` |
| About Cards | `playwright` |
| Final Testing | `playwright`, `next-devtools` |

---

## Agent Summary

| Agent | Sections Used |
|-------|---------------|
| `nextjs-component-architect` | Header (1.1), Hero API (3.1), API Audit (4.1) |
| `shadcn-implementation-builder` | Header (1.2), Hero (2.2), Hero API (3.2), All API Fixes (4.2-4.4), About (5.2) |
| `nextjs-design-system` | Header Light Mode (1.3) |
| `premium-ux-designer` | Hero Layout (2.1), About Cards (5.1) |
| `nextjs-animation-specialist` | Hero Animation (2.3) |
| `nextjs-ui-reviewer` | All Testing Phases (1.4, 2.4, 3.3, 4.5, 5.3, FINAL.1, FINAL.2) |
| `nextjs-accessibility-expert` | Final A11y Check (FINAL.3) |

---

## Success Metrics (ZERO TOLERANCE)

### Build & Code Quality (MUST PASS)
- [ ] `npm run build` completes with 0 errors
- [ ] `npm run lint` passes with 0 errors
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] No console errors in browser DevTools

### Section 1: Header
- [ ] Single unified header (no duplicates)
- [ ] Light mode fully visible and styled correctly
- [ ] Dark mode still works perfectly
- [ ] Theme toggle functional
- [ ] Mobile menu works

### Section 2: Hero Declutter
- [ ] Clear breathing room between elements
- [ ] No visual clashing
- [ ] CTAs are prominent and accessible
- [ ] Floating cards positioned appropriately
- [ ] Works on all viewports

### Section 3: Hero Product API
- [ ] Floating cards display real product data
- [ ] Product images load from API
- [ ] Prices formatted correctly (GBP)
- [ ] Graceful handling of API failures
- [ ] No mock data in production

### Section 4: API Error Handling
- [ ] Categories API has proper error handling
- [ ] Products API has proper error handling
- [ ] Stores API has proper error handling
- [ ] Loading states work
- [ ] Empty states work
- [ ] No unhandled promise rejections
- [ ] Graceful degradation on failure

### Section 5: About Cards
- [ ] Font sizes appropriate and readable
- [ ] Labels concise and fit within cards
- [ ] Cards look professional
- [ ] Works on all viewports
- [ ] Dark mode correct

### Final Verification
- [ ] All sections render correctly
- [ ] Full page screenshot matches expectations
- [ ] Cross-browser compatibility verified
- [ ] Accessibility audit passed

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Build fails after changes | Run `npm run build` after EVERY section completion |
| Console errors appear | Check DevTools console after each change |
| API still fails | Implement robust try/catch, return empty arrays |
| Visual regression | Take before/after screenshots for comparison |
| Accessibility regression | Run axe-core after major changes |
| Performance regression | Run Lighthouse after final testing |
| Breaking existing features | Test all page functionality after each section |

---

## Quick Start

To begin implementation:

```
SPRINT 0 - DO THIS FIRST (CRITICAL):

0. Agent: shadcn-implementation-builder
   Task: AxiosResponse Type Fix (ROOT CAUSE of ALL API errors)
   Phase: 4.0
   Files to fix:
   - lib/api/categories.ts
   - lib/api/products.ts
   - lib/api/stores.ts

   Verification:
   - npx tsc --noEmit (MUST pass)
   - npm run build (MUST pass)

---

THEN PROCEED WITH:

1. Agent: nextjs-ui-reviewer
   Task: Pre-execution testing setup
   Phase: PRE-TESTING

2. Agent: shadcn-implementation-builder
   Task: About Cards Fix (quick win)
   Phase: 5.1-5.3

3. Agent: nextjs-component-architect
   Task: Header Audit
   Phase: 1.1
```

**CRITICAL:** Sprint 0 (AxiosResponse fix) must be completed FIRST as it fixes the root cause of all API errors. This single fix will resolve issues in categories, products, and stores sections.

---

## Testing Checklist Template

Use this checklist after each section:

```
Section X Complete Checklist:
[ ] Code changes committed
[ ] npm run build passes
[ ] npm run lint passes
[ ] npx tsc --noEmit passes
[ ] No console errors in browser
[ ] Desktop screenshot captured
[ ] Mobile screenshot captured
[ ] Dark mode verified
[ ] Light mode verified
[ ] Specific section requirements met
```

---

*Document generated for PizzaSpace Home Page Phase 4 Fixes*
*Version: 1.0*
*Date: November 2024*
*Priority: Critical - Zero tolerance for errors*
