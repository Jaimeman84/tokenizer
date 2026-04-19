export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const DEBOUNCE_MS = 300;
export const DEFAULT_ENCODING = "cl100k_base";
export const MAX_CHARS = 10000;

export interface ModelOption {
  encoding: string;
  label: string;
  models: string;
  vocabulary: string;
  description: string;
  detail: string;
  badge: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    encoding: "cl100k_base",
    label: "GPT-4 / GPT-3.5",
    models: "gpt-4, gpt-3.5-turbo, text-embedding-ada-002",
    vocabulary: "~100,000 tokens",
    badge: "cl100k_base",
    description: "The most widely used encoding today.",
    detail:
      "cl100k_base was introduced with GPT-4 and GPT-3.5-turbo. The name means 'CL encoding with ~100k vocabulary'. It handles English very efficiently (~1 token per 4 characters) and improves on older encodings for code and non-English text. The 'cl' prefix refers to the OpenAI tokenizer pipeline that built it.",
  },
  {
    encoding: "o200k_base",
    label: "GPT-4o / GPT-4o mini",
    models: "gpt-4o, gpt-4o-mini, o1, o3",
    vocabulary: "~200,000 tokens",
    badge: "o200k_base",
    description: "Newer, larger vocabulary for omni models.",
    detail:
      "o200k_base was introduced with GPT-4o ('o' for omni). Doubling the vocabulary to ~200k tokens makes it significantly more efficient for multilingual text, emojis, and code. The same sentence in Chinese or Arabic will use fewer tokens here than in cl100k_base. More vocabulary = fewer tokens = lower API cost for non-English content.",
  },
  {
    encoding: "p50k_base",
    label: "GPT-3 (Legacy)",
    models: "text-davinci-003, code-davinci-002, text-davinci-edit-001",
    vocabulary: "~50,000 tokens",
    badge: "p50k_base",
    description: "Older encoding from the GPT-3 era.",
    detail:
      "p50k_base was used by the original GPT-3 completion models. The 'p' refers to the BPE (Byte Pair Encoding) pipeline used at the time, and 50k is its vocabulary size. It is less efficient than cl100k_base — the same English text often needs more tokens. These models are now deprecated by OpenAI but the encoding is useful to study for historical comparison.",
  },
];
