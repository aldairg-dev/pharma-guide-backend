import { Request, Response } from "express";
import {
  DrugIAService,
  DrugContraindicationResponse,
} from "../service/drugIA.service";

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
      
      // Identificar el tipo de error para dar una respuesta más específica
      let statusCode = 500;
      let message = "Error interno del servidor";
      
      if (error.code === 'P5010' || error.message?.includes('fetch failed')) {
        statusCode = 503;
        message = "Servicio temporalmente no disponible. Por favor, inténtelo de nuevo en unos momentos.";
      } else if (error.message?.includes('Invalid Drug ID')) {
        statusCode = 400;
        message = "ID de medicamento inválido";
      } else if (error.message?.includes('Failed to retrieve drug data')) {
        statusCode = 404;
        message = "Medicamento no encontrado";
      }
      
      res.status(statusCode).json({
        success: false,
        message,
        contraindications: null,
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}
