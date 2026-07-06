import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/shared/constants/storage";
import type { ApiErrorBody } from "@/shared/types/api";

export interface ApiFieldError {
  path: string;
  msg: string;
}

export class ApiError extends Error {
  fieldErrors: ApiFieldError[];

  constructor(message: string, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
  }
}

function parseFieldErrors(errors: unknown): ApiFieldError[] {
  if (!Array.isArray(errors)) return [];
  return errors.filter(
    (entry): entry is ApiFieldError =>
      typeof entry === "object" && entry !== null && typeof (entry as ApiFieldError).msg === "string",
  );
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    const fieldErrors = parseFieldErrors(error.response?.data?.errors);
    const message =
      fieldErrors.map((fieldError) => fieldError.msg).join(" ") ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new ApiError(message, fieldErrors));
  },
);
