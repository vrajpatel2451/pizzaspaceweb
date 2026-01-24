import { AxiosResponse } from "axios";
import apiClient from "./client";
import type {
  LogoListResponse,
  LogoDetailsResponse,
  LogoDetailsParams,
} from "@/types";

/**
 * Get all logos
 * @returns List of all logos with type, theme, and publish status
 */
export async function getLogos(): Promise<LogoListResponse> {
  try {
    const response: AxiosResponse<LogoListResponse> =
      await apiClient.get("/logos/list");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch logos:", error);
    return {
      statusCode: 500,
      data: [],
    };
  }
}

/**
 * Get a specific logo by type and theme
 * @param params - Logo type (header/footer/favicon) and theme (light/dark)
 * @returns The matching logo or null
 */
export async function getLogoDetails(
  params: LogoDetailsParams
): Promise<LogoDetailsResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("type", params.type);
    queryParams.append("theme", params.theme);

    const response: AxiosResponse<LogoDetailsResponse> = await apiClient.get(
      `/logos/details?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch logo details:", error);
    return {
      statusCode: 500,
      data: null,
    };
  }
}
