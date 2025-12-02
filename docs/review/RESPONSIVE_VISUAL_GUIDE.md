# Visual Guide: Responsive Design Behavior

## Dialog Transformation

### Mobile (< 640px)
```
┌─────────────────────┐
│ [✨] Rate Your Order│  ← Compact header (p-4)
│ Share your exp...   │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │Order│Delivery│Items│ ← Compact tabs (h-10)
│ └─────────────────┘ │
│                     │
│ ⭐⭐⭐⭐⭐ [4.5]    │  ← Touch-friendly stars
│                     │
│ ┌─────────────────┐ │
│ │ Review text...  │ │  ← Smaller textarea (80px)
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │     Cancel      │ │  ← Full-width buttons
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │  Submit Review  │ │  ← 44px height (iOS std)
│ └─────────────────┘ │
└─────────────────────┘
Full screen, no margins
```

### Tablet/Desktop (≥ 640px)
```
    ┌──────────────────────────┐
    │ [✨] Rate Your Order     │  ← Standard header (p-6)
    │ Share your experience    │
    ├──────────────────────────┤
    │ ┌──────────────────────┐ │
    │ │ Order│Delivery│Items │ │  ← Standard tabs (h-11)
    │ └──────────────────────┘ │
    │                          │
    │ ⭐⭐⭐⭐⭐ [4.5]          │  ← Same touch targets
    │                          │
    │ ┌──────────────────────┐ │
    │ │ Review text here...  │ │  ← Larger textarea (100px)
    │ │                      │ │
    │ │                      │ │
    │ └──────────────────────┘ │
    │                          │
    │         ┌──────┐┌──────┐│
    │         │Cancel││Submit││  ← Side-by-side
    │         └──────┘└──────┘│
    └──────────────────────────┘
Max-width 600px, centered, rounded
```

## Rating Component Touch Targets

### Visual Star vs Touch Area

Mobile (Large size):
```
Touch Area: 44x44px (iOS standard)
┌──────────────┐
│              │
│      ⭐      │  ← Visual star: 28x28px (size-7)
│              │
└──────────────┘
 Invisible padding ensures minimum 44px
```

Desktop (Same large size):
```
Touch Area: 44x44px (maintained)
┌──────────────┐
│              │
│      ⭐      │  ← Same visual size
│              │
└──────────────┘
 Better pointer accuracy
```

## Tab Layout Comparison

### Mobile
```
┌───────────────────────────────┐
│ 🛒 Order │ 🚚 Delivery │ 📦 Items │  ← Icons + text, compact
└───────────────────────────────┘
Height: 40px, Text: 12px, Padding: 8px
```

### Tablet/Desktop
```
┌────────────────────────────────────┐
│  🛒 Order  │  🚚 Delivery  │  📦 Items  │  ← More spacious
└────────────────────────────────────┘
Height: 44px, Text: 14px, Padding: 12px
```

## Form Fields Scaling

### Main Review TextArea

Mobile:
```
┌─────────────────────────┐
│ Share your experience...│  ← 14px font
│                         │
│                         │  80px min-height
│                         │
│                         │
└─────────────────────────┘
  480/500 characters
```

Desktop:
```
┌───────────────────────────────┐
│ Share your experience...      │  ← 16px font
│                               │
│                               │  100px min-height
│                               │
│                               │
│                               │
└───────────────────────────────┘
      480/500 characters
```

### Item Review TextArea

Mobile:
```
┌─────────────────────┐
│ Feedback...         │  ← 12px font
│                     │  56px min-height
│                     │
└─────────────────────┘
  150/300 characters
```

Desktop:
```
┌─────────────────────────┐
│ Feedback...             │  ← 14px font
│                         │  60px min-height
│                         │
└─────────────────────────┘
    150/300 characters
```

## Button Transformations

### Mobile (Stacked)
```
┌──────────────────────┐
│                      │
│       Cancel         │  44px height
│                      │
└──────────────────────┘
         ↕ 8px gap
┌──────────────────────┐
│                      │
│    Submit Review     │  44px height
│                      │
└──────────────────────┘
Full width, easy thumb reach
```

### Desktop (Side-by-side)
```
               ┌──────────┐  ┌────────────────┐
               │  Cancel  │  │ Submit Review  │  40px height
               └──────────┘  └────────────────┘
                    ↔ 12px gap
Auto width with minimums (100px/140px)
```

## Item Card Density

### Mobile
```
┌─────────────────────────────┐
│ [1] Margherita Pizza        │  ← 12px name
│     Large, Extra Cheese     │  ← 10px variants
│     Qty: 2                  │
│                             │
│ ⭐⭐⭐⭐⭐ [4.0]            │  ← Default size stars
│                             │
│ ┌─────────────────────────┐ │
│ │ Feedback...             │ │  ← 56px textarea
│ └─────────────────────────┘ │
└─────────────────────────────┘
12px padding, compact spacing
```

### Desktop
```
┌───────────────────────────────────┐
│ [1]  Margherita Pizza             │  ← 14px name
│      Large, Extra Cheese          │  ← 12px variants
│      Qty: 2                       │
│                                   │
│ ⭐⭐⭐⭐⭐ [4.0]                  │  ← Same stars
│                                   │
│ ┌─────────────────────────────┐   │
│ │ Feedback...                 │   │  ← 60px textarea
│ │                             │   │
│ └─────────────────────────────┘   │
└───────────────────────────────────┘
16px padding, standard spacing
```

