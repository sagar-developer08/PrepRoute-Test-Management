import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTest, deleteTest, getTestById, getTests, updateTest } from "../api/testsApi";
import type { CreateTestPayload, Test, UpdateTestPayload } from "../types";

export const testKeys = {
  all: ["tests"] as const,
  detail: (id: string) => ["tests", id] as const,
};

export function useTestsList() {
  return useQuery({
    queryKey: testKeys.all,
    queryFn: getTests,
  });
}

export function useTest(id: string | undefined) {
  return useQuery({
    queryKey: testKeys.detail(id as string),
    queryFn: () => getTestById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTestPayload) => createTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testKeys.all });
    },
  });
}

export function useUpdateTest(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTestPayload) => updateTest(id as string, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: testKeys.all });
      queryClient.setQueryData(testKeys.detail(data.id), data);
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Test[]>(testKeys.all, (prev) => prev?.filter((test) => test.id !== id));
      queryClient.invalidateQueries({ queryKey: testKeys.all });
    },
  });
}
