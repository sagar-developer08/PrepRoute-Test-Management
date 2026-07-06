import * as React from "react";
import {
  Archive,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Files,
  Info,
  IndianRupee,
  MessageCircle,
  Settings,
  SquarePen,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { icon: TrendingUp, label: "Dashboard", to: "/", isActive: (path: string) => path === "/" },
  { icon: SquarePen, label: "Test Creation", to: "/tests/new", isActive: (path: string) => path.startsWith("/tests") },
  { icon: Info, label: "Announcements", to: null, isActive: () => false },
  { icon: Files, label: "Question Bank", to: null, isActive: () => false },
  { icon: Users, label: "Students", to: null, isActive: () => false },
  { icon: Building2, label: "Institutes", to: null, isActive: () => false },
  { icon: CircleUserRound, label: "Instructors", to: null, isActive: () => false },
  { icon: Archive, label: "Archive", to: null, isActive: () => false },
  { icon: IndianRupee, label: "Payments", to: null, isActive: () => false },
  { icon: Trophy, label: "Results", to: null, isActive: () => false },
  { icon: MessageCircle, label: "Support", to: null, isActive: () => false },
  { icon: Bell, label: "Notifications", to: null, isActive: () => false },
  { icon: Settings, label: "Settings", to: null, isActive: () => false },
];

export function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="relative flex shrink-0">
      <aside
        className={cn(
          "app-shell__sidebar overflow-hidden transition-[width] duration-200",
          expanded ? "w-60" : "w-[72px]",
        )}
      >
        <nav className={cn("flex flex-col gap-1 py-6", expanded ? "w-60 px-3" : "w-[72px] items-center")}>
          {NAV_ITEMS.map(({ icon: Icon, label, to, isActive }) => {
            const active = isActive(location.pathname);

            const content = (
              <span
                title={expanded ? undefined : label}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-lg transition-colors",
                  expanded ? "px-3 py-2.5 text-sm font-medium" : "size-11 justify-center",
                  active
                    ? "bg-primary/10 text-primary"
                    : to
                      ? "text-muted hover:bg-bg hover:text-foreground"
                      : "cursor-not-allowed text-muted/40",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {expanded && label}
              </span>
            );

            return to ? (
              <Link key={label} to={to} aria-label={label}>
                {content}
              </Link>
            ) : (
              <span key={label} aria-label={label}>
                {content}
              </span>
            );
          })}
        </nav>
      </aside>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute top-1/2 -right-3 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm transition-colors hover:text-foreground"
      >
        {expanded ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
      </button>
    </div>
  );
}
