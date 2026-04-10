import path from "path";
import dotenv from "dotenv";

/** Service root `.env` first, then optional `prisma/.env` overrides (legacy). */
export function loadEnv(): void {
  const cwd = process.cwd();
  dotenv.config({ path: path.resolve(cwd, ".env") });
  dotenv.config({ path: path.resolve(cwd, "prisma", ".env") });
}
