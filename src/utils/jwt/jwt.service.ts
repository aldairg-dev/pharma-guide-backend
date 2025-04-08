const jwt = require("jsonwebtoken");

interface JwtPayload {
  emailUser: string;
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
        "Faltan las variables de entorno JWT_SECRET o JWT_EXPIRATION"
      );
    }

    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  verifyToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("Falta la variable de entorno JWT_SECRET");
    }

    return jwt.verify(token, secret) as JwtPayload;
  }
}
