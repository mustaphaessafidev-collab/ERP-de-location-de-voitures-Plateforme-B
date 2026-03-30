import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    const messages = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }
  if (err instanceof Error) {
    const msg = err.message;
    if (msg === "Invalid email or password") {
      return res.status(400).json({ message: "The credentials don't match with our records" });
    }
    if (msg === "Email not validated") {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }
    if (msg === "Invalid or expired verification token") {
      return res.status(400).json({ message: msg });
    }
    if (msg === "Email already registered" || msg === "CIN already registered") {
      return res.status(409).json({ message: "The email or cin is already registered" });
    }
    if (msg === "User not found" || msg === "Invalid or expired reset token") {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(500).json({ message: "Internal server error" });
}

