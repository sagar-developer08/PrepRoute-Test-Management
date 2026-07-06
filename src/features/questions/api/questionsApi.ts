import { httpClient } from "@/shared/services/httpClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Question, QuestionInput } from "../types";

export async function bulkCreateQuestions(questions: QuestionInput[]): Promise<Question[]> {
  const { data } = await httpClient.post<ApiResponse<Question[]>>("/questions/bulk", { questions });
  return data.data;
}

export async function fetchBulkQuestions(questionIds: string[]): Promise<Question[]> {
  if (questionIds.length === 0) return [];
  const { data } = await httpClient.post<ApiResponse<Question[]>>("/questions/fetchBulk", {
    question_ids: questionIds,
  });
  return data.data;
}

export async function updateQuestion(id: string, payload: Partial<QuestionInput>): Promise<Question> {
  const { data } = await httpClient.put<ApiResponse<Question>>(`/questions/${id}`, payload);
  return data.data;
}

export async function deleteQuestion(id: string): Promise<void> {
  await httpClient.delete<ApiResponse<null>>(`/questions/${id}`);
}
