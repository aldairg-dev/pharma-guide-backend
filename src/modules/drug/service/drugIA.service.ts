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
    structured: IndicationData;
  };
}

interface MechanismOfActionData {
  clasificacion_farmacologica: string;
  diana_molecular_primaria: string;
  modo_de_accion: string;
  impacto_bioquimico: string;
  efectos_terapeuticos_finales: string;
}

export interface MechanismOfActionsResponse {
  id: number;
  mechanismOfActions: {
    structured: MechanismOfActionData;
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
        return {
          id: Number(dataDrug.id),
          contraindications: {
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
        return {
          id: Number(dataDrug.id),
          therapeuticClass: {
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
        return {
          id: Number(dataDrug.id),
          indications: {
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

  async mechanismOfActions(
    drugId: number
  ): Promise<MechanismOfActionsResponse | null> {
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
        IAService.getValidatedMechanismOfActions(drugInfo)
      );

      if (!result) {
        throw new Error(
          "Failed to get validated mechanism of actions from IA service"
        );
      }

      if (result && result.mechanismOfActions) {
        return {
          id: Number(dataDrug.id),
          mechanismOfActions: {
            structured: result.mechanismOfActions.structured,
          },
        };
      }

      return null;
    } catch (error) {
      console.log(`[drugIAService] Error en mecanismo de acción ${error}`);
      return null;
    }
  }
}
