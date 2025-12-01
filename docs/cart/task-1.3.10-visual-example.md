# Task 1.3.10: Error State Visual Example

## Error State UI Preview

### Component Structure
```
┌─────────────────────────────────────────┐
│                                         │
│           ┌────────────┐                │
│           │            │                │
│           │     ⚠️      │   ← Error Icon│
│           │            │   (AlertCircle)│
│           └────────────┘                │
│                                         │
│      Unable to load summary             │
│                                         │
│   We couldn't calculate your order      │
│   total. Please try again.              │
│   [or custom error message]             │
│                                         │
│        ┌──────────────┐                 │
│        │  🔄 Try Again │  ← Retry Button│
│        └──────────────┘                 │
│                                         │
└─────────────────────────────────────────┘
```

### CSS Classes Breakdown

#### Container (Card)
```typescript
<Card className={className}>
  // Inherits from parent className prop
  // Uses shadcn/ui Card styling
</Card>
```

#### Content Container
```typescript
<CardContent className="flex flex-col items-center justify-center py-12 px-6">
  // flex-col: Vertical stacking
  // items-center: Horizontal centering
  // justify-center: Vertical centering
  // py-12: 3rem vertical padding
  // px-6: 1.5rem horizontal padding
</CardContent>
```

#### Error Icon Container
```typescript
<div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
  // size-16: 4rem (64px) width and height
  // rounded-full: Perfect circle
  // bg-destructive/10: Light red background
  // flex: Flexbox for icon centering
  // mb-4: 1rem bottom margin
</div>
```

#### Error Icon
```typescript
<AlertCircle className="size-8 text-destructive" />
  // size-8: 2rem (32px) icon size
  // text-destructive: Red color for error state
```

#### Error Heading
```typescript
<h3 className="font-semibold text-lg mb-2">
  Unable to load summary
  // font-semibold: Semi-bold weight
  // text-lg: 1.125rem (18px) font size
  // mb-2: 0.5rem bottom margin
</h3>
```

#### Error Message
```typescript
<p className="text-sm text-muted-foreground text-center mb-6 max-w-[280px]">
  {error || "We couldn't calculate your order total. Please try again."}
  // text-sm: 0.875rem (14px) font size
  // text-muted-foreground: Subtle gray color
  // text-center: Center aligned text
  // mb-6: 1.5rem bottom margin
  // max-w-[280px]: Max 280px width for readability
</p>
```

#### Retry Button
```typescript
<Button variant="outline" onClick={onRetry} className="gap-2">
  <RefreshCw className="size-4" />
  Try Again
  // variant="outline": Outlined button style
  // gap-2: 0.5rem gap between icon and text
  // RefreshCw size-4: 1rem (16px) icon
</Button>
```

## Color Palette

### Light Mode
- **Error Icon Background**: `hsl(var(--destructive) / 0.1)` - Light red tint
- **Error Icon**: `hsl(var(--destructive))` - Red
- **Heading**: `hsl(var(--foreground))` - Dark gray/black
- **Message**: `hsl(var(--muted-foreground))` - Medium gray
- **Button**: Border with outline variant

### Dark Mode
- **Error Icon Background**: `hsl(var(--destructive) / 0.1)` - Dark red tint
- **Error Icon**: `hsl(var(--destructive))` - Red (adjusted for dark)
- **Heading**: `hsl(var(--foreground))` - White/light gray
- **Message**: `hsl(var(--muted-foreground))` - Light gray
- **Button**: Border with outline variant (dark adjusted)

## Responsive Behavior

### Mobile (< 640px)
- Full width container
- Vertical padding: 3rem (py-12)
- Horizontal padding: 1.5rem (px-6)
- Max message width: 280px
- Icon size: 64px

### Tablet/Desktop (>= 640px)
- Same layout as mobile
- Inherits parent Card width constraints
- Sticky positioning on desktop (from parent)

## State Flow Diagram

```
┌─────────────┐
│   Loading   │
│  (Skeleton) │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────┐   ┌──────────┐
│  Success │   │   Error  │
│ (Summary)│   │  State   │
└──────────┘   └────┬─────┘
                    │
              [Retry Button]
                    │
                    ▼
               ┌─────────┐
               │ Loading │
               └────┬────┘
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
       ┌──────────┐   ┌──────────┐
       │  Success │   │   Error  │
       └──────────┘   └──────────┘
```

## Accessibility Features

1. **Semantic HTML**
   - `<h3>` for heading hierarchy
   - `<p>` for descriptive text
   - `<button>` for interactive element

2. **Visual Indicators**
   - Error icon provides visual cue
   - Color contrast meets WCAG AA standards
   - Icon + text combination (not icon only)

3. **Interactive Element**
   - Clickable retry button
   - Hover states inherited from Button component
   - Focus states for keyboard navigation

4. **Screen Reader Support**
   - Text content is descriptive
   - Button has clear "Try Again" label
   - Icon is complementary, not essential

## Error Message Examples

### Generic Error (Default)
```
"We couldn't calculate your order total. Please try again."
```

### API-Specific Errors
```
// From useCartSummary hook:
"Failed to fetch cart summary"
"An unexpected error occurred while fetching summary"

// From API response:
"Store is currently unavailable"
"Invalid delivery address"
"Discount code has expired"
```

## Integration Points

### Parent Component (Cart Page)
```typescript
<OrderSummary
  summary={summary}           // null triggers error state
  loading={isLoadingSummary}  // false when error occurs
  error={summaryError}        // Error message from hook
  onRetry={refetchSummary}   // Callback from hook
  onCheckout={handleCheckout}
  checkoutDisabled={...}
/>
```

### Hook Integration
```typescript
const {
  summary,                    // null on error
  isLoading: isLoadingSummary, // false after error
  error: summaryError,        // Error message string
  refetch: refetchSummary,    // Retry function
} = useCartSummaryHook(...)
```
