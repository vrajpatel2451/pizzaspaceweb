# Product Details UI Fix Plan

## Executive Summary

The current Product Details modal/bottomsheet has critical UI issues that make it unusable for production. This plan outlines a comprehensive multi-phase approach to transform the UI into a **Zomato-quality** premium food ordering experience.

---

## Current State Analysis

### Critical Issues Identified

| Issue | Severity | Component | Impact |
|-------|----------|-----------|--------|
| Variants not displaying | **Critical** | `variant-groups-section.tsx` | Users cannot customize products |
| Addons not displaying | **Critical** | `addon-groups-section.tsx` | Users cannot add extras |
| Price shows 0.00 | **Critical** | `product-details-footer.tsx` | Incorrect pricing |
| Description in ugly accordion | **High** | `product-info-section.tsx` | Poor UX, hidden information |
| Excessive whitespace | **High** | `product-details-content.tsx` | Unprofessional appearance |
| Mobile view broken | **High** | `product-details-bottomsheet.tsx` | Mobile users cannot use |
| No cooking request section | **Medium** | Missing component | Missing feature |
| No "Most Ordered" badges | **Medium** | All selector components | Missing social proof |
| No visual hierarchy | **Medium** | All components | Poor UX |

### Root Cause Analysis

1. **Data Flow Issues**: Context data may not be flowing correctly to child components
2. **Conditional Rendering**: Length checks may be failing due to undefined arrays
3. **Price Calculation**: `totalPrice` returning 0 suggests calculation bug or missing data
4. **Layout Issues**: Excessive padding and spacing values in `product-details-content.tsx`
5. **Missing Features**: No cooking request textarea, no popularity badges

---

## Target State (Zomato-Inspired Design)

### Visual Reference Components

```
+-----------------------------------------------+
|  [Product Image - Full Width, 4:3 ratio]      |
|  [Veg Badge]                    [Share] [Save]|
+-----------------------------------------------+
|                                               |
|  Product Name                                 |
|  [Highly Reordered Badge]                     |
|                                               |
|  Full description text visible (not hidden)   |
|  Serves 1-2 | 8 slices | Contains: Gluten     |
|                                               |
+-----------------------------------------------+
|                                               |
|  Choice of Size                               |
|  Required - Select any 1 option               |
|  +------------------------------------------+ |
|  | [Most Ordered]                           | |
|  | Medium (10")                    +250  O  | |
|  +------------------------------------------+ |
|  | Large (12")                     +450  O  | |
|  +------------------------------------------+ |
|                                               |
+-----------------------------------------------+
|                                               |
|  Choice of Crust                              |
|  Required - Select any 1 option               |
|  +------------------------------------------+ |
|  | Classic Hand Tossed            +0    O  | |
|  +------------------------------------------+ |
|  | Thin Crust                     +50   O  | |
|  +------------------------------------------+ |
|                                               |
+-----------------------------------------------+
|                                               |
|  Add-ons                            [Clear]   |
|  +------------------------------------------+ |
|  | [Most Ordered]                           | |
|  | Extra Cheese                             | |
|  | [- 1 +]                         +99      | |
|  +------------------------------------------+ |
|  | Jalapenos                                | |
|  | [ ]                             +49      | |
|  +------------------------------------------+ |
|  | +3 more                                  | |
|  +------------------------------------------+ |
|                                               |
+-----------------------------------------------+
|                                               |
|  Add a cooking request (optional) [i]         |
|  +------------------------------------------+ |
|  | e.g. Don't make it too spicy...         | |
|  +------------------------------------------+ |
|  [No chilli] [No onion] [Less salt]          |
|                                      100     |
|                                               |
+-----------------------------------------------+
|  [Sticky Bottom Bar]                          |
|  [- 1 +]        Add item - $14.99            |
+-----------------------------------------------+
```

---

## Orchestration Plan

### Phase 1: Component Analysis & Research
**Duration**: 1-2 hours
**Priority**: Critical

#### Agent: `shadcn-component-researcher`

