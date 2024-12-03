import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient
const prisma = global.prisma || new PrismaClient();

// If in development mode, assign the PrismaClient instance to the global variable
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
