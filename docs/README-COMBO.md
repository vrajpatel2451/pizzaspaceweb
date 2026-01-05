# Combo Product Documentation Index

**Complete documentation for implementing combo products in the PizzaSpace application**

---

## Overview

This documentation suite provides a complete architecture and implementation guide for adding combo product support to the existing `ProductDetailsContext`. Combo products allow customers to select multiple items from predefined groups (e.g., "2 X 9 Inch Pizzas" deals) with optional customization for each selected item.

---

## Documentation Structure

### 1. [Combo Context Architecture](./combo-context-architecture.md) 📐
**Comprehensive technical specification**

The main architecture document with complete technical details:
- State shape diagrams
- Action flow diagrams
- Price calculation logic
- Validation rules
- Component specifications
- TypeScript interfaces
- Usage examples
- Implementation checklist

**Read this for**: Deep technical understanding of the entire architecture.

---

### 2. [Integration Summary](./combo-integration-summary.md) 🔗
**High-level integration overview**

Quick summary of how combo products integrate with existing code:
- Key design decisions
- State structure comparison
- Context extensions required
- Conditional rendering patterns
- API integration format
- Validation rules
- Component integration patterns

**Read this for**: Understanding how combo fits into the existing codebase.

---

### 3. [Component Hierarchy](./combo-component-hierarchy.md) 🌳
**Visual component structure**

Detailed component architecture and relationships:
- Visual component tree
- Responsibility matrix
- Data flow diagrams
- State dependencies
- Event flow patterns
- File structure
- Memoization strategy
- Testing approach

**Read this for**: Understanding component organization and data flow.

---

### 4. [Quick Reference Guide](./combo-quick-reference.md) ⚡
**Developer quick lookup**

Fast reference for common patterns and APIs:
- Context API reference
- Common usage patterns
- Component examples
- Code snippets
- Common mistakes to avoid
- Debugging tips
- Type reference
- Constants reference
- Troubleshooting guide

**Read this for**: Quick lookups while coding.

---

### 5. [Implementation Guide](./combo-implementation-guide.md) 🛠️
**Step-by-step implementation**

Detailed implementation walkthrough with code examples:
- Phase 1: Context extensions
- Phase 2: Component creation
- Phase 3: UI integration
- Phase 4: Testing
- Phase 5: Cart integration
- Phase 6: Polish & optimization
- Checkpoints for each step
- Troubleshooting common issues

**Read this for**: Actually implementing the feature step by step.

---

## Quick Start

### For Architects/Tech Leads

1. Start with [Combo Context Architecture](./combo-context-architecture.md)
2. Review [Integration Summary](./combo-integration-summary.md)
3. Check [Component Hierarchy](./combo-component-hierarchy.md)
4. Plan implementation phases

### For Developers

1. Read [Quick Reference Guide](./combo-quick-reference.md)
2. Follow [Implementation Guide](./combo-implementation-guide.md)
3. Refer to [Combo Context Architecture](./combo-context-architecture.md) for details
4. Use [Quick Reference](./combo-quick-reference.md) while coding

### For Code Reviewers

1. Review [Combo Context Architecture](./combo-context-architecture.md)
2. Check [Integration Summary](./combo-integration-summary.md)
3. Verify implementation against [Implementation Guide](./combo-implementation-guide.md)

---

## Key Files

### Type Definitions
- `/types/combo.ts` - All combo type definitions (already created)
- `/types/product.ts` - Product types including ComboGroupResponse
- `/types/cart.ts` - Cart types including PricingIdsAndQuantity

### Context
- `/contexts/product-details-context.tsx` - Existing context to extend

### Components (to be created)
- `/components/product/combo/ComboGroupsSection.tsx`
- `/components/product/combo/ComboGroupCard.tsx`
- `/components/product/combo/ComboProductItem.tsx`
- `/components/product/combo/ComboCustomizationDialog.tsx`
- `/components/product/combo/index.ts`

---

