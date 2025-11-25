export interface IndicationData {
  indicaciones_principales: string[];
  indicaciones_secundaria: string[];
  otras_indicaciones: string[];
}

export interface IndicationResponse {
  indications?: {
    content: string;
    structured: IndicationData;
  };
}

export interface FormattedIndicationResponse {
  indications: {
    content: string;
    structured: IndicationData;
  };
}