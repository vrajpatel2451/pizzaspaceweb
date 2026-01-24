import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";
import type {
  ContactQueryInput,
  CreateContactQueryResponse,
  ContactQuery,
} from "@/types";

/**
 * Submit a contact form query
 * Rate limit: 10 requests/hour
 * @param input - Contact form data
 * @returns Created contact query with status: "open"
 */
export async function createContactQuery(
  input: ContactQueryInput
): Promise<CreateContactQueryResponse> {
  try {
    const response: AxiosResponse<CreateContactQueryResponse> =
      await apiClient.post("/contact-queries/create", input);
    return response.data;
  } catch (error) {
    console.error("Failed to create contact query:", error);

    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        return {
          statusCode: 429,
          data: {} as ContactQuery,
        };
      }
      if (error.response?.status === 400) {
        return {
          statusCode: 400,
          data: {} as ContactQuery,
        };
      }
      return {
        statusCode: error.response?.status || 500,
        data: {} as ContactQuery,
      };
    }

    return {
      statusCode: 500,
      data: {} as ContactQuery,
    };
  }
}
