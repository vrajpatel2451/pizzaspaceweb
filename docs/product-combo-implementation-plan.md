# Product Combo Integration - Implementation Plan

## Overview

| Attribute | Details |
|-----------|---------|
| **Feature** | Product Combo Integration |
| **Complexity** | Complex (10+ new components, multi-level state management) |
| **Total Phases** | 6 phases with 15 subphases |
| **Agents Used** | 12 specialized agents |

---

## Confirmed Requirements

| Question | Answer |
|----------|--------|
| API Ready | Yes - backend returns `comboGroups` and `comboGroupProducts` when `isCombo=true` |
| Edit Mode | Yes - combo cart items support editing with existing selections |
| Pricing | Fixed combo base price + addon extras only (no variant prices) |
| Selection UI | Multi-selection based on `maxSelection` - Custom UI: `[Name]...[selected x][customise]` (NO checkbox/radio) |
| Customization Hidden | If `allowCustomization=false`, customize button hidden (addons/variants auto hidden) |
| Combo Exclusivity | When `isCombo=true`, there are NO variants/addons - ONLY combo groups |

---

## UI Elements Required

- [x] Lists/Grids (combo group products)
- [x] Cards (combo group cards, combo product cards)
- [x] Modals/Dialogs (nested customization dialog)
- [x] Custom selection controls (NOT checkbox/radio - custom styled items)
- [x] Badges (selected chip with count, validation indicators)
- [x] Data Display (pricing breakdown)
- [x] Interactive Elements (Customize button, Remove option)

---

## Phase Breakdown

### Phase 1: Type System & Data Architecture

**Duration**: 1-2 hours | **Foundational - No Parallel**

#### Subphase 1.1: Type Definitions
**Agent**: `nextjs-component-architect`

**Task**: Create `/types/combo.ts` with:

```typescript
// Combo Selection State - Track selections per combo group
interface ComboSelectionState {
  [groupId: string]: {
    productId: string;
    comboGroupProductId: string; // Reference to ComboGroupProduct._id
    variantId: string;           // from defaultVariantId
    pricing: PricingSelection[]; // addon selections for this combo item
    customized: boolean;         // whether user opened customization
  };
}

// For multi-selection support (maxSelection > 1)
interface ComboGroupSelectionState {
  [groupId: string]: ComboItemSelection[];
}

interface ComboItemSelection {
  productId: string;
  comboGroupProductId: string;
  variantId: string;
  pricing: PricingSelection[];
  customized: boolean;
}

// Component Props
interface ComboGroupsSectionProps {
  className?: string;
}

interface ComboGroupCardProps {
  group: ComboGroupResponse;
  products: ComboGroupProductResponse[];
}

interface ComboProductItemProps {
  product: ComboGroupProductResponse;
  groupId: string;
  selectionIndex: number | null; // null if not selected, index if selected
  totalSelected: number;
  maxSelection: number;
  allowCustomization: boolean;
}

interface ComboCustomizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  selectionIndex: number;
}

interface ComboValidationResult {
  isValid: boolean;
  error?: string;
  selectedCount: number;
  minRequired: number;
  maxAllowed: number;
}
```

**Expected Output**: Complete TypeScript interfaces for combo feature

---

### Phase 2: State Management & Context Extension

**Duration**: 2-3 hours | **Depends on Phase 1**

#### Subphase 2.1: Context Architecture Design
**Agent**: `nextjs-component-architect`

**New State Properties**:
```typescript
// When product.isCombo === true
comboSelections: ComboGroupSelectionState;  // selections per group (array for multi-select)
activeCustomizationGroup: string | null;     // which group is being customized
activeCustomizationIndex: number | null;     // which item in group being customized
customizationProductData: ProductDetailsResponse | null; // loaded product for customization
```

**New Actions**:
```typescript
// Toggle selection (add if not selected, remove if already selected)
toggleComboProduct: (groupId: string, productId: string, comboGroupProductId: string, defaultVariantId?: string) => void;

// Customization
openComboCustomization: (groupId: string, selectionIndex: number) => Promise<void>;
closeComboCustomization: () => void;
updateComboItemPricing: (groupId: string, selectionIndex: number, pricing: PricingSelection[]) => void;

// Remove specific selection
removeComboSelection: (groupId: string, selectionIndex: number) => void;
```

**New Computed Values**:
```typescript
getComboGroupValidation: (groupId: string) => ComboValidationResult;
getComboGroupSelectedCount: (groupId: string) => number;
comboTotalPrice: number;  // base combo price + all addon prices
isComboValid: boolean;    // all groups meet min/max requirements
```

#### Subphase 2.2: Context Implementation
**Agent**: `nextjs-forms-expert`

