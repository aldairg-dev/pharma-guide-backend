import * as fs from "fs";
import * as path from "path";

interface PromptVariables {
  [key: string]: string | undefined;
}

class PromptLoader {
  /**
   * Carga un template de prompt desde un archivo
   * @param filePath Ruta del archivo de prompt (relativa o absoluta)
   * @returns string con el contenido del template
   */
  static loadTemplate(filePath: string): string {
    try {
      const resolvedPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(__dirname, filePath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`El archivo de prompt no existe: ${resolvedPath}`);
      }

      const content = fs.readFileSync(resolvedPath, "utf-8");

      if (!content || content.trim().length === 0) {
        throw new Error(`El archivo de prompt está vacío: ${resolvedPath}`);
      }

      return content;
    } catch (error) {
      console.error("Error al cargar el template del prompt:", error);
      throw new Error(
        `No se pudo cargar el template del prompt: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Genera un prompt personalizado reemplazando variables en el template
   * @param template Template del prompt con variables en formato ${variable}
   * @param variables Objeto con las variables a reemplazar
   * @returns string con el prompt personalizado
   */
  static generatePrompt(template: string, variables: PromptVariables): string {
    let processedTemplate = template;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key}\\}`, "g");
      processedTemplate = processedTemplate.replace(regex, value || "");
    });

    const unreplacedVariables = processedTemplate.match(/\$\{[^}]+\}/g);
    if (unreplacedVariables) {
      console.warn(
        "Variables sin reemplazar encontradas:",
        unreplacedVariables
      );
    }

    return processedTemplate;
  }

  /**
   * Carga un template y genera el prompt en una sola operación
   * @param fileName Nombre del archivo de prompt, se busca en prompts
   * @param variables Objeto con las variables a reemplazar
   * @returns string con el prompt personalizado
   */
  static loadAndGenerate(fileName: string, variables: PromptVariables): string {
    // Intenta múltiples rutas para encontrar el archivo de prompt
    const possiblePaths = [
      path.resolve(__dirname, "prompts", fileName), // Para desarrollo
      path.resolve(__dirname, "..", "..", "..", "..", "src", "modules", "IA", "utils", "prompts", fileName), // Para producción desde dist
      path.resolve(process.cwd(), "src", "modules", "IA", "utils", "prompts", fileName), // Ruta desde el directorio raíz
    ];

    let promptsPath = "";
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        promptsPath = possiblePath;
        break;
      }
    }

    if (!promptsPath) {
      throw new Error(`No se pudo encontrar el archivo de prompt: ${fileName}. Rutas intentadas: ${possiblePaths.join(", ")}`);
    }

    const template = this.loadTemplate(promptsPath);
    return this.generatePrompt(template, variables);
  }

  /**
   * Valida que todas las variables requeridas estén presentes
   * @param template Template del prompt
   * @param variables Variables proporcionadas
   * @returns object con el resultado de la validación
   */
  static validateVariables(
    template: string,
    variables: PromptVariables
  ): {
    isValid: boolean;
    missingVariables: string[];
    unrequiredVariables: string[];
  } {
    // Extrae todas las variables requeridas del template
    const requiredVariables = Array.from(
      new Set(
        (template.match(/\$\{([^}]+)\}/g) || []).map((match) =>
          match.replace(/\$\{|\}/g, "")
        )
      )
    );

    // Identifica variables faltantes
    const missingVariables = requiredVariables.filter(
      (variable) => !variables.hasOwnProperty(variable) || !variables[variable]
    );

    // Identifica variables no requeridas
    const unrequiredVariables = Object.keys(variables).filter(
      (variable) => !requiredVariables.includes(variable)
    );

    return {
      isValid: missingVariables.length === 0,
      missingVariables,
      unrequiredVariables,
    };
  }
}

export default PromptLoader;
export { PromptVariables };
