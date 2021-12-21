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

const {
  initializeApp,
  auth
} = require('firebase-admin/app');

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/firebase-admin/firebase-admin.env' })

async function startServer() {

  initializeApp();

  const server = new ApolloServer({
    schema: schema,
    playground: true,
    introspection: true,
    context: ({ req }) => {

      console.log(`req.headers=${JSON.stringify(req.headers)}`)

      // if (!req.headers.authorization) {
      //   throw new AuthenticationError("mssing token");
      // }

      let decodedToken = admin.auth().verifyIdToken(req.headers.idtoken)

      const uid = decodedToken.uid;

      console.log(`uid=${uid}`)

      return {
        uid: uid ? uid : 'a4H7anucnXWGBV4QR7FEf7iZYXv2',
        idToken: idToken,
        languageCode: req.headers.langagecode ? req.headers.langagecode : 'ko',
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