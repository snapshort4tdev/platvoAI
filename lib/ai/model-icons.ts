/**
 * Maps provider names to icon URLs
 * Used for displaying model icons in the UI
 */
export const providerIcons: Record<string, string> = {
  anthropic: "/anthropic-1.svg",
  openai: "/1702059841openai-icon-png.png", // Custom OpenAI logo
  google: "https://cdn.simpleicons.org/google/4285F4",
  "x-ai": "https://cdn.simpleicons.org/x/000000",
  meta: "https://cdn.simpleicons.org/meta/0081FB",
  mistralai: "https://cdn.simpleicons.org/mistralai/FF7F00",
  cohere: "https://cdn.simpleicons.org/cohere/FF6D3A",
  microsoft: "https://cdn.simpleicons.org/microsoft/00A4EF",
  deepseek: "/Deepseek-Logo-Icon-PNG-758x473.jpg", // Custom DeepSeek logo
  alibaba: "https://cdn.simpleicons.org/alibaba/FF6A00",
  qwen: "/qwen-color.png", // Custom Qwen logo
  "perplexity-ai": "/perplexity-color.png",
  perplexity: "/perplexity-color.png",
  "01-ai": "https://cdn.simpleicons.org/01ai/000000",
  moonshotai: "https://cdn.simpleicons.org/moonrepo/000000",
  together: "https://cdn.simpleicons.org/together/000000",
  "hugging-face": "https://cdn.simpleicons.org/huggingface/FFD21E",
};

/**
 * Gets the icon URL for a given provider
 * @param provider - Provider name (e.g., "anthropic", "openai")
 * @returns Icon URL or undefined if not found
 */
export function getProviderIcon(provider: string): string | undefined {
  // Try exact match first
  if (providerIcons[provider]) {
    return providerIcons[provider];
  }

  // Try case-insensitive match
  const lowerProvider = provider.toLowerCase();
  for (const [key, icon] of Object.entries(providerIcons)) {
    if (key.toLowerCase() === lowerProvider) {
      return icon;
    }
  }

  // Return undefined for unknown providers (will use default icon)
  return undefined;
}
