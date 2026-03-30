import type { Request, Response } from "express";

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