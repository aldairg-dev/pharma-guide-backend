import { DrugModel } from "./drug.model";
import {
  DosageResponse,
  FormattedDosageResponse,
  DosageData,
} from "../../types/dosage.types";
import { DrugInfo } from "../geminiAI/geminiAI.utils";

export class DosageModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data.indicaciones &&
      Array.isArray(data.indicaciones) &&
      data.poblaciones_especiales &&
      data.ajustes_funcionales
    );
  }

  static processData(data: any): DosageData {
    const dosageData: DosageData = {
      indicaciones: Array.isArray(data.indicaciones) ? data.indicaciones : [],
      poblaciones_especiales: data.poblaciones_especiales || {},
      ajustes_funcionales: data.ajustes_funcionales || {
        renal: {},
        hepatica: {},
      },
      dosis_maxima_diaria: data.dosis_maxima_diaria || undefined,
      contraindicaciones: Array.isArray(data.contraindicaciones)
        ? data.contraindicaciones
        : [],
      interacciones_relevantes: Array.isArray(data.interacciones_relevantes)
        ? data.interacciones_relevantes
        : [],
    };

    if (dosageData.indicaciones.length === 0) {
      throw new Error("No se encontraron indicaciones válidas");
    }

    return dosageData;
  }

  static async getValidatedDosage(drugInfo: DrugInfo): Promise<DosageResponse> {
    try {
      const result = await this.getProcessedContent(
        "drug.dosage",
        drugInfo,
        this.validateStructure,
        this.processData,
        "No se encontró información de dosificación para este medicamento"
      );

      return {
        success: result.success,
        dosage: result.data,
        message: result.message,
      };
    } catch (error: any) {
      console.error("Error getting validated dosage:", error);
      return {
        success: false,
        dosage: null,
        message: error.message || "Error processing dosage request",
      };
    }
  }
}

export const dosageModel = DosageModel;
