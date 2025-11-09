import { Request, Response } from "express";
import { DrugIAService } from "../service/drugIA.service";

export class DrugIAController {
  private drugIAService = new DrugIAService();

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

      const result = await this.drugIAService.DrugContradications(Number(id));

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
