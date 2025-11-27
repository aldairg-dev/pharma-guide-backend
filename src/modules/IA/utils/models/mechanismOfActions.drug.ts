import { DrugModel } from "./drug.model";
import { DrugInfo, GeminiAIUtils } from "../geminiAI/geminiAI.utils";
import {
  MechanismOfActionResponse,
  FormattedMechanismOfActionResponse,
  MechanismOfActionData,
} from "../../types/mechanismOfActions";

export class MechanismOfActionsModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data &&
      typeof data === "object" &&
      data.structured &&
      typeof data.structured === "object" &&
      typeof data.structured.clasificacion_farmacologica === "string" &&
      typeof data.structured.diana_molecular_primaria === "string" &&
      typeof data.structured.modo_de_accion === "string" &&
      typeof data.structured.impacto_bioquimico === "string" &&
      typeof data.structured.efectos_terapeuticos_finales === "string"
    );
  }

  static processData(data: any): { structured: MechanismOfActionData } {
    return {
      structured: {
        clasificacion_farmacologica:
          data.structured?.clasificacion_farmacologica || "",
        diana_molecular_primaria:
          data.structured?.diana_molecular_primaria || "",
        modo_de_accion: data.structured?.modo_de_accion || "",
        impacto_bioquimico: data.structured?.impacto_bioquimico || "",
        efectos_terapeuticos_finales:
          data.structured?.efectos_terapeuticos_finales || "",
      },
    };
  }

  static async getProcessedMechanismOfActions(drugInfo: DrugInfo) {
    return this.getProcessedContent(
      "drug.mechanismOfActions",
      drugInfo,
      this.validateStructure,
      this.processData,
      "No se encontró información del mecanismo de acción para este medicamento o el medicamento no existe"
    );
  }

  static async getValidatedMechanismOfActions(
    drugInfo: DrugInfo
  ): Promise<MechanismOfActionResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {};
    }

    try {
      const result = await this.getProcessedMechanismOfActions(drugInfo);
      if (result.success && result.data) {
        return {
          mechanismOfActions: result.data,
        };
      }
      return {};
    } catch (error) {
      console.error("Error al obtener mecanismo de acción:", error);
      return {};
    }
  }

  static async getFormattedMechanismOfActions(
    drugInfo: DrugInfo
  ): Promise<FormattedMechanismOfActionResponse> {
    const result = await this.getValidatedMechanismOfActions(drugInfo);

    if (!result.mechanismOfActions) {
      return {
        mechanismOfActions: {
          structured: {
            clasificacion_farmacologica: "",
            diana_molecular_primaria: "",
            modo_de_accion: "",
            impacto_bioquimico: "",
            efectos_terapeuticos_finales: "",
          },
        },
      };
    }

    return {
      mechanismOfActions: result.mechanismOfActions,
    };
  }
}
