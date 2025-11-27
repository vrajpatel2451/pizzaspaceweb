export interface StoreQueryParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
  search?: string;
  isActive?: boolean;
}

export type StoreResponse = {
  _id: string;
  name: string;
  imageUrl: string;
  phone: string;
  email: string;
  deliveryRadius: number;
  lat: number;
  long: number;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  isActive: boolean;
  createdAt: string;
};