<prompt>
Research and document the best shadcn components for building a premium food delivery product details modal. The UI should match Zomato/Swiggy quality.

**Required Components to Research:**

1. **RadioGroup** - For variant selection (size, crust, etc.)
   - Need: Card-style radio items with badges, prices on right
   - Research: How to customize RadioGroupItem for card-style selection

2. **Checkbox** - For addon selection
   - Need: Checkbox with quantity counter integration
   - Research: Best patterns for checkbox + stepper combination

3. **Badge** - For "Most Ordered", "Required", status indicators
   - Need: Multiple badge variants (success, info, outline)
   - Research: Custom badge styles for food apps

4. **Textarea** - For cooking request
   - Need: Textarea with character count, quick chip buttons
   - Research: Textarea with pill/chip quick actions

5. **Card** - For grouping variant/addon sections
   - Need: Card with header, subtitle, content areas
   - Research: Nested card patterns

6. **Button** - For quantity stepper and add-to-cart
   - Need: Pill-shaped counter button (Zomato style)
   - Research: Custom button shapes and colors

**Output Required:**
- Component documentation links
- Example code snippets
- Customization recommendations
- Installation commands
</prompt>

**Expected Output**: Component documentation with code examples
**Handoff**: Component specs to Implementation Builder

---

#### Agent: `21st-dev MCP` (Parallel)

<prompt>
Search for UI components matching these patterns:

1. **Search Query**: "food delivery product detail"
   - Looking for: Product customization modals, variant selectors

2. **Search Query**: "radio card selection"
   - Looking for: Card-style radio button groups

3. **Search Query**: "quantity stepper counter"
   - Looking for: Pill-shaped quantity incrementors (Zomato style)

4. **Search Query**: "addon checkbox list"
   - Looking for: Checkbox lists with quantity controls

5. **Search Query**: "sticky bottom action bar"
   - Looking for: Mobile-friendly sticky footers with CTA

**For each result, provide:**
- Component preview/screenshot
- Implementation code
- Required dependencies
</prompt>

**Expected Output**: 21st.dev component code snippets
**Handoff**: Design patterns to UX Designer

---

### Phase 2: Premium UX Design
**Duration**: 2-3 hours
**Priority**: Critical

#### Agent: `premium-ux-designer`

<prompt>
Design a premium product details modal for a food delivery app (PizzaSpace). The design should match Zomato/Swiggy quality with exceptional attention to detail.

**Product Context:**
- Food ordering app for pizza, burgers, etc.
- Products have variants (size, crust type) and addons (toppings, extras)
- Price changes based on variant + addon selections
- Mobile-first but works on desktop

**Design Requirements:**

### 1. Product Image Section
- Full-width image with 4:3 aspect ratio on mobile, 16:9 on desktop
- Veg/Non-veg/Vegan badge overlay (top-left, pill shape)
- Action icons: Share, Bookmark/Save (top-right, circular buttons)
- Subtle gradient overlay at bottom for text readability

### 2. Product Info Section (NOT Collapsible)
- Product name: Bold, 20-24px, prominent
- Popularity badge: "Highly Reordered" or "Best Seller" (if applicable)
- Full description: Visible by default, 14-16px, muted color
- Meta info row: Serves X | X pieces | Contains: allergens
- NO accordion - all info visible upfront

### 3. Variant Group Cards
For each variant group (Size, Crust, etc.):
- Card container with subtle border
- Header: Group name + "Required - Select any 1 option"
- Options as selectable rows:
  - "Most Ordered" badge on popular option (gold/amber pill)
  - Option label on left
  - Price modifier on right (+$X.XX or included)
  - Radio indicator (circle) on far right
- Selected state: Highlighted background, border change
- Touch targets: Min 48px height

### 4. Addon Group Cards
- Header: "Add-ons" with "Clear" button on right
- Options as selectable rows:
  - "Most Ordered" badge on popular items
  - Addon label
  - Quantity counter (pill shape, primary color) when selected
  - Price below counter
  - Checkbox on left
- "+X more" expandable section if >4 addons
- Visual separation between addon groups

