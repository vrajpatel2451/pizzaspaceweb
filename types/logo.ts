/**
 * Logo Types
 * API: GET /logos/list, GET /logos/details
 */

export type LogoType = "header" | "favicon" | "footer";
export type LogoTheme = "dark" | "light";

export interface Logo {
  _id: string;
  logoImage: string;
  type: LogoType;
  theme: LogoTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LogoListResponse {
  statusCode: number;
  data: Logo[];
}

export interface LogoDetailsResponse {
  statusCode: number;
  data: Logo | null;
}

export interface LogoDetailsParams {
  type: LogoType;
  theme: LogoTheme;
}
