import { betterAuth } from "better-auth";
import { openAPI, bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import prismaInstance from "./prisma";

const prisma = prismaInstance as unknown as PrismaClient;

// Build plugins array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: any[] = [openAPI(), bearer()];

const trustedOrigins = Array.from(
  new Set(
    [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      "https://www.platvo.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter((origin): origin is string => Boolean(origin))
  )
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins,
  plugins,
});