### 5. Cooking Request Section
- Label: "Add a cooking request (optional)" with info icon
- Textarea with placeholder: "e.g. Don't make it too spicy"
- Character count (100 max) bottom-right
- Quick action chips below: "No chilli", "No onion or garlic", "No mushrooms", etc.
- Chips are tappable and insert text

### 6. Sticky Bottom Action Bar
- Always visible, blurred background effect
- Left: Quantity selector (- N +) in pill shape
- Right: "Add item - $XX.XX" button (full width minus quantity)
- Price shows original with strikethrough if discounted
- Safe area padding for notched phones

**Micro-interactions:**
- Price updates with subtle scale animation
- Selected variants have gentle spring animation
- Quantity counter uses haptic feedback pattern
- Add-to-cart has success checkmark animation

**Color Guidelines:**
- Primary: Brand color for CTAs, selected states
- Success green: Veg badge, validation passed
- Red: Non-veg badge, errors
- Amber/Gold: "Most Ordered" badges
- Muted: Secondary text, descriptions

**Spacing System:**
- Use 4px base unit
- Section gaps: 16-24px
- Internal padding: 12-16px
- Touch targets: Min 44-48px

**Output Required:**
1. Detailed component specifications
2. Color and typography guidelines
3. Spacing and layout grid
4. Interaction state definitions
5. Animation timing curves
6. Mobile vs Desktop adaptations
</prompt>

**Expected Output**: Complete UX specification document
**Handoff**: Specs to Component Architect and Implementation Builder

---

### Phase 3: Architecture Design
**Duration**: 1-2 hours
**Priority**: High

#### Agent: `nextjs-component-architect`

<prompt>
Design the component architecture for a premium product details modal following the UX specifications. The modal must work as both a Dialog (desktop) and Bottomsheet (mobile).

**Current Architecture (to refactor):**
```
/components/product-details/
  product-details-dialog.tsx      # Desktop dialog wrapper
  product-details-bottomsheet.tsx # Mobile drawer wrapper
  product-details-content.tsx     # Shared content
  product-details-skeleton.tsx    # Loading state
  product-details-container.tsx   # Entry point
  /sections/
    product-image-section.tsx
    product-info-section.tsx
    variant-groups-section.tsx
    addon-groups-section.tsx
    product-details-footer.tsx
  /selectors/
    variant-group.tsx
    variant-card.tsx
    addon-group.tsx
    addon-item.tsx
```

**Context Available:**
- `ProductDetailsContext` provides: productData, selectedVariants, selectedAddons, quantity, totalPrice, validation
- Data types in `types/product-details.ts` and `types/product.ts`

**New Components Needed:**

1. **ProductHero** - Image + badges + actions
2. **ProductMeta** - Name, description, serving info (NOT collapsible)
3. **VariantGroupCard** - Card wrapper for variant group
4. **VariantOption** - Single radio option with badge support
5. **AddonGroupCard** - Card wrapper for addon group with Clear button
6. **AddonOption** - Checkbox + quantity counter
7. **CookingRequestSection** - Textarea + quick chips
8. **StickyActionBar** - Quantity + Add button with price
9. **PopularityBadge** - "Most Ordered" / "Best Seller" badge
10. **ProductTypeBadge** - Veg/Non-veg/Vegan indicator

**Architecture Requirements:**

1. **Server vs Client Components:**
   - Identify which components need "use client"
   - Minimize client-side JavaScript where possible

2. **Component Boundaries:**
   - Define clear props interfaces
   - Ensure single responsibility
   - Enable component reuse

3. **State Management:**
   - All selection state via context
   - Local UI state (expanded sections, loading) in components
   - Derived state (prices, validation) computed in context

4. **Data Flow:**
   - Context provides: product data, selection state, actions
   - Components receive: relevant slice of state, callbacks
   - No prop drilling beyond 1 level

5. **Responsive Strategy:**
   - Same components for mobile/desktop
   - Different wrappers (Dialog vs Drawer)
   - CSS-based responsive adjustments

