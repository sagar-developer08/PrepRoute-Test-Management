import { Check } from "lucide-react";
import { Card } from "@/ui/card";
import { cn } from "@/shared/lib/utils";
import type { Question } from "../types";

const OPTION_KEYS = ["option1", "option2", "option3", "option4"] as const;

export function QuestionPreviewList({ questions }: { questions: Question[] }) {
  if (questions.length === 0) {
    return <p className="text-sm text-muted">No questions added to this test yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, index) => (
        <Card key={q.id} className="p-5">
          <p className="text-sm font-medium text-foreground">
            {index + 1}. {q.question}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {OPTION_KEYS.map((key) => (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  q.correct_option === key
                    ? "border-success/40 bg-success-bg text-success"
                    : "border-border text-foreground",
                )}
              >
                {q.correct_option === key && <Check className="size-3.5 shrink-0" />}
                <span>{q[key]}</span>
              </div>
            ))}
          </div>
          {q.explanation && <p className="mt-3 text-xs text-muted">Explanation: {q.explanation}</p>}
        </Card>
      ))}
    </div>
  );
}
