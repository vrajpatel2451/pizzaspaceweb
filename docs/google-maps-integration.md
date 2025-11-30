# Google Maps Integration - Pizza Space Contact Page

## Overview

Successfully integrated Google Maps into the Pizza Space Contact page using `@vis.gl/react-google-maps` library. The map displays the Pizza Space headquarters location and all active store locations with interactive markers and info windows.

## Implementation Details

### File Modified
- **Location**: `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/contact/map-section/index.tsx`

### Dependencies Installed
```bash
npm install @vis.gl/react-google-maps
```

### Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

#### How to Get a Google Maps API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for future enhancements)
4. Go to "Credentials" and create an API key
5. Restrict the API key to your domain for security
6. Copy the API key to your `.env.local` file

## Features Implemented

### Map Display
- **Responsive Design**: 300px height on mobile, 400px on desktop
- **Cooperative Gesture Handling**: Prevents accidental map zooming while scrolling
- **Clean Map Style**: POI labels disabled for cleaner appearance
- **Centered on HQ**: Map centers on Pizza Space headquarters in London (51.5074, -0.1278)

### Headquarters Marker
- **Custom Orange Marker**: Matches brand color (#F97316)
- **Distinctive Design**: Larger marker (40x40px) with MapPin icon
- **Interactive Info Window**: Shows HQ name, address, and "Get Directions" button
- **Location**: London coordinates (51.5074, -0.1278)

### Store Markers
- **Dynamic Loading**: Fetches all active stores from API using `getStores()`
- **Blue Markers**: Smaller markers (32x32px) to differentiate from HQ
- **Store Info Windows**: Display store name, full address, phone number, and directions button
- **Clickable Markers**: Click to view store details in info window

### Navigation Features
- **Get Directions Button**: Opens Google Maps with directions from user's location
- **External Links**: Opens in new tab for better UX
- **HQ Directions**: Dedicated handler for headquarters directions
- **Store Directions**: Individual direction links for each store location

### Error Handling
- **API Key Validation**: Shows friendly error message if API key is missing
- **Loading States**: Prevents rendering store markers until data is loaded
- **API Errors**: Graceful error handling for store fetch failures
- **Fallback UI**: Clean error display if configuration is missing

### Accessibility
- **ARIA Labels**: Proper section labeling with `aria-labelledby`
- **Keyboard Navigation**: Full keyboard support via Google Maps
- **Screen Reader Support**: Semantic HTML structure
- **Motion Preferences**: Respects `prefers-reduced-motion` setting

## Component Structure

```tsx
<APIProvider apiKey={apiKey}>
  <Map>
    {/* HQ Marker with Orange styling */}
    <AdvancedMarker position={HQ_LOCATION}>
      {/* Custom orange marker */}
    </AdvancedMarker>

    {/* HQ Info Window */}
    <InfoWindow>
      {/* Name, address, directions button */}
    </InfoWindow>

    {/* Store Markers with Blue styling */}
    {stores.map(store => (
      <AdvancedMarker position={store}>
        {/* Custom blue marker */}
      </AdvancedMarker>
    ))}

    {/* Store Info Windows */}
    {stores.map(store => (
      <InfoWindow>
        {/* Store details and directions */}
      </InfoWindow>
    ))}
  </Map>
</APIProvider>
```

## TypeScript Types Used

```typescript
interface StoreResponse {
  _id: string;
  name: string;
  lat: number;
  long: number;
  line1: string;
  line2: string;
  city: string;
  zip: string;
  phone: string;
  // ... other fields
}

const HQ_LOCATION = {
  lat: 51.5074,
  lng: -0.1278,
  name: "Pizza Space HQ",
  address: "123 Pizza Lane, London, UK EC1A 1BB"
};
```

## State Management

```typescript
const [stores, setStores] = useState<StoreResponse[]>([]);
const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
```

- **stores**: Array of all active store locations
- **selectedMarker**: Tracks which marker's info window is open
- **loading**: Prevents rendering stores until API call completes

## API Integration

Uses the existing `getStores` API from `/lib/api/stores.ts`:

```typescript
const response = await getStores({ isActive: true });
if (response.statusCode === 200 && response.data) {
  setStores(response.data.data);
}
```

## Styling Details

### Brand Colors
- **HQ Marker**: `bg-orange-500` (#F97316)
- **Store Markers**: `bg-blue-500` (for differentiation)
- **Buttons**: Orange theme matching brand

### Responsive Heights
- **Mobile**: `h-[300px]`
- **Desktop**: `md:h-[400px]`

### Animation
- Uses Framer Motion for smooth entrance animations
- Respects reduced motion preferences
- Staggered animations for visual hierarchy

## Browser Compatibility

- Chrome/Edge (Chromium): Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch gestures

## Performance Considerations

- **Lazy Loading**: Stores only fetch once on component mount
- **Conditional Rendering**: Store markers only render after loading completes
- **Single Info Window**: Only one info window open at a time
- **Optimized Markers**: Custom markers use CSS instead of images

## Security

- API key stored in environment variable (not committed to version control)
- Production API key should be restricted to your domain
- Consider implementing IP restrictions in Google Cloud Console

## Future Enhancements

Potential improvements for future iterations:

1. **Dark Mode Map Styling**: Custom map styles for dark theme
2. **Clustering**: Marker clustering for areas with many stores
3. **User Location**: Show user's current location on map
4. **Distance Calculation**: Show distance to each store
5. **Search**: Filter stores by location/address
6. **Directions Panel**: Show step-by-step directions in-page
7. **Store Hours**: Display opening hours in info windows
8. **Street View**: Add Street View integration for store locations

## Testing

Build completed successfully with no errors:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (9/9)
```

Linting passed with no errors related to the map component:
```bash
npm run lint
# ✓ No errors in map-section component
```

## Troubleshooting

### Map Not Displaying
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Check browser console for API errors
- Ensure Maps JavaScript API is enabled in Google Cloud Console

### Markers Not Appearing
- Check that stores API is returning data
- Verify store coordinates are valid (lat/lng format)
- Check browser console for errors

### Directions Not Working
- Ensure coordinates are correctly formatted
- Check that `window.open` is not blocked by popup blocker
- Verify Google Maps app/website is accessible

## Support

For issues or questions:
1. Check environment variables are correctly configured
2. Verify Google Maps API quota and billing
3. Review browser console for error messages
4. Check network tab for failed API requests
