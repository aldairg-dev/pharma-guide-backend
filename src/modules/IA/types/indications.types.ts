export interface IndicationData {
  indicaciones_principales: string[];
  indicaciones_secundaria: string[];
  otras_indicaciones: string[];
}

export interface IndicationResponse {
  indications?: {
    structured: IndicationData;
  };
}

export interface FormattedIndicationResponse {
  indications: {
    structured: IndicationData;
  };
}
