import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

const resolveAppUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  return "http://localhost:3000";
};

export const client = hc<AppType>(resolveAppUrl());

export const api = client.api;
