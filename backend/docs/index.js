import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple Express Blog API",
    },
    servers: [{ url: process.env.SERVER_URL + "/api/v1" }],
    components: {
      securitySchemes: {
        token: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
  apis: ["./docs/*.js"],
};

export default swaggerJsDoc(options);
