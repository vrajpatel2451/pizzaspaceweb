import { AxiosResponse, isAxiosError } from "axios";
import apiClient from "./client";
import { APIResponse } from "@/types/api";
import {
  LoginUserPayload,
  RegisterUserPayload,
  UpdateUserPayload,
  UserResponse,
  UserResponseWithToken,
} from "@/types/user";

export async function loginUser(
  payload: LoginUserPayload,
): Promise<APIResponse<UserResponseWithToken | null>> {
  try {
    const response: AxiosResponse<APIResponse<UserResponseWithToken>> =
      await apiClient.post<APIResponse<UserResponseWithToken>>(
        "/user/login",
        payload,
      );
    console.log("Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to login:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
}

export async function registerUser(
  payload: RegisterUserPayload,
): Promise<APIResponse<UserResponseWithToken | null>> {
  try {
    const response: AxiosResponse<APIResponse<UserResponseWithToken>> =
      await apiClient.post<APIResponse<UserResponseWithToken>>(
        "/user/register",
        payload,
      );
    return response.data;
  } catch (error) {
    console.error("Failed to register:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
}

export async function getProfile(): Promise<APIResponse<UserResponse | null>> {
  try {
    const response: AxiosResponse<APIResponse<UserResponse>> =
      await apiClient.get<APIResponse<UserResponse>>("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
}

export async function updateUser(
  payload: UpdateUserPayload,
): Promise<APIResponse<UserResponse | null>> {
  try {
    const response: AxiosResponse<APIResponse<UserResponse>> =
      await apiClient.patch<APIResponse<UserResponse>>("/user/update", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      statusCode: 500,
      data: null,
      errorMessage: "An unexpected error occurred",
    };
  }
}
