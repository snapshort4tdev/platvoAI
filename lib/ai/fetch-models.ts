import { ChatModel } from "./models";
import { getProviderIcon } from "./model-icons";

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  architecture?: {
    modality: string;
    tokenizer: string;
    instruct_type?: string | null;
  };
  top_provider?: {
    max_completion_tokens?: number | null;
    is_moderated?: boolean;
  };
  per_request_limits?: {
    prompt_tokens?: string;
    completion_tokens?: string;
  };
}

interface OpenRouterResponse {
  data: OpenRouterModel[];
}

/**
 * Fetches all available models from OpenRouter API
 * @returns Array of ChatModel objects formatted for the application
 */
export async function fetchOpenRouterModels(): Promise<ChatModel[]> {
  try {
    const httpReferer =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.BETTER_AUTH_URL ||
      "https://www.platvo.com";

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": httpReferer,
        "X-Title": "Platvo AI",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    // Define the specific models to include (matching the UI images)
    // Map of model identifier patterns to display names
    // ORDER: ChatGPT first, then Gemini, then Claude, then the rest
    const allowedModels: Array<{ pattern: string; displayName: string; provider: string }> = [
      // --- ChatGPT (top) ---
      { pattern: "gpt-4o", displayName: "GPT-4o", provider: "openai" },
      { pattern: "gpt-4o-mini", displayName: "GPT-4o Mini", provider: "openai" },
      // --- Gemini (right under ChatGPT) ---
      { pattern: "gemini-3.1-pro-preview", displayName: "Gemini 3.1 Pro", provider: "google" },
      { pattern: "gemini-3.1-flash-lite", displayName: "Gemini 3.1 Flash Lite", provider: "google" },
      { pattern: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro", provider: "google" },
      { pattern: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash", provider: "google" },
      // --- Claude ---
      { pattern: "claude-sonnet-4.6", displayName: "Claude Sonnet 4.6", provider: "anthropic" },
      // --- DeepSeek ---
      { pattern: "deepseek-chat", displayName: "DeepSeek Chat", provider: "deepseek" },
      { pattern: "deepseek-r1", displayName: "DeepSeek R1", provider: "deepseek" },
      // --- Grok ---
      { pattern: "grok-4", displayName: "Grok 4", provider: "x-ai" },
      // --- Llama ---
      { pattern: "llama-4-scout", displayName: "Llama 4 Scout", provider: "meta" },
      { pattern: "llama-4-maverick", displayName: "Llama 4 Maverick", provider: "meta" },
      // --- Mistral ---
      { pattern: "mistral-large", displayName: "Mistral Large", provider: "mistralai" },
      { pattern: "mistral-small-3.2", displayName: "Mistral Small 3.2", provider: "mistralai" },
      // --- Qwen ---
      { pattern: "qwen3-235b", displayName: "Qwen 3 235B", provider: "qwen" },
      { pattern: "qwen3-max-thinking", displayName: "Qwen 3 Max Thinking", provider: "qwen" },
      // --- Kimi ---
      { pattern: "kimi-k2.5", displayName: "Kimi K2.5", provider: "moonshotai" },
      // --- Perplexity ---
      { pattern: "sonar-pro-search", displayName: "Perplexity Sonar Pro Search", provider: "perplexity" },
    ];

    // Filter and map models
    const models: ChatModel[] = [];

    // Patterns to exclude (audio, specialized variants, etc.)
    // Note: "preview" is NOT excluded because Gemini models use preview suffix
    const excludePatterns = [
      "audio",
      "beta",
      "experimental",
      "vision-preview",
      "o1",
      "o3",
    ];

    for (const allowedModel of allowedModels) {
      // Find matching model from OpenRouter
      const matchedModel = data.data.find((model) => {
        const modelIdLower = model.id.toLowerCase();
        const patternLower = allowedModel.pattern.toLowerCase();

        // Skip models with excluded patterns
        if (excludePatterns.some(exclude => modelIdLower.includes(exclude))) {
          return false;
        }

        // More precise matching for specific models
        if (patternLower === "gpt-4o") {
          // Match gpt-4o but NOT audio/preview/mini variants
          return (modelIdLower === "openai/gpt-4o" ||
            (modelIdLower.includes("gpt-4o") &&
              !modelIdLower.includes("gpt-4o-audio") &&
              !modelIdLower.includes("gpt-4o-preview") &&
              !modelIdLower.includes("gpt-4o-mini") &&
              /\d{4}-\d{2}-\d{2}/.test(modelIdLower)));
        }

        if (patternLower === "gpt-4o-mini") {
          // Match gpt-4o-mini but NOT audio variants
          return (modelIdLower === "openai/gpt-4o-mini" ||
            (modelIdLower.includes("gpt-4o-mini") &&
              !modelIdLower.includes("gpt-4o-mini-audio") &&
              /\d{4}-\d{2}-\d{2}/.test(modelIdLower)));
        }

        if (patternLower === "gemini-3.1-pro-preview") {
          return modelIdLower === "google/gemini-3.1-pro-preview";
        }

        if (patternLower === "gemini-3.1-flash-lite") {
          return modelIdLower === "google/gemini-3.1-flash-lite-preview" ||
            modelIdLower.includes("gemini-3.1-flash-lite");
        }

        if (patternLower === "gemini-2.5-pro") {
          // Match gemini-2.5-pro exactly, not gemini-2.5-pro-exp or preview
          return modelIdLower === "google/gemini-2.5-pro" ||
            (modelIdLower.includes("gemini-2.5-pro") &&
              !modelIdLower.includes("exp") &&
              !modelIdLower.includes("preview"));
        }

        if (patternLower === "gemini-2.5-flash") {
          // Match gemini-2.5-flash exactly, not lite/exp variants
          return modelIdLower === "google/gemini-2.5-flash" ||
            (modelIdLower.includes("gemini-2.5-flash") &&
              !modelIdLower.includes("lite") &&
              !modelIdLower.includes("exp") &&
              !modelIdLower.includes("preview"));
        }

        if (patternLower === "grok-4") {
          // Match x-ai/grok-4 exactly (not grok-4.1, grok-4.2 etc.)
          return (modelIdLower === "x-ai/grok-4" ||
            modelIdLower.startsWith("x-ai/grok-4-"));
        }

        if (patternLower === "sonar-pro-search") {
          // Match perplexity/sonar-pro-search exactly
          return modelIdLower === "perplexity/sonar-pro-search" ||
            modelIdLower.includes("perplexity/sonar-pro-search");
        }

        // For other models, check if model ID contains the pattern
        return modelIdLower.includes(patternLower) ||
          modelIdLower.endsWith(`/${patternLower}`) ||
          modelIdLower.includes(`/${patternLower}-`);
      });

      if (matchedModel) {
        const provider = matchedModel.id.split("/")[0] || allowedModel.provider;
        // Use the provider from allowedModels to ensure consistent icon mapping
        // This ensures DeepSeek R1 and DeepSeek Chat both use the same DeepSeek logo
        const iconUrl = getProviderIcon(allowedModel.provider) || getProviderIcon(provider);

        // #region agent log
        if (allowedModel.pattern.includes("gpt-4o")) {
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'fetch-models.ts:91', message: 'GPT model matched', data: { pattern: allowedModel.pattern, matchedModelId: matchedModel.id, matchedModelName: matchedModel.name }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'G' }) }).catch(() => { });
        }
        // #endregion

        models.push({
          id: matchedModel.id,
          name: allowedModel.displayName,
          description: matchedModel.description || `AI model from ${allowedModel.provider}`,
          iconUrl,
        });
      } else {
        // #region agent log
        if (allowedModel.pattern.includes("gpt-4o")) {
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'fetch-models.ts:105', message: 'GPT model NOT matched', data: { pattern: allowedModel.pattern, availableModels: data.data.filter(m => m.id.toLowerCase().includes('gpt-4o')).map(m => m.id).slice(0, 10) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H' }) }).catch(() => { });
        }
        // #endregion
      }
    }

    // Sort models in the order defined in allowedModels
    const sortOrder = allowedModels.map(m => m.pattern.toLowerCase());
    models.sort((a, b) => {
      const aIndex = sortOrder.findIndex(pattern =>
        a.id.toLowerCase().includes(pattern)
      );
      const bIndex = sortOrder.findIndex(pattern =>
        b.id.toLowerCase().includes(pattern)
      );
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return models;
  } catch (error) {
    console.error("Error fetching models from OpenRouter:", error);
    throw error;
  }
}
