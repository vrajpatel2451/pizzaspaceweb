'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  primary: string;
  secondary: string;
  action?: string;
}

function InfoCard({ icon: Icon, title, primary, secondary, action }: InfoCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
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
    </div>
  );
}

export function ContactInfo() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      primary: '+1 (555) 123-4567',
      secondary: 'Mon-Sun, 10:00 AM - 11:00 PM',
      action: 'Call us',
    },
    {
      icon: Mail,
      title: 'Email',
      primary: 'hello@pizzaspace.com',
      secondary: 'We reply within 24 hours',
      action: 'Email us',
    },
    {
      icon: MapPin,
      title: 'Location',
      primary: '123 Pizza Street, Food District',
      secondary: 'New York, NY 10001',
      action: 'Visit us',
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      primary: 'Mon-Thu: 10:00 AM - 11:00 PM',
      secondary: 'Fri-Sun: 10:00 AM - 12:00 AM',
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
          />
        ))}
      </div>

      {/* Map Embed (Optional) */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm h-64 bg-slate-100 dark:bg-slate-800">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="PizzaSpace Location"
        />
      </div>
    </div>
  );
}
