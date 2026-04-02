import { ZodError } from "zod";
import jwt from "jsonwebtoken";
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

  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      body: {
        message: err.message.split("\n")[0] ?? "Invalid query or data",
        code: "DATABASE_VALIDATION_ERROR",
      },
    };
  }

  if (err instanceof jwt.TokenExpiredError) {
    return {
      statusCode: 401,
      body: { message: "Token expired", code: "TOKEN_EXPIRED" },
    };
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return {
      statusCode: 401,
      body: { message: "Invalid token", code: "INVALID_TOKEN" },
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Connection-level issues sometimes surface as P2010 in driver adapters.
    // Example: "Server has closed the connection." / ConnectionClosed
    if (err.code === "P2010") {
      const msg = String(err.message ?? "");
      const driverErr = (err.meta as { driverAdapterError?: unknown } | undefined)?.driverAdapterError as
        | { name?: unknown; cause?: unknown }
        | undefined;
      const driverName = driverErr?.name ? String(driverErr.name) : "";
      const looksLikeConnection =
        /closed the connection/i.test(msg) ||
        driverName === "ConnectionClosed" ||
        driverName === "TlsConnectionError";
      if (looksLikeConnection) {
        return {
          statusCode: 503,
          body: {
            message: "Database service is unavailable",
            code: "DATABASE_UNAVAILABLE",
          },
        };
      }
    }
    if (err.code === "P2002") {
      const target = err.meta?.target;
      const fields = Array.isArray(target) ? target.join(", ") : String(target ?? "field");
      return {
        statusCode: 409,
        body: {
          message: "A record with this value already exists",
          code: "DUPLICATE_ENTRY",
          fields,
        },
      };
    }
    return {
      statusCode: 400,
      body: {
        message: "Database request could not be completed",
        code: "DATABASE_REQUEST_ERROR",
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
