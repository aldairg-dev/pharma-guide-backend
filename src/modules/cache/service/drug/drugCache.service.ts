import { interfaceDrugCache } from "../../types/Interfaces/DrugCache";
import { connectToRedis } from "../../utils/connectToRedis";
import { getRedisClient } from "../initializeRedis";

export class DrugCacheService {
  private getClient(): any {
    return getRedisClient();
  }

  private redisConnection = new connectToRedis();

  async addDrugContraindications(
    userId: number,
    drugId: number,
    contraindications: any
  ): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        contraindications: JSON.stringify(contraindications),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      console.log(
        `[DrugCache] Contraindicaciones almacenadas en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.error(
        "[DrugCache] Error al agregar contraindicaciones a caché:",
        error
      );
      return false;
    }
  }

  async addDrugTherapeuticClass(
    userId: number,
    drugId: number,
    therapeuticClass: any
  ): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        therapeuticClass: JSON.stringify(therapeuticClass),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      console.log(
        `[DrugCache] Clase terapéutica almacenada en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.error(
        "[DrugCache] Error al agregar clase terapéutica a caché:",
        error
      );
      return false;
    }
  }

  async addDrugCache(drugCache: interfaceDrugCache): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${drugCache.userId}:${drugCache.drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToStore: any = {
        userId: drugCache.userId.toString(),
        drugId: drugCache.drugId.toString(),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      if (drugCache.contraindications !== undefined) {
        dataToStore.contraindications = JSON.stringify(
          drugCache.contraindications
        );
      }

      if (drugCache.therapeuticClass !== undefined) {
        dataToStore.therapeuticClass = JSON.stringify(
          drugCache.therapeuticClass
        );
      }

      await client.hSet(cacheKey, dataToStore);
      console.log(
        `[DrugCache] Datos almacenados correctamente en caché. Key: ${cacheKey}`
      );
      return true;
    } catch (error) {
      console.error("[DrugCache] Error al agregar a caché:", error);
      return false;
    }
  }

  private async isCacheExpired(
    userId: number,
    drugId: number
  ): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;

      const expiresAtStr = await client.hGet(cacheKey, "expiresAt");
      if (!expiresAtStr) return true;

      const now = Date.now();
      const expiresAt = parseInt(expiresAtStr);

      if (expiresAt > 0 && now > expiresAt) {
        console.log(
          `[DrugCache] Caché expirado para userId: ${userId}, drugId: ${drugId}`
        );
        await client.del(cacheKey);
        return true;
      }

      return false;
    } catch (error) {
      console.error("[DrugCache] Error verificando expiración:", error);
      return true; // Asumir expirado en caso de error
    }
  }

  async getDrugContraindications(userId: number, drugId: number): Promise<any> {
    try {
      if (await this.isCacheExpired(userId, drugId)) {
        return null;
      }

      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;

      const contraindicationsStr = await client.hGet(
        cacheKey,
        "contraindications"
      );

      if (!contraindicationsStr || contraindicationsStr === "null") {
        console.log(
          `[DrugCache] No se encontraron contraindicaciones en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return null;
      }

      try {
        const contraindications = JSON.parse(contraindicationsStr);
        console.log(
          `[DrugCache] Contraindicaciones encontradas en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return contraindications;
      } catch (parseError) {
        console.warn(
          "[DrugCache] Error parseando contraindicaciones:",
          parseError
        );
        return null;
      }
    } catch (error) {
      console.error(
        "[DrugCache] Error al obtener contraindicaciones de caché:",
        error
      );
      return null;
    }
  }

  async getDrugTherapeuticClass(userId: number, drugId: number): Promise<any> {
    try {
      if (await this.isCacheExpired(userId, drugId)) {
        return null;
      }

      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;

      const therapeuticClassStr = await client.hGet(
        cacheKey,
        "therapeuticClass"
      );

      if (!therapeuticClassStr || therapeuticClassStr === "null") {
        console.log(
          `[DrugCache] No se encontró clase terapéutica en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return null;
      }

      try {
        const therapeuticClass = JSON.parse(therapeuticClassStr);
        console.log(
          `[DrugCache] Clase terapéutica encontrada en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return therapeuticClass;
      } catch (parseError) {
        console.warn(
          "[DrugCache] Error parseando clase terapéutica:",
          parseError
        );
        return null;
      }
    } catch (error) {
      console.error(
        "[DrugCache] Error al obtener clase terapéutica de caché:",
        error
      );
      return null;
    }
  }

  async getDrugCache(
    userId: number,
    drugId: number
  ): Promise<interfaceDrugCache | null> {
    try {
      if (await this.isCacheExpired(userId, drugId)) {
        return null;
      }

      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;
      const dataDrugCache = await client.hGetAll(cacheKey);

      if (Object.keys(dataDrugCache).length === 0) {
        console.log(
          `[DrugCache] No se encontraron datos en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return null;
      }

      const result: interfaceDrugCache = {
        userId: parseInt(dataDrugCache.userId),
        drugId: parseInt(dataDrugCache.drugId),
      };

      if (
        dataDrugCache.contraindications &&
        dataDrugCache.contraindications !== "null"
      ) {
        try {
          result.contraindications = JSON.parse(
            dataDrugCache.contraindications
          );
        } catch (parseError) {
          console.warn(
            "[DrugCache] Error parseando contraindications:",
            parseError
          );
        }
      }

      if (
        dataDrugCache.therapeuticClass &&
        dataDrugCache.therapeuticClass !== "null"
      ) {
        try {
          result.therapeuticClass = JSON.parse(dataDrugCache.therapeuticClass);
        } catch (parseError) {
          console.warn(
            "[DrugCache] Error parseando therapeuticClass:",
            parseError
          );
        }
      }

      console.log(
        `[DrugCache] Registro completo encontrado en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return result;
    } catch (error) {
      console.error(
        "[DrugCache] Error al obtener datos completos de caché:",
        error
      );
      return null;
    }
  }

  async getCacheTTL(userId: number, drugId: number): Promise<number> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;
      return await client.ttl(cacheKey);
    } catch (error) {
      console.error("[DrugCache] Error al obtener TTL:", error);
      return -1;
    }
  }

  async deleteDrugCache(userId: number, drugId: number): Promise<boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;
      const result = await client.del(cacheKey);
      console.log(
        `[DrugCache] Caché eliminado para userId: ${userId}, drugId: ${drugId}`
      );
      return result > 0;
    } catch (error) {
      console.error("[DrugCache] Error al eliminar caché:", error);
      return false;
    }
  }
}
