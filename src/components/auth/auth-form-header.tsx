"use client";

import { GraduationCap, BookOpen, Award, Sparkles } from "lucide-react";

export function AuthFormHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg">
        <GraduationCap className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
