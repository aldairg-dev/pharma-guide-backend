import { DrugModel } from "./drug.model";
import { DrugInfo } from "../geminiAI/geminiAI.utils";
import {
  IndicationResponse,
  FormattedIndicationResponse,
  IndicationData,
} from "../../types/indications.types";

export class IndicationsModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data &&
      typeof data === "object" &&
      typeof data.content === "string" &&
      data.structured &&
      typeof data.structured === "object" &&
      Array.isArray(data.structured.indicaciones_principales) &&
      Array.isArray(data.structured.indicaciones_secundaria) &&
      Array.isArray(data.structured.otras_indicaciones)
    );
  }

  static processData(data: any): {
    content: string;
    structured: IndicationData;
  } {
    return {
      content: data.content || "",
      structured: {
        indicaciones_principales:
          data.structured?.indicaciones_principales?.filter(
            (item: any) => typeof item === "string" && item.trim().length > 0
          ) || [],
        indicaciones_secundaria:
          data.structured?.indicaciones_secundaria?.filter(
            (item: any) => typeof item === "string" && item.trim().length > 0
          ) || [],
        otras_indicaciones:
          data.structured?.otras_indicaciones?.filter(
            (item: any) => typeof item === "string" && item.trim().length > 0
          ) || [],
      },
    };
  }

  static async getProcessedIndications(drugInfo: DrugInfo) {
    return this.getProcessedContent(
      "drug.indications",
      drugInfo,
      this.validateStructure,
      this.processData,
      "No se encontraron indicaciones para este medicamento o el medicamento no existe"
    );
  }

  static async getValidatedIndications(
    drugInfo: DrugInfo
  ): Promise<IndicationResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {};
    }

    try {
      const result = await this.getProcessedIndications(drugInfo);
      if (result.success && result.data) {
        return {
          indications: result.data,
        };
      }
      return {};
    } catch (error) {
      console.error("Error al obtener indicaciones:", error);
      return {};
    }
  }

  static async getFormattedIndications(
    drugInfo: DrugInfo
  ): Promise<FormattedIndicationResponse> {
    const result = await this.getValidatedIndications(drugInfo);

    if (!result.indications) {
      return {
        indications: {
          content: "No se encontraron indicaciones para este medicamento.",
          structured: {
            indicaciones_principales: [],
            indicaciones_secundaria: [],
            otras_indicaciones: [],
          },
        },
      };
    }

    return {
      indications: result.indications,
    };
  }
}
