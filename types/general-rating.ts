/**
 * General Rating (Testimonials) Types
 * API: GET /general-ratings/list, POST /general-ratings/create
 */

export interface GeneralRating {
  _id: string;
  personName: string;
  personImage?: string;
  ratings: number;
  personTagRole?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RatingsListData {
  ratings: GeneralRating[];
  pagination: RatingsPagination;
}

export interface RatingsListResponse {
  statusCode: number;
  data: RatingsListData;
}

export interface RatingsListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
}

export interface CreateRatingInput {
  personName: string;
  personImage?: string;
  ratings: number;
  personTagRole?: string;
  personPhone?: string;
}

export interface CreateRatingResponse {
  statusCode: number;
  data: GeneralRating;
}
