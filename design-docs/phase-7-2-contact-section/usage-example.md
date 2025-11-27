// Example: How to use ContactSection in your home page

import { ContactSection } from '@/components/home/contact-section';

export default function HomePage() {
  return (
    <main>
      {/* Other home page sections */}

      {/* Contact Section */}
      <ContactSection />

      {/* Additional sections */}
    </main>
  );
}

// ============================================
// Advanced Example: Customizing Contact Info
// ============================================

// If you need to customize the contact information,
// you can modify the contactMethods array in index.tsx:

/*
const contactMethods = [
  {
    id: 1,
    icon: Phone,
    title: "Call Us",
    primary: "+1 (555) 123-4567",  // Your phone number
    secondary: "Mon-Fri: 9AM - 10PM"  // Your hours
  },
  {
    id: 2,
    icon: Mail,
    title: "Email Us",
    primary: "hello@yourdomain.com",  // Your email
    secondary: "24-hour response time"  // Your response time
  },
  {
    id: 3,
    icon: MapPin,
    title: "Visit Us",
    primary: "456 Your Street",  // Your address
    secondary: "City, State 12345"  // Your location
  }
];
*/

// ============================================
// Example: Adding More Contact Methods
// ============================================

/*
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const contactMethods = [
  // Existing methods...
  {
    id: 4,
    icon: MessageCircle,
    title: "Live Chat",
    primary: "Available 24/7",
    secondary: "Instant support"
  }
];

// Then update the grid to accommodate more columns:
// className="grid grid-cols-1 md:grid-cols-4 gap-8"
*/

// ============================================
// Example: Full Page Layout with ContactSection
// ============================================

/*
import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { MenuHighlights } from '@/components/home/menu-highlights';
import { ContactSection } from '@/components/home/contact-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <MenuHighlights />
      <ContactSection />
    </main>
  );
}
*/
