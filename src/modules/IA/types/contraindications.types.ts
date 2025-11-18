export interface ContraindicationData {
  absolutas: string[];
  relativas: string[];
}

export interface ContraindicationResponse {
  success: boolean;
  contraindications: ContraindicationData | null;
  message?: string;
}

export interface FormattedContraindicationResponse {
  success: boolean;
  contraindications: string | null;
  structuredData?: ContraindicationData | null;
  message?: string;
}