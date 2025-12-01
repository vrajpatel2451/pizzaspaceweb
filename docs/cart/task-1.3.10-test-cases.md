# Task 1.3.10: Test Cases for Empty State

## Manual Testing Guide

### Prerequisites
- Development server running (`npm run dev`)
- Cart with at least one item
- Browser DevTools open

---

## Test Case 1: Network Error - API Unavailable

### Steps
1. Navigate to `/cart` with items in cart
2. Open Browser DevTools → Network tab
3. Right-click on cart summary API call
4. Select "Block request URL"
5. Refresh the page or trigger a summary refetch

### Expected Result
```
✅ Error state displays with:
   - AlertCircle icon in destructive/10 background
   - Heading: "Unable to load summary"
   - Message: "Failed to fetch cart summary" or similar
   - "Try Again" button visible
```

### Visual Verification
- [ ] Error icon is centered
- [ ] Text is readable and centered
- [ ] Button is properly styled
- [ ] Component maintains cart page layout

---

## Test Case 2: Retry Functionality

### Steps
1. Trigger error state (using Test Case 1)
2. Verify error state is displayed
3. Unblock the API request in DevTools
4. Click "Try Again" button

### Expected Result
```
✅ On button click:
   1. Loading skeleton appears
   2. API request is made
   3. Summary loads successfully
   4. Normal summary UI displays
```

### Timing Verification
- [ ] Loading state shows immediately
- [ ] No flickering or layout shift
- [ ] Smooth transition to success state

---

## Test Case 3: Custom Error Message

### Steps
1. Modify API to return custom error message
2. Trigger API call
3. Observe error state

### Expected Result
```
✅ Custom error message displays:
   - API error message shown in <p> tag
   - Message is centered and readable
   - Default fallback NOT shown
```

### Test Error Messages
- "Store is currently unavailable"
- "Invalid delivery address selected"
- "Discount code has expired"
- "Unable to calculate shipping costs"

---

## Test Case 4: Default Error Message

### Steps
1. Ensure API returns null/undefined error
2. Trigger error state
3. Verify default message

### Expected Result
```
✅ Default message displays:
   "We couldn't calculate your order total. Please try again."
```

---

## Test Case 5: No Retry Handler

### Steps
1. Temporarily remove `onRetry` prop from OrderSummary
2. Trigger error state
3. Verify UI behavior

### Expected Result
```
✅ Error state displays WITHOUT retry button:
   - Error icon shows
   - Error message shows
   - "Try Again" button is hidden
```

**Note:** This is an edge case. In production, onRetry should always be provided.

---

## Test Case 6: Mobile Responsiveness (320px)

### Steps
1. Open DevTools → Toggle device toolbar
2. Select iPhone SE or custom 320px width
3. Trigger error state
4. Verify layout

### Expected Result
```
✅ Mobile layout:
   - Error container fits screen
   - Icon is centered (64px size)
   - Text is readable (max-width: 280px)
   - Button is properly sized
   - No horizontal scroll
   - Proper padding (px-6, py-12)
```

### Viewports to Test
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X)
- [ ] 390px (iPhone 12 Pro)
- [ ] 414px (iPhone Plus)

---

## Test Case 7: Tablet Responsiveness (768px)

### Steps
1. Set viewport to 768px width
2. Trigger error state
3. Verify layout

### Expected Result
```
✅ Tablet layout:
   - Same error UI as mobile
   - Proper spacing maintained
   - Button is centered
   - Text is readable
```

---

## Test Case 8: Desktop Responsiveness (1024px+)

### Steps
1. Set viewport to 1024px or larger
2. Trigger error state
3. Verify layout in sticky sidebar

### Expected Result
```
✅ Desktop layout:
   - Error state appears in sidebar
   - Sticky positioning works
   - Error state maintains card width
   - Proper vertical alignment
```

---

## Test Case 9: Loading to Error Transition

### Steps
1. Block API request
2. Navigate to cart page
3. Observe loading → error transition

### Expected Result
```
✅ Smooth transition:
   1. Loading skeleton shows first
   2. Error state replaces skeleton
   3. No layout shift
   4. No flickering
```

---

## Test Case 10: Error to Success Transition

### Steps
1. Display error state
2. Click "Try Again" with API unblocked
3. Observe error → loading → success transition

### Expected Result
```
✅ Smooth state changes:
   1. Error state visible
   2. Click retry → Loading skeleton
   3. Success → Normal summary
   4. No jarring layout changes
```

---

## Test Case 11: Rapid Retry Clicks

