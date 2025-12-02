# Order Review System - Implementation Guide

**Phase 1.3 Preparation & Execution Guide**

---

## Before You Start

### Prerequisites Checklist
- [ ] Read RESEARCH-SUMMARY.md (5 min)
- [ ] Read component-quick-reference.md (10 min)
- [ ] Next.js 16+ running locally
- [ ] npm or yarn package manager
- [ ] Existing Rating component at `components/composite/rating.tsx`

### Environment Verification
```bash
# Verify you're in the right directory
pwd
# Should output: /Users/vrajpatel/Documents/personal/pizzaspace_web

# Check Node version
node --version
# Should be v18+

# Check npm/yarn
npm --version
```

---

## Step 1: Install shadcn Components (5 minutes)

### Execute Installation Command

```bash
cd /Users/vrajpatel/Documents/personal/pizzaspace_web

npx shadcn@latest add @shadcn/dialog @shadcn/form @shadcn/textarea @shadcn/input @shadcn/tabs @shadcn/button @shadcn/scroll-area @shadcn/card @shadcn/badge @shadcn/alert @shadcn/label
```

### Verify Installation

After installation completes, verify components exist:

```bash
# Check components/ui/ directory
ls components/ui/ | grep -E "^(dialog|form|tabs|button|alert|badge|scroll-area|card|label|textarea|input)"

# Should see:
# alert.tsx
# badge.tsx
# button.tsx
# card.tsx
# dialog.tsx
# form.tsx
# input.tsx
# label.tsx
# scroll-area.tsx
# tabs.tsx
# textarea.tsx
```

If all files appear, installation is successful!

---

## Step 2: Create Directory Structure (5 minutes)

### Create Review Feature Directory

```bash
mkdir -p components/features/review/{sections,items,states}
```

### Verify Structure

```bash
tree components/features/review/
# Should show empty directories ready for files
```

---

## Step 3: Create Core Components (30-40 minutes)

### 3.1 ReviewDialog.tsx (Main Container)

**File:** `components/features/review/ReviewDialog.tsx`

Copy the complete `ReviewDialog` component from:
`docs/review/component-code-templates.md` → Complete Review Dialog Component section

**Key points:**
- Contains Dialog + Tabs + Form
- Manages open/close state
- Handles submission
- Shows success/error states

### 3.2 ReviewForm.tsx (Optional Wrapper)

**File:** `components/features/review/ReviewForm.tsx`

Copy from:
`docs/review/component-code-templates.md` → Review Form with Validation section

**Note:** This is optional if you use ReviewDialog directly

### 3.3 Section Components (20-30 minutes)

Create 3 files in `components/features/review/sections/`:

**OverallReviewSection.tsx**
- Copy from templates
- Handles order rating + review
- Uses RatingField and ReviewTextarea

**RiderReviewSection.tsx**
- Copy from templates  
- Handles delivery rating + review
- Same pattern as Overall

**ItemsReviewSection.tsx**
- Copy from templates
- Handles item list with individual ratings
- Uses ScrollArea for long lists

---

## Step 4: Create Reusable Field Components (15-20 minutes)

Create 2 files in `components/features/review/items/`:

**RatingField.tsx**
- Wrapper around your Rating component
- Integrates with react-hook-form
- Displays label + description + errors

**ReviewTextarea.tsx**
- Form field for review text
- Character counter
- Validation feedback

---

## Step 5: Create Feedback State Components (10-15 minutes)

Create 2 files in `components/features/review/states/`:

**SuccessState.tsx**
- Shows success message
- Provides close button
- Displayed after successful submission

**ErrorState.tsx**
- Shows error message
- Provides retry button
- Handles submission failures

---

## Step 6: Add Types (5-10 minutes)

### Update/Create types/review.ts

```typescript
export interface ReviewData {
  orderId: string
  overallRating: number
  overallReview?: string
  riderRating?: number
  riderReview?: string
  itemReviews?: ItemReview[]
}

export interface ItemReview {
  itemId: string
  rating: number
  review?: string
}

export interface OrderItem {
  id: string
  name: string
  image: string
}
```

---

## Step 7: Update API Integration (10-15 minutes)

### Verify/Update lib/api/orderReview.ts

Should have endpoint to handle:
```typescript
POST /api/reviews
Body: {
  orderId: string
  overallRating: number
  overallReview?: string
  riderRating?: number
  riderReview?: string
  itemReviews?: ItemReview[]
}
```

