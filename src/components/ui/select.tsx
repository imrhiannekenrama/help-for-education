"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
}

export function Select({ value, onValueChange, options, placeholder = "Select...", className, id }: SelectProps) {
  return (
    <select
      id={id}
      value={value || ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn(
        "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-gray-700 dark:bg-gray-800 dark:text-white",
        className
      )}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
