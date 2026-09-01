import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="inline-flex items-start gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              className={cn(
                "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 checked:border-blue-600 checked:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500",
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="text-xs text-red-600 font-medium pl-6">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
