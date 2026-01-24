/**
 * Reservation Types
 * API: POST /reservation-form/create
 */

export type ReservationStatus = "open" | "cancelled" | "reserved";

export interface ReservationInput {
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
}

export interface Reservation {
  _id: string;
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
  status: ReservationStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationResponse {
  statusCode: number;
  data: Reservation;
}
