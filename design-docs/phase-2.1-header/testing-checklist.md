# Header Component Testing Checklist

## Visual Testing

### Desktop (≥ 768px)
- [ ] Logo displays correctly with pizza icon and text
- [ ] Logo is clickable and links to homepage
- [ ] All 5 navigation links are visible: Home, About, Stores, Menu, Contact Us
- [ ] Navigation links have white text
- [ ] Current page is highlighted in orange
- [ ] Navigation links turn orange on hover
- [ ] All 4 action icons are visible: Location, Search, Cart, User
- [ ] Icons are white and turn orange on hover
- [ ] Cart badge displays with correct item count
- [ ] Cart badge shows "99+" for counts over 99
- [ ] Hamburger menu is hidden
- [ ] Header has dark navy background (#1E293B)
- [ ] Header is sticky at the top
- [ ] Header has subtle shadow for depth

### Mobile (< 768px)
- [ ] Logo displays correctly
- [ ] Desktop navigation is hidden
- [ ] Location pin icon is hidden
- [ ] Search, Cart, and Hamburger icons are visible
- [ ] User icon is hidden
- [ ] Hamburger menu icon is visible
- [ ] Cart badge still displays correctly
- [ ] Layout is compact and fits screen width

### Tablet (768px - 1024px)
- [ ] Layout scales smoothly between mobile and desktop
- [ ] All desktop features are visible
- [ ] No horizontal scrolling

## Interaction Testing

### Navigation Links
- [ ] Clicking Home navigates to "/"
- [ ] Clicking About navigates to "/about"
- [ ] Clicking Stores navigates to "/stores"
- [ ] Clicking Menu navigates to "/menu"
- [ ] Clicking Contact Us navigates to "/contact"
- [ ] Active page remains highlighted after navigation
- [ ] Browser back/forward buttons work correctly

### Action Icons
- [ ] Clicking Location icon navigates to "/stores"
- [ ] Clicking Search icon logs to console (placeholder)
- [ ] Clicking Cart icon navigates to "/cart"
- [ ] Clicking User icon navigates to "/account"
- [ ] All icon buttons have proper hover states

### Mobile Menu
- [ ] Clicking hamburger icon opens drawer from right
- [ ] Drawer slides in smoothly
- [ ] Background overlay appears
- [ ] Drawer title shows "Menu"
- [ ] Close button (X) is visible in drawer header
- [ ] All 5 main navigation links appear in drawer
- [ ] Separator line appears between sections
- [ ] "Account" section header displays
- [ ] All 5 account links appear: Order History, Address Management, Profile, Coupons, Sign Out
- [ ] Clicking any link closes the drawer
- [ ] Clicking overlay closes the drawer
- [ ] Clicking X button closes the drawer
- [ ] Pressing ESC key closes the drawer
- [ ] Active page is highlighted in drawer
- [ ] Drawer links turn orange on hover

### Cart Badge
- [ ] Badge displays when itemCount > 0
- [ ] Badge doesn't display when itemCount = 0
- [ ] Badge shows correct number
- [ ] Badge shows "99+" when count > 99
- [ ] Badge has orange background
- [ ] Badge has white text
- [ ] Badge is positioned correctly on cart icon

## Accessibility Testing

### Keyboard Navigation
- [ ] All links are focusable with Tab key
- [ ] All icon buttons are focusable with Tab key
- [ ] Focus indicator is visible
- [ ] Enter/Space activates focused elements
- [ ] ESC key closes mobile drawer
- [ ] Tab order is logical (left to right)

### Screen Reader
- [ ] Header has proper role="banner"
- [ ] Navigation has aria-label="Main navigation"
- [ ] Logo has aria-label="Pizza Space Home"
- [ ] All icon buttons have descriptive aria-labels
- [ ] Cart badge aria-label includes item count
- [ ] Active links have aria-current="page"
- [ ] Drawer has proper ARIA attributes
- [ ] Cart badge updates announce with aria-live="polite"

### Color Contrast
- [ ] White text on navy background passes WCAG AA (4.5:1)
- [ ] Orange text on navy background passes WCAG AA
- [ ] Orange badge text has sufficient contrast
- [ ] All hover states maintain contrast

### Visual Focus Indicators
- [ ] Focus ring appears on all interactive elements
- [ ] Focus ring color is visible against background
- [ ] Focus ring is 2px wide

## Responsive Testing

### Breakpoint Transitions
- [ ] Smooth transition at 768px (md) breakpoint
- [ ] No layout shifts or jumps
- [ ] No horizontal scrolling at any width
- [ ] Content remains centered in container
- [ ] Adequate spacing maintained at all widths

### Test Widths
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13/14)
- [ ] 390px (iPhone 14 Pro)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1280px (Small laptop)
- [ ] 1440px (Desktop)
- [ ] 1920px (Large desktop)

