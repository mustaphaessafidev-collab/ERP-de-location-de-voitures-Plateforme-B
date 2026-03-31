import type { NextFunction, Request, Response } from "express";
import { parseError } from "../errors/error-parser";

function getErrorMessage(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
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
  if (parsed.statusCode >= 500) {
    return res.status(500).json({ message: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
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

