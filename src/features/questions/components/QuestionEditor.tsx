import { Bold, ChevronLeft, ChevronRight, Italic, Link2, List, Trash2, Underline } from "lucide-react";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { cn } from "@/shared/lib/utils";
import type { CorrectOption, QuestionDifficulty } from "../types";
import type { QuestionSlot } from "../hooks/useQuestionSlots";

const OPTION_KEYS = ["option1", "option2", "option3", "option4"] as const;

interface QuestionEditorProps {
  slot: QuestionSlot;
  index: number;
  total: number;
  testTopics: { id: string; name: string }[];
  testSubTopics: { id: string; name: string }[];
  onChange: (patch: Partial<QuestionSlot>) => void;
  onDeleteAll: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function QuestionEditor({
  slot,
  index,
  total,
  testTopics,
  testSubTopics,
  onChange,
  onDeleteAll,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: QuestionEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Question {index + 1}
          <span className="text-muted">/{total}</span>
        </h2>
        <button
          type="button"
          onClick={onDeleteAll}
          className="flex items-center gap-1.5 text-sm font-medium text-danger hover:underline"
        >
          <Trash2 className="size-3.5" />
          Delete All Edits
        </button>
      </div>

      <div className="rounded-lg border border-border">
        <div className="flex items-center gap-1 border-b border-border px-3 py-2 text-muted">
          <Italic className="size-4" />
          <Bold className="size-4" />
          <Underline className="size-4" />
          <Link2 className="size-4" />
          <span className="mx-1 h-4 w-px bg-border" />
          <List className="size-4" />
        </div>
        <Textarea
          value={slot.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Type here"
          className="min-h-[140px] rounded-none border-none focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Type the options below</Label>
        <RadioGroup
          value={slot.correct_option}
          onValueChange={(value) => onChange({ correct_option: value as CorrectOption })}
          className="flex flex-col gap-3"
        >
          {OPTION_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <RadioGroupItem value={key} />
              <div className="relative flex-1">
                <input
                  value={slot[key]}
                  onChange={(e) => onChange({ [key]: e.target.value } as Partial<QuestionSlot>)}
                  placeholder="Type Option here"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  )}
                />
                <button
                  type="button"
                  onClick={() => onChange({ [key]: "" } as Partial<QuestionSlot>)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Add Solution</Label>
        <Textarea
          value={slot.explanation}
          onChange={(e) => onChange({ explanation: e.target.value })}
          placeholder="Type here"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex items-center justify-center gap-6 py-1 text-muted">
        <button type="button" onClick={onPrev} disabled={!canPrev} className="disabled:opacity-30">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={onNext} disabled={!canNext} className="disabled:opacity-30">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-foreground">Question settings</h3>

        <div className="flex flex-col gap-1.5">
          <Label>Level of Difficulty</Label>
          <Select
            value={slot.difficulty || undefined}
            onValueChange={(value) => onChange({ difficulty: value as QuestionDifficulty })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select from Drop-down" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="difficult">Difficult</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Topic</Label>
          <Select value={slot.topic || undefined} onValueChange={(value) => onChange({ topic: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select from Drop-down" />
            </SelectTrigger>
            <SelectContent>
              {testTopics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Sub-topic</Label>
          <Select value={slot.sub_topic || undefined} onValueChange={(value) => onChange({ sub_topic: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select from Drop-down" />
            </SelectTrigger>
            <SelectContent>
              {testSubTopics.map((subTopic) => (
                <SelectItem key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
