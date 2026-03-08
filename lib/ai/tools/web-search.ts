/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool } from "ai";
import { z } from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearch = (maxResults: number = 10) =>
  tool({
    description:
      "Search the web for current information. Use this when user requests web search or manually selects this tool. Do NOT use this tool automatically - answer from your pre-trained knowledge by default.",
    inputSchema: z.object({
      query: z.string().describe("Search web query"),
    }),
    execute: async ({ query }) => {
      try {
        const response = await tvly.search(query, {
          includeAnswer: true,
          includeFavicon: true,
          includeImages: false,
          maxResults: maxResults,
        });

        const results = (response.results || []).map((r: any) => ({
          title: r.title,
          url: r.url,
          content: r.content,
          favicon: r.favicon || null,
        }));

        return {
          success: true,
          answer: response.answer || "No summary available",
          results: results,
          totalSources: results.length,
          searchType: "normal",
          response_time: response.responseTime,
        };
      } catch (error) {
        return {
          success: false,
          message: "Web search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
