export interface SubCategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  all?: boolean;
  categoryId?: string;
}

export interface SubCategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  storeIds: string[];
}
