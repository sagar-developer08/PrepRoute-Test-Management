import { useQuery } from "@tanstack/react-query";
import { getSubjects, getSubTopicsByTopics, getTopicsBySubject } from "../api/metadataApi";

export const metadataKeys = {
  subjects: ["subjects"] as const,
  topics: (subjectId: string | undefined) => ["topics", subjectId] as const,
  subTopics: (topicIds: string[]) => ["sub-topics", ...topicIds] as const,
};

export function useSubjects() {
  return useQuery({
    queryKey: metadataKeys.subjects,
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopics(subjectId: string | undefined) {
  return useQuery({
    queryKey: metadataKeys.topics(subjectId),
    queryFn: () => getTopicsBySubject(subjectId as string),
    enabled: Boolean(subjectId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubTopics(topicIds: string[]) {
  return useQuery({
    queryKey: metadataKeys.subTopics(topicIds),
    queryFn: () => getSubTopicsByTopics(topicIds),
    enabled: topicIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
