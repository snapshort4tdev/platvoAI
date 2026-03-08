"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const languageSchema = z.object({
  language: z.enum(["en", "ar"]),
});

// GET: Fetch user's language preference
export async function GET(_request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { language: true },
    });

    return NextResponse.json({
      success: true,
      language: user?.language || "en",
    });
  } catch (error) {
    console.error("Error fetching user language:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch language preference" },
      { status: 500 }
    );
  }
}

// PATCH: Update user's language preference
export async function PATCH(request: NextRequest) {
  // request is used in the function body
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { language } = languageSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { language },
    });

    return NextResponse.json({
      success: true,
      language,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid language value" },
        { status: 400 }
      );
    }
    console.error("Error updating user language:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update language preference" },
      { status: 500 }
    );
  }
}