## Rider Info Card

### Mobile
```
┌────────────────────────┐
│ [👤] John Driver       │  ← 12px name
│  📧 john@example.com   │  ← 10px email
└────────────────────────┘
36px avatar, 12px padding
```

### Desktop
```
┌──────────────────────────────┐
│ [👤]  John Driver            │  ← 14px name
│   📧  john@example.com       │  ← 12px email
└──────────────────────────────┘
40px avatar, 16px padding
```

## Scrollable Items List

### Mobile
```
┌─────────────────────┐
│ [1] Pizza A         │ ↑
│ ⭐⭐⭐⭐⭐          │ │
│ ─────────────────── │ │
│ [2] Pizza B         │ │ 350px
│ ⭐⭐⭐⭐⭐          │ │ max
│ ─────────────────── │ │ height
│ [3] Pizza C         │ │
│ ⭐⭐⭐⭐⭐          │ ↓
│ ─────────────────── │
└─────────────────────┘
Compact cards, tighter spacing
```

### Desktop
```
┌───────────────────────────┐
│ [1] Pizza A               │ ↑
│ ⭐⭐⭐⭐⭐              │ │
│ [Feedback textarea]       │ │
│ ───────────────────────── │ │
│ [2] Pizza B               │ │ 400px
│ ⭐⭐⭐⭐⭐              │ │ max
│ [Feedback textarea]       │ │ height
│ ───────────────────────── │ │
│ [3] Pizza C               │ │
│ ⭐⭐⭐⭐⭐              │ ↓
│ [Feedback textarea]       │
└───────────────────────────┘
Standard cards, comfortable spacing
```

## Spacing Hierarchy

### Mobile
```
Dialog padding:        16px (p-4)
Card header:           16px horizontal, 12px vertical
Card content:          16px horizontal
Field spacing:         16px vertical (space-y-4)
Tab spacing:           6px gap (gap-1.5)
Button gap:            8px (gap-2)
```

### Desktop
```
Dialog padding:        24px (p-6)
Card header:           24px horizontal, 16px vertical
Card content:          24px horizontal
Field spacing:         24px vertical (space-y-6)
Tab spacing:           8px gap (gap-2)
Button gap:            12px (gap-3)
```

## Responsive Typography Scale

```
Element               Mobile          Desktop
─────────────────────────────────────────────
Dialog Title          18px (text-lg)  20px (text-xl)
Card Title            16px (text-base) 18px (text-lg)
Form Label            14px (text-sm)  16px (text-base)
Help Text             12px (text-xs)  14px (text-sm)
Input Text            14px (text-sm)  16px (text-base)
Secondary Info        10px            12px (text-xs)
Button Text           14px (text-sm)  16px (text-base)
```

## Touch Target Guidelines

All interactive elements meet or exceed standards:

```
Element                   Mobile    Desktop   Standard
─────────────────────────────────────────────────────
Submit Button             44px      40px      iOS: 44px
Cancel Button             44px      40px      iOS: 44px
Rating Star (lg)          44px      44px      WCAG AAA: 44px
Rating Star (default)     40px      40px      WCAG AA: 40px
Tab Trigger               40px      44px      Comfortable
Form Input                Auto      Auto      With padding
```

## Breakpoint Behavior

```
0px          640px         1024px        1440px+
│─────────────│─────────────│─────────────│────────
Mobile         Tablet        Desktop       Desktop+
(base)         (sm:)         (inherits)    (inherits)

Full-screen    Centered      Same          Same
dialog         dialog        layout        layout

Stacked        Side-by-      Same          Same
buttons        side          layout        layout

Compact        Standard      Same          Same
spacing        spacing       spacing       spacing
```

## Testing Points

### Visual Verification
1. ✅ Dialog fills screen on mobile
2. ✅ Dialog centered and rounded on tablet+
3. ✅ Buttons stack vertically on mobile
4. ✅ Buttons side-by-side on tablet+
5. ✅ Text scales appropriately
6. ✅ Stars are easily tappable
7. ✅ No horizontal overflow
8. ✅ Smooth transitions between breakpoints

### Interaction Verification
1. ✅ Stars easy to tap on mobile
2. ✅ Buttons thumb-friendly
3. ✅ Tabs easy to switch
4. ✅ Textareas comfortable to type in
5. ✅ Scrolling smooth in items list
6. ✅ No accidental taps
7. ✅ Proper focus indicators
8. ✅ Keyboard navigation works

## Landscape Mode Notes

Mobile landscape inherits mobile styles but benefits from:
- Wider textareas
- More visible items in scrollable list
- Better use of horizontal space
- Maintained touch targets

## Accessibility Visual Indicators

```
Focus State (All sizes):
┌────────────────────┐
│ ┌────────────────┐ │  ← 2px primary ring
│ │   [Element]    │ │
│ └────────────────┘ │
└────────────────────┘
2px offset for visibility

Touch Target (Visual):
        ⭐
┌──────────────┐
│  [44x44px]   │  ← Minimum hit area
└──────────────┘
Invisible but functional
```

## Summary

The responsive design ensures:
- **Mobile**: Full-screen immersion, thumb-friendly controls, optimized density
- **Tablet**: Comfortable centered layout, balanced spacing, easy interaction
- **Desktop**: Optimal reading width, spacious layout, precise pointer control
- **All Devices**: Consistent experience with appropriate adaptations, maintained accessibility
