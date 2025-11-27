import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ContactCard } from './contact-card';

const contactMethods = [
  {
    id: 1,
    icon: Phone,
    title: "Call Us",
    primary: "+1 234 567 8900",
    secondary: "Mon-Sun: 10AM - 11PM"
  },
  {
    id: 2,
    icon: Mail,
    title: "Email Us",
    primary: "info@pizzaspace.com",
    secondary: "We'll respond within 24hrs"
  },
  {
    id: 3,
    icon: MapPin,
    title: "Visit Us",
    primary: "123 Pizza Street",
    secondary: "Food City, FC 12345"
  }
];

export function ContactSection() {
  return (
    <section className="bg-slate-50 py-16 relative" aria-labelledby="contact-heading">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
            Get In Touch
          </span>
          <h2 id="contact-heading" className="text-3xl font-bold mt-4 text-slate-800">
            Contact Us
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Have questions or want to make a reservation? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-10">
          {contactMethods.map(method => (
            <ContactCard key={method.id} method={method} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md"
          >
            View Full Contact Page
          </Link>
        </div>
      </div>
    </section>
  );
}
