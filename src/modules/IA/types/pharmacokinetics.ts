export interface PharmacokineticsData {
  absorcion: string[];
  distribucion: string[];
  metabolismo: string[];
  eliminacion: [];
  otro_datos: string[];
}

export interface PharmacokineticsResponse {
  succes: boolean;
  pharmacokinetics: PharmacokineticsData | null;
  message?: string;
}

export interface FormattedPharmacokineticsResponse {
  succes: boolean;
  pharmacokinetics: string | null;
  struturedData?: PharmacokineticsData | null;
  message?: string;
}
