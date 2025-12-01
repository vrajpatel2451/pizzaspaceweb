# Product Details Fixes - Implementation Plan

> Generated from spec5_fixes_2.md analysis

## Critical Bug Identified

**PRICING BUG (Issue #1)**:
- Product card uses `lib/formatters.ts` which treats `basePrice` as pounds (e.g., `10` becomes `£10.00`)
- Product details uses `lib/utils/currency.ts` which treats prices as **pence** (e.g., `10` becomes `£0.10` after dividing by 100)

**Root Cause**: Two different formatters with inconsistent assumptions about price units.

---

## Execution Phases

### Phase 1: Critical Bug Fix - Pricing Inconsistency
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P0 - CRITICAL
- **Complexity**: Medium
- **Est. Time**: 30min

**Files to fix**:
1. `/lib/formatters.ts` - Product card formatter
2. `/lib/utils/currency.ts` - Product details formatter
3. `/types/product.ts` - Check `basePrice` type documentation

**Solution**: Determine the actual price unit from API (pence or pounds), then unify both formatters.

---

### Phase 2: UI Cleanup - Remove Redundant Elements
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P1 - High
- **Complexity**: Low
- **Est. Time**: 20min

**Tasks**:
1. **Remove "Most Ordered" badge** from variant/addon rows (Issue #3)
   - File: `/components/product-details/cards/variant-group-card.tsx` (Lines 206-214)
   - File: `/components/product-details/cards/addon-group-card.tsx` (Lines 354-361)

2. **Remove "Required/Optional" text** from group cards (Issue #3)
   - File: `/components/product-details/cards/variant-group-card.tsx` (Lines 123-125)
   - File: `/components/product-details/cards/addon-group-card.tsx` (Lines 177-179)

3. **Remove Cooking Request** from dialog (Issue #4)
   - File: `/components/product-details/product-details-content.tsx` (Lines 108-115)
   - DO NOT delete component file - will be used in cart screen later

4. **Remove Veg chip** from ProductInfoSection (Issue #6.1)
   - File: `/components/product-details/sections/product-info-section.tsx` (Lines 63-81)

---

### Phase 3: Fix Addon Group Selection Count
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P1 - High
- **Complexity**: Medium
- **Est. Time**: 20min

**Problem**: Addon group shows "0/1 selected" but count seems wrong (Issue #5)

**File**: `/components/product-details/cards/addon-group-card.tsx`

**Fix**:
```tsx
// Filter to only count addons that belong to this group
const groupAddonIds = addons.map(a => a._id);
const selectedCount = Object.entries(selectedAddons).filter(
  ([addonId, qty]) => groupAddonIds.includes(addonId) && qty > 0
).length;
```

**Fallback**: Remove count display if fix is not feasible.

---

### Phase 4: Quantity Counter UX Analysis
- **Agent**: `premium-ux-designer`
- **Priority**: P1 - High
- **Complexity**: Medium
- **Est. Time**: 15min

**Current File**: `/components/product-details/controls/quantity-pill.tsx`

**Investigation**:
1. Check git history for previous implementation
2. Identify issues with current design (too large, flashy animations, etc.)
3. Provide design recommendations based on Zomato/Swiggy patterns

---

### Phase 4b: Implement Quantity Counter Improvements
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P1 - High
- **Complexity**: Medium
- **Est. Time**: 25min

**Potential improvements**:
1. Reduce visual weight - less gradient, more subtle styling
2. Ensure adequate button padding/touch targets
3. Simplify animations - quicker, less bouncy
4. More compact for inline usage

---

### Phase 5: Description Section Research
- **Agent**: `shadcn-component-researcher`
- **Priority**: P1 - High
- **Complexity**: Low
- **Est. Time**: 10min

**Requirements**:
- Accordion that expands to show product details
- Header format: `[NAME ---SPACER--- PRICE -- ACCORDION_TRIGGER]`
- Research shadcn/ui Accordion vs Collapsible

---

### Phase 5b: Description Section Redesign
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P1 - High
- **Complexity**: High
- **Est. Time**: 45min

**File**: `/components/product-details/sections/product-info-section.tsx`

**New Layout (Issue #6)**:

1. **Collapsed Header**: `[Product Name] -------- [Base Price] [Chevron]`

2. **Expanded Content** (in order):
   - DESCRIPTION - Plain text paragraph
   - SERVING INFO - "Serves X people", "X pieces/slices"
   - NUTRITIONAL INFO - Rich text: "Per 100g: Xg protein, Xg carbs, Xg fats, Xg fiber"
   - SPICE LEVELS & FROSTING
   - ALLERGEN INFO - "Contains: Nuts, Dairy, Gluten"
   - INGREDIENT LIST - Comma-separated list

**Remove**: NutrientCard components, badges row

---

### Phase 6: Image Carousel Research
- **Agent**: `shadcn-component-researcher`
- **Priority**: P2 - Medium
- **Complexity**: Low
- **Est. Time**: 10min

**Requirements** (Issue #7):
- Show slider only when `photoList.length > 1`
- Swipeable on mobile
- Pagination dots
- Research shadcn/ui Carousel (uses Embla)

---

### Phase 6b: Implement Product Image Slider
- **Agent**: `shadcn-implementation-builder`
- **Priority**: P2 - Medium
- **Complexity**: Medium
- **Est. Time**: 30min

**File**: `/components/product-details/sections/product-image-section.tsx`

**Implementation**:
```tsx
const hasMultipleImages = images && images.length > 1;

{hasMultipleImages ? (
  <Carousel>
    {images.map((image, index) => (
      <CarouselItem key={index}>
        <CustomImage src={image} alt={`${productName} - Image ${index + 1}`} />
      </CarouselItem>
    ))}
  </Carousel>
) : (
  // Current single image code
)}
```

---

### Phase 7: Mobile Bottomsheet Responsiveness
- **Agent**: `nextjs-responsive-design`
- **Priority**: P1 - High
- **Complexity**: High
- **Est. Time**: 40min

**Issues** (Mobile Responsiveness #1, #2):
1. Too much spacing around bottomsheet
2. Actions UI looks weird

**Files**:
- `/components/product-details/product-details-bottomsheet.tsx`
- `/components/ui/drawer.tsx`
- `/components/product-details/sections/sticky-action-bar.tsx`

**Potential Fixes**:
1. Reduce Drawer internal padding
2. Reduce content spacing on mobile
3. More compact StickyActionBar on mobile

**Fallback**: Remove bottomsheet, use dialog on mobile too.

---

### Phase 8: Accessibility Review
- **Agent**: `nextjs-accessibility-expert`
- **Priority**: P1 - Required
- **Complexity**: Low
- **Est. Time**: 20min

**Components to review**:
1. ProductInfoSection with accordion - keyboard navigation, ARIA states
2. ProductImageSection with carousel - image alt texts, carousel navigation
3. QuantityPill - button labels, focus states
4. AddonGroupCard - checkbox states, count announcements
5. VariantGroupCard - radio group semantics
6. StickyActionBar - button states, error announcements

---

### Phase 9: Final Code Review
- **Agent**: `nextjs-ui-reviewer`
- **Priority**: P2 - Final
- **Complexity**: Low
- **Est. Time**: 15min

**Review checklist**:
- [ ] No unused imports after removing components
- [ ] Consistent formatting with project style
- [ ] Type safety maintained (no `any` types)
- [ ] Performance: No unnecessary re-renders
- [ ] Animation: Respects `prefers-reduced-motion`
- [ ] Error handling: Graceful fallbacks
- [ ] Mobile: Touch targets >= 44px

---

## Dependency Graph

```
Phase 1 (Pricing Fix) - CRITICAL, do first
    |
    v
Phase 2 (UI Cleanup) -----> Phase 5 (Description) ----> Phase 5b (Implement)
    |                              |
    v                              v
Phase 3 (Count Fix)          Phase 6 (Image Research) --> Phase 6b (Implement)
    |                              |
    v                              v
Phase 4 (Quantity UX) -----> Phase 7 (Mobile Responsive)
    |                              |
    v                              v
Phase 4b (Implement)         Phase 8 (Accessibility)
                                   |
                                   v
                             Phase 9 (Final Review)
```

## Parallel Opportunities

These phases can run in parallel:
1. **Phase 2** (UI Cleanup) and **Phase 3** (Count Fix) - No dependencies
2. **Phase 5** (Description Research) and **Phase 6** (Image Research) - Both are research
3. **Phase 4b** (Quantity Counter) can start once Phase 4 provides recommendations

---

## Summary Table

| Phase | Issue | Agent | Priority | Complexity | Est. Time |
|-------|-------|-------|----------|------------|-----------|
| 1 | Pricing Bug | `shadcn-implementation-builder` | P0 | Medium | 30min |
| 2 | UI Cleanup | `shadcn-implementation-builder` | P1 | Low | 20min |
| 3 | Count Fix | `shadcn-implementation-builder` | P1 | Medium | 20min |
| 4 | Quantity UX | `premium-ux-designer` | P1 | Medium | 15min |
| 4b | Quantity Impl | `shadcn-implementation-builder` | P1 | Medium | 25min |
| 5 | Desc Research | `shadcn-component-researcher` | P1 | Low | 10min |
| 5b | Desc Impl | `shadcn-implementation-builder` | P1 | High | 45min |
| 6 | Image Research | `shadcn-component-researcher` | P2 | Low | 10min |
| 6b | Image Impl | `shadcn-implementation-builder` | P2 | Medium | 30min |
| 7 | Mobile Fix | `nextjs-responsive-design` | P1 | High | 40min |
| 8 | A11y Review | `nextjs-accessibility-expert` | P1 | Low | 20min |
| 9 | Code Review | `nextjs-ui-reviewer` | P2 | Low | 15min |

**Total Estimated Time**: ~4-5 hours

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/formatters.ts` | Product card price formatter (treats as pounds) |
| `lib/utils/currency.ts` | Product details price formatter (treats as pence) |
| `components/product-details/product-details-content.tsx` | Main content wrapper |
| `components/product-details/sections/product-info-section.tsx` | Product info display |
| `components/product-details/sections/product-image-section.tsx` | Product image display |
| `components/product-details/cards/variant-group-card.tsx` | Variant selection |
| `components/product-details/cards/addon-group-card.tsx` | Addon selection |
| `components/product-details/controls/quantity-pill.tsx` | Quantity counter |
| `components/product-details/sections/sticky-action-bar.tsx` | Bottom action bar |
| `components/product-details/product-details-bottomsheet.tsx` | Mobile bottomsheet |

---

## MCP Tools Required

- `mcp__shadcn__search_items_in_registries` - Component research
- `mcp__shadcn__get_add_command_for_items` - Install commands
- `mcp__next-devtools__browser_eval` - Mobile testing
- `mcp__playwright__playwright_navigate` - Visual verification
