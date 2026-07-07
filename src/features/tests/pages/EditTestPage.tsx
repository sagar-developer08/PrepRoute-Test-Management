import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { PageLoader } from "@/shared/components/PageLoader";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/hooks/useToast";
import { ApiError, type ApiFieldError } from "@/shared/services/httpClient";
import { useTest, useUpdateTest } from "../hooks/useTests";
import { TestForm } from "../components/TestForm";

export function EditTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: test, isLoading, isError } = useTest(testId);
  const updateTest = useUpdateTest(testId);
  const [serverErrors, setServerErrors] = React.useState<ApiFieldError[]>([]);

  if (isLoading) return <PageLoader label="Loading test details..." />;
  if (isError || !test) return <EmptyState title="Test not found" />;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="text-sm text-muted">Test Creation / Edit Test</p>
        <h1 className="text-xl font-semibold text-foreground">{test.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit test details</CardTitle>
        </CardHeader>
        <CardContent>
          <TestForm
            initialTest={test}
            submitLabel="Save changes"
            isSubmitting={updateTest.isPending}
            serverErrors={serverErrors}
            onCancel={() => navigate(-1)}
            onSubmit={(payload) => {
              setServerErrors([]);
              updateTest.mutate(
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
                },
                {
                  onSuccess: () => {
                    toast({ title: "Test details updated", variant: "success" });
                    navigate(`/tests/${test.id}/questions`);
                  },
                  onError: (error: Error) => {
                    if (error instanceof ApiError) setServerErrors(error.fieldErrors);
                    toast({ title: "Could not update test", description: error.message, variant: "destructive" });
                  },
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
