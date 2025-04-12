import { JwtPayload } from "../../utils/jwt/jwt.service";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