**Output Required:**
1. Updated component tree diagram
2. Props interfaces for each component
3. Server/Client component classification
4. Data flow diagram
5. File structure recommendation
</prompt>

**Expected Output**: Component architecture document
**Handoff**: Architecture to Implementation Builder

---

### Phase 4: Implementation
**Duration**: 4-6 hours
**Priority**: Critical

#### Sub-Phase 4.1: Install Required Components

#### Agent: `shadcn-quick-helper`

<prompt>
Install these shadcn components for the product details modal:

1. `npx shadcn@latest add badge` - For popularity badges
2. `npx shadcn@latest add card` - Already installed, verify
3. `npx shadcn@latest add radio-group` - Already installed, verify
4. `npx shadcn@latest add checkbox` - Already installed, verify
5. `npx shadcn@latest add textarea` - Already installed, verify
6. `npx shadcn@latest add separator` - For visual dividers

Verify all components are properly installed in `/components/ui/`
</prompt>

---

#### Sub-Phase 4.2: Build Core Components

#### Agent: `shadcn-implementation-builder`

<prompt>
Implement the following components for the product details modal. Follow the UX specs and architecture design.

**Project Context:**
- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui (new-york style)
- Framer Motion for animations
- Path alias: `@/*` maps to project root

**Component 1: ProductTypeBadge**
Location: `/components/product-details/badges/product-type-badge.tsx`

```typescript
interface ProductTypeBadgeProps {
  type: "veg" | "non_veg" | "vegan";
  size?: "sm" | "md";
  className?: string;
}
```

- Pill shape with dot indicator
- Colors: Green for veg/vegan, Red for non-veg
- Animated dot pulse

---

**Component 2: PopularityBadge**
Location: `/components/product-details/badges/popularity-badge.tsx`

```typescript
interface PopularityBadgeProps {
  variant: "most-ordered" | "best-seller" | "highly-reordered";
  className?: string;
}
```

- Gold/amber background for "Most Ordered"
- Icon + text layout
- Small, pill shape

---

**Component 3: VariantGroupCard**
Location: `/components/product-details/cards/variant-group-card.tsx`

```typescript
interface VariantGroupCardProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  mostOrderedId?: string; // ID of most popular variant
  className?: string;
}
```

Features:
- Card container with header
- "Required - Select any 1 option" subtitle
- RadioGroup for variant options
- Each option shows: badge (if popular), label, price, radio indicator
- Selected state styling

---

**Component 4: AddonGroupCard**
Location: `/components/product-details/cards/addon-group-card.tsx`

```typescript
interface AddonGroupCardProps {
  group: AddonGroupResponse;
  addons: AddonResponse[];
  selectedAddons: Record<string, number>; // addonId -> quantity
  onSelect: (addonId: string, quantity: number) => void;
  mostOrderedIds?: string[]; // IDs of popular addons
  className?: string;
}
```

Features:
- Card with "Add-ons" header + "Clear" button
- Expandable if >4 addons ("+X more" button)
- Each addon: checkbox, label, quantity counter (when selected), price
- "Most Ordered" badge support

---

**Component 5: AddonOptionRow**
Location: `/components/product-details/cards/addon-option-row.tsx`

```typescript
interface AddonOptionRowProps {
  addon: AddonResponse;
  quantity: number;
  price: number;
  isPopular?: boolean;
  allowMulti: boolean;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  className?: string;
}
```

Features:
- Checkbox on left
- Label with "Most Ordered" badge if popular
- Quantity counter (pill style, primary color) appears when quantity > 0
- Price display below counter
- Smooth expand animation for counter

---

**Component 6: QuantityPill**
Location: `/components/product-details/controls/quantity-pill.tsx`

```typescript
interface QuantityPillProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}
```

Features:
- Pill/rounded rectangle shape
- Primary color background
- Minus, value, Plus layout
- Subtle press animation
- Accessible labels

---

**Component 7: CookingRequestSection**
Location: `/components/product-details/sections/cooking-request-section.tsx`

