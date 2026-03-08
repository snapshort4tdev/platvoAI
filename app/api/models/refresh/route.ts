import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fetchOpenRouterModels } from "@/lib/ai/fetch-models";

const OUTPUT_DIR = join(process.cwd(), "lib", "ai");
const OUTPUT_FILE = join(OUTPUT_DIR, "models.generated.ts");

// Cache to prevent excessive API calls (5 minutes)
let lastRefreshTime: number = 0;
const REFRESH_COOLDOWN = 5 * 60 * 1000; // 5 minutes

export async function POST(_request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check cooldown to prevent excessive API calls
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      const remainingSeconds = Math.ceil((REFRESH_COOLDOWN - (now - lastRefreshTime)) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${remainingSeconds} seconds before refreshing again`,
        },
        { status: 429 }
      );
    }

    console.log("🔄 Refreshing models from OpenRouter...");

    // Fetch models from OpenRouter
    const models = await fetchOpenRouterModels();

    console.log(`✅ Fetched ${models.length} models from OpenRouter`);

    // Generate TypeScript file content
    const fileContent = `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}
// Total models: ${models.length}

import { ChatModel } from "./models";

export const generatedModels: ChatModel[] = ${JSON.stringify(models, null, 2)};

export const lastGeneratedAt = "${new Date().toISOString()}";
`;

    // Ensure directory exists
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Write file
    writeFileSync(OUTPUT_FILE, fileContent, "utf-8");

    // Update last refresh time
    lastRefreshTime = now;

    console.log(`✅ Successfully refreshed models: ${OUTPUT_FILE}`);

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${models.length} models`,
      count: models.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error refreshing models:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to refresh models from OpenRouter",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check last refresh time
export async function GET() {
  try {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to read the generated file to get last generated time
    try {
      // Use dynamic import instead of require
      const modelsModule = await import("@/lib/ai/models.generated");
      const lastGeneratedAt = modelsModule.lastGeneratedAt;
      return NextResponse.json({
        success: true,
        lastGeneratedAt: lastGeneratedAt || null,
        canRefresh: Date.now() - lastRefreshTime >= REFRESH_COOLDOWN,
      });
    } catch {
      return NextResponse.json({
        success: true,
        lastGeneratedAt: null,
        canRefresh: true,
        message: "Models file not found. Run generate-models script or refresh via POST.",
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to check model status",
      },
      { status: 500 }
    );
  }
}
