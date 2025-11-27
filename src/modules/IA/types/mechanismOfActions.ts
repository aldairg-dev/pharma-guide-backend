export interface MechanismOfActionData {
  clasificacion_farmacologica: string;
  diana_molecular_primaria: string;
  modo_de_accion: string;
  impacto_bioquimico: string;
  efectos_terapeuticos_finales: string;
}

export interface MechanismOfActionResponse {
  mechanismOfActions?: {
    structured: MechanismOfActionData;
  };
}

export interface FormattedMechanismOfActionResponse {
  mechanismOfActions: {
    structured: MechanismOfActionData;
  };
}
