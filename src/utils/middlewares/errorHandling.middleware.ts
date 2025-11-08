import { Request, Response, NextFunction } from "express";

/**
 * Middleware para manejar timeouts en las requests
 */
export const timeoutMiddleware = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Configurar timeout para la respuesta
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message:
            "La solicitud excedió el tiempo límite. Por favor, inténtelo de nuevo.",
          contraindications: null,
        });
      }
    }, timeout);

    res.on("finish", () => {
      clearTimeout(timer);
    });

    res.on("close", () => {
      clearTimeout(timer);
    });

    next();
  };
};

/**
 * Middleware para manejar errores de Prisma específicamente
 */
export const prismaErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.code && error.code.startsWith("P")) {
    console.error("Prisma Error:", error);

    switch (error.code) {
      case "P5010":
        return res.status(503).json({
          success: false,
          message: "Servicio de base de datos temporalmente no disponible",
          contraindications: null,
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Registro no encontrado",
          contraindications: null,
        });
      default:
        return res.status(500).json({
          success: false,
          message: "Error de base de datos",
          contraindications: null,
        });
    }
  }

  next(error);
};
