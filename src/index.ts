import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import app from "./app";
import { initializeRedis, isRedisConnected } from "./modules/cache/service/initializeRedis";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_URL =
  process.env.BASE_URL ||
  `${NODE_ENV === "production" ? "https" : "http"}://${HOST}:${PORT}`;

async function startServer() {
  try {
    // Inicializar Redis una sola vez
    await initializeRedis();

    if (NODE_ENV !== "production") {
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    app.post("/webhooks/github", (req, res) => {
      console.log("Webhook recibido desde GitHub:", req.body);
      res.status(200).send("OK");
    });

    app.get("/", (req, res) => {
      const baseMessage =
        "API de Pharma Guide en modo " +
        NODE_ENV +
        ". Redis " +
        (isRedisConnected() ? "conectado" : "no conectado");

      const response = {
        message: baseMessage,
        ...(NODE_ENV !== "production" && {
          swagger: "Documentación disponible: " + `${BASE_URL}/api-docs`,
        }),
      };

      res.json(response);
    });

    app.listen(PORT, HOST, () => {
      console.log(`Servidor corriendo en ${BASE_URL}`);
      console.log(`Redis: ${isRedisConnected() ? " Conectado" : " Desconectado"}`);
      console.log(`Entorno: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor: ", error);
    process.exit(1);
  }
}

startServer();
