import { DrugModel } from "./drug.model";
import { DrugInfo, GeminiAIUtils } from "../geminiAI/geminiAI.utils";
import {
  ContraindicationData,
  ContraindicationResponse,
  FormattedContraindicationResponse,
} from "../../types/contraindications.types";

export class ContraindicationsModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data.absolutas &&
      data.relativas &&
      Array.isArray(data.absolutas) &&
      Array.isArray(data.relativas)
    );
  }

  static processData(data: any): ContraindicationData {
    const contraindicationData: ContraindicationData = {
      absolutas: data.absolutas.filter(
        (item: any) => typeof item === "string" && item.trim().length > 0
      ),
      relativas: data.relativas.filter(
        (item: any) => typeof item === "string" && item.trim().length > 0
      ),
    };

    if (
      contraindicationData.absolutas.length === 0 &&
      contraindicationData.relativas.length === 0
    ) {
      throw new Error("No se encontraron contraindicaciones válidas");
    }

    const allContent = [
      ...contraindicationData.absolutas,
      ...contraindicationData.relativas,
    ].join(" ");

    if (GeminiAIUtils.hasUndesiredContent(allContent)) {
      throw new Error(
        "Respuesta contiene contenido no deseado del servicio de IA"
      );
    }

    return contraindicationData;
  }

  static formatForDisplay(contraindications: ContraindicationData): string {
    let formatted = "";

    if (contraindications.absolutas.length > 0) {
      formatted += "CONTRAINDICACIONES ABSOLUTAS:\n";
      contraindications.absolutas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
      formatted += "\n";
    }

    if (contraindications.relativas.length > 0) {
      formatted += "CONTRAINDICACIONES RELATIVAS (Precauciones Especiales):\n";
      contraindications.relativas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
    }

    return formatted.trim();
  }

  static async getProcessedContraindications(drugInfo: DrugInfo) {
    return this.getProcessedContent(
      "drug.contraindications",
      drugInfo,
      this.validateStructure,
      this.processData,
      "No se encontraron contraindicaciones para este medicamento o el medicamento no existe"
    );
  }

  static async getValidatedContraindications(
    drugInfo: DrugInfo
  ): Promise<ContraindicationResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {
        success: false,
        contraindications: null,
        message: "Información del medicamento incompleta",
      };
    }

    try {
      const result = await this.getProcessedContraindications(drugInfo);
      return {
        success: result.success,
        contraindications: result.data,
        message: result.message,
      };
    } catch (error) {
      console.error("Error al obtener contraindicaciones:", error);
      return {
        success: false,
        contraindications: null,
        message: "Error interno al procesar la solicitud",
      };
    }
  }

  static async getFormattedContraindications(
    drugInfo: DrugInfo
  ): Promise<FormattedContraindicationResponse> {
    const result = await this.getValidatedContraindications(drugInfo);

    if (!result.success || !result.contraindications) {
      return {
        success: result.success,
        contraindications: null,
        structuredData: null,
        message: result.message,
      };
    }

    const formatted = this.formatForDisplay(result.contraindications);

    return {
      success: true,
      contraindications: formatted,
      structuredData: result.contraindications,
      message: result.message,
    };
  }
}
