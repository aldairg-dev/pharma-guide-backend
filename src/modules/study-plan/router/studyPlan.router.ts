import { Router } from "express";
import { StudyPlanController } from "../controller/studyPlan.controller";

const routerStudyPlan = Router();
const studyPlanController = new StudyPlanController();

routerStudyPlan.get(
  "/study-plans",
  studyPlanController.getStudyPlan.bind(studyPlanController)
);

routerStudyPlan.get(
  "/study-plans/:id",
  studyPlanController.getStudyPlanById.bind(studyPlanController)
);

routerStudyPlan.get(
  "/user/:id/study-plan",
  studyPlanController.getStudyPlanByUserId.bind(studyPlanController)
);

export default routerStudyPlan;
