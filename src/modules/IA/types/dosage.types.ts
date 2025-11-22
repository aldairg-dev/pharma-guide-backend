export interface DosageIndication {
  nombre: string;
  dosis_habitual: string;
  dosis_mg_kg?: string;
  frecuencia: string;
  duracion?: string;
}

export interface SpecialPopulations {
  pediatrica?: string;
  geriatrica?: string;
  embarazo_lactancia?: string;
}

export interface RenalAdjustments {
  leve?: string;
  moderada?: string;
  severa?: string;
  dialisis?: string;
}

export interface HepaticAdjustments {
  child_pugh_A?: string;
  child_pugh_B?: string;
  child_pugh_C?: string;
}

export interface FunctionalAdjustments {
  renal: RenalAdjustments;
  hepatica: HepaticAdjustments;
}

export interface DosageData {
  indicaciones: DosageIndication[];
  poblaciones_especiales: SpecialPopulations;
  ajustes_funcionales: FunctionalAdjustments;
  dosis_maxima_diaria?: string;
  contraindicaciones: string[];
  interacciones_relevantes: string[];
}

export interface DosageResponse {
  success: boolean;
  dosage: DosageData | null;
  message?: string;
}

export interface FormattedDosageResponse {
  success: boolean;
  dosage: string | null;
  structuredData?: DosageData | null;
  message?: string;
}
