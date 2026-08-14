import { PharmacokineticsResponse } from "../../types/pharmacokinetics";
import { DrugInfo } from "../geminiAI/geminiAI.utils";

export abstract class PharmacokineticsModel {
  async getValidatedPharmacokinetics(
    drugInfo: DrugInfo,
  ): Promise<PharmacokineticsResponse> {
    try {
      const response = await this.getPharmacokinetics(drugInfo);

      if (!response.pharmacokinetics?.structured) {
        throw new Error(
          "La respuesta no contiene información de farmacocinética válida",
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Error al obtener la farmacocinética del medicamento:",
        error,
      );

      return {};
    }
  }

  protected abstract getPharmacokinetics(
    drugInfo: DrugInfo,
  ): Promise<PharmacokineticsResponse>;
}
