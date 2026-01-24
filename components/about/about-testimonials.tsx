"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CustomImage } from "@/components/ui/custom-image";
import type { GeneralRating } from "@/types";

interface AboutTestimonialsProps {
  testimonials: GeneralRating[];
}

export function AboutTestimonials({ testimonials }: AboutTestimonialsProps) {
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

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className={cn(
        "transition-all duration-600 delay-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <Card className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border-slate-200 dark:border-navy-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10">
              <Quote className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">
                What People Say
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                Hear from our valued customers
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className={cn(
                  "p-4 rounded-lg bg-slate-50 dark:bg-navy-700/50 border border-slate-200 dark:border-navy-700 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-md transition-all duration-300",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
              >
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < testimonial.ratings
                          ? "fill-orange-400 text-orange-400"
                          : "fill-slate-200 text-slate-200 dark:fill-navy-600 dark:text-navy-600"
                      )}
                    />
                  ))}
                </div>

                {/* Person info */}
                <div className="flex items-center gap-3">
                  {testimonial.personImage ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-200 dark:ring-navy-600">
                      <CustomImage
                        src={testimonial.personImage}
                        alt={testimonial.personName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0 ring-2 ring-slate-200 dark:ring-navy-600">
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {testimonial.personName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {testimonial.personName}
                    </p>
                    {testimonial.personTagRole && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {testimonial.personTagRole}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t border-slate-200 dark:border-navy-700">
          <Link
            href="/#testimonials"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group"
            aria-label="View all testimonials"
          >
            View all testimonials
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
