require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const routes = require('./src/routes');
const { authMiddleware } = require('./src/middleware/auth');
const graphqlServer = require('./src/graphql/app');
const swaggerSpec = require('./src/docs/swagger');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/graphql', graphqlServer);
app.use(authMiddleware);
app.use('/', routes);

module.exports = app;