```typescript
interface CookingRequestSectionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  quickOptions?: string[];
  className?: string;
}
```

Features:
- Label with info icon tooltip
- Textarea with placeholder
- Character count (X/100)
- Quick option chips that insert text
- Chips: "No chilli", "No onion or garlic", "No mushrooms", "Extra crispy", etc.

---

**Component 8: StickyActionBar**
Location: `/components/product-details/sections/sticky-action-bar.tsx`

```typescript
interface StickyActionBarProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  totalPrice: number;
  originalPrice?: number; // For showing strikethrough
  isValid: boolean;
  isLoading?: boolean;
  onAddToCart: () => void;
  className?: string;
}
```

Features:
- Sticky position with backdrop blur
- Left: QuantityPill component
- Right: "Add item - $XX.XX" button
- Show original price with strikethrough if discounted
- Safe area padding (env(safe-area-inset-bottom))
- Loading and success states on button

---

**Component 9: ProductMetaSection**
Location: `/components/product-details/sections/product-meta-section.tsx`

```typescript
interface ProductMetaSectionProps {
  product: ProductResponse;
  showPopularityBadge?: boolean;
  className?: string;
}
```

Features:
- Product name (large, bold)
- Popularity badge if applicable
- Full description (NOT in accordion)
- Meta row: Serves X | X pieces | Contains: allergens
- Spice level indicator if applicable

---

**Implementation Notes:**
1. Use Framer Motion for all animations
2. Support reduced-motion preference
3. Use semantic HTML (proper heading levels, ARIA)
4. All touch targets min 44px
5. Use CSS variables from globals.css
6. Import types from `@/types/product-details` and `@/types/product`
</prompt>

**Expected Output**: 9 new component files
**Handoff**: Components to Integration phase

---

#### Sub-Phase 4.3: Update Section Components

#### Agent: `shadcn-implementation-builder`

<prompt>
Update the existing section components to use the new card components.

**File 1: `/components/product-details/sections/product-info-section.tsx`**

REPLACE the accordion-based design with:
- Use ProductMetaSection component
- Remove Accordion completely
- Show all information upfront
- Keep nutritional info grid visible
- Keep allergen badges visible

---

**File 2: `/components/product-details/sections/variant-groups-section.tsx`**

UPDATE to:
- Use VariantGroupCard for each group
- Pass mostOrderedId (first variant by default, or from API)
- Ensure proper data flow from context
- Add error boundary for debugging

---

**File 3: `/components/product-details/sections/addon-groups-section.tsx`**

UPDATE to:
- Use AddonGroupCard for each group
- Pass mostOrderedIds
- Support expandable sections
- Include "Clear all" functionality

---

**File 4: `/components/product-details/sections/product-details-footer.tsx`**

REPLACE with StickyActionBar:
- Use new StickyActionBar component
- Connect to context for state
- Handle add-to-cart flow

---

**File 5: `/components/product-details/product-details-content.tsx`**

UPDATE layout:
- Reduce excessive padding (p-6 pb-32 -> p-4 pb-28)
- Add CookingRequestSection before footer
- Improve spacing between sections (space-y-6 -> space-y-4)
- Add scroll-smooth behavior
</prompt>

**Expected Output**: 5 updated component files
**Handoff**: To responsive design phase

---

### Phase 5: Responsive Design
**Duration**: 2-3 hours
**Priority**: High

#### Agent: `nextjs-responsive-design`

<prompt>
Optimize the product details modal for responsive design, focusing on mobile-first approach.

**Components to Optimize:**

### 1. ProductDetailsDialog (Desktop)
- Max-width: 600px (lg:max-w-2xl)
- Max-height: 90vh
- Centered with backdrop
- Proper close button positioning

### 2. ProductDetailsBottomsheet (Mobile)
- Full width, 90% height
- Drag-to-close indicator
- Safe area insets for notched phones
- Smooth spring animation

### 3. ProductImageSection
- Mobile: aspect-[4/3], full-width
- Desktop: aspect-video, rounded-xl
- Object-fit: cover
- Lazy loading for performance

