import { httpClient } from "@/shared/services/httpClient";
import type { ApiResponse } from "@/shared/types/api";
import type { LoginPayload, LoginResponseData } from "../types";

export async function login(payload: LoginPayload): Promise<LoginResponseData> {
  const { data } = await httpClient.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
  return data.data;
}
