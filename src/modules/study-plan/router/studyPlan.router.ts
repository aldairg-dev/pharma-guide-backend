import { Router } from "express";
import { StudyPlanController } from "../controller/studyPlan.controller";

const routerStudyPlan = Router();
const studyPlanController = new StudyPlanController();

routerStudyPlan.post(
  "/study-plans/create",
  studyPlanController.createStudyPlan.bind(studyPlanController)
);
routerStudyPlan.get(
  "/study-plans",
  studyPlanController.getStudyPlan.bind(studyPlanController)
);
routerStudyPlan.put(
  "/study-plans",
  studyPlanController.updateStudyPlan.bind(studyPlanController)
);

export default routerStudyPlan;
