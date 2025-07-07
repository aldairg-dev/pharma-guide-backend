import { Router } from "express";

const routerIaExecution = Router();
import { IaExecutionController } from "../controller/ia-execution.controller";

const iaExecutionController = new IaExecutionController();

routerIaExecution.post(
  "/execute",
  iaExecutionController.getData.bind(iaExecutionController)
);

export default routerIaExecution;
