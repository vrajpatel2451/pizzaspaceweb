// /review-order
// /get-review/:orderId

import {
  APIResponse,
  CreateOrderReviewData,
  OrderReviewWithItemsResponse,
} from "@/types";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

// /review

export const createReview = async (
  reviewData: CreateOrderReviewData
): Promise<APIResponse<OrderReviewWithItemsResponse>> => {
  try {
    const url = `/review/review-order`;
    const response: AxiosResponse<APIResponse<OrderReviewWithItemsResponse>> =
      await apiClient.post<APIResponse<OrderReviewWithItemsResponse>>(
        url,
        reviewData
      );
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
};

export const getOrderReview = async (
  orderId: string
): Promise<APIResponse<OrderReviewWithItemsResponse>> => {
  try {
    const url = `/review/get-review/${orderId}`;
    const response: AxiosResponse<APIResponse<OrderReviewWithItemsResponse>> =
      await apiClient.get<APIResponse<OrderReviewWithItemsResponse>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
};
