"use client";

import { CustomImage } from "@/components/ui/custom-image";
import { Quote, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneralRating } from "@/types";

interface TestimonialCardProps {
  testimonial: GeneralRating;
  isActive?: boolean;
}

export function TestimonialCard({
  testimonial,
  isActive = false,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 md:p-10",
        "shadow-xl shadow-orange-500/5 dark:shadow-black/20",
        "border border-slate-100 dark:border-slate-700",
        "mx-2 sm:mx-4 h-full",
        "transition-all duration-400 ease-out motion-reduce:transition-none",
        isActive ? "opacity-100 scale-100 ring-2 ring-orange-500/20" : "opacity-70 scale-95"
      )}
    >
      {/* Decorative Quote Background */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-5">
        <Quote className="w-24 h-24 md:w-32 md:h-32 text-orange-500 fill-current" />
      </div>

      {/* Quote Icon */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/30 mb-6 animate-in zoom-in-0 duration-300 motion-reduce:animate-none"
        style={{ animationDelay: "200ms" }}
      >
        <Quote className="w-6 h-6 md:w-7 md:h-7 text-white fill-current" />
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-in zoom-in-0 duration-200 motion-reduce:animate-none"
            style={{ animationDelay: `${300 + i * 50}ms` }}
          >
            <Star
              className={`w-5 h-5 ${
                i < testimonial.ratings
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
              }`}
            />
          </div>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
          {testimonial.ratings}.0
        </span>
      </div>

      {/* Customer Info Section */}
      <div className="relative z-10 mb-6">
        <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium italic">
          &ldquo;Amazing pizza experience! The quality and service exceeded all expectations.&rdquo;
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-6" />

      {/* Customer Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {testimonial.personImage ? (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-4 ring-orange-100 dark:ring-orange-950/50">
              <CustomImage
                src={testimonial.personImage}
                alt={testimonial.personName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 ring-4 ring-orange-100 dark:ring-orange-950/50 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
            {testimonial.personName}
          </h4>
          {testimonial.personTagRole && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {testimonial.personTagRole}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
