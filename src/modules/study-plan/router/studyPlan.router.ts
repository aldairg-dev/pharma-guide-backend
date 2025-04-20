import { Router } from "express";
import { StudyPlanController } from "../controller/studyPlan.controller";

const routerStudyPlan = Router();
const studyPlanController = new StudyPlanController();

routerStudyPlan.post(
  "/study-plans",
  studyPlanController.createStudyPlan.bind(studyPlanController)
);

routerStudyPlan.get(
  "/study-plans",
  studyPlanController.getStudyPlan.bind(studyPlanController)
);

routerStudyPlan.get(
  "/study-plans/:id",
  studyPlanController.getOneStudyPlan.bind(studyPlanController)
);

routerStudyPlan.put(
  "/study-plans/:id",
  studyPlanController.updateStudyPlan.bind(studyPlanController)
);

routerStudyPlan.delete(
  "/study-plans",
  studyPlanController.deleteStudyPlan.bind(studyPlanController)
);

export default routerStudyPlan;
