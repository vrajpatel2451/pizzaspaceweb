export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  all?: boolean;
  categoryId?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  storeIds: string[];
}
