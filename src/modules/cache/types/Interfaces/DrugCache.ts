export interface interfaceDrugCache {
  userId: number;
  drugId: number;
  contraindications?: {
    structured: {
      absolutas: string[];
      relativas: string[];
    };
  };

  therapeuticClass?: {
    structured: {
      clase_principal: string;
      subclases: string[];
      codigo_atc?: string;
      indicaciones_principales: string[];
    };
  };

  dosages?: {
    structured: {
      poblaciones_especiales: [];
      indicaciones: [];
      ajustes_funcionales: [];
      dosis_maxima_diaria?: string;
      interacciones_relevantes: [];
    };
  };

  indications?: {
    structured: {
      indicaciones_principales: [];
      indicaciones_secundaria: [];
      otras_indicaciones: [];
    };
  };

  mechanismOfActions?: {
    structured: {
      clasificacion_farmacologica: string;
      diana_molecular_primaria: string;
      modo_de_accion: string;
      impacto_bioquimico: string;
      efectos_terapeuticos_finales: string;
    };
  };

  pharmacokinetics?: {
    structured: {
      absorcion: string[];
      distribucion: string[];
      metabolismo: string[];
      eliminacion: [];
      otro_datos: string[];
    };
  };
}

export type DrugInfoType =
  | "contraindications"
  | "therapeuticClass"
  | "dosages"
  | "indications"
  | "mechanismOfActions"
  | "pharmacokinetics";
