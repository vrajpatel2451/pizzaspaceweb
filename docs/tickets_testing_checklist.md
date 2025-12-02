# Order Tickets - Accessibility & Responsive Testing Checklist

## Accessibility Testing (Phase 2.9)

### Screen Reader Testing

#### Image Upload Component
- [ ] File input announces "Upload up to 5 images, maximum 5MB each"
- [ ] Upload label announces drag-and-drop capability
- [ ] Upload progress announces status changes
- [ ] Preview list announces as "Uploaded images list"
- [ ] Each preview announces as "Preview of [filename]"
- [ ] Remove buttons announce "Remove [filename]"

#### Ticket Card
- [ ] Time element announces "Created [relative time]"
- [ ] Status badge announces "Ticket status: In Progress/Resolved"
- [ ] Expand button announces "Show more/less of message"
- [ ] Expanded state properly announces via aria-expanded
- [ ] Attachment count announces "[count] image attachment(s)"
- [ ] Icons are hidden from screen readers (aria-hidden)

#### Create Dialog
- [ ] Trigger button announces "Create a new support ticket"
- [ ] Form label announces "Describe your issue (required)"
- [ ] Required indicator properly communicated to screen readers
- [ ] Form errors are announced
- [ ] Success state is announced

#### Ticket Grid
- [ ] Grid announces as "Support tickets list"
- [ ] Each ticket announces as list item
- [ ] Loading state announces "Loading tickets"
- [ ] Empty state has proper heading structure

### Keyboard Navigation

#### Image Upload
- [ ] Can tab to file input
- [ ] Can activate file picker with Enter/Space
- [ ] Can tab through preview images
- [ ] Can focus and activate remove buttons
- [ ] Remove button visible on keyboard focus
- [ ] No keyboard traps

#### Ticket Card
- [ ] Can tab to expand/collapse button
- [ ] Can activate with Enter/Space
- [ ] Focus visible on all interactive elements
- [ ] Tab order is logical

#### Create Dialog
- [ ] Dialog opens on button activation
- [ ] Focus moves to dialog on open
- [ ] Can tab through all form fields
- [ ] Can close with Escape key
- [ ] Focus returns to trigger on close
- [ ] Can submit with Enter in form

#### Grid Navigation
- [ ] Logical tab order through tickets
- [ ] No keyboard traps
- [ ] All interactive elements reachable

### Visual Testing

#### Focus Indicators
- [ ] File input shows focus ring
- [ ] Remove buttons show focus ring
- [ ] Expand buttons show focus ring
- [ ] All buttons show visible focus
- [ ] Focus indicators meet 3:1 contrast ratio

#### Color Contrast
- [ ] All text meets 4.5:1 ratio (normal text)
- [ ] Large text meets 3:1 ratio
- [ ] Status badges meet contrast requirements
- [ ] Error messages are readable
- [ ] Placeholder text is readable

#### Text Sizing
- [ ] Text readable at 200% zoom
- [ ] No text truncation at 200% zoom
- [ ] Layout doesn't break at 200% zoom
- [ ] Can complete all tasks at 200% zoom

### Motion Testing

#### Reduced Motion
- [ ] `prefers-reduced-motion` disables animations
- [ ] Grid animations respect preference
- [ ] Card animations respect preference
- [ ] Upload animations respect preference
- [ ] No vestibular triggers when reduced motion enabled

---

## Responsive Design Testing (Phase 2.10)

### Mobile Testing (320px - 639px)

#### Image Upload
- [ ] Upload area has adequate padding (py-8)
- [ ] Preview grid shows 2 columns
- [ ] Preview gap is 8px
- [ ] Remove buttons are 44x44px minimum
- [ ] Touch targets don't overlap
- [ ] File input is easily tappable

#### Ticket Card
- [ ] Card padding is 12px (p-3)
- [ ] Header items don't wrap poorly
- [ ] Status badge doesn't overflow
- [ ] Timestamp remains visible
- [ ] Message text wraps properly
- [ ] Expand button is easily tappable

#### Create Dialog
- [ ] Dialog fits on screen
- [ ] Content is scrollable
- [ ] Footer buttons stack vertically
- [ ] Buttons are full width
- [ ] Form fields are usable
- [ ] Touch targets are adequate

#### Grid Layout
- [ ] Shows 1 column
- [ ] Gap is 12px
- [ ] Cards don't overlap
- [ ] Pagination is usable

