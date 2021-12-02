const express = require('express');
const {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');

const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');

const schema = require('./graphql/schema')
const connectDB = require("./model");

async function startServer() {

  const server = new ApolloServer({
    schema: schema,
    playground: true,
    introspection: true,
    context: ({ req }) => {
      // if (!req.headers.authorization) {
      //   throw new AuthenticationError("mssing token");
      // }

      // const token = req.headers.authorization.substr(7);
      // const user = users.find((user) => user.token === token);

      // if (!user) {
      //   throw new AuthenticationError("invalid token");
      // }

      console.log(`context | countryCode: ${JSON.stringify(req.headers.countrycode)}`)
      console.log(`context | Bearer: ${JSON.stringify(req.headers.Bearer)}`)
      console.log(`context | headers: ${JSON.stringify(req.headers)}`)

      return {
        languageCode: req.headers.langagecode ? req.headers.langagecode : 'ko',
        user: undefined
      }
    }
  });
  await server.start();

  const app = express();
  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),);
  app.use('/healthcheck', require('express-healthcheck')())

  server.applyMiddleware({ app });

  await new Promise(r => app.listen({ port: 4000 }, r));
  console.log(`🚀 ${process.env.NODE_ENV} Server ready at http://localhost:4000${server.graphqlPath}`);

  connectDB();
}

startServer();