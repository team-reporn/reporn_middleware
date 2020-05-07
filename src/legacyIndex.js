const { GraphQLServer } = require("graphql-yoga");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");

const socketio = require("socket.io");

// 1
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const url = "http://localhost:8080/api/";
let idCount = 0;
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
// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request) => {
    return {
      ...request,
    };
  },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

const websocket = socketio(server);

websocket.on("channel1", (data) => {
  console.log("Greetings from RN app", data);
});

websocket.emit("channel2", "new channel");
websocket.on("channel2", (obj) => {
  console.log("Object from RN app", obj);
});
