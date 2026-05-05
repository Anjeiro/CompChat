export const AVAILABLE_MODELS = [
  { id: "openrouter/auto", name: "OpenRouter Auto" },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];
