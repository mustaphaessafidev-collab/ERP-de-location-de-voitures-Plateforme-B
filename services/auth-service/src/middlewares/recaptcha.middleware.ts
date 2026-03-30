import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { verifyRecaptcha } from "../services/recaptcha.service";

function getClientIp(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim();
  if (Array.isArray(forwarded)) return forwarded[0]?.trim();
  return req.ip ?? req.socket?.remoteAddress;
}

/**
 * Middleware that verifies reCAPTCHA using req.body.recaptchaToken.
 * When RECAPTCHA_ENABLED is false, calls next() without checking.
 * When enabled and token is missing or invalid, responds with 400 and does not call next().
 * Attach to routes that require reCAPTCHA (e.g. register, login, forgot-password).
 * Must run after express.json() so req.body is available.
 */
export async function recaptchaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!env.recaptcha.enabled || !env.recaptcha.secretKey) {
    next();
    return;
  }
  const token =
    typeof req.body === "object" && req.body !== null && "recaptchaToken" in req.body
      ? req.body.recaptchaToken
      : undefined;
  const result = await verifyRecaptcha(
    typeof token === "string" ? token : undefined,
    getClientIp(req)
  );
  if (result.success) {
    next();
    return;
  }
  res.status(400).json({
    message: "reCAPTCHA verification failed. Please try again.",
  });
}
