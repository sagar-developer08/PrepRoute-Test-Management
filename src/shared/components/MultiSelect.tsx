import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Badge } from "@/ui/badge";
import { cn } from "@/shared/lib/utils";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  disabled,
  className,
}: MultiSelectProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedOptions = options.filter((o) => selected.includes(o.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="flex flex-wrap gap-1">
            {selectedOptions.length === 0 && <span className="text-muted/70">{placeholder}</span>}
            {selectedOptions.map((opt) => (
              <Badge key={opt.id} variant="amber">
                {opt.name}
              </Badge>
            ))}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
        {options.length === 0 && <p className="px-2 py-1.5 text-sm text-muted">No options available</p>}
        {options.map((opt) => (
          <DropdownMenuCheckboxItem key={opt.id} checked={selected.includes(opt.id)} onCheckedChange={() => toggle(opt.id)}>
            {opt.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
