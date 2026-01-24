import { AxiosResponse } from "axios";
import apiClient from "./client";
import type { SocialMediaListResponse } from "@/types";

/**
 * Get all social media links
 * @returns List of social media entries with name, logo, and link
 */
export async function getSocialMedia(): Promise<SocialMediaListResponse> {
  try {
    const response: AxiosResponse<SocialMediaListResponse> =
      await apiClient.get("/social-media/list");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch social media:", error);
    return {
      statusCode: 500,
      data: [],
    };
  }
}
