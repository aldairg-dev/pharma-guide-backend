import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routerAccess from "./modules/access/router/access.router";
import routerStudyPlan from "./modules/study-plan/router/studyPlan.router";
import { JwtService } from "./utils/jwt/jwt.service";
import routerUser from "./modules/user/router/user.router";
import routerRole from "./modules/role/router/role.router";
import routerDrug from "./modules/drug/router/drug.router";
import { RateLimit } from "./utils/middlewares/rateLimiter.middleware";

const app = express();

app.set("trust proxy", 1);
const jwtService = new JwtService();

app.use(cors());
app.use(express.json());

app.use("/api/access/pharma-guide", routerAccess);

app.use(
  "/api/pharma-guide",
  RateLimit,
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerStudyPlan
);

app.use(
  "/api/pharma-guide",
  RateLimit,
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerUser
);

//  -> Setting Role
app.use(
  "/api/pharma-guide/setting",
  RateLimit,
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerRole
);

app.use(
  "/api/pharma-guide",
  RateLimit,
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerDrug
);

export default app;
