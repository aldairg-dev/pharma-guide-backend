import express from "express";
import cors from "cors";
import routerAccess from "./modules/access/router/access.router";
import routerStudyPlan from "./modules/study-plan/router/studyPlan.router";
import { JwtService } from "./utils/jwt/jwt.service";
import routerUser from "./modules/user/router/user.router";
import routerRole from "./modules/role/router/role.router";
import routerDrug from "./modules/drug/router/drug.router";
import routerIaManagement from "./modules/ia-management/router/ia-management.router";
import routerIaExecution from "./modules/ia-execution/router/ia-execution.router";

const app = express();
const jwtService = new JwtService();

app.use(cors());

app.use(express.json());

app.use("/api/access/pharma-guide", routerAccess);

app.use(
  "/api/pharma-guide",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerStudyPlan
);

app.use(
  "/api/pharma-guide",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerUser
);

//  -> Setting Role

app.use(
  "/api/pharma-guide/setting",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerRole
);

app.use(
  "/api/pharma-guide",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerDrug
);

app.use(
  "/api/pharma-guide",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerIaManagement
);

//  -> IA Execution
app.use(
  "/api/pharma-guide/ia",
  jwtService.verifyTokenMiddleware.bind(jwtService),
  routerIaExecution
);

export default app;
