import { AxiosResponse } from "axios";
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
  if (params?.lat !== undefined)
    queryParams.append("lat", params.lat.toString());
  if (params?.long !== undefined)
    queryParams.append("long", params.long.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const queryString = queryParams.toString();
  const url = `/store${queryString ? `?${queryString}` : ""}`;

  try {
    const response: AxiosResponse<
      APIResponse<PaginatedResponse<StoreResponse>>
    > = await apiClient.get<APIResponse<PaginatedResponse<StoreResponse>>>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stores:", error);
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
