// Enum types for discount system
export type AmountType = "fix" | "percentage";

export type DiscountConditionType =
  | "allProducts"
  | "selectedCategories"
  | "selectedProducts";

export type DiscountUserType = "allCustomers" | "newCustomers";

export type DiscountType =
  | "normal"
  | "packaging"
  | "deliveryCharges"
  | "extraCharges";

// Main discount response type from API
export interface DiscountResponse {
  _id: string;
  name: string;
  description: string;
  couponCode: string;
  hideFromSuggestion: boolean;
  discountAmount: number;
  discountAmountType: AmountType;
  maximumAmount: number;
  conditionType: DiscountConditionType;
  referenceIds: string[];
  storeId: string;
  startTime: Date;
  endTime: Date;
  isNeverEnding: boolean;
  customerType: DiscountUserType;
  customerIds: string[];
  discountType: DiscountType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request params for fetching applicable discounts
export interface GetApplicableDiscountsParams {
  cartIds: string[];
  storeId: string;
  search?: string;
}
