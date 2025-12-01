export interface AddAddressData {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  area: string;
  county: string;
  country: string;
  zip: string;
  lat: number; // Required: Location must be provided before saving
  long: number; // Required: Location must be provided before saving
  type: "home" | "work" | "other";
  otherAddressLabel?: string;
  isDefault: boolean;
  isForMe?: boolean;
  recipientName?: string;
  recipientPhone?: string;
}

export interface AddressResponse {
  _id: string;
  name: string;
  isDefault: boolean;
  phone: string;
  line1: string;
  line2?: string;
  area: string;
  county: string;
  country: string;
  zip: string;
  userId: string;
  lat?: number;
  long?: number;
  type: "home" | "work" | "other";
  otherAddressLabel?: string;
  createdAt: string;
  updatedAt: string;
}
