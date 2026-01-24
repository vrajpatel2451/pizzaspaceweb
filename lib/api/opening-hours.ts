import { AxiosResponse } from "axios";
import apiClient from "./client";
import type { OpeningHoursListResponse } from "@/types";

/**
 * Get all opening hours for the store
 * @returns List of opening hours sorted by sortOrder
 */
export async function getOpeningHours(): Promise<OpeningHoursListResponse> {
  try {
    const response: AxiosResponse<OpeningHoursListResponse> =
      await apiClient.get("/opening-hours/list");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch opening hours:", error);
    return {
      statusCode: 500,
      data: [],
    };
  }
}
