const express = require('express');
const bodyParser = require("body-parser");
const { ApolloServer } = require('apollo-server-express');
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const connectDB = require("./model");

async function startServer() {

  connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
  });
  await server.start();

  const app = express();
  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),);

  server.applyMiddleware({ app });

  console.log(`==============================Secret Information==============================`)
  console.log(`IMAGE_BUCKET_ACCESS_KEY=${process.env.IMAGE_BUCKET_ACCESS_KEY}`)
  console.log(`IMAGE_BUCKET_SECRET_KEY=${process.env.IMAGE_BUCKET_SECRET_KEY}`)
  console.log(`==============================================================================`)

  await new Promise(r => app.listen({ port: 4000 }, r));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();