# Lat/Lng Validation - Usage Guide

## Quick Reference

### Form States

```
┌─────────────────────────────────────────────────────────┐
│  STATE 1: Location Missing (Initial State)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ⚠️ Please select a location on the map or use          │
│     'Use My Location'                                    │
│                                                          │
│  [Name Input]                                           │
│  [Phone Input]                                          │
│  [Address Fields...]                                    │
│                                                          │
│  ⚠️ Location required    [Use My Location] ←default btn │
│                                                          │
│  [Cancel]  [Select Location First] ←disabled            │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│  STATE 2: Location Captured                             │
├─────────────────────────────────────────────────────────┤
│  [Name Input]                                           │
│  [Phone Input]                                          │
│  [Address Fields...]                                    │
│                                                          │
│  ✓ Location captured     [Update Location] ←outline btn│
│  Coordinates: 51.507400, -0.127800                      │
│                                                          │
│  [Cancel]  [Save Address] ←enabled                      │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│  STATE 3: Capturing Location (Loading)                  │
├─────────────────────────────────────────────────────────┤
│  [Name Input]                                           │
│  [Phone Input]                                          │
│  [Address Fields...]                                    │
│                                                          │
│  ⚠️ Location required    [⏳ Use My Location] ←disabled │
│                                                          │
│  [Cancel]  [Select Location First] ←disabled            │
└─────────────────────────────────────────────────────────┘
```

## Visual Indicators

### Icons Used

| Icon | State | Meaning |
|------|-------|---------|
| ⚠️ `<AlertCircle>` | Missing | Location not yet set |
| ✓ `<MapPinned>` | Captured | Location successfully captured |
| ⏳ `<Loader2>` | Loading | Getting current location |

### Colors

| State | Text Color | Purpose |
|-------|------------|---------|
| Missing | `text-muted-foreground` | Neutral warning |
| Captured | `text-green-600` | Success indicator |
| Alert | `text-destructive` | Error message |

## User Interactions

### Scenario 1: New Address (Happy Path)

```
1. User clicks "Add New Address"
   → Form opens with "Location required" warning
   → Submit button disabled

2. User fills in address details
   → Submit still disabled (no location)

3. User clicks "Use My Location"
   → Browser requests permission
   → Button shows loading spinner

4. Permission granted
   → Coordinates captured
   → Green checkmark appears
   → "Location captured" shown
   → Coordinates displayed
   → Submit button enabled

5. User clicks "Save Address"
   → Form validates (passes)
   → API called with lat/lng
   → Address saved successfully
```

### Scenario 2: Location Permission Denied

```
1. User clicks "Add New Address"
   → Form opens

2. User clicks "Use My Location"
   → Browser permission dialog

3. User denies permission
   → Toast error: "Location permission denied"
   → Form remains in "Location required" state
   → Submit still disabled

4. Options for user:
   a) Enable location in browser settings
   b) Contact support for alternative
```

### Scenario 3: Edit Existing Address

```
1. User clicks "Edit" on address card
   → Form opens with existing data
   → Existing lat/lng loaded
   → "Location captured" shown immediately
   → Submit button enabled

2. User updates other fields
   → Can submit immediately (has location)

3. (Optional) User clicks "Update Location"
   → New coordinates captured
   → Coordinates update in UI
```

## Developer Guide

### Checking Form State

```typescript
// In address-form.tsx
const watchLat = watch("lat");
const watchLong = watch("long");
const hasLocation = watchLat !== undefined && watchLong !== undefined;

// Use hasLocation to:
// 1. Enable/disable submit
// 2. Show/hide status
// 3. Change button text
```

### Accessing Coordinates

```typescript
// In submit handler
const onFormSubmit = async (data: AddressFormData) => {
  console.log(data.lat);   // Always present (type: number)
  console.log(data.long);  // Always present (type: number)

  // API call
  await createAddress(data); // TypeScript ensures lat/lng included
};
```

### Validation Errors

```typescript
// Schema validation
{errors.lat && (
  <p>{errors.lat.message}</p>
  // Output: "Please select a location on the map or use 'Use My Location'"
)}

{errors.long && (
  <p>{errors.long.message}</p>
  // Output: "Please select a location on the map or use 'Use My Location'"
)}
```

