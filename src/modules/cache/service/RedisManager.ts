import { createClient } from "redis";

export class RedisManager {
  private static instance: RedisManager;
  private client: any = null;
  private isInitialized = false;
  private isInitializing = false;

  private constructor() {}

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      console.log("Intentando conectar con Redis...");

      const clientRedis = createClient({
        socket: {
          host: process.env.REDIS_HOST || "localhost",
          port: Number(process.env.REDIS_PORT) || 6379,
          connectTimeout: 5000,
          reconnectStrategy: () => false,
        },
        password: process.env.REDIS_PASSWORD,
      });

      let errorLogged = false;

      clientRedis.on("error", (err) => {
        if (!errorLogged) {
          console.log(
            "Error en Redis (la app continúa funcionando):",
            err.message
          );
          errorLogged = true;
        }
      });

      clientRedis.on("connect", () => {
        console.log("Cliente de Redis conectado");
      });

      clientRedis.on("ready", () => {
        console.log("Cliente de Redis listo para usar");
        this.isInitialized = true;
      });

      clientRedis.on("end", () => {
        console.log("🔌 Conexión Redis terminada");
        this.isInitialized = false;
      });

      await Promise.race([
        clientRedis.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout de conexión Redis")), 5000)
        ),
      ]);

      this.client = clientRedis;
      this.isInitialized = true;

      this.setupCloseHandlers();
    } catch (error) {
      console.log("Redis no disponible - La aplicación continuará sin caché");
      console.log(
        "   Razón: ",
        error instanceof Error ? (error as any).code : "Error desconocido"
      );
      this.client = null;
      this.isInitialized = false;
    } finally {
      this.isInitializing = false;
    }
  }

  private setupCloseHandlers(): void {
    const closeRedis = async () => {
      if (this.client) {
        console.log("Cerrando conexión Redis...");
        try {
          await this.client.disconnect();
        } catch (err) {
          console.log("Error al cerrar Redis:", err);
        }
        this.client = null;
        this.isInitialized = false;
      }
    };

    process.on("SIGTERM", closeRedis);
    process.on("SIGINT", closeRedis);
  }

  public getClient(): any {
    return this.client;
  }

  public isConnected(): boolean {
    return this.isInitialized && this.client !== null;
  }

  public async waitForConnection(maxWaitTime = 10000): Promise<boolean> {
    const startTime = Date.now();

    while (this.isInitializing && Date.now() - startTime < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return this.isConnected();
  }
}
