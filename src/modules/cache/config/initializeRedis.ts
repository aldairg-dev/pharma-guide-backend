import { createClient } from 'redis';

export async function initializeRedis() {
  try {
    const clientRedis = createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      password: process.env.REDIS_PASSWORD,
    });

    clientRedis.on("error", (err) => {
      console.log("Error en el cliente de Redis:", err);
    });

    clientRedis.on("connect", () => {
      console.log("Conectando a Redis...");
    });

    clientRedis.on("ready", () => {
      console.log("Conectado a Redis correctamente");
    });

    await clientRedis.connect();

    process.on("SIGTERM", async () => {
      console.log("Cerrando conexión Redis...");
      await clientRedis.disconnect();
    });

    process.on("SIGINT", async () => {
      console.log("🛑 Cerrando conexión Redis...");
      await clientRedis.disconnect();
    });

    return clientRedis;
  } catch (error) {
    console.error("Error al conectar con Redis:", error);
    return null;
  }
}
