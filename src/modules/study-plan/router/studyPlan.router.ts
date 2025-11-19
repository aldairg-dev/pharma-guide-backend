import { Router } from "express";
import { StudyPlanController } from "../controller/studyPlan.controller";

const routerStudyPlan = Router();
const studyPlanController = new StudyPlanController();

routerStudyPlan.get(
  "/study-plans",
  studyPlanController.getStudyPlan.bind(studyPlanController)
);

routerStudyPlan.put(
  "/study-plans/:id",
  studyPlanController.updateStudyPlan.bind(studyPlanController)
);

routerStudyPlan.delete(
  "/study-plans/:id",
  studyPlanController.deleteStudyPlan.bind(studyPlanController)
);

routerStudyPlan.get(
  "/study-plans/:id",
  studyPlanController.getStudyPlanById.bind(studyPlanController)
);

export default routerStudyPlan;
