import path from "path";
import swaggerAutogen from "swagger-autogen";

const outputFile = path.join(__dirname, "swagger.json");

const endpointsFiles = [path.join(__dirname, "app.ts")];
swaggerAutogen()(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated!");
  require("./index");
});
