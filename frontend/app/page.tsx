"use client";

import { useState } from "react";
import { useTokenizer } from "@/hooks/useTokenizer";
import { PromptInput } from "@/components/tokenizer/PromptInput";
import { TokenDisplay } from "@/components/tokenizer/TokenDisplay";
import { TokenStats } from "@/components/tokenizer/TokenStats";
import { TotalSummary } from "@/components/tokenizer/TotalSummary";
import { ExampleLoader } from "@/components/tokenizer/ExampleLoader";
import { ModelSelector } from "@/components/tokenizer/ModelSelector";
import { InsightsPanel } from "@/components/education/InsightsPanel";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { DEFAULT_ENCODING } from "@/lib/constants";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [showIds, setShowIds] = useState(false);
  const [encoding, setEncoding] = useState(DEFAULT_ENCODING);

  const { data, loading, error } = useTokenizer(systemPrompt, userPrompt, encoding);

  const systemSection = data?.sections.find((s) => s.label === "system");
  const userSection = data?.sections.find((s) => s.label === "user");

  const hasContent = systemPrompt.trim() || userPrompt.trim();

  function handleClear() {
    setSystemPrompt("");
    setUserPrompt("");
  }

  function handleLoadExample(sys: string, user: string) {
    setSystemPrompt(sys);
    setUserPrompt(user);
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
              T
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">
                AI Tokenizer
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                See how AI reads your text
              </p>
            </div>
          </div>
          <ModelSelector value={encoding} onChange={setEncoding} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Hero blurb */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">How it works:</span> Type or paste
              text below. Each colored block in the output is one token — the
              smallest unit an AI model processes. Watch how punctuation, spaces,
              and word boundaries become visible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ExampleLoader onLoad={handleLoadExample} />
                  {hasContent && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.749.749 0 011.275.326.749.749 0 01-.215.734L9.06 8l3.22 3.22a.749.749 0 01-.326 1.275.749.749 0 01-.734-.215L8 9.06l-3.22 3.22a.751.751 0 01-1.042-.018.751.751 0 01-.018-1.042L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                      </svg>
                      Clear
                    </Button>
                  )}
                </div>
                <Toggle
                  id="show-ids"
                  checked={showIds}
                  onChange={setShowIds}
                  label="Show Token IDs"
                />
              </div>

              {/* Error */}
              {error && <ErrorMessage message={error} />}

              {/* System Prompt Section */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                    SYSTEM
                  </span>
                  {loading && (
                    <span className="text-xs text-gray-400 animate-pulse">
                      tokenizing…
                    </span>
                  )}
                </div>
                <PromptInput
                  label="System Prompt"
                  description="Instructions you give the AI before the conversation starts."
                  value={systemPrompt}
                  onChange={setSystemPrompt}
                  placeholder="e.g. You are a helpful, concise assistant specialized in software engineering."
                  rows={4}
                />
                <div className="mt-3 flex flex-col gap-2">
                  {systemSection && (
                    <TokenStats
                      tokenCount={systemSection.token_count}
                      charCount={systemSection.char_count}
                    />
                  )}
                  <TokenDisplay
                    tokens={systemSection?.tokens ?? []}
                    showIds={showIds}
                    placeholder="Type above to see system prompt tokens"
                  />
                </div>
              </section>

              {/* User Prompt Section */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    USER
                  </span>
                  {loading && (
                    <span className="text-xs text-gray-400 animate-pulse">
                      tokenizing…
                    </span>
                  )}
                </div>
                <PromptInput
                  label="User Prompt"
                  description="The message sent by the user in a conversation."
                  value={userPrompt}
                  onChange={setUserPrompt}
                  placeholder="e.g. Explain what a token is in simple terms."
                  rows={4}
                />
                <div className="mt-3 flex flex-col gap-2">
                  {userSection && (
                    <TokenStats
                      tokenCount={userSection.token_count}
                      charCount={userSection.char_count}
                    />
                  )}
                  <TokenDisplay
                    tokens={userSection?.tokens ?? []}
                    showIds={showIds}
                    placeholder="Type above to see user prompt tokens"
                  />
                </div>
              </section>

              {/* Total Summary */}
              {data && (
                <TotalSummary
                  totalTokens={data.total_token_count}
                  totalChars={data.total_char_count}
                  encoding={data.encoding}
                />
              )}

              {/* Empty state */}
              {!hasContent && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
                  <div className="text-3xl mb-3">✍️</div>
                  <p className="text-sm font-medium text-gray-700">
                    Start typing or load an example
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Token visualization will appear as you type.
                  </p>
                </div>
              )}
            </div>

            {/* Right column — insights */}
            <InsightsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <p>Educational tokenizer · Powered by tiktoken</p>
          <p>Text is processed server-side and never stored.</p>
        </div>
      </footer>
    </div>
  );
}
