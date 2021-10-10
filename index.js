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

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const connectDB = require("./model");

async function startServer() {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
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

      // console.log(`context | headers: ${JSON.stringify(req.headers)}`)
      // console.log(`context | countryCode: ${JSON.stringify(req.headers.countrycode)}`)
      // console.log(`context | countryCode: ${JSON.stringify(req.headers.authorization)}`)

      return {
        countryCode: req.headers.countrycode,
        user: undefined
      }
    }
  });
  await server.start();

  const app = express();
  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),);

  server.applyMiddleware({ app });

  await new Promise(r => app.listen({ port: 4000 }, r));
  console.log(`🚀 ${process.env.NODE_ENV} Server ready at http://localhost:4000${server.graphqlPath}`);

  connectDB();
}

startServer();