### 4. VariantGroupCard & AddonGroupCard
- Mobile: Full-width, compact padding (p-3)
- Desktop: Slight margin, comfortable padding (p-4)
- Options stack vertically
- Touch targets: min-h-[48px]

### 5. StickyActionBar
- Mobile: Full-width, prominent
- Desktop: Max-width container, centered
- Quantity pill: responsive sizing
- Button: fluid width

### 6. CookingRequestSection
- Textarea: Full-width, auto-grow
- Chips: Horizontal scroll on mobile, wrap on desktop
- Character count: Bottom-right, subtle

**Breakpoint System:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (sm:)
- Desktop: > 1024px (lg:)

**Touch Optimization:**
- All interactive elements: min 44x44px
- Adequate spacing between touch targets
- No hover-dependent interactions on mobile

**Output Required:**
1. Updated Tailwind classes for each component
2. Mobile-specific adjustments
3. Safe area handling for notched devices
</prompt>

**Expected Output**: Responsive design specifications and class updates
**Handoff**: To animation phase

---

### Phase 6: Animation & Polish
**Duration**: 2-3 hours
**Priority**: Medium

#### Agent: `nextjs-animation-specialist`

<prompt>
Add premium micro-interactions and animations to the product details modal using Framer Motion.

**Animation Requirements:**

### 1. Modal Entry/Exit
- Desktop Dialog: Scale from 0.95 + fade
- Mobile Bottomsheet: Slide from bottom + fade

```typescript
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.95, y: 10 }
};
```

### 2. Content Stagger
- Sections animate in sequence
- 50ms delay between each section
- Subtle slide-up effect

### 3. Variant Selection
- Selected card: Border color transition + subtle scale pulse
- Unselected cards: Dim slightly when one is selected
- Radio indicator: Checkmark draws in

### 4. Addon Selection
- Checkbox: Spring bounce on check
- Quantity counter: Expand animation when appearing
- Counter buttons: Scale on press

### 5. Price Updates
- AnimatePresence for price changes
- Number morphs with brief highlight
- Scale pulse effect (1 -> 1.05 -> 1)

### 6. Add to Cart Button
- Idle: Normal state
- Hover: Subtle lift (desktop)
- Press: Scale down (0.98)
- Loading: Spinner + "Adding..."
- Success: Checkmark draw + green bg + "Added!"

### 7. Quick Chips (Cooking Request)
- Chip press: Scale down slightly
- Selected chip: Background fill animation
- Deselected: Fade background out

### 8. Reduced Motion Support
- Check `useReducedMotion()` hook
- Fallback to opacity-only transitions
- Respect user preferences

**Animation Timing:**
- Micro-interactions: 150-200ms
- Page transitions: 300-400ms
- Stagger delays: 50-100ms
- Spring: damping 20-30, stiffness 200-400

**Output Required:**
1. Animation variant objects for each component
2. Updated component code with animations
3. Shared animation config file
</prompt>

**Expected Output**: Animation configuration and component updates
**Handoff**: To performance and accessibility phases

---

### Phase 7: Performance Optimization
**Duration**: 1-2 hours
**Priority**: Medium

#### Agent: `nextjs-performance-optimizer`

<prompt>
Optimize the product details modal for performance and Core Web Vitals.

**Optimization Areas:**

### 1. Image Loading
- Use Next.js Image with proper sizing
- Priority loading for above-fold image
- Placeholder blur effect
- Responsive srcset

### 2. Code Splitting
- Lazy load modal content
- Dynamic import for heavy components
- Suspense boundaries with skeleton fallback

### 3. Render Optimization
- Memoize expensive calculations (price, validation)
- Use React.memo for pure components
- Optimize context to prevent unnecessary re-renders
- Split context if needed (selection vs UI state)

### 4. Animation Performance
- Use `transform` and `opacity` only (GPU accelerated)
- Avoid layout-triggering properties
- Use `will-change` sparingly
- Consider `requestAnimationFrame` for custom animations

