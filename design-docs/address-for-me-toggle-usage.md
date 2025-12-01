# "For Me" / "For Other" Toggle - Usage Guide

## Overview
The address form now includes a toggle that allows users to specify whether the delivery address is for themselves or for another recipient. This guide explains how the feature works and how users interact with it.

## User Flow

### Scenario 1: Delivery for Myself (Default)

1. User opens the address form
2. Toggle is ON by default ("For Me")
3. Name field auto-populated with: "John Doe" (from user profile)
4. Phone field auto-populated with: "07123456789" (from user profile)
5. Both fields are disabled (grayed out)
6. User enters address details (line1, line2, area, county, country, zip)
7. User selects location
8. User selects address type (Home/Work/Other)
9. User clicks "Save Address"
10. Address saved with user's profile name and phone

### Scenario 2: Delivery for Someone Else

1. User opens the address form
2. User toggles OFF "For Me" switch
3. Name and phone fields are cleared and enabled
4. New section appears: "Recipient Details"
5. User enters recipient name: "Jane Smith"
6. User enters recipient phone: "07987654321"
7. User enters address details
8. User selects location
9. User selects address type
10. User clicks "Save Address"
11. Address saved with recipient's name and phone

## UI Elements

### Toggle Section
```
┌─────────────────────────────────────────────┐
│ For Me                            [●─────○] │
│ Use my profile contact details              │
└─────────────────────────────────────────────┘
```

### When Toggle is ON (For Me)
```
┌─────────────────────────────────────────────┐
│ Full Name                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ John Doe (from profile) [DISABLED]      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Phone Number                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ 07123456789 (from profile) [DISABLED]   │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### When Toggle is OFF (For Other)
```
┌─────────────────────────────────────────────┐
│ Recipient Details                            │
│ ┌─────────────────────────────────────────┐ │
│ │ Recipient Name *                        │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Enter recipient name                │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Recipient Phone *                       │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ 07123 456789                        │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Full Name (cleared, enabled)                 │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Phone Number (cleared, enabled)              │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Validation Behavior

### When "For Me" is ON
- Name and phone are auto-populated from user profile
- No validation needed for these fields (taken from verified profile)
- Standard address field validation applies

### When "For Other" is OFF
- Recipient name required (min 2 characters)
- Recipient phone required (min 10 digits, valid format)
- Both name and phone in main section also filled from recipient fields
- Standard address field validation applies

## Error Messages

### Missing Recipient Name
```
Recipient name is required when address is not for you
```

### Missing Recipient Phone
```
Recipient phone is required when address is not for you
```

### Invalid Phone Format
```
Please enter a valid phone number
```

## Data Structure

### When isForMe = true
```json
{
  "name": "John Doe",           // From user.name
  "phone": "07123456789",       // From user.phone
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "area": "London",
  "county": "Greater London",
  "country": "United Kingdom",
  "zip": "SW1A 1AA",
  "lat": 51.5074,
  "long": -0.1278,
  "type": "home",
  "isDefault": true,
  "isForMe": true,
  "recipientName": "",          // Not used
  "recipientPhone": ""          // Not used
}
```

### When isForMe = false
```json
{
  "name": "Jane Smith",         // From recipientName
  "phone": "07987654321",       // From recipientPhone
  "line1": "456 Oak Avenue",
  "line2": "",
  "area": "Manchester",
  "county": "Greater Manchester",
  "country": "United Kingdom",
  "zip": "M1 1AA",
  "lat": 53.4808,
  "long": -2.2426,
  "type": "home",
  "isDefault": false,
  "isForMe": false,
  "recipientName": "Jane Smith",
  "recipientPhone": "07987654321"
}
```

## Use Cases

### 1. Birthday Gift Delivery
User wants to send a pizza to a friend for their birthday:
1. Toggle OFF "For Me"
2. Enter friend's name and phone
3. Enter friend's address
4. Save as "Friend's Place" (Other type)

### 2. Office Lunch Order
User ordering for themselves at work:
1. Toggle ON "For Me" (default)
2. Profile details auto-filled
3. Enter office address
4. Save as "Work" type

### 3. Family Delivery
User ordering for parents:
1. Toggle OFF "For Me"
2. Enter parent's name and phone
3. Enter parent's home address
4. Save as "Parent's Home" (Other type)

### 4. Multiple Addresses for Self
User has home and work addresses:
1. For home: Toggle ON, enter home address
2. For work: Toggle ON, enter work address
3. Both use same profile name/phone
4. Different address types

## Accessibility Features

- Toggle is keyboard accessible (Tab to focus, Space to toggle)
- Screen readers announce: "Toggle address recipient"
- Disabled fields are clearly indicated
- Error messages are associated with fields
- All fields have proper labels
- Required fields marked with asterisk and aria-required

## Mobile Responsiveness

- Toggle works the same on mobile
- Recipient details section stacks nicely
- Fields are full-width on mobile
- Touch-friendly toggle switch
- Error messages display clearly

## Edge Cases Handled

1. **User not logged in**: Should not happen as form is in protected route
2. **Missing user profile data**: Form allows manual entry as fallback
3. **Toggle switched mid-entry**: Form clears/populates fields appropriately
4. **Editing existing address**: Default values preserve isForMe state
5. **Validation errors**: Clear error messages for all field types

## Future Enhancements

1. **Address Book for Recipients**: Save frequently used recipient details
2. **Delivery Instructions**: Add recipient-specific delivery notes
3. **Contact Verification**: Send SMS to verify recipient phone
4. **Gift Message**: Add optional message for recipient
5. **Preferred Delivery Time**: Allow recipient to set preferences

## Testing Scenarios

### Test Case 1: Default Behavior
- Open form
- Verify toggle is ON
- Verify name/phone auto-populated
- Verify fields are disabled

### Test Case 2: Toggle to "For Other"
- Toggle OFF
- Verify recipient section appears
- Verify name/phone fields cleared
- Verify fields are enabled

### Test Case 3: Toggle Back to "For Me"
- Toggle OFF, then ON again
- Verify recipient section disappears
- Verify name/phone re-populated from profile
- Verify fields are disabled again

### Test Case 4: Submit with "For Me"
- Keep toggle ON
- Fill address details
- Submit form
- Verify saved with user's name/phone

### Test Case 5: Submit with "For Other"
- Toggle OFF
- Enter recipient details
- Fill address details
- Submit form
- Verify saved with recipient's name/phone

### Test Case 6: Validation Errors
- Toggle OFF
- Leave recipient fields empty
- Try to submit
- Verify error messages appear

### Test Case 7: Edit Existing Address
- Load existing address with isForMe=true
- Verify toggle is ON
- Verify data loaded correctly

### Test Case 8: Edit Existing "For Other" Address
- Load existing address with isForMe=false
- Verify toggle is OFF
- Verify recipient section visible
- Verify recipient data loaded correctly
