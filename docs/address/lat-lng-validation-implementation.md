# Address Lat/Lng Validation Implementation

## Overview
Implemented validation to require latitude and longitude coordinates before allowing address API calls. This prevents addresses from being saved without location data.

## Changes Made

### 1. Schema Updates (`/lib/schemas/address-schema.ts`)

**Changed lat/lng from optional to required:**

```typescript
// Before:
lat: z.number().min(-90).max(90).optional()
long: z.number().min(-180).max(180).optional()

// After:
lat: z.number({
  message: "Please select a location on the map or use 'Use My Location'",
})
.min(-90, "Latitude must be between -90 and 90")
.max(90, "Latitude must be between -90 and 90")

long: z.number({
  message: "Please select a location on the map or use 'Use My Location'",
})
.min(-180, "Longitude must be between -180 and 180")
.max(180, "Longitude must be between -180 and 180")
```

**Key Points:**
- Lat/lng are now **required** fields in the schema
- Validation error message guides users to select location
- Zod v4 syntax used (`message` instead of `required_error`)

### 2. Type Updates (`/types/address.ts`)

**Updated AddAddressData interface:**

```typescript
export interface AddAddressData {
  // ... other fields
  lat: number; // Required: Location must be provided before saving
  long: number; // Required: Location must be provided before saving
  // ... rest of fields
}
```

**Impact:**
- TypeScript will now enforce lat/lng in API calls
- Prevents accidental API calls without coordinates

### 3. UI Components Created

#### Alert Component (`/components/ui/alert.tsx`)
Created reusable Alert component with variants:
- `default` - Standard alert
- `destructive` - Error messages (used for missing location)
- `warning` - Warning messages
- `success` - Success messages

### 4. Form Updates (`/components/address/address-form.tsx`)

#### A. Added Imports
```typescript
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
```

#### B. Location State Tracking
```typescript
const watchLat = watch("lat");
const watchLong = watch("long");
const hasLocation = watchLat !== undefined && watchLong !== undefined;
```

#### C. Location Alert (Top of Form)
Shows validation error when lat/lng missing:

```tsx
{(errors.lat || errors.long) && (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="size-4" />
    <AlertDescription>
      {errors.lat?.message || errors.long?.message}
    </AlertDescription>
  </Alert>
)}
```

#### D. Enhanced Location Section
Replaced simple button with comprehensive status display:

```tsx
<div className="space-y-2">
  <div className="flex justify-between items-center">
    <div className="text-sm">
      {hasLocation ? (
        <div className="flex items-center gap-2 text-green-600">
          <MapPinned className="size-4" />
          <span className="font-medium">Location captured</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="size-4" />
          <span>Location required</span>
        </div>
      )}
    </div>
    <Button
      type="button"
      variant={hasLocation ? "outline" : "default"}
      size="sm"
      onClick={handleGetLocation}
      disabled={isLoading || isGettingLocation}
    >
      {isGettingLocation ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <MapPinned className="size-4" />
      )}
      <span>{hasLocation ? "Update Location" : "Use My Location"}</span>
    </Button>
  </div>
  {hasLocation && (
    <p className="text-xs text-muted-foreground">
      Coordinates: {watchLat?.toFixed(6)}, {watchLong?.toFixed(6)}
    </p>
  )}
</div>
```

**Features:**
- Visual status indicator (green checkmark or warning icon)
- Shows "Location required" when missing
- Shows "Location captured" when set
- Displays coordinates when available
- Button changes to "Update Location" after capture
- Button variant changes (default → outline) after capture

#### E. Submit Button Enhancement
```tsx
<Button
  type="submit"
  loading={isLoading}
  disabled={isLoading || !hasLocation}
  className="flex-1"
>
  {!hasLocation ? "Select Location First" : submitLabel}
</Button>
```

**Behavior:**
- Disabled when `!hasLocation`
- Shows "Select Location First" message when disabled
- Shows normal submit label when location is set

