# Menu Page Fixes Plan

## Overview

This plan addresses three critical UI issues on the Menu Page that break design consistency and degrade user experience:

1. **Heading Design Inconsistency** - The menu page uses a basic `h1` tag with plain styling, while home page sections feature premium headings with badges, gradient text, decorative elements, and subheadlines.

2. **Missing Loading States** - When users select categories or filters, there is no visual feedback during URL navigation and data fetching, causing a jarring experience.

3. **Empty/Error State Alignment** - The inline empty state in `menu-page-client.tsx` is not properly centered, and the existing `MenuEmpty` and `MenuError` components from `components/menu/states/` are not being utilized.

---

## Issues Analysis

### Issue 1: Heading Design Inconsistency

**Current State:**
```tsx
// app/menu/page.tsx (line 151)
<h1 className="text-3xl font-bold mb-6">Our Menu</h1>
```

**Home Page Section Heading Pattern (reference):**
- Section badge with icon (e.g., `<span className="inline-flex items-center gap-2 bg-orange-500/10...">`)
- Main headline with gradient/accent text on key words
- Descriptive subheadline
- Decorative elements (underlines, dividers, shapes)
- Proper spacing and hierarchy

**Reference Files:**
- `/components/home/categories-section/index.tsx` - Badge + headline + subheadline pattern
- `/components/home/menu-section/index.tsx` - `SectionHeader` component with badge, gradient text, decorative underline
- `/components/home/stores-section/index.tsx` - Badge + headline + subheadline
- `/components/home/testimonials-section/testimonials-header.tsx` - Animated badge + headline with proper spacing

### Issue 2: Missing Loading States

**Current State:**
- URL changes immediately via `router.push()` with `{ scroll: false }`
- No loading indicator during navigation
- Next.js `loading.tsx` only applies to full page loads, not client-side transitions
- `CategoryAccordion` and `MobileFilterSheet` trigger URL updates without feedback

**Affected Files:**
- `/components/menu/sidebar/category-accordion.tsx` - `handleCategorySelect`, `handleSubcategorySelect`
- `/components/menu/sidebar/mobile-filter-sheet.tsx` - Filter selection handlers
- `/components/menu/menu-page-client.tsx` - Main client component

**Required Solution:**
- Add loading state management (useState or useTransition)
- Show skeleton/spinner overlay on product grid during filter changes
- Disable filter buttons while loading to prevent race conditions

### Issue 3: Empty/Error State Alignment

**Current State:**
The inline empty state in `menu-page-client.tsx` (lines 300-337) is rendered after the layout divs, which can cause alignment issues. Additionally, proper `MenuEmpty` and `MenuError` components exist in `/components/menu/states/` but are not used in the main client component.

**Reference Files:**
- `/components/menu/states/menu-empty.tsx` - Proper centered Card layout with `flex items-center justify-center min-h-[300px]`
- `/components/menu/states/menu-error.tsx` - Proper centered Card layout with `flex items-center justify-center min-h-[400px]`
- `/components/menu/menu-page-client.tsx` - Uses inline JSX instead of dedicated components

**Issues Found:**
1. Empty state is appended outside of main layout containers
2. Not using the purpose-built `MenuEmpty` component that has proper centering
3. Empty state should replace the product grid area, not appear after it

---

## Execution Plan

### Phase 1: Design Consistency - Menu Page Heading

**Agent:** `premium-ux-designer`

**Task:** Design a consistent section header for the Menu Page that matches the home page design language.

**Requirements:**
- Match the visual hierarchy from home page sections (categories, menu, testimonials)
- Include: section badge, main headline with accent styling, descriptive subheadline
- Maintain responsiveness (different sizes for mobile/tablet/desktop)
- Support dark mode with proper color tokens
- Consider the page context (this is the main menu browsing page, not a homepage section)

**Design Reference:**
```
Badge: "Browse Menu" or similar (pill with icon)
Headline: "Our Menu" with "Menu" having accent/gradient styling
Subheadline: "Explore our handcrafted selection of pizzas, sides, and more"
Optional: Decorative elements (divider, shapes)
```

**Files to Reference:**
- `/components/home/menu-section/index.tsx` (SectionBadge, SectionHeader pattern)
- `/components/home/categories-section/index.tsx` (badge + headline structure)

**Files to Modify:**
- `/app/menu/page.tsx`

**Expected Output:** Design specifications for menu page header with exact styling classes, structure, and responsive behavior.

---

### Phase 2: Loading States Implementation

**Agent:** `shadcn-implementation-builder`

**Task:** Implement loading states for category/filter selection with proper UX feedback.

**Requirements:**
1. Add loading state management to `MenuPageClient`
2. Show loading overlay/skeleton on product grid during filter changes
3. Use React's `useTransition` for non-blocking updates (preferred) or `useState` with loading boolean
4. Disable/style filter buttons during loading to prevent multiple clicks
5. Ensure screen readers announce loading state

**Implementation Approach:**
```tsx
// Option A: useTransition (recommended for Next.js)
const [isPending, startTransition] = useTransition();

// Wrap router.push in startTransition
startTransition(() => {
  router.push(newUrl, { scroll: false });
});

// Show loading state based on isPending
{isPending && <LoadingOverlay />}
```

