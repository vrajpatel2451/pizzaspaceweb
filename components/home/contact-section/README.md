# Contact Section Components

A comprehensive contact section with an inline form, contact information cards, and map integration for the PizzaSpace website.

## Components Overview

### 1. ContactSection (Main Component)
**File:** `/components/home/contact-section/index.tsx`

The main section that orchestrates the entire contact area with a two-column responsive layout.

**Features:**
- Responsive grid layout (2 columns on desktop, stacked on mobile)
- Contact info + map on left
- Contact form on right
- Additional quick-action links at bottom
- Dark mode support

**Usage:**
```tsx
import { ContactSection } from '@/components/home/contact-section';

export default function HomePage() {
  return (
    <div>
      {/* Other sections */}
      <ContactSection />
    </div>
  );
}
```

---

### 2. ContactInfo Component
**File:** `/components/home/contact-section/contact-info.tsx`

Displays contact information cards and embedded map.

**Features:**
- 4 info cards: Phone, Email, Location, Hours
- Icon-based design with clear hierarchy
- Embedded Google Maps iframe
- Hover effects and transitions
- Fully accessible

**Contact Cards Include:**
- Phone: +1 (555) 123-4567
- Email: hello@pizzaspace.com
- Location: 123 Pizza Street, Food District
- Hours: Operating hours display

---

### 3. ContactForm Component
**File:** `/components/home/contact-section/contact-form.tsx`

A client-side form with comprehensive validation and UX features.

**Features:**
- React Hook Form for form state management
- Zod schema validation
- Real-time field validation
- Loading states during submission
- Success/error message animations
- Privacy policy checkbox
- Character count for message field
- Fully accessible with ARIA attributes

**Form Fields:**
1. **Full Name** (required)
   - Min 2 characters
   - Max 50 characters

2. **Email** (required)
   - Email format validation

3. **Phone** (optional)
   - Phone number format validation

4. **Subject** (required dropdown)
   - General Inquiry
   - Order Issue
   - Feedback
   - Partnership
   - Other

5. **Message** (required)
   - Min 10 characters
   - Max 500 characters
   - Character counter

6. **Privacy Policy** (required checkbox)
   - Links to privacy and terms pages

**Validation Schema:**
```typescript
const contactFormSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s()+-]+$/).optional().or(z.literal('')),
  subject: z.string().min(1),
  message: z.string().min(10).max(500),
  acceptPrivacy: z.boolean().refine((val) => val === true),
});
```

---

## Form States

The contact form handles four distinct states:

1. **idle** - Default state, ready for input
2. **submitting** - Form is being submitted (loading state)
3. **success** - Submission successful (green success message)
4. **error** - Submission failed (red error message)

Success and error messages auto-dismiss after 5 seconds.

---

## API Integration

Currently, the form simulates an API call. To integrate with a real backend:

**Replace this section in contact-form.tsx:**
```typescript
// Current (line 84-89)
try {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('Form data:', data);
  // ...
}
```

**With actual API call:**
```typescript
try {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Submission failed');

  const result = await response.json();
  console.log('Success:', result);
  // ...
}
```

---

## Customization

### Update Contact Information

Edit the `contactMethods` array in **contact-info.tsx**:

```typescript
const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    primary: 'YOUR_PHONE_NUMBER',
    secondary: 'YOUR_HOURS',
    action: 'Call us',
  },
  // ... other methods
];
```

### Update Map Location

Replace the Google Maps embed URL in **contact-info.tsx** (line 109):

```typescript
<iframe
  src="YOUR_GOOGLE_MAPS_EMBED_URL"
  // ...
/>
```

### Modify Form Subjects

Update the subject dropdown options in **contact-form.tsx** (line 188-194):

```tsx
<SelectContent>
  <SelectItem value="general">General Inquiry</SelectItem>
  <SelectItem value="custom">Your Custom Option</SelectItem>
  {/* Add more options */}
</SelectContent>
```

---

## Accessibility Features

All components follow WCAG 2.1 AA standards:

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Error announcements with `role="alert"`
- Proper label associations
- Color contrast compliance
- Screen reader friendly

---

## Dependencies

**Required packages:**
```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "lucide-react": "^0.x",
  "framer-motion": "^12.x"
}
```

**shadcn/ui components used:**
- Button
- Input
- TextArea
- Select
- Checkbox

---

## Responsive Design

The contact section adapts to all screen sizes:

**Mobile (< 1024px):**
- Stacked layout (form appears first, then contact info)
- Full-width cards
- Condensed spacing

**Desktop (>= 1024px):**
- Two-column grid layout
- Contact info on left
- Form on right
- Larger spacing and padding

---

## Dark Mode Support

All components include full dark mode support using Tailwind's `dark:` variant:

- Background colors adapt
- Text colors adjust for readability
- Border colors change
- All interactive states maintain contrast

---

## Browser Support

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

**Optimizations:**
- Client-side form validation (no server roundtrip)
- Debounced validation on field blur
- Lazy-loaded map iframe
- Minimal re-renders with React Hook Form
- Optimized animations with Framer Motion

---

## Future Enhancements

Potential improvements:
- [ ] File attachment support
- [ ] Email verification before submission
- [ ] Rate limiting/spam protection
- [ ] Multi-language support
- [ ] Live chat integration
- [ ] Delivery tracking lookup
