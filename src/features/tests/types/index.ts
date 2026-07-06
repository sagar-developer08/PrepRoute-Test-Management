export type TestType = "chapterwise" | "pyq" | "mock";
export type Difficulty = "easy" | "medium" | "difficult";
export type TestStatus = "draft" | "scheduled" | "live" | "expired" | "unpublished";

export interface Test {
  id: string;
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: string[] | null;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: TestStatus;
  scheduled_date: string | null;
  expiry_date: string | null;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
}

export interface CreateTestPayload {
  name: string;
  type: TestType;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: TestStatus | null;
}

export interface UpdateTestPayload extends Partial<CreateTestPayload> {
  questions?: string[];
  scheduled_date?: string | null;
  expiry_date?: string | null;
}
