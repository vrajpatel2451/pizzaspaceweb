"use client";

import { useState, useEffect, useRef } from "react";
import { Target, Eye, Sparkles } from "lucide-react";
import { MissionCard } from "./mission-card";
import { cn } from "@/lib/utils";

// Background decorative elements
function BackgroundDecorations({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient orb - top right */}
      <div
        className={cn(
          "absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-transparent dark:from-orange-500/10 dark:via-orange-400/5 dark:to-transparent rounded-full blur-3xl transition-all duration-1200 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      />

      {/* Secondary gradient orb - bottom left */}
      <div
        className={cn(
          "absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-primary/15 via-amber-400/10 to-transparent dark:from-primary/10 dark:via-amber-400/5 dark:to-transparent rounded-full blur-3xl transition-all duration-1200 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
        style={{ transitionDelay: "200ms" }}
      />

      {/* Accent orb - center */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-orange-100/30 via-transparent to-transparent dark:from-orange-500/5 dark:via-transparent dark:to-transparent rounded-full blur-3xl transition-opacity duration-1500 motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "400ms" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative elements */}
      <div
        className={cn(
          "absolute top-20 left-[15%] hidden lg:block transition-all duration-800 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <div className="animate-float motion-reduce:animate-none">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-500/30 dark:shadow-orange-500/20" />
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-32 right-[20%] hidden lg:block transition-all duration-800 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
        )}
        style={{ transitionDelay: "800ms" }}
      >
        <div className="animate-float-delayed motion-reduce:animate-none">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20" />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-1/3 right-[10%] hidden xl:block transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="animate-float-slow motion-reduce:animate-none">
          <Sparkles className="w-6 h-6 text-orange-400/40 dark:text-orange-400/20" />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
          animation-delay: 0.5s;
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

// Section header component
function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-600 motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      )}
    >
      {/* Badge */}
      <div
        className={cn(
          "mb-4 transition-all duration-500 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
        )}
        style={{ transitionDelay: "100ms" }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <Target className="w-3.5 h-3.5" />
          Why We Do It
        </span>
      </div>

      {/* Headline */}
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-all duration-500 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "200ms" }}
      >
        Our{" "}
        <span className="text-orange-500 relative">
          Purpose
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
        </span>{" "}
        & Direction
      </h2>

      {/* Subheadline */}
      <p
        className={cn(
          "text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-500 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "300ms" }}
      >
        Driven by passion, guided by values. Discover what fuels our commitment
        to crafting exceptional pizza experiences for our community.
      </p>

      {/* Decorative elements */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-6 transition-opacity duration-500 motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "400ms" }}
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}

export function MissionVisionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950"
      aria-labelledby="mission-vision-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations isVisible={isVisible} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
          <MissionCard
            icon={Target}
            title="Our Mission"
            description="To bring authentic Italian flavors to every table, creating memorable dining experiences through exceptional food, warm hospitality, and community connection. We strive to be the heart of our neighborhood's culinary landscape."
            iconGradient="from-orange-500 to-red-500"
            delay={0}
          />
          <MissionCard
            icon={Eye}
            title="Our Vision"
            description="To become the most beloved pizza destination, known for our unwavering commitment to quality, innovation in traditional recipes, and creating a welcoming space where families and friends gather to share great food and create lasting memories."
            iconGradient="from-amber-500 to-orange-500"
            delay={150}
          />
        </div>

        {/* Bottom decorative element */}
        <div
          className={cn(
            "mt-16 md:mt-20 lg:mt-24 h-px bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-700/50 to-transparent max-w-2xl mx-auto transition-all duration-800 motion-reduce:transition-none",
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          )}
          style={{ transitionDelay: "600ms" }}
        />
      </div>
    </section>
  );
}
