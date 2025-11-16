import {
  GeminiAIUtils,
  DrugInfo,
  IAResponse,
} from "../geminiAI/geminiAI.utils";

export abstract class DrugModel {
  protected static validateDrugInfo(drugInfo: DrugInfo): boolean {
    return GeminiAIUtils.validateDrugInfo(drugInfo);
  }

  protected static generatePrompt(
    moduleName: string,
    drugInfo: DrugInfo
  ): string {
    return GeminiAIUtils.generatePrompt(moduleName, drugInfo);
  }

  protected static async processIAResponse<T>(
    text: string,
    validator: (data: any) => boolean,
    processor: (data: any) => T,
    notFoundMessage: string
  ): Promise<IAResponse<T>> {
    return GeminiAIUtils.processIAResponse(
      text,
      validator,
      processor,
      notFoundMessage
    );
  }

  protected static async getProcessedContent<T>(
    moduleName: string,
    drugInfo: DrugInfo,
    validator: (data: any) => boolean,
    processor: (data: any) => T,
    notFoundMessage: string
  ): Promise<IAResponse<T>> {
    const prompt = this.generatePrompt(moduleName, drugInfo);
    const text = await GeminiAIUtils.generateContent(prompt);

    return this.processIAResponse(text, validator, processor, notFoundMessage);
  }

  protected static createValidationResponse<T>(
    success: boolean,
    data: T | null,
    message: string
  ): { success: boolean; data: T | null; message: string } {
    return { success, data, message };
  }
}
