import { Router } from "express";
import { DrugController } from "../controller/drug.controller";
import { DrugIAController } from "../controller/drugIA.controller";

const routerDrug = Router();
const drugController = new DrugController();
const drugIAController = new DrugIAController();

routerDrug.post("/drug", drugController.createDrug.bind(drugController));

routerDrug.get("/drug", drugController.getDrugs.bind(drugController));

routerDrug.get("/drug/:id", drugController.getDrugUser.bind(drugController));

routerDrug.put("/drug/:id", drugController.updateDrug.bind(drugController));

routerDrug.delete("/drug/:id", drugController.deleteDrug.bind(drugController));

routerDrug.get(
  "/drug/contraindications/:id",
  drugIAController.getContraindicationsByDrugId.bind(drugIAController)
);

export default routerDrug;
