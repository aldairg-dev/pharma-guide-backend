// app.js

const express = require("express");
const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de PharmaGuide 🎓💊");
});

module.exports = app;
