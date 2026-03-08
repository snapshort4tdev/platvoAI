/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { z } from "zod";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  UIMessagePart,
  type UIMessage,
} from "ai";
import { ChatModel, chatModels } from "@/lib/ai/models";
import { zValidator } from "@hono/zod-validator";
import { getAuthUser } from "@/lib/hono/hono-middlware";
import prisma from "@/lib/prisma";
import { generateTitleForUserMessage } from "@/app/actions/action";
import { myProvider, ensureModelAvailable, getModelInstance } from "@/lib/ai/providers";
import { generateUUID } from "@/lib/utils";
import { HTTPException } from "hono/http-exception";
import { createNote } from "@/lib/ai/tools/create-note";
import { webSearch } from "@/lib/ai/tools/web-search";
import { extractWebUrl } from "@/lib/ai/tools/extract-url";
import { generateImage } from "@/lib/ai/tools/generate-image";
import { getSystemPrompt } from "@/lib/ai/prompt";
import { checkCreditLimit, deductCredit } from "@/lib/credits/credit-manager";


const chatSchema = z.object({
  id: z.string().min(1),
  message: z.custom<UIMessage>(),
  selectedModelId: z.string() as z.ZodType<ChatModel["id"]>,
  selectedToolName: z.string().nullable(),
  searchMode: z.enum(["normal", "none"]).optional().default("none"),
});
const chatIdSchema = z.object({
  id: z.string().min(1),
});

