# Order Tickets - Visual Animation Guide

## Animation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    TICKETS PAGE LOAD                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  1. GRID STAGGER ANIMATION                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐                              │
│  │ Card │→ │ Card │→ │ Card │  (0.1s delay between each)   │
│  └──────┘  └──────┘  └──────┘                              │
│  Fade + Slide Up + Scale                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. CARD HOVER EFFECT (User Interaction)                     │
│  ┌──────────┐                                                │
│  │   Card   │ ← Hover                                        │
│  │  ⬆ -4px  │ (Lift + Shadow)                              │
│  └──────────┘                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. MESSAGE EXPAND/COLLAPSE                                  │
│  ┌────────────────┐                                          │
│  │ Message...     │                                          │
│  │ [Show more ▼]  │ ← Click                                 │
│  └────────────────┘                                          │
│         ↓                                                     │
│  ┌────────────────┐                                          │
│  │ Full message   │                                          │
│  │ content here   │ (Height + Opacity animation)            │
│  │ [Show less ▲]  │                                          │
│  └────────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CREATE TICKET DIALOG                                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. DIALOG ENTER ANIMATION                                   │
│  ┌─────────────────────────────┐                            │
│  │ ╔═══════════════════════╗   │                            │
│  │ ║  📋 Create Ticket      ║   │ (Fade + Slide)            │
│  │ ║                        ║   │                            │
│  │ ║  [Message Field]       ║   │ (Staggered entrance)      │
│  │ ║  [Image Upload]        ║   │                            │
│  │ ╚═══════════════════════╝   │                            │
│  └─────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. IMAGE UPLOAD ANIMATIONS                                  │
│                                                               │
│  A) DRAG HOVER:                                              │
│  ┌─────────────────┐                                         │
│  │   📤 Upload     │ ← Drag files over                      │
│  │   (Scale 1.02)  │                                         │
│  └─────────────────┘                                         │
│                                                               │
│  B) PROCESSING:                                              │
│  ┌─────────────────┐                                         │
│  │   ✓ Processing  │ (Checkmark scale animation)            │
│  │   [Progress]    │                                         │
│  └─────────────────┘                                         │
│                                                               │
│  C) PREVIEW GRID:                                            │
│  ┌────┐ ┌────┐ ┌────┐                                       │
│  │ 🖼️ │→│ 🖼️ │→│ 🖼️ │ (Staggered scale-in)                │
│  └────┘ └────┘ └────┘                                       │
│                                                               │
│  D) PREVIEW HOVER:                                           │
│  ┌─────┐                                                     │
│  │ 🖼️  │ (Scale 1.05 + Remove button appears)               │
│  └─────┘                                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. SUCCESS ANIMATION                                        │
│  ┌─────────────────────────────┐                            │
│  │        🎊 🎉 🎊            │ (Confetti explosion)        │
│  │                             │                             │
│  │         ◯ ◯ ◯              │ (Ring pulse animations)     │
│  │          ✓                  │ (Checkmark scale + rotate)  │
│  │                             │                             │
│  │    Ticket Created!          │ (Text fade-up)              │
│  │                             │                             │
│  │      ✨ ✨ ✨             │ (Sparkles stagger)           │
│  └─────────────────────────────┘                            │
│                                                               │
│  Auto-close after 2.5s → Refresh → Show new ticket in grid  │
└─────────────────────────────────────────────────────────────┘
```

## Animation Timing Diagram

```
Time →  0ms    100ms   200ms   300ms   400ms   500ms   1000ms  2500ms
        │      │       │       │       │       │       │       │
Grid    ├─┬────┴─┬─────┴─┬─────┴─┬─────┴─┬─────┘       │       │
        │ │Card1 │ Card2 │ Card3 │ Card4 │             │       │
        │ └──────┴───────┴───────┴───────┘             │       │
        │                                               │       │
Dialog  │                                               │       │
Enter   ├───────┬──────┬──────┐                        │       │
        │ Fade  │Icon  │Form  │                        │       │
        │       │      │      │                        │       │
Upload  │                                               │       │
Overlay ├──────────────┬──────┬──────┐                │       │
        │              │Icon  │Text  │                │       │
        │              │scale │fade  │                │       │
        │                                               │       │
Success │                                               │       │       │
State   │                    ┌───────────────────────┬─────────┤
        │                    │ Confetti + Rings +    │ Auto    │
        │                    │ Icon + Text + Stars   │ Close   │
        └────────────────────┴───────────────────────┴─────────┘
