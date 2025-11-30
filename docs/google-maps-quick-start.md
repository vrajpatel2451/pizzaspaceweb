# Google Maps Integration - Quick Start Guide

## Installation Complete

The Google Maps integration has been successfully added to the Pizza Space Contact page.

## What Was Done

1. **Installed Package**: `@vis.gl/react-google-maps` library
2. **Updated Component**: `/components/contact/map-section/index.tsx`
3. **API Integration**: Connected to existing `getStores` API
4. **Responsive Design**: Mobile (300px) and Desktop (400px) heights

## Setup Required

### Step 1: Add API Key

Create or update `.env.local` in the project root:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 2: Get Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Copy the key to `.env.local`

### Step 3: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000/contact to see the map.

## Features

- **Orange HQ Marker**: Main Pizza Space headquarters in London
- **Blue Store Markers**: All active store locations
- **Info Windows**: Click markers to see details
- **Get Directions**: Opens Google Maps for navigation
- **Responsive**: Works on mobile and desktop
- **Error Handling**: Graceful fallbacks if API key missing

## Key Files

- **Component**: `/components/contact/map-section/index.tsx`
- **API**: `/lib/api/stores.ts` (existing, unchanged)
- **Types**: `/types/store.ts` (existing, unchanged)
- **Documentation**: `/docs/google-maps-integration.md` (detailed guide)

## Build Status

- Build: PASSED
- Linting: PASSED
- TypeScript: No errors
- Runtime: Ready to deploy

## Next Steps

1. Add your Google Maps API key to `.env.local`
2. Test the map on the contact page
3. (Optional) Restrict API key to your domain in Google Cloud Console
4. (Optional) Customize HQ location coordinates if needed

## Current Configuration

```typescript
// HQ Location (London)
const HQ_LOCATION = {
  lat: 51.5074,
  lng: -0.1278,
  name: "Pizza Space HQ",
  address: "123 Pizza Lane, London, UK EC1A 1BB"
};
```

To change HQ location, edit these values in the component.