### Example API Implementation

```typescript
// lib/api/orderReview.ts
export async function submitReview(data: ReviewData) {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error(await response.text())
  }
  
  return response.json()
}
```

---

## Step 8: Integration in Order Details (10-15 minutes)

### Example: Adding ReviewDialog to Order Page

**File:** `app/orders/[orderId]/page.tsx`

```tsx
import { ReviewDialog } from '@/components/features/review/ReviewDialog'

export default function OrderPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId)
  
  return (
    <div>
      {/* Order details */}
      
      <ReviewDialog
        orderId={order.id}
        orderItems={order.items}
        onSuccess={() => {
          // Refresh page or show notification
          window.location.reload()
        }}
      />
    </div>
  )
}
```

---

## Step 9: Testing (20-30 minutes)

### Manual Testing Checklist

**Dialog Behavior:**
- [ ] Dialog opens when button clicked
- [ ] Dialog closes when Cancel button clicked
- [ ] Dialog closes when close button (X) clicked
- [ ] Escape key closes dialog

**Form Validation:**
- [ ] Can't submit without rating
- [ ] Review text min 10 chars enforced
- [ ] Review text max 500 chars enforced
- [ ] Character counter updates
- [ ] Error messages appear

**Tab Navigation:**
- [ ] Can click each tab
- [ ] Data persists when switching tabs
- [ ] All tabs have required fields

**Submission:**
- [ ] Submit button shows loading state
- [ ] API receives correct data
- [ ] Success message shows on success
- [ ] Error message shows on failure
- [ ] Dialog closes after success

**Mobile:**
- [ ] Dialog responsive on mobile
- [ ] Tabs stack or work with scroll
- [ ] Touch targets large enough
- [ ] Text readable

### Keyboard Navigation Testing

```bash
# Test keyboard navigation:
# 1. Tab through all form fields
# 2. Shift+Tab goes backward
# 3. Arrow keys switch tabs
# 4. Enter submits form
# 5. Escape closes dialog
```

### Browser DevTools Testing

```javascript
// Test form validation in console:
// 1. Open form
// 2. Try submitting empty
// 3. Check error messages in DOM
// 4. Test character limit
// 5. Test tab switching
```

---

## Step 10: Accessibility Audit (10-15 minutes)

### Accessibility Checklist

- [ ] All inputs have associated labels
- [ ] Error messages linked to fields (aria-invalid)
- [ ] Dialog has proper ARIA attributes
- [ ] Focus visible on all interactive elements
- [ ] Color not only indicator (use icons + text)
- [ ] Touch targets >= 44px
- [ ] Text contrast passes WCAG AA
- [ ] Keyboard navigation works completely

### Tools to Use

```bash
# Axe DevTools (Chrome Extension)
# Install from Chrome Web Store

# Test with screen reader (Mac)
# Enable: System Preferences > Accessibility > Screen Reader
```

---

## Step 11: Performance Check (5-10 minutes)

### Bundle Size

```bash
# Check component bundle size
npm run build

# Look for warning about component size
# Should be < 100KB additional for all review components
```

### Lighthouse Check

```bash
# Run Lighthouse in DevTools
# Check Performance, Accessibility, Best Practices scores
```

---

## Step 12: Deploy to Staging (5-10 minutes)

### Test in Staging Environment

```bash
# Build locally
npm run build

# Check for any errors
npm run start

# Test on multiple devices
# - Desktop browsers (Chrome, Firefox, Safari, Edge)
# - Mobile browsers (iOS Safari, Chrome Mobile)
# - Tablets
```

---

## Common Implementation Issues & Solutions

### Issue 1: Rating Component Not Showing

**Problem:** Rating component doesn't render in form

**Solution:**
```tsx
// Make sure Rating is imported
import { Rating } from '@/components/composite/rating'

// And wrapped properly in FormField
<FormField
  control={form.control}
  name="rating"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Rating</FormLabel>
      <div className="mt-2">
        <Rating
          value={field.value}
          onChange={field.onChange}
          max={5}
        />
      </div>
    </FormItem>
  )}
/>
```

### Issue 2: Form Not Validating

**Problem:** Validation errors not showing

