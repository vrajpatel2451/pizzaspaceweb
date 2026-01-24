import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";
import type {
  ReservationInput,
  CreateReservationResponse,
  Reservation,
} from "@/types";

/**
 * Submit a table reservation request
 * Rate limit: 10 requests/hour
 * @param input - Reservation form data
 * @returns Created reservation with status: "open"
 */
export async function createReservation(
  input: ReservationInput
): Promise<CreateReservationResponse> {
  try {
    const response: AxiosResponse<CreateReservationResponse> =
      await apiClient.post("/reservation-form/create", input);
    return response.data;
  } catch (error) {
    console.error("Failed to create reservation:", error);

    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        return {
          statusCode: 429,
          data: {} as Reservation,
        };
      }
      if (error.response?.status === 400) {
        return {
          statusCode: 400,
          data: {} as Reservation,
        };
      }
      return {
        statusCode: error.response?.status || 500,
        data: {} as Reservation,
      };
    }

    return {
      statusCode: 500,
      data: {} as Reservation,
    };
  }
}
