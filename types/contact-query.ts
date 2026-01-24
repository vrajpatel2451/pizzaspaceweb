/**
 * Contact Query Types
 * API: POST /contact-queries/create
 */

export type ContactSubject =
  | "general inquiry"
  | "order issue"
  | "feedback"
  | "other"
  | "reservation"
  | "general complaint";

export type ContactQueryStatus = "open" | "closed";

export interface ContactQueryInput {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
  status: ContactQueryStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactQueryResponse {
  statusCode: number;
  data: ContactQuery;
}

export const CONTACT_SUBJECTS: { value: ContactSubject; label: string }[] = [
  { value: "general inquiry", label: "General Inquiry" },
  { value: "order issue", label: "Order Issue" },
  { value: "feedback", label: "Feedback" },
  { value: "reservation", label: "Reservation" },
  { value: "general complaint", label: "General Complaint" },
  { value: "other", label: "Other" },
];
