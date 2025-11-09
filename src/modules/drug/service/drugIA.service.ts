import { DrugService } from "./drug.service";
import IAService from "../../IA/service/IA.service";

interface ContraindicationData {
  absolutas: string[];
  relativas: string[];
}

export interface DrugContraindicationResponse {
  id: number;
  contraindications: {
    content: string;
    structured: ContraindicationData;
  };
  message?: string;
}

export class DrugIAService {
  private drugService = new DrugService();

  /**
   * Retry logic for database operations
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        console.warn(`Intento ${i + 1}/${maxRetries} falló:`, error.message);

        if (i === maxRetries - 1) {
          throw error;
        }

        if (error.code === "P5010" || error.message?.includes("fetch failed")) {
          console.warn(`Esperando ${delay}ms antes del siguiente intento...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached");
  }

  async DrugContradications(
    drugId: number
  ): Promise<DrugContraindicationResponse | null> {
    try {
      if (!drugId || typeof drugId !== "number") {
        throw new Error("Invalid Drug ID.");
      }

      const dataDrug = await this.retryOperation(
        () => this.drugService.getDrugById(drugId),
        3,
        500
      );

      if (!dataDrug || dataDrug == null) {
        throw new Error("Failed to retrieve drug data.");
      }

      const drugInfo = {
        id: dataDrug.id,
        name_generic: dataDrug.name_generic,
        brand_name: dataDrug.brand_name,
        mechanism_of_action: dataDrug.mechanism_of_action,
        therapeutic_class: dataDrug.therapeutic_class,
        tags: dataDrug.tags || "",
      };

      const result = await this.retryOperation(
        () =>
          Promise.race([
            IAService.getValidatedContraindications(drugInfo),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("IA service timeout")), 30000)
            ),
          ]) as Promise<any>,
        2,
        2000
      );

      if (result.success && result.contraindications) {
        const formattedContent = this.formatContraindications(
          result.contraindications
        );

        return {
          id: Number(dataDrug.id),
          contraindications: {
            content: formattedContent,
            structured: result.contraindications,
          },
        };
      }

      return null;
    } catch (error) {
      console.error("Error en DrugContradications:", error);
      return null;
    }
  }

  private formatContraindications(
    contraindications: ContraindicationData
  ): string {
    let formatted = "";

    if (contraindications.absolutas && contraindications.absolutas.length > 0) {
      formatted += "CONTRAINDICACIONES ABSOLUTAS:\n\n";
      contraindications.absolutas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    if (contraindications.relativas && contraindications.relativas.length > 0) {
      if (formatted.length > 0) {
        formatted += "\n";
      }
      formatted +=
        "CONTRAINDICACIONES RELATIVAS (Precauciones Especiales):\n\n";
      contraindications.relativas.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    return formatted.trim();
  }
}
