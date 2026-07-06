import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateQuestions,
  deleteQuestion,
  fetchBulkQuestions,
  updateQuestion,
} from "../api/questionsApi";
import type { QuestionInput } from "../types";

export const questionKeys = {
  byIds: (ids: string[]) => ["questions", ...ids] as const,
};

export function useQuestionsByIds(ids: string[]) {
  return useQuery({
    queryKey: questionKeys.byIds(ids),
    queryFn: () => fetchBulkQuestions(ids),
    enabled: ids.length > 0,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (question: QuestionInput) => bulkCreateQuestions([question]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<QuestionInput> }) => updateQuestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
