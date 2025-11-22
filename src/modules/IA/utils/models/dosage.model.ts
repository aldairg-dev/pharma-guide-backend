import { DrugModel } from "./drug.model";
import { drugGeneralDosagePrompt } from "../prompts/dosage";
import { DosageResponse, FormattedDosageResponse, DosageData } from "../../types/dosage.types";
import { DrugInfo, GeminiAIUtils } from "../geminiAI/geminiAI.utils";

export class DosageModel extends DrugModel {
  static validateStructure(data: any): boolean {
    return !!(
      data.indicaciones &&
      Array.isArray(data.indicaciones) &&
      data.poblaciones_especiales &&
      data.ajustes_funcionales
    );
  }

  static processData(data: any): DosageData {
    const dosageData: DosageData = {
      indicaciones: Array.isArray(data.indicaciones) ? data.indicaciones : [],
      poblaciones_especiales: data.poblaciones_especiales || {},
      ajustes_funcionales: data.ajustes_funcionales || { renal: {}, hepatica: {} },
      dosis_maxima_diaria: data.dosis_maxima_diaria || undefined,
      contraindicaciones: Array.isArray(data.contraindicaciones) ? data.contraindicaciones : [],
      interacciones_relevantes: Array.isArray(data.interacciones_relevantes) ? data.interacciones_relevantes : []
    };

    if (dosageData.indicaciones.length === 0) {
      throw new Error("No se encontraron indicaciones válidas");
    }

    return dosageData;
  }

  static async getValidatedDosage(drugInfo: DrugInfo): Promise<DosageResponse> {
    try {
      const result = await this.getProcessedContent(
        "drug.dosage",
        drugInfo,
        this.validateStructure,
        this.processData,
        "No se encontró información de dosificación para este medicamento"
      );

      return {
        success: result.success,
        dosage: result.data,
        message: result.message
      };
    } catch (error: any) {
      console.error("Error getting validated dosage:", error);
      return {
        success: false,
        dosage: null,
        message: error.message || "Error processing dosage request"
      };
    }
  }

  static async getFormattedDosage(drugInfo: DrugInfo): Promise<FormattedDosageResponse> {
    try {
      const validatedResponse = await this.getValidatedDosage(drugInfo);
      
      if (!validatedResponse.success || !validatedResponse.dosage) {
        return {
          success: false,
          dosage: null,
          message: validatedResponse.message
        };
      }

      const formattedText = this.formatDosageText(validatedResponse.dosage);
      
      return {
        success: true,
        dosage: formattedText,
        structuredData: validatedResponse.dosage
      };
    } catch (error: any) {
      console.error("Error getting formatted dosage:", error);
      return {
        success: false,
        dosage: null,
        message: error.message || "Error processing dosage request"
      };
    }
  }

  private static formatDosageText(dosageData: DosageData): string {
    let formatted = "";
    
    // Indicaciones
    if (dosageData.indicaciones && dosageData.indicaciones.length > 0) {
      formatted += "## Indicaciones y Dosificación\n\n";
      dosageData.indicaciones.forEach(indication => {
        formatted += `**${indication.nombre}:**\n`;
        formatted += `- Dosis: ${indication.dosis_habitual}\n`;
        if (indication.dosis_mg_kg) {
          formatted += `- Dosis por peso: ${indication.dosis_mg_kg}\n`;
        }
        formatted += `- Frecuencia: ${indication.frecuencia}\n`;
        if (indication.duracion) {
          formatted += `- Duración: ${indication.duracion}\n`;
        }
        formatted += "\n";
      });
    }

    // Poblaciones especiales
    if (dosageData.poblaciones_especiales) {
      formatted += "## Poblaciones Especiales\n\n";
      const { pediatrica, geriatrica, embarazo_lactancia } = dosageData.poblaciones_especiales;
      if (pediatrica) formatted += `**Pediátrica:** ${pediatrica}\n\n`;
      if (geriatrica) formatted += `**Geriátrica:** ${geriatrica}\n\n`;
      if (embarazo_lactancia) formatted += `**Embarazo y Lactancia:** ${embarazo_lactancia}\n\n`;
    }

    // Ajustes funcionales
    if (dosageData.ajustes_funcionales) {
      formatted += "## Ajustes por Función Orgánica\n\n";
      
      const { renal, hepatica } = dosageData.ajustes_funcionales;
      
      if (renal && Object.values(renal).some(v => v)) {
        formatted += "**Función Renal:**\n";
        if (renal.leve) formatted += `- Insuficiencia leve: ${renal.leve}\n`;
        if (renal.moderada) formatted += `- Insuficiencia moderada: ${renal.moderada}\n`;
        if (renal.severa) formatted += `- Insuficiencia severa: ${renal.severa}\n`;
        if (renal.dialisis) formatted += `- Diálisis: ${renal.dialisis}\n`;
        formatted += "\n";
      }
      
      if (hepatica && Object.values(hepatica).some(v => v)) {
        formatted += "**Función Hepática:**\n";
        if (hepatica.child_pugh_A) formatted += `- Child-Pugh A: ${hepatica.child_pugh_A}\n`;
        if (hepatica.child_pugh_B) formatted += `- Child-Pugh B: ${hepatica.child_pugh_B}\n`;
        if (hepatica.child_pugh_C) formatted += `- Child-Pugh C: ${hepatica.child_pugh_C}\n`;
        formatted += "\n";
      }
    }

    // Dosis máxima
    if (dosageData.dosis_maxima_diaria) {
      formatted += `## Dosis Máxima Diaria\n\n${dosageData.dosis_maxima_diaria}\n\n`;
    }

    // Interacciones relevantes
    if (dosageData.interacciones_relevantes && dosageData.interacciones_relevantes.length > 0) {
      formatted += "## Interacciones Relevantes\n\n";
      dosageData.interacciones_relevantes.forEach(interaction => {
        formatted += `- ${interaction}\n`;
      });
    }

    return formatted;
  }
}

export const dosageModel = DosageModel;
