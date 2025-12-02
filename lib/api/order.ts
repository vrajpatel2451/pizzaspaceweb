import { APIResponse, PaginatedResponse } from "@/types";
import {
  CheckoutRequest,
  CheckoutResponse,
  OrderResponse,
  OrderQueryParams,
} from "@/types/order";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

/**
 * Create a new order with payment processing
 * @param orderData - Order details including cart items, delivery info, and payment method
 * @returns Order response with payment URL if online payment
 */
export const createOrder = async (
  orderData: CheckoutRequest
): Promise<APIResponse<CheckoutResponse>> => {
  try {
    const url = `/orders/checkout/user`;
    const response: AxiosResponse<APIResponse<CheckoutResponse>> =
      await apiClient.post<APIResponse<CheckoutResponse>>(url, orderData);
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

/**
 * Get detailed order information by order ID
 * @param orderId - The order ID
 * @returns Complete order details with items, billing, and status
 */
export const getOrderDetails = async (
  orderId: string
): Promise<APIResponse<OrderResponse>> => {
  try {
    const url = `/orders/details/${orderId}`;
    const response: AxiosResponse<APIResponse<OrderResponse>> =
      await apiClient.get<APIResponse<OrderResponse>>(url);
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

/**
 * Get paginated list of user orders with optional filters
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of orders
 */
export const getOrders = async (
  params: OrderQueryParams
): Promise<APIResponse<PaginatedResponse<OrderResponse>>> => {
  console.log("[getOrders API] Fetching orders with params:", params);
  try {
    const url = `/orders/users`;
    const response: AxiosResponse<
      APIResponse<PaginatedResponse<OrderResponse>>
    > = await apiClient.get<APIResponse<PaginatedResponse<OrderResponse>>>(
      url,
      { params }
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

/**
 * Download invoice PDF for an order
 * @param orderId - The order ID
 * @param format - Invoice format (default: 'normal')
 */
export const downloadInvoice = async (
  orderId: string,
  format: string = "normal"
): Promise<void> => {
  try {
    const response = await apiClient.get(
      `/orders/${orderId}/invoice/user?format=${format}`,
      {
        responseType: "blob",
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderId.substring(0, 8).toUpperCase()}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download invoice:", error);
    if (isAxiosError(error) && error.response) {
      // Try to parse error message from blob response
      const blob = error.response.data;
      if (blob instanceof Blob) {
        const text = await blob.text();
        try {
          const json = JSON.parse(text);
          throw new Error(
            json.errorMessage || json.message || "Failed to download invoice"
          );
        } catch {
          throw new Error("Failed to download invoice");
        }
      }
      throw new Error(
        error.response.data?.errorMessage || "Failed to download invoice"
      );
    }
    throw new Error("Failed to download invoice");
  }
};
