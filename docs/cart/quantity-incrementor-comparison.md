# QuantityControl vs QuantityIncrementor Comparison

## Visual Structure Comparison

### QuantityControl (Custom Component)
```
┌──────────────────────────┐
│  [-]  [qty]  [+]         │  ← All buttons use ghost variant
└──────────────────────────┘
```

Features:
- Simple display-only quantity in center
- Both buttons use same ghost variant
- Loading spinner on active button
- Border around entire container

### QuantityIncrementor (Standard Component)
```
┌──────────────────────────┐
│  [-]  [input]  [+]       │  ← Plus button has primary color
└──────────────────────────┘
```

Features:
- **Editable input field** in center (not just display)
- Minus button: ghost variant
- Plus button: **primary variant** (stands out)
- Direct numeric input with validation
- Border around entire container

## Code Comparison

### Before (QuantityControl)
```tsx
<QuantityControl
  quantity={item.quantity}
  onQuantityChange={handleQuantityChange}
  className="h-9"
/>
```

**Handler (in QuantityControl)**:
```tsx
const handleIncrease = async () => {
  if (quantity >= max || isUpdating || disabled) return;

  setIsUpdating(true);
  try {
    await onQuantityChange(quantity + 1);
  } finally {
    setIsUpdating(false);
  }
};
```

### After (QuantityIncrementor)
```tsx
<QuantityIncrementor
  value={item.quantity}
  onChange={handleQuantityChange}
  min={1}
  max={99}
  size="sm"
  disabled={isUpdatingQuantity}
/>
```

**Handler (in CartItemCard)**:
```tsx
const handleQuantityChange = async (newQuantity: number) => {
  setIsUpdatingQuantity(true);
  try {
    await onQuantityChange(item._id, newQuantity);
  } catch (error) {
    console.error("Failed to update quantity:", error);
  } finally {
    setIsUpdatingQuantity(false);
  }
};
```

## Key Differences

### 1. Prop Names
| Feature | QuantityControl | QuantityIncrementor |
|---------|----------------|---------------------|
| Current value | `quantity` | `value` |
| Change handler | `onQuantityChange` | `onChange` |
| Styling | `className` | `size` prop |

### 2. User Interaction
| Feature | QuantityControl | QuantityIncrementor |
|---------|----------------|---------------------|
| Manual input | ❌ No (display only) | ✅ Yes (editable input) |
| Increment | ✅ Yes | ✅ Yes |
| Decrement | ✅ Yes | ✅ Yes |
| Keyboard input | ❌ No | ✅ Yes (numeric only) |
| Paste values | ❌ No | ✅ Yes (validated) |

### 3. Visual Feedback
| Feature | QuantityControl | QuantityIncrementor |
|---------|----------------|---------------------|
| Loading state | On button | On parent (disabled) |
| Active button | Loading spinner | Primary color on + |
| Disabled state | Opacity + cursor | Opacity + cursor |
| Focus state | Button focus ring | Input + button rings |

### 4. Async Handling
| Feature | QuantityControl | QuantityIncrementor |
|---------|----------------|---------------------|
| Loading state | Internal (`isUpdating`) | External (`disabled` prop) |
| Error handling | None (prop callback) | Parent component handles |
| Optimistic UI | No (waits for async) | No (waits via disabled) |

### 5. Size Options
| Size | QuantityControl | QuantityIncrementor |
|------|----------------|---------------------|
| Height | Via `className` | Via `size` prop |
| Options | Any (className) | sm, default, lg |
| Current | `h-9` custom | `sm` (h-8) |

## Advantages of QuantityIncrementor

### 1. Better User Experience
- **Direct input**: Users can type quantity directly instead of clicking multiple times
- **Visual hierarchy**: Primary colored + button indicates "add more"
- **Consistent with product details**: Same component used across app

### 2. Accessibility
- **Proper input semantics**: Screen readers recognize as numeric input
- **ARIA labels**: "Increase quantity", "Decrease quantity"
- **Keyboard navigation**: Tab, arrow keys, numeric input

### 3. Standardization
- **Reusable component**: Used in product details, cart, etc.
- **Predictable behavior**: Same UX everywhere
- **Centralized updates**: Bug fixes benefit all usages

### 4. Better Validation
- **Input mode**: Shows numeric keyboard on mobile
- **Pattern matching**: Ensures only numbers entered
- **Min/max enforcement**: Automatic clamping on input

## Why Keep QuantityControl?

The `QuantityControl` component is still valuable for specific use cases:

### Use Case: Edit Cart Item Modal Addons
```tsx
{isSelected && group.allowMulti && (
  <QuantityControl
    quantity={addonQuantity}
    onQuantityChange={(newQty) =>
      handleAddonQuantityChange(addonPricing._id, newQty)
    }
    min={1}
    max={group.max}
    className="h-8"
  />
)}
```

**Why not QuantityIncrementor here?**
1. **Synchronous updates**: Modal manages local state before save
2. **Space constraints**: Shown inline with checkboxes
3. **Less frequent changes**: Addons rarely need bulk changes
4. **Visual simplicity**: Matches checkbox/label style better

## Migration Path

### Immediate (Completed)
- ✅ Cart item card quantity control

### Future Considerations
1. **Edit Modal Main Quantity**: Could migrate to QuantityIncrementor
2. **Edit Modal Addon Quantities**: Keep QuantityControl (better fit)
3. **Mini Cart**: Use QuantityIncrementor when implemented
4. **Quick Add**: Already using separate QuickAddButton

## Recommendation

**Keep both components**:
- **QuantityIncrementor**: Primary quantity selectors (cart, product details)
- **QuantityControl**: Inline/compact scenarios (modal addons)

Each serves a distinct purpose and UX context.
