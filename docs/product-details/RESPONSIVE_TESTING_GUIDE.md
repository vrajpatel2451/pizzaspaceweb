# Responsive Testing Guide - Product Details

> Quick reference for testing responsive design implementation

## Browser DevTools Testing

### Chrome/Edge DevTools

1. **Open DevTools**: `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. **Toggle Device Toolbar**: `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
3. **Test Viewports**:

```
Mobile Devices:
├── iPhone SE (375×667)
├── iPhone 12 Pro (390×844)
├── iPhone 14 Pro Max (430×932)
├── Samsung Galaxy S20 (360×800)
└── Pixel 5 (393×851)

Tablets:
├── iPad (768×1024)
├── iPad Pro 11" (834×1194)
└── iPad Pro 12.9" (1024×1366)

Desktop:
├── 1280×720
├── 1440×900
└── 1920×1080
```

### Firefox Responsive Design Mode

1. **Open RDM**: `Cmd+Option+M` (Mac) / `Ctrl+Shift+M` (Windows)
2. **Test Breakpoints**: Use the dropdown or drag to resize

### Safari Responsive Design Mode

1. **Enable Developer Menu**: Safari > Preferences > Advanced > "Show Develop menu"
2. **Enter RDM**: Develop > Enter Responsive Design Mode
3. **Test iOS Devices**: Use device presets

---

## Manual Testing Checklist

### Mobile (< 640px)

#### Layout
- [ ] Bottomsheet opens from bottom
- [ ] Product image is 4:3 aspect ratio
- [ ] All content stacked vertically
- [ ] No horizontal scrolling
- [ ] Footer sticks to bottom

#### Touch Targets
- [ ] All buttons minimum 44px high
- [ ] Variant cards minimum 52px high
- [ ] Addon items minimum 52px high
- [ ] Easy to tap without zooming

#### Typography
- [ ] Product name is legible (text-lg)
- [ ] Body text is 14px minimum
- [ ] Price is visible and prominent
- [ ] No text truncation issues

#### Spacing
- [ ] Sections have adequate breathing room
- [ ] Elements don't feel cramped
- [ ] Footer doesn't overlap content
- [ ] Safe area padding visible on iPhone

#### Interactions
- [ ] Tap feedback on cards (scale-down)
- [ ] No hover effects present
- [ ] Smooth scrolling
- [ ] Quantity controls easy to use
- [ ] Add button shows "Add" (short text)

### Tablet (640px - 1023px)

#### Layout
- [ ] Dialog opens centered
- [ ] Product image switches to 16:9
- [ ] Grid layouts start appearing
- [ ] Modal has proper max-width

#### Typography
- [ ] Text sizes increase appropriately
- [ ] Headings more prominent
- [ ] Better line heights

#### Spacing
- [ ] More generous spacing
- [ ] Better use of horizontal space
- [ ] Nutritional grid shows 4 columns

### Desktop (≥ 1024px)

#### Layout
- [ ] Dialog centered with max-w-2xl
- [ ] Grid layouts fully active
- [ ] Variant groups use columns (if 3+ items)
- [ ] Optimal use of space

#### Hover Effects
- [ ] Image zooms on hover
- [ ] Cards lift on hover
- [ ] Visual feedback on hover
- [ ] No hover on touch devices

#### Typography
- [ ] Largest text sizes (text-2xl for headings)
- [ ] Comfortable reading experience
- [ ] Price very prominent

#### Button
- [ ] Shows full "Add to Cart" text
- [ ] Minimum 48px height
- [ ] Proper spacing around it

---

## Breakpoint Testing

### Test at Exact Breakpoints

```bash
# Test these exact widths:
639px  # Just below sm
640px  # sm breakpoint
767px  # Just below md
768px  # md breakpoint
1023px # Just below lg
1024px # lg breakpoint
```

**What to check**:
- [ ] Layout switches correctly
- [ ] No layout "jumps" or shifts
- [ ] Text remains readable
- [ ] No overflow issues
- [ ] Smooth transitions

---

## Safe Area Testing

### iPhone X and Newer (with notch)

1. **Open in iOS Safari** or use Chrome DevTools with iPhone X device
2. **Check top area**: Content doesn't hide behind notch
3. **Check bottom area**: Footer respects home indicator
4. **Landscape mode**: Safe areas on left/right sides

**Visual Check**:
```
┌─────────────────────────────────┐
│     [Notch/Dynamic Island]      │ ← Should have padding
├─────────────────────────────────┤
│                                 │
│         Content Area            │
│                                 │
├─────────────────────────────────┤
│          Footer                 │
│     [Home Indicator]            │ ← Should have padding
└─────────────────────────────────┘
```

---

## Accessibility Testing

### Zoom Testing

1. **Browser Zoom**: Increase to 200%, then 400%
   - [ ] Text remains readable
   - [ ] Layout adapts gracefully
   - [ ] No horizontal scroll (at 200%)
   - [ ] Touch targets still usable

2. **Text Size**: Change browser text size
   - [ ] Relative sizing works
   - [ ] No layout breaks
   - [ ] Minimum 16px respected

### Keyboard Navigation

1. **Tab through all elements**
   - [ ] Logical tab order
   - [ ] Focus indicators visible
   - [ ] No focus traps
   - [ ] Can close modal with Escape

### Touch Testing (Real Device)

1. **Tap accuracy**
   - [ ] First tap always registers
   - [ ] No accidental taps on adjacent items
   - [ ] Double-tap zoom disabled where needed

