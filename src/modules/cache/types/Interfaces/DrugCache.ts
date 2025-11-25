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
      indicaciones_Secundaria: [];
      otras_indicaciones: [];
    };
  };
}

export type DrugInfoType =
  | "contraindications"
  | "therapeuticClass"
  | "dosages"
  | "indications";
