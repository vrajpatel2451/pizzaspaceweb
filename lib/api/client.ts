import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pizzaspace.co.uk/api/v1";

const AUTH_COOKIE_NAME = "pizzaspace_auth_token";

/**
 * Get auth token - works on both server and client
 */
async function getAuthToken(): Promise<string | null> {
  // Server-side: read from cookies using dynamic import
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
    } catch {
      return null;
    }
  }

  // Client-side: read from localStorage
  try {
    const authStorage = localStorage.getItem("pizzaspace-auth");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state?.token || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only run on client side
      if (typeof window !== "undefined") {
        // Clear auth storage on 401
        localStorage.removeItem("pizzaspace-auth");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
