/**
 * Product Details Components
 *
 * Entry point for all product details UI components.
 * Premium Zomato/Swiggy-style UI implementation with animations.
 */

// Main Container (Entry Point)
export { ProductDetailsContainer } from "./product-details-container";

// Modal Wrappers
export { ProductDetailsDialog } from "./product-details-dialog";
export { ProductDetailsBottomsheet } from "./product-details-bottomsheet";

// Shared Content
export { ProductDetailsContent } from "./product-details-content";

// Section Components
export { ProductImageSection } from "./sections/product-image-section";
export { ProductInfoSection } from "./sections/product-info-section";
export { VariantGroupsSection } from "./sections/variant-groups-section";
export { AddonGroupsSection } from "./sections/addon-groups-section";
export { ProductDetailsFooter } from "./sections/product-details-footer";
export { CookingRequestSection } from "./sections/cooking-request-section";
export { StickyActionBar } from "./sections/sticky-action-bar";

// Selector Components (Legacy)
export { VariantGroup } from "./selectors/variant-group";
export { VariantCard } from "./selectors/variant-card";
export { AddonGroup } from "./selectors/addon-group";
export { AddonItem } from "./selectors/addon-item";

// Premium Badge Components
export { PopularityBadge } from "./badges/popularity-badge";
export { ProductTypeBadge, ProductTypeIndicator } from "./badges/product-type-badge";

// Premium Control Components
export { QuantityPill, CompactQuantityPill } from "./controls/quantity-pill";

// Premium Card Components
export { VariantGroupCard, HorizontalVariantSelector } from "./cards/variant-group-card";
export { AddonGroupCard } from "./cards/addon-group-card";

// Loading & Error States
export { ProductDetailsSkeleton } from "./product-details-skeleton";

// Re-export types for convenience
export type { PopularityType, PopularityBadgeProps } from "./badges/popularity-badge";
export type { ProductTypeBadgeProps } from "./badges/product-type-badge";
export type { QuantityPillProps } from "./controls/quantity-pill";
export type { VariantGroupCardProps, HorizontalVariantSelectorProps } from "./cards/variant-group-card";
export type { AddonGroupCardProps } from "./cards/addon-group-card";
export type { CookingRequestSectionProps } from "./sections/cooking-request-section";
export type { StickyActionBarProps } from "./sections/sticky-action-bar";
