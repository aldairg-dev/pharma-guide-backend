import { PrismaClient } from "@prisma/client";
import { DrugService } from "../../drug/service/drug.service";
import { IaManagementService } from "../../ia-management/service/ia-management.service";
import * as _ from "lodash";
import axios from "axios";

const prisma = new PrismaClient();

export class IaExecutionService {
  async getDataDrug(drugId: number) {
    const drugService = new DrugService();
    const dataDrug = await drugService.getDrugById(drugId);
    if (!dataDrug) {
      throw new Error("Drug not found");
    }

    return dataDrug;
  }

  async getDataIaType(iaType: number) {
    const managementIaService = new IaManagementService();
    const dataModelIA = await managementIaService.getManagementType(iaType);
    if (!dataModelIA) {
      throw new Error("No management IA found for the specified type");
    }

    return dataModelIA;
  }

  private replacePlaceholders(template: any, data: Record<string, any>) {
    const json = JSON.stringify(template);
    const replaced = json.replace(/{{(.*?)}}/g, (_, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : "";
    });
    return JSON.parse(replaced);
  }

  async execute(data: any): Promise<any> {
    const [ia, drug] = await Promise.all([
      this.getDataIaType(data.iaType),
      this.getDataDrug(data.drugId),
    ]);

    const headers = this.replacePlaceholders(ia.headers_template, {
      api_key: ia.api_key,
      ...drug,
    });

    const body = this.replacePlaceholders(ia.body_template, {
      prompt: ia.prompt_description,
      model: ia.model,
      ...drug,
    });

    const response = await axios.request({
      method: ia.method || "POST",
      url: ia.url_api,
      headers,
      data: body,
    });

    return response.data;
  }
}
