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
import { FormattedDosageResponse, DosageResponse } from "../types/dosage.types";
import { dosageModel } from "../utils/models/dosage.model";
import {
  IndicationResponse,
  FormattedIndicationResponse,
} from "../types/indications.types";
import { IndicationsModel } from "../utils/models/indications.model";
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

  async getValidatedDosage(drugInfo: DrugInfo): Promise<DosageResponse> {
    return dosageModel.getValidatedDosage(drugInfo);
  }

  async getFormattedDosage(
    drugInfo: DrugInfo
  ): Promise<FormattedDosageResponse> {
    return dosageModel.getFormattedDosage(drugInfo);
  }

  async getValidatedIndications(
    drugInfo: DrugInfo
  ): Promise<IndicationResponse> {
    return IndicationsModel.getValidatedIndications(drugInfo);
  }

  async getFormattedIndications(
    drugInfo: DrugInfo
  ): Promise<FormattedIndicationResponse> {
    return IndicationsModel.getFormattedIndications(drugInfo);
  }
}

export default new IAService();
