import { Request, Response } from 'express';
import IAService from '../service/IA.service';

interface DrugContraindicationRequest {
  name_generic: string;
  brand_name: string;
  mechanism_of_action: string;
  therapeutic_class: string;
  tags?: string;
}

class IAController {
  /**
   * Obtiene las contraindicaciones de un medicamento
   * @param req Request con la información del medicamento
   * @param res Response con las contraindicaciones
   */
  async getContraindications(req: Request, res: Response): Promise<void> {
    try {
      const drugInfo: DrugContraindicationRequest = req.body;

      // Validar que se proporcionen los campos requeridos
      if (!drugInfo.name_generic || !drugInfo.brand_name || 
          !drugInfo.mechanism_of_action || !drugInfo.therapeutic_class) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: name_generic, brand_name, mechanism_of_action, therapeutic_class',
          contraindications: null
        });
        return;
      }

      // Preparar la información del medicamento
      const drugData = {
        name_generic: drugInfo.name_generic.trim(),
        brand_name: drugInfo.brand_name.trim(),
        mechanism_of_action: drugInfo.mechanism_of_action.trim(),
        therapeutic_class: drugInfo.therapeutic_class.trim(),
        tags: drugInfo.tags?.trim() || ''
      };

      // Obtener contraindicaciones usando el servicio de IA
      const result = await IAService.getValidatedContraindications(drugData);

      // Determinar el código de estado HTTP basado en el resultado
      const statusCode = result.success ? 200 : result.message?.includes('no encontrada') ? 404 : 500;

      res.status(statusCode).json(result);

    } catch (error) {
      console.error('Error en getContraindications:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        contraindications: null
      });
    }
  }


  async getContraindicationsByDrugId(req: Request, res: Response): Promise<void> {
    try {
      const { drugId } = req.params;

      if (!drugId || isNaN(Number(drugId))) {
        res.status(400).json({
          success: false,
          message: 'ID de medicamento inválido',
          contraindications: null
        });
        return;
      }

      // Aquí deberías implementar la lógica para obtener el medicamento de la base de datos
      // usando Prisma Client. Por ejemplo:
      // const drug = await prisma.drug.findUnique({
      //   where: { id: Number(drugId), isDeleted: false }
      // });

      // if (!drug) {
      //   res.status(404).json({
      //     success: false,
      //     message: 'Medicamento no encontrado',
      //     contraindications: null
      //   });
      //   return;
      // }

      // const result = await IAService.getValidatedContraindications(drug);
      // const statusCode = result.success ? 200 : result.message?.includes('no encontrada') ? 404 : 500;
      // res.status(statusCode).json(result);

      res.status(501).json({
        success: false,
        message: 'Funcionalidad no implementada aún. Use el endpoint POST /contraindications',
        contraindications: null
      });

    } catch (error) {
      console.error('Error en getContraindicationsByDrugId:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        contraindications: null
      });
    }
  }

  /**
   * Endpoint de prueba para verificar la configuración de la API
   */
  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const testDrug = {
        name_generic: "Paracetamol",
        brand_name: "Tylenol",
        mechanism_of_action: "Inhibidor no selectivo de la ciclooxigenasa",
        therapeutic_class: "Analgésico y antipirético",
        tags: "dolor, fiebre"
      };

      const result = await IAService.getValidatedContraindications(testDrug);
      
      res.status(200).json({
        success: true,
        message: 'Prueba de conexión exitosa',
        test_result: result
      });

    } catch (error) {
      console.error('Error en test connection:', error);
      res.status(500).json({
        success: false,
        message: 'Error en la prueba de conexión',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default new IAController();