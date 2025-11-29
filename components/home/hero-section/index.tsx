import { BackgroundShapes } from "./background-shapes";
import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";
import { FloatingCards } from "./floating-cards";

export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-0"
      aria-label="Hero section"
    >
      {/* Background decorative elements */}
      <BackgroundShapes />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left side - Content */}
          <HeroContent />

          {/* Right side - Visual - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block">
            <HeroImage />
          </div>
        </div>
      </div>

      {/* Floating product cards and badges - Hidden on mobile */}
      <FloatingCards />

      {/* Bottom fade gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

// Named export for dynamic import compatibility
export { HeroSection as default };
