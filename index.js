const { ApolloServer } = require('apollo-server');

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const dbConnect = require("./model");
dbConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
