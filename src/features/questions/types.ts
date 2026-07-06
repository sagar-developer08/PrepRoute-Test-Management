export type QuestionDifficulty = "easy" | "medium" | "difficult";
export type CorrectOption = "option1" | "option2" | "option3" | "option4";

export interface Question {
  id: string;
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation?: string | null;
  difficulty?: QuestionDifficulty | null;
  media_url?: string | null;
  test_id: string;
  topic?: string | null;
  sub_topic?: string | null;
  subject?: string | null;
  created_at?: string;
}

export interface QuestionInput {
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id: string;
  subject: string;
}
