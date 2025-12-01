// API Types
export type PricingIdsAndQuantity = {
  id: string;
  quantity: number;
};

export type CartResponse = {
  _id: string;
  itemId: string;
  quantity: number;
  variantId: string;
  sessionId: string;
  categoryId: string;
  pricing: PricingIdsAndQuantity[];
  storeId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AddToCartPayload = Pick<
  CartResponse,
  | "itemId"
  | "categoryId"
  | "pricing"
  | "quantity"
  | "sessionId"
  | "variantId"
  | "storeId"
>;

export type UpdateCartPayload = Pick<
  CartResponse,
  "pricing" | "quantity" | "variantId" | "sessionId"
>;
// Order Delivery Types
export type OrderDeliveryType = "dineIn" | "pickup" | "delivery";

// Cart Summary / Pricing Types
export type CustomerAppliedTaxOnCart = {
  itemTotal: number;
  packing: number;
  deliveryCharges: number;
  extraCharges: Record<string, number>;
  total: number;
};

export type CustomerBillingOnCart = {
  itemTotal: number;
  itemTotalAfterDiscount: number;
  packingCharges: number;
  packingChargesAfterDiscount: number;
  deliveryCharges: number;
  deliveryChargesAfterDiscount: number;
  extraCharges: Record<string, [number, number]>;
  tax: CustomerAppliedTaxOnCart;
  totalDiscount: number;
  total: number;
};

export type PricingForCartParams = {
  cartIds: string[];
  discountIds?: string[];
  storeId: string;
  addressId?: string;
  deliveryType?: OrderDeliveryType;
};
