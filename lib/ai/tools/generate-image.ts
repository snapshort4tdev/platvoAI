import { tool } from "ai";
import { z } from "zod";
import Replicate from "replicate";
import { uploadFile } from "@/lib/storage/imagekit";
import prisma from "@/lib/prisma";
import { checkImageLimit, deductImage } from "@/lib/credits/image-manager";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate an image using Replicate's bytedance/seedream-4 model
 * Downloads the image and uploads it to ImageKit for permanent storage
 * Saves the image metadata to the database for the gallery
 */
export const generateImage = (userId: string) =>
  tool({
    description:
      "Generate ONE image based on a text prompt. Use this tool ONLY ONCE per user request. Use this when the user asks to generate, create, or make an image, or when they manually select image generation. The user's message will be used as the prompt. IMPORTANT: Call this tool only once - do not generate multiple images.",
    inputSchema: z.object({
      prompt: z.string().describe("The text prompt describing the image to generate"),
      aspect_ratio: z
        .enum(["1:1", "4:3", "3:4", "16:9", "9:16"])
        .optional()
        .default("4:3")
        .describe("Aspect ratio of the generated image"),
    }),
    execute: async ({ prompt, aspect_ratio = "4:3" }) => {
      try {
        // Check image allowance before generating
        const imageCheck = await checkImageLimit(userId);
        if (!imageCheck.hasImages) {
          return {
            success: false,
            message: `You have run out of image generations. You've used ${imageCheck.imagesUsed} of ${imageCheck.imagesLimit} images this month. Please wait for the monthly reset or upgrade your subscription.`,
            error: "Image limit exceeded",
          };
        }

        // Call Replicate API to generate image
        const output = await replicate.run("bytedance/seedream-4", {
          input: {
            prompt: prompt,
            aspect_ratio: aspect_ratio,
          },
        });

        // Replicate returns an array of file objects or URLs
        // Each file object may have a url() method or be a direct URL string
        if (!output || !Array.isArray(output) || output.length === 0) {
          return {
            success: false,
            message: "No image was generated",
            error: "Replicate API returned empty result",
          };
        }

        // Get the first image URL
        // Handle both string URLs and file objects with url() method
        let imageUrl: string;
        const firstOutput = output[0];
        
        if (typeof firstOutput === "string") {
          imageUrl = firstOutput;
        } else if (typeof firstOutput === "object" && firstOutput !== null) {
          // Try url() method first, then direct url property
          imageUrl = typeof firstOutput.url === "function" 
            ? firstOutput.url() 
            : firstOutput.url || firstOutput;
        } else {
          return {
            success: false,
            message: "Failed to get image URL from Replicate",
            error: "Invalid response format from Replicate API",
          };
        }

        if (!imageUrl || typeof imageUrl !== "string") {
          return {
            success: false,
            message: "Failed to get image URL from Replicate",
            error: "Image URL not found in response",
          };
        }

        // Download the image from Replicate
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          return {
            success: false,
            message: "Failed to download generated image",
            error: `HTTP ${imageResponse.status}: ${imageResponse.statusText}`,
          };
        }

        // Get image buffer
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        
        // Determine file extension from content type or default to jpg
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
        const extension = contentType.includes("png") ? "png" : "jpg";
        const filename = `generated-image-${Date.now()}.${extension}`;

        // Upload to ImageKit
        const { fileId, url } = await uploadFile(
          imageBuffer,
          filename,
          contentType
        );

        // Save to database for gallery
        try {
          await prisma.generatedImage.create({
            data: {
              userId: userId,
              prompt: prompt,
              imageUrl: url,
              imageKitFileId: fileId,
              aspectRatio: aspect_ratio,
            },
          });
        } catch (dbError) {
          console.error("Failed to save generated image to database:", dbError);
          // Don't fail the request if DB save fails, just log it
        }

        // Deduct image allowance after successful generation
        // All images count as 1 (no HD distinction)
        await deductImage(userId).catch((error) => {
          console.error("Failed to deduct image allowance:", error);
          // Don't fail the request if deduction fails, but log it
        });

        return {
          success: true,
          message: "Image generated successfully",
          imageUrl: url,
          imageKitFileId: fileId,
          prompt: prompt,
          aspectRatio: aspect_ratio,
          originalUrl: imageUrl, // Keep original URL for reference
        };
      } catch (error) {
        console.error("Image generation error:", error);
        return {
          success: false,
          message: "Failed to generate image",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });
