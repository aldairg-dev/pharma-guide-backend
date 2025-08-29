import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import app from "./app";
import swaggerDocument from "./../swagger.json";
dotenv.config();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente desde cualquier origen" });
});

app.post("/webhooks/github", (req, res) => {
  console.log("Evento de GitHub recibido:", req.body);
  res.status(200).send("OK");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  const host = process.env.HOST || "localhost";
  if (process.env.NODE_ENV === "production") {
    console.log(`Servidor corriendo en https://${host}:${PORT}`);
  } else {
    console.log(`Servidor corriendo en http://${host}:${PORT}`);
  }
});
