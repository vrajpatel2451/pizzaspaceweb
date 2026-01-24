import { AxiosResponse } from "axios";
import apiClient from "./client";
import type { ContactInfoResponse } from "@/types";

/**
 * Get the published contact information
 * @returns Published contact info or null if none exists
 */
export async function getPublishedContactInfo(): Promise<ContactInfoResponse> {
  try {
    const response: AxiosResponse<ContactInfoResponse> =
      await apiClient.get("/contact-info/published");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return {
      statusCode: 500,
      data: null,
    };
  }
}
