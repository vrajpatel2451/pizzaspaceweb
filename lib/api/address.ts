import { AddAddressData, AddressResponse, APIResponse } from "@/types";
import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";

export const getAddresses = async (): Promise<
  APIResponse<AddressResponse[]>
> => {
  const url = "/user/address/list";
  try {
    const response: AxiosResponse<APIResponse<AddressResponse[]>> =
      await apiClient.get<APIResponse<AddressResponse[]>>(url);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: [],
      errorMessage: "An unexpected error occurred",
    };
  }
};

// Create a new address
export const createAddress = async (
  data: AddAddressData,
): Promise<APIResponse<AddressResponse>> => {
  const url = "/user/address/create";
  try {
    const response: AxiosResponse<APIResponse<AddressResponse>> =
      await apiClient.post<APIResponse<AddressResponse>>(url, data);
    return response.data;
  } catch (error) {
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

// Update an address (full update)
export const updateAddress = async (
  addressId: string,
  data: AddAddressData,
): Promise<APIResponse<AddressResponse>> => {
  const url = `/user/address/${addressId}`;
  try {
    const response: AxiosResponse<APIResponse<AddressResponse>> =
      await apiClient.put<APIResponse<AddressResponse>>(url, data);
    return response.data;
  } catch (error) {
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
export const getAddressDetails = async (
  addressId: string,
): Promise<APIResponse<AddressResponse>> => {
  const url = `/user/address/${addressId}`;
  try {
    const response: AxiosResponse<APIResponse<AddressResponse>> =
      await apiClient.get<APIResponse<AddressResponse>>(url);
    return response.data;
  } catch (error) {
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

// Partially update an address (one or two fields)
export const patchAddress = async (
  addressId: string,
  data: Partial<AddAddressData>,
): Promise<APIResponse<AddressResponse>> => {
  const url = `/user/address/${addressId}`;
  try {
    const response: AxiosResponse<APIResponse<AddressResponse>> =
      await apiClient.patch<APIResponse<AddressResponse>>(url, data);
    return response.data;
  } catch (error) {
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

// Delete an address
export const deleteAddress = async (
  addressId: string,
): Promise<APIResponse<boolean>> => {
  const url = `/user/address/${addressId}`;
  try {
    const response: AxiosResponse<APIResponse<boolean>> =
      await apiClient.delete<APIResponse<boolean>>(url);
    return response.data;
  } catch (error) {
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
