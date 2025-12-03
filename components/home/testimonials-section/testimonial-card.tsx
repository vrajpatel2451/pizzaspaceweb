"use client";

import { CustomImage } from "@/components/ui/custom-image";
import { Quote, Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  date: string;
  isVerified: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
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
      <div className="flex items-center gap-1.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-in zoom-in-0 duration-200 motion-reduce:animate-none"
            style={{ animationDelay: `${300 + i * 50}ms` }}
          >
            <Star
              className={`w-5 h-5 ${
                i < testimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Quote Text */}
      <blockquote className="relative z-10 mb-8">
        <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-6" />

      {/* Customer Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-4 ring-orange-100 dark:ring-orange-950/50">
              <CustomImage
                src={testimonial.avatar}
                alt={testimonial.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-slate-800" />
          </div>

          {/* Name and Title */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                {testimonial.name}
              </h4>
              {testimonial.isVerified && (
                <BadgeCheck className="w-5 h-5 text-orange-500 fill-orange-100 dark:fill-orange-950" />
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {testimonial.title}
            </p>
          </div>
        </div>

        {/* Date and Verified Badge */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {testimonial.date}
          </span>
          {testimonial.isVerified && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Verified Purchase
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
