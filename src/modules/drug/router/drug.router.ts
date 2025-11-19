import { Router } from "express";
import { DrugController } from "../controller/drug.controller";
import { DrugIAController } from "../controller/drugIA.controller";

const routerDrug = Router();
const drugController = new DrugController();
const drugIAController = new DrugIAController();

routerDrug.post("/drugs", drugController.createDrug.bind(drugController));

routerDrug.get("/drugs", drugController.getDrugs.bind(drugController));

routerDrug.put("/drugs/:id", drugController.updateDrug.bind(drugController));

routerDrug.delete("/drugs/:id", drugController.deleteDrug.bind(drugController));

routerDrug.get(
  "/drugs/:id/contraindications",
  drugIAController.getContraindicationsByDrugId.bind(drugIAController)
);

routerDrug.get(
  "/drugs/:id/therapeutic-class",
  drugIAController.getTherapeuticClassByDrugId.bind(drugIAController)
);

export default routerDrug;
