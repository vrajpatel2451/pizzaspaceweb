import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  ProductResponse,
  ProductQueryParams,
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
  const url = `/products${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<
    APIResponse<PaginatedResponse<ProductResponse>>
  >(url);

  return response.data;
}
