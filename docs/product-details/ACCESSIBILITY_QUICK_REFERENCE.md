# Accessibility Quick Reference Guide

Quick reference for maintaining accessibility in the Product Details feature.

---

## Common Patterns to Follow

### 1. ARIA Live Regions for Dynamic Content

**When to use:** Content updates without page reload (prices, counters, status)

```tsx
// Polite (non-urgent updates like prices)
<div role="status" aria-live="polite" aria-atomic="true">
  <span className="sr-only">Total price: </span>
  {formatPrice(price)}
</div>

// Assertive (urgent updates like errors)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>
```

### 2. Button States

**When to use:** Buttons with loading/success states

```tsx
<Button
  disabled={isDisabled}
  aria-busy={isLoading}
  aria-disabled={isDisabled}
  aria-label={
    isLoading ? "Adding to cart" :
    isSuccess ? "Added successfully" :
    "Add to cart"
  }
>
  {buttonText}
</Button>
```

### 3. Form Groups

**When to use:** Radio groups, checkbox groups, related form fields

```tsx
// Radio Group
<RadioGroup
  aria-label="Select size"
  aria-labelledby="size-heading"
  aria-required={true}
>
  <h3 id="size-heading">
    Size <span className="sr-only">required</span>
  </h3>
</RadioGroup>

// Checkbox Group
<div role="group" aria-labelledby="toppings-heading">
  <h3 id="toppings-heading">Extra Toppings</h3>
  {/* checkboxes */}
</div>
```

### 4. Required Field Indication

**When to use:** All required form fields

```tsx
<label>
  Email
  <span aria-hidden="true" className="text-red-500">*</span>
  <span className="sr-only">required</span>
</label>
```

### 5. Dialog/Modal Accessibility

**When to use:** All dialogs, modals, drawers

```tsx
<Dialog>
  <DialogContent aria-describedby="dialog-description">
    <DialogTitle id="dialog-title">
      Product Details
    </DialogTitle>
    <p id="dialog-description" className="sr-only">
      Description of what user can do in this dialog
    </p>
  </DialogContent>
</Dialog>
```

### 6. Touch Targets

**Minimum sizes:**
- **44x44px** for WCAG AAA compliance
- **48x48px** recommended for better UX

```tsx
// Using Tailwind
<button className="min-h-[44px] min-w-[44px]">
  Click me
</button>
```

### 7. Reduced Motion

**When to use:** All animations with Framer Motion

```tsx
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

const variants = shouldReduceMotion
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    };
```

---

## Screen Reader Only Content

Use `.sr-only` class for content visible only to screen readers:

```tsx
<span className="sr-only">Additional context for screen readers</span>
```

CSS implementation:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Testing Checklist

### Before Committing:

- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus visible on all elements
- [ ] Dynamic content has aria-live
- [ ] Buttons have proper aria-labels
- [ ] Form fields have labels
- [ ] Required fields indicated
- [ ] Touch targets 44px+
- [ ] Reduced motion respected

### Quick Keyboard Test:

1. Tab through entire flow
2. Shift+Tab backwards
3. Enter/Space on buttons
4. Escape to close modals
5. Arrow keys in radio groups

### Quick Screen Reader Test (VoiceOver):

1. Cmd+F5 to enable VoiceOver
2. Navigate with VO+Arrow keys
3. Listen to all announcements
4. Verify form labels
5. Check dynamic updates
6. Cmd+F5 to disable

---

## Common Issues to Avoid

### ❌ Don't Do This:

```tsx
// Missing label
<button onClick={handleClick}>
  <Icon />
</button>

// Visual-only required indicator
<label>Email *</label>

// No live region for dynamic content
<span>{price}</span>

// Relying only on color
<div className="text-red-500">Error</div>

// Missing button state
<button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

### ✅ Do This Instead:

```tsx
// Proper label
<button onClick={handleClick} aria-label="Close dialog">
  <Icon />
</button>

// Screen reader accessible required
<label>
  Email
  <span aria-hidden="true">*</span>
  <span className="sr-only">required</span>
</label>

// Live region for updates
<div role="status" aria-live="polite">
  <span className="sr-only">Price: </span>
  {price}
</div>

// Multiple indicators
<div role="alert" className="text-red-500">
  <span className="sr-only">Error: </span>
  Error message
</div>

// Proper loading state
<button
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label={isLoading ? "Loading" : "Submit"}
>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

---

## Tools & Resources

### Browser Extensions:
- axe DevTools (Chrome/Firefox)
- WAVE (Chrome/Firefox/Edge)
- Lighthouse (Chrome DevTools)

### Screen Readers:
- VoiceOver (Mac) - Built-in, Cmd+F5
- NVDA (Windows) - Free download
- JAWS (Windows) - Commercial

### Testing:
```bash
npm install -D @axe-core/react jest-axe
```

### Documentation:
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

---

## Key Takeaways

1. **Think about screen reader users** - Not everyone can see visual changes
2. **Keyboard navigation is essential** - Many users can't use a mouse
3. **Dynamic content needs announcements** - Use aria-live regions
4. **Button states must be communicated** - Not just visually
5. **Required fields must be marked** - Both visually and semantically
6. **Touch targets matter** - 44x44px minimum
7. **Respect user preferences** - Reduced motion, high contrast
8. **Test with real assistive technology** - Don't just assume it works

---

**Remember:** Accessibility is not a feature, it's a requirement. Build it in from the start, not as an afterthought.
