import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  ProductResponse,
  ProductQueryParams,
  ProductDetailsResponse,
} from "@/types";

export async function getProducts(
  params?: ProductQueryParams
): Promise<APIResponse<PaginatedResponse<ProductResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.storeId) queryParams.append("storeId", params.storeId);
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.subCategoryId)
    queryParams.append("subCategoryId", params.subCategoryId);
  if (params?.all !== undefined)
    queryParams.append("all", params.all.toString());
  if (params?.ids && params.ids.length > 0) {
    params.ids.forEach((id) => queryParams.append("ids[]", id));
  }

  const queryString = queryParams.toString();
  const url = `/product${queryString ? `?${queryString}` : ""}`;

  try {
    const response: AxiosResponse<
      APIResponse<PaginatedResponse<ProductResponse>>
    > = await apiClient.get<APIResponse<PaginatedResponse<ProductResponse>>>(
      url
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      statusCode: 500,
      data: {
        data: [],
        meta: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }
}
export async function getProductDetails(
  productId: string
): Promise<APIResponse<ProductDetailsResponse>> {
  const url = `/product/details/${productId}`;
  try {
    const response: AxiosResponse<APIResponse<ProductDetailsResponse>> =
      await apiClient.get<APIResponse<ProductDetailsResponse>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "Internal Server Error",
    };
  }
}
