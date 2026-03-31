import * as dotenv from "dotenv";
dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
import { DatabaseConfigError, DatabaseConnectionError } from "../errors/database.errors";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new DatabaseConfigError("DATABASE_URL is not set in environment");
}

const adapter = new PrismaPg({ connectionString });
const options: Prisma.PrismaClientOptions = { adapter };
export const prisma = new PrismaClient(options);

export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRawUnsafe("SELECT 1");
  } catch (error) {
    throw new DatabaseConnectionError("Unable to connect to database", error);
  }
};