## Common Issues & Solutions

### Issue 1: Submit Button Stays Disabled

**Problem:** User filled form but can't submit

**Check:**
1. Is lat/lng captured?
2. Check browser console for geolocation errors
3. Verify `hasLocation` is true

**Solution:**
```typescript
// Debug in DevTools
console.log('Lat:', watchLat);
console.log('Long:', watchLong);
console.log('Has Location:', hasLocation);
```

### Issue 2: Geolocation Not Working

**Possible Causes:**
1. HTTPS required (geolocation API)
2. Permission denied
3. Browser doesn't support
4. Location services disabled

**Solution:**
```typescript
// Check support
if (!navigator.geolocation) {
  toast.error("Geolocation is not supported by your browser");
  return;
}

// Better error handling
try {
  const position = await getCurrentPosition();
} catch (error) {
  if (error.code === error.PERMISSION_DENIED) {
    // Handle permission denied
  }
}
```

### Issue 3: TypeScript Error on API Call

**Error:**
```
Property 'lat' is missing in type
```

**Solution:**
Ensure lat/lng are provided:
```typescript
// ❌ Wrong
createAddress({
  name: "Test",
  phone: "123",
  // missing lat/lng
})

// ✅ Correct
createAddress({
  name: "Test",
  phone: "123",
  lat: 51.5074,
  long: -0.1278,
})
```

## Accessibility Notes

### Screen Reader Experience

1. **Form Opens:**
   ```
   "Alert: Please select a location on the map or use 'Use My Location'"
   ```

2. **Location Required State:**
   ```
   "Location required"
   "Button: Use My Location"
   "Button: Select Location First, disabled"
   ```

3. **Location Captured:**
   ```
   "Location captured"
   "Coordinates: 51.507400, -0.127800"
   "Button: Save Address"
   ```

### Keyboard Navigation

```
Tab Order:
1. Form fields (Name, Phone, etc.)
2. "Use My Location" button
3. Address type toggles
4. Cancel button
5. Submit button (if enabled)
```

### Focus Management

- Error alert receives focus when shown
- Submit button disabled state prevents accidental activation
- Clear visual indicators for disabled state

## Testing Checklist

### Manual Testing

- [ ] Open new address form
- [ ] Verify "Location required" shown
- [ ] Verify submit disabled
- [ ] Click "Use My Location"
- [ ] Grant permission
- [ ] Verify "Location captured" shown
- [ ] Verify coordinates displayed
- [ ] Verify submit enabled
- [ ] Submit form
- [ ] Check API payload includes lat/lng
- [ ] Edit existing address
- [ ] Verify location already set
- [ ] Try denying permission
- [ ] Verify error handling

### Automated Testing

```typescript
// Example test
describe('Address Form Location Validation', () => {
  it('should disable submit without location', () => {
    render(<AddressForm />);
    const submitBtn = screen.getByText('Save Address');
    expect(submitBtn).toBeDisabled();
  });

  it('should enable submit with location', async () => {
    render(<AddressForm />);

    // Mock geolocation
    mockGeolocation({ lat: 51.5074, long: -0.1278 });

    const locBtn = screen.getByText('Use My Location');
    await userEvent.click(locBtn);

    await waitFor(() => {
      const submitBtn = screen.getByText('Save Address');
      expect(submitBtn).toBeEnabled();
    });
  });
});
```

## Summary

### Key Points

1. **Lat/lng are required** - Cannot submit without location
2. **Visual feedback** - Clear indicators for all states
3. **Type-safe** - TypeScript enforces at compile time
4. **User-friendly** - Helpful messages and guidance
5. **Accessible** - Screen reader and keyboard support

### State Machine

```
┌─────────────┐
│   Initial   │
│  (Missing)  │
└──────┬──────┘
       │ Click "Use My Location"
       ▼
┌─────────────┐
│   Loading   │
└──────┬──────┘
       │ Success
       ▼
┌─────────────┐
│  Captured   │ ──────┐
│  (Success)  │       │ Click "Update"
└──────┬──────┘       │
       │              │
       └──────────────┘

       Submit Enabled ✓
```
