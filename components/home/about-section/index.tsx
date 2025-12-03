"use client";

import { useState, useEffect, useRef } from "react";
import { AboutImage } from "./about-image";
import { AboutContent } from "./about-content";
import { cn } from "@/lib/utils";

// Background decorative blob shapes
function BackgroundBlobs() {
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
      { rootMargin: "0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Top left blob */}
      <div
        ref={ref}
        className={cn(
          "absolute -top-32 -left-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      />
      {/* Bottom right blob */}
      <div
        className={cn(
          "absolute -bottom-32 -right-32 w-80 h-80 bg-orange-100/50 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
        style={{ transitionDelay: "200ms" }}
      />
      {/* Center accent blob */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-50/30 via-transparent to-amber-50/30 dark:from-primary/5 dark:via-transparent dark:to-primary/3 rounded-full blur-3xl pointer-events-none transition-opacity duration-1200 motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "400ms" }}
      />
    </>
  );
}

// Floating ingredient decorations
function FloatingIngredients() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating tomato - top right */}
      <div
        className={cn(
          "absolute top-20 right-[15%] hidden lg:block transition-all duration-800 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-5 -rotate-10"
        )}
      >
        <div className="animate-float">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200/50 dark:shadow-red-900/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-2 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Floating basil leaf - bottom left */}
      <div
        className={cn(
          "absolute bottom-32 left-[10%] hidden lg:block transition-all duration-800 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-5 rotate-10"
        )}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="animate-float-delayed">
          <div className="w-8 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-full rotate-45 shadow-lg shadow-green-200/50 dark:shadow-green-900/30" />
        </div>
      </div>

      {/* Floating cheese piece - mid right */}
      <div
        className={cn(
          "absolute top-1/2 right-[5%] hidden xl:block transition-all duration-800 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="animate-float-slow">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-sm rotate-12 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-6px) rotate(40deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(22deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 0.5s;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite 1s;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      className="relative bg-white dark:bg-navy-900 py-20 sm:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <BackgroundBlobs />
      <FloatingIngredients />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left side - Image */}
          <AboutImage />

          {/* Right side - Content */}
          <AboutContent />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-gray-50 dark:text-navy-800"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 L0,30 Q300,0 600,30 T1200,30 L1200,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

// Named export for dynamic import compatibility
export { AboutSection as default };
