import {
  AddToCartPayload,
  CartResponse,
  CustomerBillingOnCart,
  PricingForCartParams,
  UpdateCartPayload,
} from "@/types";
import { APIResponse } from "@/types/api";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

export async function getCart(
  deviceId: string,
  storeId: string
): Promise<APIResponse<CartResponse[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (deviceId) queryParams.append("sessionId", deviceId.toString());
    if (storeId) queryParams.append("storeId", storeId.toString());
    const queryString = queryParams.toString();
    const url = `/customer/cart${queryString ? `?${queryString}` : ""}`;
    const response: AxiosResponse<APIResponse<CartResponse[]>> =
      await apiClient.get<APIResponse<CartResponse[]>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: [],
      errorMessage: "An unexpected error occurred",
    };
  }
}
export async function addToCart(
  data: AddToCartPayload
): Promise<APIResponse<CartResponse>> {
  try {
    const url = `/customer/cart/add`;
    const response: AxiosResponse<APIResponse<CartResponse>> =
      await apiClient.post<APIResponse<CartResponse>>(url, data);
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
}
export async function updateCart(
  id: string,
  data: UpdateCartPayload
): Promise<APIResponse<CartResponse>> {
  try {
    const url = `/customer/cart/update/${id}`;
    const response: AxiosResponse<APIResponse<CartResponse>> =
      await apiClient.put<APIResponse<CartResponse>>(url, data);
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
}
export async function removeFromCart(
  id: string,
  deviceId: string
): Promise<APIResponse<boolean>> {
  try {
    const url = `/customer/cart/delete/${id}?sessionId=${deviceId}`;
    const response: AxiosResponse<APIResponse<boolean>> =
      await apiClient.delete<APIResponse<boolean>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: false,
      errorMessage: "An unexpected error occurred",
    };
  }
}
export async function getCartSummary(
  params: PricingForCartParams
): Promise<APIResponse<CustomerBillingOnCart>> {
  try {
    const url = `/customer/cart/summary`;

    const body: PricingForCartParams = { ...params };
    if (!body.discountIds?.length) {
      delete body.discountIds;
    }
    if (!body.addressId) {
      delete body.addressId;
    }
    if (!body.deliveryType) {
      delete body.deliveryType;
    }
    const response: AxiosResponse<APIResponse<CustomerBillingOnCart>> =
      await apiClient.post<APIResponse<CustomerBillingOnCart>>(url, body);
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
}
