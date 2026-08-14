export interface PharmacokineticsData {
  absorcion: string[];
  distribucion: string[];
  metabolismo: string[];
  excrecion: [];
  implicaciones_clinicas: string[];
}

export interface PharmacokineticsResponse {
  pharmacokinetics?: {
    strutured: PharmacokineticsData;
  };
}
