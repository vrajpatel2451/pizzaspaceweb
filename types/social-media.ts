/**
 * Social Media Types
 * API: GET /social-media/list
 */

export interface SocialMedia {
  _id: string;
  name: string;
  logo: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMediaListResponse {
  statusCode: number;
  data: SocialMedia[];
}
