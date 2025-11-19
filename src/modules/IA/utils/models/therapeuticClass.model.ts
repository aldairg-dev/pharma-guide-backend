import { DrugModel } from "./drug.model";
import { DrugInfo, GeminiAIUtils } from "../geminiAI/geminiAI.utils";
import {
  TherapeuticClassData,
  TherapeuticClassResponse,
  FormattedTherapeuticClassResponse,
} from "../../types/therapeuticClass.types";

export class TherapeuticClassModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data.clase_principal &&
      data.subclases &&
      data.indicaciones_principales &&
      typeof data.clase_principal === "string" &&
      Array.isArray(data.subclases) &&
      Array.isArray(data.indicaciones_principales)
    );
  }

  static processData(data: any): TherapeuticClassData {
    const therapeuticClassData: TherapeuticClassData = {
      clase_principal: data.clase_principal.trim(),
      subclases: data.subclases.filter(
        (item: any) => typeof item === "string" && item.trim().length > 0
      ),
      codigo_atc: data.codigo_atc ? data.codigo_atc.trim() : undefined,
      indicaciones_principales: data.indicaciones_principales.filter(
        (item: any) => typeof item === "string" && item.trim().length > 0
      ),
    };

    if (
      !therapeuticClassData.clase_principal ||
      therapeuticClassData.subclases.length === 0 ||
      therapeuticClassData.indicaciones_principales.length === 0
    ) {
      throw new Error("No se encontraron datos válidos de clase terapéutica");
    }

    const allContent = [
      therapeuticClassData.clase_principal,
      therapeuticClassData.codigo_atc || "",
      ...therapeuticClassData.subclases,
      ...therapeuticClassData.indicaciones_principales,
    ].join(" ");

    if (GeminiAIUtils.hasUndesiredContent(allContent)) {
      throw new Error(
        "Respuesta contiene contenido no deseado del servicio de IA"
      );
    }

    return therapeuticClassData;
  }

  static formatForDisplay(therapeuticClass: TherapeuticClassData): string {
    let formatted = "";

    formatted += `CLASE TERAPÉUTICA PRINCIPAL: ${therapeuticClass.clase_principal}\n\n`;

    if (therapeuticClass.codigo_atc) {
      formatted += `CÓDIGO ATC: ${therapeuticClass.codigo_atc}\n\n`;
    }

    if (therapeuticClass.subclases.length > 0) {
      formatted += "SUBCLASES TERAPÉUTICAS:\n";
      therapeuticClass.subclases.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
      formatted += "\n";
    }

    if (therapeuticClass.indicaciones_principales.length > 0) {
      formatted += "INDICACIONES PRINCIPALES:\n";
      therapeuticClass.indicaciones_principales.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
    }

    return formatted.trim();
  }

  static async getProcessedTherapeuticClass(drugInfo: DrugInfo) {
    return this.getProcessedContent(
      "drug.classTherapeutic",
      drugInfo,
      this.validateStructure,
      this.processData,
      "No se encontró información de clase terapéutica para este medicamento"
    );
  }

  static async getValidatedTherapeuticClass(
    drugInfo: DrugInfo
  ): Promise<TherapeuticClassResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {
        success: false,
        therapeuticClass: null,
        message: "Información del medicamento incompleta",
      };
    }

    try {
      const result = await this.getProcessedTherapeuticClass(drugInfo);
      return {
        success: result.success,
        therapeuticClass: result.data,
        message: result.message,
      };
    } catch (error) {
      console.error("Error al obtener clase terapéutica:", error);
      return {
        success: false,
        therapeuticClass: null,
        message: "Error interno al procesar la solicitud",
      };
    }
  }

  static async getFormattedTherapeuticClass(
    drugInfo: DrugInfo
  ): Promise<FormattedTherapeuticClassResponse> {
    const result = await this.getValidatedTherapeuticClass(drugInfo);

    if (!result.success || !result.therapeuticClass) {
      return {
        success: result.success,
        therapeuticClass: null,
        structuredData: null,
        message: result.message,
      };
    }

    const formatted = this.formatForDisplay(result.therapeuticClass);

    return {
      success: true,
      therapeuticClass: formatted,
      structuredData: result.therapeuticClass,
      message: result.message,
    };
  }
}
