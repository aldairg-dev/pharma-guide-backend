import { Router } from "express";
import { DrugController } from "../controller/drug.controller";
import { DrugIAController } from "../controller/drugIA.controller";

const routerDrug = Router();
const drugController = new DrugController();
const drugIAController = new DrugIAController();

routerDrug.get("/drugs", drugController.getDrugs.bind(drugController));

routerDrug.get(
  "/users/:id/drugs",
  drugController.getDrugsByUserId.bind(drugController)
);

export default routerDrug;
