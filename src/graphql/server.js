const express = require('express');
const graphqlApp = require('./app');
const app = express();
app.use('/', graphqlApp);
const PORT = process.env.PORT || 4010;
app.listen(PORT, () => console.log(`GraphQL server running on port ${PORT}`));
