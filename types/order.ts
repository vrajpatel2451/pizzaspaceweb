import { AddressResponse } from "./address";
import { CustomerBillingOnCart, OrderDeliveryType } from "./cart";
import { StoreResponse } from "./store";
import { UserResponse } from "./user";
export type OrderItemStatus = "ordered" | "cancelled" | "returned";

export type PaymentType = "cash" | "online";

export type TimeRange =
  | "all"
  | "last7days"
  | "last30days"
  | "last90days"
  | "last3months"
  | "lastyear";

export type OrderStatus =
  | "initiated"
  | "payment_confirmed"
  | "payment_error"
  | "cancelled"
  | "preparing"
  | "ready_to_pickup"
  | "on_the_way"
  | "delivered";

export type OrderDiscountResponse = {
  discountId: string;
  discountName: string;
  discountAmount: number;
};

export type OrderVariantResponse = {
  variantId: string;
  variantName: string;
  variantAmount: number;
  isPrimary: boolean;
};

export type OrderAddonResponse = {
  addonId: string;
  addonName: string;
  addonAmount: number;
  addonQuantity: number;
};

export type Billing = {
  customerTotal: CustomerBillingOnCart;
};

export type AddonItem = {
  name: string;
  quantity: number;
};

export type OrderItemResponse = {
  name: string;
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  isRefunded: boolean;
  itemStatus: OrderItemStatus;
  refundedAt: string;
  refundAmount: number;
  refundInitiatedAt: string;
  refundQuantity: number;
  refundMessage: string;
  itemId: string;
  discount: OrderDiscountResponse;
  packingDiscount: OrderDiscountResponse;
  addons: AddonItem[];
  variants: string[];
};

export type OrderStatusAndTimeResponse = {
  createdAt: string;
  status: OrderStatus;
};

// export
export type OrderResponse = {
  status: OrderStatus;
  _id: string;
  statusList: OrderStatusAndTimeResponse[];
  createdDate: string;
  updatedDate: string;
  customerMessage: string;
  items: OrderItemResponse[];
  seller: {
    info: StoreResponse;
  };
  customer: {
    info: UserResponse;
    address: AddressResponse;
  };
  rider: {
    info: StaffResponse;
  };
  payment: {
    method: PaymentType;
    refId: string;
  };
  billing: Billing;
  staffId: string;
};

export interface StaffResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  storeId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  cartIds: string[];
  discountIds: string[];
  addressId?: string;
  paymentType: PaymentType;
  deliveryType: OrderDeliveryType;
  storeId: string;
  customerMessage?: string;
}

export interface CheckoutResponse {
  order: OrderResponse;
  openPaymentLink: boolean;
  paymentUrl: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string; // search on orderId (_id)
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  status?: OrderStatus;
  storeId?: string;
  sortBy?: string; // default updatedDate
  sortOrder?: "asc" | "desc"; // default desc
}
