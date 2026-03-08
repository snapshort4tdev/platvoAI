# 🤖 AI Models Setup Guide - OpenRouter Integration

This application uses [OpenRouter](https://openrouter.ai/) with the [Vercel AI SDK](https://ai-sdk.dev/) to provide access to 100+ AI models through a single API.

## Current Setup

### Provider: OpenRouter

- **Single API Key**: One API key for all models
- **Model Access**: 100+ models from various providers
- **Provider Package**: `@openrouter/ai-sdk-provider`
- **Required API Key**: `OPENROUTER_API_KEY`

## Supported Models

The application supports the following models (configured in `lib/ai/models.ts`):

1. **Claude Sonnet 4.6** (`anthropic/claude-sonnet-4.6`)

   - Provider: Anthropic
   - Description: Anthropic's latest Sonnet model with adaptive thinking and 1M context
   - Access: Via OpenRouter

2. **Grok 4** (`x-ai/grok-4`)

   - Provider: xAI
   - Description: xAI's powerful reasoning model with tool calling and structured outputs
   - Access: Via OpenRouter

3. **GPT-4o** (`openai/gpt-4o`)

   - Provider: OpenAI
   - Description: OpenAI's latest multimodal model for dialogue and reasoning
   - Access: Via OpenRouter

4. **Gemini 3.1 Flash Lite** (`google/gemini-3.1-flash-lite-preview`)
   - Provider: Google
   - Description: Google's fast, cost-efficient model with 1M context window
   - Access: Via OpenRouter

## Getting Your OpenRouter API Key

1. **Visit OpenRouter**: https://openrouter.ai/
2. **Sign Up/Log In**: Create an account or log in
3. **Get API Key**:
   - Go to https://openrouter.ai/keys
   - Click "Create Key"
   - Copy the API key
4. **Add to `.env.local`**:
   ```env
   OPENROUTER_API_KEY="sk-or-v1-your-api-key-here"
   ```

## Benefits of OpenRouter

- **Single API Key**: Access 100+ models with one key
- **Unified Interface**: Same API for all models
- **Cost Management**: Track usage across all providers
- **Easy Model Switching**: Change models without changing code
- **Rate Limiting**: Built-in rate limiting and quota management

## Available Models

OpenRouter provides access to models from:

- **Anthropic**: Claude Sonnet 4.6, Claude Opus 4.6
- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-5.4
- **Google**: Gemini 3.1 Flash Lite, Gemini 3.1 Pro
- **xAI**: Grok 4
- **Meta**: Llama 4 Scout, Llama 4 Maverick
- **Mistral**: Mistral Large, Mistral Small 3.2
- **Alibaba**: Qwen 3 235B, Qwen 3 Max Thinking
- **DeepSeek**: DeepSeek Chat V3.1, DeepSeek R1
- **And 100+ more models!**

View all available models: https://openrouter.ai/models

## How It Works

1. **Provider Setup**: The app uses `@openrouter/ai-sdk-provider` which integrates seamlessly with Vercel AI SDK
2. **Model Selection**: Users can select models from a dropdown in the UI
3. **API Calls**: All requests go through OpenRouter's unified API
4. **Streaming**: Full support for streaming responses
5. **Tools**: All tools (createNote, searchNote, webSearch, extractWebUrl) work with all models

## Configuration

The provider is configured in `lib/ai/providers.ts`:

```typescript
import { openrouter } from "@openrouter/ai-sdk-provider";

// Models are created using OpenRouter provider
models[model.id] = openrouter(model.id);
```

## Adding More Models

To add more models:

1. **Check Available Models**: Visit https://openrouter.ai/models
2. **Update Model List**: Add to `lib/ai/models.ts`:
   ```typescript
   {
     id: "provider/model-name",
     name: "Model Display Name",
     description: "Model description",
   }
   ```
3. **No Code Changes Needed**: The provider automatically handles new models

## Model Selection

Users can select models from the dropdown in the chat interface. The selected model ID is sent with each chat request and used for that conversation.

## Cost Management

- OpenRouter provides usage tracking in their dashboard
- You can set spending limits
- Costs vary by model (check OpenRouter pricing)
- Some models may have free tiers

## Troubleshooting

**Error: "Invalid API key"**

- Make sure `OPENROUTER_API_KEY` is set in `.env.local`
- Verify the key is correct (starts with `sk-or-v1-`)
- Restart the development server after adding the key

**Error: "Model not found"**

- Check that the model ID matches OpenRouter's exact format
- Visit https://openrouter.ai/models to verify model availability
- Some models may require specific access or pricing tiers

**Model not responding**

- Check OpenRouter status: https://openrouter.ai/status
- Verify your API key has credits/quota
- Some models may have rate limits

## Environment Variables

Required:

- `OPENROUTER_API_KEY` - Your OpenRouter API key

Optional (for other features):

- `TAVILY_API_KEY` - For web search functionality
- `STRIPE_SECRET_KEY` - For subscription features

## Reference Links

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter API Keys](https://openrouter.ai/keys)
- [Vercel AI SDK Documentation](https://ai-sdk.dev/)
- [OpenRouter AI SDK Provider](https://github.com/OpenRouterTeam/ai-sdk-provider)

## Migration from Previous Setup

If you were using Google AI SDK or Vercel AI Gateway:

- ✅ All existing tools continue to work
- ✅ Streaming format unchanged
- ✅ UI components unchanged
- ✅ Only the provider changed
- ✅ Now using single API key instead of multiple

Enjoy access to 100+ AI models! 🚀
