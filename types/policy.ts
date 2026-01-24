/**
 * Policy Types
 * API: GET /policies/list, GET /policies/details/:slug
 */

export interface PolicyListItem {
  _id: string;
  name: string;
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDetails extends PolicyListItem {
  content: string;
}

export interface PolicyListResponse {
  statusCode: number;
  data: PolicyListItem[];
}

export interface PolicyDetailsResponse {
  statusCode: number;
  data: PolicyDetails | null;
}
