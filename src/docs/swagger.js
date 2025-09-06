const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catálogo de Livros API',
      version: '1.0.0',
      description: 'API REST para catálogo de livros com autenticação JWT',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/docs/swagger.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
