/* eslint-disable @typescript-eslint/no-explicit-any */
import { customProvider } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { getChatModels, DEVELOPMENT_CHAT_MODEL } from "./models";

// #region agent log
let openai: any = null;
let openaiImportSuccess = false;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const openaiModule = require("@ai-sdk/openai");
  openai = openaiModule.openai;
  openaiImportSuccess = true;
  fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:8', message: 'OpenAI import success', data: { hasOpenai: !!openai }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
} catch (error) {
  fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:13', message: 'OpenAI import failed', data: { error: error instanceof Error ? error.message : String(error), errorName: error instanceof Error ? error.name : 'Unknown', errorStack: error instanceof Error ? error.stack?.substring(0, 200) : undefined }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
}
// #endregion

// Cache for model instances to avoid recreating them
const modelCache: Record<string, any> = {};

// Check if OpenAI API key is available
const hasOpenAIApiKey = !!process.env.OPENAI_API_KEY;
// #region agent log
fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:20', message: 'OpenAI API key check', data: { hasOpenAIApiKey, apiKeyLength: process.env.OPENAI_API_KEY?.length || 0, apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
// #endregion

const createLanguageModels = () => {
  const models: Record<string, any> = {};

  // Get all available models (from generated file or fallback)
  const chatModels = getChatModels();

  // Create models using appropriate provider
  // GPT-5.4 uses OpenAI directly, all others use OpenRouter
  chatModels.forEach((model) => {
    // Use cached instance if available, otherwise create new one
    if (!modelCache[model.id]) {
      // Check if this is GPT-5.4 which should use OpenAI directly
      if (model.id === "openai/gpt-5.4" && hasOpenAIApiKey) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:30', message: 'Creating GPT-5.4 model', data: { modelId: model.id, hasOpenAIApiKey, openaiImportSuccess, hasOpenai: !!openai }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
        // #endregion
        if (!openai) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:33', message: 'OpenAI provider not available', data: { modelId: model.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
          // #endregion
          throw new Error("@ai-sdk/openai package not installed. Run: npm install @ai-sdk/openai --legacy-peer-deps");
        }
        try {
          // Use OpenAI provider directly for GPT-5.4
          // The model name in OpenAI API is "gpt-5.4" (without the "openai/" prefix)
          modelCache[model.id] = openai("gpt-5.4", {
            apiKey: process.env.OPENAI_API_KEY,
          });
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:55', message: 'GPT-5.4 model created', data: { modelId: model.id, modelType: typeof modelCache[model.id] }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
          // #endregion
        } catch (error) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:60', message: 'GPT-5.4 model creation failed', data: { modelId: model.id, error: error instanceof Error ? error.message : String(error), errorName: error instanceof Error ? error.name : 'Unknown', errorStack: error instanceof Error ? error.stack?.substring(0, 200) : undefined }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
          // #endregion
          throw error;
        }
      } else {
        // Use OpenRouter for all other models
        modelCache[model.id] = openrouter(model.id);
      }
    }
    models[model.id] = modelCache[model.id];
  });

  // Development model (fallback)
  if (!modelCache[DEVELOPMENT_CHAT_MODEL]) {
    modelCache[DEVELOPMENT_CHAT_MODEL] = openrouter(DEVELOPMENT_CHAT_MODEL);
  }
  models[DEVELOPMENT_CHAT_MODEL] = modelCache[DEVELOPMENT_CHAT_MODEL];

  // Title generation model
  if (!modelCache["title-model"]) {
    modelCache["title-model"] = openrouter(DEVELOPMENT_CHAT_MODEL);
  }
  models["title-model"] = modelCache["title-model"];

  return models;
};

/**
 * Get or create a model instance dynamically
 * This allows creating models on-demand for any model ID
 * GPT-5.4 uses OpenAI directly, all others use OpenRouter
 */
export function getModelInstance(modelId: string) {
  if (!modelCache[modelId]) {
    // Check if this is GPT-5.4 which should use OpenAI directly
    if (modelId === "openai/gpt-5.4" && hasOpenAIApiKey) {
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:65', message: 'getModelInstance: Creating GPT-5.4', data: { modelId, hasOpenAIApiKey, hasOpenai: !!openai }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
      // #endregion
      if (!openai) {
        throw new Error("@ai-sdk/openai package not installed. Run: npm install @ai-sdk/openai --legacy-peer-deps");
      }
      modelCache[modelId] = openai("gpt-5.4", {
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      modelCache[modelId] = openrouter(modelId);
    }
  }
  return modelCache[modelId];
}

// Create initial language models
const initialLanguageModels = createLanguageModels();

// #region agent log
fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:115', message: 'Initial language models created', data: { modelCount: Object.keys(initialLanguageModels).length, hasGpt54: !!initialLanguageModels['openai/gpt-5.4'], allModelIds: Object.keys(initialLanguageModels).slice(0, 10) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
// #endregion

// Create provider with initial models
// Note: OpenRouter provider can handle any model ID dynamically,
// so models not in the initial list will still work
export const myProvider = customProvider({
  languageModels: initialLanguageModels,
});

/**
 * Ensure a model is available in the provider
 * This is called when a model ID might not be in the initial list
 */
export function ensureModelAvailable(modelId: string) {
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:128', message: 'ensureModelAvailable called', data: { modelId, hasInInitial: !!initialLanguageModels[modelId], initialKeys: Object.keys(initialLanguageModels).slice(0, 5) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
  // #endregion
  if (!initialLanguageModels[modelId]) {
    // Add the model to the provider's language models
    const modelInstance = getModelInstance(modelId);
    initialLanguageModels[modelId] = modelInstance;
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'providers.ts:135', message: 'Model added to initialLanguageModels', data: { modelId, hasModel: !!initialLanguageModels[modelId] }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
    // #endregion
  }
}

// Vision models supported through OpenRouter:
// - anthropic/claude-sonnet-4.6 (supports vision)
// - openai/gpt-4o (supports vision)
// - google/gemini-3.1-flash-lite-preview (supports vision)
// OpenRouter automatically handles vision when file parts are included in messages

// Keep isProduction export for backward compatibility (not used for routing anymore)
export const isProduction = process.env.NODE_ENV === "production";
