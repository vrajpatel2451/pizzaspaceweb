export type OrderReviewResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  staffId?: string;
  overallRatings: number;
  overallMessage?: string;
  deliveryBoyRatings?: number;
  deliveryBoyMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemReviewResponse = {
  _id: string;
  orderId: string;
  itemId: string;
  userId: string;
  storeId: string;
  ratings: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateOrderReviewData {
  order: {
    orderId: string;
    overallRatings: number;
    overallMessage?: string;
    deliveryBoyRatings?: number;
    deliveryBoyMessage?: string;
    storeId: string;
    staffId?: string;
  };
  items: Array<{
    orderId: string;
    itemId: string;
    ratings: number;
    message?: string;
    storeId: string;
  }>;
}

export type OrderReviewWithItemsResponse = {
  order: OrderReviewResponse;
  items: OrderItemReviewResponse[];
};
