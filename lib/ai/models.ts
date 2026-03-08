export interface ChatModel {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

// Fallback models if generated models fail to load
const fallbackModels: ChatModel[] = [
  {
    id: "anthropic/claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    description: "Anthropic's latest Sonnet model with adaptive thinking and improved reasoning",
    iconUrl: "/anthropic-1.svg",
  },
  {
    id: "x-ai/grok-4",
    name: "Grok 4",
    description:
      "xAI's powerful reasoning model with tool calling and structured outputs",
    iconUrl: "https://cdn.simpleicons.org/x/000000",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's latest multimodal model for dialogue and reasoning",
    iconUrl: "/1702059841openai-icon-png.png",
  },
  {
    id: "google/gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite",
    description: "Google's fast, cost-efficient model with 1M context window",
    iconUrl: "https://cdn.simpleicons.org/google/4285F4",
  },
  {
    id: "perplexity/sonar-pro-search",
    name: "Perplexity Sonar Pro Search",
    description: "Perplexity's advanced search model with real-time web search capabilities",
    iconUrl: "/perplexity-color.png",
  },
  {
    id: "openai/gpt-5.4",
    name: "GPT-5.4",
    description: "OpenAI's latest GPT-5.4 model with advanced reasoning and computer use",
    iconUrl: "/1702059841openai-icon-png.png",
  },
];

// Try to import generated models, fallback to default if not available
let generatedModels: ChatModel[] | null = null;
try {
  // Dynamic import to handle case where file doesn't exist yet
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const generated = require("./models.generated");
  if (generated?.generatedModels && Array.isArray(generated.generatedModels)) {
    generatedModels = generated.generatedModels;
  }
} catch (_error) {
  // File doesn't exist or has errors - use fallback
  // This is expected on first run before generate-models is executed
  if (process.env.NODE_ENV === "development") {
    console.warn("Could not load generated models, using fallback. Run 'npm run generate-models' to fetch all models.");
  }
}

/**
 * Get the list of available chat models
 * Uses generated models if available, otherwise falls back to default models
 * Always includes GPT-5.4 (not available through OpenRouter, uses OpenAI API directly)
 */
export function getChatModels(): ChatModel[] {
  const baseModels = generatedModels || fallbackModels;

  // Always include GPT-5.4 in the list
  // GPT-5.4 is not available through OpenRouter, so we add it manually
  // The provider will handle whether it can actually be used (checks for OPENAI_API_KEY)
  const gpt54Model: ChatModel = {
    id: "openai/gpt-5.4",
    name: "GPT-5.4",
    description: "OpenAI's latest GPT-5.4 model with advanced reasoning and computer use",
    iconUrl: "/1702059841openai-icon-png.png",
  };

  // Check if GPT-5.4 is already in the list
  const hasGpt54 = baseModels.some(m => m.id === "openai/gpt-5.4");

  // Add GPT-5.4 if it's not already in the list
  if (!hasGpt54) {
    return [...baseModels, gpt54Model];
  }

  return baseModels;
}

// Export the models array for backward compatibility
export const chatModels: ChatModel[] = getChatModels();

// Get default model ID (prefer Claude Sonnet 4.6 if available, otherwise first model)
export const DEFAULT_MODEL_ID =
  chatModels.find(m => m.id.includes("claude-sonnet-4.6"))?.id ||
  chatModels[0]?.id ||
  "anthropic/claude-sonnet-4.6";

export const DEVELOPMENT_CHAT_MODEL = DEFAULT_MODEL_ID; // Use default for title generation

export const MODEL_OPTIONS = chatModels.map((m) => ({
  value: m.id,
  label: m.name,
}));
