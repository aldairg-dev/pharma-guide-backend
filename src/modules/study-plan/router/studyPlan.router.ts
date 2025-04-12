import { Router } from "express";
import { StudyPlanController } from "../controller/studyPlan.controller";

const routerStudyPlan = Router();
const studyPlanController = new StudyPlanController();

routerStudyPlan.post(
  "/study-plans/create",
  studyPlanController.createStudyPlan.bind(studyPlanController)
);

export default routerStudyPlan;
