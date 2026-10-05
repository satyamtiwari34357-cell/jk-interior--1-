import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient | null = null;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    if (process.env.NODE_ENV === "production") {
      prisma = new PrismaClient();
    } else {
      if (!global.__prisma) {
        global.__prisma = new PrismaClient();
      }
      prisma = global.__prisma;
    }
  }
} catch (error) {
  console.warn(
    "[Prisma] Database connection skipped or failed to initialize:",
    error,
  );
}

export { prisma };
export default prisma;
