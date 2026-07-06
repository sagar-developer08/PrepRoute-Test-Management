import { Badge } from "@/ui/badge";
import type { TestStatus } from "@/features/tests/types";

const STATUS_CONFIG: Record<TestStatus, { label: string; variant: "outline" | "amber" | "success" | "danger" }> = {
  draft: { label: "Draft", variant: "outline" },
  scheduled: { label: "Scheduled", variant: "amber" },
  live: { label: "Live", variant: "success" },
  expired: { label: "Expired", variant: "danger" },
};

export function TestStatusBadge({ status }: { status: TestStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
