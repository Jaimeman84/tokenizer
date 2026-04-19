import { InsightCard } from "./InsightCard";

const INSIGHTS = [
  {
    icon: "🔤",
    title: "What is a token?",
    body: "A token is a chunk of text — roughly 4 characters on average in English. It could be a word, part of a word, a space, or punctuation.",
  },
  {
    icon: "🧮",
    title: "Why tokens matter",
    body: "AI models don't read words — they read token IDs. Every token has a unique integer ID in the model's vocabulary (cl100k_base has ~100k tokens).",
  },
  {
    icon: "🔢",
    title: "Token IDs",
    body: 'Toggle "Show Token IDs" to see the integer each token maps to. The same word with a leading space is a different token ID than without.',
  },
  {
    icon: "🌍",
    title: "Languages cost differently",
    body: "English averages ~1 token per 4 chars. Chinese, Arabic, and other non-Latin scripts often use 2–4 tokens per character.",
  },
  {
    icon: "⬜",
    title: "Spaces matter",
    body: 'A space at the start of a word is usually part of the token. " hello" and "hello" are different tokens with different IDs. Try it!',
  },
  {
    icon: "📋",
    title: "System vs user tokens",
    body: "System prompts run on every request. A 200-token system prompt on 1,000 requests = 200,000 extra tokens. Keep them tight.",
  },
  {
    icon: "🎨",
    title: "Colors = token boundaries",
    body: "Each color block is one token. Where a color changes is exactly where one token ends and the next begins.",
  },
];

export function InsightsPanel() {
  return (
    <aside className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1 w-5 rounded bg-blue-500" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Learn
        </h2>
      </div>
      {INSIGHTS.map((insight) => (
        <InsightCard key={insight.title} {...insight} />
      ))}
    </aside>
  );
}
