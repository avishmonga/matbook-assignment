import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Internal server error" });
}