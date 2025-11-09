import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

const rateLimitConfig = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // Máximo 10 peticiones por ventana de tiempo
  standardHeaders: true, // Incluir headers RateLimit-*
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Demasiadas peticiones desde esta IP. Máximo 5 por minuto.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: 60,
    });
  },
});

/**
 * Middleware combinado que aplica rate limiting y timeout
 */
export const RateLimit = (req: Request, res: Response, next: NextFunction) => {
  rateLimitConfig(req, res, (rateLimitError?: any) => {
    if (rateLimitError) {
      return;
    }

    const timeout = 30000; // 30 segundos
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message: "La solicitud excedió el tiempo límite de 30 segundos.",
          code: "REQUEST_TIMEOUT",
        });
      }
    }, timeout);

    const cleanup = () => {
      clearTimeout(timer);
    };

    res.on("finish", cleanup);
    res.on("close", cleanup);

    next();
  });
};
