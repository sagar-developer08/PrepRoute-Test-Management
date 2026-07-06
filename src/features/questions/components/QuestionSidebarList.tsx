import * as React from "react";
import { ChevronRight, ChevronsLeft, CircleCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { isSlotFilled, type QuestionSlot } from "../hooks/useQuestionSlots";

interface QuestionSidebarListProps {
  slots: QuestionSlot[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function QuestionSidebarList({ slots, activeIndex, onSelect }: QuestionSidebarListProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Question creation</h2>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-muted transition-colors hover:text-foreground"
          aria-label={collapsed ? "Expand question list" : "Collapse question list"}
        >
          <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <p className="text-sm text-muted">Total Questions . {slots.length}</p>

      {!collapsed && (
        <div className="scroll-panel flex max-h-[70vh] flex-col gap-2 overflow-y-auto pr-1">
          {slots.map((slot, index) => {
            const filled = isSlotFilled(slot);
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "flex items-center justify-between rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  filled
                    ? cn("border-success/30 text-success", isActive ? "bg-success-bg" : "bg-surface")
                    : "border-border bg-surface text-muted/50",
                  isActive && "ring-2 ring-primary/40",
                )}
              >
                <span className="flex items-center gap-2">
                  {filled && <CircleCheck className="size-4" />}
                  Question {filled ? index + 1 : "x"}
                </span>
                <ChevronRight className="size-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
