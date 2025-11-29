# Accessibility Guidelines for PizzaSpace Developers

Quick reference guide for maintaining accessibility standards in the PizzaSpace codebase.

---

## Quick Checklist

Before submitting a PR, ensure:

- [ ] All images have descriptive alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Forms have proper labels
- [ ] ARIA attributes are used correctly
- [ ] Touch targets are at least 44x44px
- [ ] Decorative elements have aria-hidden="true"
- [ ] Dynamic content has aria-live regions
- [ ] Motion respects prefers-reduced-motion

---

## Common Patterns

### 1. Form Inputs

**Always include labels:**

```tsx
// ✅ GOOD
<label htmlFor="email" className="block text-sm font-medium">
  Email
  <span className="sr-only">(required)</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-describedby="email-hint"
/>
<p id="email-hint" className="text-sm text-gray-500">
  We'll never share your email.
</p>

// ❌ BAD
<input type="email" placeholder="Email" />
```

---

### 2. Buttons

**Always provide accessible labels:**

```tsx
// ✅ GOOD - Icon button with label
<button
  onClick={handleClose}
  className="..."
  aria-label="Close dialog"
>
  <X className="size-5" aria-hidden="true" />
</button>

// ❌ BAD - No label
<button onClick={handleClose}>
  <X className="size-5" />
</button>
```

---

### 3. Images

**Provide meaningful alt text:**

```tsx
// ✅ GOOD
<Image
  src={product.image}
  alt={`${product.name} - ${product.category}`}
  fill
/>

// ✅ GOOD - Decorative
<Image
  src="/decorative-pattern.svg"
  alt=""
  role="presentation"
  fill
/>

// ❌ BAD
<Image src={product.image} alt="product" fill />
```

---

### 4. Modal Dialogs

**Proper ARIA and focus management:**

```tsx
// ✅ GOOD
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  ref={modalRef}
  tabIndex={-1}
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
>
  <h2 id="modal-title">{title}</h2>
  {children}
  <button onClick={onClose}>Close</button>
</div>

// Implement focus trap (see mobile-nav-drawer.tsx)
```

---

### 5. Live Regions

**Announce dynamic content:**

```tsx
// ✅ GOOD - Status messages
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>

// ✅ GOOD - Errors
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

### 6. Navigation Tabs

**Proper tablist pattern:**

```tsx
// ✅ GOOD
<div role="tablist" aria-label="Menu categories">
  <button
    role="tab"
    aria-selected={activeTab === 0}
    aria-controls="panel-0"
    id="tab-0"
    tabIndex={activeTab === 0 ? 0 : -1}
    onKeyDown={handleKeyDown} // Arrow keys
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  id="panel-0"
  aria-labelledby="tab-0"
  tabIndex={0}
>
  Panel content
</div>
```

---

### 7. Carousels

**Accessible carousel controls:**

```tsx
// ✅ GOOD
<div
  className="carousel"
  aria-roledescription="carousel"
  aria-label="Customer testimonials"
>
  {/* Slides */}
  <div
    role="group"
    aria-roledescription="slide"
    aria-label={`${index + 1} of ${total}`}
    aria-hidden={index !== current}
  >
    {content}
  </div>

  {/* Controls */}
  <button aria-label="Previous slide">
    <ChevronLeft aria-hidden="true" />
  </button>
  <button aria-label="Play/Pause" aria-pressed={isPlaying}>
    {isPlaying ? <Pause /> : <Play />}
  </button>
</div>
```

---

### 8. Touch Targets

**Ensure minimum 44x44px:**

```tsx
// ✅ GOOD
<button className="min-w-[44px] min-h-[44px] touch-manipulation">
  <Icon className="size-5" />
</button>

// ❌ BAD
<button className="w-6 h-6">
  <Icon />
</button>
```

---

### 9. Disclosure Widgets

**Expandable sections:**

```tsx
// ✅ GOOD
<button
  onClick={toggle}
  aria-expanded={isOpen}
  aria-controls="content-id"
>
  Toggle Section
  <ChevronDown aria-hidden="true" />
