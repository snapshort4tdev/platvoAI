import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success to avoid email enumeration
      return NextResponse.json({ success: true });
    }

    // Delete any existing OTP for this user
    await prisma.otpVerification.deleteMany({ where: { userId: user.id } });

    // Generate and store new OTP (expires in 10 minutes)
    const otp = generateOtp();
    const hash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otpHash: hash,
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail(email, otp, user.name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[OTP SEND ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
