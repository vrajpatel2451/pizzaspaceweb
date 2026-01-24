import { AxiosResponse } from "axios";
import apiClient from "./client";
import type { PolicyListResponse, PolicyDetailsResponse } from "@/types";

/**
 * Get all policies (without full content)
 * @returns List of policies with name, slug, and showOnFooter flag
 */
export async function getPolicies(): Promise<PolicyListResponse> {
  try {
    const response: AxiosResponse<PolicyListResponse> =
      await apiClient.get("/policies/list");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch policies:", error);
    return {
      statusCode: 500,
      data: [],
    };
  }
}

/**
 * Get full policy content by slug
 * @param slug - The policy slug (e.g., "privacy-policy")
 * @returns Full policy with content or null if not found
 */
export async function getPolicyBySlug(
  slug: string
): Promise<PolicyDetailsResponse> {
  try {
    const response: AxiosResponse<PolicyDetailsResponse> = await apiClient.get(
      `/policies/details/${encodeURIComponent(slug)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch policy ${slug}:`, error);
    return {
      statusCode: 500,
      data: null,
    };
  }
}
