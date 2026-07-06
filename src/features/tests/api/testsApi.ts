import { httpClient } from "@/shared/services/httpClient";
import type { ApiResponse } from "@/shared/types/api";
import type { CreateTestPayload, Test, UpdateTestPayload } from "../types";

export async function getTests(): Promise<Test[]> {
  const { data } = await httpClient.get<ApiResponse<Test[]>>("/tests");
  return data.data;
}

export async function getTestById(id: string): Promise<Test> {
  const { data } = await httpClient.get<ApiResponse<Test>>(`/tests/${id}`);
  return data.data;
}

export async function createTest(payload: CreateTestPayload): Promise<Test> {
  const { data } = await httpClient.post<ApiResponse<Test>>("/tests", payload);
  return data.data;
}

export async function updateTest(id: string, payload: UpdateTestPayload): Promise<Test> {
  const { data } = await httpClient.put<ApiResponse<Test>>(`/tests/${id}`, payload);
  return data.data;
}

export async function deleteTest(id: string): Promise<void> {
  await httpClient.delete<ApiResponse<null>>(`/tests/${id}`);
}
