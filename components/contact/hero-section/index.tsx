"use client";

import { Mail, MessageCircle, MapPin } from "lucide-react";

export function ContactHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20"
      aria-label="Contact hero section"
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <div>
          {/* Badge */}
          <div className="mb-4 animate-fade-in-up stagger-1 motion-reduce:animate-none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Mail className="w-3.5 h-3.5" />
              We&apos;re Here to Help
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 px-4 sm:px-0 animate-fade-in-up stagger-2 motion-reduce:animate-none"
          >
            Get In{" "}
            <span className="text-orange-500 relative">
              Touch
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 25 0, 50 8 T 100 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 animate-fade-in-up stagger-3 motion-reduce:animate-none"
          >
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>

          {/* Decorative elements */}
          <div
            className="flex items-center justify-center gap-3 mt-6 animate-fade-in-up stagger-4 motion-reduce:animate-none"
          >
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
