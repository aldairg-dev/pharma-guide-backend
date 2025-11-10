import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import express from "express";
import swaggerDocument from "../swagger.json";
import app from "./app";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_URL =
  process.env.BASE_URL ||
  `${NODE_ENV === "production" ? "https" : "http"}://${HOST}:${PORT}`;

app.get("/", (req, res) => {
  res.json({ message: "API de Pharma Guide funcionando." });
});

app.post("/webhooks/github", (req, res) => {
  console.log("Webhook recibido desde GitHub:", req.body);
  res.status(200).send("OK");
});

if (NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en modo ${NODE_ENV} en ${HOST}:${PORT}`);
  if (NODE_ENV !== "production") {
    console.log(`API: ${BASE_URL}`);
    console.log(`Swagger: ${BASE_URL}/api-docs`);
  }
});
