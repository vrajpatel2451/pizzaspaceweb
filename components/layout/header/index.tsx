import { TopInfoBar } from "./top-info-bar";
import { HeaderClient } from "./header-client";
import { fetchHeaderLogo } from "@/lib/api/server-fetchers";

export async function Header() {
  // Fetch both light and dark logos from API in parallel
  const [lightLogoUrl, darkLogoUrl] = await Promise.all([
    fetchHeaderLogo("light"),
    fetchHeaderLogo("dark"),
  ]);

  // Use API logos with fallback to static logo
  const finalLightLogo = lightLogoUrl || "/logo.png";
  const finalDarkLogo = darkLogoUrl || "/logo.png";

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
      {/* <TopInfoBar /> */}

      {/* Main Header - Logo, Navigation, Actions */}
      <HeaderClient
        lightLogoUrl={finalLightLogo}
        darkLogoUrl={finalDarkLogo}
      />
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
export { MobileNavDrawer } from "./mobile-nav-drawer";
export { StoreLocator } from "./store-locator";
export { DeliveryTypeSwitcher } from "./delivery-type-switcher";
