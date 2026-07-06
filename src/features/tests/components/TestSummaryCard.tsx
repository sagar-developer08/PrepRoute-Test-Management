import { Award, Clock, ListChecks, Pencil } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Card } from "@/ui/card";
import type { Test } from "../types";

const TYPE_LABEL: Record<Test["type"], string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

const DIFFICULTY_VARIANT: Record<Test["difficulty"], "teal" | "amber" | "danger"> = {
  easy: "teal",
  medium: "amber",
  difficult: "danger",
};

interface TestSummaryCardProps {
  test: Test;
  onEdit?: () => void;
}

export function TestSummaryCard({ test, onEdit }: TestSummaryCardProps) {
  return (
    <Card className="relative p-5">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-5 top-5 text-muted hover:text-primary"
          aria-label="Edit test details"
        >
          <Pencil className="size-4" />
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="navy">{TYPE_LABEL[test.type]}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold text-foreground">{test.name}</h2>
        <Badge variant={DIFFICULTY_VARIANT[test.difficulty]} className="capitalize">
          {test.difficulty}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-y-2">
        <span className="text-muted">Subject</span>
        <span className="text-foreground">: {test.subject}</span>

        <span className="text-muted">Topic</span>
        <span className="flex flex-wrap gap-1.5">
          : {test.topics.map((t) => (
            <Badge key={t} variant="amber">
              {t}
            </Badge>
          ))}
        </span>

        <span className="text-muted">Sub Topic</span>
        <span className="flex flex-wrap gap-1.5">
          : {test.sub_topics.map((t) => (
            <Badge key={t} variant="amber">
              {t}
            </Badge>
          ))}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" /> {test.total_time} Min
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <ListChecks className="size-4" /> {test.total_questions} Q's
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <Award className="size-4" /> {test.total_marks} Marks
        </span>
      </div>
    </Card>
  );
}
