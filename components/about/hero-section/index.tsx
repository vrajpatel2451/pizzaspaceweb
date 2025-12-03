"use client";

import { Sparkles } from "lucide-react";

// Background gradient and decorative shapes - rendered as overlay on server hero
function BackgroundShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-900" />

      {/* Animated circular shapes */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-200/40 to-primary-300/20 dark:from-primary-500/10 dark:to-primary-600/5 blur-3xl animate-scale-in-center motion-reduce:animate-none"
      />

      <div
        className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/5 blur-3xl animate-scale-in-center animation-delay-200 motion-reduce:animate-none"
      />

      <div
        className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-primary-100/50 to-amber-100/30 dark:from-primary-600/10 dark:to-amber-600/5 blur-3xl animate-scale-in-center animation-delay-400 motion-reduce:animate-none"
      />

      {/* Decorative circles with staggered entrance */}
      <div
        className="hidden lg:block absolute top-32 right-[15%] w-4 h-4 rounded-full bg-primary-400/60 dark:bg-primary-400/40 animate-fade-in-up animation-delay-600 motion-reduce:animate-none"
      />

      <div
        className="hidden lg:block absolute top-48 right-[25%] w-2 h-2 rounded-full bg-amber-400/80 dark:bg-amber-400/50 animate-fade-in-up animation-delay-700 motion-reduce:animate-none"
      />

      <div
        className="hidden lg:block absolute bottom-40 left-[10%] w-3 h-3 rounded-full bg-primary-300/70 dark:bg-primary-400/40 animate-fade-in-down animation-delay-800 motion-reduce:animate-none"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// Floating decorative elements
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating pizza slice */}
      <div
        className="absolute top-1/4 right-[10%] hidden xl:block animate-fade-in-up animation-delay-500 motion-reduce:animate-none"
      >
        <div className="animate-float-slow motion-reduce:animate-none">
          <div className="text-6xl opacity-20 dark:opacity-10">🍕</div>
        </div>
      </div>

      {/* Floating tomato */}
      <div
        className="absolute bottom-1/3 left-[8%] hidden lg:block animate-fade-in-up animation-delay-700 motion-reduce:animate-none"
      >
        <div className="animate-float animation-delay-1000 motion-reduce:animate-none">
          <div className="text-4xl opacity-20 dark:opacity-10">🍅</div>
        </div>
      </div>

      {/* Sparkles */}
      <div
        className="absolute top-1/3 left-[15%] hidden xl:block animate-pop-in animation-delay-900 motion-reduce:animate-none"
      >
        <div className="animate-float animation-delay-500 motion-reduce:animate-none">
          <Sparkles className="w-8 h-8 text-orange-400/30 dark:text-orange-400/15" />
        </div>
      </div>
    </div>
  );
}

// Background decorations component - content is now server-rendered in page.tsx
export function AboutHeroSection() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Background decorative elements */}
      <BackgroundShapes />
      <FloatingElements />
    </div>
  );
}
