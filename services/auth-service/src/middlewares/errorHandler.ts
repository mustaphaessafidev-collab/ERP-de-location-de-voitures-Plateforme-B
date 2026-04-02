import type { NextFunction, Request, Response } from "express";
import { parseError } from "../errors/error-parser";

function getErrorMessage(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err !== null && "message" in err
        ? String((err as { message?: unknown }).message ?? "Unknown error")
      : typeof err === "string"
        ? err
        : "Unknown error";

  // Keep terminal output clean: first line only, no code-frame block.
  return raw.split("\n")[0]?.trim() || "Unknown error";
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const parsed = parseError(err);
  const reason = getErrorMessage(err);

  // Keep server logs clear and compact.
  // eslint-disable-next-line no-console
  console.error(
    `[API_ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl} ` +
      `status=${parsed.statusCode} code=${String(parsed.body.code ?? "UNKNOWN_ERROR")} reason="${reason}"`,
  );

  // Only hide details for unknown failures (parseError default). Keep 503 AppErrors etc. visible.
  const hideDetails =
    parsed.statusCode === 500 && parsed.body.code === "INTERNAL_SERVER_ERROR";
  if (hideDetails) {
    // Full error in server logs (stack for Error instances).
    // eslint-disable-next-line no-console
    console.error(err);
    const payload: Record<string, unknown> = {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    };
    if (process.env.NODE_ENV === "development") {
      payload.debug = {
        reason,
        name: err instanceof Error ? err.name : typeof err,
      };
    }
    return res.status(500).json(payload);
  }

  return res.status(parsed.statusCode).json(parsed.body);
}

export function httpErrorHandler(req: Request, res: Response): Response {
  return res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}

