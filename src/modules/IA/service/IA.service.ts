import { ContraindicationsModel } from "../utils/models/contraindications.model";
import {
  ContraindicationResponse,
  FormattedContraindicationResponse,
} from "../types/contraindications.types";
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
}

export default new IAService();
