import { PrismaClient } from "../generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Validate DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL || "";
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
    "Please set it in your .env.local file. " +
    "Example: DATABASE_URL=\"postgresql://user:password@localhost:5432/Platvo_ai?schema=public\""
  );
}

// Validate DATABASE_URL format (PostgreSQL connection string)
if (!databaseUrl.startsWith("postgresql://") && 
    !databaseUrl.startsWith("postgres://")) {
  throw new Error(
    `Invalid DATABASE_URL format. Expected PostgreSQL connection string:
    - postgresql://user:password@host:port/database?schema=public
    
    Current value: ${databaseUrl.substring(0, 50)}...`
  );
}

// Create Prisma Client for regular PostgreSQL (Neon, Supabase, etc.)
// NO Prisma Accelerate - using direct PostgreSQL connection
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

// Clear any cached Prisma client to ensure fresh initialization
if (globalForPrisma.prisma) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).prisma;
}

const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
