import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactInfo = [
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

const openingHours = [
  { days: "Monday - Thursday", hours: "11:00 - 22:00" },
  { days: "Friday - Saturday", hours: "11:00 - 23:00" },
  { days: "Sunday", hours: "12:00 - 21:00" },
];

export function FooterContact() {
  return (
    <div>
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
        Contact Us
      </h3>

      {/* Contact Items */}
      <ul className="space-y-4 mb-6">
        {contactInfo.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
          {openingHours.map((schedule) => (
            <li key={schedule.days} className="flex justify-between text-xs">
              <span className="text-gray-400">{schedule.days}</span>
              <span className="text-gray-300 font-medium">{schedule.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
