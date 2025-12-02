# Accessibility Checklist - Quick Reference

Use this checklist when implementing or reviewing new features in the Order Review system.

## Pre-Implementation Checklist

- [ ] Review WCAG 2.1 AA requirements for your feature type
- [ ] Plan semantic HTML structure before coding
- [ ] Identify all interactive elements that need labels
- [ ] Determine if animations need motion preference support

---

## Component Development Checklist

### ✅ Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and predictable
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals/dialogs
- [ ] Arrow keys work for navigation where appropriate
- [ ] No keyboard traps (can tab out of all sections)
- [ ] Skip links provided for long content

### ✅ Screen Reader Support

- [ ] All images have alt text (or alt="" for decorative)
- [ ] All form inputs have associated labels
- [ ] ARIA labels on custom controls
- [ ] Decorative elements have aria-hidden="true"
- [ ] Live regions for dynamic content updates
- [ ] Status messages announced with aria-live
- [ ] Error messages linked with aria-describedby

### ✅ Visual Design

- [ ] Text has 4.5:1 contrast ratio (AA standard)
- [ ] Large text has 3:1 contrast ratio
- [ ] Focus indicators visible and obvious
- [ ] Information not conveyed by color alone
- [ ] Content readable at 200% zoom
- [ ] Interactive elements at least 44x44px (mobile)

### ✅ Animations & Motion

- [ ] Animations respect prefers-reduced-motion
- [ ] No auto-playing videos with sound
- [ ] No flashing content (seizure risk)
- [ ] Animations can be paused/stopped

---

## Code Patterns

### ✅ Forms

```tsx
// Good: Proper label association
<FormLabel htmlFor="email">Email</FormLabel>
<input id="email" type="email" />

// Good: Error announcement
<input aria-describedby="email-error" aria-invalid={hasError} />
{hasError && <p id="email-error" role="alert">{error}</p>}

// Good: Required field
<FormLabel>
  Email
  <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</FormLabel>
```

### ✅ Buttons

```tsx
// Good: Icon button with label
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Good: Loading state
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 aria-hidden="true" />
      Loading...
    </>
  ) : "Submit"}
</button>
```

### ✅ Live Regions

```tsx
// Good: Polite announcement (non-urgent)
<div role="status" aria-live="polite">
  {successMessage}
</div>

// Good: Assertive announcement (urgent)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### ✅ Animations

```tsx
// Good: Respects motion preference
<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: 0.3,
    ...(window.matchMedia("(prefers-reduced-motion: reduce)").matches && {
      duration: 0
    })
  }}
/>
```

---

## Testing Checklist

### Manual Testing

- [ ] Navigate entire flow using only keyboard
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Zoom to 200% and verify layout
- [ ] Enable high contrast mode
- [ ] Test with reduced motion enabled
- [ ] Test with different font sizes

### Browser DevTools

- [ ] Run Lighthouse accessibility audit (aim for 90+)
- [ ] Check color contrast ratios
- [ ] Verify focus order with keyboard navigation
- [ ] Inspect ARIA attributes in Elements panel

### Screen Reader Commands (VoiceOver)

```
Cmd+F5          - Toggle VoiceOver
VO+Right/Left   - Navigate elements
VO+Space        - Activate element
VO+A            - Read all
VO+U            - Open rotor
Ctrl            - Stop speaking
```

---

## Common Mistakes to Avoid

### ❌ Bad Practices

```tsx
// BAD: Div as button
<div onClick={handleClick}>Click me</div>

// BAD: Placeholder as label
<input placeholder="Enter email" />

// BAD: Empty alt text on meaningful image
<img src="logo.png" alt="" />

// BAD: Color-only indicator
<span className="text-red-500">Error</span>

// BAD: Icon without label
<button onClick={close}>
  <X />
</button>
```

### ✅ Good Practices

```tsx
// GOOD: Proper button
<button onClick={handleClick}>Click me</button>

// GOOD: Label + placeholder
<label htmlFor="email">Email</label>
<input id="email" placeholder="you@example.com" />

// GOOD: Descriptive alt text
<img src="logo.png" alt="Company Name Logo" />

// GOOD: Text + icon indicator
<span className="text-red-500" role="alert">
  <AlertIcon aria-hidden="true" />
  Error: Invalid input
</span>

// GOOD: Icon button with label
<button onClick={close} aria-label="Close">
  <X aria-hidden="true" />
</button>
```

---

## Quick ARIA Reference

### Common ARIA Roles

| Role | Use Case |
|------|----------|
| `button` | Interactive element that triggers action |
| `link` | Navigation element |
| `alert` | Important, time-sensitive message |
| `status` | Live region for status updates |
| `dialog` | Modal window |
| `navigation` | Navigation landmark |
| `main` | Main content area |
| `complementary` | Supporting content (sidebar) |
| `search` | Search form landmark |

### Common ARIA Attributes

| Attribute | Use Case |
|-----------|----------|
| `aria-label` | Provides label when visible label not present |
| `aria-labelledby` | References ID of element that labels this one |
| `aria-describedby` | References ID of element that describes this one |
| `aria-hidden` | Hides element from assistive technology |
| `aria-live` | Marks region for live updates (polite/assertive) |
| `aria-invalid` | Indicates validation error |
| `aria-required` | Indicates required field |
| `aria-disabled` | Indicates disabled state |
| `aria-pressed` | Indicates toggle button state |
| `aria-expanded` | Indicates collapsed/expanded state |

### Common ARIA States

| State | Use Case |
|-------|----------|
| `aria-busy="true"` | Element is loading/updating |
| `aria-disabled="true"` | Element is disabled but visible |
| `aria-hidden="true"` | Element is hidden from screen readers |
| `aria-invalid="true"` | Field has validation error |
| `aria-pressed="true"` | Toggle button is pressed |
| `aria-expanded="true"` | Collapsible element is expanded |
| `aria-selected="true"` | Tab or option is selected |

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (macOS/iOS)
- [NVDA](https://www.nvaccess.org/) (Windows, free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, paid)

---

## Component-Specific Notes

### Rating Component
- Use `role="group"` for interactive ratings
- Provide clear labels: "Rate from 1 to 5 stars"
- Announce current rating: "Current rating: 3.5 stars"
- Use `aria-pressed` on star buttons

### Dialog/Modal
- Use Radix UI or similar for proper focus management
- Dialog should have `role="dialog"` and `aria-modal="true"`
- Title should be referenced with `aria-labelledby`
- Escape key should close dialog
- Focus should return to trigger on close

### Tabs
- Use Radix UI or similar for proper keyboard nav
- Arrow keys should navigate between tabs
- Tab panels should have `role="tabpanel"`
- Selected tab should have `aria-selected="true"`

---

## When in Doubt

**Remember the Core Principles:**

1. **Perceivable** - Can all users perceive the content?
2. **Operable** - Can all users operate the interface?
3. **Understandable** - Can all users understand the content?
4. **Robust** - Does it work with assistive technologies?

**Test with:**
- Keyboard only (no mouse)
- Screen reader
- Zoom at 200%
- Reduced motion enabled

**Ask yourself:**
- Can I complete this task without seeing the screen?
- Can I complete this task without using a mouse?
- Is every piece of information accessible in multiple ways?
- Would this make sense to someone using assistive technology?
