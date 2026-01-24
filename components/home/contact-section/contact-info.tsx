'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { ContactInfo as ContactInfoType, OpeningHours } from '@/types';

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  primary: string;
  secondary: string;
  action?: string;
  href?: string;
}

function InfoCard({ icon: Icon, title, primary, secondary, action, href }: InfoCardProps) {
  const CardContent = (
    <div className="flex items-start gap-4">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-0.5">
          {primary}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {secondary}
        </p>
        {action && (
          <p className="text-sm text-orange-500 font-medium mt-2">
            {action}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 dark:border-slate-700"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
      {CardContent}
    </div>
  );
}

interface ContactInfoProps {
  contactInfo: ContactInfoType | null;
  openingHours: OpeningHours[];
}

export function ContactInfo({ contactInfo, openingHours }: ContactInfoProps) {
  // Format address from contact info
  const formatAddress = () => {
    if (!contactInfo) return 'Address not available';

    const parts = [
      contactInfo.addressLine1,
      contactInfo.addressLine2,
      contactInfo.area,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const formatLocation = () => {
    if (!contactInfo) return 'Location not available';

    const parts = [
      contactInfo.city,
      contactInfo.county,
      contactInfo.zip,
    ].filter(Boolean);

    return parts.join(', ');
  };

  // Google Maps URL with coordinates or address
  const getMapUrl = () => {
    if (!contactInfo) return '';

    if (contactInfo.lat && contactInfo.lng) {
      return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${contactInfo.lat},${contactInfo.lng}`;
    }

    const address = `${formatAddress()}, ${formatLocation()}`;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;
  };

  // Format opening hours from backend
  const formatOpeningHoursDisplay = () => {
    if (openingHours.length === 0) {
      return { primary: 'Hours not available', secondary: '' };
    }

    // Group consecutive days with same hours
    const groups: { days: string[]; time: string }[] = [];
    let currentGroup: { days: string[]; time: string } | null = null;

    for (const hour of openingHours) {
      const timeStr = `${hour.startTime} - ${hour.endTime}`;
      if (currentGroup && currentGroup.time === timeStr) {
        currentGroup.days.push(hour.day);
      } else {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { days: [hour.day], time: timeStr };
      }
    }
    if (currentGroup) groups.push(currentGroup);

    // Format for display
    if (groups.length === 1) {
      const g = groups[0];
      const dayRange = g.days.length > 1 ? `${g.days[0]} - ${g.days[g.days.length - 1]}` : g.days[0];
      return { primary: `${dayRange}: ${g.time}`, secondary: '' };
    } else if (groups.length === 2) {
      const g1 = groups[0];
      const g2 = groups[1];
      const dayRange1 = g1.days.length > 1 ? `${g1.days[0]} - ${g1.days[g1.days.length - 1]}` : g1.days[0];
      const dayRange2 = g2.days.length > 1 ? `${g2.days[0]} - ${g2.days[g2.days.length - 1]}` : g2.days[0];
      return { primary: `${dayRange1}: ${g1.time}`, secondary: `${dayRange2}: ${g2.time}` };
    } else {
      // More complex schedule - show first two
      const g1 = groups[0];
      const dayRange1 = g1.days.length > 1 ? `${g1.days[0]} - ${g1.days[g1.days.length - 1]}` : g1.days[0];
      return { primary: `${dayRange1}: ${g1.time}`, secondary: 'View full schedule' };
    }
  };

  const hoursDisplay = formatOpeningHoursDisplay();

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      primary: contactInfo?.phone || '+44 20 1234 5678',
      secondary: 'Available for orders and inquiries',
      action: 'Call us',
      href: contactInfo?.phone ? `tel:${contactInfo.phone}` : undefined,
    },
    {
      icon: Mail,
      title: 'Email',
      primary: contactInfo?.email || 'hello@pizzaspace.com',
      secondary: 'We reply within 24 hours',
      action: 'Email us',
      href: contactInfo?.email ? `mailto:${contactInfo.email}` : undefined,
    },
    {
      icon: MapPin,
      title: 'Location',
      primary: formatAddress(),
      secondary: formatLocation(),
      action: 'Visit us',
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      primary: hoursDisplay.primary,
      secondary: hoursDisplay.secondary,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Get In Touch
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          We&apos;re here to help and answer any questions you might have
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid gap-4">
        {contactMethods.map((method) => (
          <InfoCard
            key={method.title}
            icon={method.icon}
            title={method.title}
            primary={method.primary}
            secondary={method.secondary}
            action={method.action}
            href={method.href}
          />
        ))}
      </div>

      {/* Map Embed (Optional) */}
      {contactInfo?.lat && contactInfo?.lng ? (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm h-64 bg-slate-100 dark:bg-slate-800">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${contactInfo.lng}!3d${contactInfo.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PizzaSpace Location"
          />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Map location not available</p>
        </div>
      )}
    </div>
  );
}
