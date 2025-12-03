"use client";

import { useEffect, useState, useRef } from "react";
import { CustomImage } from "@/components/ui/custom-image";
import { Calendar, Award, Users, TrendingUp, History } from "lucide-react";
import { cn } from "@/lib/utils";

// Timeline milestone data
const milestones = [
  {
    year: "1998",
    title: "The Beginning",
    description: "Founded our first location with a dream and a family recipe",
    icon: Calendar,
  },
  {
    year: "2005",
    title: "Award Winning",
    description: "Recognized as Best Pizza in the region",
    icon: Award,
  },
  {
    year: "2012",
    title: "Community Growth",
    description: "Expanded to 10 locations across the country",
    icon: Users,
  },
  {
    year: "2024",
    title: "Innovation",
    description: "Launched online ordering and delivery platform",
    icon: TrendingUp,
  },
];

// Floating ingredient decorations
function FloatingIngredients({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating basil leaf - top right */}
      <div
        className={cn(
          "absolute top-20 right-[10%] hidden lg:block transition-all duration-800 delay-600",
          isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-5 rotate-[10deg]"
        )}
      >
        <div className="animate-float motion-reduce:animate-none">
          <div className="w-10 h-14 bg-gradient-to-t from-green-600 to-green-400 rounded-full rotate-45 shadow-lg shadow-green-200/50 dark:shadow-green-900/30" />
        </div>
      </div>

      {/* Floating tomato - bottom left */}
      <div
        className={cn(
          "absolute bottom-32 left-[8%] hidden lg:block transition-all duration-800 delay-800",
          isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-5 -rotate-[10deg]"
        )}
      >
        <div className="animate-float-slow motion-reduce:animate-none">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200/50 dark:shadow-red-900/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-2.5 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Floating cheese - mid right */}
      <div
        className={cn(
          "absolute top-1/2 right-[5%] hidden xl:block transition-all duration-800 delay-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      >
        <div className="animate-float motion-reduce:animate-none">
          <div
            className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-sm rotate-12 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30"
            style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          />
        </div>
      </div>
    </div>
  );
}

// Timeline component
function Timeline({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className={cn(
          "absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200 dark:from-orange-800 dark:via-orange-700 dark:to-orange-800 origin-top transition-transform duration-1000",
          isVisible ? "scale-y-100" : "scale-y-0"
        )}
      />

      {/* Milestones */}
      <div className="space-y-8 md:space-y-12">
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          return (
            <div
              key={milestone.year}
              className={cn(
                "relative flex items-start gap-6 group transition-all duration-600",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Icon container */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30 dark:shadow-orange-900/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/40 group-hover:scale-110 group-hover:rotate-[5deg]",
                    isVisible ? "scale-100" : "scale-0"
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 150 + 200}ms` : "0ms" }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div
                  className={cn(
                    "bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl p-4 border border-transparent group-hover:border-orange-200 dark:group-hover:border-orange-800/50 transition-all duration-300",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 150 + 300}ms` : "0ms" }}
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3 transition-transform duration-200 hover:scale-105">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {milestone.year}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Section header component
function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Badge */}
      <div
        className={cn(
          "mb-4 transition-all duration-500 delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <History className="w-3.5 h-3.5" />
          Our Journey
        </span>
      </div>

      {/* Headline */}
      <h2
        id="story-heading"
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-all duration-500 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        A Legacy of{" "}
        <span className="text-orange-500 relative">
          Passion
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
      </h2>

      {/* Subheadline */}
      <p
        className={cn(
          "text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        From humble beginnings to becoming a beloved community staple, our story is
        one of dedication, family traditions, and an unwavering commitment to quality.
      </p>

      {/* Decorative elements */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-400",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}

// Background decorations
function BackgroundDecorations({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient blobs */}
      <div
        className={cn(
          "absolute -top-32 -left-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transition-all duration-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-32 -right-32 w-80 h-80 bg-orange-100/50 dark:bg-primary/5 rounded-full blur-3xl transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      />
    </div>
  );
}

export function StorySection() {
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
      { rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-navy-900 py-16 md:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="story-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations isVisible={isVisible} />

      <FloatingIngredients isVisible={isVisible} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl mx-auto">
          {/* Left side - Image (on top for mobile) */}
          <div
            className={cn(
              "relative lg:order-first transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <CustomImage
                src="/images/about-story.jpg"
                alt="Pizza Space restaurant interior with family dining"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Decorative accent */}
            <div
              className={cn(
                "absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl -z-10 blur-2xl transition-all duration-600 delay-300",
                isVisible ? "opacity-40 scale-100" : "opacity-0 scale-80"
              )}
            />
          </div>

          {/* Right side - Content and Timeline */}
          <div className="lg:order-last">
            {/* Story text */}
            <div
              className={cn(
                "mb-8 sm:mb-10 md:mb-12 transition-all duration-600",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">
                Pizza Space was born from a simple vision: to bring authentic Italian
                flavors to our community using time-honored recipes passed down through
                generations. What started as a small family kitchen has grown into a
                beloved destination for pizza lovers.
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Every pizza we create honors our heritage while embracing innovation,
                ensuring that each bite delivers the perfect balance of tradition and
                taste.
              </p>
            </div>

            {/* Timeline */}
            <Timeline isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