**Solution:**
- Check Zod schema is correct
- Verify zodResolver is imported
- Ensure field names match schema
- Check FormMessage component is present

### Issue 3: Tab Data Loss

**Problem:** Switching tabs loses form data

**Solution:**
- All fields must be in same Form component
- Don't use local state for form data
- Use form.watch() if you need to read values

### Issue 4: Dialog Not Closing After Submit

**Problem:** Dialog stays open after successful submission

**Solution:**
```tsx
async function onSubmit(data) {
  // ... submit logic
  setIsOpen(false) // Add this
}
```

### Issue 5: API Not Receiving Data

**Problem:** Form submits but API receives empty/wrong data

**Solution:**
- Check request body in Network tab
- Verify API endpoint path
- Check JSON serialization
- Verify field names match backend

---

## Phase Completion Checklist

### Development
- [ ] All components created from templates
- [ ] Imports all resolved
- [ ] No TypeScript errors
- [ ] No console errors on page load

### Testing
- [ ] Form validation works
- [ ] Submission works
- [ ] Success/error states work
- [ ] Tab navigation works
- [ ] Mobile responsive

### Accessibility
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly
- [ ] Focus visible
- [ ] Color contrast good

### Documentation
- [ ] Components documented
- [ ] API integration documented
- [ ] Types defined correctly
- [ ] README updated

### Deployment
- [ ] Code review passed
- [ ] Build successful
- [ ] No new errors in logs
- [ ] Works in staging

---

## Time Estimates

| Task | Time | Notes |
|------|------|-------|
| Install components | 5 min | Single command |
| Create directories | 5 min | mkdir |
| ReviewDialog | 10 min | Copy from template |
| Section components | 15 min | 3 files |
| Field components | 10 min | 2 files |
| State components | 10 min | 2 files |
| Types & API | 10 min | Update existing |
| Integration | 10 min | Add to page |
| Testing | 20 min | Manual checks |
| Accessibility | 10 min | Audit |
| Polish & fixes | 15 min | Final tweaks |
| **Total** | **~2 hours** | For basic working feature |

---

## Success Criteria

### Feature Complete When:
- ✅ Users can open review dialog
- ✅ Users can rate order, delivery, and items
- ✅ Users can add optional review text
- ✅ Form validation prevents invalid submissions
- ✅ Reviews submit to API successfully
- ✅ Success message shows
- ✅ Dialog closes after submission
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ No console errors

---

## Next Steps After Implementation

1. **User Testing**
   - Have real users test the flow
   - Collect feedback on UX
   - Note any confusion points

2. **Review Display**
   - Build component to show submitted reviews
   - Add rating averages
   - Build review list view

3. **Moderation (Future)**
   - Add admin approval workflow
   - Add review response capability
   - Add review flagging

4. **Analytics (Future)**
   - Track review submission rate
   - Track average ratings
   - Identify products with low ratings

---

## Support

### If You Get Stuck:

1. **Check Error Message**
   - Read console error carefully
   - Google the error message
   - Check React DevTools

2. **Review Templates**
   - Check component-code-templates.md
   - Compare your code with template
   - Look for missing imports

3. **Read Phase 1.2 Research**
   - Understand the pattern you're using
   - Check prop definitions
   - Review validation schema

4. **Test Incrementally**
   - Add one component at a time
   - Test after each addition
   - Don't build everything at once

---

## Files Created by This Phase

```
components/features/review/
├── ReviewDialog.tsx
├── ReviewForm.tsx
├── sections/
│   ├── OverallReviewSection.tsx
│   ├── RiderReviewSection.tsx
│   └── ItemsReviewSection.tsx
├── items/
│   ├── RatingField.tsx
│   └── ReviewTextarea.tsx
└── states/
    ├── SuccessState.tsx
    └── ErrorState.tsx

types/
└── review.ts (new or updated)

lib/api/
└── orderReview.ts (verify exists)

components/ui/
├── dialog.tsx (installed)
├── form.tsx (installed)
├── tabs.tsx (installed)
├── textarea.tsx (installed)
├── button.tsx (installed)
├── label.tsx (installed)
├── alert.tsx (installed)
├── badge.tsx (installed)
├── card.tsx (installed)
├── scroll-area.tsx (installed)
└── input.tsx (installed)
```

---

**Implementation Guide Version:** 1.0
**Created:** December 2, 2025
**Status:** Ready to execute