## User Flow

### New Address Creation
1. **Form Opens** → Location shows "Location required" warning
2. **User Fills Form** → Submit button disabled, shows "Select Location First"
3. **User Clicks "Use My Location"** → Geolocation API called
4. **Location Captured** → Green checkmark shows, coordinates displayed
5. **Submit Enabled** → Button shows "Save Address", becomes clickable
6. **Form Submits** → API receives lat/lng in payload

### Editing Existing Address
1. **Form Opens** → Existing lat/lng loaded from address data
2. **Location Shows** → "Location captured" with coordinates
3. **User Can Update** → Click "Update Location" to refresh
4. **Submit Always Enabled** → Existing location already present

### Error Scenarios

#### Missing Location on Submit
- Form validation triggers
- Red alert banner appears at top
- Error message: "Please select a location on the map or use 'Use My Location'"
- Submit button disabled

#### Geolocation Permission Denied
- Toast error: "Location permission denied"
- Form remains in "Location required" state
- User must enable location or use alternative

#### Geolocation Unavailable
- Toast error: "Location information unavailable"
- User can retry

## API Impact

### Before (Optional lat/lng)
```typescript
// API could be called without location
createAddress({
  name: "John",
  phone: "...",
  // lat/lng missing - would succeed
})
```

### After (Required lat/lng)
```typescript
// API MUST include location
createAddress({
  name: "John",
  phone: "...",
  lat: 51.5074,  // Required
  long: -0.1278,  // Required
})
```

**Type Safety:**
- TypeScript enforces lat/lng in all API calls
- Compile-time error if missing
- Runtime validation through Zod schema

## Testing Criteria

### ✅ Validation Tests
- [x] Cannot submit without lat/lng
- [x] Error message shown if missing
- [x] Setting location enables submit
- [x] API call includes lat/lng

### ✅ UI/UX Tests
- [x] "Location required" shown when missing
- [x] "Location captured" shown when set
- [x] Coordinates displayed when available
- [x] Submit button disabled without location
- [x] Submit button text changes based on state

### ✅ Functionality Tests
- [x] "Use My Location" button captures coordinates
- [x] Location can be updated
- [x] Form validation prevents submission
- [x] Geolocation errors handled gracefully

## Accessibility

### Screen Reader Support
- Alert has `role="alert"` for immediate announcement
- Icons have descriptive text alternatives
- Button states clearly communicated
- Error messages linked to form validation

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus management on error
- Button disabled state prevents interaction

## Files Modified

1. `/lib/schemas/address-schema.ts` - Made lat/lng required
2. `/types/address.ts` - Updated interface types
3. `/components/ui/alert.tsx` - Created Alert component
4. `/components/address/address-form.tsx` - Added validation UI

## Files Created

1. `/components/ui/alert.tsx` - Reusable alert component

## Breaking Changes

### API Calls
All address creation/update calls now **require** lat/lng:

```typescript
// This will cause TypeScript error:
createAddress({
  name: "Test",
  // ... missing lat/lng
})

// This is required:
createAddress({
  name: "Test",
  lat: 51.5074,
  long: -0.1278,
  // ...
})
```

### Migration Path
For existing code:
1. Ensure all address creation flows capture location
2. Update any mock/test data to include lat/lng
3. Handle cases where geolocation fails gracefully

## Benefits

1. **Data Integrity** - All addresses have valid coordinates
2. **Type Safety** - TypeScript prevents missing location
3. **User Guidance** - Clear UI feedback on what's needed
4. **Error Prevention** - Form validation catches issues early
5. **Better UX** - Visual confirmation of location capture
6. **Accessibility** - Screen reader friendly validation

## Future Enhancements

Potential improvements:
- Map integration for manual location selection
- Address autocomplete with automatic lat/lng
- Saved locations for quick selection
- Delivery zone validation based on coordinates
- Distance calculations for delivery fees