### 5. Bundle Size
- Tree-shake unused Framer Motion features
- Ensure shadcn components are properly tree-shaken
- Audit dependencies for size

**Output Required:**
1. Performance audit of current implementation
2. Specific optimization recommendations
3. Code changes for critical optimizations
</prompt>

**Expected Output**: Performance optimization report and code changes
**Handoff**: To accessibility phase

---

### Phase 8: Accessibility Audit
**Duration**: 1-2 hours
**Priority**: High

#### Agent: `nextjs-accessibility-expert`

<prompt>
Ensure the product details modal meets WCAG 2.1 AA standards and provides an excellent experience for all users.

**Accessibility Requirements:**

### 1. Keyboard Navigation
- Tab order follows visual flow
- Focus trap within modal
- Escape to close
- Arrow keys for radio groups
- Space/Enter for selection

### 2. Screen Reader Support
- Proper heading hierarchy (h2 for product name, h3 for groups)
- ARIA labels for all interactive elements
- Live regions for price updates
- Descriptive button labels ("Add 2 Margherita Pizza to cart for $24.99")

### 3. Focus Management
- Focus moves to modal on open
- Focus returns to trigger on close
- Visible focus indicators
- No focus traps outside modal

### 4. Color and Contrast
- Text contrast ratio >= 4.5:1
- Interactive element contrast >= 3:1
- Don't rely on color alone (use icons, patterns)

### 5. Motion Sensitivity
- Respect `prefers-reduced-motion`
- No auto-playing animations
- Provide pause controls if needed

### 6. Touch Accessibility
- Touch targets >= 44x44px
- Adequate spacing between targets
- No tiny tap targets

### 7. Error Handling
- Clear error messages
- Errors announced to screen readers
- Visual and text indicators

**Testing Checklist:**
- [ ] VoiceOver (macOS/iOS)
- [ ] NVDA (Windows)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] 200% zoom

**Output Required:**
1. Accessibility audit report
2. Required ARIA attributes for each component
3. Code changes for accessibility fixes
</prompt>

**Expected Output**: Accessibility audit and fixes
**Handoff**: To review phase

---

### Phase 9: Code Review & Testing
**Duration**: 1-2 hours
**Priority**: High

#### Agent: `nextjs-ui-reviewer`

<prompt>
Review the completed product details modal implementation for code quality, best practices, and production readiness.

**Review Checklist:**

### 1. Code Quality
- [ ] Consistent naming conventions
- [ ] Proper TypeScript types (no `any`)
- [ ] No unused imports/variables
- [ ] Proper error handling
- [ ] Clean component separation

### 2. React Best Practices
- [ ] Proper use of hooks
- [ ] No unnecessary re-renders
- [ ] Correct dependency arrays
- [ ] Proper cleanup in useEffect

### 3. Next.js Patterns
- [ ] Correct Server/Client component usage
- [ ] Proper image optimization
- [ ] No unnecessary "use client"

### 4. Styling
- [ ] Consistent Tailwind class ordering
- [ ] No conflicting classes
- [ ] Responsive design complete
- [ ] Dark mode support

### 5. Testing Requirements
- [ ] Component renders without errors
- [ ] All interactive states work
- [ ] Mobile and desktop views correct
- [ ] Animations smooth

**Output Required:**
1. Code review report
2. List of issues (if any)
3. Recommended fixes
</prompt>

**Expected Output**: Code review report
**Handoff**: Final verification

---

#### Agent: `browser_eval MCP` (Parallel with Review)

<prompt>
Visually test the product details modal in browser.

**Test Scenarios:**

1. **Open Modal (Desktop)**
   - Navigate to menu page
   - Click on a product card
   - Verify modal opens smoothly
   - Check all sections render

2. **Variant Selection**
   - Select different variants
   - Verify price updates
   - Check visual feedback

3. **Addon Selection**
   - Select addons
   - Increase quantity
   - Verify counter appears
   - Check price calculation

4. **Mobile View**
   - Resize to mobile width
   - Verify bottomsheet behavior
   - Check all touch targets
   - Test sticky footer

