import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { useToast } from "@/shared/hooks/useToast";
import { ApiError, type ApiFieldError } from "@/shared/services/httpClient";
import { useUpdateTest } from "../hooks/useTests";
import { TestForm } from "./TestForm";
import type { Test } from "../types";

interface EditTestDialogProps {
  test: Test;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (test: Test) => void;
}

export function EditTestDialog({ test, open, onOpenChange, onSaved }: EditTestDialogProps) {
  const { toast } = useToast();
  const updateTest = useUpdateTest(test.id);
  const [serverErrors, setServerErrors] = React.useState<ApiFieldError[]>([]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Test creation</DialogTitle>
        </DialogHeader>
        <TestForm
          initialTest={test}
          submitLabel="Save"
          isSubmitting={updateTest.isPending}
          serverErrors={serverErrors}
          onCancel={() => onOpenChange(false)}
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
                onSuccess: (updated) => {
                  toast({ title: "Test details updated", variant: "success" });
                  onOpenChange(false);
                  onSaved?.(updated);
                },
                onError: (error: Error) => {
                  if (error instanceof ApiError) setServerErrors(error.fieldErrors);
                  toast({ title: "Could not update test", description: error.message, variant: "destructive" });
                },
              },
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
