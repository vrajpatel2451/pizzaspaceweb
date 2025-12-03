"use client";

import { Mail, MessageCircle, MapPin } from "lucide-react";

// Background decorations component - content is now server-rendered in page.tsx
export function ContactHeroSection() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-orange-950/20 dark:via-slate-950 dark:to-orange-950/10" />

      {/* Decorative shapes with entrance animations */}
      <div
        className="absolute top-10 left-10 w-32 h-32 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl animate-scale-in-center motion-reduce:animate-none"
      />
      <div
        className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300/20 dark:bg-orange-700/10 rounded-full blur-3xl animate-scale-in-center animation-delay-200 motion-reduce:animate-none"
      />

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 right-[15%] hidden lg:block animate-fade-in-up animation-delay-500 motion-reduce:animate-none"
        >
          <div className="animate-float motion-reduce:animate-none">
            <Mail className="w-8 h-8 text-orange-400/30 dark:text-orange-400/20" />
          </div>
        </div>

        <div
          className="absolute bottom-24 left-[10%] hidden lg:block animate-fade-in-up animation-delay-700 motion-reduce:animate-none"
        >
          <div className="animate-float animation-delay-1000 motion-reduce:animate-none">
            <MessageCircle className="w-10 h-10 text-orange-300/40 dark:text-orange-300/20" />
          </div>
        </div>

        <div
          className="absolute top-1/2 left-[20%] hidden xl:block animate-pop-in animation-delay-900 motion-reduce:animate-none"
        >
          <div className="animate-pulse-subtle motion-reduce:animate-none">
            <MapPin className="w-7 h-7 text-orange-500/30 dark:text-orange-400/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
