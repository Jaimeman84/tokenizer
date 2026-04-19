"use client";

import { useState } from "react";
import { MODEL_OPTIONS, ModelOption } from "@/lib/constants";

interface ModelSelectorProps {
  value: string;
  onChange: (encoding: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<ModelOption | null>(null);

  const selected = MODEL_OPTIONS.find((m) => m.encoding === value) ?? MODEL_OPTIONS[0];
  const preview = hovered ?? selected;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
      >
        <span className="font-mono">{selected.badge}</span>
        <span className="text-blue-400">·</span>
        <span>{selected.label}</span>
        <svg
          className={`h-3 w-3 text-blue-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Select Tokenizer Encoding
              </p>
            </div>

            <div className="flex">
              {/* Model list */}
              <ul className="w-48 shrink-0 border-r border-gray-100 py-1.5">
                {MODEL_OPTIONS.map((model) => {
                  const isActive = model.encoding === value;
                  return (
                    <li key={model.encoding}>
                      <button
                        className={`w-full px-4 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-blue-50"
                            : hovered?.encoding === model.encoding
                            ? "bg-gray-50"
                            : "hover:bg-gray-50"
                        }`}
                        onMouseEnter={() => setHovered(model)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => {
                          onChange(model.encoding);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-gray-700">
                            {model.badge}
                          </span>
                          {isActive && (
                            <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 leading-tight">
                          {model.label}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Definition panel */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-gray-800">
                      {preview.badge}
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-blue-600">
                      {preview.label}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 whitespace-nowrap">
                    {preview.vocabulary}
                  </span>
                </div>

                <p className="mt-2.5 text-xs font-medium text-gray-700">
                  {preview.description}
                </p>

                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                  {preview.detail}
                </p>

                <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    Used by
                  </p>
                  <p className="text-xs font-mono text-gray-600">
                    {preview.models}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
