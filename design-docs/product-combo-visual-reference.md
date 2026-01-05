# Product Combo Feature - Visual Reference Guide

**Quick Visual Guide for UI Implementation**

---

## Desktop Layout (md and up - 768px+)

### Group Container
```
╔════════════════════════════════════════════════════════════╗
║ Choose Your First Pizza                            [0/1]   ║
║ Select your first 9 inch pizza                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Margherita Pizza (Veg)  [Selected 1] [Customize]    │ ║
║  │ Classic tomato & mozzarella                         │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Pepperoni Pizza (Non-Veg) .......... [+ Add]       │ ║
║  │ Pepperoni & mozzarella                             │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
║  ┌──────────────────────────────────────────────────────┐ ║
║  │ Veggie Supreme (Veg) ............... [+ Add]       │ ║
║  │ Mixed vegetables & mozzarella                      │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Unselected Product Item
```
┌─────────────────────────────────────────────────────────────┐
│ Product Name (Badge) ............ [+ Add Button]           │
│ Short description text                                      │
└─────────────────────────────────────────────────────────────┘
```

### Selected Product Item
```
┌─────────────────────────────────────────────────────────────┐
│ Product Name (Badge) ........ [Selected 1] [Customize Btn] │
│ Short description text                                      │
└─────────────────────────────────────────────────────────────┘
```

### Customization Dialog (Centered Modal)
```
                    ┌──────────────────────────┐
                    │ ╳ Customize Pizza Name   │
                    ├──────────────────────────┤
                    │ Add toppings and extras  │
                    │ (optional)               │
                    │                          │
                    │ ☑ Extra Cheese +$1.99   │
                    │ ☐ Extra Vegetables Free │
                    │ ☐ Garlic Sauce      Free │
                    │ ☐ Spicy Oil        Free │
                    │ ☐ BBQ Sauce       +$0.50│
                    │                          │
                    │ Additional cost: +$2.49 │
                    ├──────────────────────────┤
                    │ [Cancel] [Save (2)]      │
                    └──────────────────────────┘
```

### Validation Alert
```
Error State:
┌──────────────────────────────────────────────────────────────┐
│ ⚠️  Choose Your First Pizza: Select 1 more (0/1)           │
│ ⚠️  Choose Your Second Pizza: Select 1 more (0/1)          │
└──────────────────────────────────────────────────────────────┘

Success State:
┌──────────────────────────────────────────────────────────────┐
│ ✓ All required items selected. Ready to proceed!           │
└──────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (sm and down - 640px)

### Group Container
```
╔════════════════════════════════════════════╗
║ Choose Your First Pizza         [0/1]     ║
║ Select your first pizza                    ║
╠════════════════════════════════════════════╣
║                                            ║
║  ┌──────────────────────────────────────┐ ║
║  │ Margherita Pizza                  [✓]│ ║
║  │ (Veg)                        [Custom] │ ║
║  └──────────────────────────────────────┘ ║
║                                            ║
║  ┌──────────────────────────────────────┐ ║
║  │ Pepperoni Pizza                  [+] │ ║
║  │ (Non-Veg)                            │ ║
║  └──────────────────────────────────────┘ ║
║                                            ║
║  ┌──────────────────────────────────────┐ ║
║  │ Veggie Supreme                   [+] │ ║
║  │ (Veg)                                │ ║
║  └──────────────────────────────────────┘ ║
║                                            ║
╚════════════════════════════════════════════╝
```

### Mobile Customization Sheet (Bottom Drawer)
```
                        (swipeable area)
                              △
    ┌─────────────────────────────────────┐
    │ Customize Pizza Name              ╳ │
    │ Add toppings and extras           │ │
    │ (optional)                        ↓ │
    │                                     │
    │ ☑ Extra Cheese          (+$1.99) │ │
    │ ☐ Extra Vegetables              │ │
    │ ☐ Garlic Sauce                  │ │
    │ ☐ Spicy Oil                     │ │
    │ ☐ BBQ Sauce            (+$0.50) │ │
    │                                     │
    │ Additional cost: +$2.49             │
    │                                     │
    ├─────────────────────────────────────┤
    │ [Cancel        ]  [Save (2)       ] │
    └─────────────────────────────────────┘
```

---

## Component Size Reference

### Default Sizes
```
Card Container
├─ Padding: 24px (py-6)
├─ Gap: 24px (gap-6)
├─ Border Radius: 12px (rounded-xl)
└─ Shadow: Small (shadow-sm)

Product Item
├─ Padding: 16px (p-4)
├─ Border Radius: 8px (rounded-lg)
├─ Min Height: 80px (with description)
└─ Max Height: Flexible

Badge
├─ Padding: 8px horizontal, 4px vertical
├─ Font Size: 12px (text-xs) default
├─ Border Radius: 9999px (rounded-full)
└─ Small Size: 10px (text-[10px])

Button
├─ Default: h-9, px-4, py-2
├─ Small: h-8, px-3
├─ Large: h-10, px-6
└─ Icon: h-9 x w-9 square
```

---

