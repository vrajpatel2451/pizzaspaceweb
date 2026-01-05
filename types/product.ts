import { OrderDeliveryType } from "./cart";

export type ProductType = "veg" | "non_veg" | "vegan";
export type SpiceLevel = "0_chilli" | "1_chilli" | "2_chilli";

export type Ingredient = {
  name: string;
  count: number;
};

export enum DishSizeUnit {
  piece = "piece",
  pieces = "pieces",
  slice = "slice",
  slices = "slices",
  pack = "pack",
  bucket = "bucket",
  platter = "platter",
  gram = "gram",
  kilograms = "kilograms",
  mg = "mg",
  pound = "pound",
  ounce = "ounce",
  ml = "ml",
  liter = "liter",
  cup = "cup",
  pint = "pint",
  quart = "quart",
  gallon = "gallon",
  dozen = "dozen",
  half_dozen = "half_dozen",
}

export type DishSize = {
  count: number;
  unit: DishSizeUnit;
};

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  isCombo: boolean;
  type: ProductType;
  photoList: string[];
  category: string;
  subCategory: string;
  noOfPeople: number;
  availableDeliveryTypes: OrderDeliveryType[];
  dishSize: DishSize;
  basePrice: number;
  packagingCharges: number;
  variantGroups: string[];
  addonGroups: string[];
  variants: string[];
  addons: string[];
  tags: string[];
  spiceLevel: SpiceLevel[];
  frosting: string;
  weight: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  allergicInfo: string[];
  ingredientList: Ingredient[];
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  categoryId?: string;
  deliveryType?: string;
  ids?: string[];
  all?: boolean;
  subCategoryId?: string;
}

export interface ProductDetailsResponse {
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];
  // combo data (only populated if product.isCombo is true)
  comboGroups?: ComboGroupResponse[];
  comboGroupProducts?: ComboGroupProductResponse[];
}

export interface ComboGroupResponse {
  _id: string;
  groupId: string; // UUID from frontend
  comboId: string; // reference to combo Product
  label: string;
  description: string;
  minSelection: number;
  maxSelection: number;
  allowCustomization: boolean;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ComboGroupProduct - links selectable products to a combo group
export interface ComboGroupProductResponse {
  _id: string;
  comboGroupId: string; // reference to ComboGroup
  productId: string; // selectable product
  defaultVariantId?: string; // pre-selected variant (e.g., "9 inch")
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
  product?: {
    _id: string;
    name: string;
    photoList: string[];
    type?: ProductType; // veg or non_veg for badge display
  };
}

export type VariantAddonSelectionType = "none" | "overall" | "perGroup";
export interface VariantResponse {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  itemId: string;
  isPrimary: boolean;
  maxItems: number;
  maxItemTypes: VariantAddonSelectionType;
  packagingCharges: number;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}
export interface VariantGroupResponse {
  _id: string;
  label: string;
  description: string;
  itemId: string;
  isPrimary: boolean;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddonResponse {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddonGroupResponse {
  _id: string;
  label: string;
  description: string;
  storeIds: string[];
  allowMulti: boolean;
  skipValidation: boolean;
  min: number;
  max: number;
  createdAt: string;
  updatedAt: string;
}

export type VariantPricingType = "addonGroup" | "addon" | "variant";

export interface VariantPricingResponse {
  _id: string;
  type: VariantPricingType;
  variantId: string;
  variantGroupId: string;
  subVariantId: string;
  addonGroupId: string;
  addonId: string;
  productId: string;
  isVisible: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
}
