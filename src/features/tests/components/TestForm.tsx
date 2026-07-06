import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { MultiSelect } from "@/shared/components/MultiSelect";
import { useSubjects, useSubTopics, useTopics } from "@/features/metadata";
import type { ApiFieldError } from "@/shared/services/httpClient";
import type { CreateTestPayload, Test, TestType } from "../types";

function namesMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

const API_FIELD_TO_FORM_FIELD: Record<string, keyof TestFormValues> = {
  name: "name",
  subject: "subjectId",
  total_time: "total_time",
  difficulty: "difficulty",
  total_questions: "total_questions",
};

const testFormSchema = z.object({
  type: z.enum(["chapterwise", "pyq", "mock"]),
  name: z.string().min(3, "Name must be at least 3 characters"),
  subjectId: z.string().min(1, "Subject is required"),
  topicIds: z.array(z.string()).min(1, "Select at least one topic"),
  subTopicIds: z.array(z.string()),
  total_time: z.number().int().min(1, "Duration is required"),
  difficulty: z.enum(["easy", "medium", "difficult"]),
  wrong_marks: z.number(),
  unattempt_marks: z.number(),
  correct_marks: z.number(),
  total_questions: z.number().int().min(1, "Must have at least 1 question"),
});

export type TestFormValues = z.infer<typeof testFormSchema>;

interface TestFormProps {
  initialTest?: Test;
  submitLabel: string;
  isSubmitting?: boolean;
  serverErrors?: ApiFieldError[];
  onSubmit: (payload: CreateTestPayload & { subjectName: string; topicNames: string[]; subTopicNames: string[] }) => void;
  onCancel?: () => void;
  onTypeChange?: (type: TestType) => void;
}

const TEST_TYPES: { value: TestType; label: string }[] = [
  { value: "chapterwise", label: "Chapter Wise" },
  { value: "pyq", label: "PYQ" },
  { value: "mock", label: "Mock Test" },
];

