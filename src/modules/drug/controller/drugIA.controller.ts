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

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
          contraindications: null,
        });
        return;
      }

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID de medicamento inválido",
          contraindications: null,
        });
        return;
      }

      let contraindications = null;
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

      contraindications = await this.drugCache.getDrugContraindications(
        myDrug.userId,
        Number(id)
      );

      if (contraindications) {
        console.log("[drugIAController] Contraindicaciones obtenidas de caché");
      } else {
        const result = await this.drugIAService.DrugContradications(Number(id));
        console.log(
          "[drugIAController] Contraindicaciones obtenidas de servicio externo"
        );
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
          id: id,
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
      console.error("Error en getContraindicationsByDrugId: ", error);

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

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
          therapeuticClass: null,
        });
        return;
      }

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID de medicamento inválido",
          therapeuticClass: null,
        });
        return;
      }

      let therapeuticClass = null;
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

      therapeuticClass = await this.drugCache.getDrugTherapeuticClass(
        myDrug.userId,
        Number(id)
      );

      if (therapeuticClass) {
        console.log("[drugIAController] Clase terapéutica obtenida de caché");
      } else {
        const result = await this.drugIAService.TherapeuticClass(Number(id));
        console.log(
          "[drugIAController] Clase terapéutica obtenida de servicio externo"
        );
        therapeuticClass = result?.therapeuticClass;

        if (therapeuticClass) {
          await this.drugCache.addDrugTherapeuticClass(
            myDrug.userId,
            Number(id),
            therapeuticClass
          );
        }
      }

      if (therapeuticClass) {
        res.status(200).json({
          id: id,
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
}
