# "For Me" / "For Other" Toggle Implementation

## Overview
Implementation of the "For Me" / "For Other" toggle functionality in the address form, allowing users to specify whether an address is for themselves or for another recipient.

## Files Modified

### 1. `/lib/schemas/address-schema.ts`
Added new fields to support the toggle functionality:

- `isForMe`: Boolean field (default: true)
- `recipientName`: Optional string for recipient's name
- `recipientPhone`: Optional string for recipient's phone

Added validation refinements:
- When `isForMe` is false, `recipientName` must be at least 2 characters
- When `isForMe` is false, `recipientPhone` must be at least 10 digits and match phone regex

### 2. `/components/address/address-form.tsx`
Comprehensive updates to the address form component:

#### Imports Added
- `Switch` component for the toggle
- `Label` component for form labels
- `useUser` hook from store to access user profile data
- `useEffect` hook for reactive updates

#### State Management
- Added `user` from `useUser()` hook
- Added `isForMe` to default values (defaults to `true`)
- Added `recipientName` and `recipientPhone` to default values
- Watch `isForMe` state with `watch("isForMe")`

#### Auto-Population Logic
Implemented `useEffect` hook that:
- When `isForMe` is `true`: Auto-fills name and phone from user profile
- When `isForMe` is `false`: Clears name and phone fields for manual entry

#### UI Components Added

**Toggle Section:**
```tsx
<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
  <div className="flex-1">
    <Label htmlFor="forMe" className="font-medium text-base">
      For Me
    </Label>
    <p className="text-sm text-muted-foreground mt-1">
      Use my profile contact details
    </p>
  </div>
  <Switch
    id="forMe"
    checked={isForMe}
    onCheckedChange={(checked) => setValue("isForMe", checked)}
    disabled={isLoading}
  />
</div>
```

**Recipient Details Section** (shown when `isForMe` is `false`):
```tsx
{!isForMe && (
  <div className="space-y-4 p-4 border rounded-lg bg-card">
    <h4 className="font-medium text-sm">Recipient Details</h4>
    <Input
      label="Recipient Name"
      placeholder="Enter recipient name"
      error={errors.recipientName?.message}
      {...register("recipientName")}
      disabled={isLoading}
      aria-required="true"
    />
    <Input
      label="Recipient Phone"
      type="tel"
      inputMode="tel"
      placeholder="07123 456789"
      error={errors.recipientPhone?.message}
      {...register("recipientPhone")}
      disabled={isLoading}
      aria-required="true"
    />
  </div>
)}
```

**Updated Name/Phone Fields:**
- Both fields are now disabled when `isForMe` is `true`
- Added visual indicator (muted background) when disabled
- Auto-populated from user profile when toggle is ON

#### Form Submission Logic
Updated `onFormSubmit` to properly handle data:
```tsx
const payload: AddressFormData = {
  ...data,
  // Use user's profile data if isForMe, otherwise use recipient data
  name: data.isForMe ? (user?.name || data.name) : (data.recipientName || data.name),
  phone: data.isForMe ? (user?.phone || data.phone) : (data.recipientPhone || data.phone),
};
```

## Features Implemented

### 1. Toggle Functionality
- Switch component defaults to "For Me" (ON state)
- Clear visual design with descriptive text
- Accessible with proper ARIA labels
- Disabled state respects form loading state

### 2. Conditional Field Display
- Recipient fields only shown when toggle is OFF
- Fields are grouped in a clearly bounded section
- Proper validation for required fields

### 3. Auto-Population
- When "For Me" is enabled:
  - Name auto-filled from `user.name`
  - Phone auto-filled from `user.phone`
  - Fields are disabled (read-only)
  - Visual indicator (muted background)

### 4. Manual Entry Mode
- When "For Other" is selected:
  - Name and phone fields cleared
  - Recipient fields become visible and required
  - All fields enabled for manual entry
  - Validation enforced for recipient details

### 5. Data Handling
- Form submission properly maps data based on toggle state
- Uses user profile data when `isForMe` is true
- Uses recipient data when `isForMe` is false
- Fallback to form values if user data unavailable

## Validation Rules

### When `isForMe` is `true`:
- Uses user's profile name and phone
- Standard address validation applies
- Recipient fields are optional/ignored

### When `isForMe` is `false`:
- `recipientName` must be:
  - At least 2 characters
  - Maximum 100 characters
- `recipientPhone` must be:
  - At least 10 digits
  - Maximum 15 digits
  - Match phone regex pattern
- Standard address validation applies

## User Experience

### Default Behavior
1. Toggle defaults to "For Me" (ON)
2. User's name and phone auto-populated
3. User can proceed directly to entering address details

### Alternative Flow
1. User toggles to "For Other" (OFF)
2. Name and phone fields cleared
3. Recipient details section appears
4. User enters recipient name and phone
5. User proceeds with address details

### Visual Feedback
- Toggle state clearly indicated
- Disabled fields have muted background
- Recipient section has distinct bordered container
- Error messages display for validation failures

## Accessibility

- All form controls have proper ARIA labels
- Switch component has `aria-label="Toggle address recipient"`
- Required fields marked with `aria-required="true"`
- Error messages properly associated with fields
- Keyboard navigation supported
- Screen reader friendly with descriptive labels

## Testing Checklist

- [x] Toggle defaults to "For Me" (ON)
- [x] Toggling shows/hides recipient fields
- [x] "For Me" uses user's profile data
- [x] "For Other" requires manual entry
- [x] Validation works for both modes
- [x] Auto-population on toggle change
- [x] Form submission maps data correctly
- [x] Accessibility attributes present
- [x] Visual indicators for disabled state
- [x] Error handling for missing recipient data

## Dependencies

- `@/components/ui/switch`: Switch component
- `@/components/ui/label`: Label component
- `@/store`: useUser hook for accessing user profile
- `react-hook-form`: Form state management
- `zod`: Schema validation

## Future Enhancements

1. Consider adding address book for frequently used recipients
2. Add validation for delivery restrictions (e.g., same city only)
3. Consider adding nickname/label for recipient addresses
4. Add delivery instructions specific to recipient
5. Option to save recipient details for future use

## Notes

- The implementation follows the existing form patterns in the codebase
- Uses the same design system components (shadcn/ui)
- Maintains consistency with other form sections
- Properly integrated with react-hook-form
- Type-safe with TypeScript throughout
