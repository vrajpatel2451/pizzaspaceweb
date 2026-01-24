// API Client
export { default as apiClient } from "./client";

// API Service Functions
export { getCategories } from "./categories";
export { getSubCategories } from "./subcategories";
export { getProducts, getProductDetails } from "./products";
export { getStores } from "./stores";
export { loginUser, registerUser, getProfile } from "./auth";
export * from "./cart";
export * from "./address";
export * from "./discount";
export * from "./order";
export * from "./orderTicket";
export * from "./orderReview";

// Website Meta Info APIs
export { getOpeningHours } from "./opening-hours";
export { getSocialMedia } from "./social-media";
export { getPublishedContactInfo } from "./contact-info";
export { getLogos, getLogoDetails } from "./logos";
export { getPolicies, getPolicyBySlug } from "./policies";
export { getGeneralRatings, createRating } from "./general-ratings";
export { createContactQuery } from "./contact-queries";
export { createReservation } from "./reservation-form";
