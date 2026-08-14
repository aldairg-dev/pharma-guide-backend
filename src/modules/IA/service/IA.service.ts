import { ContraindicationsModel } from "../utils/models/contraindications.model";
import { TherapeuticClassModel } from "../utils/models/therapeuticClass.model";
import { ContraindicationResponse } from "../types/contraindications.types";
import { TherapeuticClassResponse } from "../types/therapeuticClass.types";
import { DrugInfo } from "../utils/geminiAI/geminiAI.utils";
import { DosageResponse } from "../types/dosage.types";
import { dosageModel } from "../utils/models/dosage.model";
import { IndicationResponse } from "../types/indications.types";
import { IndicationsModel } from "../utils/models/indications.model";
import { MechanismOfActionResponse } from "../types/mechanismOfActions";
import { MechanismOfActionsModel } from "../utils/models/mechanismOfActions.drug";
import { PharmacokineticsResponse } from "../types/pharmacokinetics";
import { PharmacokineticsModel } from "../utils/models/pharmacokinetics.model";
class IAService {
  async getValidatedContraindications(
    drugInfo: DrugInfo
  ): Promise<ContraindicationResponse> {
    return ContraindicationsModel.getValidatedContraindications(drugInfo);
  }

  async getValidatedTherapeuticClass(
    drugInfo: DrugInfo
  ): Promise<TherapeuticClassResponse> {
    return TherapeuticClassModel.getValidatedTherapeuticClass(drugInfo);
  }

  async getValidatedDosage(drugInfo: DrugInfo): Promise<DosageResponse> {
    return dosageModel.getValidatedDosage(drugInfo);
  }

  async getValidatedIndications(
    drugInfo: DrugInfo
  ): Promise<IndicationResponse> {
    return IndicationsModel.getValidatedIndications(drugInfo);
  }

  async getValidatedMechanismOfActions(
    drugInfo: DrugInfo
  ): Promise<MechanismOfActionResponse> {
    return MechanismOfActionsModel.getValidatedMechanismOfActions(drugInfo);
  }

  async getValidatedPharmacokinetics(
    DrugInfo: DrugInfo
  ): Promise<PharmacokineticsResponse> {
    return PharmacokineticsModel.getValidatedPharmacokinetics(drugInfo);
  }
}

export default new IAService();
