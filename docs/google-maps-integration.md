# Google Maps Integration for Address Form

## Overview

The address form now includes Google Maps integration with Places autocomplete, interactive maps, and reverse geocoding capabilities.

## Components Created

### 1. GooglePlacesInput
**File:** `/components/address/google-places-input.tsx`

A search input component with Google Places Autocomplete:
- Real-time address suggestions as user types
- UK-focused results (restricted to "uk" country)
- Keyboard navigation support (Arrow keys, Enter, Escape)
- Debounced API calls (300ms)
- Extracts and parses address components

**Props:**
```typescript
interface GooglePlacesInputProps {
  onPlaceSelect: (place: PlaceResult) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

### 2. AddressMap
**File:** `/components/address/address-map.tsx`

An interactive map component with draggable marker:
- Displays Google Map with custom marker
- Draggable marker for fine-tuning location
- Visual feedback during drag
- Tooltip overlay with instructions
- Customizable height and zoom level

### 3. GoogleMapsProvider
**File:** `/components/address/google-maps-provider.tsx`

Wrapper component that initializes Google Maps API:
- Loads Google Maps API with Places and Geocoding libraries
- Handles API key validation
- Shows error message if API key is missing

### 4. AddressFormWithMaps
**File:** `/components/address/address-form-with-maps.tsx`

Enhanced address form with Google Maps integration:
- Google Places autocomplete search
- "Use my current location" button
- Interactive map with draggable marker
- Auto-filled form fields from selected location
- Reverse geocoding on marker drag
- All existing form features (For Me toggle, address types, etc.)

## Usage Examples

### Basic Usage

```tsx
import { AddressFormWithMaps } from "@/components/address";

function AddAddressPage() {
  const handleSubmit = async (data) => {
    await saveAddress(data);
  };

  return (
    <AddressFormWithMaps
      onSubmit={handleSubmit}
      submitLabel="Save Address"
    />
  );
}
```

## User Flow

1. **Search for Address:**
   - User types in Google Places input
   - Dropdown shows matching addresses
   - User selects an address
   - Form fields auto-populate
   - Map shows selected location

2. **Use Current Location:**
   - User clicks "Use my current location"
   - Browser requests location permission
   - Map centers on current location
   - Reverse geocoding fills address fields

3. **Fine-tune Location:**
   - User drags map marker
   - Address updates via reverse geocoding
   - Lat/lng coordinates update

## Environment Variable

Ensure this is set in `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Files Created

```
components/address/
├── address-form-with-maps.tsx       # New form with Google Maps
├── google-maps-provider.tsx         # Maps API provider
├── google-places-input.tsx          # Autocomplete search
└── address-map.tsx                  # Interactive map with reverse geocoding

lib/schemas/
└── address-schema.ts                # Updated with required lat/long
```
