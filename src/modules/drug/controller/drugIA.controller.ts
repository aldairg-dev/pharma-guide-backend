import { NextFunction, Request, Response } from "express";
import { DrugIAService } from "../service/drugIA.service";
import { DrugCacheService } from "../../cache/service/drug/drugCache.service";
import { DrugService } from "../service/drug.service";

export class DrugIAController {
  private drugIAService = new DrugIAService();
  private drugCache = new DrugCacheService();
  private drugService = new DrugService();

  private formatDosageForDisplay(dosageData: any): string {
    let formatted = "";

    if (dosageData.indicaciones && dosageData.indicaciones.length > 0) {
      formatted += "INDICACIONES Y DOSIFICACIÓN:\n\n";
      dosageData.indicaciones.forEach((indicacion: any, index: number) => {
        formatted += `${index + 1}. ${indicacion.nombre}:\n`;
        formatted += `   - Dosis habitual: ${indicacion.dosis_habitual}\n`;
        if (indicacion.dosis_mg_kg) {
          formatted += `   - Dosis por peso: ${indicacion.dosis_mg_kg}\n`;
        }
        formatted += `   - Frecuencia: ${indicacion.frecuencia}\n`;
        if (indicacion.duracion) {
          formatted += `   - Duración: ${indicacion.duracion}\n`;
        }
        formatted += "\n";
      });
    }

    if (dosageData.poblaciones_especiales) {
      formatted += "POBLACIONES ESPECIALES:\n\n";
      const pob = dosageData.poblaciones_especiales;
      if (pob.pediatrica) {
        formatted += `Pediátrica: ${pob.pediatrica}\n\n`;
      }
      if (pob.geriatrica) {
        formatted += `Geriátrica: ${pob.geriatrica}\n\n`;
      }
      if (pob.embarazo_lactancia) {
        formatted += `Embarazo y Lactancia: ${pob.embarazo_lactancia}\n\n`;
      }
    }

    if (dosageData.ajustes_funcionales) {
      formatted += "AJUSTES POR FUNCIÓN ORGÁNICA:\n\n";
      const ajustes = dosageData.ajustes_funcionales;
      if (ajustes.renal) {
        formatted += "Función Renal:\n";
        Object.entries(ajustes.renal).forEach(([key, value]: [string, any]) => {
          if (value) formatted += `- ${key}: ${value}\n`;
        });
        formatted += "\n";
      }
      if (ajustes.hepatica) {
        formatted += "Función Hepática:\n";
        Object.entries(ajustes.hepatica).forEach(
          ([key, value]: [string, any]) => {
            if (value) formatted += `- ${key}: ${value}\n`;
          }
        );
        formatted += "\n";
      }
    }

    if (dosageData.dosis_maxima_diaria) {
      formatted += `DOSIS MÁXIMA DIARIA: ${dosageData.dosis_maxima_diaria}\n\n`;
    }

    if (
      dosageData.contraindicaciones &&
      dosageData.contraindicaciones.length > 0
    ) {
      formatted += "CONTRAINDICACIONES RELEVANTES:\n";
      dosageData.contraindicaciones.forEach((item: string, index: number) => {
        formatted += `${index + 1}. ${item}\n`;
      });
      formatted += "\n";
    }

    if (
      dosageData.interacciones_relevantes &&
      dosageData.interacciones_relevantes.length > 0
    ) {
      formatted += "INTERACCIONES RELEVANTES:\n";
      dosageData.interacciones_relevantes.forEach(
        (item: string, index: number) => {
          formatted += `${index + 1}. ${item}\n`;
        }
      );
    }

    return formatted.trim();
  }

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

      if (therapeuticClass) {
        console.log("[drugIAController] Clase terapéutica obtenida de caché");
      } else {
        const result = await this.drugIAService.therapeuticClass(Number(id));
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

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
          dosage: null,
        });
        return;
      }

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID de medicamento inválido",
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

      let cachedResult: any = await this.drugCache.getDosages(
        userId,
        Number(id)
      );

      if (cachedResult) {
        console.log("[drugIAController] Dosificación obtenida de caché");
      } else {
        const result = await this.drugIAService.dosage(Number(id));
        console.log(
          "[drugIAController] Dosificación obtenida de servicio externo"
        );
        cachedResult = result?.dosage;

        if (cachedResult) {
          await this.drugCache.addDosages(userId, Number(id), cachedResult);
        }
      }

      if (cachedResult) {
        res.status(200).json({
          dosage: cachedResult,
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
}
