export type OrderTicketStatus = "open" | "closed";
export type OrderTicketResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  message: string;
  imageList: string[];
  status: OrderTicketStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
};

// Request types for creating tickets
export interface CreateTicketData {
  orderId: string;
  storeId: string;
  message: string;
  imageList: string[];
}
export interface TicketPaginationParams {
  currentPage?: number;
  limit?: number;
}