</button>
<div id="content-id" hidden={!isOpen}>
  Content
</div>
```

---

### 10. Loading States

**Announce to screen readers:**

```tsx
// ✅ GOOD
{isLoading && (
  <div role="status" aria-live="polite" className="sr-only">
    Loading content, please wait
  </div>
)}

// Visual spinner
<div aria-hidden="true">
  <Spinner />
</div>
```

---

## ARIA Attributes Quick Reference

### Common ARIA Roles
- `role="button"` - Clickable element
- `role="dialog"` - Modal dialog
- `role="alert"` - Important message
- `role="status"` - Status update
- `role="tablist"` - Tab container
- `role="tab"` - Individual tab
- `role="tabpanel"` - Tab content
- `role="img"` - Image replacement

### Common ARIA States
- `aria-label` - Accessible name
- `aria-labelledby` - Points to labeling element
- `aria-describedby` - Points to description
- `aria-expanded` - Expansion state
- `aria-selected` - Selection state
- `aria-pressed` - Toggle button state
- `aria-hidden` - Hide from screen readers
- `aria-live` - Announce changes (polite/assertive)
- `aria-atomic` - Announce entire region
- `aria-current` - Current item in set

---

## Screen Reader Only Text

**Use sr-only class for context:**

```tsx
// Tailwind sr-only class
<span className="sr-only">Rating:</span>
<StarRating value={4.5} />

// Or custom CSS
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

## Keyboard Navigation

### Required Key Bindings

| Context | Keys | Action |
|---------|------|--------|
| Tabs | Arrow Left/Right | Navigate tabs |
| Tabs | Home/End | First/Last tab |
| Dialog | Escape | Close dialog |
| Dropdown | Arrow Up/Down | Navigate options |
| Carousel | Arrow Left/Right | Previous/Next |
| All | Tab | Next element |
| All | Shift+Tab | Previous element |

---

## Color Contrast

### Minimum Ratios (WCAG AA)

- **Normal text (< 18pt):** 4.5:1
- **Large text (≥ 18pt or bold 14pt):** 3:1
- **UI components:** 3:1
- **Graphical objects:** 3:1

### Check Contrast
Use browser DevTools or https://webaim.org/resources/contrastchecker/

---

## Motion & Animation

**Always respect user preferences:**

```css
/* In your CSS/Tailwind */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// In React components
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { y: 20 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
>
  Content
</motion.div>
```

---

## Testing Tools

### Automated
- **axe DevTools** - Browser extension
- **Lighthouse** - Chrome DevTools
- **WAVE** - Browser extension
- **eslint-plugin-jsx-a11y** - Linting

### Manual
- **Keyboard testing** - Tab through entire page
- **Screen reader** - VoiceOver (Mac), NVDA (Windows)
- **Zoom test** - 200% zoom, check usability
- **Color blindness** - Use browser filters

---

## Common Mistakes to Avoid

### ❌ Don't:
1. Use div/span as buttons without role="button"
2. Use onClick without onKeyDown for custom elements
3. Skip labels on form inputs
4. Use color alone to convey information
5. Hide focus indicators
6. Use placeholder as label replacement
7. Create keyboard traps
8. Auto-play media without controls
9. Use very small touch targets (< 44px)
10. Forget to test with keyboard and screen readers

### ✅ Do:
1. Use semantic HTML (button, nav, main, header)
2. Provide text alternatives for non-text content
3. Ensure sufficient color contrast
4. Make all functionality keyboard accessible
5. Test with actual assistive technologies
6. Keep focus order logical
7. Provide skip navigation links
8. Label all form controls
9. Use ARIA when semantic HTML isn't enough
10. Respect user preferences (motion, contrast)

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

### Testing
- [Screen Reader Guide](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Accessibility](https://webaim.org/articles/keyboard/)

---

## Questions?

Refer to the full audit report: `ACCESSIBILITY_AUDIT_REPORT.md`

For issues or questions, consult:
1. WCAG 2.1 guidelines
2. Team accessibility champion
3. Community resources (WebAIM, A11y Project)

**Remember:** Accessibility is not optional. It's a fundamental requirement for all users.
