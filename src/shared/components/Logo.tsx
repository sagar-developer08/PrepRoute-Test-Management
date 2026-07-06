import { cn } from "@/shared/lib/utils";
import logo from "@/assets/preproute-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center select-none", className)}>
      <img src={logo} alt="PrepRoute" className="h-7 w-auto" />
    </div>
  );
}
