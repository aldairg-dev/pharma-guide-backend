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
}

export type DrugInfoType = "contraindications";
