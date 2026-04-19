"use client";

import { MAX_CHARS } from "@/lib/constants";

interface PromptInputProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function PromptInput({
  label,
  description,
  value,
  onChange,
  placeholder,
  rows = 5,
}: PromptInputProps) {
  const remaining = MAX_CHARS - value.length;
  const nearLimit = remaining < 500;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <div>
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        {value.length > 0 && (
          <span
            className={`text-xs tabular-nums ${
              nearLimit ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {remaining.toLocaleString()} left
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={MAX_CHARS}
        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
        spellCheck={false}
      />
    </div>
  );
}
