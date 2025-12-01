# Product Details Feature - Implementation Plan

> **Feature**: Product Details Dialog/Bottomsheet with Variants & Addons
> **Complexity**: Complex (10+ components, state management, responsive behavior)
> **Estimated Phases**: 6 phases
> **Total Subagents**: 10

---

## Table of Contents

1. [Feature Analysis](#feature-analysis)
2. [Codebase Context](#codebase-context)
3. [Execution Plan Overview](#execution-plan-overview)
4. [Phase 1: Architecture & Research](#phase-1-architecture--research)
5. [Phase 2: Core UI Components](#phase-2-core-ui-components)
6. [Phase 3: State Management & API Integration](#phase-3-state-management--api-integration)
7. [Phase 4: Variant/Addon Selection Logic](#phase-4-variantaddon-selection-logic)
8. [Phase 5: Responsive & Animations](#phase-5-responsive--animations)
9. [Phase 6: Accessibility & Review](#phase-6-accessibility--review)
10. [Sprint Breakdown](#sprint-breakdown)
11. [Parallel Execution Groups](#parallel-execution-groups)
12. [File Structure](#file-structure)

---

## Feature Analysis

### UI Elements Detected

| Element | Type | Required |
|---------|------|----------|
| Dialog (Desktop) | Container | Yes |
| Bottomsheet (Mobile) | Container | Yes |
| Product Image Gallery | Media | Yes |
| Product Info Section | Display | Yes |
| Collapsible Description | Interaction | Yes |
| Variant Groups (Radio) | Form/Selection | Yes |
| Addon Groups (Checkbox) | Form/Selection | Yes |
| Quantity Counter | Form/Input | Yes |
| Price Calculator | Logic/Display | Yes |
| Add to Cart Button | Action | Yes |
| Loading Skeleton | Feedback | Yes |
| Error State | Feedback | Yes |

### Technical Requirements

| Requirement | Status | Details |
|-------------|--------|---------|
| Server Components | Partial | Dialog trigger can be Server Component |
| Client Interactivity | Yes | Variant selection, quantity, animations |
| Form Validation | Yes | Primary variant required |
| Animations | Yes | Dialog/bottomsheet transitions, selections |
| Real-time Price Updates | Yes | Based on variant/addon selection |
| API Caching | Yes | Global cache for product details |
| Null Handling | Yes | API may return nulls |
| Theme Support | Yes | Light/Dark mode |
| Responsive | Yes | Dialog (web) / Bottomsheet (mobile) |

### Complexity Assessment

```
+------------------+--------------------------------+
| Complexity Level |            COMPLEX             |
+------------------+--------------------------------+
| Components       | 15+ (including sub-components) |
| State Logic      | Multi-level variant pricing    |
| API Integration  | Lazy loading with caching      |
| Responsiveness   | Dual UI (Dialog + Bottomsheet) |
+------------------+--------------------------------+
```

---

## Codebase Context

### Existing Design System

Based on analysis of `/docs/DESIGN_SYSTEM_SUMMARY.md` and `/docs/DESIGN_SYSTEM_SPEC3.md`:

| Token | Value |
|-------|-------|
| Primary Color | `#F97316` (orange-500) |
| Primary Hover | `#EA580C` (orange-600) |
| Dark Background | `#0e182b` (navy) |
| Card Hover Lift | `-4px translateY` |
| Border Radius | `rounded-2xl` for cards |
| Shadow on Hover | `shadow-xl` |

### Existing Components Available

| Component | Path | Purpose |
|-----------|------|---------|
| `Dialog` | `components/ui/dialog.tsx` | Radix-based dialog |
| `Drawer` | `components/ui/drawer.tsx` | Bottomsheet component |
| `Modal` | `components/ui/modal.tsx` | Portal-based modal |
| `RadioGroup` | `components/ui/radio-group.tsx` | Radio selection |
| `Checkbox` | `components/ui/checkbox.tsx` | Checkbox selection |
| `Accordion` | `components/ui/accordion.tsx` | Collapsible sections |
| `QuantityIncrementor` | `components/composite/quantity-incrementor.tsx` | Quantity control |
| `Button` | `components/ui/button.tsx` | With loading state |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading states |
| `ProductCard` | `components/home/menu-section/product-card.tsx` | Current product display |
| `QuickAddButton` | `components/home/menu-section/quick-add-button.tsx` | Add to cart button |

### API Types Available

From `/types/product.ts`:

```typescript
interface ProductDetailsResponse {
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];
}

interface VariantGroupResponse {
  _id: string;
  label: string;
  isPrimary: boolean;  // Key for ordering
  // ...
}

interface AddonGroupResponse {
  allowMulti: boolean;  // Determines checkbox vs quantity
  min: number;
  max: number;
  // ...
}

interface VariantPricingResponse {
  type: "addonGroup" | "addon" | "variant";
  variantId: string;
  subVariantId: string;  // For secondary variant pricing
  addonId: string;
  price: number;
  // ...
}
```

### API Function Available

From `/lib/api/products.ts`:

```typescript
async function getProductDetails(productId: string): Promise<APIResponse<ProductDetailsResponse>>
```

---

## Execution Plan Overview

```
+------------------------------------------------------------------+
|                    EXECUTION FLOW DIAGRAM                         |
+------------------------------------------------------------------+

Phase 1: ARCHITECTURE & RESEARCH (Parallel)
+-------------------+     +---------------------------+
| Component         |     | shadcn-requirements-      |
| Architect         |     | analyzer                  |
| (Structure)       |     | (Requirements)            |
+-------------------+     +---------------------------+
         |                           |
         v                           v
+------------------------------------------------------------------+
|                   Phase 1 Complete Gate                           |
+------------------------------------------------------------------+
                              |
                              v
Phase 2: CORE UI COMPONENTS (Parallel)
+-------------------+     +---------------------------+
| shadcn-component- |     | premium-ux-designer       |
| researcher        |     | (UI Polish)               |
| (Components)      |     |                           |
+-------------------+     +---------------------------+
         |                           |
         v                           v
+-------------------+
| shadcn-           |
| implementation-   |
| builder           |
+-------------------+
                              |
                              v
+------------------------------------------------------------------+
|                   Phase 2 Complete Gate                           |
+------------------------------------------------------------------+
                              |
                              v
Phase 3: STATE MANAGEMENT & API (Sequential)
+-------------------+
| nextjs-forms-     |
| expert            |
| (State/Caching)   |
+-------------------+
                              |
                              v
+------------------------------------------------------------------+
|                   Phase 3 Complete Gate                           |
+------------------------------------------------------------------+
                              |
                              v
Phase 4: VARIANT/ADDON LOGIC (Sequential)
+-------------------+
| nextjs-forms-     |
| expert            |
| (Price Logic)     |
+-------------------+
                              |
                              v
+------------------------------------------------------------------+
|                   Phase 4 Complete Gate                           |
+------------------------------------------------------------------+
                              |
                              v
Phase 5: RESPONSIVE & ANIMATIONS (Parallel)
+-------------------+     +---------------------------+
| nextjs-responsive-|     | nextjs-animation-         |
| design            |     | specialist                |
+-------------------+     +---------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                   Phase 5 Complete Gate                           |
+------------------------------------------------------------------+
                              |
                              v
Phase 6: ACCESSIBILITY & REVIEW (Sequential)
+-------------------+     +---------------------------+
| nextjs-           |     | nextjs-ui-reviewer        |
| accessibility-    |     | (Final Review)            |
| expert            |     |                           |
+-------------------+     +---------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      FEATURE COMPLETE                             |
+------------------------------------------------------------------+
```

---

## Phase 1: Architecture & Research

### Phase 1.1: Component Architecture

**Agent**: `nextjs-component-architect`
**MCPs**: `mcp__next-devtools__nextjs_docs`, `mcp__next-devtools__init`
**Duration**: 1-2 hours

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Design the component architecture for a Product Details feature in a Next.js 16 food delivery app.

## Context
- Existing stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- Dialog for desktop (>640px), Bottomsheet for mobile (<640px)
- Lazy API fetching (only when opened)
- Global caching for product details

## Requirements
1. ProductDetailsContainer - Responsive wrapper switching Dialog/Bottomsheet
2. ProductDetailsDialog - Desktop dialog using existing Dialog component
3. ProductDetailsBottomsheet - Mobile using existing Drawer component (side="bottom")
4. ProductDetailsContent - Shared content component
5. ProductImageSection - Product images display
6. ProductInfoSection - Name, description (collapsible), nutritional info
7. VariantGroupSection - Radio groups for variant selection
8. AddonGroupSection - Checkbox/quantity for addons
9. PriceCalculator - Real-time price based on selections
10. AddToCartSection - Final add to cart button with total

## Design Constraints
- Use React Context for variant/addon selection state
- Keep dialog/bottomsheet logic in parent, content shared
- Server Component for trigger, Client Component for modal content
- Follow existing design system (orange primary, card patterns)

## Expected Output
1. Component hierarchy diagram
2. Server/Client component boundaries
3. Props interface definitions
4. State management approach
5. Data flow diagram
```

</details>

**Expected Deliverables**:
- Component hierarchy document
- Server/Client boundaries defined
- State management strategy
- Data flow diagram

---

### Phase 1.2: Requirements Analysis

**Agent**: `shadcn-requirements-analyzer`
**MCPs**: `mcp__shadcn__list_items_in_registries`, `mcp__shadcn__search_items_in_registries`
**Duration**: 1 hour
**Can run in parallel with**: Phase 1.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Analyze the Product Details feature and break down into shadcn/ui component requirements.

## Feature Requirements
1. Dialog container (desktop) - Already have `components/ui/dialog.tsx`
2. Drawer/Bottomsheet (mobile) - Already have `components/ui/drawer.tsx`
3. Accordion for collapsible description - Already have `components/ui/accordion.tsx`
4. Radio groups for variant selection - Already have `components/ui/radio-group.tsx`
5. Checkboxes for addon selection - Already have `components/ui/checkbox.tsx`
6. Quantity incrementor - Already have `components/composite/quantity-incrementor.tsx`
7. Skeleton for loading - Already have `components/ui/skeleton.tsx`
8. Separator for sections - Already have `components/ui/separator.tsx`
9. Badge for product type (veg/non-veg) - Already have `components/ui/badge.tsx`

## New Components Needed
1. Custom variant selection card (styled radio option)
2. Custom addon selection card (styled checkbox with quantity)
3. Product image carousel/gallery
4. Nutritional info display
5. Sticky price footer

## Analyze
1. Which existing components can be reused as-is?
2. Which need extension/customization?
3. What new patterns are needed?
4. Are there any shadcn components we should install?

## Output
Create a requirements.md with:
- Component usage matrix
- Customization requirements
- New component specifications
```

</details>

**Expected Deliverables**:
- Component usage matrix
- Customization requirements document
- List of additional shadcn components needed

---

## Phase 2: Core UI Components

### Phase 2.1: Component Research

**Agent**: `shadcn-component-researcher`
**MCPs**: `mcp__shadcn__view_items_in_registries`, `mcp__shadcn__get_item_examples_from_registries`
**Duration**: 1 hour
**Depends on**: Phase 1.2

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Research shadcn components and examples for the Product Details feature.

## Components to Research
1. Dialog patterns with image galleries
2. Drawer/bottomsheet patterns for mobile
3. Radio group with custom styled options (card-style)
4. Checkbox with associated quantity controls
5. Accordion for read more/less patterns
6. Image carousel/gallery patterns

## Registry to Search
- @shadcn (primary registry)

## Research Tasks
1. Find dialog examples with product/item details
2. Find radio group examples with visual options (not just text)
3. Find accordion examples for collapsible content
4. Find any food/e-commerce related examples

## Output
For each relevant component:
1. Component code snippet
2. Usage example
3. Customization notes for Pizza Space brand
```

</details>

**Expected Deliverables**:
- Component documentation
- Code examples
- Customization notes

---

### Phase 2.2: Premium UX Design

**Agent**: `premium-ux-designer`
**MCPs**: `mcp__21st-dev__21st_magic_component_inspiration`
**Duration**: 2 hours
**Can run in parallel with**: Phase 2.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Design premium UX for a Product Details feature in a food delivery app.

## Brand Context
- Primary color: Orange (#F97316)
- Dark mode: Navy background (#0e182b)
- Style: Modern, clean, eye-catching for food
- Target: Fast food delivery customers

## UX Requirements

### Desktop Dialog
1. Max-width 600px, vertically centered
2. Product image at top (300px height, cover)
3. Smooth open/close animations
4. Sticky header with product name on scroll
5. Sticky footer with total price + add button

### Mobile Bottomsheet
1. Full-width, 90vh max-height
2. Drag handle at top
3. Swipe down to close
4. Sticky bottom with price + button
5. Smooth spring animation

### Variant Selection UX
1. Card-style radio options (not plain radios)
2. Selected state with orange border glow
3. Price displayed on each option
4. Clear visual hierarchy (primary variants larger)

### Addon Selection UX
1. Compact list with checkbox + label + price
2. For multi-quantity: inline quantity control
3. Clear grouping by addon group
4. Smooth add/remove animations

### Price Display
1. Base price crossed out if variants add price
2. Current total prominently displayed
3. Breakdown tooltip/expandable
4. Currency: GBP (use formatPrice from lib/formatters)

### Micro-interactions
1. Selection ripple effect
2. Price update animation (count up/down)
3. Add to cart success animation
4. Image zoom on tap (mobile)

## Output
1. UX flow description
2. Visual hierarchy recommendations
3. Animation specifications
4. Interaction patterns
```

</details>

**Expected Deliverables**:
- UX flow specifications
- Visual hierarchy guide
- Animation specs
- Interaction patterns

---

### Phase 2.3: Component Implementation

**Agent**: `shadcn-implementation-builder`
**MCPs**: `mcp__shadcn__get_add_command_for_items`, `mcp__shadcn__get_audit_checklist`
**Duration**: 4-5 hours
**Depends on**: Phase 2.1, Phase 2.2

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Build the Product Details components following Pizza Space design system.

## Components to Build

### 1. ProductDetailsContainer
Location: `components/product/product-details-container.tsx`
- Client component
- Detects viewport width (use hook)
- Renders Dialog for desktop, Drawer (bottom) for mobile
- Manages open/close state
- Triggers API fetch on open

### 2. ProductDetailsDialog
Location: `components/product/product-details-dialog.tsx`
- Extends existing Dialog component
- Custom max-width (600px)
- Custom animations matching brand

### 3. ProductDetailsBottomsheet
Location: `components/product/product-details-bottomsheet.tsx`
- Uses existing Drawer with side="bottom"
- 90vh max-height
- Drag handle styling

### 4. ProductDetailsContent
Location: `components/product/product-details-content.tsx`
- Shared content for both Dialog/Bottomsheet
- Receives product details as props
- Sections: Image, Info, Variants, Addons, Price

### 5. ProductImageSection
Location: `components/product/sections/product-image-section.tsx`
- Display product image(s)
- Use CustomImage component
- Placeholder/fallback handling

### 6. ProductInfoSection
Location: `components/product/sections/product-info-section.tsx`
- Product name, badges (veg/non-veg)
- Collapsible description (Accordion)
- Nutritional info grid

### 7. VariantSelector
Location: `components/product/selectors/variant-selector.tsx`
- Renders variant groups in order (primary first)
- Uses RadioGroup internally
- Custom styled variant cards

### 8. VariantCard
Location: `components/product/selectors/variant-card.tsx`
- Individual variant option
- Label + price display
- Selected state with orange highlight

### 9. AddonSelector
Location: `components/product/selectors/addon-selector.tsx`
- Renders addon groups
- Checkbox for single, Quantity for multi
- Group headers

### 10. AddonItem
Location: `components/product/selectors/addon-item.tsx`
- Checkbox + label + price
- Optional quantity incrementor
- Selected state styling

### 11. PriceDisplay
Location: `components/product/price-display.tsx`
- Base price (struck if modified)
- Current total
- Price breakdown tooltip

### 12. ProductDetailsFooter
Location: `components/product/product-details-footer.tsx`
- Sticky footer
- Quantity selector
- Total price
- Add to Cart button

### 13. ProductDetailsSkeleton
Location: `components/product/product-details-skeleton.tsx`
- Loading state skeleton
- Matches content layout

## Design System Compliance
- Use existing Button, Badge, Skeleton, Separator
- Orange primary (#F97316) for selected states
- Card patterns from existing ProductCard
- Dark mode support with navy backgrounds
- Framer Motion for animations

## Output
Fully implemented components with:
- TypeScript interfaces
- Proper accessibility (ARIA)
- Theme-aware styling
- Loading states
```

</details>

**Expected Deliverables**:
- All component files created
- TypeScript interfaces defined
- Basic styling applied
- Loading states implemented

---

## Phase 3: State Management & API Integration

### Phase 3.1: State & Caching

**Agent**: `nextjs-forms-expert`
**MCPs**: `mcp__next-devtools__nextjs_docs`, `mcp__next-devtools__nextjs_call`
**Duration**: 3 hours
**Depends on**: Phase 2.3

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Implement state management and API caching for Product Details feature.

## Context
- API: `getProductDetails(productId)` from `lib/api/products.ts`
- Types: `ProductDetailsResponse` from `types/product.ts`
- Requirement: Lazy fetch only when dialog opens
- Caching: Don't refetch if already cached

## Implementation Tasks

### 1. Create Product Details Context
Location: `contexts/product-details-context.tsx`

```typescript
interface ProductDetailsState {
  // Product data
  productDetails: ProductDetailsResponse | null;
  isLoading: boolean;
  error: string | null;

  // Selections
  selectedVariants: Map<string, string>; // groupId -> variantId
  selectedAddons: Map<string, number>;   // addonId -> quantity

  // Computed
  totalPrice: number;
}

interface ProductDetailsContextValue extends ProductDetailsState {
  // Actions
  fetchProductDetails: (productId: string) => Promise<void>;
  selectVariant: (groupId: string, variantId: string) => void;
  toggleAddon: (addonId: string) => void;
  setAddonQuantity: (addonId: string, quantity: number) => void;
  resetSelections: () => void;

  // Helpers
  getVariantPrice: (variantId: string) => number;
  getAddonPrice: (addonId: string) => number;
  isVariantSelected: (variantId: string) => boolean;
  isAddonSelected: (addonId: string) => boolean;
}
```

### 2. Implement Global Cache
Location: `lib/cache/product-details-cache.ts`

```typescript
// Simple in-memory cache with TTL
class ProductDetailsCache {
  private cache: Map<string, { data: ProductDetailsResponse; timestamp: number }>;
  private TTL: number = 5 * 60 * 1000; // 5 minutes

  get(productId: string): ProductDetailsResponse | null;
  set(productId: string, data: ProductDetailsResponse): void;
  has(productId: string): boolean;
  invalidate(productId: string): void;
  clear(): void;
}
```

### 3. Create Custom Hook
Location: `hooks/use-product-details.ts`

```typescript
function useProductDetails(productId: string, shouldFetch: boolean) {
  // Only fetch when shouldFetch is true (dialog is open)
  // Check cache first
  // Handle loading, error states
  // Return { data, isLoading, error, refetch }
}
```

### 4. Handle Null Values
- API may return null for optional fields
- Create utility functions to safely access nested data
- Provide fallback values for display

### 5. Default Selection Logic
- When data loads, auto-select first variant from each primary group
- Don't auto-select addons

## Output
1. Context provider component
2. Cache implementation
3. Custom hook
4. Null-safe utility functions
5. Integration with ProductDetailsContainer
```

</details>

**Expected Deliverables**:
- ProductDetailsContext
- Caching mechanism
- useProductDetails hook
- Null handling utilities

---

## Phase 4: Variant/Addon Selection Logic

### Phase 4.1: Price Calculation

**Agent**: `nextjs-forms-expert`
**MCPs**: None (pure logic)
**Duration**: 3 hours
**Depends on**: Phase 3.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Implement variant/addon selection logic with dynamic pricing for Product Details.

## Pricing Rules (from spec)

### Primary Variants
- Price comes directly from `VariantResponse.price`
- Display price on variant card

### Secondary Variants
- Price comes from `VariantPricingResponse`
- Must match: `variantId` (primary selected) + `subVariantId` (secondary variant)
- Filter pricing array to find matching entry

### Addons
- Price from `VariantPricingResponse`
- Must match: `variantId` (primary selected) + `addonId`
- If no pricing entry, fallback to `AddonResponse.price`

## Implementation

### 1. Price Calculator Utility
Location: `lib/utils/price-calculator.ts`

```typescript
interface PriceBreakdown {
  basePrice: number;
  primaryVariantPrice: number;
  secondaryVariantsPrices: { name: string; price: number }[];
  addonsPrices: { name: string; price: number; quantity: number }[];
  totalPrice: number;
}

function calculateTotalPrice(
  product: ProductResponse,
  variantList: VariantResponse[],
  addonList: AddonResponse[],
  pricing: VariantPricingResponse[],
  selectedVariants: Map<string, string>,
  selectedAddons: Map<string, number>
): PriceBreakdown;
```

### 2. Selection Validators
```typescript
// Validate primary variant is selected
function validatePrimaryVariantSelected(
  variantGroups: VariantGroupResponse[],
  selectedVariants: Map<string, string>
): boolean;

// Get available secondary variants based on primary selection
function getAvailableSecondaryVariants(
  primaryVariantId: string,
  pricing: VariantPricingResponse[]
): string[];

// Check if addon is available for current variant selection
function isAddonAvailableForVariant(
  addonId: string,
  primaryVariantId: string,
  pricing: VariantPricingResponse[]
): boolean;
```

### 3. Group Ordering
```typescript
// Sort variant groups: primary first, then secondary
function sortVariantGroups(groups: VariantGroupResponse[]): VariantGroupResponse[];

// Order: Primary Variants -> Secondary Variants -> Addons
```

### 4. Addon Quantity Logic
```typescript
// From AddonGroupResponse
interface AddonGroupConfig {
  allowMulti: boolean;  // If true, show quantity selector
  min: number;          // Minimum quantity required
  max: number;          // Maximum quantity allowed
}

// Handle addon selection
function handleAddonToggle(
  addonId: string,
  groupConfig: AddonGroupConfig,
  currentQuantity: number
): number; // Returns new quantity (0 = deselected)
```

### 5. Form Validation for Add to Cart
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateProductSelection(
  variantGroups: VariantGroupResponse[],
  selectedVariants: Map<string, string>,
  addonGroups: AddonGroupResponse[],
  selectedAddons: Map<string, number>
): ValidationResult;
```

## Integration
- Connect all utilities to ProductDetailsContext
- Update total price on any selection change
- Show validation errors before add to cart

## Output
1. Price calculation utilities
2. Selection validators
3. Group ordering utilities
4. Complete integration with context
5. Test cases for pricing logic
```

</details>

**Expected Deliverables**:
- Price calculator utility
- Selection validators
- Group ordering logic
- Validation functions

---

## Phase 5: Responsive & Animations

### Phase 5.1: Responsive Implementation

**Agent**: `nextjs-responsive-design`
**MCPs**: `mcp__playwright__playwright_screenshot`
**Duration**: 2-3 hours
**Depends on**: Phase 4.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Implement responsive design for Product Details Dialog/Bottomsheet.

## Breakpoints
- Mobile: < 640px (Bottomsheet)
- Desktop: >= 640px (Dialog)

## Implementation Tasks

### 1. Viewport Detection Hook
Location: `hooks/use-is-mobile.ts`

```typescript
function useIsMobile(breakpoint: number = 640): boolean {
  // SSR-safe
  // Use matchMedia for accurate detection
  // Return false on server, true default until hydrated
}
```

### 2. Dialog (Desktop) Responsive
- Width: 600px max on large screens, 95vw on medium
- Height: 90vh max
- Padding: 24px
- Image: 300px height

### 3. Bottomsheet (Mobile) Responsive
- Full width
- Height: 90vh max, 60vh min
- Drag handle: Visible
- Safe area padding for notch devices
- Swipe to close

### 4. Content Responsive
```css
/* Mobile */
.product-image { height: 200px; }
.variant-cards { grid-cols-1; }
.addon-items { compact layout }
.footer { sticky, full-width }

/* Desktop */
.product-image { height: 300px; }
.variant-cards { grid-cols-2; }
.addon-items { comfortable layout }
.footer { sticky, with padding }
```

### 5. Touch Optimizations
- Larger tap targets on mobile (48px min)
- Touch feedback on selections
- Swipe gestures for bottomsheet

### 6. Safe Area Handling
```tsx
// Handle iPhone notch, home indicator
<div className="pb-safe">
  {/* Footer content */}
</div>
```

## Testing
Use Playwright to capture screenshots at:
- 375px (iPhone SE)
- 414px (iPhone Plus)
- 768px (iPad)
- 1024px (Desktop)
- 1440px (Large Desktop)

## Output
1. useIsMobile hook
2. Responsive variants for all components
3. Touch optimizations
4. Safe area handling
5. Screenshot verification
```

</details>

**Expected Deliverables**:
- useIsMobile hook
- Responsive component variants
- Touch optimizations
- Safe area CSS

---

### Phase 5.2: Animations

**Agent**: `nextjs-animation-specialist`
**MCPs**: `mcp__21st-dev__21st_magic_component_builder`
**Duration**: 2-3 hours
**Can run in parallel with**: Phase 5.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Implement animations for Product Details feature using Framer Motion.

## Animation Requirements

### 1. Dialog Animations
```typescript
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
};
```

### 2. Bottomsheet Animations
```typescript
const bottomsheetVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 400
    }
  },
  exit: {
    y: "100%",
    transition: { duration: 0.25 }
  }
};

// Drag to dismiss
const dragConstraints = { top: 0, bottom: 0 };
const dragElastic = { top: 0, bottom: 0.5 };
```

### 3. Content Animations
- Stagger children on enter (0.05s delay each)
- Fade in sections sequentially

### 4. Selection Animations
```typescript
// Variant selection
const variantCardVariants = {
  unselected: {
    borderColor: "var(--border)",
    boxShadow: "none"
  },
  selected: {
    borderColor: "#F97316",
    boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)"
  }
};

// Addon toggle
const addonItemVariants = {
  unselected: { backgroundColor: "transparent" },
  selected: { backgroundColor: "rgba(249, 115, 22, 0.1)" }
};
```

### 5. Price Update Animation
```typescript
// Animate price changes
function AnimatedPrice({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-bold text-orange-500"
    >
      {formatPrice(value)}
    </motion.span>
  );
}
```

### 6. Add to Cart Success
```typescript
const addToCartVariants = {
  idle: { scale: 1 },
  loading: { scale: 1 },
  success: {
    scale: [1, 1.1, 1],
    backgroundColor: ["#F97316", "#22C55E", "#22C55E"]
  }
};
```

### 7. Loading Skeleton Animation
- Shimmer effect on skeleton components
- Use existing skeleton patterns

### 8. Reduced Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

const animationConfig = prefersReducedMotion
  ? { duration: 0 }
  : { type: "spring", damping: 25, stiffness: 300 };
```

## Output
1. Animation variant definitions
2. Animated component wrappers
3. Price animation component
4. Reduced motion support
5. Gesture handlers for bottomsheet
```

</details>

**Expected Deliverables**:
- Dialog/Bottomsheet animations
- Selection animations
- Price update animations
- Add to cart feedback
- Reduced motion support

---

## Phase 6: Accessibility & Review

### Phase 6.1: Accessibility

**Agent**: `nextjs-accessibility-expert`
**MCPs**: `mcp__playwright__playwright_evaluate`
**Duration**: 2 hours
**Depends on**: Phase 5.1, Phase 5.2

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Audit and enhance accessibility for Product Details feature.

## WCAG 2.1 AA Requirements

### 1. Dialog/Modal Accessibility
- Focus trap within dialog
- Return focus to trigger on close
- Escape key to close
- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` pointing to title
- Backdrop click to close

### 2. Radio Group (Variants)
- Proper `role="radiogroup"`
- `aria-labelledby` for group label
- Arrow key navigation between options
- `aria-checked` on selected option
- Focus visible states

### 3. Checkbox Group (Addons)
- `role="group"` for addon groups
- `aria-labelledby` for group label
- Space to toggle
- `aria-checked` state

### 4. Quantity Controls
- `role="spinbutton"`
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Increase/decrease buttons with labels

### 5. Price Announcements
```typescript
// Announce price changes to screen readers
<div role="status" aria-live="polite" aria-atomic="true">
  Total: {formatPrice(totalPrice)}
</div>
```

### 6. Loading States
- `aria-busy="true"` on loading container
- Skeleton with `aria-hidden="true"`
- Loading announcement

### 7. Error States
- `role="alert"` for validation errors
- `aria-describedby` linking inputs to errors

### 8. Image Accessibility
- Descriptive alt text
- `role="img"` for decorative container

### 9. Keyboard Navigation Order
1. Close button
2. Product info
3. Variant groups (tab through, arrow within)
4. Addon groups (tab through, space to toggle)
5. Quantity
6. Add to cart button

### 10. Touch Target Sizes
- Minimum 44x44px for all interactive elements
- Adequate spacing between targets

## Testing
- Test with VoiceOver (macOS)
- Test with keyboard only
- Run aXe accessibility audit
- Verify focus management

## Output
1. ARIA attributes added to all components
2. Focus management implementation
3. Keyboard navigation handlers
4. Screen reader announcements
5. Accessibility test checklist
```

</details>

**Expected Deliverables**:
- ARIA attributes
- Focus management
- Keyboard navigation
- Screen reader announcements

---

### Phase 6.2: Final Review

**Agent**: `nextjs-ui-reviewer`
**MCPs**: `mcp__next-devtools__nextjs_index`, `mcp__playwright__playwright_screenshot`
**Duration**: 2 hours
**Depends on**: Phase 6.1

<details>
<summary><strong>Agent Prompt</strong></summary>

```markdown
Perform final code review and quality check for Product Details feature.

## Review Checklist

### 1. Code Quality
- [ ] TypeScript strict mode compliance
- [ ] No any types
- [ ] Proper error handling
- [ ] Clean separation of concerns
- [ ] DRY principles followed
- [ ] Consistent naming conventions

### 2. Component Architecture
- [ ] Server/Client boundaries correct
- [ ] Props properly typed
- [ ] Context usage appropriate
- [ ] No prop drilling
- [ ] Memoization where needed

### 3. Performance
- [ ] Lazy loading working
- [ ] No unnecessary re-renders
- [ ] Images optimized (CustomImage)
- [ ] Bundle size reasonable
- [ ] Cache working correctly

### 4. Design System Compliance
- [ ] Orange primary color used
- [ ] Dark mode working
- [ ] Consistent spacing
- [ ] Proper typography
- [ ] Card patterns followed

### 5. Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Reduced motion respected

### 6. Responsive Design
- [ ] Mobile bottomsheet works
- [ ] Desktop dialog works
- [ ] Breakpoint switching smooth
- [ ] Touch targets adequate
- [ ] Safe areas handled

### 7. Error Handling
- [ ] Loading states present
- [ ] Error states handled
- [ ] Null data handled
- [ ] Network errors caught
- [ ] Validation errors shown

### 8. Testing Readiness
- [ ] Components testable
- [ ] Hooks testable
- [ ] Utils have test cases
- [ ] No hardcoded values

## Visual Review
Capture screenshots and verify:
- Light mode desktop
- Dark mode desktop
- Light mode mobile
- Dark mode mobile
- Loading state
- Error state
- Selected state (variants/addons)

## Integration Check
- [ ] ProductCard opens details correctly
- [ ] QuickAddButton works with variants
- [ ] Price updates in real-time
- [ ] Add to cart completes successfully

## Output
1. Code review report
2. Issues found with fixes
3. Performance metrics
4. Screenshots for verification
5. Final approval/rejection
```

</details>

**Expected Deliverables**:
- Code review report
- Issue fixes
- Performance verification
- Visual verification screenshots
- Final sign-off

---

## Sprint Breakdown

### Sprint 1 (Foundation) - Day 1
| Task | Agent | Duration | Parallel |
|------|-------|----------|----------|
| Phase 1.1 Architecture | `nextjs-component-architect` | 2h | Yes |
| Phase 1.2 Requirements | `shadcn-requirements-analyzer` | 1h | Yes |

**Deliverables**: Architecture docs, requirements matrix

---

### Sprint 2 (Components) - Days 2-3
| Task | Agent | Duration | Parallel |
|------|-------|----------|----------|
| Phase 2.1 Research | `shadcn-component-researcher` | 1h | Yes |
| Phase 2.2 UX Design | `premium-ux-designer` | 2h | Yes |
| Phase 2.3 Implementation | `shadcn-implementation-builder` | 5h | No (depends on 2.1, 2.2) |

**Deliverables**: All UI components, basic styling

---

### Sprint 3 (Logic) - Days 3-4
| Task | Agent | Duration | Parallel |
|------|-------|----------|----------|
| Phase 3.1 State/Caching | `nextjs-forms-expert` | 3h | No |
| Phase 4.1 Price Logic | `nextjs-forms-expert` | 3h | No |

**Deliverables**: Context, hooks, price calculator, validators

---

### Sprint 4 (Polish) - Days 4-5
| Task | Agent | Duration | Parallel |
|------|-------|----------|----------|
| Phase 5.1 Responsive | `nextjs-responsive-design` | 3h | Yes |
| Phase 5.2 Animations | `nextjs-animation-specialist` | 3h | Yes |

**Deliverables**: Responsive behavior, animations, transitions

---

### Sprint 5 (Quality) - Day 5
| Task | Agent | Duration | Parallel |
|------|-------|----------|----------|
| Phase 6.1 Accessibility | `nextjs-accessibility-expert` | 2h | No |
| Phase 6.2 Review | `nextjs-ui-reviewer` | 2h | No |

**Deliverables**: A11y compliance, final approval

---

## Parallel Execution Groups

```
+---------------------------------------------------------------+
|                    PARALLEL GROUP A                            |
|   Phase 1.1 (Architecture) || Phase 1.2 (Requirements)        |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                    PARALLEL GROUP B                            |
|   Phase 2.1 (Research) || Phase 2.2 (UX Design)               |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                    SEQUENTIAL GROUP C                          |
|   Phase 2.3 (Implementation) -> Phase 3.1 (State)             |
|   -> Phase 4.1 (Price Logic)                                  |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                    PARALLEL GROUP D                            |
|   Phase 5.1 (Responsive) || Phase 5.2 (Animations)            |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                    SEQUENTIAL GROUP E                          |
|   Phase 6.1 (Accessibility) -> Phase 6.2 (Review)             |
+---------------------------------------------------------------+
```

---

## File Structure

```
/Users/vrajpatel/Documents/personal/pizzaspace_web/
├── components/
│   └── product/
│       ├── product-details-container.tsx      # Main container
│       ├── product-details-dialog.tsx         # Desktop dialog
│       ├── product-details-bottomsheet.tsx    # Mobile bottomsheet
│       ├── product-details-content.tsx        # Shared content
│       ├── product-details-footer.tsx         # Sticky footer
│       ├── product-details-skeleton.tsx       # Loading state
│       ├── price-display.tsx                  # Price component
│       ├── sections/
│       │   ├── product-image-section.tsx
│       │   └── product-info-section.tsx
│       └── selectors/
│           ├── variant-selector.tsx
│           ├── variant-card.tsx
│           ├── addon-selector.tsx
│           └── addon-item.tsx
├── contexts/
│   └── product-details-context.tsx            # State management
├── hooks/
│   ├── use-product-details.ts                 # Data fetching hook
│   └── use-is-mobile.ts                       # Viewport detection
├── lib/
│   ├── cache/
│   │   └── product-details-cache.ts           # Caching utility
│   └── utils/
│       └── price-calculator.ts                # Pricing logic
└── types/
    └── product.ts                             # Already exists
```

---

## Quick Start

To begin implementation, invoke the first agent:

```bash
# Start with Phase 1.1
Agent: nextjs-component-architect
```

Copy the prompt from [Phase 1.1](#phase-11-component-architecture) and begin.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Complex pricing logic | Extensive unit tests for price-calculator |
| Mobile/Desktop switch | useIsMobile hook with SSR handling |
| API null values | Utility functions with fallbacks |
| Performance issues | Lazy loading, caching, memoization |
| Accessibility gaps | Dedicated a11y phase with testing |

---

## Success Criteria

- [ ] Dialog opens on desktop, bottomsheet on mobile
- [ ] API fetches only when opened
- [ ] Caching prevents duplicate fetches
- [ ] Primary variant auto-selected
- [ ] Price updates in real-time
- [ ] Smooth animations throughout
- [ ] Fully keyboard navigable
- [ ] Screen reader compatible
- [ ] Dark mode works correctly
- [ ] No build or runtime errors

---

**Document Version**: 1.0
**Created**: 2025-12-01
**Status**: Ready for Execution
