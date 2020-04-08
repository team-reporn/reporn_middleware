const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");
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
    // 2
    users: () =>
      fetch(url + "users")
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          return res;
        }),
  },
  Mutation: {
    // 2
    post: (parent, args) => {
      const body = `{
      	"email": "${args.email}",
      	"login": "${args.login}",
      	"password": "${args.password}"
      }`;
      return fetch(url + "users", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          return res;
        });
    },
  },
};
// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:400`));
