import { Request, Response } from "express";
import { DrugIAService } from "../service/drugIA.service";
import { DrugCacheService } from "../../cache/service/drug/drugCache.service";
import { DrugService } from "../service/drug.service";
import { getRedisClient } from "../../cache/service/initializeRedis";

export class DrugIAController {
  private drugIAService = new DrugIAService();
  private drugCache = new DrugCacheService();
  private drugService = new DrugService();

  async getContraindicationsByDrugId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: "ID de medicamento inválido",
          contraindications: null,
        });
        return;
      }

      const data = await this.drugService.getDrugById(Number(id));
      const result = await this.drugIAService.DrugContradications(Number(id));

      if (data) {
        await this.drugCache.addDrugCache({
          userId: data.userId,
          drugId: Number(id),
          contraindications: result?.contraindications,
        });
      } else {
        console.log(
          "[Controller] No se puede guardar en caché - no hay datos del drug"
        );
      }

      if (result && result.contraindications) {
        res.status(200).json({
          id: result.id,
          contraindications: result.contraindications,
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
      console.error("Error en getContraindicationsByDrugId:", error);

      res.status(500).json({
        success: false,
        message: "Error processing request for drug contraindications",
        contraindications: null,
      });
    }
  }
}
