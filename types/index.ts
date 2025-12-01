// API Base Types
export type { APIResponse, PaginationMeta, PaginatedResponse } from "./api";

// Category Types
export type { CategoryQueryParams, CategoryResponse } from "./category";
export type {
  SubCategoryQueryParams,
  SubCategoryResponse,
} from "./subcategory";

// Product Types
export type {
  ProductType,
  SpiceLevel,
  Ingredient,
  DishSize,
  ProductResponse,
  ProductQueryParams,
  ProductDetailsResponse,
  AddonGroupResponse,
  AddonResponse,
  DishSizeUnit,
  VariantGroupResponse,
  VariantPricingResponse,
  VariantResponse,
  VariantPricingType,
} from "./product";

// Store Types
export type { StoreQueryParams, StoreResponse } from "./store";

// User Types
export type {
  RegisterUserPayload,
  LoginUserPayload,
  UserResponse,
  UserResponseWithToken,
} from "./user";

// Auth Types
export type {
  AuthState,
  AuthActions,
  AuthStore,
} from "./auth";
export { AUTH_STORAGE_KEY } from "./auth";
