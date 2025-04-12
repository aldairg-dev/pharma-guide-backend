import express from "express";
import routerUser from "./modules/user/router/user.router";
import routerStudyPlan from "./modules/study-plan/router/studyPlan.router";
import { JwtService } from "./utils/jwt/jwt.service";

const app = express();
const jwtService = new JwtService();

app.use(express.json());

app.use("/api/access/pharma-guide", routerUser);
app.use(
  "/api/pharma-guide/",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerStudyPlan
);

export default app;