### Steps
1. Display error state
2. Rapidly click "Try Again" 5+ times
3. Observe behavior

### Expected Result
```
✅ Graceful handling:
   - Button disabled during loading
   - No duplicate API calls
   - Single loading state shown
   - One final result displayed
```

---

## Test Case 12: Dark Mode

### Steps
1. Enable dark mode in browser/OS
2. Trigger error state
3. Verify colors and contrast

### Expected Result
```
✅ Dark mode styling:
   - Error icon background visible
   - Text is readable (sufficient contrast)
   - Button has proper dark mode styling
   - Destructive color works in dark mode
```

### Color Verification
- [ ] Icon background: destructive/10
- [ ] Icon color: destructive
- [ ] Text color: foreground
- [ ] Message color: muted-foreground
- [ ] Button: outline variant dark

---

## Test Case 13: Accessibility - Keyboard Navigation

### Steps
1. Display error state
2. Use Tab key to navigate
3. Press Enter on "Try Again" button

### Expected Result
```
✅ Keyboard accessible:
   - Button is focusable with Tab
   - Focus indicator visible
   - Enter key triggers retry
   - Focus management proper
```

---

## Test Case 14: Accessibility - Screen Reader

### Steps
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate to error state
3. Listen to announcements

### Expected Result
```
✅ Screen reader friendly:
   - Heading announced properly
   - Error message read aloud
   - Button label clear: "Try Again"
   - Semantic structure preserved
```

---

## Test Case 15: Multiple Error States

### Steps
1. Have multiple carts/tabs open
2. Trigger error on all
3. Retry on each independently

### Expected Result
```
✅ Independent error states:
   - Each instance shows own error
   - Retry affects only that instance
   - No cross-instance interference
```

---

## Performance Testing

### Test Case 16: Error State Render Performance

### Steps
1. Open React DevTools Profiler
2. Trigger error state
3. Measure render time

### Expected Result
```
✅ Performance metrics:
   - Render time < 16ms
   - No unnecessary re-renders
   - No memory leaks
   - Smooth 60fps transition
```

---

## Browser Compatibility

### Test Case 17: Cross-Browser Testing

Test error state in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Chrome Mobile (iOS)
- [ ] Safari Mobile (iOS)

### Expected Result
```
✅ Consistent across browsers:
   - Layout identical
   - Colors consistent
   - Animations smooth
   - Button interactions work
```

---

## Edge Cases

### Test Case 18: Very Long Error Message

### Steps
1. Mock API to return 500+ character error
2. Trigger error state
3. Verify text handling

### Expected Result
```
✅ Long text handling:
   - Text wraps properly
   - max-width: 280px maintained
   - No text overflow
   - Scrollable if needed
   - Layout doesn't break
```

---

### Test Case 19: Empty Error Message

### Steps
1. Mock API to return empty string error
2. Trigger error state
3. Verify default fallback

### Expected Result
```
✅ Fallback works:
   - Default message shows
   - No empty paragraph
   - Layout unaffected
```

---

### Test Case 20: Summary Becomes Null Mid-Session

### Steps
1. Load cart with valid summary
2. Modify store state to set summary to null
3. Observe behavior

### Expected Result
```
✅ Graceful null handling:
   - Error state displays
   - No crash or blank screen
   - Retry button available
   - Can recover from error
```

---

## Regression Testing

### Test Case 21: Normal Summary Still Works

### Steps
1. Ensure API is working
2. Navigate to cart with items
3. Verify normal summary displays

### Expected Result
```
✅ No regression:
   - Summary loads normally
   - All calculations correct
   - Checkout button works
   - No error state shown
```

---

## Automation Test Scenarios (For Future Implementation)

```typescript
describe('OrderSummary - Error State', () => {
  test('shows error when summary is null and not loading', () => {
    // Test implementation
  });

  test('displays custom error message when provided', () => {
    // Test implementation
  });

  test('displays default error message as fallback', () => {
    // Test implementation
  });

  test('calls onRetry when retry button is clicked', () => {
    // Test implementation
  });

  test('hides retry button when onRetry is not provided', () => {
    // Test implementation
  });

  test('maintains responsive layout on mobile', () => {
    // Test implementation
  });
});
```

---

## Test Report Template

```markdown
## Test Execution Report
**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]

### Summary
- Total Test Cases: 21
- Passed: __
- Failed: __
- Blocked: __
- Not Executed: __

### Failed Tests
| Test # | Description | Issue | Priority |
|--------|-------------|-------|----------|
|        |             |       |          |

### Notes
[Additional observations]
```
