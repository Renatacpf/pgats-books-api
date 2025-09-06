const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./auth');
const express = require('express');

const graphqlApp = express.Router();
let apolloStarted = false;
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    const user = getUserFromToken(token);
    return { user };
  },
});

const apolloInit = server.start().then(() => {
  server.applyMiddleware({ app: graphqlApp, path: '/' });
  apolloStarted = true;
});

// Middleware para aguardar Apollo pronto antes de aceitar requisições
graphqlApp.use(async (req, res, next) => {
  if (!apolloStarted) await apolloInit;
  next();
});

module.exports = graphqlApp;
