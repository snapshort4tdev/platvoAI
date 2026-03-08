import { createAuthClient } from "better-auth/react";
import { useAuthToken } from "@/hooks/use-auth-token";

// Build plugins array (no Stripe)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: any[] = [];

export const authClient = createAuthClient({
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => useAuthToken.getState().bearerToken || "",
    },
  },
  plugins,
});
