"use server";

import { reservationSchema, type ReservationFormData } from "@/lib/schemas";
import { createReservation as apiCreateReservation } from "@/lib/api";
import type { ReservationInput } from "@/types";

interface ReservationActionResult {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    status: string;
  };
}

/**
 * Server Action to create a reservation
 * Validates data with Zod schema and calls the API
 */
export async function createReservation(
  formData: ReservationFormData
): Promise<ReservationActionResult> {
  try {
    // Validate form data
    const validated = reservationSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid form data",
      };
    }

    // Prepare API payload
    const reservationInput: ReservationInput = {
      storeId: validated.data.storeId,
      date: validated.data.date, // Already in YYYY-MM-DD format
      time: validated.data.time, // Already in HH:MM format
      noOfGuest: validated.data.noOfGuest,
      name: validated.data.name,
      phone: validated.data.phone,
      message: validated.data.message || undefined,
    };

    // Call API
    const response = await apiCreateReservation(reservationInput);

    // Handle rate limiting
    if (response.statusCode === 429) {
      return {
        success: false,
        error: "RATE_LIMIT",
      };
    }

    // Handle validation errors
    if (response.statusCode === 400) {
      return {
        success: false,
        error: "Invalid reservation data. Please check your information and try again.",
      };
    }

    // Handle other errors
    if (response.statusCode !== 200 && response.statusCode !== 201) {
      return {
        success: false,
        error: "Failed to create reservation. Please try again later.",
      };
    }

    // Success
    return {
      success: true,
      data: {
        id: response.data._id,
        status: response.data.status,
      },
    };
  } catch (error) {
    console.error("Reservation action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
