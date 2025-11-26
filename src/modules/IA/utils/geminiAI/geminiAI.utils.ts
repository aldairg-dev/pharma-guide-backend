import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Interfaces genéricas para respuestas de IA
export interface IAResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

export interface DrugInfo {
  name_generic: string;
  brand_name: string;
  tags: string;
}

export class GeminiAIUtils {
  private static genAI: GoogleGenerativeAI;

  private static initializeGenAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.Api_key_gemini;
      if (!apiKey) {
        throw new Error(
          "Api_key_gemini no está configurada en las variables de entorno"
        );
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  static getModel(modelName: string = "gemini-2.5-flash") {
    const genAI = this.initializeGenAI();
    return genAI.getGenerativeModel({ model: modelName });
  }

  static async generateContent(
    prompt: string,
    modelName: string = "gemini-2.5-flash"
  ): Promise<string> {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Error al generar contenido con Gemini:", error);
      throw new Error("Error interno al comunicarse con el servicio de IA");
    }
  }

  static isNotFoundResponse(text: string): boolean {
    const notFoundIndicators = [
      "NOT_FOUND",
      "not found",
      "no se encontró",
      "no tengo información",
      "no puedo proporcionar",
      "información no disponible",
    ];

    const lowerText = text.toLowerCase();
    return (
      text.length < 20 ||
      notFoundIndicators.some((indicator) => lowerText.includes(indicator))
    );
  }

  static extractAndParseJSON(text: string): any {
    let cleanedText = text.trim();

    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No se encontró formato JSON válido");
    }

    let jsonText = cleanedText.substring(jsonStart, jsonEnd);

    // Limpiar caracteres de control problemáticos
    jsonText = this.sanitizeJSON(jsonText);

    return JSON.parse(jsonText);
  }

  static sanitizeJSON(jsonText: string): string {
    try {
      // Primero intentar parsear directamente
      JSON.parse(jsonText);
      return jsonText;
    } catch (error) {
      console.warn("JSON inicial inválido, aplicando sanitización:", error);

      // Limpiar caracteres de control problemáticos
      let cleaned = jsonText
        // Remover caracteres de control no válidos en JSON
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        // Reemplazar saltos de línea literales con \\n escapado
        .replace(/\n/g, "\\n")
        // Reemplazar retornos de carro literales con \\r escapado
        .replace(/\r/g, "\\r")
        // Reemplazar tabulaciones literales con \\t escapado
        .replace(/\t/g, "\\t")
        // Remover espacios múltiples
        .replace(/\s+/g, " ")
        .trim();

      // Intentar reparar strings que contengan caracteres problemáticos
      // Buscar strings entre comillas y escapar caracteres especiales dentro
      cleaned = cleaned.replace(/"([^"]*?)"/g, (match, content) => {
        const escapedContent = content
          .replace(/\\/g, "\\\\") // Escapar backslashes
          .replace(/"/g, '\\"'); // Escapar comillas
        return `"${escapedContent}"`;
      });

      return cleaned;
    }
  }

  static hasUndesiredContent(content: string): boolean {
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

    const lowerContent = content.toLowerCase();
    return undesiredPhrases.some((phrase) =>
      lowerContent.includes(phrase.toLowerCase())
    );
  }

  static validateDrugInfo(drugInfo: DrugInfo): boolean {
    return !!(
      drugInfo.name_generic?.trim() &&
      drugInfo.brand_name?.trim() &&
      drugInfo.tags?.trim()
    );
  }

  static processIAResponse<T>(
    text: string,
    validator: (data: any) => boolean,
    dataProcessor: (data: any) => T,
    notFoundMessage: string = "No se encontró información válida"
  ): IAResponse<T> {
    if (this.isNotFoundResponse(text)) {
      return {
        success: false,
        data: null,
        message: notFoundMessage,
      };
    }

    try {
      const parsedData = this.extractAndParseJSON(text);

      if (!validator(parsedData)) {
        throw new Error("Estructura de datos inválida");
      }

      const processedData = dataProcessor(parsedData);

      return {
        success: true,
        data: processedData,
      };
    } catch (parseError) {
      console.error("Error processing IA response:", parseError);
      console.error(
        "Raw text that caused error (first 500 chars):",
        text.substring(0, 500)
      );

      return {
        success: false,
        data: null,
        message: `Formato de respuesta no válido del servicio de IA: ${parseError}`,
      };
    }
  }

  static generatePrompt(moduleName: string, drugInfo: DrugInfo): string {
    // Importación dinámica para evitar dependencia circular
    const PromptLoader = require("../loaderPrompt").default;

    const variables = {
      "drugInfo.name_generic": drugInfo.name_generic,
      "drugInfo.brand_name": drugInfo.brand_name,
      "drugInfo.tags": drugInfo.tags || "No especificadas",
    };

    return PromptLoader.loadAndGenerateFromModule(moduleName, variables);
  }
}
