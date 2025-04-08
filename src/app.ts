import express from "express";
import routerUser from "./modules/user/router/user.router";
import { JwtService } from "./utils/jwt/jwt.service";

const app = express();
const jwtService = new JwtService();

app.use(express.json());
app.use(
  "/api/users",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerUser
);

export default app;
