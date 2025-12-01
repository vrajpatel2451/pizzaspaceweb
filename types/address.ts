export interface AddAddressData {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  area: string;
  county: string;
  country: string;
  zip: string;
  lat?: number;
  long?: number;
  type: "home" | "work" | "other";
  otherAddressLabel?: string;
  isDefault: boolean;
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
