import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

interface DrugInfo {
  name_generic: string;
  brand_name: string;
  mechanism_of_action: string;
  therapeutic_class: string;
  tags: string;
}

interface ContraindicationData {
  absolutas: string[];
  relativas: string[];
}

interface ContraindicationResponse {
  success: boolean;
  contraindications: ContraindicationData | null;
  message?: string;
}

class IAService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.Api_key_gemini;
    if (!apiKey) {
      throw new Error(
        "Api_key_gemini no está configurada en las variables de entorno"
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Obtiene las contraindicaciones de un medicamento usando Gemini AI
   * @param drugInfo Información del medicamento
   * @returns Promise<ContraindicationResponse>
   */
  async getDrugContraindications(
    drugInfo: DrugInfo
  ): Promise<ContraindicationResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
Eres un farmacólogo clínico especializado en seguridad farmacológica. Analiza la información del medicamento y proporciona contraindicaciones clínicamente relevantes para profesionales de la salud.

INFORMACIÓN DEL FÁRMACO:
- Principio activo: ${drugInfo.name_generic}
- Marca comercial: ${drugInfo.brand_name}
- Mecanismo de acción: ${drugInfo.mechanism_of_action}
- Clase terapéutica: ${drugInfo.therapeutic_class}
- Características: ${drugInfo.tags}

DIRECTRICES CLÍNICAS:
1. Identifica el fármaco por principio activo y mecanismo
2. Proporciona contraindicaciones basadas en evidencia científica
3. Incluye parámetros clínicos específicos cuando sea relevante
4. Responde "NOT_FOUND" solo si no hay información útil

FORMATO OBLIGATORIO (usa JSON válido):
{
  "absolutas": [
    "Contraindicación específica con criterio clínico"
  ],
  "relativas": [
    "Precaución con parámetro clínico específico"
  ]
}

REQUISITOS:
- Cada contraindicación debe ser específica y accionable
- Incluye valores de referencia cuando aplique (ej: TFG <30 mL/min/1.73m²)
- Menciona interacciones farmacológicas críticas
- Usa terminología médica estándar
- Máximo 6 contraindicaciones por categoría para mantener relevancia clínica

Respuesta en JSON:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      if (
        text === "NOT_FOUND" ||
        text.toLowerCase().includes("not found") ||
        text.toLowerCase().includes("no se encontró") ||
        text.toLowerCase().includes("no tengo información") ||
        text.toLowerCase().includes("no puedo proporcionar") ||
        text.toLowerCase().includes("información no disponible") ||
        text.length < 20
      ) {
        return {
          success: false,
          contraindications: null,
          message:
            "No se encontraron contraindicaciones para este medicamento o el medicamento no existe",
        };
      }

      let contraindicationData: ContraindicationData;
      try {
        let cleanedText = text.trim();

        const jsonStart = cleanedText.indexOf("{");
        const jsonEnd = cleanedText.lastIndexOf("}") + 1;

        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No se encontró formato JSON válido");
        }

        const jsonText = cleanedText.substring(jsonStart, jsonEnd);
        const parsedData = JSON.parse(jsonText);

        if (
          !parsedData.absolutas ||
          !parsedData.relativas ||
          !Array.isArray(parsedData.absolutas) ||
          !Array.isArray(parsedData.relativas)
        ) {
          throw new Error("Estructura JSON inválida");
        }

        contraindicationData = {
          absolutas: parsedData.absolutas.filter(
            (item: any) => typeof item === "string" && item.trim().length > 0
          ),
          relativas: parsedData.relativas.filter(
            (item: any) => typeof item === "string" && item.trim().length > 0
          ),
        };

        if (
          contraindicationData.absolutas.length === 0 &&
          contraindicationData.relativas.length === 0
        ) {
          throw new Error("No se encontraron contraindicaciones válidas");
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return {
          success: false,
          contraindications: null,
          message: "Formato de respuesta no válido del servicio de IA",
        };
      }

      const allContent = [
        ...contraindicationData.absolutas,
        ...contraindicationData.relativas,
      ]
        .join(" ")
        .toLowerCase();

      const undesiredPhrases = [
        "hola",
        "claro que sí",
        "por supuesto",
        "con gusto",
        "aquí tienes",
        "espero que",
        "si necesitas",
        "cualquier duda",
        "como farmacólogo",
        "mi recomendación",
      ];

      const hasUndesiredContent = undesiredPhrases.some((phrase) =>
        allContent.includes(phrase.toLowerCase())
      );

      if (hasUndesiredContent) {
        return {
          success: false,
          contraindications: null,
          message: "Respuesta contiene contenido no deseado del servicio de IA",
        };
      }

      return {
        success: true,
        contraindications: contraindicationData,
        message: "Contraindicaciones obtenidas exitosamente",
      };
    } catch (error) {
      console.error("Error al obtener contraindicaciones:", error);
      return {
        success: false,
        contraindications: null,
        message: "Error interno al procesar la solicitud",
      };
    }
  }

  /**
   * Valida la información del medicamento antes de procesar
   * @param drugInfo Información del medicamento
   * @returns boolean
   */
  private validateDrugInfo(drugInfo: DrugInfo): boolean {
    return !!(
      drugInfo.name_generic?.trim() &&
      drugInfo.brand_name?.trim() &&
      drugInfo.mechanism_of_action?.trim() &&
      drugInfo.therapeutic_class?.trim()
    );
  }

  /**
   * Obtiene contraindicaciones con validación previa
   * @param drugInfo Información del medicamento
   * @returns Promise<ContraindicationResponse>
   */
  async getValidatedContraindications(
    drugInfo: DrugInfo
  ): Promise<ContraindicationResponse> {
    if (!this.validateDrugInfo(drugInfo)) {
      return {
        success: false,
        contraindications: null,
        message: "Información del medicamento incompleta",
      };
    }

    return this.getDrugContraindications(drugInfo);
  }

  /**
   * Formatea las contraindicaciones para una visualización más legible
   * @param contraindications Datos de contraindicaciones
   * @returns string formateado para mostrar
   */
  formatContraindicationsForDisplay(
    contraindications: ContraindicationData
  ): string {
    let formatted = "";

    if (contraindications.absolutas.length > 0) {
      formatted += "CONTRAINDICACIONES ABSOLUTAS:\n";
      contraindications.absolutas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
      formatted += "\n";
    }

    if (contraindications.relativas.length > 0) {
      formatted += "CONTRAINDICACIONES RELATIVAS (Precauciones Especiales):\n";
      contraindications.relativas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n`;
      });
    }

    return formatted.trim();
  }

  /**
   * Obtiene contraindicaciones formateadas para visualización
   * @param drugInfo Información del medicamento
   * @returns Promise con contraindicaciones formateadas como string
   */
  async getFormattedContraindications(drugInfo: DrugInfo): Promise<{
    success: boolean;
    contraindications: string | null;
    structuredData?: ContraindicationData | null;
    message?: string;
  }> {
    const result = await this.getValidatedContraindications(drugInfo);

    if (!result.success || !result.contraindications) {
      return {
        success: result.success,
        contraindications: null,
        structuredData: null,
        message: result.message,
      };
    }

    const formatted = this.formatContraindicationsForDisplay(
      result.contraindications
    );

    return {
      success: true,
      contraindications: formatted,
      structuredData: result.contraindications,
      message: result.message,
    };
  }
}

export default new IAService();
