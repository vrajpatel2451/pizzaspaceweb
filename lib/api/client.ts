import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pizzaspace.co.uk/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Response interceptor to transform responses to APIResponse<T>
// apiClient.interceptors.response.use(
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   (response: AxiosResponse): AxiosResponse<APIResponse<any>> => {
//     // Transform the response to match APIResponse interface
//     return response;
//   },
//   (error: AxiosError) => {
//     // Handle error responses
//     if (error.response) {
//       // Server responded with error status
//       const errorResponse: APIResponse<null> = {
//         statusCode: error.response.status,
//         data: null,
//       };

//       console.error("API Error:", {
//         status: error.response.status,
//         message: error.message,
//         url: error.config?.url,
//       });

//       return Promise.reject({
//         ...error,
//         response: {
//           ...error.response,
//           data: errorResponse,
//         },
//       });
//     } else if (error.request) {
//       // Request made but no response received
//       console.error("Network Error:", error.message);
//       return Promise.reject(error);
//     } else {
//       // Error in request setup
//       console.error("Request Error:", error.message);
//       return Promise.reject(error);
//     }
//   }
// );

export default apiClient;
