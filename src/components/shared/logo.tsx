import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <div className={cn("flex items-center gap-2 cursor-pointer", className)} onClick={onClick}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-md">
        <GraduationCap className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight">
        <span className="text-blue-600">Help</span> <span className="text-emerald-600">for Education</span>
      </span>
    </div>
  );
}
