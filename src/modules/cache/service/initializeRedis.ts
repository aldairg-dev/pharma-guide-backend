import { createClient } from "redis";

export async function initializeRedis() {
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
    });

    clientRedis.on("end", () => {
      console.log("🔌 Conexión Redis terminada");
    });

    await Promise.race([
      clientRedis.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout de conexión Redis")), 5000)
      ),
    ]);

    process.on("SIGTERM", async () => {
      console.log("Cerrando conexión Redis...");
      try {
        await clientRedis.disconnect();
      } catch (err) {
        console.log("Error al cerrar Redis:", err);
      }
    });

    process.on("SIGINT", async () => {
      console.log("Cerrando conexión Redis...");
      try {
        await clientRedis.disconnect();
      } catch (err) {
        console.log("Error al cerrar Redis:", err);
      }
    });

    return clientRedis;
  } catch (error) {
    console.log("Redis no disponible - La aplicación continuará sin caché");
    console.log(
      "   Razón: ",
      error instanceof Error ? (error as any).code : "Error desconocido"
    );

    return null;
  }
}