**Price Calculation Logic**:
```typescript
// For combo products:
// basePrice = combo product's basePrice (deal price)
// + sum of each combo item's addon pricing
// NO variant prices (defaultVariantId is just for addon pricing reference)

const comboTotalPrice = useMemo(() => {
  if (!productData?.product.isCombo) return 0;

  let total = productData.product.basePrice;

  Object.values(comboSelections).forEach(selections => {
    selections.forEach(selection => {
      selection.pricing.forEach(p => {
        total += p.price * p.quantity;
      });
    });
  });

  return total;
}, [productData, comboSelections]);
```

**Validation Logic**:
```typescript
const getComboGroupValidation = (groupId: string): ComboValidationResult => {
  const group = productData?.comboGroups?.find(g => g.groupId === groupId);
  if (!group) return { isValid: false, error: 'Group not found', selectedCount: 0, minRequired: 0, maxAllowed: 0 };

  const selections = comboSelections[groupId] ?? [];
  const selectedCount = selections.length;

  let error: string | undefined;
  if (selectedCount < group.minSelection) {
    error = `Select at least ${group.minSelection} item${group.minSelection > 1 ? 's' : ''}`;
  }

  return {
    isValid: selectedCount >= group.minSelection && selectedCount <= group.maxSelection,
    error,
    selectedCount,
    minRequired: group.minSelection,
    maxAllowed: group.maxSelection,
  };
};
```

---

### Phase 3: Component Research & UI Design

**Duration**: 1-2 hours | **Can Run Parallel with Phase 2**

#### Subphase 3.1: shadcn Component Research
**Agent**: `shadcn-component-researcher`
**Parallel**: Yes (with 2.1)

**Components to Research**:
- Card (combo group container)
- Dialog/Sheet (customization modal)
- Badge (selected count, validation)
- Button (customize, remove actions)
- Separator (between items)

**Custom UI Pattern** (NO checkbox/radio):
```
+--------------------------------------------------+
| Margherita Pizza .................. [Selected 1] |
|                                     [Customize]  |
+--------------------------------------------------+
| Pepperoni Pizza ................... [+ Add]      |
+--------------------------------------------------+
```

#### Subphase 3.2: UX Flow Design
**Agent**: `premium-ux-designer`
**Parallel**: Yes (with 2.1)

**Selection Flow**:
1. Products displayed as tappable items
2. Tap to toggle selection (if under maxSelection)
3. Selected items show `[Selected X]` badge with selection number
4. If `allowCustomization=true`, show `[Customize]` button
5. If at maxSelection, other items become disabled/dimmed

**Visual States**:
- Unselected: Default style, shows `[+ Add]` or similar
- Selected: Highlighted border/bg, shows `[Selected X]` badge
- Disabled: Dimmed when group at maxSelection
- Customized: Additional indicator showing addon count

---

### Phase 4: Component Implementation

**Duration**: 4-6 hours | **Depends on Phase 2 & 3**

#### Subphase 4.1: ComboGroupsSection Component
**Agent**: `shadcn-implementation-builder`

**File**: `/components/product-details/sections/combo-groups-section.tsx`

```tsx
export function ComboGroupsSection({ className }: ComboGroupsSectionProps) {
  const context = useProductDetailsContext();

  // Only render if product is a combo
  if (!context.productData?.product.isCombo) return null;

  const comboGroups = context.productData.comboGroups ?? [];
  const comboGroupProducts = context.productData.comboGroupProducts ?? [];

  return (
    <div className={cn("space-y-4", className)}>
      {comboGroups.map(group => (
        <ComboGroupCard
          key={group._id}
          group={group}
          products={comboGroupProducts.filter(p => p.comboGroupId === group._id)}
        />
      ))}
    </div>
  );
}
```

#### Subphase 4.2: ComboGroupCard Component
**Agent**: `shadcn-implementation-builder`

**File**: `/components/product-details/cards/combo-group-card.tsx`

**Design**:
```
+------------------------------------------------+
| Choose Your First Pizza              [0/1]     |
| Select your first 9 inch pizza                 |
+------------------------------------------------+
| [!] Select at least 1 item                     |  <- Validation error
+------------------------------------------------+
|  Margherita Pizza ............. [Selected 1]  |
|                                  [Customize]   |
+------------------------------------------------+
|  Pepperoni Pizza .............. [+ Add]       |
+------------------------------------------------+
|  BBQ Chicken Pizza ............ [+ Add]       |
+------------------------------------------------+
```

**Key Features**:
- Header with group label and selection counter `[X/Y]`
- Validation error display
- List of ComboProductItem components

#### Subphase 4.3: ComboProductItem Component
**Agent**: `shadcn-implementation-builder`