export const chatRoute = new Hono()
  .post("/", zValidator("json", chatSchema), getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const { id, message, selectedToolName, searchMode = "none" } =
        c.req.valid("json");
      let { selectedModelId } = c.req.valid("json");

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:47',message:'Chat request received',data:{selectedModelId,searchMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Check credit limit before processing
      const creditCheck = await checkCreditLimit(user.id);
      if (!creditCheck.hasCredits) {
        throw new HTTPException(402, {
          message: `You have run out of credits. You've used ${creditCheck.creditsUsed} of ${creditCheck.creditsLimit} credits this month. Please upgrade your subscription or wait for the monthly reset.`,
        });
      }

      let chat = await prisma.chat.findUnique({
        where: { id },
      });
      if (!chat) {
        const title = await generateTitleForUserMessage({
          message,
        });
        chat = await prisma.chat.create({
          data: {
            id,
            userId: user.id,
            title: title,
          },
        });
      }

      const messagesFromDB = await prisma.message.findMany({
        where: { chatId: id },
        orderBy: { createdAt: "desc" },
      });

      const mapUIMessages: UIMessage[] = messagesFromDB.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        parts: m.parts as UIMessagePart<any, any>[],
        metadata: {
          createdAt: m.createdAt,
        },
      }));

      const newUIMessages = [...mapUIMessages, message];

      // Sanitize tool call IDs to ensure they're within OpenAI's 40-character limit
      // OpenAI has a strict 40-character limit for tool call IDs
      const sanitizeToolCallId = (id: string | undefined): string | undefined => {
        if (!id) return id;
        if (id.length > 40) {
          // Truncate to 40 characters, preserving the start which is usually more unique
          return id.substring(0, 40);
        }
        return id;
      };

      const sanitizedMessages = newUIMessages.map((msg) => {
        if (!msg.parts) return msg;
        const sanitizedParts = msg.parts.map((part: any) => {
          // Sanitize toolCallId if present
          if (part.toolCallId) {
            return {
              ...part,
              toolCallId: sanitizeToolCallId(part.toolCallId),
            };
          }
          return part;
        });
        return { ...msg, parts: sanitizedParts };
      });

      const modelMessages = convertToModelMessages(sanitizedMessages);
      
      // Also sanitize tool call IDs in the converted model messages
      // Some models (like OpenAI) require tool call IDs to be <= 40 characters
      const finalModelMessages = modelMessages.map((msg: any) => {
        if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
          return {
            ...msg,
            tool_calls: msg.tool_calls.map((tc: any) => ({
              ...tc,
              id: sanitizeToolCallId(tc.id),
            })),
          };
        }
        return msg;
      });

      
      // #region agent log
      const foundModel = chatModels.find(m => m.id === selectedModelId);
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:221',message:'Model lookup',data:{selectedModelId,foundModelId:foundModel?.id,foundModelName:foundModel?.name,allModelIds:chatModels.map(m=>m.id).slice(0,5)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      // Validate that the selected model exists in available models
      if (!foundModel) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:225',message:'Invalid model ID - not found',data:{selectedModelId,availableModelIds:chatModels.map(m=>m.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        
        // Try to find a similar model (e.g., if user selected audio variant, find the standard one)
        const similarModel = chatModels.find(m => {
          const selectedLower = selectedModelId.toLowerCase();
          const modelLower = m.id.toLowerCase();
          // For GPT models, try to find the standard version
          if (selectedLower.includes("gpt-4o") && !selectedLower.includes("mini")) {
            return modelLower.includes("gpt-4o") && 
                   !modelLower.includes("mini") &&
                   !modelLower.includes("audio") &&
                   !modelLower.includes("preview");
          }
          if (selectedLower.includes("gpt-4o-mini")) {
            return modelLower.includes("gpt-4o-mini") &&
                   !modelLower.includes("audio") &&
                   !modelLower.includes("preview");
          }
          return false;
        });

        if (similarModel) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:245',message:'Found similar model, using it',data:{originalModelId:selectedModelId,similarModelId:similarModel.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
          // #endregion
          // Use the similar model instead
          selectedModelId = similarModel.id;
        } else {
          throw new HTTPException(400, { 
            message: `Model "${selectedModelId}" is not available. Please select a different model.` 
          });
        }
      }

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:240',message:'Getting model provider',data:{selectedModelId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      // Ensure model is available in provider before accessing
      ensureModelAvailable(selectedModelId);
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:244',message:'After ensureModelAvailable',data:{selectedModelId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      let modelProvider;
      try {
        modelProvider = myProvider.languageModel(selectedModelId);
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:250',message:'Model provider retrieved via myProvider',data:{selectedModelId,modelProviderType:typeof modelProvider,hasModelProvider:!!modelProvider},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:255',message:'Model provider retrieval failed, trying getModelInstance',data:{selectedModelId,error:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Fallback: use getModelInstance directly if provider lookup fails
        // This handles cases where customProvider doesn't expose the model correctly
        try {
          modelProvider = getModelInstance(selectedModelId);
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:262',message:'Model provider retrieved via getModelInstance fallback',data:{selectedModelId,modelProviderType:typeof modelProvider,hasModelProvider:!!modelProvider},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        } catch (fallbackError) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:267',message:'Both provider and getModelInstance failed',data:{selectedModelId,originalError:error instanceof Error?error.message:String(error),fallbackError:fallbackError instanceof Error?fallbackError.message:String(fallbackError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          throw error; // Throw original error
        }
      }
      
      // Get the model name for the system prompt
      const modelName = foundModel?.name || selectedModelId;

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:228',message:'Model provider created',data:{selectedModelId,modelName,providerType:typeof modelProvider},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // Save message to database
      await prisma.message.create({
        data: {
          id: message.id,
          chatId: id,
          role: "user",
          parts: JSON.parse(JSON.stringify(message.parts)),
        },
      });

      // Extract text content from user's current message to detect explicit web search requests
      const currentUserMessageText = message.parts
        ?.filter((p) => p.type === "text")
        .map((p) => (p as { text: string }).text)
        .join(" ")
        .toLowerCase()
        .trim() || "";

      // Also check recent conversation history for web search requests
      const recentUserMessages = mapUIMessages
        .filter((m) => m.role === "user")
        .slice(0, 3) // Check last 3 user messages
        .map((m) =>
          m.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { text: string }).text)
            .join(" ")
            .toLowerCase()
            .trim() || ""
        )
        .join(" ");

      // Combine current message and recent history
      const allUserText = `${currentUserMessageText} ${recentUserMessages}`.toLowerCase();

      // Check if user explicitly requested web search (with common variations and typos)
      const webSearchPhrases = [
        "search the internet",
        "search the web",
        "search internet",
        "search web",
        "look online",
        "find on the internet",
        "search online",
        "web search",
        "search the net",
        "search internet for",
        "search the web for",
        "look up on the internet",
        "search online for",
        "search inrternet", // common typo
        "search the inrternet", // common typo
        "search on internet",
        "internet search",
        "search for",
        "look it up",
        "find it online",
        "check online",
        "search it",
        "no search the internet", // user insisting on search
        "please search",
        "can you search",
        "will you search",
      ];
      
      // Check for exact phrase matches
      const hasExactPhrase = webSearchPhrases.some(phrase => 
        allUserText.includes(phrase)
      );
      
      // Also check for pattern: "search" + ("internet" or "web" or "online" or "net")
      // This catches variations like "search the internet", "search internet", etc.
      const hasSearchPattern = /\bsearch\b.*\b(internet|web|online|net|inrternet)\b/i.test(allUserText) ||
                               /\b(internet|web|online|net|inrternet)\b.*\bsearch\b/i.test(allUserText);
      
      const explicitlyRequestedWebSearch = hasExactPhrase || hasSearchPattern;

      // Check if model supports tools
      // Some models (like certain DeepSeek R1 variants from TNG Tech, Perplexity) don't support tool use
      // These models will work without tools but won't be able to use web search, deep search, etc.
      const modelIdLower = selectedModelId.toLowerCase();
      const modelsWithoutTools = [
        "tngtech/deepseek-r1t2-chimera", // TNG Tech DeepSeek R1T2 Chimera variants don't support tools
        "deepseek-r1t2-chimera", // Alternative pattern to catch any R1T2 Chimera variants
        "perplexity", // Perplexity models don't support tool use
      ];
      const supportsTools = !modelsWithoutTools.some(pattern => modelIdLower.includes(pattern));

      // Build tools object - include webSearch if:
      // 1. User manually selected it, OR
      // 2. User explicitly requested web search in their message
      // Only add tools if the model supports them
      const tools: Record<string, any> = {};
      
      if (supportsTools) {
        tools.createNote = createNote(user.id);
        tools.extractWebUrl = extractWebUrl();
        tools.generateImage = generateImage(user.id);
      }

      // Check if user manually selected web search (handle both "webSearch" and "Web Search" formats)
      const isWebSearchSelected = selectedToolName === "webSearch" || 
                                   selectedToolName === "Web Search" ||
                                   selectedToolName?.toLowerCase() === "web search";

      // Check if user manually selected image generation (currently unused but kept for future use)
      // const isImageGenerationSelected = selectedToolName === "generateImage" || 
      //                                   selectedToolName === "Generate Image" ||
      //                                   selectedToolName?.toLowerCase() === "generate image";

      // Add search tools based on search mode or explicit selection (only if model supports tools)
      if (supportsTools) {
        if (searchMode === "normal" || isWebSearchSelected || explicitlyRequestedWebSearch) {
          tools.webSearch = webSearch(10);
        }
      }

      // Build streamText options - tools are conditionally added based on model support
      const streamOptions: any = {
        model: modelProvider,
        system: getSystemPrompt(selectedToolName, modelName, {
          searchMode: supportsTools ? searchMode : "none", // Disable search mode for models without tools
        }),
        messages: finalModelMessages,
        stopWhen: stepCountIs(5),
        onError: (error: unknown) => {
          console.log("Streaming error", error);
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:337',message:'Streaming error in onError',data:{selectedModelId,errorMessage:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'Unknown',isVersionError:error instanceof Error?error.message.includes('v1')||error.message.includes('v2')||error.message.includes('Unsupported model version'):false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
        },
      };

      // Add tools if model supports them and we have any to add
      if (supportsTools && Object.keys(tools).length > 0) {
        streamOptions.tools = tools;
        streamOptions.toolChoice = "auto";
      }

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:357',message:'Before streamText call',data:{selectedModelId,modelName,toolsCount:Object.keys(tools).length,hasTools:!!streamOptions.tools,streamOptionsKeys:Object.keys(streamOptions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:320',message:'About to call streamText',data:{selectedModelId,hasModel:!!streamOptions.model,modelProviderType:typeof streamOptions.model,streamOptionsKeys:Object.keys(streamOptions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      let result;
      try {
        result = streamText(streamOptions);
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:325',message:'streamText called successfully',data:{selectedModelId,resultType:typeof result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:362',message:'streamText call failed',data:{selectedModelId,error:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'Unknown',errorStack:error instanceof Error?error.stack?.substring(0,300):undefined,isVersionError:error instanceof Error?error.message.includes('v1')||error.message.includes('v2')||error.message.includes('Unsupported model version'):false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        // If it's a version error with GPT-5.1, fallback to OpenRouter
        if (error instanceof Error && selectedModelId === "openai/gpt-5.1" && (error.message.includes('v1') || error.message.includes('v2') || error.message.includes('Unsupported model version'))) {
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:367',message:'Falling back to OpenRouter for GPT-5.1',data:{selectedModelId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          // Try using OpenRouter instead - force OpenRouter by clearing cache and using OpenRouter directly
          const { openrouter } = await import("@openrouter/ai-sdk-provider");
          const openrouterModel = openrouter("openai/gpt-5.1");
          streamOptions.model = openrouterModel;
          // #region agent log
          fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:373',message:'Retrying with OpenRouter model',data:{selectedModelId,hasModel:!!openrouterModel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          // Retry with OpenRouter
          result = streamText(streamOptions);
        } else {
          // If it's a version error, provide helpful message
          if (error instanceof Error && (error.message.includes('v1') || error.message.includes('v2') || error.message.includes('Unsupported model version'))) {
            throw new Error(`Model version incompatibility: ${error.message}. GPT-5.1 may not be available yet or requires a different model name. Please check OpenAI's model list or use OpenRouter instead.`);
          }
          throw error;
        }
      }

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:365',message:'After streamText call',data:{selectedModelId,resultType:typeof result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion

      // Deduct credit after successful streamText call
      // Note: We deduct here because the stream has started successfully
      // If the stream fails later, the credit is still deducted (as per plan: 1 credit per request)
      await deductCredit(user.id, 1).catch((error) => {
        console.error("Failed to deduct credit:", error);
        // Don't fail the request if credit deduction fails
      });

      return result.toUIMessageStreamResponse({
        sendSources: true,
        generateMessageId: () => generateUUID(),
        //originalMessages: newUIMessages,
        onFinish: async ({ messages, responseMessage }) => {
          console.log("complete message", responseMessage);
          try {
            await prisma.message.createMany({
              data: messages.map((m) => ({
                id: m.id || generateUUID(),
                chatId: id,
                role: m.role,
                parts: JSON.parse(JSON.stringify(m.parts)),
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
              skipDuplicates: true,
            });
          } catch (error) {
            console.log("error", error);
          }
        },
      });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/63d22a0a-43cd-47a2-8361-a25e1315cce6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chat.ts:375',message:'Error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'Unknown',errorStack:error instanceof Error?error.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion

      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .get("/", getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const chats = await prisma.chat.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      return c.json({
        success: true,
        data: chats,
      });
    } catch (error) {
      console.log(error, "Failed to fetch chats");
      throw new HTTPException(500, { message: "Internal Server error" });
    }
  })
  .get("/:id", zValidator("param", chatIdSchema), getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const { id } = c.req.valid("param");

      const chat = await prisma.chat.findFirst({
        where: { id, userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!chat) {
        return c.json({ success: true, data: {} });
      }

      const uiMessages: UIMessage[] = chat.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        parts: m.parts as UIMessagePart<any, any>[],
        metadata: { createdAt: m.createdAt },
      }));

      const chatWithMsg = {
        ...chat,
        messages: uiMessages,
      };

      return c.json({
        success: true,
        data: chatWithMsg,
      });
    } catch (error) {
      console.log(error, "Failed to fetch chat");
      throw new HTTPException(500, { message: "Internal Server error" });
    }
  });