## Color Palette

### Badge Variants for Combo
```
Selection Counter      [0/1]              secondary (gray)
Selected Status        Selected 1         success (green)
Vegetarian            (Veg)              veg (green-600)
Non-Vegetarian        (Non-Veg)          nonveg (red-600)
Addon Price           +$1.99             secondary (gray)
Error/Warning         [Message]          destructive (red)
Popular Item          Popular            popular (orange)
```

### Button Variants
```
Add Item              + Add              outline
Customize            Customize          ghost
Save                 Save Changes       default
Cancel               Cancel             outline
Submit               Continue           default
```

### Text Hierarchy
```
Group Title           16px - 18px        font-semibold
Product Name          14px - 16px        font-medium
Description Text      14px               text-muted-foreground
Badge Text            12px - 10px        text-xs/text-[10px]
Button Text           14px               font-medium
Alert Text            14px               text-sm
```

---

## Spacing Grid

All spacing uses Tailwind's scale (4px base unit):

```
Component Spacing:
- Between items:    12px (gap-3)
- Within card:      16px (p-4)
- Card container:   24px (py-6, px-6)
- Section gap:      24px (gap-6)
- Dialog padding:   24px (p-6)
- Sheet padding:    16px (p-4)

Responsive Padding:
- Mobile:           16px (p-4)
- Tablet:           24px (p-6)
- Desktop:          24px (p-6)
```

---

## Animation Timing

```
Dialog Overlay Fade:    200ms (duration-200)
Dialog Content Zoom:    200ms (duration-200)
Sheet Slide:            300ms closed, 500ms open
Hover Effects:          150ms transition-all
Button Press:           instant
Badge Update:           instant (or 200ms with motion)
```

---

## Hover & Focus States

```
Product Item Hover:
├─ Background: accent (light gray/blue)
├─ Border: primary color
├─ Cursor: pointer
└─ Transition: smooth 150ms

Button Hover:
├─ Background: Lighter shade
├─ Duration: 150ms (transition-all)
└─ No text change

Button Focus:
├─ Ring: 3px ring-ring/50
├─ Outline: Hidden (focus-visible:outline-hidden)
└─ Border: border-ring

Checkbox Focus:
├─ Ring: Standard focus ring
└─ No visual change on hover
```

---

## Responsive Breakpoints

```
Mobile (xs):     0px     - 639px   ← Target: Sheet modals
Tablet (sm):     640px   - 767px   ← Sheet still
Desktop (md):    768px   - 1023px  ← Switch to Dialog
Large (lg):      1024px  - 1279px  ← Full Dialog
XL (xl):         1280px+           ← Full Dialog

Combo Strategy:
max-width(768px) → Sheet component (bottom drawer)
min-width(768px) → Dialog component (centered modal)
```

---

## State Visualizations

### Product Item States
```
STATE: Unselected
┌────────────────────────────────────┐
│ Product Name (Badge) ... [+ Add]  │
│ Description                        │
└────────────────────────────────────┘
Appearance: Gray border, normal background

STATE: Selected (1 item)
┌────────────────────────────────────┐
│ Product Name (Badge) .... [Sel 1] │
│ Description          [Customize]  │
└────────────────────────────────────┘
Appearance: Green border or accent BG

STATE: Selected (2+ items)
┌────────────────────────────────────┐
│ Product Name (Badge) .... [Sel 2] │
│ Description          [Customize]  │
└────────────────────────────────────┘
Same as 1 item, just different count

STATE: Disabled/Unavailable
┌────────────────────────────────────┐
│ Product Name (Badge) ..... [Out]  │
│ Description (faded)                │
└────────────────────────────────────┘
Appearance: Reduced opacity, no hover
```

### Dialog States
```
STATE: Closed
Dialog not visible, nothing on screen

STATE: Opening
Overlay fades in
Dialog zooms in from center
Duration: 200ms

STATE: Open
Dialog centered on screen
Overlay blocks interaction outside
Close button visible
Tab focus trap active

STATE: Closing
Dialog zooms out to center
Overlay fades out
Duration: 200ms
Focus returns to trigger button
```

### Sheet States
```
STATE: Closed
Sheet slides out to right/bottom
Nothing visible

STATE: Opening (from bottom)
Sheet slides up from bottom
Overlay fades in
Duration: 500ms

STATE: Open
Sheet visible, full height/width
User can interact with content
Swipe down gesture available (iOS)

STATE: Closing
Sheet slides down to bottom
Overlay fades out
Duration: 300ms
```

---

## Accessibility Visual Indicators

```
Keyboard Focus:
├─ Ring: 3px ring around element
├─ Color: ring-ring/50
└─ Visible on Tab navigation

Disabled State:
├─ Opacity: 50%
├─ Cursor: not-allowed
└─ No hover effects

Error State:
├─ Border: destructive color (red)
├─ Text: destructive color
└─ Icon: AlertCircle

Required Indicator:
├─ Label text: "Choose Your First Pizza"
├─ Counter: [0/1] shows requirement
└─ Badge updates on selection

Screen Reader Only:
├─ sr-only class for hidden text
├─ Close button: <span className="sr-only">Close</span>
└─ Used for: "Close", skip links, etc.
```

