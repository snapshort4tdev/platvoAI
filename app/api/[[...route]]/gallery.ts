import { Hono } from "hono";
import { getAuthUser } from "@/lib/hono/hono-middlware";
import prisma from "@/lib/prisma";

export const galleryRoute = new Hono()
  .get("/", getAuthUser, async (c) => {
    try {
      const user = c.get("user");

      // Fetch all generated images for the user, ordered by most recent first
      const images = await prisma.generatedImage.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          prompt: true,
          imageUrl: true,
          aspectRatio: true,
          createdAt: true,
        },
      });

      return c.json({
        success: true,
        images,
      });
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return c.json(
        {
          success: false,
          error: "Failed to fetch gallery images",
          details: errorMessage,
        },
        500
      );
    }
  });
