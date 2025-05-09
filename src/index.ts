import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