---

## Layout Constraints

```
Dialog (Desktop):
├─ Max Width: calc(100% - 2rem) = 92% window
├─ Actual Max: 28rem (sm:max-w-sm)
├─ Position: Center (top-50%, left-50%, translate)
├─ Z-index: 50
└─ Backdrop: bg-black/50

Sheet (Mobile):
├─ Width: 75% of screen (w-3/4)
├─ Max Width: sm:max-w-sm (640px)
├─ Height: Full on left/right, auto on top/bottom
├─ Z-index: 50
└─ Backdrop: bg-black/50

Card:
├─ Max Width: None (full width of container)
├─ Margins: Handled by parent container
├─ Responsive: Grows to fit
└─ Min Width: 0 (flex constraint)
```

---

## Typography Scale

```
Card Title (Group Header)
├─ Font Size: 18px (text-lg)
├─ Font Weight: 600 (font-semibold)
├─ Line Height: 1
└─ Color: foreground

Card Description
├─ Font Size: 14px (text-sm)
├─ Font Weight: 400
├─ Color: muted-foreground
└─ Margin: 8px top

Dialog Title
├─ Font Size: 18px (text-lg)
├─ Font Weight: 600 (font-semibold)
└─ Color: foreground

Product Item Name
├─ Font Size: 14px - 16px
├─ Font Weight: 500 (font-medium)
├─ Truncate: true (single line)
└─ Color: foreground

Product Description
├─ Font Size: 14px (text-sm)
├─ Font Weight: 400
├─ Color: muted-foreground
└─ Truncate: true (single line)

Badge Text
├─ Font Size: 10px - 14px (varies by size)
├─ Font Weight: 500 (font-medium)
└─ Color: badge-foreground
```

---

## Icon Usage

```
Dialog Close Button
├─ Icon: X (XIcon from lucide-react)
├─ Size: 16px (size-4)
├─ Position: Top right, absolute
├─ Padding: 16px (top-4 right-4)
└─ Opacity: 70% normal, 100% hover

Alert Icon
├─ Icon: AlertCircle for error
├─ Size: 16px (h-4 w-4)
├─ Color: Matches variant (red for destructive)
└─ Margin: 0 (tight spacing)

Checkbox
├─ Type: Custom from @radix-ui/react-checkbox
├─ Size: Default (adjustable)
├─ Checked: Filled with checkmark
└─ Focus: Standard ring visible

Sheet Close Button
├─ Icon: X (XIcon)
├─ Size: 16px (size-4)
├─ Position: Top right, absolute
├─ Padding: 16px (top-4 right-4)
└─ Opacity: 70% normal, 100% hover
```

---

## Responsive Typography Adjustments

```
Mobile (< 640px):
├─ Product Name: 14px (text-sm)
├─ Button Text: 12px (text-xs)
├─ Badge Text: 10px (text-[10px])
└─ Description: 12px (text-xs)

Tablet (640px - 767px):
├─ Product Name: 14px (text-sm) → 16px (text-base)
├─ Button Text: 12px (text-xs) → 14px (text-sm)
├─ Badge Text: 10px (text-[10px])
└─ Description: 12px (text-xs) → 14px (text-sm)

Desktop (768px+):
├─ Product Name: 16px (text-base)
├─ Button Text: 14px (text-sm)
├─ Badge Text: 10px (text-[10px])
└─ Description: 14px (text-sm)
```

---

## Common CSS Classes

```
Product Item Container:
flex items-center justify-between rounded-lg border p-4
hover:bg-accent transition-colors cursor-pointer

Product Info Section:
flex-1 min-w-0
(min-w-0 prevents flex overflow)

Product Name + Badges:
flex items-center gap-2 mb-1

Action Area (Buttons/Badges):
flex items-center gap-2 ml-4 flex-shrink-0

Badge Counter:
inline-flex items-center justify-center rounded-full border
px-2 py-0.5 text-xs font-medium

Dialog Content:
bg-background fixed top-[50%] left-[50%] z-50
-translate-x-1/2 -translate-y-1/2
w-full max-w-[calc(100%-2rem)] sm:max-w-lg
gap-4 rounded-lg border p-6 shadow-lg

Sheet Content:
bg-background fixed z-50 flex flex-col gap-4 shadow-lg
inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm
```

---

## Animation Classes

```
Dialog Entry:
data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95

Dialog Exit:
Same as entry (bidirectional)

Sheet Entry (Right Side):
data-[state=open]:slide-in-from-right
data-[state=closed]:slide-out-to-right

Sheet Entry (Bottom Side):
data-[state=open]:slide-in-from-bottom
data-[state=closed]:slide-out-to-bottom

Transition Timing:
transition ease-in-out
data-[state=closed]:duration-300 data-[state=open]:duration-500
```

---

**Last Updated**: January 5, 2026
**Version**: 1.0
**Purpose**: Visual reference for UI implementation
