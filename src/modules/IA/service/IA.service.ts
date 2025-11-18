import { ContraindicationsModel } from "../utils/models/contraindications.model";
import { TherapeuticClassModel } from "../utils/models/therapeuticClass.model";
import {
  ContraindicationResponse,
  FormattedContraindicationResponse,
} from "../types/contraindications.types";
import {
  TherapeuticClassResponse,
  FormattedTherapeuticClassResponse,
} from "../types/therapeuticClass.types";
import { DrugInfo } from "../utils/geminiAI/geminiAI.utils";
class IAService {
  async getValidatedContraindications(
    drugInfo: DrugInfo
  ): Promise<ContraindicationResponse> {
    return ContraindicationsModel.getValidatedContraindications(drugInfo);
  }

  async getFormattedContraindications(
    drugInfo: DrugInfo
  ): Promise<FormattedContraindicationResponse> {
    return ContraindicationsModel.getFormattedContraindications(drugInfo);
  }

  async getValidatedTherapeuticClass(
    drugInfo: DrugInfo
  ): Promise<TherapeuticClassResponse> {
    return TherapeuticClassModel.getValidatedTherapeuticClass(drugInfo);
  }

  async getFormattedTherapeuticClass(
    drugInfo: DrugInfo
  ): Promise<FormattedTherapeuticClassResponse> {
    return TherapeuticClassModel.getFormattedTherapeuticClass(drugInfo);
  }
}

export default new IAService();
