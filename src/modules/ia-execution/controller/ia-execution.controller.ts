import { Request, Response, NextFunction } from "express";
import { IaExecutionService } from "../service/ia-execution.service";

export class IaExecutionController {
  private iaExecutionService = new IaExecutionService();

  public async getData(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> {
    try {
      const data = req.body as { drugId: number; iaType: number };

      if (
        !data ||
        typeof data.drugId !== "number" ||
        typeof data.iaType !== "number"
      ) {
        return res.status(400).json({
          status: "error",
          message: "Invalid or missing drugId or iaType in request body",
        });
      }

      console.log(
        `[IA EXECUTION] drugId: ${data.drugId}, iaType: ${data.iaType}`
      );

      const responseData = await this.iaExecutionService.execute(data);

      res.status(200).json({
        status: "success",
        data: responseData,
      });
    } catch (error: any) {
      console.error("Error fetching execution data:", error?.message);

      res.status(500).json({
        status: "error",
        message: "Error fetching execution data",
        error:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      });
    }
  }
}
