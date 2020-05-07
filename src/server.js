const ApolloServerExpress = require("apollo-server-express");
const GQLImport = require("graphql-import");
// const { resolvers, fragmentReplacements } = require( './resolvers/index')
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
// const User = require("./resolvers/User");
// import prisma from "./prisma";

// const pubsub = new ApolloServerExpress.PubSub()

const resolvers = {
  Query: {
    info: () => `This is the API of a Gobelin DMII group project `,
    ...Query,
  },
  Mutation: {
    ...Mutation,
  },
  // User,
};

module.exports = new ApolloServerExpress.ApolloServer({
  typeDefs: GQLImport.importSchema("./src/schema.graphql"),
  resolvers,
  context(request) {
    return { ...request };
  },
  // fragmentReplacements,
  // debug: true,
});
