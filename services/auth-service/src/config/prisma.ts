import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";
import type { PoolConfig } from "pg";
import { DatabaseConfigError, DatabaseConnectionError } from "../errors/database.errors";
import { env } from "./env";

if (!env.databaseUrl) {
  throw new DatabaseConfigError("DATABASE_URL is not set in environment");
}

const poolConfig: PoolConfig = {
  connectionString: env.databaseUrl,
  ...(env.databaseUseSsl
    ? { ssl: { rejectUnauthorized: env.databaseSslRejectUnauthorized } }
    : {}),
};

const adapter = new PrismaPg(poolConfig);
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
