"server-only";
import { createMiddleware } from "hono/factory";
import { auth } from "../auth";
import { HTTPException } from "hono/http-exception";

type Env = {
  Variables: {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

export const getAuthUser = createMiddleware<Env>(async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session) {
      throw new HTTPException(401, { message: "unauthorized" });
    }
    c.set("user", session.user);
    await next();
  } catch (error) {
    // Check if this is a database connection error
    if (error && typeof error === "object") {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = JSON.stringify(error);
      
      // Check for database connection errors
      if (
        errorMessage.includes("terminating connection") ||
        errorMessage.includes("administrator command") ||
        errorString.includes("E57P01") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("database")
      ) {
        console.error("Database connection error in auth middleware:", error);
        throw new HTTPException(503, { 
          message: "Database connection error. Please try again later." 
        });
      }
    }
    
    // For other errors, check if it's already an HTTPException
    if (error instanceof HTTPException) {
      throw error;
    }
    
    console.error("Auth middleware error:", error);
    throw new HTTPException(401, { message: "unauthorized" });
  }
});
