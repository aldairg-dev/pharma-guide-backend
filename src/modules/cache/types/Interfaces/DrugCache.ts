export interface interfaceDrugCache {
  userId: number;
  drugId: number;
  contraindications?: {
    content: string;
    structured: {
      absolutas: string[];
      relativas: string[];
    };
  };

  therapeuticClass?: {
    content: string;
    structured: {
      clase_principal: string;
      subclases: string[];
      codigo_atc?: string;
      indicaciones_principales: string[];
    };
  };

  dosages?: {
    content: string;
    structured: {
      poblaciones_especiales: [];
      indicaciones: [];
      ajustes_funcionales: [];
      dosis_maxima_diaria?: string;
      interacciones_relevantes: [];
    };
  };

  indications?: {
    content: string;
    strutured: {
      indicaciones_principales: [];
      indicaciones_secundaria: [];
      otras_indicaciones: [];
    };
  };

  mechanismOfActions?: {
    content: string;
    structured: {
      clasificacion_farmacologica: string;
      diana_molecular_primaria: string;
      modo_de_accion: string;
      impacto_bioquimico: string;
      efectos_terapeuticos_finales: string;
    };
  };
}

export type DrugInfoType =
  | "contraindications"
  | "therapeuticClass"
  | "dosages"
  | "indications"
  | "mechanismOfActions";
