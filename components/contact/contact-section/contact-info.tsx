"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  ariaLabel: string;
  delay?: number;
}

function ContactInfoCard({ icon, title, content, ariaLabel, delay = 0 }: ContactInfoCardProps) {
  const contentArray = Array.isArray(content) ? content : [content];
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
      whileHover={shouldReduceMotion ? {} : { x: 4 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md dark:shadow-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-300"
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.4,
            delay: shouldReduceMotion ? 0 : delay + 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
          className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40"
        >
          <div className="text-orange-500 dark:text-orange-400">
            {icon}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.4,
            delay: shouldReduceMotion ? 0 : delay + 0.2,
          }}
          className="flex-1 min-w-0"
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
        </motion.div>
      </div>
    </motion.div>
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