```

## Color Palette for Animations

### Status Colors:
```
Open/In Progress:
  - Primary: #F59E0B (Amber 500)
  - Light: #FEF3C7 (Amber 50)
  - Glow: Amber gradient

Closed/Resolved:
  - Primary: #10B981 (Emerald 500)
  - Light: #D1FAE5 (Emerald 50)
  - Glow: Emerald gradient
```

### Confetti Colors:
```
Brand Palette:
  🟠 #F97316  Primary Orange
  🟠 #FB923C  Light Orange
  🟡 #FBBF24  Amber/Gold
  🟢 #22C55E  Success Green
  🔵 #3B82F6  Info Blue
  🩷 #EC4899  Pink Accent
  🟣 #A855F7  Purple Accent
```

## Interaction States

### Card States:
```
┌──────────────────────────────────────────────────┐
│  STATE          │  VISUAL EFFECT                 │
├──────────────────────────────────────────────────┤
│  Default        │  No animation                  │
│  Hover          │  Lift (-4px) + Shadow          │
│  Message Short  │  [Show more] button visible    │
│  Message Long   │  [Show less] button visible    │
│  Has Images     │  Image count badge shown       │
│  Is Closed      │  Resolution section visible    │
└──────────────────────────────────────────────────┘
```

### Upload Area States:
```
┌──────────────────────────────────────────────────┐
│  STATE          │  VISUAL EFFECT                 │
├──────────────────────────────────────────────────┤
│  Idle           │  Border dashed gray            │
│  Drag Over      │  Scale 1.02 + Orange border    │
│  Processing     │  Overlay + Checkmark animation │
│  Error          │  Red border + error message    │
│  Max Reached    │  Upload area hidden            │
└──────────────────────────────────────────────────┘
```

## Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```tsx
// Example implementation:
const shouldReduceMotion = useReducedMotion();

// In animation:
whileHover={
  shouldReduceMotion
    ? {}  // No animation
    : { y: -4, boxShadow: '...' }  // With animation
}
```

### Reduced Motion Behavior:
- **Grid:** Instant appearance, no stagger
- **Cards:** No hover lift, only shadow change
- **Message:** Instant expand/collapse
- **Upload:** No scale effects
- **Dialog:** Instant transitions
- **Success:** Simplified celebration (no confetti)

## Mobile Responsiveness

### Touch Interactions:
- Hover effects trigger on tap (mobile)
- Card expansion via tap on "Show more"
- Image previews scale on tap
- Dialog optimized for mobile viewport

### Performance Considerations:
- Reduced confetti pieces on mobile (40 → 30)
- Simplified shadows on low-end devices
- GPU acceleration for all transforms
- Debounced drag events

## Accessibility Features

### Screen Reader Announcements:
```tsx
<motion.div
  role="status"
  aria-live="polite"
  aria-label="Review submitted successfully"
>
  {/* Success content */}
</motion.div>
```

### Keyboard Navigation:
- All interactive elements focusable
- Focus styles preserved during animations
- Tab order maintained
- Escape key closes dialogs

### Color Contrast:
- All text meets WCAG AA standards
- Status badges have sufficient contrast
- Hover states maintain readability

## Animation Performance Metrics

### Target Metrics:
```
Grid Animation:      60fps (16.67ms per frame)
Card Hover:         120fps (8.33ms per frame)
Image Upload:        60fps (negligible impact)
Confetti:           40fps (acceptable for celebration)
Dialog Transitions:  60fps (smooth state changes)
```

### Optimization Techniques:
1. Transform-only animations (GPU accelerated)
2. Will-change hints for complex animations
3. RequestAnimationFrame for smooth updates
4. Memoized animation variants
5. Lazy-loaded confetti component

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Optimal performance |
| Firefox 88+ | ✅ Full | All features work |
| Safari 14+ | ✅ Full | WebKit optimized |
| Edge 90+ | ✅ Full | Chromium-based |
| Mobile Safari | ✅ Full | Touch optimized |
| Chrome Mobile | ✅ Full | Hardware accelerated |

## Testing Checklist

- [ ] Grid animation loads smoothly on page load
- [ ] Cards respond to hover on desktop
- [ ] Message expand/collapse works correctly
- [ ] Image drag-and-drop triggers animations
- [ ] Upload progress shows during processing
- [ ] Image previews appear with stagger effect
- [ ] Dialog opens with fade animation
- [ ] Success celebration plays completely
- [ ] Confetti doesn't impact performance
- [ ] Reduced motion is respected
- [ ] Mobile touch interactions work
- [ ] Keyboard navigation maintained
- [ ] Screen readers announce changes
- [ ] No layout shift during animations
- [ ] 60fps maintained on low-end devices
