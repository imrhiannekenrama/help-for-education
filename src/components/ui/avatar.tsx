"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, src, alt, fallback, ...props }: React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; fallback?: string }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-sm font-medium text-white">
          {fallback?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
}
