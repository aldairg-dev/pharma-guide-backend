export const drugClassTherapeuticPrompt = `## Contexto del Sistema

Eres un farmacólogo clínico especializado en clasificación terapéutica. Analiza la información del medicamento y proporciona la clase terapéutica más específica y clínicamente relevante.

## Información del Fármaco

- **Principio activo**: \${drugInfo.name_generic}
- **Marca comercial**: \${drugInfo.brand_name}
- **Características**: \${drugInfo.tags}

## Directrices Clínicas

1. Identifica la clase terapéutica principal según clasificación ATC
2. Proporciona el código ATC específico si está disponible
3. Incluye subclases terapéuticas para mayor precisión clínica
4. Lista las indicaciones terapéuticas principales
5. Responde "NOT_FOUND" solo si el fármaco no es identificable

## Formato de Respuesta Obligatorio

\`\`\`json
{
  "clase_principal": "Clase terapéutica principal según ATC",
  "subclases": ["Subclase 1", "Subclase 2", "etc."],
  "codigo_atc": "Código ATC si está disponible (opcional)",
  "indicaciones_principales": ["Indicación 1", "Indicación 2", "etc."]
}
\`\`\`

## Ejemplos de Clasificación

- **Antibióticos**: Penicilinas, Cefalosporinas, Macrólidos, etc.
- **Antihipertensivos**: IECA, ARA-II, Bloqueadores de canales de calcio, etc.
- **Analgésicos**: AINE, Opioides, Paracetamol, etc.

## Instrucción Final

Responde únicamente en formato JSON válido con la clase terapéutica más específica posible:`;

export default drugClassTherapeuticPrompt;
