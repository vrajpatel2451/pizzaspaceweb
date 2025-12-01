# Accessibility Quick Reference Guide

Quick reference for maintaining accessibility standards in the Pizza Space application.

---

## Form Field Pattern

Always use this pattern for form inputs:

```tsx
<div className="space-y-2">
  <Label htmlFor="email">
    Email
    <span className="sr-only">(required)</span>
  </Label>
  <Input
    id="email"
    type="email"
    inputMode="email"
    autoComplete="email"
    placeholder="you@example.com"
    leftIcon={<Mail className="size-4" aria-hidden="true" />}
    error={errors.email?.message}
    aria-invalid={!!errors.email}
    aria-required="true"
    aria-describedby={errors.email ? "email-error" : undefined}
    {...register("email")}
  />
</div>
```

---

## Error Message Pattern

```tsx
{apiError && (
  <div
    id="api-error-alert"
    tabIndex={-1}
    className="flex items-start gap-2 p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-lg text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/50"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <AlertCircle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
    <span>{apiError}</span>
  </div>
)}
```

---

## Focus Management Pattern

```tsx
// At component level
useEffect(() => {
  if (errors.email) {
    setFocus("email");
  } else if (errors.password) {
    setFocus("password");
  }
}, [errors, setFocus]);

// For API errors
useEffect(() => {
  if (apiError) {
    const errorElement = document.getElementById("api-error-alert");
    errorElement?.focus();
  }
}, [apiError]);
```

---

## Button Pattern

```tsx
<Button
  type="submit"
  className="w-full"
  size="lg"
  loading={isSubmitting}
  disabled={isSubmitting}
  aria-label="Sign in to your account"
>
  {isSubmitting ? "Signing in..." : "Sign In"}
</Button>
```

---

## Icon Button Pattern

```tsx
<button
  type="button"
  onClick={handleClick}
  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
  aria-label="Show password"
  aria-pressed={showPassword}
>
  <Eye className="size-4" aria-hidden="true" />
  <span className="sr-only">Show password</span>
</button>
```

---

## Link Pattern

```tsx
<Link
  href="/terms"
  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
>
  Terms of Service
</Link>
```

---

## Checkbox Pattern

```tsx
<div className="flex items-center gap-2">
  <Checkbox
    id="rememberMe"
    checked={rememberMe}
    onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
    aria-label="Remember me"
  />
  <Label
    htmlFor="rememberMe"
    className="text-sm font-normal cursor-pointer"
  >
    Remember me for 30 days
  </Label>
</div>
```

---

## Skip Navigation Pattern

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
>
  Skip to main content
</a>
```

---

## Main Landmark Pattern

```tsx
<main
  id="main-content"
  role="main"
  className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8"
>
  {children}
</main>
```

---

## AutoComplete Values

### Common Inputs
- Email: `autoComplete="email"` + `inputMode="email"`
- Phone: `autoComplete="tel"` + `inputMode="tel"`
- Name: `autoComplete="name"`
- Password (login): `autoComplete="current-password"`
- Password (register): `autoComplete="new-password"`

### Address Inputs
- Street: `autoComplete="street-address"`
- City: `autoComplete="address-level2"`
- State: `autoComplete="address-level1"`
- Postal: `autoComplete="postal-code"`
- Country: `autoComplete="country"`

---

## ARIA Checklist

When creating interactive elements, always ensure:

- ✅ Proper semantic HTML element used
- ✅ Accessible name provided (`aria-label` or visible label)
- ✅ Role is appropriate (or use semantic element)
- ✅ State is communicated (`aria-pressed`, `aria-expanded`, etc.)
- ✅ Keyboard accessible (Tab, Enter, Space)
- ✅ Focus visible (proper focus ring)
- ✅ Screen reader tested

---

## Touch Target Sizes

Minimum sizes for touch targets:

- **Buttons**: 44x44px (use `size="default"` or `size="lg"`)
- **Inputs**: 44px height (default `h-11`)
- **Checkboxes**: 20px (size-5)
- **Icons**: 44x44px with padding
- **Links**: Adequate padding for 44px hit area

---

## Color Contrast

Verify contrast ratios:

- **Normal text**: ≥ 4.5:1
- **Large text** (18px+ or 14px+ bold): ≥ 3:1
- **UI components**: ≥ 3:1
- **Focus indicators**: ≥ 3:1

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Common Mistakes to Avoid

❌ **Don't**:
- Use `div` or `span` for buttons
- Rely only on color to convey information
- Use `placeholder` as the only label
- Remove focus indicators
- Have touch targets smaller than 44px
- Use generic "click here" link text

✅ **Do**:
- Use semantic HTML (`button`, `a`, `input`)
- Provide visible labels for all inputs
- Add descriptive aria-labels
- Show visible focus indicators
- Meet minimum touch target sizes
- Use descriptive link text

---

## Testing Commands

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start dev server
npm run dev
```

---

## Resources

- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
- Full Report: `/ACCESSIBILITY_REPORT.md`
- Completion Summary: `/spec/phase_2.2_completion_summary.md`

---

**Last Updated**: 2025-12-01
