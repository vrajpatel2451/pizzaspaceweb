import { z } from "zod";

// Date format: YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Time format: HH:MM (24-hour)
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const reservationSchema = z.object({
  storeId: z
    .string()
    .length(24, "Invalid store selection")
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid store ID"),

  date: z
    .string()
    .regex(DATE_REGEX, "Please select a valid date (YYYY-MM-DD)")
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "Date must be today or in the future" }
    )
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return selectedDate <= maxDate;
      },
      { message: "Reservations can only be made up to 30 days in advance" }
    ),

  time: z
    .string()
    .regex(TIME_REGEX, "Please select a valid time (HH:MM)"),

  noOfGuest: z
    .number({ message: "Please enter the number of guests" })
    .int("Number of guests must be a whole number")
    .min(1, "At least 1 guest is required")
    .max(100, "Maximum 100 guests allowed"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^[\d\s\+\(\)-]+$/, "Please enter a valid phone number")
    .trim(),

  message: z
    .string()
    .max(1000, "Message must not exceed 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

/**
 * Generate time slots for a given start and end time
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @param intervalMinutes - Interval in minutes (default 30)
 * @returns Array of time slots in HH:MM format
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
    );
    currentMinutes += intervalMinutes;
  }

  return slots;
}
