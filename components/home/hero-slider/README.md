# Hero Slider Component

A full-width, auto-playing hero carousel built with Embla Carousel for the Pizza Space home page.

## Features

- **Auto-play**: Slides transition automatically every 5 seconds
- **Pause on Hover**: Auto-play pauses when user hovers over the slider
- **Touch/Swipe Support**: Mobile-friendly swipe gestures
- **Keyboard Navigation**: Use arrow keys to navigate slides
- **Smooth Transitions**: Smooth slide animations powered by Embla Carousel
- **Responsive Design**: Adapts to all screen sizes (60vh mobile, 70vh desktop)
- **Navigation Controls**: Circular prev/next buttons with hover effects
- **Slide Indicators**: Visual dots showing current slide position
- **Accessibility**: Proper ARIA labels and keyboard support

## Component Structure

```
components/home/hero-slider/
├── index.tsx              # Main slider component (Client Component)
├── hero-slide.tsx         # Individual slide component
├── slider-controls.tsx    # Prev/Next navigation buttons
├── types.ts              # TypeScript types and slide data
└── README.md             # This file
```

## Usage

### Basic Usage

```tsx
import { HeroSlider } from "@/components/home/hero-slider";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      {/* Rest of your page content */}
    </div>
  );
}
```

### Test Page

Visit `/test-hero` to see the hero slider in action.

## Slide Configuration

Edit `/components/home/hero-slider/types.ts` to customize slides:

```tsx
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Your Title",
    description: "Your description",
    image: "/images/hero/your-image.jpg",
    cta: { text: "Button Text", href: "/your-link" },
  },
  // Add more slides...
];
```

## Images

Place hero images in `/public/images/hero/`:

- **Format**: JPG, PNG, or SVG
- **Recommended Size**: 1920x1080px (16:9 aspect ratio)
- **File Size**: Under 200KB each (optimize for web)
- **Current Images**: Placeholder SVG gradients (slide1.svg, slide2.svg, slide3.svg)

See `/public/images/hero/README.md` for detailed image guidelines.

## Customization

### Adjust Auto-play Duration

In `/components/home/hero-slider/index.tsx`:

```tsx
Autoplay({
  delay: 5000, // Change to desired milliseconds
  stopOnInteraction: false,
  stopOnMouseEnter: true,
})
```

### Change Slider Height

In `/components/home/hero-slider/index.tsx`:

```tsx
<div
  ref={emblaRef}
  className="h-[60vh] min-h-[400px] overflow-hidden md:h-[70vh]"
  //        ^^^^^^                                    ^^^^^^
  // Adjust these values
>
```

### Modify Button Styles

Edit `/components/home/hero-slider/hero-slide.tsx`:

```tsx
<Button
  size="lg"
  className="bg-white text-gray-900 hover:bg-white/90 hover:scale-105 shadow-xl"
  //        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Customize button appearance
>
```

### Change Navigation Button Position

In `/components/home/hero-slider/slider-controls.tsx`:

```tsx
className="absolute left-4 ... md:left-8"
//                  ^^^^^^      ^^^^^^^^
// Adjust left/right positioning
```

## Technical Details

### Dependencies

- `embla-carousel-react` - React wrapper for Embla Carousel
- `embla-carousel-autoplay` - Auto-play plugin
- `next/image` - Optimized image loading
- `next/link` - Client-side navigation
- `lucide-react` - Icons (ChevronLeft, ChevronRight)

### Performance

- Images use Next.js Image component for optimization
- GPU-accelerated animations (transform and opacity only)
- Lazy loading for off-screen slides
- Responsive images with `sizes="100vw"`

### Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support (left/right arrow keys)
- Focus states on navigation controls
- Semantic HTML structure

## Browser Support

Works on all modern browsers that support:
- CSS Flexbox
- CSS Transforms
- Touch events (for mobile swipe)

## Troubleshooting

### Images Not Loading

1. Check that images exist in `/public/images/hero/`
2. Verify file paths in `types.ts` match actual filenames
3. Ensure images are optimized and not too large

### Auto-play Not Working

1. Check browser console for errors
2. Verify Embla Carousel plugins are installed
3. Ensure component is a Client Component (`"use client"` directive)

### Buttons Not Responsive

1. Check z-index values (controls should be z-10)
2. Verify button selectors in event handlers
3. Test on different screen sizes

## Future Enhancements

Potential improvements:

- [ ] Add video background support
- [ ] Implement lazy loading for slides
- [ ] Add transition effects (fade, zoom)
- [ ] Support for vertical sliding
- [ ] Progress bar showing auto-play timer
- [ ] Full-screen mode option
- [ ] Analytics tracking for slide interactions

## License

Part of the Pizza Space project.
