import { httpClient } from "@/shared/services/httpClient";
import type { ApiResponse } from "@/shared/types/api";
import type { Subject, SubTopic, Topic } from "../types";

export async function getSubjects(): Promise<Subject[]> {
  const { data } = await httpClient.get<ApiResponse<Subject[]>>("/subjects");
  return data.data;
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const { data } = await httpClient.get<ApiResponse<Topic[]>>(`/topics/subject/${subjectId}`);
  return data.data;
}

export async function getSubTopicsByTopic(topicId: string): Promise<SubTopic[]> {
  const { data } = await httpClient.get<ApiResponse<SubTopic[]>>(`/sub-topics/topic/${topicId}`);
  return data.data;
}

export async function getSubTopicsByTopics(topicIds: string[]): Promise<SubTopic[]> {
  const { data } = await httpClient.post<ApiResponse<SubTopic[]>>("/sub-topics/multi-topics", { topicIds });
  return data.data;
}
