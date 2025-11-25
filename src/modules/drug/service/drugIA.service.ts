import { DrugService } from "./drug.service";
import IAService from "../../IA/service/IA.service";
import { DosageResponse } from "../../IA/types/dosage.types";

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
}

interface TherapeuticClassData {
  clase_principal: string;
  subclases: string[];
  codigo_atc?: string;
  indicaciones_principales: string[];
}

export interface DrugTherapeuticClassResponse {
  id: number;
  therapeuticClass: {
    content: string;
    structured: TherapeuticClassData;
  };
}

export interface DosageClassResponse {
  dosage: any;
}

interface IndicationData {
  indicaciones_principales: string[];
  indicaciones_secundaria: string[];
  otras_indicaciones: string[];
}

export interface IndicationsResponse {
  id: number;
  indications: {
    content: string;
    structured: IndicationData;
  };
}

export class DrugIAService {
  private drugService = new DrugService();

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let maxRetries = 3;
    let delay = 500;
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
      const dataDrug = await this.retryOperation(() =>
        this.drugService.getDrugById(drugId)
      );

      if (!dataDrug || dataDrug == null) {
        throw new Error("Failed to retrieve drug data.");
      }

      const drugInfo = {
        id: dataDrug.id,
        name_generic: dataDrug.name_generic,
        brand_name: dataDrug.brand_name,
        tags: dataDrug.tags || "",
      };

      const result = await this.retryOperation(() =>
        IAService.getValidatedContraindications(drugInfo)
      );

      if (result && result.contraindications) {
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

  private formatTherapeuticClass(
    therapeuticClass: TherapeuticClassData
  ): string {
    let formatted = "";

    formatted += `CLASE TERAPÉUTICA PRINCIPAL: ${therapeuticClass.clase_principal}\n\n`;

    if (therapeuticClass.codigo_atc) {
      formatted += `CÓDIGO ATC: ${therapeuticClass.codigo_atc}\n\n`;
    }

    if (therapeuticClass.subclases && therapeuticClass.subclases.length > 0) {
      formatted += "SUBCLASES TERAPÉUTICAS:\n\n";
      therapeuticClass.subclases.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    if (
      therapeuticClass.indicaciones_principales &&
      therapeuticClass.indicaciones_principales.length > 0
    ) {
      formatted += "INDICACIONES PRINCIPALES:\n\n";
      therapeuticClass.indicaciones_principales.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    return formatted.trim();
  }

  private formatIndications(indications: IndicationData): string {
    let formatted = "";

    if (indications.indicaciones_principales && indications.indicaciones_principales.length > 0) {
      formatted += "INDICACIONES PRINCIPALES:\n\n";
      indications.indicaciones_principales.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    if (indications.indicaciones_secundaria && indications.indicaciones_secundaria.length > 0) {
      if (formatted.length > 0) {
        formatted += "\n";
      }
      formatted += "INDICACIONES SECUNDARIAS:\n\n";
      indications.indicaciones_secundaria.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    if (indications.otras_indicaciones && indications.otras_indicaciones.length > 0) {
      if (formatted.length > 0) {
        formatted += "\n";
      }
      formatted += "OTRAS INDICACIONES (Off-label):\n\n";
      indications.otras_indicaciones.forEach((item, index) => {
        formatted += `${index + 1}. ${item}\n\n`;
      });
    }

    return formatted.trim();
  }

  async therapeuticClass(
    drugId: number
  ): Promise<DrugTherapeuticClassResponse | null> {
    try {
      const dataDrug = await this.retryOperation(() =>
        this.drugService.getDrugById(drugId)
      );

      if (!dataDrug || dataDrug == null) {
        throw new Error("Failed to retrieve drug data.");
      }

      const drugInfo = {
        id: dataDrug.id,
        name_generic: dataDrug.name_generic,
        brand_name: dataDrug.brand_name,
        tags: dataDrug.tags || "",
      };

      const result = await this.retryOperation(() =>
        IAService.getValidatedTherapeuticClass(drugInfo)
      );

      if (result && result.therapeuticClass) {
        const formattedContent = this.formatTherapeuticClass(
          result.therapeuticClass
        );

        return {
          id: Number(dataDrug.id),
          therapeuticClass: {
            content: formattedContent,
            structured: result.therapeuticClass,
          },
        };
      }

      return null;
    } catch (error) {
      console.log("[DrugIA.service] Errror en Therapeutic Class: ", error);
      return null;
    }
  }

  async dosage(drugId: number): Promise<DosageClassResponse | null> {
    try {
      const dataDrug = await this.retryOperation(() =>
        this.drugService.getDrugById(drugId)
      );

      if (!dataDrug || dataDrug === null) {
        throw new Error("Failed to retrieve drug data.");
      }

      const drugInfo = {
        id: dataDrug.id,
        name_generic: dataDrug.name_generic,
        brand_name: dataDrug.brand_name,
        tags: dataDrug.tags || "",
      };

      const result = await this.retryOperation(() =>
        IAService.getValidatedDosage(drugInfo)
      );

      if (!result) {
        throw new Error("Failed to get validated dosage from IA service");
      }

      if (result && result.dosage) {
        return {
          dosage: result.dosage,
        };
      }

      return null;
    } catch (error) {
      console.log(
        `[drugIAservice] Error al obtener las dosificación, ${error}`
      );
      return null;
    }
  }

  async indications(drugId: number): Promise<IndicationsResponse | null> {
    try {
      const dataDrug = await this.retryOperation(() =>
        this.drugService.getDrugById(drugId)
      );

      if (!dataDrug || dataDrug === null) {
        throw new Error("Failed to retrieve drug data.");
      }

      const drugInfo = {
        id: dataDrug.id,
        name_generic: dataDrug.name_generic,
        brand_name: dataDrug.brand_name,
        tags: dataDrug.tags || "",
      };

      const result = await this.retryOperation(() =>
        IAService.getValidatedIndications(drugInfo)
      );

      if (!result) {
        throw new Error("Failed to get validated indications from IA service");
      }

      if (result && result.indications) {
        const formattedContent = this.formatIndications(result.indications.structured);

        return {
          id: Number(dataDrug.id),
          indications: {
            content: formattedContent,
            structured: result.indications.structured,
          },
        };
      }

      return null;
    } catch (error) {
      console.log(`[drugIAService] Error en las indicaciones ${error}`);
      return null;
    }
  }
}
