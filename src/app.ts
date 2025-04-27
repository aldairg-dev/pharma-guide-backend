import express from "express";
import cors from "cors";
import routerAccess from "./modules/access/router/access.router";
import routerStudyPlan from "./modules/study-plan/router/studyPlan.router";
import { JwtService } from "./utils/jwt/jwt.service";
import routerStatus from "./modules/status/router/status.router";
import routerUser from "./modules/user/router/user.router";
import routerRole from "./modules/role/router/role.router";

const app = express();
const jwtService = new JwtService();

app.use(cors());

app.use(express.json());

app.use("/api/access/pharma-guide", routerAccess);

app.use(
  "/api/pharma-guide/",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerStudyPlan
);

app.use(
  "/api/pharma-guide/",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerUser
);

//  -> Setting Status and Role
app.use(
  "/api/pharma-guide/setting",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerStatus
);
app.use(
  "/api/pharma-guide/setting",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerRole
);

export default app;
