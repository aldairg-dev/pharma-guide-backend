import app from "./app";
import * as dotenv from 'dotenv';
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 3001;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV}`);
});
