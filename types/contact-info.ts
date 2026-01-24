/**
 * Contact Info Types
 * API: GET /contact-info/published
 */

export interface ContactInfo {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfoResponse {
  statusCode: number;
  data: ContactInfo | null;
}
