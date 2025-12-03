"use client";

import { useEffect, useState, useRef } from "react";
import { TeamCard } from "./team-card";
import { Users } from "lucide-react";

// Team member data
const teamMembers = [
  {
    name: "Marco Rossi",
    role: "Founder & Head Chef",
    bio: "With 30 years of culinary experience in Italy and a passion for authentic flavors, Marco brings traditional recipes to life in every pizza.",
    image: "/images/team-marco.jpg",
  },
  {
    name: "Sofia Martinez",
    role: "Executive Chef",
    bio: "A master of dough crafting and innovative toppings, Sofia ensures every pizza meets our exacting standards for quality and taste.",
    image: "/images/team-sofia.jpg",
  },
  {
    name: "James Chen",
    role: "Operations Director",
    bio: "Leading our expansion and ensuring consistent excellence across all locations, James brings strategic vision and operational expertise.",
    image: "/images/team-james.jpg",
  },
  {
    name: "Emma Thompson",
    role: "Customer Experience Manager",
    bio: "Dedicated to creating memorable dining experiences, Emma leads our service team with warmth, professionalism, and attention to detail.",
    image: "/images/team-emma.jpg",
  },
];

// Section header component
function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
    >
      {/* Badge */}
      <div
        className={`mb-4 transition-all duration-500 delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        } motion-reduce:transition-none`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          Meet Our Team
        </span>
      </div>

      {/* Main heading */}
      <h2
        id="team-heading"
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 transition-all duration-500 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } motion-reduce:transition-none`}
      >
        The{" "}
        <span className="text-orange-500 relative">
          People
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
        Behind the Pizza
      </h2>

      {/* Subtitle */}
      <p
        className={`text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-500 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } motion-reduce:transition-none`}
      >
        Our dedicated team of culinary experts and hospitality professionals work together
        to create exceptional experiences for every guest.
      </p>

      {/* Decorative elements */}
      <div
        className={`flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-400 ${
          isVisible ? "opacity-100" : "opacity-0"
        } motion-reduce:transition-none`}
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
      {/* Gradient orbs */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/5 dark:to-orange-600/3 rounded-full blur-3xl transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100`}
      />
      <div
        className={`absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-amber-500/10 to-amber-600/5 dark:from-amber-500/5 dark:to-amber-600/3 rounded-full blur-3xl transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100`}
      />
    </div>
  );
}

export function TeamSection() {
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
      aria-labelledby="team-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations isVisible={isVisible} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />

        {/* Team grid - 1 col mobile, 2 tablet, 3-4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={member.name}
              member={member}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className={`relative z-10 mt-16 md:mt-20 lg:mt-24 h-px bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-700/50 to-transparent max-w-2xl mx-auto transition-all duration-800 delay-400 ${
          isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-x-100`}
      />
    </section>
  );
}
