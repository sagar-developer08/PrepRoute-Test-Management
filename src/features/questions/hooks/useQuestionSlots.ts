import * as React from "react";
import type { CorrectOption, Question, QuestionDifficulty } from "../types";
import { useQuestionsByIds } from "./useQuestions";
import type { Test } from "@/features/tests/types";

export interface QuestionSlot {
  id?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation: string;
  difficulty: QuestionDifficulty | "";
  topic: string;
  sub_topic: string;
}

export function emptySlot(): QuestionSlot {
  return {
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "option1",
    explanation: "",
    difficulty: "",
    topic: "",
    sub_topic: "",
  };
}

function questionToSlot(question: Question): QuestionSlot {
  return {
    id: question.id,
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correct_option: question.correct_option,
    explanation: question.explanation ?? "",
    difficulty: question.difficulty ?? "",
    topic: question.topic ?? "",
    sub_topic: question.sub_topic ?? "",
  };
}

export function isSlotFilled(slot: QuestionSlot) {
  return (
    slot.question.trim().length > 0 &&
    slot.option1.trim().length > 0 &&
    slot.option2.trim().length > 0 &&
    slot.option3.trim().length > 0 &&
    slot.option4.trim().length > 0
  );
}

export function useQuestionSlots(test: Test | undefined) {
  const existingIds = React.useMemo(() => test?.questions ?? [], [test?.questions]);
  const { data: fetchedQuestions, isLoading: isHydrating } = useQuestionsByIds(existingIds);

  const [slots, setSlots] = React.useState<QuestionSlot[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const hydratedRef = React.useRef(false);

  React.useEffect(() => {
    if (!test || hydratedRef.current) return;
    if (existingIds.length > 0 && !fetchedQuestions) return;

    const byId = new Map((fetchedQuestions ?? []).map((q) => [q.id, q]));
    const orderedExisting = existingIds.map((id) => byId.get(id)).filter((q): q is Question => Boolean(q));

    const slotCount = Math.max(test.total_questions, orderedExisting.length, 1);
    const initialSlots: QuestionSlot[] = Array.from({ length: slotCount }, (_, i) =>
      orderedExisting[i] ? questionToSlot(orderedExisting[i]) : emptySlot(),
    );

    setSlots(initialSlots);
    const firstEmpty = initialSlots.findIndex((s) => !isSlotFilled(s));
    setActiveIndex(firstEmpty === -1 ? 0 : firstEmpty);
    hydratedRef.current = true;
  }, [test, existingIds, fetchedQuestions]);

  const updateSlot = React.useCallback((index: number, patch: Partial<QuestionSlot>) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
  }, []);

  const resetSlot = React.useCallback((index: number) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...emptySlot(), id: undefined } : slot)));
  }, []);

  const setSlotSaved = React.useCallback((index: number, id: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, id } : slot)));
  }, []);

  const addSlot = React.useCallback(() => {
    setSlots((prev) => [...prev, emptySlot()]);
    setActiveIndex((prevIndex) => prevIndex);
  }, []);

  const appendSlots = React.useCallback((newSlots: QuestionSlot[], onAppended?: (firstNewIndex: number) => void) => {
    setSlots((prev) => {
      const firstNewIndex = prev.length;
      const next = [...prev, ...newSlots];
      // Navigate to first new slot after state update
      setTimeout(() => {
        setActiveIndex(firstNewIndex);
        onAppended?.(firstNewIndex);
      }, 0);
      return next;
    });
  }, []);

  return {
    slots,
    activeIndex,
    setActiveIndex,
    updateSlot,
    resetSlot,
    setSlotSaved,
    addSlot,
    appendSlots,
    isHydrating: existingIds.length > 0 && isHydrating,
  };
}
