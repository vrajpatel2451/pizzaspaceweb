"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  ariaLabel: string;
  delay?: number;
}

function ContactInfoCard({ icon, title, content, ariaLabel, delay = 0 }: ContactInfoCardProps) {
  const contentArray = Array.isArray(content) ? content : [content];
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

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
              className="text-gray-600 dark:text-gray-300 text-sm break-words"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactInfo() {
  return (
    <div className="space-y-4" role="list" aria-label="Contact information">
      <ContactInfoCard
        icon={<MapPin className="w-6 h-6" />}
        title="Our Address"
        content={["Pizza Space HQ", "123 Pizza Lane", "London, UK EC1A 1BB"]}
        ariaLabel="Our office address"
        delay={0}
      />

      <ContactInfoCard
        icon={<Phone className="w-6 h-6" />}
        title="Phone Number"
        content="+44 20 1234 5678"
        ariaLabel="Our phone number"
        delay={0.1}
      />

      <ContactInfoCard
        icon={<Mail className="w-6 h-6" />}
        title="Email Address"
        content="hello@pizzaspace.co.uk"
        ariaLabel="Our email address"
        delay={0.2}
      />

      <ContactInfoCard
        icon={<Clock className="w-6 h-6" />}
        title="Opening Hours"
        content={[
          "Monday - Friday: 10:00 AM - 11:00 PM",
          "Saturday - Sunday: 11:00 AM - 12:00 AM"
        ]}
        ariaLabel="Our opening hours"
        delay={0.3}
      />
    </div>
  );
}
