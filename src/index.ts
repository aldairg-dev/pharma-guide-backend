// index.ts
const application = require("./app");
const PORT = process.env.PORT || 3000;

application.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