2. **Gestures**
   - [ ] Swipe to close bottomsheet
   - [ ] Scroll smooth and natural
   - [ ] Pinch-zoom disabled on controls

---

## Performance Testing

### Mobile Performance

1. **Chrome DevTools > Network**
   - [ ] Throttle to "Slow 3G"
   - [ ] Page still usable
   - [ ] Skeleton loading shows
   - [ ] Images load progressively

2. **Chrome DevTools > Performance**
   - [ ] CPU throttled 6x
   - [ ] Animations still smooth
   - [ ] No jank on scroll
   - [ ] Interactions responsive

### Lighthouse Audit

```bash
# Run in Chrome DevTools > Lighthouse
Mobile:
- [ ] Performance: >90
- [ ] Accessibility: 100
- [ ] SEO: >95

Desktop:
- [ ] Performance: >95
- [ ] Accessibility: 100
- [ ] SEO: >95
```

---

## Visual Regression Testing

### Screenshot Comparison Points

Take screenshots at these viewports and compare after changes:

1. **320px** - Smallest phone
2. **375px** - Standard phone
3. **640px** - Breakpoint boundary
4. **768px** - Tablet portrait
5. **1024px** - Laptop
6. **1440px** - Desktop

**States to capture**:
- [ ] Initial load
- [ ] With variants selected
- [ ] With addons selected
- [ ] Validation errors visible
- [ ] Hover states (desktop)
- [ ] Active/pressed states (mobile)

---

## Cross-Browser Testing

### Required Browsers

**Mobile**:
- [ ] iOS Safari (latest)
- [ ] iOS Safari (iOS 14)
- [ ] Chrome Android
- [ ] Samsung Internet

**Desktop**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Known Issues to Check

**iOS Safari**:
- [ ] Safe area insets working
- [ ] 100vh height issues
- [ ] Touch delay removed
- [ ] Tap highlight color removed

**Firefox**:
- [ ] Grid layouts correct
- [ ] Flexbox gaps working
- [ ] env() fallback working

**Safari**:
- [ ] backdrop-filter working
- [ ] Grid auto-fill working
- [ ] Touch manipulation working

---

## Test Scenarios

### Scenario 1: Pizza Order (Mobile)

1. Open product details on 375px width
2. Select size (should be easy to tap)
3. Select crust (should be easy to tap)
4. Add 2 toppings (checkboxes easy to toggle)
5. Increase quantity of one topping
6. Add to cart
7. Verify footer always visible
8. Verify total price updates

**Expected**:
- ✅ All interactions smooth
- ✅ No mis-taps
- ✅ Footer always accessible
- ✅ Price always visible

### Scenario 2: Complex Order (Desktop)

1. Open product details on 1440px width
2. Hover over variant cards (should lift)
3. Hover over image (should zoom)
4. Select multiple variants
5. Add multiple addons
6. Verify grid layouts active
7. Add to cart

**Expected**:
- ✅ Hover effects smooth
- ✅ Grid layouts efficient
- ✅ All content visible without scroll
- ✅ Modal well-sized

### Scenario 3: Landscape Mobile

1. Rotate phone to landscape (812×375)
2. Open product details
3. Verify content fits
4. Check keyboard doesn't hide footer

**Expected**:
- ✅ Layout adapts to landscape
- ✅ No content cut off
- ✅ Footer still accessible

---

## Quick Debug Checklist

### Content Overflow
```css
/* Add to element to debug */
outline: 2px solid red;
```

### Breakpoint Detection
```javascript
// Run in console
console.log(window.matchMedia('(min-width: 640px)').matches ? 'Desktop' : 'Mobile');
```

### Touch Target Visualization
```css
/* Add to test touch targets */
[role="button"],
button,
.variant-card,
.addon-item {
  outline: 2px solid blue;
  min-height: 44px; /* Should be this or more */
}
```

### Safe Area Visualization
```css
/* See safe area insets */
body::after {
  content: 'Top: ' env(safe-area-inset-top) ' Bottom: ' env(safe-area-inset-bottom);
  position: fixed;
  top: 0;
  left: 0;
  background: yellow;
  padding: 10px;
  z-index: 9999;
}
```

---

## Automated Testing Commands

### Playwright Visual Regression

```typescript
// tests/product-details-responsive.spec.ts
test('product details responsive', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/products/123');
  await expect(page).toHaveScreenshot('mobile.png');

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('tablet.png');

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page).toHaveScreenshot('desktop.png');
});
```

### Accessibility Tests

```typescript
// Using axe-core
test('accessibility at all viewports', async ({ page }) => {
  const viewports = [
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const results = await axe.run();
    expect(results.violations).toHaveLength(0);
  }
});
```

---

## Sign-Off Checklist

Before marking responsive implementation as complete:

- [ ] All 11 components tested at mobile width
- [ ] All 11 components tested at tablet width
- [ ] All 11 components tested at desktop width
- [ ] Touch targets verified (minimum 44px)
- [ ] Safe areas tested on real iPhone
- [ ] No horizontal overflow at any size
- [ ] Text readable at all sizes
- [ ] Hover effects desktop-only
- [ ] Active states work on mobile
- [ ] Grid layouts work correctly
- [ ] Lighthouse scores acceptable
- [ ] Cross-browser testing complete
- [ ] Visual regression tests passing
- [ ] Accessibility audit passing

---

**Last Updated**: 2025-12-01
**Status**: ✅ Ready for Testing