**File**: `/components/product-details/selectors/combo-product-item.tsx`

**Key Features**:
- Custom selection UI (NOT checkbox/radio)
- Tappable entire row to toggle selection
- `[Selected X]` badge when selected (X = selection order number)
- `[Customize]` button only when selected AND allowCustomization=true
- Disabled state when group at maxSelection and item not selected

```tsx
interface ComboProductItemProps {
  product: ComboGroupProductResponse;
  groupId: string;
  selectionIndex: number | null;  // null = not selected, 1-based index if selected
  totalSelected: number;
  maxSelection: number;
  allowCustomization: boolean;
}

export function ComboProductItem({
  product,
  groupId,
  selectionIndex,
  totalSelected,
  maxSelection,
  allowCustomization
}: ComboProductItemProps) {
  const context = useProductDetailsContext();
  const isSelected = selectionIndex !== null;
  const isDisabled = !isSelected && totalSelected >= maxSelection;

  const handleToggle = () => {
    if (isDisabled) return;
    context.toggleComboProduct(
      groupId,
      product.productId,
      product._id,
      product.defaultVariantId
    );
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        "flex items-center justify-between p-3 cursor-pointer transition-all",
        isSelected && "bg-primary/5 border-primary",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Left: Product info */}
      <div className="flex items-center gap-3">
        <CustomImage ... />
        <span>{product.product?.name}</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isSelected ? (
          <>
            <Badge>Selected {selectionIndex}</Badge>
            {allowCustomization && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  context.openComboCustomization(groupId, selectionIndex - 1);
                }}
              >
                Customize
              </Button>
            )}
          </>
        ) : (
          <Button size="sm" variant="ghost" disabled={isDisabled}>
            + Add
          </Button>
        )}
      </div>
    </div>
  );
}
```

#### Subphase 4.4: ComboCustomizationDialog
**Agent**: `shadcn-implementation-builder`
**Parallel**: Yes (with 4.2, 4.3)

**File**: `/components/product-details/combo-customization-dialog.tsx`

**Key Behavior**:
- Opens when user clicks "Customize" on a selected combo product
- Fetches product details for that combo item
- Shows ONLY addon groups (NO variant selection - uses defaultVariantId)
- "Apply" saves pricing selections back to combo state

#### Subphase 4.5: Integration with ProductDetailsContent
**Agent**: `nextjs-component-architect`

**File**: `/components/product-details/product-details-content.tsx`

**Modified Logic**:
```tsx
{data.product.isCombo ? (
  // COMBO FLOW - Only show combo groups
  <>
    <ComboGroupsSection />
    <ComboCustomizationDialog
      isOpen={context.activeCustomizationGroup !== null}
      onClose={context.closeComboCustomization}
      groupId={context.activeCustomizationGroup ?? ""}
      selectionIndex={context.activeCustomizationIndex ?? 0}
    />
  </>
) : (
  // REGULAR FLOW - Show variants and addons
  <>
    {hasVariants && <VariantGroupsSection />}
    {hasAddons && <AddonGroupsSection />}
  </>
)}
```

---

### Phase 5: Cart Integration & Validation

**Duration**: 2-3 hours | **Depends on Phase 4**

#### Subphase 5.1: Cart Payload Enhancement
**Agent**: `nextjs-forms-expert`

**Add to Cart Payload for Combos**:
```typescript
if (data.product.isCombo) {
  const payload: AddToCartPayload = {
    itemId: data.product._id,
    categoryId: data.product.category,
    storeId: selectedStore._id,
    sessionId: deviceId,
    pricing: [],  // Empty for combos
    quantity: cartData.quantity,
    isCombo: true,
    comboSelections: Object.entries(cartData.comboSelections).flatMap(
      ([groupId, selections]) =>
        selections.map(selection => ({
          groupId,
          productId: selection.productId,
          pricing: selection.pricing.map(p => ({
            id: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
        }))
    ),
  };
}
```

#### Subphase 5.2: Cart Item Display for Combos
**Agent**: `shadcn-implementation-builder`
**Parallel**: Yes (with 5.1)

**File**: `/components/cart/cart-item-card.tsx`

**Display Format**:
```
2 X 9 Inch Pizzas                    ₹697
  Pizza 1: Margherita (+1 extra)
  Pizza 2: Pepperoni (+1 extra)
```

---

### Phase 6: Polish & Quality Assurance

**Duration**: 2-3 hours | **All Parallel**

#### Subphase 6.1: Responsive Design
**Agent**: `nextjs-responsive-design`
**Parallel**: Yes

- Mobile-first layouts
- Touch-friendly tap targets (min 44px)
- Sheet/Drawer on mobile for customization dialog

#### Subphase 6.2: Accessibility Compliance
**Agent**: `nextjs-accessibility-expert`
**Parallel**: Yes

