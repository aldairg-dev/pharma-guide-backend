import { Request, Response } from "express";

export function getUserIdOrRespond(req: Request, res: Response): string | null {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: "No autorizado" });
    return null;
  }
  return userId;
}

export function validateFieldOrRespond(
  field: any,
  res: Response,
  message: string,
  statusCode: number = 400
): boolean {
  if (!field) {
    res.status(statusCode).json({ message });
    return false;
  }
  return true;
}
