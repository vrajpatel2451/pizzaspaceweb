# Phase 7: Testing Guide

## Mobile Bottomsheet Responsiveness Testing

### Quick Test Checklist

#### 1. Visual Inspection (Mobile Viewport)

Test at these exact widths in Chrome DevTools:

- [ ] **320px** (iPhone SE)
  - Content should be visible
  - No horizontal scrolling
  - Action bar compact but usable

- [ ] **375px** (iPhone 12/13 Mini)
  - All elements properly spaced
  - Text readable
  - Buttons touch-friendly

- [ ] **390px** (iPhone 14 Pro)
  - Standard mobile experience
  - Edge-to-edge content
  - No overflow

- [ ] **430px** (iPhone 14 Pro Max)
  - Spacious but not wasteful
  - All interactions smooth

- [ ] **640px** (sm breakpoint)
  - Transition to desktop spacing
  - Padding appears
  - Comfortable layout

---

#### 2. Functional Testing

##### Open Product Details Modal
1. Navigate to menu section
2. Click any product card
3. Modal should slide up from bottom (mobile) or center dialog (desktop)

##### Verify Spacing
- [ ] No excessive white space around content
- [ ] Content readable without scrolling unnecessarily
- [ ] Action bar visible and accessible
- [ ] No content clipping or overflow

##### Test Interactions
- [ ] Quantity pill: Tap +/- buttons (44px touch target)
- [ ] Add to Cart button: Tap to add (44px height minimum)
- [ ] Variant selection: All options tappable
- [ ] Addon selection: All checkboxes tappable
- [ ] Close button: Easy to tap

##### Test Scrolling
- [ ] Content scrolls smoothly
- [ ] Action bar stays fixed at bottom
- [ ] No bounce/rubber-banding issues
- [ ] Scroll doesn't feel cramped

---

#### 3. Responsive Behavior Testing

##### Rotate Device/Viewport
- [ ] Portrait to landscape: Layout adapts
- [ ] No content hidden off-screen
- [ ] Action bar remains visible

##### Zoom Testing
- [ ] 100% zoom: Standard view works
- [ ] 200% zoom: Text remains readable
- [ ] 400% zoom: No critical elements hidden

##### Font Size Testing (Browser Settings)
- [ ] Increase browser font size to "Large"
- [ ] Text doesn't overflow containers
- [ ] Layout adjusts gracefully

---

#### 4. Cross-Device Testing

##### iOS Devices
- [ ] **iPhone SE (2022)**: 375x667
  - Smallest modern iPhone
  - Compact view working

- [ ] **iPhone 14 Pro**: 390x844
  - Standard size
  - Safe areas respected

- [ ] **iPhone 14 Pro Max**: 430x932
  - Largest iPhone
  - Not too much whitespace

##### Android Devices
- [ ] **Galaxy S21**: 360x800
  - Common Android size
  - Compact layout

- [ ] **Pixel 7**: 412x915
  - Standard Android
  - Edge-to-edge working

---

#### 5. Comparison Testing (Before vs After)

##### Expected Improvements

**Spacing:**
- [ ] Less padding around edges
- [ ] Content goes edge-to-edge
- [ ] Tighter gaps between elements
- [ ] More content visible at once

**Height:**
- [ ] Modal taller (more vertical space)
- [ ] Less wasted space at top
- [ ] Action bar more compact
- [ ] More products/options visible

**Usability:**
- [ ] Buttons still easy to tap (44px+)
- [ ] Text still readable
- [ ] No cramped feeling
- [ ] Professional appearance maintained

---

### Testing Scenarios

#### Scenario 1: Simple Product (No Variants/Addons)
1. Open product details for a simple item
2. Verify layout looks clean
3. Test adding to cart
4. Close modal

**Expected:**
- Minimal content, but still well-spaced
- Action bar prominent
- Image fills width appropriately

---

#### Scenario 2: Complex Product (Multiple Variants + Addons)
1. Open product details for a pizza
2. Scroll through all variant groups
3. Select multiple addons
4. Change quantity
5. Verify total price updates
6. Add to cart

**Expected:**
- All options visible and selectable
- Scrolling smooth
- No content cut off
- Price updates visible in action bar
- No performance issues

---

#### Scenario 3: Error State Testing
1. Open product with required variants
2. Try to add without selecting
3. Verify error messages appear
4. Select required options
5. Error should clear

**Expected:**
- Error messages visible in action bar
- Not obscuring content
- Clear and readable
- Action bar still functional

---

### Browser DevTools Testing

#### Chrome DevTools
```bash
1. Open DevTools (F12)
2. Toggle Device Toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select device or set custom dimensions
4. Test responsive behavior
```

