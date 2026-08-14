import { DrugModel } from "./drug.model";
import { DrugInfo } from "../geminiAI/geminiAI.utils";
import {
  PharmacokineticsResponse,
  PharmacokineticsData,
} from "../../types/pharmacokinetics";

export class PharmacokineticsModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data &&
      typeof data === "object" &&
      data.structured &&
      typeof data.structured === "object" &&
      Array.isArray(data.structured.absorcion) &&
      Array.isArray(data.structured.distribucion) &&
      Array.isArray(data.structured.metabolismo) &&
      Array.isArray(data.structured.excrecion) &&
      Array.isArray(data.structured.implicaciones_clinicas)
    );
  }

  static processData(data: any): { structured: PharmacokineticsData } {
    return {
      structured: {
        absorcion: Array.isArray(data.structured?.absorcion)
          ? data.structured.absorcion
          : [],

        distribucion: Array.isArray(data.structured?.distribucion)
          ? data.structured.distribucion
          : [],

        metabolismo: Array.isArray(data.structured?.metabolismo)
          ? data.structured.metabolismo
          : [],

        excrecion: Array.isArray(data.structured?.excrecion)
          ? data.structured.excrecion
          : [],

        implicaciones_clinicas: Array.isArray(
          data.structured?.implicaciones_clinicas,
        )
          ? data.structured.implicaciones_clinicas
          : [],
      },
    };
  }

  static async getProcessedPharmacokinetics(drugInfo: DrugInfo) {
    return this.getProcessedContent(
      "drug.pharmacokinetics",
      drugInfo,
      this.validateStructure,
      this.processData,
      "No se encontró información de farmacocinética para este medicamento o el medicamento no existe",
    );
  }

  static async getValidatedPharmacokinetics(
    drugInfo: DrugInfo,
  ): Promise<PharmacokineticsResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {};
    }

    try {
      const result = await this.getProcessedPharmacokinetics(drugInfo);

      if (result.success && result.data) {
        return {
          pharmacokinetics: result.data,
        };
      }

      return {};
    } catch (error) {
      console.error(
        "Error al obtener la farmacocinética del medicamento:",
        error,
      );

      return {};
    }
  }
}
