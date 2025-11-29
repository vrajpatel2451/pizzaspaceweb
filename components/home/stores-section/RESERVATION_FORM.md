# Reservation Form Implementation

## Overview
Complete reservation system with form validation, accessibility, and user-friendly UX.

## Components

### 1. **Calendar Component** (`/components/ui/calendar.tsx`)
- Date picker using `react-day-picker`
- Custom styling with brand colors (Orange #F97316)
- Prevents past date selection
- Accessible date selection

### 2. **Reservation Form** (`reservation-form.tsx`)
- Client component with React Hook Form
- Zod schema validation
- Real-time error feedback
- Success state animation
- Toast notifications

### 3. **Store Card** (`store-card.tsx`)
- Enhanced design with gradient icons
- Two action buttons:
  - Get Directions (Google Maps)
  - Order from Store
- Store hours and contact info
- Responsive and accessible

### 4. **Stores Grid** (`stores-grid.tsx`)
- Single column layout for reservation page
- Limits to 3 stores by default
- Responsive spacing

### 5. **Main Section** (`index.tsx`)
- Two-column layout (Desktop):
  - Left: Store cards
  - Right: Sticky reservation form
- Single column (Mobile)
- Server-side data fetching with fallback

## Form Features

### Validation Rules
- **Location**: Required, select from available stores
- **Date**: Required, must be today or future
- **Time**: Required, 30-minute slots from 10 AM - 10:30 PM
- **Guests**: 1-20 people, number input with +/- buttons
- **Name**: Minimum 2 characters
- **Phone**: Valid phone format, minimum 10 digits
- **Special Requests**: Optional textarea
- **Terms**: Must agree to proceed

### UX Features
- Real-time validation on blur
- Clear error messages
- Loading state during submission
- Success animation
- Toast notifications
- Form reset after success
- Accessibility (ARIA labels, error announcements)

### Form Fields

```typescript
interface ReservationFormData {
  storeId: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  phone: string;
  specialRequests?: string;
  agreeToTerms: boolean;
}
```

## Usage

```tsx
import { StoresSection } from "@/components/home/stores-section";

export default function Page() {
  return <StoresSection />;
}
```

## Dependencies

Required packages (already installed):
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration
- `zod` - Schema validation
- `react-day-picker` - Calendar component
- `date-fns` - Date utilities
- `sonner` - Toast notifications

## Accessibility

- All inputs have associated labels
- Required fields marked with asterisk (visual + screen reader)
- Error messages linked with `aria-describedby`
- Invalid fields marked with `aria-invalid`
- Keyboard navigable
- Focus management

## Customization

### Time Slots
Edit `timeSlots` array in `reservation-form.tsx`:

```typescript
const timeSlots = [
  "10:00 AM", "10:30 AM", // ... add more
];
```

### Guest Limits
Change min/max in Zod schema:

```typescript
guests: z.number().min(1).max(20)
```

### Store Display Limit
Pass `maxStores` prop to `StoresGrid`:

```tsx
<StoresGrid stores={stores} maxStores={3} />
```

## API Integration

Replace the mock submission in `onSubmit`:

```typescript
const onSubmit = async (data: ReservationFormData) => {
  setIsSubmitting(true);

  try {
    // Replace with your API call
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      }),
    });

    if (!response.ok) throw new Error('Failed');

    setShowSuccess(true);
    toast.success("Reservation Confirmed!");
  } catch {
    toast.error("Reservation Failed");
  } finally {
    setIsSubmitting(false);
  }
};
```

## Testing Checklist

- [ ] All required fields show errors when empty
- [ ] Phone validation works
- [ ] Cannot select past dates
- [ ] Guest counter works (1-20)
- [ ] Terms checkbox required
- [ ] Success state shows after submission
- [ ] Form resets after success
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader announcements
