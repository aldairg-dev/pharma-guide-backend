import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import app from "./app";
import { initializeRedis } from "./modules/cache/config/initializeRedis";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_URL =
  process.env.BASE_URL ||
  `${NODE_ENV === "production" ? "https" : "http"}://${HOST}:${PORT}`;

async function startServer() {
  try {
    const redisClient = await initializeRedis();
    if (redisClient) {
      console.log("Redis inicializado correctamente");
    } else {
      console.log("Servidor iniciando sin Redis");
    }

    if (NODE_ENV !== "production") {
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    app.post("/webhooks/github", (req, res) => {
      console.log("Webhook recibido desde GitHub:", req.body);
      res.status(200).send("OK");
    });

    app.get("/", (req, res) => {
      res.json({ message: "API de Pharma Guide funcionando." });
    });

    app.listen(PORT, HOST, () => {
      console.log(`Servidor corriendo en modo ${NODE_ENV} en ${HOST}:${PORT}`);
      if (NODE_ENV !== "production") {
        console.log(`API: ${BASE_URL}`);
        console.log(`Swagger: ${BASE_URL}/api-docs`);
      }
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
