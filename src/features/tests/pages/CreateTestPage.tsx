import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/hooks/useToast";
import { ApiError, type ApiFieldError } from "@/shared/services/httpClient";
import { useCreateTest } from "../hooks/useTests";
import { TestForm } from "../components/TestForm";
import type { TestType } from "../types";

const TYPE_LABELS: Record<TestType, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

export function CreateTestPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTest = useCreateTest();
  const [type, setType] = React.useState<TestType>("chapterwise");
  const [serverErrors, setServerErrors] = React.useState<ApiFieldError[]>([]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="text-sm text-muted">Test Creation / Create Test / {TYPE_LABELS[type]}</p>
        <h1 className="text-xl font-semibold text-foreground">Create a new test</h1>
      </div>

      <TestForm
        submitLabel="Next: Add Questions"
        isSubmitting={createTest.isPending}
        serverErrors={serverErrors}
        onTypeChange={setType}
        onSubmit={(payload) => {
          setServerErrors([]);
          createTest.mutate(
            {
              name: payload.name,
              type: payload.type,
              subject: payload.subject,
              topics: payload.topicNames,
              sub_topics: payload.subTopicNames,
              correct_marks: payload.correct_marks,
              wrong_marks: payload.wrong_marks,
              unattempt_marks: payload.unattempt_marks,
              difficulty: payload.difficulty,
              total_time: payload.total_time,
              total_marks: payload.total_marks,
              total_questions: payload.total_questions,
              status: "draft",
            },
            {
              onSuccess: (test) => {
                toast({ title: "Test created", description: "Now add your questions.", variant: "success" });
                navigate(`/tests/${test.id}/questions`);
              },
              onError: (error: Error) => {
                if (error instanceof ApiError) setServerErrors(error.fieldErrors);
                toast({ title: "Could not create test", description: error.message, variant: "destructive" });
              },
            },
          );
        }}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
