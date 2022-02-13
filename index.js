const express = require('express');
const {
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');

const { ApolloServerPluginCacheControl } = require('apollo-server-core')

const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');

const schema = require('./graphql/schema')
const connectDB = require("./model");

const {
  initializeApp
} = require('firebase-admin/app');

const {
  getAuth
} = require('firebase-admin/auth');

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/firebase-admin/firebase-admin.env' })

async function startServer() {

  const firebaseApp = initializeApp()
  const firebaseAuth = getAuth(firebaseApp)

  const server = new ApolloServer({
    schema: schema,
    playground: true,
    introspection: true,
    context: async ({ req }) => {

      // if (!req.headers.authorization) {
      //   throw new AuthenticationError("mssing token");
      // }
      let uid = null

      if (req.headers.idtoken) {
        // console.log(`index | context: req.headers.idtoken=${req.headers.idtoken}`)
        try {
          let decodedToken = await firebaseAuth.verifyIdToken(req.headers.idtoken)
          uid = decodedToken.uid;
          // console.log(`index | context: decode success, uid=${uid}`)

        } catch (err) {
          console.log(`err!! + ${err}`)
          throw new AuthenticationError(err);
        }
      }

      return {
        uid: uid ? uid : 'vNGp2P5dvGSMXFLMeWMizMqBNtQ2',
        idToken: req.headers.idtoken,
        languageCode: req.headers.langagecode ? req.headers.langagecode : 'ko',
      }
    },
    plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 60 })],  //60 seconds
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