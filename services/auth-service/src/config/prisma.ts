import * as dotenv from "dotenv";
dotenv.config({ path: "prisma/.env" });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const adapter = new PrismaPg({ connectionString });
const options: Prisma.PrismaClientOptions = { adapter };
export const prisma = new PrismaClient(options);
