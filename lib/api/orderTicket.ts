import {
  APIResponse,
  CreateTicketData,
  OrderTicketResponse,
  PaginatedResponse,
  TicketPaginationParams,
} from "@/types";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

export const createTicket = async (
  ticketData: CreateTicketData
): Promise<APIResponse<OrderTicketResponse>> => {
  try {
    const url = `/ticket/create-ticket`;
    const response: AxiosResponse<APIResponse<OrderTicketResponse>> =
      await apiClient.post<APIResponse<OrderTicketResponse>>(url, ticketData);
    return response.data;
  } catch (error) {
    console.error("Failed to create ticket:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
};

export const getOrderTickets = async (
  orderId: string,
  params: TicketPaginationParams
): Promise<APIResponse<PaginatedResponse<OrderTicketResponse>>> => {
  try {
    const url = `/ticket/get-order-tickets/${orderId}`;
    const response: AxiosResponse<
      APIResponse<PaginatedResponse<OrderTicketResponse>>
    > = await apiClient.get<
      APIResponse<PaginatedResponse<OrderTicketResponse>>
    >(url, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order tickets:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
};
