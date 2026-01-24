"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactInfo as ContactInfoType, OpeningHours } from "@/types";
import { formatOpeningHours } from "@/lib/api/server-fetchers";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  ariaLabel: string;
  delay?: number;
  clickable?: boolean;
  href?: string;
}

function ContactInfoCard({ icon, title, content, ariaLabel, delay = 0, clickable = false, href }: ContactInfoCardProps) {
  const contentArray = Array.isArray(content) ? content : [content];
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    const element = clickable && href ? linkRef.current : cardRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [delay, clickable, href]);

  const cardContent = (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40",
          "hover:scale-110 hover:rotate-[5deg] motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0",
          isVisible ? "scale-100" : "scale-0"
        )}
        style={{ transitionDelay: isVisible ? `${delay * 1000 + 100}ms` : "0ms" }}
      >
        <div className="text-orange-500 dark:text-orange-400">
          {icon}
        </div>
      </div>
      <div
        className={cn(
          "flex-1 min-w-0 transition-all duration-400 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
        )}
        style={{ transitionDelay: isVisible ? `${delay * 1000 + 200}ms` : "0ms" }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
          {title}
        </h3>
        {contentArray.map((line, index) => (
          <p
            key={index}
            className={cn(
              "text-gray-600 dark:text-gray-300 text-sm break-words",
              clickable && "hover:text-orange-600 dark:hover:text-orange-400"
            )}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  if (clickable && href) {
    return (
      <a
        ref={linkRef}
        href={href}
        className={cn(
          "block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md dark:shadow-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-300",
          "hover:translate-x-1 motion-reduce:hover:translate-x-0",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-7.5"
        )}
        style={{ transitionDuration: "500ms" }}
        aria-label={ariaLabel}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md dark:shadow-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-300",
        "hover:translate-x-1 motion-reduce:hover:translate-x-0",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-7.5"
      )}
      style={{ transitionDuration: "500ms" }}
      aria-label={ariaLabel}
    >
      {cardContent}
    </div>
  );
}

interface ContactInfoProps {
  contactInfo: ContactInfoType | null;
  openingHours: OpeningHours[];
}

export function ContactInfo({ contactInfo, openingHours }: ContactInfoProps) {
  // Build address lines
  const addressLines = contactInfo ? [
    contactInfo.addressLine1,
    contactInfo.addressLine2,
    contactInfo.area,
    contactInfo.city,
    contactInfo.county,
    contactInfo.zip,
  ].filter(Boolean) : [];

  // Format phone for tel: link
  const phoneHref = contactInfo?.immediatePhoneNo
    ? `tel:${contactInfo.immediatePhoneNo.replace(/\s+/g, '')}`
    : contactInfo?.phone
    ? `tel:${contactInfo.phone.replace(/\s+/g, '')}`
    : undefined;

  // Email href
  const emailHref = contactInfo?.immediateEmail
    ? `mailto:${contactInfo.immediateEmail}`
    : contactInfo?.email
    ? `mailto:${contactInfo.email}`
    : undefined;

  // Format opening hours
  const formattedHours = openingHours.length > 0 ? formatOpeningHours(openingHours) : ["Hours not available"];

  return (
    <div className="space-y-4" role="list" aria-label="Contact information">
      {/* Address */}
      {addressLines.length > 0 && (
        <ContactInfoCard
          icon={<MapPin className="w-6 h-6" />}
          title="Our Address"
          content={addressLines}
          ariaLabel="Our office address"
          delay={0}
        />
      )}

      {/* Phone */}
      {(contactInfo?.phone || contactInfo?.immediatePhoneNo) && (
        <ContactInfoCard
          icon={<Phone className="w-6 h-6" />}
          title="Phone Number"
          content={contactInfo?.immediatePhoneNo || contactInfo?.phone || ""}
          ariaLabel="Click to call us"
          delay={0.1}
          clickable={true}
          href={phoneHref}
        />
      )}

      {/* Email */}
      {(contactInfo?.email || contactInfo?.immediateEmail) && (
        <ContactInfoCard
          icon={<Mail className="w-6 h-6" />}
          title="Email Address"
          content={contactInfo?.immediateEmail || contactInfo?.email || ""}
          ariaLabel="Click to email us"
          delay={0.2}
          clickable={true}
          href={emailHref}
        />
      )}

      {/* Opening Hours */}
      {openingHours.length > 0 && (
        <ContactInfoCard
          icon={<Clock className="w-6 h-6" />}
          title="Opening Hours"
          content={formattedHours}
          ariaLabel="Our opening hours"
          delay={0.3}
        />
      )}
    </div>
  );
}
