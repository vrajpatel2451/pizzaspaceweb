# Testing Guide: Menu Filter Loading States

## How to Test the Implementation

### Prerequisites
1. Start the development server: `npm run dev`
2. Navigate to the menu page: `http://localhost:3000/menu`
3. Open browser DevTools (optional, to throttle network)

### Desktop Testing

#### Test 1: Category Selection
1. Click on any category in the left sidebar
2. **Expected behavior:**
   - Category accordion item highlights immediately
   - Product grid shows semi-transparent overlay with spinner
   - "Loading products..." text appears
   - All category/subcategory buttons are disabled (60% opacity)
   - "Clear Filters" button is disabled
   - After data loads, overlay disappears
   - New products render smoothly

#### Test 2: Subcategory Selection
1. Expand a category by clicking it
2. Click on any subcategory
3. **Expected behavior:**
   - Same loading behavior as category selection
   - Subcategory button highlights
   - Product grid overlay appears
   - All filter buttons disabled during transition

#### Test 3: Clear Filters
1. Select a category or subcategory
2. Click "Clear Filters" button
3. **Expected behavior:**
   - Button becomes disabled during transition
   - Product grid overlay appears
   - All products load
   - Filters reset to default state

### Mobile Testing

#### Test 4: Mobile Filter Sheet
1. Resize browser to mobile width (< 768px) or use mobile device
2. Click the floating filter button (bottom-right)
3. Select a category or subcategory
4. **Expected behavior:**
   - Filter selections work same as desktop
   - "Clear All" and "Apply Filters" buttons disable during loading
   - Loading overlay appears on product grid
   - Sheet can be closed during loading

#### Test 5: Mobile Filter Application
1. Open mobile filter sheet
2. Select multiple filters
3. Click "Apply Filters"
4. **Expected behavior:**
   - Sheet closes
   - Product grid shows loading overlay
   - New filtered products appear

### Accessibility Testing

#### Test 6: Keyboard Navigation
1. Use Tab key to navigate through filters
2. Press Enter or Space to select filters
3. **Expected behavior:**
   - Loading states trigger on keyboard interaction
   - Focus management remains intact
   - Disabled buttons skip in tab order

#### Test 7: Screen Reader
1. Enable screen reader (VoiceOver, NVDA, etc.)
2. Navigate through filters
3. **Expected behavior:**
   - `aria-busy="true"` announced during loading
   - Disabled buttons announced as disabled
   - Loading overlay not announced (aria-hidden)

### Performance Testing

#### Test 8: Slow Network Simulation
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Select different filters rapidly
4. **Expected behavior:**
   - Loading overlay persists until data loads
   - No duplicate requests sent
   - Smooth transitions between states
   - UI remains responsive

#### Test 9: Fast Network
1. Set throttling to "No throttling"
2. Click through filters quickly
3. **Expected behavior:**
   - Loading states may flash briefly (this is normal)
   - No visual glitches
   - Smooth animations throughout

### Edge Cases

#### Test 10: Rapid Filter Changes
1. Click multiple categories/subcategories in quick succession
2. **Expected behavior:**
   - Loading state persists until final selection loads
   - No race conditions
   - Correct products display for last selection

#### Test 11: Empty Results
1. Select a filter that returns no products
2. **Expected behavior:**
   - Loading overlay appears
   - Empty state message shows after loading
   - "Clear Filters" button still works

#### Test 12: Browser Back/Forward
1. Select a filter
2. Use browser back button
3. **Expected behavior:**
   - Loading state may briefly appear
   - Previous filter state restores correctly
   - Products update to match URL

### Visual Regression Testing

#### Test 13: Dark Mode
1. Toggle to dark mode (if available)
2. Test all filter interactions
3. **Expected behavior:**
   - Loading overlay visible with proper contrast
   - Spinner colors appropriate for dark theme
   - Disabled states visible

#### Test 14: Different Viewport Sizes
1. Test at breakpoints: 320px, 768px, 1024px, 1440px
2. **Expected behavior:**
   - Loading overlay scales properly
   - Spinner remains centered
   - Text remains legible
   - Button states clear at all sizes

## Known Behaviors

### Normal Behaviors (Not Bugs)
1. **Brief Flash**: On fast networks, loading state may flash for <100ms - this is expected
2. **Loading Persistence**: Loading state persists until server responds - duration varies
3. **Multiple Loads**: Clicking filters rapidly triggers multiple transitions - expected behavior
4. **Sheet Behavior**: Mobile filter sheet can be closed during loading - intentional

### What to Report as Bugs
1. Loading state never clears (stuck loading)
2. Buttons remain disabled after loading completes
3. Overlay doesn't appear on filter selection
4. TypeScript errors in console
5. Layout breaks during loading state
6. Accessibility issues (missing aria attributes)

## Performance Metrics

### Expected Timings (Fast Network)
- Loading overlay appearance: < 50ms
- Typical filter transition: 100-500ms
- Network request: 200-1000ms (varies by data size)
- Loading overlay removal: < 50ms

### Signs of Performance Issues
- Loading takes > 3 seconds consistently
- UI freezes during transitions
- Memory leaks (increasing memory usage)
- Console errors or warnings

## Debugging Tips

### Check Loading State
```javascript
// In browser console, on menu page:
// React DevTools → Find MenuPageClient component
// Check: isPending state value
// Should toggle: false → true → false during transitions
```

### Network Inspection
```
1. DevTools → Network tab
2. Filter for "menu" or "products" requests
3. Verify requests complete successfully
4. Check response times
```

### Console Logging
All components use proper error boundaries. Check console for:
- React warnings (should be none)
- Network errors (check API status)
- TypeScript errors (should be none)

## Checklist

- [ ] Desktop category selection loads correctly
- [ ] Desktop subcategory selection loads correctly
- [ ] Desktop clear filters works
- [ ] Mobile filter sheet works
- [ ] Mobile filter application works
- [ ] Keyboard navigation works
- [ ] Screen reader announces states
- [ ] Slow network handled gracefully
- [ ] Fast network doesn't break
- [ ] Rapid clicks handled properly
- [ ] Empty results show correctly
- [ ] Browser navigation works
- [ ] Dark mode looks good
- [ ] All viewport sizes work
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Performance acceptable

## Support

For issues or questions about this implementation:
1. Check the implementation summary document
2. Review the code comments in modified files
3. Test with network throttling enabled
4. Check browser console for errors
