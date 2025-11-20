export interface TherapeuticClassData {
  clase_principal: string;
  subclases: string[];
  codigo_atc?: string;
  indicaciones_principales: string[];
}

export interface TherapeuticClassResponse {
  success: boolean;
  therapeuticClass: TherapeuticClassData | null;
  message?: string;
}

export interface FormattedTherapeuticClassResponse {
  success: boolean;
  therapeuticClass: string | null;
  structuredData?: TherapeuticClassData | null;
  message?: string;
}