**Files to Modify:**
- `/components/menu/menu-page-client.tsx` - Add loading state, pass to children
- `/components/menu/sidebar/category-accordion.tsx` - Receive loading prop, apply disabled styles
- `/components/menu/sidebar/mobile-filter-sheet.tsx` - Receive loading prop
- `/components/menu/product-grid/product-grid.tsx` - Add loading overlay variant

**New Component (optional):**
- `/components/menu/product-grid/product-grid-loading.tsx` - Skeleton overlay for grid

**Expected Output:** Working loading states with visual feedback during filter operations.

---

### Phase 3: Empty/Error State Alignment Fix

**Agent:** `nextjs-accessibility-expert`

**Task:** Fix empty and error state centering and integrate proper state components.

**Requirements:**
1. Replace inline empty state JSX with `MenuEmpty` component from `/components/menu/states/menu-empty.tsx`
2. Move empty state rendering inside the grid container area for proper alignment
3. Ensure empty state is centered both horizontally and vertically within the content area
4. Test with screen readers to ensure proper announcements
5. Verify dark mode styling

**Current Structure Issue:**
```tsx
// WRONG: Empty state is outside layout containers
<div className="hidden lg:flex gap-6">...</div>
<div className="lg:hidden">...</div>
{products.length === 0 && <div className="text-center py-16">...</div>}  // <-- Outside containers
```

**Correct Structure:**
```tsx
// RIGHT: Empty state replaces product grid within container
<main className="flex-1 min-w-0">
  {products.length === 0 ? (
    <MenuEmpty hasActiveFilters={activeFilterCount > 0} filterContext="..." />
  ) : (
    <>
      <ProductGrid products={products} />
      {/* pagination */}
    </>
  )}
</main>
```

**Files to Modify:**
- `/components/menu/menu-page-client.tsx` - Integrate `MenuEmpty` component, fix placement

**Files to Reference:**
- `/components/menu/states/menu-empty.tsx` - Already has proper centering styles
- `/components/menu/states/menu-error.tsx` - Reference for error handling pattern

**Expected Output:** Properly centered empty/error states using existing components.

---

### Phase 4: Final Review

**Agent:** `nextjs-ui-reviewer`

**Task:** Review all changes for consistency, accessibility, and performance.

**Checklist:**
- [ ] Heading matches home page design language
- [ ] Loading states work correctly on all filter interactions
- [ ] Empty state is properly centered on desktop and mobile
- [ ] Dark mode works correctly for all changes
- [ ] Accessibility: focus management, ARIA labels, screen reader announcements
- [ ] No console errors or warnings
- [ ] Performance: No unnecessary re-renders during loading states

**Files to Review:**
- `/app/menu/page.tsx`
- `/components/menu/menu-page-client.tsx`
- `/components/menu/sidebar/category-accordion.tsx`
- `/components/menu/product-grid/product-grid.tsx`

---

## Estimated Changes

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `/app/menu/page.tsx` | Modify | Replace simple h1 with premium section header |
| `/components/menu/menu-page-client.tsx` | Modify | Add loading state, fix empty state integration |
| `/components/menu/sidebar/category-accordion.tsx` | Modify | Add loading prop support, disabled styles |
| `/components/menu/sidebar/mobile-filter-sheet.tsx` | Modify | Add loading prop support |
| `/components/menu/product-grid/product-grid.tsx` | Modify | Add loading overlay support |

### Potential New Files

| File | Purpose |
|------|---------|
| `/components/menu/menu-header.tsx` (optional) | Reusable section header component |
| `/components/menu/product-grid/product-grid-skeleton.tsx` (optional) | Dedicated loading skeleton |

---

## Design Guidelines Reference

From home page sections, the consistent heading pattern includes:

1. **Badge**: Pill-shaped span with icon, uppercase text, orange accent color
2. **Headline**: Large bold text (3xl-5xl responsive), accent color on key word
3. **Subheadline**: Muted text (base-lg responsive), max-w-2xl, mx-auto centered
4. **Spacing**: mb-10 to mb-14 between header and content
5. **Dark Mode**: Proper color inversions using dark: prefixes

**Color Tokens Used:**
- Badge: `bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400`
- Headline: `text-slate-900 dark:text-white` with accent `text-orange-500`
- Subheadline: `text-slate-600 dark:text-slate-400`

---

## Priority Order

1. **Phase 3: Empty/Error Alignment** (Quick Win) - Simple fix with existing components
2. **Phase 1: Heading Design** (Medium) - Visual improvement, follows existing patterns
3. **Phase 2: Loading States** (Complex) - Requires state management changes across multiple files
4. **Phase 4: Review** (Final) - Ensure all changes work together

---

## Notes

- All changes should follow existing design patterns from home page sections
- Maintain TypeScript strict mode compliance
- Test on mobile viewport sizes (especially the empty state centering)
- Use `CustomImage` component for any new images (per CLAUDE.md)
- Prefer `useTransition` over manual loading state for smoother UX
