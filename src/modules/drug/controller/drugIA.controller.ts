import { NextFunction, Request, Response } from "express";
import { DrugIAService } from "../service/drugIA.service";
import { DrugCacheService } from "../../cache/service/drug/drugCache.service";
import { DrugService } from "../service/drug.service";

export class DrugIAController {
  private drugIAService = new DrugIAService();
  private drugCache = new DrugCacheService();
  private drugService = new DrugService();

  async getContraindicationsByDrugId(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      if (!userId || !id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token or invalid medication ID",
          dosage: null,
        });
        return;
      }

      const myDrug = await this.drugService.getMyDrugById(
        Number(userId),
        Number(id)
      );

      if (!myDrug) {
        res.status(404).json({
          success: false,
          message: "Drug not found or you are not authorized to access it.",
          contraindications: null,
        });
        return;
      }

      let contraindications = null;
      contraindications = await this.drugCache.getDrugContraindications(
        myDrug.userId,
        Number(id)
      );

      if (!contraindications || contraindications === null) {
        const result = await this.drugIAService.DrugContradications(Number(id));
        contraindications = result?.contraindications;

        if (contraindications) {
          await this.drugCache.addDrugContraindications(
            myDrug.userId,
            Number(id),
            contraindications
          );
        }
      }

      if (contraindications) {
        res.status(200).json({
          contraindications: contraindications,
        });
      } else {
        res.status(404).json({
          success: false,
          message:
            "No se encontraron contraindicaciones para este medicamento o el medicamento no existe",
          contraindications: null,
        });
      }
    } catch (error: any) {
      console.error(
        "[drugIAController] Error en getContraindicationsByDrugId: ",
        error
      );

      res.status(500).json({
        success: false,
        message: "Error processing request for drug contraindications",
        contraindications: null,
      });
    }
  }

  async getTherapeuticClassByDrugId(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      if (!userId || !id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token or invalid medication ID",
          dosage: null,
        });
        return;
      }

      const myDrug = await this.drugService.getMyDrugById(
        Number(userId),
        Number(id)
      );

      if (!myDrug) {
        res.status(404).json({
          success: false,
          message: "Drug not found or you are not authorized to access it.",
          therapeuticClass: null,
        });
        return;
      }

      let therapeuticClass = null;
      therapeuticClass = await this.drugCache.getDrugTherapeuticClass(
        myDrug.userId,
        Number(id)
      );

      if (!therapeuticClass || therapeuticClass === null) {
        const result = await this.drugIAService.therapeuticClass(Number(id));
        therapeuticClass = result?.therapeuticClass;

        if (therapeuticClass) {
          await this.drugCache.addDrugTherapeuticClass(
            myDrug.userId,
            myDrug.id,
            therapeuticClass
          );
        }
      }

      if (therapeuticClass) {
        res.status(200).json({
          therapeuticClass: therapeuticClass,
        });
      } else {
        res.status(404).json({
          success: false,
          message:
            "No se encontró información de clase terapéutica para este medicamento o el medicamento no existe",
          therapeuticClass: null,
        });
      }
    } catch (error: any) {
      console.error("Error en getTherapeuticClassByDrugId: ", error);

      res.status(500).json({
        success: false,
        message: "Error processing request for drug therapeutic class",
        therapeuticClass: null,
      });
    }
  }

  async getDosageByDrugId(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      if (!userId || !id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token or invalid medication ID",
          dosage: null,
        });
        return;
      }

      const myDrug = await this.drugService.getMyDrugById(userId, Number(id));
      if (!myDrug) {
        res.status(404).json({
          success: false,
          message: "Not found Drug",
          dosage: null,
        });
        return;
      }

      let dosageData = null;
      dosageData = await this.drugCache.getDosages(userId, Number(id));

      if (!dosageData || dosageData === null) {
        const result = await this.drugIAService.dosage(Number(id));
        dosageData = result?.dosage;

        if (dosageData) {
          await this.drugCache.addDosages(myDrug.userId, myDrug.id, dosageData);
        }
      }

      if (dosageData) {
        res.status(200).json({
          dosage: dosageData,
        });
      } else {
        res.status(404).json({
          success: false,
          message:
            "No se encontraron dosificaciones para este medicamento o el medicamento no existe",
          dosage: null,
        });
      }
    } catch (error: any) {
      console.error("[drugIAController] Error en getDosageByDrugId: ", error);
      res.status(500).json({
        success: false,
        message: "Error processing request for drug dosage",
        dosage: null,
      });
    }
  }

  async getIndications(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!userId || !id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: "User ID not found in token or invalid medication ID",
        dosage: null,
      });
      return;
    }

    const myDrug = await this.drugService.getMyDrugById(userId, Number(id));
    if (!myDrug) {
      res.status(404).json({
        success: false,
        message: "Not found Drug",
        dosage: null,
      });
      return;
    }

    let indicationData = null;
    indicationData = await this.drugCache.getIndications(userId, Number(id));

    if (!indicationData || indicationData === null) {
      const result = await this.drugIAService.indications(Number(id));
      indicationData = result?.indications;

      if (indicationData) {
        await this.drugCache.addIndications(
          myDrug.userId,
          myDrug.id,
          indicationData
        );
      }
    }

    if (indicationData) {
      res.status(200).json({
        indications: indicationData,
      });
    } else {
      res.status(404).json({
        success: false,
        message:
          "No se encontraron indicaciones para este medicamento o el medicamento no existe",
        dosage: null,
      });
    }
  }

  async getMechanismOfActions(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      if (!userId || !id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token or invalid medication ID",
          mechanismOfActions: null,
        });
        return;
      }

      const myDrug = await this.drugService.getMyDrugById(userId, Number(id));
      if (!myDrug) {
        res.status(404).json({
          success: false,
          message: "Not found Drug",
          mechanismOfActions: null,
        });
        return;
      }

      let mechanismOfActionsData = null;
      mechanismOfActionsData = await this.drugCache.getMechanismOfActions(userId, Number(id));

      if (!mechanismOfActionsData || mechanismOfActionsData === null) {
        const result = await this.drugIAService.mechanismOfActions(Number(id));
        mechanismOfActionsData = result?.mechanismOfActions;

        if (mechanismOfActionsData) {
          await this.drugCache.addMechanismOfActions(
            myDrug.userId,
            myDrug.id,
            mechanismOfActionsData
          );
        }
      }

      if (mechanismOfActionsData) {
        res.status(200).json({
          mechanismOfActions: mechanismOfActionsData,
        });
      } else {
        res.status(404).json({
          success: false,
          message:
            "No se encontró información del mecanismo de acción para este medicamento o el medicamento no existe",
          mechanismOfActions: null,
        });
      }
    } catch (error) {
      console.error(
        `[drugIAController] Error en getMechanismOfActions: ${error}`
      );
      res.status(500).json({
        success: false,
        message: "Error processing request for drug mechanism of action",
        mechanismOfActions: null,
      });
    }
  }
}