#### Header
- [ ] Title and button stack vertically
- [ ] Title is 20px (text-xl)
- [ ] Button is full width
- [ ] Gap is 16px
- [ ] Overall spacing is 24px

### Tablet Testing (640px - 1023px)

#### Image Upload
- [ ] Upload area padding increases (py-10)
- [ ] Preview grid shows 3 columns
- [ ] Preview gap is 12px
- [ ] Remove buttons are 32x32px
- [ ] Layout is balanced

#### Ticket Card
- [ ] Card padding is 16px (p-4)
- [ ] Header layout is comfortable
- [ ] Status badge has more padding
- [ ] All content is readable

#### Create Dialog
- [ ] Dialog is centered
- [ ] Max width is 600px
- [ ] Footer buttons are horizontal
- [ ] Buttons are auto width
- [ ] Layout is comfortable

#### Grid Layout
- [ ] Shows 2 columns
- [ ] Gap is 16px
- [ ] Cards are balanced

#### Header
- [ ] Title and button are horizontal
- [ ] Title is 24px (text-2xl)
- [ ] Button is auto width
- [ ] Items are center-aligned

### Desktop Testing (1024px+)

#### Image Upload
- [ ] Upload area is spacious
- [ ] Preview grid shows 3 columns
- [ ] Preview gap is 12px
- [ ] Hover states work properly
- [ ] Layout is optimal

#### Ticket Card
- [ ] Card padding is 20px (p-5)
- [ ] All elements are well-spaced
- [ ] Hover effects are smooth
- [ ] Glow effects appear on hover

#### Create Dialog
- [ ] Dialog is centered
- [ ] Content is comfortable to read
- [ ] Form fields are appropriate size
- [ ] Footer buttons are horizontal

#### Grid Layout
- [ ] Shows 3 columns
- [ ] Gap is 16px
- [ ] Cards are balanced
- [ ] Hover effects work

#### Header
- [ ] Layout is optimal
- [ ] Button doesn't shrink
- [ ] Spacing is 32px

### Touch Target Testing

#### All Interactive Elements
- [ ] Upload area: Easy to tap
- [ ] Remove buttons: 44x44px on mobile
- [ ] Expand buttons: Adequate size
- [ ] Dialog trigger: Adequate size
- [ ] Form inputs: Easy to focus
- [ ] Submit button: Easy to tap
- [ ] Pagination buttons: Easy to tap

### Edge Cases

#### Long Content
- [ ] Long ticket messages wrap properly
- [ ] Long filenames don't overflow
- [ ] Status text doesn't break layout

#### Small Screens (320px)
- [ ] All content is accessible
- [ ] No horizontal scrolling
- [ ] All buttons are tappable
- [ ] Text is readable

#### Large Screens (1920px+)
- [ ] Layout doesn't stretch awkwardly
- [ ] Content is centered appropriately
- [ ] Cards maintain reasonable width

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

## Device Testing

### Mobile Devices
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] Pixel 5 (393px)

### Tablets
- [ ] iPad (768px)
- [ ] iPad Air (820px)
- [ ] iPad Pro 11" (834px)
- [ ] iPad Pro 12.9" (1024px)

### Desktop
- [ ] 1366x768 (common laptop)
- [ ] 1920x1080 (full HD)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)

---

## Automated Testing

### Tools to Use
- [ ] axe DevTools browser extension
- [ ] Lighthouse accessibility audit (score 90+)
- [ ] WAVE browser extension
- [ ] Pa11y CI (if integrated)

### Expected Results
- [ ] No WCAG AA violations
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] No color contrast issues
- [ ] Proper heading structure

---

## Performance Testing

### Metrics
- [ ] No layout shift when loading
- [ ] Animations are smooth (60fps)
- [ ] Touch response is immediate (<100ms)
- [ ] No jank when scrolling

---

## Sign-off

**Accessibility Lead:** _________________ Date: _______
**QA Engineer:** _________________ Date: _______
**Product Owner:** _________________ Date: _______

---

## Issues Found

| Issue | Severity | Component | Status |
|-------|----------|-----------|--------|
|       |          |           |        |
|       |          |           |        |
|       |          |           |        |

**Severity Levels:**
- Critical: Blocks core functionality
- High: Significantly impacts user experience
- Medium: Minor impact, workaround available
- Low: Cosmetic issue
