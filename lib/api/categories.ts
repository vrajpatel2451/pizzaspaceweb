import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  CategoryResponse,
  CategoryQueryParams,
} from "@/types";

export async function getCategories(
  params?: CategoryQueryParams
): Promise<APIResponse<PaginatedResponse<CategoryResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.storeId) queryParams.append("storeId", params.storeId);
  if (params?.all !== undefined)
    queryParams.append("all", params.all.toString());
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);

  const queryString = queryParams.toString();
  const url = `/categories${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<
    APIResponse<PaginatedResponse<CategoryResponse>>
  >(url);

  return response.data;
}
