import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./app.error";

export type ParsedError = {
  error?: unknown;
  statusCode: number;
  body: Record<string, unknown>;
};

export function parseError(err: unknown): ParsedError {
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return {
      statusCode: 400,
      body: { message: "Validation failed", code: "VALIDATION_ERROR", errors: messages },
    };
  }

  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      message: err.message,
      code: err.code,
    };
    if (err.details !== undefined) body.details = err.details;
    return { statusCode: err.statusCode, body };
  }

  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return {
      statusCode: 503,
      body: {
        message: "Database service is unavailable",
        code: "DATABASE_UNAVAILABLE",
      },
    };
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "ECONNREFUSED"
  ) {
    return {
      statusCode: 503,
      body: {
        message: "Database service is unavailable",
        code: "DATABASE_UNAVAILABLE",
      },
    };
  }

  return {
    statusCode: 500,
    body: { message: "Internal server error", code: "INTERNAL_SERVER_ERROR" },
  };
}
