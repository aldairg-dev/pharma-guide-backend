import { Router } from "express";
import { DrugController } from "../controller/drug.controller";

const routerDrug = Router();
const drugController = new DrugController();

routerDrug.post("/drug", drugController.createDrug.bind(drugController));

routerDrug.get("/drugs", drugController.getDrugs.bind(drugController));

routerDrug.get("/drug/:id", drugController.getDrugUser.bind(drugController));

routerDrug.put("/drug/:id", drugController.updateDrug.bind(drugController));

routerDrug.delete("/drug/:id", drugController.deleteDrug.bind(drugController));

export default routerDrug;