## Architecture Overview

### State Management

```typescript
// Regular Product State
{
  selectedVariantId: "var_123",
  selectedPricingIds: [...]
}

// Combo Product State
{
  comboSelections: {
    "group_pizza_1": [
      {
        productId: "prod_margherita",
        comboGroupProductId: "cgp_123",
        variantId: "var_9inch",
        pricing: [...],
        customized: true
      }
    ]
  }
}
```

### Component Flow

```
ProductDetailsProvider
  ├─ ProductDetailsContent
  │  ├─ [if isCombo]
  │  │  └─ ComboGroupsSection
  │  │     ├─ ComboGroupCard (per group)
  │  │     │  └─ ComboProductItem (per product)
  │  │     └─ ComboCustomizationDialog
  │  │
  │  └─ [else]
  │     ├─ VariantGroupsSection
  │     └─ AddonGroupsSection
  │
  ├─ QuantitySelector
  ├─ PriceDisplay (conditional: comboTotalPrice vs totalPrice)
  └─ AddToCartButton (conditional: isComboValid vs isValid)
```

### Price Calculation

```
Regular Product:
  Total = (variant.price + addons) × quantity

Combo Product:
  Total = (product.basePrice + allComboItemAddons) × quantity
```

---

## Feature Highlights

### Multi-Selection Support
- Each combo group can require min/max selections
- Example: "Choose 2-3 items" from a group
- Selection order tracked and displayed (1, 2, 3...)

### Nested Customization
- Each selected combo item can be customized individually
- Full addon selection UI in a dialog
- Pricing calculated per item and aggregated

### Validation
- Per-group validation (min/max requirements)
- Overall combo validation (all groups valid)
- Clear error messages per group

### Pricing
- Base combo price is fixed
- Only addons contribute to price increase
- Variants are pre-selected (no variant pricing for combos)
- Total = base + all addon prices from all selected items

---

## Implementation Phases

### Phase 1: Context Extensions (2-3 hours)
- Add combo state variables
- Implement combo actions
- Add computed values
- Update context interface

### Phase 2: Component Creation (3-4 hours)
- Create ComboGroupsSection
- Create ComboGroupCard
- Create ComboProductItem
- Create ComboCustomizationDialog

### Phase 3: UI Integration (1-2 hours)
- Update price display
- Update add to cart button
- Add conditional rendering
- Test basic flows

### Phase 4: Testing (2-3 hours)
- Manual testing
- Edge case testing
- Browser testing
- Fix bugs

### Phase 5: Cart Integration (1-2 hours)
- Update cart API format
- Transform combo selections
- Handle cart display
- Test end-to-end

### Phase 6: Polish (1-2 hours)
- Add loading states
- Add error handling
- Add animations
- Optimize performance

**Total Estimated Time**: 10-16 hours

---

## Key Design Decisions

### 1. Conditional State Management
- Combo and regular products use different state
- Never mix `selectedVariantId` with `comboSelections`
- Context switches behavior based on `product.isCombo`

### 2. Nested Product Details Provider
- Customization dialog uses a nested `ProductDetailsProvider`
- Isolates addon selection state per combo item
- Allows reusing existing addon UI components

### 3. Array-Based Selection Order
- Selection order matters for UI display
- Array index determines selection number (1, 2, 3...)
- Removal shifts subsequent items down

### 4. On-Demand Data Fetching
- Full product details fetched only when "Customize" is clicked
- Avoids loading all selectable products upfront
- Improves initial page load performance

### 5. Price Structure
- Variants are FREE for combo items (defaultVariantId is just for reference)
- Only addons contribute to price
- Base combo price includes all base products

---

## Testing Strategy

### Unit Tests
- Context actions (toggleComboProduct, openComboCustomization, etc.)
- Validation functions (getComboGroupValidation, isComboValid)
- Price calculations (comboTotalPrice)
- Helper functions (transformComboSelectionsToAPI)

