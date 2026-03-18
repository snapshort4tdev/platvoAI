"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RiLoader2Line, RiMailLine, RiRefreshLine } from "@remixicon/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const VerifyOtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start cooldown on mount (first OTP was already sent)
  useEffect(() => {
    startCooldown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.success("Email verified! Welcome to Platvo 🎉");
        router.replace("/home");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to resend code");
      } else {
        toast.success("A new code has been sent to your email");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        startCooldown();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="!bg-transparent border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <RiMailLine className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-12 text-center text-xl font-bold tracking-widest"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full text-white"
            disabled={isVerifying || otp.join("").length < OTP_LENGTH}
            onClick={handleVerify}
          >
            {isVerifying && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          {/* Resend */}
          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending && <RiLoader2Line className="h-3 w-3 animate-spin" />}
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Wrong email?{" "}
            <button
              type="button"
              onClick={() => router.replace("/auth/sign-up")}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Go back
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpForm;
