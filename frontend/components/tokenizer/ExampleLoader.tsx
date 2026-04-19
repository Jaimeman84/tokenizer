"use client";

import { useState } from "react";
import { EXAMPLES } from "@/lib/examples";
import { Button } from "@/components/ui/Button";

interface ExampleLoaderProps {
  onLoad: (systemPrompt: string, userPrompt: string) => void;
}

export function ExampleLoader({ onLoad }: ExampleLoaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 000 2h.75a.75.75 0 010 1.5H4.5A2.5 2.5 0 012 13.5v-11zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
        </svg>
        Load Example
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
        </svg>
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-20 mt-1.5 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Example Prompts
              </p>
            </div>
            <ul className="py-1.5">
              {EXAMPLES.map((example) => (
                <li key={example.id}>
                  <button
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      onLoad(example.systemPrompt, example.userPrompt);
                      setOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {example.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                      {example.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
