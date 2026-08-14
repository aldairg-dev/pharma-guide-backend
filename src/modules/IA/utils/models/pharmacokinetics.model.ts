import { PharmacokineticsResponse } from "../../types/pharmacokinetics";
import { DrugInfo } from "../geminiAI/geminiAI.utils";

export abstract class PharmacokineticsModel {
  async getValidatedPharmacokinetics(
    drugInfo: DrugInfo
  ): Promise<PharmacokineticsResponse> {
    try {
    } catch (error) {
      console.error("Error al obtener el pharmacokinetics de acción:", error);
      return {};
    }
  }
}