export function TestForm({
  initialTest,
  submitLabel,
  isSubmitting,
  serverErrors,
  onSubmit,
  onCancel,
  onTypeChange,
}: TestFormProps) {
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      type: initialTest?.type ?? "chapterwise",
      name: initialTest?.name ?? "",
      subjectId: "",
      topicIds: [],
      subTopicIds: [],
      total_time: initialTest?.total_time ?? 60,
      difficulty: initialTest?.difficulty ?? "easy",
      wrong_marks: initialTest?.wrong_marks ?? -1,
      unattempt_marks: initialTest?.unattempt_marks ?? 0,
      correct_marks: initialTest?.correct_marks ?? 5,
      total_questions: initialTest?.total_questions ?? 50,
    },
  });

  const hydratedRef = React.useRef(false);
  const topicsHydratedRef = React.useRef(false);
  const subTopicsHydratedRef = React.useRef(false);

  const type = watch("type");
  const subjectId = watch("subjectId");
  const topicIds = watch("topicIds");
  const totalQuestions = watch("total_questions");
  const correctMarks = watch("correct_marks");

  // Reset form + immediately hydrate subject when dialog opens (or test changes).
  // We try to set subjectId right away if subjects are already cached so there
  // is no blank flash. The fallback effect below handles the async case.
  React.useEffect(() => {
    if (!initialTest) return;
    hydratedRef.current = false;
    topicsHydratedRef.current = false;
    subTopicsHydratedRef.current = false;

    const matchedSubject = subjects.find(
      (s) => s.id === initialTest.subject || namesMatch(s.name, initialTest.subject),
    );

    reset({
      type: initialTest.type ?? "chapterwise",
      name: initialTest.name ?? "",
      subjectId: matchedSubject?.id ?? "",
      topicIds: [],
      subTopicIds: [],
      total_time: initialTest.total_time ?? 60,
      difficulty: initialTest.difficulty ?? "easy",
      wrong_marks: initialTest.wrong_marks ?? -1,
      unattempt_marks: initialTest.unattempt_marks ?? 0,
      correct_marks: initialTest.correct_marks ?? 5,
      total_questions: initialTest.total_questions ?? 50,
    });

    if (matchedSubject) hydratedRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTest?.id]);

  React.useEffect(() => {
    onTypeChange?.(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const { data: topics = [], isLoading: topicsLoading } = useTopics(subjectId || undefined);
  const { data: subTopics = [], isLoading: subTopicsLoading } = useSubTopics(topicIds);

  React.useEffect(() => {
    if (!initialTest || hydratedRef.current || subjects.length === 0) return;
    const matchedSubject = subjects.find(
      (s) => s.id === initialTest.subject || namesMatch(s.name, initialTest.subject),
    );
    if (matchedSubject) {
      setValue("subjectId", matchedSubject.id);
      hydratedRef.current = true;
    }
  }, [initialTest, subjects, setValue]);

  React.useEffect(() => {
    if (!initialTest || topicsHydratedRef.current || topics.length === 0) return;
    const matchedTopicIds = topics
      .filter((t) => initialTest.topics?.some((value) => value === t.id || namesMatch(value, t.name)))
      .map((t) => t.id);
    if (matchedTopicIds.length > 0) {
      setValue("topicIds", matchedTopicIds);
      topicsHydratedRef.current = true;
    }
  }, [initialTest, topics, setValue]);

  React.useEffect(() => {
    if (!initialTest || subTopicsHydratedRef.current || subTopics.length === 0) return;
    const matchedSubTopicIds = subTopics
      .filter((st) => initialTest.sub_topics?.some((value) => value === st.id || namesMatch(value, st.name)))
      .map((st) => st.id);
    if (matchedSubTopicIds.length > 0) {
      setValue("subTopicIds", matchedSubTopicIds);
      subTopicsHydratedRef.current = true;
    }
  }, [initialTest, subTopics, setValue]);

  const unmatchedServerErrors = React.useMemo(() => {
    if (!serverErrors || serverErrors.length === 0) return [];
    return serverErrors.filter((fieldError) => !API_FIELD_TO_FORM_FIELD[fieldError.path]);
  }, [serverErrors]);

  React.useEffect(() => {
    if (!serverErrors) return;
    for (const fieldError of serverErrors) {
      const formField = API_FIELD_TO_FORM_FIELD[fieldError.path];
      if (formField) {
        setError(formField, { type: "server", message: fieldError.msg });
      }
    }
  }, [serverErrors, setError]);

  const computedTotalMarks = (Number(totalQuestions) || 0) * (Number(correctMarks) || 0);

  const submit = (values: TestFormValues) => {
    const subjectName = subjects.find((s) => s.id === values.subjectId)?.name ?? "";
    const topicNames = topics.filter((t) => values.topicIds.includes(t.id)).map((t) => t.name);
    const subTopicNames = subTopics.filter((st) => values.subTopicIds.includes(st.id)).map((st) => st.name);

    onSubmit({
      name: values.name,
      type: values.type,
      subject: values.subjectId,
      topics: values.topicIds,
      sub_topics: values.subTopicIds,
      correct_marks: values.correct_marks,
      wrong_marks: values.wrong_marks,
      unattempt_marks: values.unattempt_marks,
      difficulty: values.difficulty,
      total_time: values.total_time,
      total_marks: computedTotalMarks,
      total_questions: values.total_questions,
      subjectName,
      topicNames,
      subTopicNames,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="relative flex flex-col gap-6" noValidate>
      {/* Loading overlay for edit mode while API data is pending */}
      {initialTest && subjectsLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-surface/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <svg className="size-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-muted">Loading test data...</p>
          </div>
        </div>
      )}

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Tabs value={field.value} onValueChange={field.onChange}>
            <TabsList>
              {TEST_TYPES.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      />

      {unmatchedServerErrors.length > 0 && (
        <div className="rounded-md border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {unmatchedServerErrors.map((fieldError) => (
            <p key={fieldError.path}>{fieldError.msg}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Subject</Label>
          <Controller
            control={control}
            name="subjectId"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("topicIds", []);
                  setValue("subTopicIds", []);
                }}
                disabled={subjectsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose from Drop-down" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.subjectId && <p className="text-xs text-danger">{errors.subjectId.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name of Test</Label>
          <Input id="name" placeholder="Enter name of Test" invalid={Boolean(errors.name)} {...register("name")} />
          {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Topic</Label>
          <Controller
            control={control}
            name="topicIds"
            render={({ field }) => (
              <MultiSelect
                options={topics}
                selected={field.value}
                onChange={(ids) => {
                  field.onChange(ids);
                  setValue("subTopicIds", []);
                }}
                placeholder="Choose from Drop-down"
                disabled={!subjectId || topicsLoading}
              />
            )}
          />
          {errors.topicIds && <p className="text-xs text-danger">{errors.topicIds.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Sub Topic</Label>
          <Controller
            control={control}
            name="subTopicIds"
            render={({ field }) => (
              <MultiSelect
                options={subTopics}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Choose from Drop-down"
                disabled={topicIds.length === 0 || subTopicsLoading}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="total_time">Duration (Minutes)</Label>
          <Input
            id="total_time"
            type="number"
            placeholder="Enter the time"
            invalid={Boolean(errors.total_time)}
            {...register("total_time", { valueAsNumber: true })}
          />
          {errors.total_time && <p className="text-xs text-danger">{errors.total_time.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Test Difficulty Level</Label>
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-row items-center gap-6 pt-1.5"
              >
                {(["easy", "medium", "difficult"] as const).map((level) => (
                  <label key={level} className="flex cursor-pointer items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={level} />
                    {level}
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          {errors.difficulty && <p className="text-xs text-danger">{errors.difficulty.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Marking Scheme:</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Wrong Answer</span>
              <Input type="number" {...register("wrong_marks", { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Unattempted</span>
              <Input type="number" {...register("unattempt_marks", { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Correct Answer</span>
              <Input type="number" {...register("correct_marks", { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="total_questions">No of Questions</Label>
          <Input
            id="total_questions"
            type="number"
            placeholder="Ex:50"
            invalid={Boolean(errors.total_questions)}
            {...register("total_questions", { valueAsNumber: true })}
          />
          {errors.total_questions && <p className="text-xs text-danger">{errors.total_questions.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="total_marks">Total Marks</Label>
          <Input id="total_marks" disabled value={`${computedTotalMarks}`} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
