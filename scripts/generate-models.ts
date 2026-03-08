import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fetchOpenRouterModels } from "../lib/ai/fetch-models";

const OUTPUT_DIR = join(process.cwd(), "lib", "ai");
const OUTPUT_FILE = join(OUTPUT_DIR, "models.generated.ts");

async function generateModels() {
  console.log("🔄 Fetching models from OpenRouter...");

  try {
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

    console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`   - Total models: ${models.length}`);
    console.log(`   - Generated at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Error generating models:", error);
    process.exit(1);
  }
}

// Run if called directly
if (typeof require !== "undefined" && require.main === module) {
  generateModels().catch((error) => {
    console.error("Failed to generate models:", error);
    process.exit(1);
  });
}

export default generateModels;