### Integration Tests
- Component interactions (selection, customization, removal)
- Dialog workflows (open, customize, save, close)
- Validation flows (incomplete → complete combo)
- Price updates (base → with addons)

### E2E Tests
- Complete user journey (open → select → customize → add to cart)
- Multiple combo groups
- Edge cases (min/max limits, validation errors)
- Cart integration

---

## API Changes

### Product Details API
**No changes required** - Existing API already returns `comboGroups` and `comboGroupProducts` when `product.isCombo === true`.

### Cart API
**Change required** - Must accept new combo format:

```typescript
// New format for combo products
{
  productId: "combo_123",
  variantId: "",
  pricing: [],
  quantity: 1,
  totalPrice: 2100,
  isCombo: true,
  comboSelections: [
    {
      groupId: "group_pizza_1",
      productId: "prod_margherita",
      pricing: [...]
    }
  ]
}
```

---

## Migration Checklist

- [ ] Review all documentation
- [ ] Plan implementation phases
- [ ] Set up development branch
- [ ] Implement context extensions
- [ ] Create combo components
- [ ] Integrate with UI
- [ ] Update cart API
- [ ] Test all flows
- [ ] Fix bugs
- [ ] Code review
- [ ] QA testing
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Success Criteria

- [ ] Combo products load correctly
- [ ] Can select products in combo groups
- [ ] Selection numbers display correctly (1, 2, 3...)
- [ ] Validation shows appropriate errors
- [ ] Price updates correctly with selections
- [ ] Customization dialog opens and works
- [ ] Addon selections save correctly
- [ ] "Customized" badge appears
- [ ] Add to cart disabled when invalid
- [ ] Add to cart sends correct format
- [ ] Cart displays combo items correctly
- [ ] No regressions in regular product flow
- [ ] Performance is acceptable
- [ ] Works on all browsers
- [ ] Mobile responsive

---

## Support & Questions

### Getting Started
1. Read the [Implementation Guide](./combo-implementation-guide.md)
2. Follow the step-by-step instructions
3. Use [Quick Reference](./combo-quick-reference.md) for lookups
4. Refer to [Architecture](./combo-context-architecture.md) for details

### During Implementation
- Use the checkpoints in each phase
- Test after each major step
- Refer to troubleshooting sections
- Check type definitions in `/types/combo.ts`

### Common Questions

**Q: Do I need to modify the Product API?**
A: No, the API already returns combo data when `isCombo === true`.

**Q: Can I reuse existing addon components?**
A: Yes! The customization dialog uses a nested ProductDetailsProvider, so all existing addon UI works as-is.

**Q: How do I handle pricing for combo items?**
A: Only addons contribute to price. Variants are pre-selected (defaultVariantId) and don't add cost.

**Q: What if validation fails?**
A: Show per-group error messages and disable the add to cart button until all groups are valid.

**Q: How do I test this?**
A: Follow the testing checklist in Phase 4 of the Implementation Guide.

---

## Related Documentation

- [Type Definitions](/types/combo.ts) - All combo types
- [Existing Context](/contexts/product-details-context.tsx) - Context to extend
- [Product Types](/types/product.ts) - Product and combo group types
- [Cart Types](/types/cart.ts) - Pricing and cart types

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-05 | Initial documentation created |

---

## Contributors

- Architecture designed by: nextjs-component-architect
- Based on requirements from: /types/combo.ts
- Integrates with: /contexts/product-details-context.tsx

---

**For the latest updates to this documentation, check the git history of this directory.**

---

## Quick Links

- 📐 [Full Architecture](./combo-context-architecture.md)
- 🔗 [Integration Summary](./combo-integration-summary.md)
- 🌳 [Component Hierarchy](./combo-component-hierarchy.md)
- ⚡ [Quick Reference](./combo-quick-reference.md)
- 🛠️ [Implementation Guide](./combo-implementation-guide.md)

---

**Ready to implement? Start with the [Implementation Guide](./combo-implementation-guide.md)!**
