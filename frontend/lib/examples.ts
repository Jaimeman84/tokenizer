import { ExamplePrompt } from "@/types/examples";

export const EXAMPLES: ExamplePrompt[] = [
  {
    id: "basic-assistant",
    title: "Basic Assistant",
    description: "A simple assistant setup. Notice how common words tokenize as single tokens.",
    systemPrompt: "You are a helpful, friendly assistant. Answer clearly and concisely.",
    userPrompt: "What is the capital of France?",
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Code tokenizes differently — identifiers, brackets, and whitespace each become tokens.",
    systemPrompt: "You are an expert software engineer. Review code for bugs, performance, and best practices.",
    userPrompt: "Review this function:\n\nfunction add(a, b) {\n  return a + b;\n}",
  },
  {
    id: "special-characters",
    title: "Special Characters",
    description: "Punctuation, symbols, and emoji often tokenize as their own tokens — sometimes one per character.",
    systemPrompt: "You are a text analysis tool.",
    userPrompt: "Hello! How are you? 😊 Let's test: @#$%^&*() and some numbers: 12345.",
  },
  {
    id: "multilingual",
    title: "Multilingual Text",
    description: "Non-English text uses more tokens per word. Characters outside ASCII often need 2–4 tokens each.",
    systemPrompt: "You are a multilingual assistant.",
    userPrompt: "Hola mundo. 你好世界。 مرحبا بالعالم",
  },
  {
    id: "long-system-prompt",
    title: "Detailed System Prompt",
    description: "Detailed instructions add significant token cost before the user even types anything.",
    systemPrompt: "You are an AI assistant specialized in customer support for a software company. Always respond professionally and empathetically. If you don't know the answer, say so clearly and offer to escalate. Never make promises about timelines or refunds without checking the policy documentation first. Keep responses concise — under 150 words unless technical detail is required.",
    userPrompt: "I can't log into my account. I've tried resetting my password twice but it's not working.",
  },
  {
    id: "whitespace",
    title: "Whitespace & Formatting",
    description: "Spaces and newlines are often baked into adjacent tokens. Leading spaces change token IDs.",
    systemPrompt: "You are a formatting assistant.",
    userPrompt: "Word1\nWord2\n\nWord3\n\n\nWord4   with   extra   spaces",
  },
];
