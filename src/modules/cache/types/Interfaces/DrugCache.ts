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
}

export type DrugInfoType = "contraindications" | "therapeuticClass" | "dosages";
