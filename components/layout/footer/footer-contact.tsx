import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { formatAddress, formatOpeningHours } from "@/lib/api/server-fetchers";
import type { ContactInfo, OpeningHours } from "@/types";

// Fallback data
const fallbackContactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    content: "123 Pizza Street, London, SW1A 1AA",
    href: "https://maps.google.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    content: "+44 20 1234 5678",
    href: "tel:+442012345678",
  },
  {
    icon: Mail,
    label: "Email Us",
    content: "hello@pizzaspace.com",
    href: "mailto:hello@pizzaspace.com",
  },
];

const fallbackOpeningHours = [
  "Monday - Thursday: 11:00 AM - 10:00 PM",
  "Friday - Saturday: 11:00 AM - 11:00 PM",
  "Sunday: 12:00 PM - 9:00 PM",
];

interface FooterContactProps {
  contactInfo: ContactInfo | null;
  openingHours: OpeningHours[];
}

export function FooterContact({
  contactInfo,
  openingHours,
}: FooterContactProps) {
  // Build contact info array from API data or use fallback
  const contactItems = contactInfo
    ? [
        {
          icon: MapPin,
          label: "Visit Us",
          content: formatAddress(contactInfo),
          href: contactInfo.lat && contactInfo.lng
            ? `https://www.google.com/maps?q=${contactInfo.lat},${contactInfo.lng}`
            : "https://maps.google.com",
        },
        {
          icon: Phone,
          label: "Call Us",
          content: contactInfo.phone,
          href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
        },
        {
          icon: Mail,
          label: "Email Us",
          content: contactInfo.email,
          href: `mailto:${contactInfo.email}`,
        },
      ]
    : fallbackContactInfo;

  // Format opening hours or use fallback
  const formattedHours =
    openingHours.length > 0
      ? formatOpeningHours(openingHours)
      : fallbackOpeningHours;

  return (
    <div>
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
        Contact Us
      </h3>

      {/* Contact Items */}
      <ul className="space-y-4 mb-6">
        {contactItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-navy-800 group-hover:bg-primary-500 flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs">{item.label}</span>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">
                    {item.content}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Opening Hours */}
      <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary-500" />
          <span className="text-white font-medium text-sm">Opening Hours</span>
        </div>
        <ul className="space-y-2">
          {formattedHours.map((schedule, index) => {
            // Parse the formatted string "Day(s): Time"
            const [days, time] = schedule.includes(":")
              ? schedule.split(": ")
              : [schedule, ""];

            return (
              <li key={index} className="flex justify-between text-xs">
                <span className="text-gray-400">{days}</span>
                {time && (
                  <span className="text-gray-300 font-medium">{time}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
