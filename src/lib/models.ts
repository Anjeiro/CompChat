export const AVAILABLE_MODELS = [
  { id: "openrouter/auto", name: "OpenRouter Auto" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron 3 Super"  },
  { id: "poolside/laguna-m.1:free", name: "Laguna M.1" },
  { id: "openai/gpt-oss-120b:free", name: "gpt-oss-120b" },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
  { id: "minimax/minimax-m2.5:free", name: "MiniMax M2.5" },
  { id: "tencent/hy3-preview:free", name: "Hy3 preview" },
] as const;

export type ModelId = (typeof AVAILABLE_MODELS)[number]["id"];
