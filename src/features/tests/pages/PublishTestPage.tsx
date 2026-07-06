import * as React from "react";
import { addMonths, addWeeks } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { PageLoader } from "@/shared/components/PageLoader";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/hooks/useToast";
import { combineDateAndTime } from "@/shared/utils/formatDate";
import { useQuestionsByIds } from "@/features/questions/hooks/useQuestions";
import { QuestionPreviewList } from "@/features/questions/components/QuestionPreviewList";
import { useTest, useUpdateTest } from "../hooks/useTests";
import { TestSummaryCard } from "../components/TestSummaryCard";
import { EditTestDialog } from "../components/EditTestDialog";

type PublishMode = "now" | "schedule";
type LiveUntilOption = "always" | "1w" | "2w" | "3w" | "1m" | "custom";

export function PublishTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: test, isLoading, isError } = useTest(testId);
  const { data: questions = [], isLoading: questionsLoading } = useQuestionsByIds(test?.questions ?? []);
  const updateTest = useUpdateTest(testId);

  const [editOpen, setEditOpen] = React.useState(false);
  const [mode, setMode] = React.useState<PublishMode>("now");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [liveUntil, setLiveUntil] = React.useState<LiveUntilOption>("always");
  const [customEndDate, setCustomEndDate] = React.useState("");
  const [customEndTime, setCustomEndTime] = React.useState("");

  if (isLoading) return <PageLoader label="Loading test..." />;
  if (isError || !test || !testId) return <EmptyState title="Test not found" />;

  const filledCount = questions.length;
  const allDone = filledCount >= test.total_questions;

  const computeExpiryDate = (fromDate: Date): string | null => {
    switch (liveUntil) {
      case "always":
        return null;
      case "1w":
        return addWeeks(fromDate, 1).toISOString();
      case "2w":
        return addWeeks(fromDate, 2).toISOString();
      case "3w":
        return addWeeks(fromDate, 3).toISOString();
      case "1m":
        return addMonths(fromDate, 1).toISOString();
      case "custom":
        return combineDateAndTime(customEndDate, customEndTime);
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    if (!test.questions || test.questions.length === 0) {
      toast({ title: "Add at least one question before publishing", variant: "destructive" });
      return;
    }

    if (mode === "schedule" && !scheduledDate) {
      toast({ title: "Select a schedule date", variant: "destructive" });
      return;
    }
    if (liveUntil === "custom" && !customEndDate) {
      toast({ title: "Select a custom end date", variant: "destructive" });
      return;
    }

    const scheduledIso = mode === "schedule" ? combineDateAndTime(scheduledDate, scheduledTime) : undefined;
    const baseDate = scheduledIso ? new Date(scheduledIso) : new Date();
    const expiryIso = computeExpiryDate(baseDate) ?? undefined;

    updateTest.mutate(
      {
        status: mode === "schedule" ? "scheduled" : "live",
        ...(scheduledIso ? { scheduled_date: scheduledIso } : {}),
        ...(expiryIso ? { expiry_date: expiryIso } : {}),
      },
      {
        onSuccess: () => {
          toast({ title: "Test published successfully", variant: "success" });
          navigate("/");
        },
        onError: (error: Error) => {
          toast({ title: "Could not publish test", description: error.message, variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">Test created</h1>
          <Badge variant={allDone ? "success" : "amber"} className="gap-1">
            <CheckCircle2 className="size-3.5" />
            {allDone ? `All ${test.total_questions} Questions done` : `${filledCount}/${test.total_questions} Questions done`}
          </Badge>
        </div>
        <Button variant="outline" onClick={() => navigate(`/tests/${testId}/questions`)}>
          Edit Questions
        </Button>
      </div>

      <TestSummaryCard test={test} onEdit={() => setEditOpen(true)} />

      <Card>
        <CardContent className="flex flex-col gap-6 pt-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as PublishMode)}>
            <TabsList className="grid w-full grid-cols-2 sm:w-80">
              <TabsTrigger value="now">Publish Now</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Publish</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "schedule" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">Select Date and Time</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Live Until</h3>
              <p className="text-sm text-muted">Choose how long this test should remain available on the platform.</p>
            </div>

            <RadioGroup
              value={liveUntil}
              onValueChange={(v) => setLiveUntil(v as LiveUntilOption)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {[
                { value: "always", label: "Always Available" },
                { value: "3w", label: "3 Weeks" },
                { value: "1w", label: "1 Week" },
                { value: "1m", label: "1 Month" },
                { value: "2w", label: "2 Weeks" },
                { value: "custom", label: "Custom Duration" },
              ].map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>

            {liveUntil === "custom" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Select End Date</Label>
                  <Input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Select End Time</Label>
                  <Input type="time" value={customEndTime} onChange={(e) => setCustomEndTime(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={updateTest.isPending}>
              {updateTest.isPending ? "Publishing..." : "Confirm"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Questions overview</h3>
        {questionsLoading ? <PageLoader label="Loading questions..." /> : <QuestionPreviewList questions={questions} />}
      </div>

      <EditTestDialog test={test} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
