"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { ContactInfo } from "@/types";
import { formatAddress } from "@/lib/api/server-fetchers";

interface AboutContactProps {
  contactInfo: ContactInfo;
}

export function AboutContact({ contactInfo }: AboutContactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "transition-all duration-600 delay-100",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <Card className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border-slate-200 dark:border-navy-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10">
              <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">
                Get in Touch
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                We would love to hear from you
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Address */}
          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-navy-700/50 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors group">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-navy-800 shadow-sm group-hover:shadow-md transition-shadow">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Address
              </h3>
              <address className="not-italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {contactInfo.addressLine1}
                {contactInfo.addressLine2 && (
                  <>
                    <br />
                    {contactInfo.addressLine2}
                  </>
                )}
                <br />
                {contactInfo.area && `${contactInfo.area}, `}
                {contactInfo.city}
                {contactInfo.county && `, ${contactInfo.county}`}
                <br />
                {contactInfo.zip}
              </address>
            </div>
          </div>

          {/* Phone */}
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-navy-700/50 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors group"
            aria-label={`Call us at ${contactInfo.phone}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-navy-800 shadow-sm group-hover:shadow-md transition-shadow">
                <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Phone
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {contactInfo.phone}
              </p>
              {contactInfo.immediatePhoneNo && contactInfo.immediatePhoneNo !== contactInfo.phone && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Alternative: {contactInfo.immediatePhoneNo}
                </p>
              )}
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-navy-700/50 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors group"
            aria-label={`Email us at ${contactInfo.email}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-navy-800 shadow-sm group-hover:shadow-md transition-shadow">
                <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Email
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors break-all">
                {contactInfo.email}
              </p>
              {contactInfo.immediateEmail && contactInfo.immediateEmail !== contactInfo.email && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 break-all">
                  Alternative: {contactInfo.immediateEmail}
                </p>
              )}
            </div>
          </a>
        </CardContent>

        <CardFooter className="border-t border-slate-200 dark:border-navy-700">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group"
            aria-label="Visit our contact page"
          >
            Visit our contact page
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
