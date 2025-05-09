import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import app from "./app";
import swaggerDocument from "./../swagger.json";
dotenv.config();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente desde cualquier origen" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
