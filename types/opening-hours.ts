/**
 * Opening Hours Types
 * API: GET /opening-hours/list
 */

export interface OpeningHours {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHoursListResponse {
  statusCode: number;
  data: OpeningHours[];
}
