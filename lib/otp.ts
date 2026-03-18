import crypto from "crypto";

/** Generate a 6-digit numeric OTP */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** SHA-256 hash of the OTP for DB storage (no bcrypt dependency needed) */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** Compare a plain OTP against a stored hash */
export function verifyOtpHash(otp: string, hash: string): boolean {
  const incoming = crypto.createHash("sha256").update(otp).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(incoming), Buffer.from(hash));
}
