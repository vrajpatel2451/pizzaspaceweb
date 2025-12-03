"use client";

import { useState, useEffect, useRef } from "react";
import { Award, ChefHat } from "lucide-react";
import { CustomImage } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";

export function AboutImage() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-all duration-800 motion-reduce:transition-none",
        isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 -translate-x-12 scale-95"
      )}
    >
      {/* Decorative frame */}
      <div className="relative">
        {/* Background decorative shapes */}
        <div
          className={cn(
            "absolute -top-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 dark:bg-primary/20 rounded-2xl",
            "transition-all duration-800 motion-reduce:transition-none",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
          style={{ transitionDelay: "600ms" }}
        />
        <div
          className={cn(
            "absolute -bottom-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 bg-orange-200/50 dark:bg-primary/15 rounded-full",
            "transition-all duration-800 motion-reduce:transition-none",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
          style={{ transitionDelay: "600ms" }}
        />

        {/* Dotted pattern decoration */}
        <div
          className={cn(
            "absolute -bottom-8 -left-8 hidden sm:grid grid-cols-5 gap-2 opacity-30 dark:opacity-20",
            "transition-all duration-800 motion-reduce:transition-none",
            isVisible ? "opacity-30 dark:opacity-20 scale-100" : "opacity-0 scale-50"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </div>

        {/* Main image container */}
        <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 group hover:scale-[1.02] transition-transform duration-400 motion-reduce:transition-none motion-reduce:hover:scale-100">
          {/* Image wrapper with gradient overlay */}
          <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full max-w-lg mx-auto lg:mx-0 bg-gradient-to-br from-navy-800 to-navy-900 dark:from-navy-700 dark:to-navy-800">
            {/* Pizza/Kitchen Image */}
            <CustomImage
              src="/images/pizza-logo.png"
              alt="Our master chef crafting authentic Italian pizza"
              fill
              className="object-contain p-8 sm:p-12"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />

            {/* Premium shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-800 opacity-0 group-hover:opacity-30 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:opacity-0" />
          </div>

          {/* Decorative border accent */}
          <div className="absolute inset-0 rounded-3xl border-4 border-primary/20 dark:border-primary/30 pointer-events-none" />
        </div>

        {/* Established Badge */}
        <div
          className={cn(
            "absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-6 z-20",
            "transition-all duration-600 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-80"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="animate-float">
            <div className="relative bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700">
              {/* Badge content */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Est.
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  2020
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Years of Excellence
                </span>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">5+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Badge - Top Left */}
        <div
          className={cn(
            "absolute -top-4 -left-4 sm:top-4 sm:-left-6 z-20",
            "transition-all duration-600 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-80"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="animate-float-delayed">
            <div className="bg-primary text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-primary/25">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                    Award
                  </p>
                  <p className="text-sm sm:text-base font-bold">Best Pizza</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chef Badge - Bottom Left */}
        <div
          className={cn(
            "absolute bottom-20 -left-4 sm:bottom-24 sm:-left-8 z-20 hidden sm:block",
            "transition-all duration-600 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-80"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="animate-float-slow">
            <div className="bg-white dark:bg-navy-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Expert
                  </p>
                  <p className="text-sm font-bold text-foreground">Chefs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated ring decoration */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none",
          "transition-all duration-1000 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
        style={{ transitionDelay: "800ms" }}
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-primary/10 dark:border-primary/20 animate-spin-slow" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 0.5s;
        }
        .animate-float-slow {
          animation: float-slow 3.5s ease-in-out infinite 1s;
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow,
          .animate-spin-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
