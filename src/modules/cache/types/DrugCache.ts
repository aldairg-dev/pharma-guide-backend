export interface UserDrugCache {
  userId: number;
  drugId: number;
  contraindications?: {
    info: string[];
  };
  lastUpdated: Date;
  expiresAt: Date;
}

export type DrugInfoType = "contraindications";
