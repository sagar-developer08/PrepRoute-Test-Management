import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/ui/button";
import { PageLoader } from "@/shared/components/PageLoader";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/hooks/useToast";
import { useTest, useUpdateTest, EditTestDialog } from "@/features/tests";
import { TestSummaryCard } from "@/features/tests/components/TestSummaryCard";
import { useCreateQuestion, useDeleteQuestion, useUpdateQuestion } from "../hooks/useQuestions";
import { isSlotFilled, useQuestionSlots } from "../hooks/useQuestionSlots";
import { QuestionSidebarList } from "../components/QuestionSidebarList";
import { QuestionEditor } from "../components/QuestionEditor";
import type { QuestionInput } from "../types";

export function AddQuestionsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: test, isLoading, isError } = useTest(testId);
  const updateTest = useUpdateTest(testId);
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const {
    slots,
    activeIndex,
    setActiveIndex,
    updateSlot,
    resetSlot,
    setSlotSaved,
    isHydrating,
  } = useQuestionSlots(test);

  const [editOpen, setEditOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  if (isLoading || isHydrating) return <PageLoader label="Loading test..." />;
  if (isError || !test || !testId) return <EmptyState title="Test not found" />;

  const activeSlot = slots[activeIndex];

  const syncTestQuestionIds = async (nextIds: string[]) => {
    await updateTest.mutateAsync({ questions: nextIds });
  };

  const persistActiveSlot = async (): Promise<boolean> => {
    if (!activeSlot) return true;
    if (!isSlotFilled(activeSlot)) return true;

    const payload: QuestionInput = {
      type: "mcq",
      question: activeSlot.question,
      option1: activeSlot.option1,
      option2: activeSlot.option2,
      option3: activeSlot.option3,
      option4: activeSlot.option4,
      correct_option: activeSlot.correct_option,
      explanation: activeSlot.explanation || undefined,
      difficulty: activeSlot.difficulty || undefined,
      topic: activeSlot.topic || undefined,
      sub_topic: activeSlot.sub_topic || undefined,
      test_id: testId,
      subject: test.subject,
    };

    try {
      setIsSaving(true);
      if (activeSlot.id) {
        await updateQuestion.mutateAsync({ id: activeSlot.id, payload });
      } else {
        const [created] = await createQuestion.mutateAsync(payload);
        setSlotSaved(activeIndex, created.id);
        await syncTestQuestionIds([...(test.questions ?? []), created.id]);
      }
      return true;
    } catch (error) {
      toast({
        title: "Could not save question",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const ok = await persistActiveSlot();
    if (!ok) return;

    if (activeIndex < slots.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      toast({ title: "All questions saved", variant: "success" });
      navigate(`/tests/${testId}/publish`);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleDeleteAll = async () => {
    if (activeSlot?.id) {
      try {
        await deleteQuestion.mutateAsync(activeSlot.id);
        await syncTestQuestionIds((test.questions ?? []).filter((id) => id !== activeSlot.id));
      } catch (error) {
        toast({
          title: "Could not delete question",
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        });
        return;
      }
    }
    resetSlot(activeIndex);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Test Creation / Create Test / {test.name}</p>
        <Button onClick={() => navigate(`/tests/${testId}/publish`)}>Publish</Button>
      </div>

      <TestSummaryCard test={test} onEdit={() => setEditOpen(true)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-4">
          <QuestionSidebarList slots={slots} activeIndex={activeIndex} onSelect={setActiveIndex} />

        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          {activeSlot && (
            <QuestionEditor
              slot={activeSlot}
              index={activeIndex}
              total={slots.length}
              testTopics={test.topics}
              testSubTopics={test.sub_topics}
              onChange={(patch) => updateSlot(activeIndex, patch)}
              onDeleteAll={handleDeleteAll}
              onPrev={handlePrev}
              onNext={handleNext}
              canPrev={activeIndex > 0}
              canNext={true}
            />
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <Button variant="danger" onClick={() => navigate("/")}>
              Exit Test Creation
            </Button>
            <Button onClick={handleNext} disabled={isSaving}>
              {isSaving ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </div>

      <EditTestDialog test={test} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
