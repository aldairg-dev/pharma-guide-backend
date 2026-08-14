export interface PharmacokineticsData {
  absorcion: string[];
  distribucion: string[];
  metabolismo: string[];
  excrecion: string[];
  implicaciones_clinicas: string[];
}

export interface PharmacokineticsResponse {
  pharmacokinetics?: {
    structured: PharmacokineticsData;
  };
}
