import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if (session) {
      return redirect("/home");
    }
  } catch (error: unknown) {
    // Next.js redirect() throws a special error that should not be caught
    // Check if this is a redirect error and re-throw it
    if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    // Handle database connection errors gracefully
    // If database is unavailable, allow the page to render without session check
    console.error("Database connection error in AuthLayout:", error);
    // Continue to render children even if session check fails
  }
  return <div>{children}</div>;
}
