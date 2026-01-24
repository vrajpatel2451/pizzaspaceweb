import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";
import type {
  RatingsListResponse,
  RatingsListParams,
  CreateRatingInput,
  CreateRatingResponse,
  GeneralRating,
} from "@/types";

/**
 * Get published customer ratings/testimonials
 * @param params - Pagination and sorting options
 * @returns Paginated list of published ratings
 */
export async function getGeneralRatings(
  params?: RatingsListParams
): Promise<RatingsListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.isAscending !== undefined)
      queryParams.append("isAscending", params.isAscending.toString());

    const queryString = queryParams.toString();
    const url = `/general-ratings/list${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<RatingsListResponse> =
      await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch ratings:", error);
    return {
      statusCode: 500,
      data: {
        ratings: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}

/**
 * Submit a new rating/testimonial
 * Note: Submitted ratings require admin approval before appearing publicly
 * Rate limit: 5 requests/hour
 * @param input - Rating data to submit
 * @returns Created rating with isPublished: false
 */
export async function createRating(
  input: CreateRatingInput
): Promise<CreateRatingResponse> {
  try {
    const response: AxiosResponse<CreateRatingResponse> = await apiClient.post(
      "/general-ratings/create",
      input
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create rating:", error);

    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        return {
          statusCode: 429,
          data: {} as GeneralRating,
        };
      }
      return {
        statusCode: error.response?.status || 500,
        data: {} as GeneralRating,
      };
    }

    return {
      statusCode: 500,
      data: {} as GeneralRating,
    };
  }
}
