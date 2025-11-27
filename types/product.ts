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
  type: ProductType;
  photoList: string[];
  category: string;
  subCategory: string;
  noOfPeople: number;
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
  ids?: string[];
  all?: boolean;
  subCategoryId?: string;
}
