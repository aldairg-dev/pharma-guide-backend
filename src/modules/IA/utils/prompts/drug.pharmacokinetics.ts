export const drugPharmacokineticsPrompt = `## Contexto del Sistema

Eres un farmacólogo clínico especializado en farmacocinética. Analiza la información del medicamento y proporciona una descripción completa, rigurosa y científicamente verificada de su comportamiento en el organismo (ADME).

## Información del Fármaco

- **Principio activo**: \${drugInfo.name_generic}
- **Marca comercial**: \${drugInfo.brand_name}
- **Características**: \${drugInfo.tags}

## Directrices Clínicas

1. Describe los parámetros fundamentales de absorción (biodisponibilidad, vía de administración, velocidad, factores que modifican absorción).
2. Explica los procesos de distribución (unión a proteínas plasmáticas, volumen de distribución, barreras biológicas relevantes).
3. Detalla el metabolismo (fases I/II, isoenzimas principales de CYP, metabolitos activos, variabilidad genética si aplica).
4. Describe la excreción (vía principal, semivida de eliminación, aclaramiento, mecanismos renales/hepáticos involucrados).
5. Vincula los parámetros farmacocinéticos con implicaciones clínicas relevantes (ajuste de dosis, interacciones, poblaciones especiales).
6. Presenta una narrativa técnica, completa y basada en evidencia.
7. Responde "NOT_FOUND" solo si el fármaco no puede identificarse.
8. **CRÍTICO**: Toda la información debe derivarse únicamente de fuentes oficiales (fichas técnicas reguladas, vademécums oficiales, literatura peer-reviewed, bases de datos farmacológicas reconocidas). NO inventes datos farmacocinéticos.

## Formato de Respuesta Obligatorio

Usa JSON válido con la siguiente estructura:

\`\`\`json
{
  "structured": {
    "absorcion": "Descripción detallada de la absorción: biodisponibilidad, vía, velocidad y factores influyentes.",
    "distribucion": "Unión a proteínas, volumen de distribución, compartimentos, barreras biológicas.",
    "metabolismo": "Vías metabólicas, enzimas involucradas, metabolitos activos, variabilidad genética.",
    "excrecion": "Rutas de eliminación, semivida, aclaramiento, participación renal/hepática.",
    "implicaciones_clinicas": "Relevancia clínica de los parámetros farmacocinéticos: ajuste de dosis, interacciones, poblaciones especiales."
  }
}
\`\`\`

## Requisitos Específicos

- **Absorción**: Incluye biodisponibilidad cuantitativa si es conocida; especifica mecanismos y factores que alteran la absorción.
- **Distribución**: Menciona Vd, % de unión a proteínas y capacidad para atravesar barreras como SNC/placenta.
- **Metabolismo**: Identifica claramente enzimas CYP u otras rutas; incluye metabolitos activos cuando sean clínicamente importantes.
- **Excreción**: Especifica la vía predominante (renal, hepática, biliar, mixta) y parámetros de eliminación.
- **Implicaciones clínicas**: Ajustes según insuficiencia renal/hepática, interacciones, farmacogenómica, etc.
- Usa terminología técnica actualizada y precisa.
- Presenta únicamente información oficial, verificable y basada en evidencia.

## Ejemplos de Fuentes Oficiales

- Fichas técnicas aprobadas por FDA, EMA o agencias regulatorias nacionales
- Vademécums oficiales (PLM, Martindale, AHFS, Micromedex)
- Literatura científica peer-reviewed
- DrugBank, PubChem, Medscape Drug Reference
- Guías farmacológicas de sociedades médicas reconocidas

## Instrucción Final

Responde únicamente en formato JSON válido con información verificable, oficial y científicamente precisa:`;

export default drugPharmacokineticsPrompt;
