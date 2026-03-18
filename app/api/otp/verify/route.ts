import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyOtpHash } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Find the latest OTP record for this user
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check max attempts (5 tries)
    if (otpRecord.attempts >= 5) {
      await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify hash
    const isValid = verifyOtpHash(otp, otpRecord.otpHash);
    if (!isValid) {
      // Increment attempt counter
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          attempts: { increment: 1 },
          lastAttemptAt: new Date(),
        },
      });
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // ✅ Valid OTP — activate user and delete the record
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
        },
      }),
      prisma.otpVerification.delete({ where: { id: otpRecord.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[OTP VERIFY ERROR]", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
