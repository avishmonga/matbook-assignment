import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, _next: NextFunction) {
  return res.status(404).json({ success: false, message: "Not Found" });
}