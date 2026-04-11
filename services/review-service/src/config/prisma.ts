import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();

export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database status: connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
