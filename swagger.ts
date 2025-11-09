import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Pharma Guide API",
    description: "Documentación generada automáticamente con swagger-autogen",
  },
  host: "localhost:3001",
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Auth",
      description: "Endpoints de autenticación",
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = [
  "./src/modules/access/router/access.router.ts",
  "./src/modules/user/router/user.router.ts",
  "./src/modules/study-plan/router/studyPlan.router.ts",
  "./src/modules/status/router/status.router.ts",
  "./src/modules/role/router/role.router.ts",
];
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
