const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction, RequestHandler } from "express";

interface JwtPayload {
  userId: number;
  emailUser: string;
  roleId: number;
}

/**
 * @author "@2A2G (Aldair Gutierrez Guerrero)"
 * @abstract "This class is responsible for creating and verifying JWT tokens."
 * @date "2023-10-01"
 */
export class JwtService {
  // Token creation process
  createToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRATION;

    if (!secret || !expiresIn) {
      throw new Error(
        "Missing required environment variables: JWT_SECRET or JWT_EXPIRATION."
      );
    }

    return jwt.sign(payload, secret, { expiresIn: Number(expiresIn) });
  }

  // Token verification process
  verifyToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Falta la variable de entorno JWT_SECRET");
    }

    return jwt.verify(token, secret) as JwtPayload;
  }

  verifyTokenMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token no proporcionado o inválido" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido o expirado" });
      return;
    }
  };
}