## Performance Testing

### Load Time
- [ ] Header renders quickly on initial page load
- [ ] No layout shift during hydration
- [ ] Icons load from Lucide without delay
- [ ] Drawer opens/closes smoothly (300ms transition)

### Interactions
- [ ] Hover effects are smooth
- [ ] No lag when opening mobile menu
- [ ] Navigation is instant with Next.js Link
- [ ] Active state updates immediately

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

## State Testing

### Navigation States
- [ ] Home page active state
- [ ] About page active state
- [ ] Stores page active state
- [ ] Menu page active state
- [ ] Contact page active state
- [ ] Non-navigation page (no active state)

### Cart States
- [ ] Cart with 0 items (no badge)
- [ ] Cart with 1 item
- [ ] Cart with 10 items
- [ ] Cart with 99 items
- [ ] Cart with 100+ items (shows "99+")

### Drawer States
- [ ] Drawer closed (initial)
- [ ] Drawer opening animation
- [ ] Drawer fully open
- [ ] Drawer closing animation
- [ ] Drawer with active page highlighted

## Edge Cases

### Long Content
- [ ] Very long page title doesn't break layout
- [ ] Page with sticky elements doesn't conflict
- [ ] Rapid navigation doesn't cause issues

### User Interactions
- [ ] Clicking hamburger multiple times quickly
- [ ] Opening drawer then immediately closing
- [ ] Clicking links rapidly
- [ ] Resizing window with drawer open
- [ ] Scrolling with drawer open (body locked)

### JavaScript Disabled
- [ ] Logo link still works
- [ ] Navigation links still work
- [ ] Mobile menu doesn't appear (no JS)
- [ ] Layout remains functional

## Integration Testing

### With Layout
- [ ] Header works in root layout
- [ ] Header displays on all pages
- [ ] Header doesn't interfere with page content
- [ ] Sticky positioning works with scrollable content

### With Routing
- [ ] Works with Next.js App Router
- [ ] Active states update on route change
- [ ] Drawer closes on navigation
- [ ] Browser history works correctly

## Code Quality

### TypeScript
- [ ] No TypeScript errors
- [ ] All components have proper types
- [ ] Props are correctly typed
- [ ] No `any` types used

### Linting
- [ ] No ESLint errors
- [ ] No ESLint warnings
- [ ] Code follows project style guide

### Best Practices
- [ ] Server/Client components used appropriately
- [ ] "use client" directive only where needed
- [ ] Proper React hooks usage
- [ ] No prop drilling
- [ ] Clean component structure

## Documentation

- [ ] Implementation guide is complete
- [ ] Usage examples are clear
- [ ] API documentation is accurate
- [ ] Customization instructions provided
- [ ] Troubleshooting section helpful

## Sign-off

- [ ] All visual tests pass
- [ ] All interaction tests pass
- [ ] All accessibility tests pass
- [ ] All responsive tests pass
- [ ] All browser tests pass
- [ ] Code quality checks pass
- [ ] Documentation is complete

**Tested by:** _________________
**Date:** _________________
**Version:** Phase 2.1
**Status:** ☐ Pass ☐ Fail ☐ Needs Revision