5. **Add to Cart Flow**
   - Configure product
   - Click add to cart
   - Verify success animation

**Screenshot Required:**
- Desktop view
- Mobile view
- Selected state
- Error state
</prompt>

**Expected Output**: Visual verification screenshots
**Handoff**: Complete

---

## Parallel Execution Opportunities

The following phases can run in parallel:

### Parallel Group 1 (Phase 1)
- `shadcn-component-researcher` (component docs)
- `21st-dev MCP` (UI pattern search)

### Parallel Group 2 (Phase 4.2)
- Badge components can be built in parallel
- QuantityPill can be built independently

### Parallel Group 3 (Phase 9)
- `nextjs-ui-reviewer` (code review)
- `browser_eval MCP` (visual testing)

---

## File Changes Summary

### New Files to Create
```
/components/product-details/
  /badges/
    product-type-badge.tsx     # NEW
    popularity-badge.tsx       # NEW
  /cards/
    variant-group-card.tsx     # NEW
    addon-group-card.tsx       # NEW
    addon-option-row.tsx       # NEW
  /controls/
    quantity-pill.tsx          # NEW
  /sections/
    cooking-request-section.tsx # NEW
    sticky-action-bar.tsx      # NEW
    product-meta-section.tsx   # NEW
```

### Files to Update
```
/components/product-details/
  product-details-content.tsx           # UPDATE layout, add CookingRequest
  /sections/
    product-info-section.tsx            # REFACTOR - remove accordion
    variant-groups-section.tsx          # UPDATE - use new cards
    addon-groups-section.tsx            # UPDATE - use new cards
    product-details-footer.tsx          # REPLACE - use StickyActionBar
    product-image-section.tsx           # UPDATE - add action buttons
```

### Files to Potentially Update
```
/contexts/product-details-context.tsx   # ADD cooking request state
/lib/animations/index.ts                # ADD new animation variants
```

---

## Success Criteria

### Visual Quality
- [ ] Matches Zomato/Swiggy quality level
- [ ] Professional typography and spacing
- [ ] Smooth, delightful animations
- [ ] Consistent visual language

### Functional Requirements
- [ ] Variants display correctly
- [ ] Addons display and update correctly
- [ ] Price calculates accurately
- [ ] Add-to-cart works end-to-end
- [ ] Cooking request saves correctly

### Technical Requirements
- [ ] No console errors
- [ ] TypeScript compiles without errors
- [ ] Lighthouse performance >= 90
- [ ] Accessibility audit passes

### User Experience
- [ ] Mobile experience is excellent
- [ ] Desktop experience is polished
- [ ] Interactions feel snappy
- [ ] Error states are clear

---

## Risk Mitigation

### Risk 1: Data Not Flowing
**Mitigation**: Add console.log debugging in context, verify API response structure

### Risk 2: Price Calculation Bug
**Mitigation**: Unit test price calculator, log intermediate values

### Risk 3: Animation Performance
**Mitigation**: Profile with React DevTools, use performance-safe properties

### Risk 4: Breaking Existing Functionality
**Mitigation**: Git branch for changes, incremental commits, test at each phase

---

## Quick Start

To begin implementation, invoke the first agent:

```
Agent: shadcn-component-researcher

Prompt: [Copy prompt from Phase 1]
```

Track progress in this document by checking off completed phases.

---

## Appendix: Type Definitions Reference

```typescript
// From types/product.ts
interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  type: ProductType; // "veg" | "non_veg" | "vegan"
  photoList: string[];
  basePrice: number;
  // ... more fields
}

interface VariantGroupResponse {
  _id: string;
  label: string;
  description: string;
  isPrimary: boolean;
  // ...
}

interface VariantResponse {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  isPrimary: boolean;
  // ...
}

interface AddonGroupResponse {
  _id: string;
  label: string;
  allowMulti: boolean;
  min: number;
  max: number;
  // ...
}

interface AddonResponse {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  // ...
}
```

---

*Document Version: 1.0*
*Created: 2024*
*Last Updated: Today*
