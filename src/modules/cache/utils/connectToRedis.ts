import { getRedisClient, isRedisConnected } from "../service/initializeRedis";
import { RedisManager } from "../service/RedisManager";

export class connectToRedis {
  private getClient(): any {
    return getRedisClient();
  }

  TIME_EXPIRED = 604800; // 7 días en segundos
  RENEWAL_TIME_RANGE = 60 * 60 * 24 * 3; // 3 día en segundos

  private async ensureConnection(): Promise<boolean> {
    if (isRedisConnected()) {
      return true;
    } else {
      return false;
    }

    const client = this.getClient();

    if (!client) {
      console.log(
        "[ConnectToRedis] Cliente Redis no disponible para obtener datos"
      );
      return false;
    }

    const redisManager = RedisManager.getInstance();
    return await redisManager.waitForConnection(3000);
  }

  async conexion(): Promise<boolean> {
    try {
      return await this.ensureConnection();
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      return false;
    }
  }
}
