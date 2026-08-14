import { interfaceDrugCache } from "../../types/Interfaces/DrugCache";
import { connectToRedis } from "../../utils/connectToRedis";
import { getRedisClient } from "../initializeRedis";
import { RedisManager } from "../RedisManager";

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

      return true;
    } catch (error) {
      console.error("[drugCacheService] Error al agregar a caché:", error);
      return false;
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
          `[drugCacheService] No se encontraron datos en caché para userId: ${userId}, drugId: ${drugId}`
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
            "[drugCacheService] Error parseando contraindications:",
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
            "[drugCacheService] Error parseando therapeuticClass:",
            parseError
          );
        }
      }

      console.log(
        `[drugCacheService] Registro completo encontrado en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return result;
    } catch (error) {
      console.error(
        "[drugCacheService] Error al obtener datos completos de caché:",
        error
      );
      return null;
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
          `[drugCacheService] Caché expirado para userId: ${userId}, drugId: ${drugId}`
        );
        await client.del(cacheKey);
        return true;
      }

      return false;
    } catch (error) {
      console.error("[drugCacheService] Error verificando expiración:", error);
      return true; // Asumir expirado en caso de error
    }
  }

  async getCacheTTL(userId: number, drugId: number): Promise<number> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();
      const cacheKey = `drug:${userId}:${drugId}`;
      return await client.ttl(cacheKey);
    } catch (error) {
      console.error("[drugCacheService] Error al obtener TTL:", error);
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
        `[drugCacheService] Caché eliminado para userId: ${userId}, drugId: ${drugId}`
      );
      return result > 0;
    } catch (error) {
      console.error("[drugCacheService] Error al eliminar caché:", error);
      return false;
    }
  }

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

      return true;
    } catch (error) {
      console.error(
        `[drugCacheService] Error al agregar contraindicaciones de caché: ${error}`
      );
      return false;
    }
  }

  async getDrugContraindications(
    userId: number,
    drugId: number
  ): Promise<Boolean> {
    try {
      if (await this.isCacheExpired(userId, drugId)) {
        return false;
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
          `[drugCacheService] No se encontraron contraindicaciones en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return false;
      }

      try {
        const contraindications = JSON.parse(contraindicationsStr);

        return contraindications;
      } catch (parseError) {
        console.warn(
          `[drugCacheService] Error parseando contraindicaciones: ${parseError}`
        );
        return false;
      }
    } catch (error) {
      console.error(
        `[drugCacheService] Error al obtener contraindicaciones de caché: ${error}`
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
        `[drugCacheService] Clase terapéutica almacenada en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.error(
        `[drugCacheService] Error al agregar clase terapéutica de caché: ${error}`
      );
      return false;
    }
  }

  async getDrugTherapeuticClass(
    userId: number,
    drugId: number
  ): Promise<Boolean> {
    try {
      if (await this.isCacheExpired(userId, drugId)) {
        return false;
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
          `[drugCacheService] No se encontró clase terapéutica en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return false;
      }

      try {
        const therapeuticClass = JSON.parse(therapeuticClassStr);
        console.log(
          `[drugCacheService] Clase terapéutica encontrada en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return therapeuticClass;
      } catch (parseError) {
        console.warn(
          "[drugCacheService] Error parseando clase terapéutica:",
          parseError
        );
        return false;
      }
    } catch (error) {
      console.error(
        `[drugCacheService] Error al obtener clase terapéutica de caché: ${error}`
      );
      return false;
    }
  }

  async addDosages(
    userId: number,
    drugId: number,
    dosage: any
  ): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn("[drugCacheService] Redis client not available");
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        dosage: JSON.stringify(dosage),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      console.log(
        `[drugCacheService] Dosificación almacenada en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.log(
        `[drugCacheService] Error al agregar la docificación de caché: ${error}`
      );
      return false;
    }
  }

  async getDosages(userId: number, drugId: number): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn("[drugCacheService] Redis client not available");
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const dosageStr = await client.hGet(cacheKey, "dosage");

      if (!dosageStr || dosageStr === "null") {
        console.log(
          `[drugCacheService]  No se encontró la docificación en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return false;
      }

      try {
        const dosage = JSON.parse(dosageStr);
        console.log(
          `[drugCacheService] Docificación encontrada en caché para userId: ${userId}, drugId: ${drugId}`
        );
        return dosage;
      } catch (parseError) {
        console.warn(
          `[drugCacheService] Error parseando la docifiación: ${parseError}`
        );
        return false;
      }
    } catch (error) {
      console.log(
        `[drugCacheService] Error al obtener la docificación del farmaco de caché: ${error}`
      );
      return false;
    }
  }

  async addIndications(
    userId: number,
    drugId: number,
    indications: any
  ): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn(`[drugCacheService] Redis client not available`);
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        indications: JSON.stringify(indications),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      return true;
    } catch (error) {
      console.log(
        `[drugCacheService] Error al agregar la indicacion a cache: ${userId}: ${drugId}, el error: ${error}`,
        error
      );
      return false;
    }
  }

  async getIndications(userId: number, drugId: number): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn("[drugCacheService] Redis client not available");
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const indicationStr = await client.hGet(cacheKey, "indications");

      if (!indicationStr || indicationStr == "null") {
        console.log(
          `[drugCacheService] No he encontraron indicaiones del fármaco drug:${userId}:${drugId}`
        );
        return false;
      }

      try {
        return JSON.parse(indicationStr);
      } catch (parseError) {
        console.warn(
          `[drugCacheService] Error parseando la indicacion: ${parseError}`
        );
        return false;
      }
    } catch (error) {
      console.log(
        `[drugCacheService] Error al obtener las indicaiones del fármaco drug:${userId}:${drugId}, el error: ${error}`
      );
      return false;
    }
  }

  async addMechanismOfActions(
    userId: number,
    drugId: number,
    mechanismOfActions: any
  ): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn(`[drugCacheService] Redis client not available`);
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        mechanismOfActions: JSON.stringify(mechanismOfActions),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      console.log(
        `[drugCacheService] Mecanismo de acción almacenado en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.log(
        `[drugCacheService] Error al agregar el mecanismo de acción a cache: ${userId}: ${drugId}`,
        error
      );
      return false;
    }
  }

  async getMechanismOfActions(
    userId: number,
    drugId: number
  ): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn("[drugCacheService] Redis client not available");
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const mechanismOfActionsStr = await client.hGet(
        cacheKey,
        "mechanismOfActions"
      );

      if (!mechanismOfActionsStr || mechanismOfActionsStr == "null") {
        console.log(
          `[drugCacheService] No se encontraron mecanismos de acción del fármaco drug:${userId}:${drugId}`
        );
        return false;
      }

      try {
        return JSON.parse(mechanismOfActionsStr);
      } catch (parseError) {
        console.warn(
          `[drugCacheService] Error parseando el mecanismo de acción: ${parseError}`
        );
        return false;
      }
    } catch (error) {
      console.log(
        `[drugCacheService] Error al obtener los mecanismos de acción del fármaco drug:${userId}:${drugId}`
      );
      return false;
    }
  }

  async addPharmacokinetics(
    userId: number,
    drugId: number,
    pharmacokinetics: any
  ): Promise<Boolean> {
    try {
      await this.redisConnection.conexion();
      const client = await this.getClient();

      if (!client) {
        console.warn(`[drugCacheService] Redis client not available`);
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const TTL_SECONDS = this.redisConnection.TIME_EXPIRED || 604800; // 7 días
      const TTL_MS = TTL_SECONDS * 1000;
      const now = Date.now();

      const dataToUpdate = {
        userId: userId.toString(),
        drugId: drugId.toString(),
        pharmacokinetics: JSON.stringify(pharmacokinetics),
        lastUpdated: now.toString(),
        expiresAt: (now + TTL_MS).toString(),
      };

      await client.hSet(cacheKey, dataToUpdate);
      console.log(
        `[drugCacheService] Farmacocinética almacenado en caché para userId: ${userId}, drugId: ${drugId}`
      );
      return true;
    } catch (error) {
      console.log(
        `[drugCacheService] Error al guardar en cache la Farmacocinética del user:${userId} y drug:${drugId}, ${error}`
      );
      return false;
    }
  }

  async getPharmacokinitics(
    userId: number,
    drugId: number
  ): Promise<Boolean | null> {
    try {
      await this.redisConnection.conexion();
      const client = this.getClient();

      if (!client) {
        console.warn("[drugCacheService] Redis client not available");
        return false;
      }

      const cacheKey = `drug:${userId}:${drugId}`;

      const pharmacokiniticsStr = await client.hGet(
        cacheKey,
        "pharmacokinetics"
      );

      if (!pharmacokiniticsStr || pharmacokiniticsStr == "null") {
        console.log(
          `[drugCacheService] No se encontró la farmacocinética fármaco drug:${userId}:${drugId}`
        );
      }

      try {
        return JSON.parse(pharmacokiniticsStr);
      } catch (parseError) {
        console.error(
          `[drugCacheService] Error al parsear el farmacocinética ${parseError}`
        );
        return false;
      }
    } catch (error) {
      console.error(
        `[drugCacheService] Error al obtener de cache la Farmacocinética, ${error}`
      );
      return false;
    }
  }
}
