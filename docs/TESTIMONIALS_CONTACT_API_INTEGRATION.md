# Testimonials and Contact Section API Integration

## Overview

This document describes the implementation of API integration for the Testimonials and Contact sections on the home page. Both sections now fetch data from the backend API and display it dynamically.

## Implementation Summary

### 1. Testimonials Section

**API Endpoint**: `GET /general-ratings/list?page=1&limit=6`

**Files Modified**:
- `/components/home/testimonials-section/index.tsx` - Converted to async server component
- `/components/home/testimonials-section/testimonials-section-client.tsx` - New client component for animations
- `/components/home/testimonials-section/testimonial-card.tsx` - Updated to use GeneralRating type
- `/components/home/testimonials-section/testimonials-carousel.tsx` - Updated to accept testimonials as props

**Key Changes**:

1. **Server Component Data Fetching**:
   - The main `TestimonialsSection` component is now a server component
   - Uses `fetchTestimonials(1, 6)` from `@/lib/api/server-fetchers` to fetch data
   - Passes testimonials data to client component for rendering

2. **Type Updates**:
   - Removed old `Testimonial` interface
   - Now uses `GeneralRating` type from `@/types`
   - Updated all component props and references

3. **TestimonialCard Component**:
   - Displays `personName` instead of `name`
   - Uses `ratings` (number 1-5) instead of `rating`
   - Shows `personTagRole` instead of `title`
   - Conditionally renders `personImage` with fallback to User icon
   - Removed `quote`, `date`, and `isVerified` fields (not in API)
   - Added placeholder text for testimonial content

4. **Empty State Handling**:
   - Shows friendly message if no testimonials are available
   - Encourages users to leave a review

**Data Structure**:
```typescript
interface GeneralRating {
  _id: string;
  personName: string;
  personImage?: string;
  ratings: number; // 1-5
  personTagRole?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Contact Section

**API Endpoint**: `GET /contact-info/published`

**Files Modified**:
- `/components/home/contact-section/index.tsx` - Converted to async server component
- `/components/home/contact-section/contact-info.tsx` - Updated to accept and use API data

**Key Changes**:

1. **Server Component Data Fetching**:
   - The main `ContactSection` component is now a server component
   - Uses `fetchContactInfo()` from `@/lib/api/server-fetchers` to fetch data
   - Passes contact info to the ContactInfo component

2. **ContactInfo Component Updates**:
   - Now accepts `contactInfo` prop of type `ContactInfo | null`
   - Dynamically formats address from API data
   - Shows phone, email, location from API
   - Makes phone and email cards clickable with proper href attributes
   - Conditionally renders map with lat/lng coordinates if available
   - Shows fallback message if map coordinates not available
   - Falls back to default values if API data is null

3. **Immediate Contact Info**:
   - Updated "Need immediate assistance?" section
   - Uses `immediatePhoneNo` and `immediateEmail` from API
   - Only shows if these fields are available
   - Proper tel: and mailto: links

**Data Structure**:
```typescript
interface ContactInfo {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Features Implemented

### Testimonials Section:
- ✅ Fetches testimonials from API using server component
- ✅ Displays person name, rating (stars), role, and image
- ✅ Shows avatar fallback with User icon if no image
- ✅ Empty state message when no testimonials
- ✅ Maintains existing carousel functionality
- ✅ Maintains all animations and styling
- ✅ Full accessibility support maintained

### Contact Section:
- ✅ Fetches contact info from API using server component
- ✅ Dynamic address formatting
- ✅ Clickable phone and email links
- ✅ Google Maps integration with lat/lng
- ✅ Immediate contact info section (conditional)
- ✅ Fallback values for missing data
- ✅ Maintains existing styling and layout

## Error Handling

Both sections handle API failures gracefully:

**Testimonials**:
- If API fails, returns empty array
- Empty state shows "No testimonials available" message
- Carousel handles empty state without breaking

**Contact**:
- If API fails, returns `null`
- Components fall back to default values
- All sections remain functional with fallback data

## Server-Side Rendering

Both sections use React Server Components for optimal performance:
- Data fetched on the server
- Reduces client-side JavaScript
- Better SEO with pre-rendered content
- Fast initial page load
- Client components only for interactive features (carousel controls, animations)

## Testing

To test the implementation:

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Home Page**:
   - Go to `http://localhost:3000`
   - Scroll to testimonials section
   - Scroll to contact section

3. **Verify Testimonials**:
   - Check that testimonials load from API
   - Verify star ratings display correctly
   - Check avatar images or fallback icons
   - Test carousel navigation
   - Check empty state if no testimonials

4. **Verify Contact Section**:
   - Check phone number is from API
   - Check email is from API
   - Verify address is properly formatted
   - Test clickable phone/email links
   - Check map displays if coordinates available
   - Verify immediate contact section shows if available

## API Integration Details

### Server Fetchers Used:

From `/lib/api/server-fetchers.ts`:

```typescript
// Testimonials
export const fetchTestimonials = cache(
  async (page: number = 1, limit: number = 6): Promise<TestimonialsResult>
);

// Contact Info
export const fetchContactInfo = cache(
  async (): Promise<ContactInfo | null>
);
```

Both use React's `cache()` for request deduplication within a single request lifecycle.

### Caching Strategy:

- **Testimonials**: Recommended revalidation every 5 minutes (dynamic content)
- **Contact Info**: Recommended revalidation every 1 hour (semi-static content)

## Future Enhancements

Potential improvements for future iterations:

### Testimonials:
1. Add pagination or "Load More" button
2. Add testimonial text/review content (when API supports it)
3. Add date display (formatted createdAt)
4. Add verified badge functionality
5. Add ability for users to submit reviews (form integration)

### Contact:
1. Integrate with opening hours API for dynamic hours display
2. Add real-time store status (open/closed)
3. Improve Google Maps integration with custom styling
4. Add multiple location support if business expands

## File Structure

```
components/home/
├── testimonials-section/
│   ├── index.tsx                        # Server component (data fetching)
│   ├── testimonials-section-client.tsx # Client component (animations)
│   ├── testimonials-carousel.tsx       # Updated carousel
│   ├── testimonial-card.tsx            # Updated card with API data
│   ├── testimonials-header.tsx         # Unchanged
│   └── carousel-controls.tsx           # Unchanged
├── contact-section/
│   ├── index.tsx                       # Server component (updated)
│   ├── contact-info.tsx                # Updated with API integration
│   ├── contact-form.tsx                # Unchanged
│   └── contact-card.tsx                # Unchanged
```

## Notes

- All changes maintain existing styling and animations
- Components are fully accessible (ARIA labels maintained)
- Mobile-responsive design preserved
- Dark mode support maintained
- Uses CustomImage component for all images per project standards
- TypeScript strict mode compliant
- No breaking changes to component APIs
