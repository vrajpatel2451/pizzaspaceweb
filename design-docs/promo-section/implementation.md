# Promo/Countdown Section Implementation

## Overview
A complete promotional section for PizzaSpace featuring a live countdown timer, discount code with copy-to-clipboard functionality, and responsive design with animations.

## Components

### 1. PromoSection (Server Component)
**File:** `/components/home/promo-section/index.tsx`

Main container with gradient background and decorative elements.

**Features:**
- Full-width gradient background (orange to red)
- Background pattern overlay
- Responsive grid layout
- Decorative blur elements

### 2. PromoContent (Server Component)
**File:** `/components/home/promo-section/promo-content.tsx`

Content layout for the left side of the section.

**Features:**
- Animated "Limited Time Offer" badge with pulse effect
- Large headline with highlighted discount
- Countdown timer integration
- Discount code display
- CTA button with hover effects

### 3. CountdownTimer (Client Component)
**File:** `/components/home/promo-section/countdown-timer.tsx`

Live countdown timer with real-time updates.

**Features:**
- Real-time countdown to December 31, 2025
- Auto-updates every second
- Prevents hydration mismatch with SSR
- Staggered entry animations
- Responsive grid layout (4 columns)
- Hover scale effect on timer boxes

**Technical Implementation:**
- Uses `useState` and `useEffect` hooks
- `setInterval` for live updates
- Cleanup on unmount
- Zero-padded time values
- Graceful handling when countdown reaches zero

### 4. DiscountCode (Client Component)
**File:** `/components/home/promo-section/discount-code.tsx`

Promo code display with copy-to-clipboard functionality.

**Features:**
- Copy button with icon
- Visual feedback on copy ("Copied!" state)
- Clipboard API integration
- Error handling for copy failures
- 2-second feedback timeout
- Accessible button with ARIA label

**Technical Implementation:**
- Uses `navigator.clipboard.writeText()`
- State management for copy feedback
- Auto-reset after 2 seconds
- Fallback error handling

### 5. PromoImage (Server Component)
**File:** `/components/home/promo-section/promo-image.tsx`

Right-side image display with decorative elements.

**Features:**
- Circular pizza image container
- Floating decorative elements (%, 🍕, 🔥)
- Staggered bounce animations
- Background glow effect
- Decorative dashed ring
- Hidden on mobile (lg:block)

## Installation

### Required Dependencies
All dependencies should already be installed in your Next.js project:

```bash
# These are already part of Next.js 16
next
react
react-dom
```

### Image Setup
Place your promotional pizza image at:
```
/public/images/pizza-promo.png
```

**Recommended image specifications:**
- Size: 600x600px minimum
- Format: PNG with transparency
- Subject: Pizza or food item centered
- Background: Transparent or white

## Usage

### Basic Implementation
Add the PromoSection to your home page:

```tsx
import { PromoSection } from '@/components/home/promo-section';

export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <PromoSection />
      {/* Other sections */}
    </main>
  );
}
```

### Customization Options

#### 1. Change Target Date
Edit the `targetDate` prop in `promo-content.tsx`:

```tsx
<CountdownTimer targetDate={new Date('2026-01-15T23:59:59')} />
```

#### 2. Change Discount Code
Edit the `code` prop in `promo-content.tsx`:

```tsx
<DiscountCode code="NEWCODE" />
```

#### 3. Modify Discount Percentage
Update the headline in `promo-content.tsx`:

```tsx
<h2>
  Get <span className="text-yellow-300">50% Off</span>
  <br />
  Your First Order
</h2>
```

#### 4. Change CTA Link
Update the Link component in `promo-content.tsx`:

```tsx
<Link href="/custom-page">
  Order Now
</Link>
```

#### 5. Customize Colors
The component uses Tailwind CSS classes. Update gradients and colors:

```tsx
// Main gradient (index.tsx)
className="bg-gradient-to-r from-orange-500 to-red-500"

// Timer boxes (countdown-timer.tsx)
className="text-orange-600"

// CTA button (promo-content.tsx)
className="bg-white text-orange-600"
```

## Responsive Behavior

### Mobile (< 1024px)
- Single column layout
- Timer boxes: 4 columns in compact grid
- Image section hidden
- Reduced padding and text sizes

### Desktop (≥ 1024px)
- Two-column grid layout
- Full-size timer boxes
- Image section visible with animations
- Larger text and spacing

## Accessibility Features

- **ARIA Labels:** Copy button has descriptive label
- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Readers:** Proper semantic HTML structure
- **Focus States:** Visible focus indicators on interactive elements
- **Color Contrast:** White text on gradient background meets WCAG AA standards

## Dark Mode Support

The component automatically adjusts for dark mode:

```tsx
// Darker gradient in dark mode
className="dark:from-orange-600 dark:to-red-600"
```

## Performance Considerations

1. **Server Components:** Main layout uses server components for optimal performance
2. **Client Components:** Only interactive elements use 'use client'
3. **Image Optimization:** Next.js Image component with priority loading
4. **Animation Performance:** CSS animations use transform and opacity
5. **Timer Efficiency:** Single interval updates all time units

## Browser Compatibility

- **Clipboard API:** Supported in all modern browsers (Chrome 66+, Firefox 63+, Safari 13.1+)
- **CSS Grid:** Full support in all modern browsers
- **Animations:** CSS animations and transforms widely supported

### Fallbacks
- Copy button includes error handling for clipboard failures
- Timer shows "00" during SSR to prevent hydration mismatch

## Troubleshooting

### Issue: Hydration Mismatch Warning
**Solution:** The CountdownTimer component includes a `mounted` state to prevent this. Ensure you don't modify the initial render logic.

### Issue: Copy Button Not Working
**Solution:**
- Check browser clipboard permissions
- Verify HTTPS (clipboard API requires secure context)
- Check console for error messages

### Issue: Image Not Displaying
**Solution:**
- Verify image path: `/public/images/pizza-promo.png`
- Check image file permissions
- Ensure image dimensions are adequate

### Issue: Timer Not Updating
**Solution:**
- Check browser console for errors
- Verify target date is in the future
- Ensure component is properly mounted

## API Reference

### CountdownTimer Props
```typescript
interface CountdownTimerProps {
  targetDate: Date; // Target date for countdown
}
```

### DiscountCode Props
```typescript
interface DiscountCodeProps {
  code: string; // Promo code to display and copy
}
```

### TimeLeft Interface
```typescript
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
```

## Code Quality Checklist

- ✅ Full TypeScript type safety (no `any` types)
- ✅ Comprehensive error handling
- ✅ Loading states for async operations
- ✅ WCAG accessibility compliance
- ✅ Mobile-first responsive design
- ✅ React best practices (proper hook usage)
- ✅ Server/Client component separation
- ✅ Proper cleanup in useEffect
- ✅ SSR/Hydration compatibility
- ✅ Performance optimized

## Future Enhancements

Potential improvements for future iterations:

1. **Backend Integration:** Connect to CMS for dynamic promo codes
2. **Analytics:** Track copy button clicks and CTA conversions
3. **A/B Testing:** Test different discount percentages
4. **Localization:** Support multiple languages and time zones
5. **Sound Effects:** Optional sound on timer completion
6. **Email Capture:** Integrate with email marketing
7. **Social Sharing:** Add share buttons for the promotion

## License
This component is part of the PizzaSpace project.