- Keyboard navigation for custom selection UI
- Screen reader announcements for selection state
- Focus management in customization dialog

#### Subphase 6.3: Animation & Transitions
**Agent**: `nextjs-animation-specialist`
**Parallel**: Yes

- Selection transitions
- Badge entry animations
- Dialog open/close animations

#### Subphase 6.4: Code Review
**Agent**: `nextjs-ui-reviewer`
**Final Step**

- Type safety audit
- Performance review
- Pattern consistency check

---

## Parallel Execution Matrix

| Subphases | Can Run Together | Reason |
|-----------|------------------|--------|
| 3.1 + 3.2 | Yes | Independent research/design |
| 3.1 + 2.1 | Yes | Research doesn't depend on architecture |
| 4.4 + (4.2, 4.3) | Yes | Dialog is separate from cards |
| 5.1 + 5.2 | Yes | Container and display are independent |
| 6.1 + 6.2 + 6.3 | Yes | All polish tasks are independent |

---

## Dependency Graph

```
Phase 1 (Types)
    │
    ▼
Phase 2.1 (Architecture)
    │
    ├────────► Phase 3.1 (Component Research) ◄──┐
    │                                             │ PARALLEL
    ▼                                             │
Phase 2.2 (Context Implementation)          Phase 3.2 (UX Design)
    │                                             │
    └─────────────────┬───────────────────────────┘
                      │
                      ▼
              Phase 4.1 (ComboGroupsSection)
                      │
                      ▼
              Phase 4.2 (ComboGroupCard)
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │ PARALLEL
    ▼                 ▼                 │
Phase 4.3         Phase 4.4             │
(ProductItem)     (Dialog)              │
    │                 │                 │
    └─────────────────┼─────────────────┘
                      │
                      ▼
              Phase 4.5 (Integration)
                      │
    ┌─────────────────┼─────────────────┐
    │                                   │ PARALLEL
    ▼                                   ▼
Phase 5.1 (Cart Payload)         Phase 5.2 (Cart Display)
    │                                   │
    └─────────────────┬─────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │ ALL PARALLEL
    ▼                 ▼                 ▼
Phase 6.1         Phase 6.2         Phase 6.3
(Responsive)      (A11y)            (Animation)
    │                 │                 │
    └─────────────────┼─────────────────┘
                      │
                      ▼
              Phase 6.4 (Code Review)
```

---

## Files to Create/Modify

### New Files
| File | Phase | Description |
|------|-------|-------------|
| `/types/combo.ts` | 1.1 | Type definitions for combo feature |
| `/components/product-details/sections/combo-groups-section.tsx` | 4.1 | Main combo groups container |
| `/components/product-details/cards/combo-group-card.tsx` | 4.2 | Individual combo group card |
| `/components/product-details/selectors/combo-product-item.tsx` | 4.3 | Selectable product item |
| `/components/product-details/combo-customization-dialog.tsx` | 4.4 | Nested customization dialog |

### Modified Files
| File | Phase | Changes |
|------|-------|---------|
| `/contexts/product-details-context.tsx` | 2.2 | Add combo state and actions |
| `/components/product-details/product-details-content.tsx` | 4.5 | Conditional combo/regular flow |
| `/components/product-details/product-details-container.tsx` | 5.1 | Cart payload for combos |
| `/components/cart/cart-item-card.tsx` | 5.2 | Display combo selections |

---

## MCP Tools Available

| MCP Server | Tools | Usage |
|------------|-------|-------|
| shadcn | `search_items`, `view_items`, `get_examples`, `get_add_command` | Component research & installation |
| playwright | `navigate`, `screenshot`, `click`, `evaluate` | E2E testing |
| next-devtools | `nextjs_index`, `nextjs_call`, `browser_eval` | Runtime diagnostics |
| 21st-dev | `magic_component_builder`, `component_inspiration` | UI component generation |
| ref | `search_documentation`, `read_url` | Documentation lookup |
| puppeteer | `navigate`, `screenshot`, `evaluate` | Browser automation |

---

## LSP Operations Available

- `goToDefinition` - Find symbol definitions
- `findReferences` - Find all references
- `hover` - Get type information
- `documentSymbol` - List symbols in file
- `workspaceSymbol` - Search symbols across workspace
- `goToImplementation` - Find implementations
- `incomingCalls` / `outgoingCalls` - Call hierarchy

---

## Quick Start Command

To begin implementation, start with Phase 1.1:

```bash
# Agent: nextjs-component-architect
# Task: Create type definitions in /types/combo.ts
```

---

*Generated: 2025-01-05*
*Feature: Product Combo Integration*
*Status: Ready for Implementation*
