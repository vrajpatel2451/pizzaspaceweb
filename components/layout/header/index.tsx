import { TopInfoBar } from "./top-info-bar";
import { HeaderClient } from "./header-client";

export function Header() {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Top Info Bar - Opening hours, contact, social links */}
      <TopInfoBar />

      {/* Main Header - Logo, Navigation, Actions */}
      <HeaderClient />
    </>
  );
}

// Re-export components for direct import if needed
export { Logo } from "./logo";
export { TopInfoBar } from "./top-info-bar";
export { HeaderClient } from "./header-client";
export { SearchCommand, SearchBar } from "./search-command";
export { ThemeToggle, ThemeTogglePill } from "./theme-toggle";
export { UserDropdown } from "./user-dropdown";
export { CartBadge } from "./cart-badge";
export { MiniCartDropdown } from "./mini-cart-dropdown";
export { MobileNavDrawer } from "./mobile-nav-drawer";
