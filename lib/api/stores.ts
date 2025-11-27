import apiClient from "./client";
import {
  APIResponse,
  PaginatedResponse,
  StoreResponse,
  StoreQueryParams,
} from "@/types";

export async function getStores(
  params?: StoreQueryParams
): Promise<APIResponse<PaginatedResponse<StoreResponse>>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.lat !== undefined) queryParams.append("lat", params.lat.toString());
  if (params?.long !== undefined)
    queryParams.append("long", params.long.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const queryString = queryParams.toString();
  const url = `/stores${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<
    APIResponse<PaginatedResponse<StoreResponse>>
  >(url);

  return response.data;
}
