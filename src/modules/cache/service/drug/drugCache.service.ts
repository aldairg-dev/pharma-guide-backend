import { interfaceDrugCache } from "../../types/Interfaces/DrugCache";
import { connectToRedis } from "../../utils/connectToRedis";
import { getRedisClient } from "../initializeRedis";

export class DrugCacheService {
  private getClient(): any {
    return getRedisClient();
  }

  private redisConnection = new connectToRedis();

  async addDrugCache(drugCache: interfaceDrugCache): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      const cacheKey = `drug:${drugCache.userId}:${drugCache.drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;

      const now = Date.now();

      const dataToStore = {
        userId: drugCache.userId.toString(),
        drugId: drugCache.drugId.toString(),
        contraindications: JSON.stringify(drugCache.contraindications || {}),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      const hSetResult = await client.hSet(cacheKey, dataToStore);

      if (hSetResult) {
        console.log(
          "[DrugCache] Datos almacenados correctamente en caché. Key: ",
          cacheKey
        );
      }

      return true;
    } catch (error) {
      console.error("[DrugCache] Error al agregar a caché:", error);
      console.error(
        "[DrugCache] Stack trace:",
        error instanceof Error ? error.stack : "No stack available"
      );
      return false;
    }
  }

  async getDrugCache(
    userId: number,
    drugId: number
  ): Promise<interfaceDrugCache | null> {
    await this.redisConnection.conexion();
    const client = this.getClient();

    const dataDrugCache = await client.hGetAll(`drug:${userId}:${drugId}`);
    if (Object.keys(dataDrugCache).length === 0) {
      console.log(
        `[DrugCache] No se encontraron datos en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return null;
    }
    return dataDrugCache;
  }
}
