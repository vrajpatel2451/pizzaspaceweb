import { Logo } from "./logo";
import { HeaderNav } from "./header-nav";
import { HeaderIcons } from "./header-icons";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      <header
        className="sticky top-0 z-50 w-full bg-slate-800 shadow-md"
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="flex-1 flex justify-center">
            <HeaderNav />
          </div>

          {/* Right Side: Icons + Mobile Menu */}
          <div className="flex items-center gap-2">
            <HeaderIcons />
            <MobileMenu />
          </div>
        </div>
      </div>
      </header>
    </>
  );
}
