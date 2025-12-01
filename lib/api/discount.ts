import {
  APIResponse,
  DiscountResponse,
  GetApplicableDiscountsParams,
} from "@/types";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

export const getDiscounts = async (
  params: GetApplicableDiscountsParams
): Promise<APIResponse<DiscountResponse[]>> => {
  const url = "/discount/applicable-for-user-by-user";
  try {
    const response: AxiosResponse<APIResponse<DiscountResponse[]>> =
      await apiClient.post<APIResponse<DiscountResponse[]>>(url, params);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: [],
      errorMessage: "An unexpected error occurred",
    };
  }
};