#### Specific Dimensions to Test
```
iPhone SE:       375 x 667  (16:9 ratio)
iPhone 12 Mini:  375 x 812  (19.5:9 ratio)
iPhone 14 Pro:   390 x 844  (19.5:9 ratio)
iPhone 14 Max:   430 x 932  (19.5:9 ratio)
Galaxy S21:      360 x 800  (20:9 ratio)
Pixel 7:         412 x 915  (19.5:9 ratio)
```

---

### Performance Testing

#### Metrics to Monitor
- [ ] Modal opens in < 300ms
- [ ] Animations smooth (60fps)
- [ ] Scrolling responsive
- [ ] No layout shifts (CLS = 0)
- [ ] Touch feedback immediate

#### Chrome DevTools Performance
1. Open Performance tab
2. Record interaction
3. Analyze timeline
4. Check for jank/stutter

---

### Accessibility Testing

#### Screen Reader Testing
- [ ] VoiceOver (iOS): Elements announced correctly
- [ ] TalkBack (Android): Navigation works
- [ ] Content structure logical

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modal
- [ ] Focus visible on all elements

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Buttons have sufficient contrast
- [ ] Error messages visible

---

### Edge Cases

#### 1. Very Long Product Names
- [ ] Text doesn't overflow
- [ ] Truncation working
- [ ] Tooltip shows full name

#### 2. Many Variant Groups (10+)
- [ ] Scrolling works smoothly
- [ ] All groups accessible
- [ ] No performance degradation

#### 3. Many Addons (20+)
- [ ] List scrollable
- [ ] Selection state persists
- [ ] Total calculates correctly

#### 4. Zero Padding Content
- [ ] Images edge-to-edge look good
- [ ] Text not touching screen edges (has min padding in content)
- [ ] Visual hierarchy maintained

#### 5. Safe Area Insets (iPhone Notch)
- [ ] Content not hidden by notch
- [ ] Home indicator area respected
- [ ] Action bar above home indicator

---

### Regression Testing

#### Verify These Still Work
- [ ] Desktop dialog (640px+) still works
- [ ] Tablet view (768px) appropriate
- [ ] Print styles (if any) not broken
- [ ] Dark mode spacing consistent
- [ ] Animations still smooth

---

### Sign-Off Criteria

All checks must pass before considering phase complete:

**Critical (Must Pass)**
- [ ] No horizontal overflow on any mobile device
- [ ] All touch targets ≥ 44px
- [ ] Action bar always visible
- [ ] Content readable without zooming
- [ ] Modal closable on all devices

**Important (Should Pass)**
- [ ] Edge-to-edge design working
- [ ] Spacing feels intentional, not cramped
- [ ] Animations smooth
- [ ] No visual glitches
- [ ] Professional appearance

**Nice to Have (Good to Pass)**
- [ ] Subtle UI polish details
- [ ] Micro-interactions working
- [ ] Loading states smooth
- [ ] Error states clear

---

## Testing Tools

### Recommended Tools
1. **Chrome DevTools**: Device emulation
2. **Firefox Responsive Mode**: Additional testing
3. **BrowserStack**: Real device testing
4. **Lighthouse**: Performance/accessibility audit
5. **Real Devices**: Physical iPhone/Android testing

### Quick Commands
```bash
# Start dev server
npm run dev

# Run linting
npm run lint

# Build for production (test for build errors)
npm run build
```

---

## Issue Reporting Template

If you find issues, report using this format:

```markdown
**Device/Viewport:** iPhone 14 Pro (390x844)
**Browser:** Safari 17.2
**Issue:** Action bar text overflowing

**Steps to Reproduce:**
1. Open product details
2. Select multiple addons
3. Observe action bar button

**Expected:** Text should fit
**Actual:** Text cut off with "..."

**Screenshot:** [attach if possible]
**Priority:** High/Medium/Low
```

---

## Status Indicators

### Test Status Legend
- ✅ **Pass**: Working as expected
- ⚠️ **Minor Issue**: Works but could be better
- ❌ **Fail**: Broken, needs immediate fix
- 🔍 **Not Tested**: Awaiting verification

---

## Conclusion

This phase focused on **mobile-first responsive design** for the product details bottomsheet. All changes prioritize:

1. **Space Efficiency**: Maximizing usable content area
2. **Touch Friendliness**: Meeting accessibility standards
3. **Visual Clarity**: Maintaining professional appearance
4. **Performance**: Smooth interactions and animations
5. **Progressive Enhancement**: Desktop experience uncompromised

The improvements should result in a significantly better mobile experience while maintaining desktop quality.
