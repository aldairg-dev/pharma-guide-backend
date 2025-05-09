import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", (req, res) => {
  res.send("Welcome to Pharma Guide API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
